/*
  # Create Wishlist System

  1. New Tables
    - `wishlists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text, wishlist name)
      - `city` (text, city name)
      - `country` (text, country name)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `wishlist_items`
      - `id` (uuid, primary key)
      - `wishlist_id` (uuid, foreign key to wishlists)
      - `trip_element_id` (uuid, foreign key to trip_elements)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own wishlists
    - Add policies for users to manage their own wishlist items

  3. Indexes
    - Add indexes for performance optimization
*/

-- Create wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, city, country)
);

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  trip_element_id UUID NOT NULL REFERENCES public.trip_elements(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wishlist_id, trip_element_id)
);

-- Enable RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_country_city ON public.wishlists(country, city);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON public.wishlist_items(wishlist_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_trip_element_id ON public.wishlist_items(trip_element_id);

-- RLS Policies for wishlists
CREATE POLICY "Users can read their own wishlists"
  ON public.wishlists
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wishlists"
  ON public.wishlists
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlists"
  ON public.wishlists
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlists"
  ON public.wishlists
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for wishlist_items
CREATE POLICY "Users can read their own wishlist items"
  ON public.wishlist_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists 
      WHERE wishlists.id = wishlist_items.wishlist_id 
      AND wishlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own wishlist items"
  ON public.wishlist_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wishlists 
      WHERE wishlists.id = wishlist_items.wishlist_id 
      AND wishlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own wishlist items"
  ON public.wishlist_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists 
      WHERE wishlists.id = wishlist_items.wishlist_id 
      AND wishlists.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_wishlists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_wishlists_updated_at
  BEFORE UPDATE ON public.wishlists
  FOR EACH ROW
  EXECUTE FUNCTION update_wishlists_updated_at();