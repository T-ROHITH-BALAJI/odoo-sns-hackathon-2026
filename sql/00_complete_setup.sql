-- GlobeTrotter Travel Planning App - Complete Database Setup
-- Run this script in your Supabase SQL Editor
-- This creates all tables, sets up Row Level Security, and adds seed data

-- ============================================================================
-- STEP 1: Create Tables
-- ============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cities table
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    cost_index INTEGER DEFAULT 50 CHECK (cost_index >= 0 AND cost_index <= 100),
    popularity_score INTEGER DEFAULT 0 CHECK (popularity_score >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Trip Stops table
CREATE TABLE IF NOT EXISTS public.trip_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE RESTRICT,
    day_number INTEGER NOT NULL CHECK (day_number > 0),
    stop_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_stop_id UUID NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    activity_type TEXT CHECK (activity_type IN ('sightseeing', 'dining', 'shopping', 'entertainment', 'transportation', 'accommodation', 'other')),
    start_time TIME,
    end_time TIME,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    trip_stop_id UUID REFERENCES public.trip_stops(id) ON DELETE SET NULL,
    activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    category TEXT CHECK (category IN ('food', 'transport', 'accommodation', 'activities', 'shopping', 'other')),
    description TEXT,
    expense_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: Create Indexes for Performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON public.trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON public.trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_city_id ON public.trip_stops(city_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip_stop_id ON public.activities(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON public.expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_cities_country ON public.cities(country);

-- ============================================================================
-- STEP 3: Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: Create RLS Policies
-- ============================================================================

-- Users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Cities policies (public read access)
DROP POLICY IF EXISTS "Cities are viewable by everyone" ON public.cities;
CREATE POLICY "Cities are viewable by everyone"
    ON public.cities FOR SELECT
    TO authenticated
    USING (true);

-- Trips policies
DROP POLICY IF EXISTS "Users can view their own trips" ON public.trips;
CREATE POLICY "Users can view their own trips"
    ON public.trips FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own trips" ON public.trips;
CREATE POLICY "Users can create their own trips"
    ON public.trips FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own trips" ON public.trips;
CREATE POLICY "Users can update their own trips"
    ON public.trips FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own trips" ON public.trips;
CREATE POLICY "Users can delete their own trips"
    ON public.trips FOR DELETE
    USING (auth.uid() = user_id);

-- Trip Stops policies
DROP POLICY IF EXISTS "Users can view stops for their trips" ON public.trip_stops;
CREATE POLICY "Users can view stops for their trips"
    ON public.trip_stops FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.trips 
        WHERE trips.id = trip_stops.trip_id 
        AND trips.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can create stops for their trips" ON public.trip_stops;
CREATE POLICY "Users can create stops for their trips"
    ON public.trip_stops FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.trips 
        WHERE trips.id = trip_stops.trip_id 
        AND trips.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update stops for their trips" ON public.trip_stops;
CREATE POLICY "Users can update stops for their trips"
    ON public.trip_stops FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.trips 
        WHERE trips.id = trip_stops.trip_id 
        AND trips.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete stops for their trips" ON public.trip_stops;
CREATE POLICY "Users can delete stops for their trips"
    ON public.trip_stops FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.trips 
        WHERE trips.id = trip_stops.trip_id 
        AND trips.user_id = auth.uid()
    ));

-- Activities policies
DROP POLICY IF EXISTS "Users can view activities for their trip stops" ON public.activities;
CREATE POLICY "Users can view activities for their trip stops"
    ON public.activities FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.trip_stops
        JOIN public.trips ON trips.id = trip_stops.trip_id
        WHERE trip_stops.id = activities.trip_stop_id 
        AND trips.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can create activities for their trip stops" ON public.activities;
CREATE POLICY "Users can create activities for their trip stops"
    ON public.activities FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.trip_stops
        JOIN public.trips ON trips.id = trip_stops.trip_id
        WHERE trip_stops.id = activities.trip_stop_id 
        AND trips.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update activities for their trip stops" ON public.activities;
CREATE POLICY "Users can update activities for their trip stops"
    ON public.activities FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.trip_stops
        JOIN public.trips ON trips.id = trip_stops.trip_id
        WHERE trip_stops.id = activities.trip_stop_id 
        AND trips.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete activities for their trip stops" ON public.activities;
CREATE POLICY "Users can delete activities for their trip stops"
    ON public.activities FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.trip_stops
        JOIN public.trips ON trips.id = trip_stops.trip_id
        WHERE trip_stops.id = activities.trip_stop_id 
        AND trips.user_id = auth.uid()
    ));

-- Expenses policies
DROP POLICY IF EXISTS "Users can view expenses for their trips" ON public.expenses;
CREATE POLICY "Users can view expenses for their trips"
    ON public.expenses FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.trips 
        WHERE trips.id = expenses.trip_id 
        AND trips.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can create expenses for their trips" ON public.expenses;
CREATE POLICY "Users can create expenses for their trips"
    ON public.expenses FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.trips 
        WHERE trips.id = expenses.trip_id 
        AND trips.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update expenses for their trips" ON public.expenses;
CREATE POLICY "Users can update expenses for their trips"
    ON public.expenses FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.trips 
        WHERE trips.id = expenses.trip_id 
        AND trips.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete expenses for their trips" ON public.expenses;
CREATE POLICY "Users can delete expenses for their trips"
    ON public.expenses FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.trips 
        WHERE trips.id = expenses.trip_id 
        AND trips.user_id = auth.uid()
    ));

-- ============================================================================
-- STEP 5: Create Triggers for Updated_at Timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trips_updated_at ON public.trips;
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trip_stops_updated_at ON public.trip_stops;
CREATE TRIGGER update_trip_stops_updated_at BEFORE UPDATE ON public.trip_stops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_activities_updated_at ON public.activities;
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expenses_updated_at ON public.expenses;
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 6: Insert Seed Data - 30 Major Cities Worldwide
-- ============================================================================

INSERT INTO public.cities (name, country, latitude, longitude, cost_index, popularity_score) VALUES
('Paris', 'France', 48.8566, 2.3522, 85, 95),
('Rome', 'Italy', 41.9028, 12.4964, 75, 92),
('Barcelona', 'Spain', 41.3874, 2.1686, 70, 90),
('London', 'United Kingdom', 51.5074, -0.1278, 90, 94),
('Amsterdam', 'Netherlands', 52.3676, 4.9041, 80, 88),
('Berlin', 'Germany', 52.5200, 13.4050, 65, 85),
('Prague', 'Czech Republic', 50.0755, 14.4378, 55, 86),
('Vienna', 'Austria', 48.2082, 16.3738, 70, 87),
('Budapest', 'Hungary', 47.4979, 19.0402, 50, 84),
('Lisbon', 'Portugal', 38.7223, -9.1393, 60, 83),
('Madrid', 'Spain', 40.4168, -3.7038, 68, 85),
('Venice', 'Italy', 45.4408, 12.3155, 85, 89),
('Florence', 'Italy', 43.7696, 11.2558, 72, 87),
('Athens', 'Greece', 37.9838, 23.7275, 60, 82),
('Istanbul', 'Turkey', 41.0082, 28.9784, 45, 88),
('Dubai', 'United Arab Emirates', 25.2048, 55.2708, 88, 91),
('Tokyo', 'Japan', 35.6762, 139.6503, 92, 96),
('Kyoto', 'Japan', 35.0116, 135.7681, 80, 91),
('Seoul', 'South Korea', 37.5665, 126.9780, 75, 89),
('Bangkok', 'Thailand', 13.7563, 100.5018, 40, 90),
('Singapore', 'Singapore', 1.3521, 103.8198, 95, 93),
('Bali', 'Indonesia', -8.3405, 115.0920, 35, 92),
('New York', 'United States', 40.7128, -74.0060, 98, 97),
('Los Angeles', 'United States', 34.0522, -118.2437, 85, 91),
('San Francisco', 'United States', 37.7749, -122.4194, 95, 92),
('Sydney', 'Australia', -33.8688, 151.2093, 88, 93),
('Melbourne', 'Australia', -37.8136, 144.9631, 82, 89),
('Auckland', 'New Zealand', -36.8485, 174.7633, 78, 86),
('Cape Town', 'South Africa', -33.9249, 18.4241, 52, 88),
('Marrakech', 'Morocco', 31.6295, -7.9811, 42, 84)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 7: Create Helper Function for User Creation
-- ============================================================================

-- This function automatically creates a user profile when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to call function on new user
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify the setup:

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check cities were inserted
SELECT COUNT(*) as city_count FROM public.cities;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================================
-- Setup Complete!
-- ============================================================================
-- 
-- Next steps:
-- 1. Go to your frontend application
-- 2. Register a new account
-- 3. Start creating trips!
-- 
-- For troubleshooting:
-- - Check Supabase logs for any errors
-- - Verify your environment variables are set correctly
-- - Test authentication in Supabase dashboard
-- ============================================================================
