-- Editable site documents, starting with the project terms.
-- A row is written the first time the terms are saved from /admin/terms.
-- Until then the built-in defaults in app/data/projectTerms.ts are used.

CREATE TABLE IF NOT EXISTS site_documents (
  slug       VARCHAR(80) NOT NULL,
  content    MEDIUMTEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
;
