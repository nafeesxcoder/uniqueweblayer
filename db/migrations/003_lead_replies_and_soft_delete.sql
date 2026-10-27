-- Replying to an enquiry from the admin inbox, and a two-stage delete.
--
-- Soft delete (deleted_at) hides a lead from the normal list but keeps the row,
-- so a mistake is recoverable and the count of what was discarded stays honest.
-- Permanent delete is a separate, explicit action for real spam.

ALTER TABLE contact_messages
  ADD COLUMN deleted_at  TIMESTAMP NULL DEFAULT NULL AFTER status,
  ADD COLUMN replied_at  TIMESTAMP NULL DEFAULT NULL AFTER deleted_at,
  ADD COLUMN reply_count INT UNSIGNED NOT NULL DEFAULT 0 AFTER replied_at,
  ADD KEY idx_contact_deleted (deleted_at)

;

-- Every reply is kept, so you can see what was actually said months later
-- rather than guessing from your own sent folder.
CREATE TABLE IF NOT EXISTS contact_replies (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  message_id INT UNSIGNED NOT NULL,
  body       TEXT NOT NULL,
  -- 0 when SMTP refused it; the reply is still recorded so nothing is lost.
  email_sent TINYINT(1) NOT NULL DEFAULT 0,
  error      VARCHAR(400) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_replies_message (message_id, created_at),
  CONSTRAINT fk_replies_message
    FOREIGN KEY (message_id) REFERENCES contact_messages (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
