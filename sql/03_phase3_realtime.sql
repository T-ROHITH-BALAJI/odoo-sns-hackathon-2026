-- =====================================================
-- Phase 3 - Realtime Pipeline
-- =====================================================
-- Description: Allow frontend to instantly react when:
--   - Expenses change
--   - Stops are reordered
-- 
-- Outcome: Live budget updates and itinerary sync
-- =====================================================

-- =====================================================
-- Enable Realtime Replication
-- =====================================================

-- Idempotent: Add tables to publication if not already present

DO $$
BEGIN
    -- Enable realtime for trips table
    ALTER PUBLICATION supabase_realtime ADD TABLE trips;
EXCEPTION WHEN duplicate_object THEN
    NULL; -- Table already in publication, ignore
END $$;

DO $$
BEGIN
    -- Enable realtime for trip_stops table
    ALTER PUBLICATION supabase_realtime ADD TABLE trip_stops;
EXCEPTION WHEN duplicate_object THEN
    NULL; -- Table already in publication, ignore
END $$;

DO $$
BEGIN
    -- Enable realtime for expenses table
    ALTER PUBLICATION supabase_realtime ADD TABLE expenses;
EXCEPTION WHEN duplicate_object THEN
    NULL; -- Table already in publication, ignore
END $$;

DO $$
BEGIN
    -- Optional: Enable realtime for activities table
    ALTER PUBLICATION supabase_realtime ADD TABLE activities;
EXCEPTION WHEN duplicate_object THEN
    NULL; -- Table already in publication, ignore
END $$;

-- =====================================================
-- Notes:
-- =====================================================
-- 1. Realtime works automatically with RLS policies
-- 2. Users will only receive updates for their own data
-- 3. Use the JavaScript examples below to subscribe to changes
-- =====================================================
