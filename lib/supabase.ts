import { createClient } from '@supabase/supabase-js'

// Get environment variables (works in Node.js and browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jzjvurejhsbbwqmsided.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6anZ1cmVqaHNiYndxbXNpZGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjA1MDgsImV4cCI6MjA4Mjk5NjUwOH0.oGSuEuN7JkNWzVxsZzqcUeAZvSlN6ZP4baXS_8B-764'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for database tables
export interface User {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface City {
  id: string
  name: string
  country: string
  latitude: number | null
  longitude: number | null
  created_at: string
}

export interface Trip {
  id: string
  user_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface TripStop {
  id: string
  trip_id: string
  city_id: string
  day_number: number
  stop_date: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  trip_stop_id: string
  title: string
  description: string | null
  activity_type: 'sightseeing' | 'dining' | 'shopping' | 'entertainment' | 'transportation' | 'accommodation' | 'other' | null
  start_time: string | null
  end_time: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  trip_id: string
  trip_stop_id: string | null
  activity_id: string | null
  amount: number
  currency: string
  category: 'food' | 'transport' | 'accommodation' | 'activities' | 'shopping' | 'other' | null
  description: string | null
  expense_date: string
  created_at: string
  updated_at: string
}
