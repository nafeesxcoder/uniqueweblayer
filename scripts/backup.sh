#!/usr/bin/env bash
#
# Nightly backup for Unique Web Layer.
#
# Two things matter and neither can be rebuilt from the repository:
#   1. the MySQL database — every portfolio project and contact enquiry
#   2. ./uploads          — the project screenshots
#
# Usage:
#   ./scripts/backup.sh                 # writes into ./backups
#   BACKUP_DIR=/other/path ./scripts/backup.sh
#
# Cron (3:15am daily). Use an odd minute so it does not collide with every
# other job on a shared host:
#   15 3 * * * /home/USER/uniqueweblayer/scripts/backup.sh >> /home/USER/backup.log 2>&1
#
set -euo pipefail

# --- locate the app root regardless of where this is called from ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

# Next reads .env.local first, so prefer it and fall back to .env
ENV_FILE="$APP_DIR/.env.local"
[[ -f "$ENV_FILE" ]] || ENV_FILE="$APP_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: no .env.local or .env in $APP_DIR — cannot read the database credentials." >&2
  exit 1
fi

# --- read DB_* from .env without executing the file -------------------------
# `source` would run anything in there; this only pulls the keys we need.
get_env() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" "$ENV_FILE" | tail -n 1 || true)"
  line="${line#${key}=}"
  line="${line%\"}"; line="${line#\"}"      # strip surrounding double quotes
  line="${line%\'}"; line="${line#\'}"      # strip surrounding single quotes
  printf '%s' "$line"
}

DB_HOST="$(get_env DB_HOST)"; DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="$(get_env DB_PORT)"; DB_PORT="${DB_PORT:-3306}"
DB_USER="$(get_env DB_USER)"
DB_PASSWORD="$(get_env DB_PASSWORD)"
DB_NAME="$(get_env DB_NAME)"

if [[ -z "$DB_NAME" || -z "$DB_USER" ]]; then
  echo "ERROR: DB_USER or DB_NAME missing from $ENV_FILE" >&2
  exit 1
fi

BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
STAMP="$(date +%Y-%m-%d_%H%M)"

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"   # dumps contain customer enquiries — keep them private

# Sweep up empty files left by any previous failed run, so the folder never
# contains something that looks like a backup but is not.
find "$BACKUP_DIR" -maxdepth 1 -name '*.gz' -size -1k -delete 2>/dev/null || true

echo "[$(date '+%F %T')] Backup starting → $BACKUP_DIR"

# --- 1. database ------------------------------------------------------------
# The password goes in via a temporary defaults file rather than the command
# line, because anything on the command line is visible in `ps` to other users
# on the box — and this is shared hosting.
DEFAULTS_FILE="$(mktemp)"
chmod 600 "$DEFAULTS_FILE"
trap 'rm -f "$DEFAULTS_FILE"' EXIT

cat > "$DEFAULTS_FILE" <<EOF
[client]
host=$DB_HOST
port=$DB_PORT
user=$DB_USER
password=$DB_PASSWORD
EOF

SQL_FILE="$BACKUP_DIR/db_${DB_NAME}_${STAMP}.sql.gz"

# mysqldump must exist before we create any files, otherwise a failure leaves
# an empty .sql.gz sitting in the folder looking like a real backup.
if ! command -v mysqldump >/dev/null 2>&1; then
  echo "ERROR: mysqldump not found on PATH." >&2
  echo "  Linux/cPanel : it ships with the mysql client package" >&2
  echo "  Windows      : add C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin to PATH" >&2
  exit 1
fi

# The pipeline is wrapped in `if !` rather than left to `set -e`, because
# `set -e` aborts the script instantly on failure — before the validation
# below can run — and the half-written file survives. This way a failed dump
# is always deleted and always reported.
if ! mysqldump --defaults-extra-file="$DEFAULTS_FILE" \
  --single-transaction \
  --quick \
  --routines \
  --no-tablespaces \
  "$DB_NAME" | gzip -9 > "$SQL_FILE"; then
  echo "ERROR: mysqldump failed — check DB_USER / DB_PASSWORD / DB_NAME in .env" >&2
  rm -f "$SQL_FILE"
  exit 1
fi

# A dump can also "succeed" but produce nothing useful, so check it has weight.
SQL_SIZE="$(wc -c < "$SQL_FILE" | tr -d ' ')"
if [[ "$SQL_SIZE" -lt 1000 ]]; then
  echo "ERROR: dump is only ${SQL_SIZE} bytes — not trusting it." >&2
  rm -f "$SQL_FILE"
  exit 1
fi
echo "  ✓ database  → $(basename "$SQL_FILE") ($(( SQL_SIZE / 1024 )) KB)"

# --- 2. uploaded screenshots ------------------------------------------------
UPLOADS_DIR="$APP_DIR/uploads"
if [[ -d "$UPLOADS_DIR" ]]; then
  FILES_ARCHIVE="$BACKUP_DIR/uploads_${STAMP}.tar.gz"
  tar -czf "$FILES_ARCHIVE" -C "$APP_DIR" uploads
  echo "  ✓ uploads   → $(basename "$FILES_ARCHIVE")"
else
  echo "  · uploads directory not found, skipping"
fi

# --- 3. retention -----------------------------------------------------------
# Deleting old copies is part of backing up: a disk that fills stops the backup
# silently, and you find out only when you need to restore.
find "$BACKUP_DIR" -maxdepth 1 -name 'db_*.sql.gz' -mtime "+$RETENTION_DAYS" -delete
find "$BACKUP_DIR" -maxdepth 1 -name 'uploads_*.tar.gz' -mtime "+$RETENTION_DAYS" -delete

echo "[$(date '+%F %T')] Backup complete. Keeping $RETENTION_DAYS days."
echo
echo "To restore the database:"
echo "  gunzip -c $SQL_FILE | mysql -u $DB_USER -p $DB_NAME"
echo "To restore the screenshots:"
echo "  tar -xzf $BACKUP_DIR/uploads_${STAMP}.tar.gz -C $APP_DIR"
