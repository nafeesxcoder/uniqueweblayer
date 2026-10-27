-- The admin password used to live only in .env.local, which meant changing it
-- required editing a file on the server and restarting. This table holds it as
-- a scrypt hash so it can be changed from the admin settings page, and so a
-- forgotten password can be reset over email.
--
-- One row, always id = 1. The first login seeds it from ADMIN_PASSWORD in
-- .env.local, so nothing changes for you until you set a new password.

CREATE TABLE IF NOT EXISTS admin_account (
  id                  TINYINT UNSIGNED NOT NULL DEFAULT 1,
  email               VARCHAR(255) NOT NULL,
  password_hash       VARCHAR(255) NOT NULL,
  password_changed_at TIMESTAMP NULL DEFAULT NULL,
  last_login_at       TIMESTAMP NULL DEFAULT NULL,
  -- Only the SHA-256 of the reset token is stored. The token itself exists
  -- in the email and nowhere else, so a copy of this table cannot be used
  -- to reset the password.
  reset_token_hash    CHAR(64) NULL DEFAULT NULL,
  reset_expires_at    TIMESTAMP NULL DEFAULT NULL,
  reset_requested_at  TIMESTAMP NULL DEFAULT NULL,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
;
