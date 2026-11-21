-- Testimonials are now their own section with their own client logo, uploaded
-- from /admin/testimonials.
--
-- The rows below are suggested wording, so they start HIDDEN (is_published = 0)
-- with no person's name, star rating or result. Publish one from the admin
-- panel once that client has approved it.

ALTER TABLE testimonials
  ADD COLUMN logo VARCHAR(500) NULL DEFAULT NULL AFTER company;

INSERT INTO testimonials (author, quote, project_id, is_published, sort_order)
SELECT 'Timex Media', 'We wanted a site that felt as creative as the work we do, and Unique Web Layer got it right away. The animations are smooth, the pages are fast, and our brand finally looks the way it should online.', (SELECT id FROM projects WHERE slug = 'timex-media' LIMIT 1), 0, 1;

INSERT INTO testimonials (author, quote, project_id, is_published, sort_order)
SELECT 'Timex Solution Inc', 'Explaining a wide range of business services on one website is not easy. The team turned it into a clean, organised experience where every customer can quickly find exactly what they need.', (SELECT id FROM projects WHERE slug = 'timex-solution-inc' LIMIT 1), 0, 2;

INSERT INTO testimonials (author, quote, project_id, is_published, sort_order)
SELECT 'Cal Coast Logistics', 'Logistics never stands still, and neither did this team. They understood how our operation runs and built a platform that brings tracking, scheduling and fleet management into one clear view.', (SELECT id FROM projects WHERE slug = 'cal-coast-logistics' LIMIT 1), 0, 3;

INSERT INTO testimonials (author, quote, project_id, is_published, sort_order)
SELECT 'DTL Connect', 'Our idea was technical and hard to explain, but they picked it up quickly. They delivered a secure, polished platform that makes digital trade and document exchange feel simple.', (SELECT id FROM projects WHERE slug = 'dtl-connect' LIMIT 1), 0, 4;

INSERT INTO testimonials (author, quote, project_id, is_published, sort_order)
SELECT 'Aish Signs & Graphics', 'We work in visuals, so our website had to look sharp. From event decor to vehicle wraps, every service now gets the spotlight it deserves, and reaching us is effortless for customers.', (SELECT id FROM projects WHERE slug = 'aish-signs-graphics' LIMIT 1), 0, 5;

INSERT INTO testimonials (author, quote, project_id, is_published, sort_order)
SELECT 'All American Transport Inc', 'They took our day-to-day transport data and made it easy to read. The dashboard and load views give us a clear picture of the business without digging through spreadsheets.', (SELECT id FROM projects WHERE slug = 'all-american-transport-inc' LIMIT 1), 0, 6;

INSERT INTO testimonials (author, quote, project_id, is_published, sort_order)
SELECT 'A-1 Income Tax Services', 'Clients trust a tax firm that looks professional, and our new website does exactly that. It is clear, reassuring and makes it simple for people to get in touch with us.', (SELECT id FROM projects WHERE slug = 'a-1-income-tax-services' LIMIT 1), 0, 7;

INSERT INTO testimonials (author, quote, project_id, is_published, sort_order)
SELECT 'Lovepreet Chandi Real Estate', 'Buyers browse homes on their phones, and this site feels great there. The listings look beautiful, the transitions are smooth, and the whole experience reflects how I want to serve my clients.', (SELECT id FROM projects WHERE slug = 'lovepreet-chandi-real-estate' LIMIT 1), 0, 8;

INSERT INTO testimonials (author, quote, project_id, is_published, sort_order)
SELECT 'SMS Construction', 'They built our website the way we build projects: solid, well planned and finished properly. Our work and safety standards are front and center, and requesting a quote takes moments.', (SELECT id FROM projects WHERE slug = 'sms-construction' LIMIT 1), 0, 9;

INSERT INTO testimonials (author, quote, project_id, is_published, sort_order)
SELECT 'Spitfire', 'We are open around the clock, so our website has to be ready whenever a customer needs us. It is fast, straight to the point, and makes contacting us a no-brainer.', (SELECT id FROM projects WHERE slug = 'spitfire' LIMIT 1), 0, 10;
