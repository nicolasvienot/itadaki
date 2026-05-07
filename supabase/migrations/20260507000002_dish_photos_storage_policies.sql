-- Storage RLS for the `dish-photos` bucket.
-- Photos are uploaded under `<user_id>/<file>.jpg`, so policies use the first
-- folder segment of the object name to scope access to the owning user.

-- Public read (the bucket itself should also be marked Public in the dashboard
-- so getPublicUrl() returns a usable link).
DROP POLICY IF EXISTS "dish-photos public read" ON storage.objects;
CREATE POLICY "dish-photos public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'dish-photos');

-- Authenticated users may insert into their own folder.
DROP POLICY IF EXISTS "dish-photos insert own" ON storage.objects;
CREATE POLICY "dish-photos insert own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'dish-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Authenticated users may overwrite/update their own files (we use upsert: true
-- when re-saving a check-off photo).
DROP POLICY IF EXISTS "dish-photos update own" ON storage.objects;
CREATE POLICY "dish-photos update own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'dish-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'dish-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Authenticated users may delete their own files.
DROP POLICY IF EXISTS "dish-photos delete own" ON storage.objects;
CREATE POLICY "dish-photos delete own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'dish-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
