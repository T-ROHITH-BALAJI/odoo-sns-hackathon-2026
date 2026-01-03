-- Seed Data for GlobeTrotter Application
-- Run this after creating the schema

-- Insert sample cities
INSERT INTO cities (name, country, latitude, longitude, cost_index, popularity_score) VALUES
    ('Paris', 'France', 48.8566, 2.3522, 85, 95),
    ('Rome', 'Italy', 41.9028, 12.4964, 75, 90),
    ('Barcelona', 'Spain', 41.3851, 2.1734, 70, 88),
    ('London', 'United Kingdom', 51.5074, -0.1278, 90, 92),
    ('Amsterdam', 'Netherlands', 52.3676, 4.9041, 80, 85),
    ('Berlin', 'Germany', 52.5200, 13.4050, 65, 82),
    ('Prague', 'Czech Republic', 50.0755, 14.4378, 55, 80),
    ('Vienna', 'Austria', 48.2082, 16.3738, 70, 83),
    ('Budapest', 'Hungary', 47.4979, 19.0402, 50, 78),
    ('Lisbon', 'Portugal', 38.7223, -9.1393, 60, 81),
    ('Madrid', 'Spain', 40.4168, -3.7038, 68, 84),
    ('Venice', 'Italy', 45.4408, 12.3155, 78, 87),
    ('Florence', 'Italy', 43.7696, 11.2558, 72, 86),
    ('Athens', 'Greece', 37.9838, 23.7275, 58, 79),
    ('Istanbul', 'Turkey', 41.0082, 28.9784, 52, 85),
    ('Dubai', 'UAE', 25.2048, 55.2708, 88, 89),
    ('Tokyo', 'Japan', 35.6762, 139.6503, 82, 93),
    ('Kyoto', 'Japan', 35.0116, 135.7681, 75, 88),
    ('Seoul', 'South Korea', 37.5665, 126.9780, 68, 84),
    ('Bangkok', 'Thailand', 13.7563, 100.5018, 45, 86),
    ('Singapore', 'Singapore', 1.3521, 103.8198, 85, 90),
    ('Bali', 'Indonesia', -8.3405, 115.0920, 48, 87),
    ('New York', 'USA', 40.7128, -74.0060, 95, 94),
    ('Los Angeles', 'USA', 34.0522, -118.2437, 88, 87),
    ('San Francisco', 'USA', 37.7749, -122.4194, 92, 89),
    ('Sydney', 'Australia', -33.8688, 151.2093, 86, 88),
    ('Melbourne', 'Australia', -37.8136, 144.9631, 82, 85),
    ('Auckland', 'New Zealand', -36.8485, 174.7633, 78, 82),
    ('Cape Town', 'South Africa', -33.9249, 18.4241, 55, 83),
    ('Marrakech', 'Morocco', 31.6295, -7.9811, 50, 80)
ON CONFLICT (name, country) DO NOTHING;

-- Sample activities (to be added to cities as users create them)
-- These would typically be created when users plan trips
-- But we can add some examples for testing

COMMENT ON TABLE cities IS 'Master list of cities available for trip planning';
COMMENT ON COLUMN cities.cost_index IS 'Relative cost index 1-100, where 100 is most expensive';
COMMENT ON COLUMN cities.popularity_score IS 'Popularity score 1-100 based on tourist traffic';
