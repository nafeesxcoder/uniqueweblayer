-- Client quotes used to live in a hardcoded map inside the Testimonials
-- component, so adding one meant editing code and redeploying. They belong in
-- the database next to the projects they talk about.
--
-- `project_id` is optional. Set it and the quote shows with that project's
-- screenshot and link; leave it null and the quote stands on its own.
-- ON DELETE SET NULL, because deleting a project should never silently delete
-- something a client actually said.

CREATE TABLE IF NOT EXISTS testimonials (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  author       VARCHAR(120) NOT NULL,
  role         VARCHAR(160) NULL DEFAULT NULL,
  company      VARCHAR(160) NULL DEFAULT NULL,
  quote        TEXT NOT NULL,
  rating       TINYINT UNSIGNED NULL DEFAULT NULL,
  project_id   INT UNSIGNED NULL DEFAULT NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_testimonials_published (is_published, sort_order),
  KEY idx_testimonials_project (project_id),
  CONSTRAINT fk_testimonials_project FOREIGN KEY (project_id)
    REFERENCES projects (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
;
