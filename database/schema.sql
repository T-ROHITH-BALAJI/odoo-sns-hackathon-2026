-- GlobeTrotter Database Schema
-- Supabase PostgreSQL Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table (handled by Supabase Auth, but we can extend it)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cities table (master data)
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location GEOGRAPHY(POINT),
  cost_index INTEGER DEFAULT 50,
  popularity_score INTEGER DEFAULT 0,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table (master data)
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  estimated_cost DECIMAL(10, 2),
  duration_minutes INTEGER,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10, 2),
  currency_code TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'Planning',
  is_public BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  destination_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trip stops table
CREATE TABLE IF NOT EXISTS public.trip_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  order_index INTEGER,
  notes TEXT,
  location GEOGRAPHY(POINT),
  arrival_time TIME,
  duration_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trip activities (junction table)
CREATE TABLE IF NOT EXISTS public.trip_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_stop_id UUID REFERENCES public.trip_stops(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  scheduled_time TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  date DATE,
  currency_code TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trip likes table (for community feature)
CREATE TABLE IF NOT EXISTS public.trip_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_is_public ON public.trips(is_public);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON public.trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_city_id ON public.trip_stops(city_id);
CREATE INDEX IF NOT EXISTS idx_activities_city_id ON public.activities(city_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON public.expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_likes_trip_id ON public.trip_likes(trip_id);

-- Create spatial index for location-based queries (if using PostGIS)
CREATE INDEX IF NOT EXISTS idx_cities_location ON public.cities USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_trip_stops_location ON public.trip_stops USING GIST(location);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trips
CREATE POLICY "Users can view their own trips"
  ON public.trips FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for trip_stops
CREATE POLICY "Users can view stops of accessible trips"
  ON public.trip_stops FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_stops.trip_id
      AND (trips.user_id = auth.uid() OR trips.is_public = true)
    )
  );

CREATE POLICY "Users can manage stops of their trips"
  ON public.trip_stops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_stops.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed data for cities
INSERT INTO public.cities (name, country, latitude, longitude, cost_index, description) VALUES
('Paris', 'France', 48.8566, 2.3522, 75, 'The City of Light'),
('Tokyo', 'Japan', 35.6762, 139.6503, 80, 'Modern metropolis'),
('New York', 'USA', 40.7128, -74.0060, 85, 'The Big Apple'),
('London', 'UK', 51.5074, -0.1278, 78, 'Historic capital'),
('Barcelona', 'Spain', 41.3851, 2.1734, 65, 'Mediterranean gem'),
('Bangkok', 'Thailand', 13.7563, 100.5018, 45, 'Vibrant city'),
('Dubai', 'UAE', 25.2048, 55.2708, 90, 'Luxury destination'),
('Rome', 'Italy', 41.9028, 12.4964, 70, 'Eternal City'),
('Sydney', 'Australia', -33.8688, 151.2093, 82, 'Harbor city'),
('Singapore', 'Singapore', 1.3521, 103.8198, 88, 'Garden city')
ON CONFLICT DO NOTHING;

-- Seed data for activities
INSERT INTO public.activities (name, category, estimated_cost, duration_minutes, city_id) 
SELECT 'Eiffel Tower Visit', 'Sightseeing', 25.00, 180, id FROM public.cities WHERE name = 'Paris' LIMIT 1;

INSERT INTO public.activities (name, category, estimated_cost, duration_minutes, city_id)
SELECT 'Louvre Museum', 'Culture', 17.00, 240, id FROM public.cities WHERE name = 'Paris' LIMIT 1;

INSERT INTO public.activities (name, category, estimated_cost, duration_minutes, city_id)
SELECT 'Tokyo Skytree', 'Sightseeing', 20.00, 120, id FROM public.cities WHERE name = 'Tokyo' LIMIT 1;

INSERT INTO public.activities (name, category, estimated_cost, duration_minutes, city_id)
SELECT 'Sushi Making Class', 'Food', 80.00, 180, id FROM public.cities WHERE name = 'Tokyo' LIMIT 1;

INSERT INTO public.activities (name, category, estimated_cost, duration_minutes, city_id)
SELECT 'Statue of Liberty Tour', 'Sightseeing', 23.50, 150, id FROM public.cities WHERE name = 'New York' LIMIT 1;

INSERT INTO public.activities (name, category, estimated_cost, duration_minutes, city_id)
SELECT 'Broadway Show', 'Entertainment', 150.00, 180, id FROM public.cities WHERE name = 'New York' LIMIT 1;

INSERT INTO public.activities (name, category, estimated_cost, duration_minutes, city_id)
SELECT 'Tower of London', 'Culture', 30.00, 180, id FROM public.cities WHERE name = 'London' LIMIT 1;

INSERT INTO public.activities (name, category, estimated_cost, duration_minutes, city_id)
SELECT 'Thames River Cruise', 'Sightseeing', 25.00, 90, id FROM public.cities WHERE name = 'London' LIMIT 1;

INSERT INTO public.activities (name, category, estimated_cost, duration_minutes, city_id)
SELECT 'Sagrada Familia', 'Culture', 26.00, 120, id FROM public.cities WHERE name = 'Barcelona' LIMIT 1;

INSERT INTO public.activities (name, category, estimated_cost, duration_minutes, city_id)
SELECT 'Beach Day', 'Leisure', 0.00, 240, id FROM public.cities WHERE name = 'Barcelona' LIMIT 1
ON CONFLICT DO NOTHING;
