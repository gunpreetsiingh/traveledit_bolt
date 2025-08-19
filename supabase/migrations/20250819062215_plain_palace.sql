/*
  # Enhance trip_elements table for travel advisor platform

  1. Table Modifications
    - Add business-relevant fields to `trip_elements` table
    - Create `trip_element_reviews` table for user reviews

  2. New Fields for trip_elements
    - `price_indicator` (text) - Flexible pricing information
    - `highlights` (jsonb) - Key features and inclusions
    - `best_time_to_visit` (text) - Optimal timing recommendations
    - `contact_info` (jsonb) - Phone, website, email, address, coordinates
    - `faqs` (jsonb) - Frequently asked questions
    - `additional_resources` (jsonb) - External links and resources
    - `visibility` (text) - Access control (global, advisor_only, client_only)

  3. New Table: trip_element_reviews
    - User reviews and ratings for trip elements
    - Linked to trip_elements and auth.users

  4. Security
    - Enable RLS on trip_element_reviews
    - Add policies for reading, creating, updating, and deleting reviews
    - Add policies for trip_elements visibility control
*/

-- Add new columns to trip_elements table
ALTER TABLE public.trip_elements 
ADD COLUMN IF NOT EXISTS price_indicator TEXT,
ADD COLUMN IF NOT EXISTS highlights JSONB,
ADD COLUMN IF NOT EXISTS best_time_to_visit TEXT,
ADD COLUMN IF NOT EXISTS contact_info JSONB,
ADD COLUMN IF NOT EXISTS faqs JSONB,
ADD COLUMN IF NOT EXISTS additional_resources JSONB,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'global';

-- Create trip_element_reviews table
CREATE TABLE IF NOT EXISTS public.trip_element_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_element_id UUID NOT NULL REFERENCES public.trip_elements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on trip_element_reviews
ALTER TABLE public.trip_element_reviews ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger for reviews
CREATE OR REPLACE FUNCTION update_trip_element_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_trip_element_reviews_updated_at'
  ) THEN
    CREATE TRIGGER update_trip_element_reviews_updated_at
      BEFORE UPDATE ON public.trip_element_reviews
      FOR EACH ROW
      EXECUTE FUNCTION update_trip_element_reviews_updated_at();
  END IF;
END $$;

-- RLS Policies for trip_element_reviews

-- Policy for users to read all reviews
CREATE POLICY "Users can read all trip element reviews"
  ON public.trip_element_reviews
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to create their own reviews
CREATE POLICY "Authenticated users can create their own reviews"
  ON public.trip_element_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own reviews
CREATE POLICY "Authenticated users can update their own reviews"
  ON public.trip_element_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for authenticated users to delete their own reviews
CREATE POLICY "Authenticated users can delete their own reviews"
  ON public.trip_element_reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enhanced RLS Policies for trip_elements based on visibility

-- Policy for global visibility
CREATE POLICY "Allow public read access to global trip elements"
  ON public.trip_elements
  FOR SELECT
  TO public
  USING (visibility = 'global' OR visibility IS NULL);

-- Policy for advisor-only visibility
CREATE POLICY "Allow advisors to read advisor-only trip elements"
  ON public.trip_elements
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'advisor_only' AND 
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('advisor', 'admin')
    )
  );

-- Policy for client-only visibility
CREATE POLICY "Allow clients to read client-only trip elements"
  ON public.trip_elements
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'client_only' AND 
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'traveler'
    )
  );

-- Policy for creators to manage their own trip elements
CREATE POLICY "Allow creators to manage their own trip elements"
  ON public.trip_elements
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Policy for admins to manage all trip elements
CREATE POLICY "Allow admins to manage all trip elements"
  ON public.trip_elements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trip_element_reviews_trip_element_id 
  ON public.trip_element_reviews(trip_element_id);

CREATE INDEX IF NOT EXISTS idx_trip_element_reviews_user_id 
  ON public.trip_element_reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_trip_elements_visibility 
  ON public.trip_elements(visibility);

CREATE INDEX IF NOT EXISTS idx_trip_elements_created_by 
  ON public.trip_elements(created_by);

-- Add comments for documentation
COMMENT ON COLUMN public.trip_elements.price_indicator IS 'Flexible pricing information (e.g., "From $1,200/night", "Mid-range", "Luxury")';
COMMENT ON COLUMN public.trip_elements.highlights IS 'JSON array of key features and inclusions';
COMMENT ON COLUMN public.trip_elements.best_time_to_visit IS 'Optimal timing recommendations for the experience';
COMMENT ON COLUMN public.trip_elements.contact_info IS 'JSON object containing phone, website, email, address, coordinates';
COMMENT ON COLUMN public.trip_elements.faqs IS 'JSON array of question-answer pairs';
COMMENT ON COLUMN public.trip_elements.additional_resources IS 'JSON array of external links and resources';
COMMENT ON COLUMN public.trip_elements.visibility IS 'Access control: global, advisor_only, client_only';

COMMENT ON TABLE public.trip_element_reviews IS 'User reviews and ratings for trip elements';
COMMENT ON COLUMN public.trip_element_reviews.rating IS 'Numerical rating from 0 to 5';