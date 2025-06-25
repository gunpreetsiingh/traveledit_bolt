/*
  # Create app_settings table for global application settings

  1. New Tables
    - `app_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `app_settings` table
    - Add policy for public read access
    - Add policy for authenticated users to manage settings

  3. Initial Data
    - Insert default login backdrop URL using the uploaded image
*/

CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to app settings
CREATE POLICY "Allow public read access to app_settings"
  ON app_settings
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage app settings
CREATE POLICY "Allow authenticated users to manage app_settings"
  ON app_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_app_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_app_settings_updated_at
      BEFORE UPDATE ON app_settings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert the default login backdrop URL using the uploaded image
INSERT INTO app_settings (key, value) 
VALUES ('login_backdrop_url', '/55.jpg')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = now();