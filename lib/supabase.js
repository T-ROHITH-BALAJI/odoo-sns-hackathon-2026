import { createClient } from '@supabase/supabase-js'

// Get environment variables (works in Node.js and browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jzjvurejhsbbwqmsided.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6anZ1cmVqaHNiYndxbXNpZGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjA1MDgsImV4cCI6MjA4Mjk5NjUwOH0.oGSuEuN7JkNWzVxsZzqcUeAZvSlN6ZP4baXS_8B-764'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
