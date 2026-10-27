-- Every contact-form submission is stored here as well as emailed,
-- so a mail failure never loses a lead.

CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(180) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  mobile      VARCHAR(40)  NOT NULL,
  service     VARCHAR(180) NOT NULL,
  budget      VARCHAR(80)  NULL,
  message     TEXT         NOT NULL,
  ip_address  VARCHAR(64)  NULL,
  user_agent  VARCHAR(400) NULL,
  email_sent  TINYINT(1)   NOT NULL DEFAULT 0,
  status      VARCHAR(30)  NOT NULL DEFAULT 'new',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_created (created_at),
  KEY idx_contact_status (status),
  KEY idx_contact_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
