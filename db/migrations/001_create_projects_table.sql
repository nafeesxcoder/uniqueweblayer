-- Portfolio projects shown on /portfolio.
-- Rows are added through the Add Project screen, so the site never needs a code change.

CREATE TABLE IF NOT EXISTS projects (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title         VARCHAR(180) NOT NULL,
  slug          VARCHAR(200) NOT NULL,
  category      VARCHAR(120) NOT NULL,
  service_type  VARCHAR(40)  NOT NULL DEFAULT 'web',
  description   TEXT         NOT NULL,
  image         VARCHAR(500) NOT NULL DEFAULT '',
  live_link     VARCHAR(500) NOT NULL DEFAULT '',
  color         VARCHAR(20)  NOT NULL DEFAULT '#8b5cf6',
  tags          JSON         NULL,
  client        VARCHAR(180) NULL,
  country       VARCHAR(120) NULL,
  result        VARCHAR(255) NULL,
  featured      TINYINT(1)   NOT NULL DEFAULT 0,
  is_published  TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order    INT          NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_projects_slug (slug),
  KEY idx_projects_type (service_type),
  KEY idx_projects_published (is_published),
  KEY idx_projects_featured (featured),
  KEY idx_projects_sort (sort_order, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
