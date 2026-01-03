-- Phase 1: Database Schema - Multi-city trip planner with day-wise stops, activities, and expenses

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, country)
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Trip stops table (day-wise stops)
CREATE TABLE IF NOT EXISTS trip_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    day_number INTEGER NOT NULL,
    stop_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT positive_day_number CHECK (day_number > 0),
    UNIQUE(trip_id, day_number)
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_stop_id UUID NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    activity_type TEXT CHECK (activity_type IN ('sightseeing', 'dining', 'shopping', 'entertainment', 'transportation', 'accommodation', 'other')),
    start_time TIME,
    end_time TIME,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    trip_stop_id UUID REFERENCES trip_stops(id) ON DELETE SET NULL,
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    category TEXT CHECK (category IN ('food', 'transport', 'accommodation', 'activities', 'shopping', 'other')),
    description TEXT,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT positive_amount CHECK (amount >= 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_city_id ON trip_stops(city_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip_stop_id ON activities(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_stop_id ON expenses(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_expenses_activity_id ON expenses(activity_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);

-- Sample data for testing
INSERT INTO users (id, email, full_name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'alice@example.com', 'Alice Smith'),
    ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'Bob Johnson')
ON CONFLICT (email) DO NOTHING;

INSERT INTO cities (name, country, latitude, longitude) VALUES
    ('Paris', 'France', 48.8566, 2.3522),
    ('Rome', 'Italy', 41.9028, 12.4964),
    ('Barcelona', 'Spain', 41.3851, 2.1734),
    ('London', 'United Kingdom', 51.5074, -0.1278),
    ('Amsterdam', 'Netherlands', 52.3676, 4.9041),
    ('Berlin', 'Germany', 52.5200, 13.4050),
    ('Prague', 'Czech Republic', 50.0755, 14.4378),
    ('Vienna', 'Austria', 48.2082, 16.3738)
ON CONFLICT (name, country) DO NOTHING;

-- Sample trip (skip if already exists)
INSERT INTO trips (id, user_id, title, description, start_date, end_date) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'European Adventure', 'A wonderful trip across Europe', '2026-06-01', '2026-06-10')
ON CONFLICT (id) DO NOTHING;

-- Sample trip stop (only if trip exists and stop doesn't)
INSERT INTO trip_stops (trip_id, city_id, day_number, stop_date, notes)
SELECT 
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    c.id,
    1,
    '2026-06-01',
    'First day in Paris'
FROM cities c 
WHERE c.name = 'Paris' AND c.country = 'France'
AND NOT EXISTS (
    SELECT 1 FROM trip_stops 
    WHERE trip_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' 
    AND day_number = 1
);

-- Sample activity (only if trip stop exists and activity doesn't)
INSERT INTO activities (trip_stop_id, title, description, activity_type, start_time, end_time, location)
SELECT 
    ts.id,
    'Visit Eiffel Tower',
    'Iconic landmark visit',
    'sightseeing',
    '10:00',
    '14:00',
    'Eiffel Tower'
FROM trip_stops ts 
WHERE ts.trip_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' 
AND ts.day_number = 1
AND NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE trip_stop_id = ts.id 
    AND title = 'Visit Eiffel Tower'
);

-- Sample expense (skip if already exists)
INSERT INTO expenses (trip_id, amount, currency, category, description, expense_date)
SELECT 
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    25.50,
    'EUR',
    'food',
    'Lunch at local cafe',
    '2026-06-01'
WHERE NOT EXISTS (
    SELECT 1 FROM expenses 
    WHERE trip_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    AND description = 'Lunch at local cafe'
);

-- Example queries (uncomment to test)
-- Query 1: Which activities belong to which city?
-- SELECT 
--     c.name as city_name,
--     a.title as activity_title,
--     a.activity_type
-- FROM activities a
-- JOIN trip_stops ts ON a.trip_stop_id = ts.id
-- JOIN cities c ON ts.city_id = c.id;

-- Query 2: "What stops are in this trip?"
-- SELECT 
--     ts.day_number,
--     ts.stop_date,
--     c.name as city_name,
--     ts.notes
-- FROM trip_stops ts
-- JOIN cities c ON ts.city_id = c.id
-- WHERE ts.trip_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
-- ORDER BY ts.day_number;

-- Query 3: "What expenses happened on Day 3?"
-- SELECT 
--     e.amount,
--     e.currency,
--     e.category,
--     e.description,
--     e.expense_date
-- FROM expenses e
-- JOIN trip_stops ts ON e.trip_stop_id = ts.id
-- WHERE ts.day_number = 3;
