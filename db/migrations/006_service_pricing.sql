-- Prices used to be typed into three different files — data/services.ts, each
-- app/services/<slug>/page.tsx, and the home page section — and they had
-- drifted apart, so the same service showed a different price depending on
-- where you looked.
--
-- There is one list now: the defaults in data/services.ts. This table holds
-- only what you change from the admin panel, keyed by service slug. A row here
-- wins; no row means the default still applies, so "Reset" is just a DELETE.

CREATE TABLE IF NOT EXISTS service_pricing (
  slug       VARCHAR(80) NOT NULL,
  price      VARCHAR(40) NOT NULL,
  delivery   VARCHAR(80) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
;
