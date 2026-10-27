-- Where each enquiry came from.
--
-- The useful question is not "how many people visited" — it is "which page
-- brought work". That answer belongs next to the enquiry itself, not in a
-- third-party dashboard that ad blockers can switch off.
--
-- landing_page is the first page of the visit, not the contact page: someone
-- who lands on /services/restaurant and then clicks through to /contact was
-- brought in by the restaurant page, and that is what you want to know.

ALTER TABLE contact_messages
  ADD COLUMN landing_page VARCHAR(255) NULL DEFAULT NULL AFTER message,
  ADD COLUMN referrer     VARCHAR(400) NULL DEFAULT NULL AFTER landing_page,
  -- A short label worked out from the referrer when the enquiry is saved, so
  -- grouping is a plain GROUP BY instead of parsing URLs on every report.
  ADD COLUMN source       VARCHAR(40)  NULL DEFAULT NULL AFTER referrer,
  ADD KEY idx_contact_source (source)
;
