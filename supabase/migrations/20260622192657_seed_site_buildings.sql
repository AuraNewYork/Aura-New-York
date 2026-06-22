
INSERT INTO site_buildings (name, slug, address, neighborhood, schedule_tour_url, application_url, latitude, longitude, year_built, amenities)
VALUES
  ('144 Waverly', '144-waverly', '144 Waverly Place, NY 10014', 'West Village', '', 'https://apply.weimark.com/rental/htfyvhhe', 40.7331266, -74.0008093, NULL, ''),
  ('17 Battery', '17-battery', '17 Battery Place, NY 10004', 'FiDi', 'https://calendly.com/ocean-auranewyork/30min', 'https://on-site.com/?login=true', 40.7051424, -74.0160109, NULL, ''),
  ('305 W 20', '305-w-20', '305 West 20th Street, NY 10011', 'Chelsea', '', 'https://apply.weimark.com/rental/htfyvhhe', 40.743752, -74.0002791, NULL, ''),
  ('7 Platt', '7-platt', '7 Platt Street, NY 10038', 'FiDi', 'https://calendly.com/7platt-auranewyork/30min', 'https://liveatarianyc.securecafe.com/onlineleasing/aria5/guestlogin.aspx', 40.7075419, -74.0063975, NULL, ''),
  ('Aria', 'aria', '90 John Street, NY 10038', 'FiDi', 'https://calendly.com/aria-auranewyork/tour', 'https://liveatarianyc.securecafe.com/onlineleasing/aria5/guestlogin.aspx', 40.7079924, -74.0063203, NULL, ''),
  ('Chai', 'chai', '243 West 54th Street, NY 10019', 'Midtown', '', '', 40.7645366, -73.9833266, NULL, ''),
  ('Marc', 'marc', '260 West 54th Street, NY 10019', 'Midtown', 'https://calendly.com/marc-auranewyork/tour', 'https://www.on-site.com', 40.7644979, -73.9840217, NULL, ''),
  ('Ocean', 'ocean', '1 West Street, NY 10004', 'FiDi', 'https://calendly.com/ocean-auranewyork/30min', 'https://liveatonewestnyc.securecafe.com/onlineleasing/1-west/guestlogin.aspx', 40.7055977, -74.0161541, NULL, ''),
  ('Sky', 'sky', '605 West 42nd Street, NY 10036', 'Midtown West', 'https://www.liveatsky.com/scheduletour', 'https://liveatsky.securecafe.com/onlineleasing/sky/guestlogin.aspx', 40.7615501, -73.9986345, 2016, 'Bike room, Concierge, Doorman, Elevator, Laundry in building, Live-in super, Package room, Parking, Storage space, Valet service, Children''s playroom, Gym, Hot tub, Media room, Swimming pool, Deck, Garden, Patio, Roof Deck')
ON CONFLICT (name) DO NOTHING;
