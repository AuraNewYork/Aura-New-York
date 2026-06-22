
CREATE TABLE IF NOT EXISTS site_buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE,
  address text DEFAULT '',
  neighborhood text DEFAULT '',
  about_paragraph text DEFAULT '',
  schedule_tour_url text DEFAULT '',
  application_url text DEFAULT '',
  latitude numeric,
  longitude numeric,
  year_built int,
  amenities text DEFAULT '',
  hero_image_url text DEFAULT '',
  studio_description text DEFAULT '',
  one_bed_description text DEFAULT '',
  two_bed_description text DEFAULT '',
  three_bed_description text DEFAULT '',
  display_order int DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_site_buildings" ON site_buildings
  FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS site_unit_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building text NOT NULL,
  unit text NOT NULL,
  photo_url text NOT NULL,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_unit_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_site_unit_photos" ON site_unit_photos
  FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS site_building_amenity_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building text NOT NULL,
  photo_url text NOT NULL,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_building_amenity_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_site_building_amenity_photos" ON site_building_amenity_photos
  FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS site_stock_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid REFERENCES site_buildings(id) ON DELETE CASCADE,
  bedrooms int NOT NULL,
  url text NOT NULL,
  position int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_stock_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_site_stock_photos" ON site_stock_photos
  FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_site_settings" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);
