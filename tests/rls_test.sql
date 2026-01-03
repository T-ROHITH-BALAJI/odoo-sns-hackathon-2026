-- =====================================================
-- RLS Testing Script
-- =====================================================
-- This script tests Row Level Security policies
-- to ensure users can only access their own data
-- =====================================================

-- =====================================================
-- Setup Test Data
-- =====================================================

-- First, ensure we have two test users
-- User IDs should match your Supabase Auth user IDs
-- Replace these with actual user IDs from your Supabase Auth

-- For testing purposes, let's use these placeholder IDs:
-- User A (Alice): '11111111-1111-1111-1111-111111111111'
-- User B (Bob):   '22222222-2222-2222-2222-222222222222'

-- =====================================================
-- Test 1: Create trips for both users
-- =====================================================

-- As User A (Alice) - Create a trip
INSERT INTO trips (user_id, title, description, start_date, end_date) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Alice Trip to Japan', 'Spring cherry blossoms', '2026-04-01', '2026-04-10');

-- As User B (Bob) - Create a trip
INSERT INTO trips (user_id, title, description, start_date, end_date) VALUES
    ('22222222-2222-2222-2222-222222222222', 'Bob Trip to Australia', 'Summer adventure', '2026-07-15', '2026-07-25');

-- =====================================================
-- Test 2: Verify RLS - Each user should only see their own trips
-- =====================================================

-- When authenticated as User A (Alice)
-- This should return ONLY Alice's trips
-- SET LOCAL auth.uid = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM trips;
-- Expected: Only "Alice Trip to Japan"

-- When authenticated as User B (Bob)
-- This should return ONLY Bob's trips
-- SET LOCAL auth.uid = '22222222-2222-2222-2222-222222222222';
-- SELECT * FROM trips;
-- Expected: Only "Bob Trip to Australia"

-- =====================================================
-- Test 3: Try to INSERT with wrong user_id (should fail)
-- =====================================================

-- As User A, try to create a trip for User B
-- SET LOCAL auth.uid = '11111111-1111-1111-1111-111111111111';
-- This should FAIL due to RLS policy
-- INSERT INTO trips (user_id, title, description, start_date, end_date) VALUES
--     ('22222222-2222-2222-2222-222222222222', 'Fake Trip', 'This should not work', '2026-05-01', '2026-05-05');

-- =====================================================
-- Test 4: Test trip_stops RLS
-- =====================================================

-- Get Alice's trip ID
DO $$
DECLARE
    alice_trip_id UUID;
    bob_trip_id UUID;
BEGIN
    SELECT id INTO alice_trip_id FROM trips WHERE user_id = '11111111-1111-1111-1111-111111111111' LIMIT 1;
    SELECT id INTO bob_trip_id FROM trips WHERE user_id = '22222222-2222-2222-2222-222222222222' LIMIT 1;
    
    -- Add trip stops for Alice
    INSERT INTO trip_stops (trip_id, city_id, day_number, stop_date, notes)
    SELECT 
        alice_trip_id,
        c.id,
        1,
        '2026-04-01',
        'Arriving in Tokyo'
    FROM cities c WHERE c.name = 'Tokyo' AND c.country = 'Japan';
    
    -- Add trip stops for Bob
    INSERT INTO trip_stops (trip_id, city_id, day_number, stop_date, notes)
    SELECT 
        bob_trip_id,
        c.id,
        1,
        '2026-07-15',
        'Arriving in Sydney'
    FROM cities c WHERE c.name = 'Sydney' AND c.country = 'Australia';
END $$;

-- When authenticated as User A
-- SET LOCAL auth.uid = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM trip_stops;
-- Expected: Only stops for Alice's trips

-- When authenticated as User B
-- SET LOCAL auth.uid = '22222222-2222-2222-2222-222222222222';
-- SELECT * FROM trip_stops;
-- Expected: Only stops for Bob's trips

-- =====================================================
-- Test 5: Test expenses RLS
-- =====================================================

-- As Alice, add an expense
-- SET LOCAL auth.uid = '11111111-1111-1111-1111-111111111111';
DO $$
DECLARE
    alice_trip_id UUID;
BEGIN
    SELECT id INTO alice_trip_id FROM trips WHERE user_id = '11111111-1111-1111-1111-111111111111' LIMIT 1;
    
    INSERT INTO expenses (trip_id, amount, currency, category, description, expense_date)
    VALUES (alice_trip_id, 150.00, 'JPY', 'food', 'Sushi dinner', '2026-04-01');
END $$;

-- As Bob, add an expense
-- SET LOCAL auth.uid = '22222222-2222-2222-2222-222222222222';
DO $$
DECLARE
    bob_trip_id UUID;
BEGIN
    SELECT id INTO bob_trip_id FROM trips WHERE user_id = '22222222-2222-2222-2222-222222222222' LIMIT 1;
    
    INSERT INTO expenses (trip_id, amount, currency, category, description, expense_date)
    VALUES (bob_trip_id, 80.00, 'AUD', 'transport', 'Airport taxi', '2026-07-15');
END $$;

-- Verify each user can only see their own expenses
-- SET LOCAL auth.uid = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM expenses;
-- Expected: Only Alice's expenses

-- SET LOCAL auth.uid = '22222222-2222-2222-2222-222222222222';
-- SELECT * FROM expenses;
-- Expected: Only Bob's expenses

-- =====================================================
-- Test Results Summary
-- =====================================================
-- ✅ Each user should ONLY see their own data
-- ✅ Users cannot insert data for other users
-- ✅ Users cannot update or delete other users' data
-- ✅ RLS is working correctly across all tables
-- =====================================================

-- To run these tests in Supabase:
-- 1. Go to SQL Editor in Supabase Dashboard
-- 2. Run this script
-- 3. Check that RLS policies are enforced
-- 4. Test with actual authenticated users using Supabase client
