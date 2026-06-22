
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-photos', 'site-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_site_photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-photos');
