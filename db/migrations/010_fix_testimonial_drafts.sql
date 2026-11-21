-- Migration 009 wrote its drafts from db/seeds/projects.json, which is out of
-- date: the live portfolio has different clients and different scopes. This
-- rewrites those drafts to match the real projects.
--
-- Each UPDATE matches the untouched draft only (same author, same opening
-- words, still hidden), so anything edited or published by hand is left alone.
-- The old "Jane doe" placeholder is hidden rather than deleted.

UPDATE testimonials
   SET is_published = 0
 WHERE author = 'Jane doe' AND quote LIKE 'The website provides a professional online presence%';

UPDATE testimonials
   SET quote = 'Property marketing lives and dies on visuals, and this website lets our photography and video do the talking. It looks bold, feels premium, and makes it easy for clients to see our work and book a shoot.',
       project_id = (SELECT id FROM projects WHERE slug = 'timex-media' LIMIT 1)
 WHERE author = 'Timex Media' AND is_published = 0 AND quote LIKE 'We wanted a site that felt as creative%';

UPDATE testimonials
   SET author = 'Timex Solution Inc.',
       quote = 'As a digital agency, our own website is our first impression. The result is sleek and confident, and it presents web, mobile, marketing and AI automation in a way any business can understand at a glance.',
       project_id = (SELECT id FROM projects WHERE slug = 'timex-solution-inc' LIMIT 1)
 WHERE author = 'Timex Solution Inc' AND is_published = 0 AND quote LIKE 'Explaining a wide range%';

UPDATE testimonials
   SET quote = 'They understood what a freight customer actually looks for. Our truckload, general freight and fresh produce services are now clear and professional, and getting in touch with our team takes no effort at all.',
       project_id = (SELECT id FROM projects WHERE slug = 'cal-coast-logistics' LIMIT 1)
 WHERE author = 'Cal Coast Logistics' AND is_published = 0 AND quote LIKE 'Logistics never stands still%';

UPDATE testimonials
   SET author = 'DTL Transport',
       quote = 'Our website has to speak to shippers, drivers and new recruits all at once, and it does. Freight services, parking reservations and driver applications each have a clear place, and the whole site looks strong.',
       project_id = (SELECT id FROM projects WHERE slug = 'dtl-transport' LIMIT 1)
 WHERE author = 'DTL Connect' AND is_published = 0 AND quote LIKE 'Our idea was technical%';

UPDATE testimonials
   SET quote = 'We are in the business of getting noticed, so our website had to stand out too. Billboards, truck decals, vehicle graphics and custom signage all look fantastic, and customers know exactly how to reach us.',
       project_id = (SELECT id FROM projects WHERE slug = 'aish-signs-graphics' LIMIT 1)
 WHERE author = 'Aish Signs & Graphics' AND is_published = 0 AND quote LIKE 'We work in visuals%';

UPDATE testimonials
   SET author = 'All American Transport Inc.',
       quote = 'The freight quote experience is the star of this website. Customers pick their freight type, load and distance, then send a request in moments. It is simple, professional and built around how shippers really work.',
       project_id = (SELECT id FROM projects WHERE slug = 'all-american-transport-inc' LIMIT 1)
 WHERE author = 'All American Transport Inc' AND is_published = 0 AND quote LIKE 'They took our day-to-day%';

UPDATE testimonials
   SET author = 'A-1 Tax & Business Services',
       quote = 'We offer tax, immigration, business and trucking services, which could easily have felt overwhelming online. They brought everything together beautifully, and booking an appointment with us is now just a click away.',
       project_id = (SELECT id FROM projects WHERE slug = 'a-1-tax-business-services' LIMIT 1)
 WHERE author = 'A-1 Income Tax Services' AND is_published = 0 AND quote LIKE 'Clients trust a tax firm%';

UPDATE testimonials
   SET quote = 'Whether someone wants to buy, sell or rent in Fresno, this website gets them started right away. It is clean, modern and puts the properties first, which is exactly how I wanted to present my business.',
       project_id = (SELECT id FROM projects WHERE slug = 'lovepreet-chandi-real-estate' LIMIT 1)
 WHERE author = 'Lovepreet Chandi Real Estate' AND is_published = 0 AND quote LIKE 'Buyers browse homes%';

UPDATE testimonials
   SET author = 'DestinyOne',
       quote = 'Dating is personal, so the platform had to feel elegant, private and sincere. They captured that perfectly and built an experience that helps South Asian singles look for meaningful connections with confidence.',
       project_id = (SELECT id FROM projects WHERE slug = 'destinyone' LIMIT 1)
 WHERE author = 'SMS Construction' AND is_published = 0 AND quote LIKE 'They built our website the way%';

UPDATE testimonials
   SET author = 'myGallaBook',
       quote = 'Small business owners need billing that just works. The team made GST billing, inventory, credit tracking and reports feel simple, on a phone or a computer, so everyday work takes far less effort.',
       project_id = (SELECT id FROM projects WHERE slug = 'mygallabook' LIMIT 1)
 WHERE author = 'Spitfire' AND is_published = 0 AND quote LIKE 'We are open around the clock%';
