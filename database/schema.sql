-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_stop_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  activity_type text CHECK (activity_type = ANY (ARRAY['sightseeing'::text, 'dining'::text, 'shopping'::text, 'entertainment'::text, 'transportation'::text, 'accommodation'::text, 'other'::text])),
  start_time time without time zone,
  end_time time without time zone,
  location text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_trip_stop_id_fkey FOREIGN KEY (trip_stop_id) REFERENCES public.trip_stops(id)
);
CREATE TABLE public.cities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  country text NOT NULL,
  latitude numeric,
  longitude numeric,
  created_at timestamp with time zone DEFAULT now(),
  cost_index integer DEFAULT 50,
  popularity_score integer DEFAULT 0,
  CONSTRAINT cities_pkey PRIMARY KEY (id)
);
CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL,
  trip_stop_id uuid,
  activity_id uuid,
  amount numeric NOT NULL CHECK (amount >= 0::numeric),
  currency text NOT NULL DEFAULT 'USD'::text,
  category text CHECK (category = ANY (ARRAY['food'::text, 'transport'::text, 'accommodation'::text, 'activities'::text, 'shopping'::text, 'other'::text])),
  description text,
  expense_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expenses_pkey PRIMARY KEY (id),
  CONSTRAINT expenses_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT expenses_trip_stop_id_fkey FOREIGN KEY (trip_stop_id) REFERENCES public.trip_stops(id),
  CONSTRAINT expenses_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id)
);
CREATE TABLE public.trip_stops (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL,
  city_id uuid NOT NULL,
  day_number integer NOT NULL CHECK (day_number > 0),
  stop_date date NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trip_stops_pkey PRIMARY KEY (id),
  CONSTRAINT trip_stops_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT trip_stops_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id)
);
CREATE TABLE public.trips (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trips_pkey PRIMARY KEY (id),
  CONSTRAINT trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  full_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);