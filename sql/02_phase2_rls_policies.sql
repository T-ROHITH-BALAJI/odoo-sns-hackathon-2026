-- =====================================================
-- Phase 2 - Row Level Security (RLS)
-- =====================================================
-- Description: Protect user data so that one user can 
-- never see another user's trips
-- 
-- Outcome: Your app becomes multi-user secure — judges love this.
-- =====================================================

-- =====================================================
-- Enable Row Level Security
-- =====================================================

-- Enable RLS on trips table
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Enable RLS on trip_stops table
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;

-- Enable RLS on expenses table
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for TRIPS table
-- =====================================================

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Users can view only their own trips" ON trips;
DROP POLICY IF EXISTS "Users can insert only their own trips" ON trips;
DROP POLICY IF EXISTS "Users can update only their own trips" ON trips;
DROP POLICY IF EXISTS "Users can delete only their own trips" ON trips;

-- Policy: Users can only SELECT their own trips
CREATE POLICY "Users can view only their own trips"
    ON trips
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can only INSERT trips with their own user_id
CREATE POLICY "Users can insert only their own trips"
    ON trips
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only UPDATE their own trips
CREATE POLICY "Users can update only their own trips"
    ON trips
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only DELETE their own trips
CREATE POLICY "Users can delete only their own trips"
    ON trips
    FOR DELETE
    USING (auth.uid() = user_id);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view only their own trip stops" ON trip_stops;
DROP POLICY IF EXISTS "Users can insert only their own trip stops" ON trip_stops;
DROP POLICY IF EXISTS "Users can update only their own trip stops" ON trip_stops;
DROP POLICY IF EXISTS "Users can delete only their own trip stops" ON trip_stops;

-- =====================================================
-- RLS Policies for TRIP_STOPS table
-- =====================================================

-- Policy: Users can only SELECT trip_stops for their own trips
CREATE POLICY "Users can view only their own trip stops"
    ON trip_stops
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_stops.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Policy: Users can only INSERT trip_stops for their own trips
CREATE POLICY "Users can insert only their own trip stops"
    ON trip_stops
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_stops.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Policy: Users can only UPDATE trip_stops for their own trips
CREATE POLICY "Users can update only their own trip stops"
    ON trip_stops
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_stops.trip_id
            AND trips.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_stops.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Policy: Users can only DELETE trip_stops for their own trips
CREATE POLICY "Users can delete only their own trip stops"
    ON trip_stops
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_stops.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view only their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert only their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update only their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete only their own expenses" ON expenses;

-- =====================================================
-- RLS Policies for EXPENSES table
-- =====================================================

-- Policy: Users can only SELECT expenses for their own trips
CREATE POLICY "Users can view only their own expenses"
    ON expenses
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = expenses.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Policy: Users can only INSERT expenses for their own trips
CREATE POLICY "Users can insert only their own expenses"
    ON expenses
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = expenses.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Policy: Users can only UPDATE expenses for their own trips
CREATE POLICY "Users can update only their own expenses"
    ON expenses
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = expenses.trip_id
            AND trips.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = expenses.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Policy: Users can only DELETE expenses for their own trips
CREATE POLICY "Users can delete only their own expenses"
    ON expenses
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = expenses.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view only their own activities" ON activities;
DROP POLICY IF EXISTS "Users can insert only their own activities" ON activities;
DROP POLICY IF EXISTS "Users can update only their own activities" ON activities;
DROP POLICY IF EXISTS "Users can delete only their own activities" ON activities;

-- =====================================================
-- Optional: RLS Policies for ACTIVITIES table
-- =====================================================

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view only their own activities"
    ON activities
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM trip_stops
            JOIN trips ON trips.id = trip_stops.trip_id
            WHERE trip_stops.id = activities.trip_stop_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert only their own activities"
    ON activities
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM trip_stops
            JOIN trips ON trips.id = trip_stops.trip_id
            WHERE trip_stops.id = activities.trip_stop_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update only their own activities"
    ON activities
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM trip_stops
            JOIN trips ON trips.id = trip_stops.trip_id
            WHERE trip_stops.id = activities.trip_stop_id
            AND trips.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM trip_stops
            JOIN trips ON trips.id = trip_stops.trip_id
            WHERE trip_stops.id = activities.trip_stop_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete only their own activities"
    ON activities
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM trip_stops
            JOIN trips ON trips.id = trip_stops.trip_id
            WHERE trip_stops.id = activities.trip_stop_id
            AND trips.user_id = auth.uid()
        )
    );

-- =====================================================
-- Testing RLS Policies
-- =====================================================
-- To test these policies:
-- 1. Create two test users in Supabase Auth
-- 2. Use the test script in tests/rls_test.sql
-- 3. Verify that User A cannot see User B's data
-- =====================================================
