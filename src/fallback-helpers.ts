/**
 * =====================================================
 * Phase 5 - Fallback Logic
 * =====================================================
 * Handle edge cases gracefully to avoid crashes in demo
 * 
 * Outcome: No crashes, smooth user experience
 * =====================================================
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase (you'll need your own credentials)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// =====================================================
// Helper 1: Safe Fetch Trips
// =====================================================
// If user has no trips → return empty state

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

export async function fetchUserTrips(userId: string): Promise<{
  trips: Trip[]
  isEmpty: boolean
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching trips:', error)
      return {
        trips: [],
        isEmpty: true,
        error: error.message
      }
    }

    // Handle null or empty data
    const trips = data || []
    
    return {
      trips,
      isEmpty: trips.length === 0,
      error: null
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      trips: [],
      isEmpty: true,
      error: 'Failed to load trips. Please try again.'
    }
  }
}

// =====================================================
// Helper 2: Safe Fetch Expenses
// =====================================================
// If no expenses → return ₹0 budget

export interface Expense {
  id: string
  trip_id: string
  amount: number
  currency: string
  category: string
  description: string | null
  expense_date: string
}

export interface BudgetSummary {
  totalAmount: number
  currency: string
  expenseCount: number
  byCategory: Record<string, number>
  isEmpty: boolean
}

export async function fetchTripExpenses(tripId: string): Promise<{
  expenses: Expense[]
  summary: BudgetSummary
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', tripId)
      .order('expense_date', { ascending: true })

    if (error) {
      console.error('Error fetching expenses:', error)
      return {
        expenses: [],
        summary: getEmptyBudgetSummary(),
        error: error.message
      }
    }

    // Handle null or empty data
    const expenses = data || []
    
    // Calculate summary
    const summary = calculateBudgetSummary(expenses)
    
    return {
      expenses,
      summary,
      error: null
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      expenses: [],
      summary: getEmptyBudgetSummary(),
      error: 'Failed to load expenses'
    }
  }
}

// Helper: Calculate budget summary
function calculateBudgetSummary(expenses: Expense[]): BudgetSummary {
  if (!expenses || expenses.length === 0) {
    return getEmptyBudgetSummary()
  }

  const totalAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
  const currency = expenses[0]?.currency || 'USD'
  
  // Group by category
  const byCategory: Record<string, number> = {}
  expenses.forEach(exp => {
    const cat = exp.category || 'other'
    byCategory[cat] = (byCategory[cat] || 0) + (exp.amount || 0)
  })

  return {
    totalAmount,
    currency,
    expenseCount: expenses.length,
    byCategory,
    isEmpty: false
  }
}

// Helper: Empty budget state
function getEmptyBudgetSummary(): BudgetSummary {
  return {
    totalAmount: 0,
    currency: 'USD',
    expenseCount: 0,
    byCategory: {},
    isEmpty: true
  }
}

// =====================================================
// Helper 3: Safe Fetch Trip Stops
// =====================================================
// Handle missing stops gracefully

export interface TripStop {
  id: string
  trip_id: string
  city_id: string
  day_number: number
  stop_date: string
  notes: string | null
  city?: {
    name: string
    country: string
  }
}

export async function fetchTripStops(tripId: string): Promise<{
  stops: TripStop[]
  isEmpty: boolean
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('trip_stops')
      .select(`
        *,
        city:cities (
          name,
          country
        )
      `)
      .eq('trip_id', tripId)
      .order('day_number', { ascending: true })

    if (error) {
      console.error('Error fetching stops:', error)
      return {
        stops: [],
        isEmpty: true,
        error: error.message
      }
    }

    const stops = data || []
    
    return {
      stops,
      isEmpty: stops.length === 0,
      error: null
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      stops: [],
      isEmpty: true,
      error: 'Failed to load itinerary'
    }
  }
}

// =====================================================
// Helper 4: Safe Create Trip
// =====================================================
// Validate dates and handle errors

export async function createTrip(
  userId: string,
  title: string,
  startDate: string,
  endDate: string,
  description?: string
): Promise<{
  trip: Trip | null
  error: string | null
}> {
  try {
    // Validation
    if (!title || title.trim().length === 0) {
      return {
        trip: null,
        error: 'Trip title is required'
      }
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        trip: null,
        error: 'Invalid dates provided'
      }
    }

    if (end < start) {
      return {
        trip: null,
        error: 'End date must be after start date'
      }
    }

    // Create trip
    const { data, error } = await supabase
      .from('trips')
      .insert({
        user_id: userId,
        title: title.trim(),
        description: description?.trim() || null,
        start_date: startDate,
        end_date: endDate
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating trip:', error)
      return {
        trip: null,
        error: 'Failed to create trip. Please try again.'
      }
    }

    return {
      trip: data,
      error: null
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      trip: null,
      error: 'An unexpected error occurred'
    }
  }
}

// =====================================================
// Helper 5: Safe Add Expense
// =====================================================
// Validate amount and handle errors

export async function addExpense(
  tripId: string,
  amount: number,
  category: string,
  description: string,
  expenseDate: string,
  currency: string = 'USD'
): Promise<{
  expense: Expense | null
  error: string | null
}> {
  try {
    // Validation
    if (amount < 0) {
      return {
        expense: null,
        error: 'Amount cannot be negative'
      }
    }

    if (amount === 0) {
      return {
        expense: null,
        error: 'Amount must be greater than zero'
      }
    }

    const validCategories = ['food', 'transport', 'accommodation', 'activities', 'shopping', 'other']
    if (!validCategories.includes(category)) {
      return {
        expense: null,
        error: 'Invalid category'
      }
    }

    // Add expense
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        trip_id: tripId,
        amount: Number(amount.toFixed(2)), // Ensure 2 decimal places
        currency,
        category,
        description: description.trim(),
        expense_date: expenseDate
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding expense:', error)
      return {
        expense: null,
        error: 'Failed to add expense'
      }
    }

    return {
      expense: data,
      error: null
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      expense: null,
      error: 'An unexpected error occurred'
    }
  }
}

// =====================================================
// Helper 6: Safe Fetch Complete Trip
// =====================================================
// Get trip with all related data, handling missing pieces

export interface CompleteTripData {
  trip: Trip | null
  stops: TripStop[]
  expenses: Expense[]
  budgetSummary: BudgetSummary
  error: string | null
}

export async function fetchCompleteTrip(tripId: string): Promise<CompleteTripData> {
  try {
    // Fetch trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single()

    if (tripError || !trip) {
      return {
        trip: null,
        stops: [],
        expenses: [],
        budgetSummary: getEmptyBudgetSummary(),
        error: 'Trip not found'
      }
    }

    // Fetch stops and expenses in parallel
    const [stopsResult, expensesResult] = await Promise.all([
      fetchTripStops(tripId),
      fetchTripExpenses(tripId)
    ])

    return {
      trip,
      stops: stopsResult.stops,
      expenses: expensesResult.expenses,
      budgetSummary: expensesResult.summary,
      error: null
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      trip: null,
      stops: [],
      expenses: [],
      budgetSummary: getEmptyBudgetSummary(),
      error: 'Failed to load trip details'
    }
  }
}

// =====================================================
// Helper 7: Format Currency
// =====================================================
// Safely format amounts with currency symbols

export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0)
  } catch (err) {
    // Fallback if currency code is invalid
    return `${currency} ${(amount || 0).toFixed(2)}`
  }
}

// =====================================================
// Helper 8: Empty State Messages
// =====================================================
// User-friendly messages for empty states

export const EMPTY_STATE_MESSAGES = {
  noTrips: {
    title: "No trips yet",
    message: "Start planning your next adventure!",
    action: "Create your first trip"
  },
  noExpenses: {
    title: "No expenses tracked",
    message: "Add expenses to track your budget",
    action: "Add expense"
  },
  noStops: {
    title: "No stops planned",
    message: "Add cities to build your itinerary",
    action: "Add stop"
  },
  noActivities: {
    title: "No activities yet",
    message: "Plan what you'll do at each stop",
    action: "Add activity"
  }
}

// =====================================================
// Helper 9: Error Message Mapping
// =====================================================
// Convert technical errors to user-friendly messages

export function getUserFriendlyError(error: any): string {
  if (!error) return 'An unknown error occurred'

  const message = error.message || error.toString()

  // Map common errors
  if (message.includes('unique constraint')) {
    return 'This item already exists'
  }
  if (message.includes('foreign key')) {
    return 'Related item not found'
  }
  if (message.includes('permission denied') || message.includes('42501')) {
    return 'You do not have permission to perform this action'
  }
  if (message.includes('not found')) {
    return 'Item not found'
  }
  if (message.includes('network')) {
    return 'Network error. Please check your connection.'
  }

  // Default message
  return 'Something went wrong. Please try again.'
}

// =====================================================
// Helper 10: React Hook for Safe Data Fetching
// =====================================================
// Custom hook with built-in error handling

import { useState, useEffect } from 'react'

export function useSafeTrips(userId: string | null) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    if (!userId) {
      setTrips([])
      setLoading(false)
      setIsEmpty(true)
      return
    }

    const loadTrips = async () => {
      setLoading(true)
      const result = await fetchUserTrips(userId)
      
      setTrips(result.trips)
      setError(result.error)
      setIsEmpty(result.isEmpty)
      setLoading(false)
    }

    loadTrips()
  }, [userId])

  return { trips, loading, error, isEmpty }
}

// =====================================================
// Usage Example
// =====================================================

/*
// In your React component:

function TripsPage() {
  const [user] = useUser() // Your auth hook
  const { trips, loading, error, isEmpty } = useSafeTrips(user?.id)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        retry={() => window.location.reload()}
      />
    )
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.noTrips.title}
        message={EMPTY_STATE_MESSAGES.noTrips.message}
        action={EMPTY_STATE_MESSAGES.noTrips.action}
        onAction={() => router.push('/trips/new')}
      />
    )
  }

  return (
    <div>
      {trips.map(trip => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  )
}

// In your expenses component:

function BudgetDisplay({ tripId }: { tripId: string }) {
  const [budget, setBudget] = useState<BudgetSummary | null>(null)

  useEffect(() => {
    fetchTripExpenses(tripId).then(result => {
      setBudget(result.summary)
    })
  }, [tripId])

  if (!budget) return <LoadingSpinner />

  if (budget.isEmpty) {
    return (
      <EmptyState {...EMPTY_STATE_MESSAGES.noExpenses} />
    )
  }

  return (
    <div>
      <h2>Total Budget: {formatCurrency(budget.totalAmount, budget.currency)}</h2>
      <p>{budget.expenseCount} expenses tracked</p>
    </div>
  )
}
*/

// =====================================================
// ✅ Outcome: No crashes in demo!
// =====================================================
// All edge cases are handled gracefully with:
// - Empty states for no data
// - Error messages that are user-friendly
// - Input validation before DB operations
// - Fallback values for null/undefined
// - Safe number formatting
// =====================================================
