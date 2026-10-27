-- Your own files — contracts, invoices, scopes, whatever you want to keep with
-- the site rather than hunt for on a laptop.
--
-- Only the metadata lives here. The file itself goes to storage/documents/,
-- which is outside the folder that serves project screenshots, so nothing here
-- is reachable by guessing a URL: every download goes through an API route
-- that checks the admin session first.

CREATE TABLE IF NOT EXISTS documents (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title         VARCHAR(200) NOT NULL,
  -- The name as it was on your machine; used again when you download it.
  original_name VARCHAR(255) NOT NULL,
  -- The random name on disk. Never derived from the original, so a crafted
  -- filename cannot escape the folder or overwrite another document.
  stored_name   VARCHAR(120) NOT NULL,
  mime_type     VARCHAR(120) NOT NULL,
  size_bytes    BIGINT UNSIGNED NOT NULL,
  note          VARCHAR(500) NULL DEFAULT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_documents_stored (stored_name),
  KEY idx_documents_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
;
