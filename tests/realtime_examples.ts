/**
 * =====================================================
 * Phase 3 - Realtime Subscription Examples
 * =====================================================
 * JavaScript/TypeScript examples for subscribing to
 * realtime changes in Supabase
 * =====================================================
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

// =====================================================
// Example 1: Subscribe to Trip Changes
// =====================================================
export function subscribeToTripChanges(userId: string, callback: (payload: any) => void) {
  const subscription = supabase
    .channel('trips-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'trips',
        filter: `user_id=eq.${userId}` // Only listen to this user's trips
      },
      (payload) => {
        console.log('Trip changed:', payload)
        callback(payload)
      }
    )
    .subscribe()

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription)
  }
}

// =====================================================
// Example 2: Subscribe to Expense Changes
// =====================================================
export function subscribeToExpenseChanges(tripId: string, callback: (payload: any) => void) {
  const subscription = supabase
    .channel('expenses-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all events
        schema: 'public',
        table: 'expenses',
        filter: `trip_id=eq.${tripId}` // Only for this trip
      },
      (payload) => {
        console.log('Expense changed:', payload)
        
        // Handle different event types
        switch (payload.eventType) {
          case 'INSERT':
            console.log('New expense added:', payload.new)
            break
          case 'UPDATE':
            console.log('Expense updated:', payload.new)
            break
          case 'DELETE':
            console.log('Expense deleted:', payload.old)
            break
        }
        
        callback(payload)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(subscription)
  }
}

// =====================================================
// Example 3: Subscribe to Trip Stops Changes
// =====================================================
export function subscribeToTripStopsChanges(tripId: string, callback: (payload: any) => void) {
  const subscription = supabase
    .channel('trip-stops-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'trip_stops',
        filter: `trip_id=eq.${tripId}`
      },
      (payload) => {
        console.log('Trip stop changed:', payload)
        callback(payload)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(subscription)
  }
}

// =====================================================
// Example 4: Complete React Hook Example
// =====================================================
import { useEffect, useState } from 'react'

interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
  // ... other fields
}

export function useRealtimeTrips(userId: string) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial trips
    const fetchTrips = async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching trips:', error)
      } else {
        setTrips(data || [])
      }
      setLoading(false)
    }

    fetchTrips()

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('user-trips')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trips',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTrips((current) => [payload.new as Trip, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setTrips((current) =>
              current.map((trip) =>
                trip.id === payload.new.id ? (payload.new as Trip) : trip
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setTrips((current) =>
              current.filter((trip) => trip.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    // Cleanup
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [userId])

  return { trips, loading }
}

// =====================================================
// Example 5: Live Budget Tracker
// =====================================================
interface Expense {
  id: string
  amount: number
  currency: string
  category: string
  description: string
}

export function useLiveBudget(tripId: string) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [totalBudget, setTotalBudget] = useState(0)

  useEffect(() => {
    // Fetch initial expenses
    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)

      if (error) {
        console.error('Error fetching expenses:', error)
      } else {
        setExpenses(data || [])
        calculateTotal(data || [])
      }
    }

    fetchExpenses()

    // Subscribe to expense changes
    const subscription = supabase
      .channel('trip-expenses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `trip_id=eq.${tripId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newExpenses = [...expenses, payload.new as Expense]
            setExpenses(newExpenses)
            calculateTotal(newExpenses)
          } else if (payload.eventType === 'UPDATE') {
            const updated = expenses.map((exp) =>
              exp.id === payload.new.id ? (payload.new as Expense) : exp
            )
            setExpenses(updated)
            calculateTotal(updated)
          } else if (payload.eventType === 'DELETE') {
            const filtered = expenses.filter((exp) => exp.id !== payload.old.id)
            setExpenses(filtered)
            calculateTotal(filtered)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [tripId])

  const calculateTotal = (expensesList: Expense[]) => {
    const total = expensesList.reduce((sum, exp) => sum + exp.amount, 0)
    setTotalBudget(total)
  }

  return { expenses, totalBudget }
}

// =====================================================
// Example 6: Presence (Optional - Who's viewing)
// =====================================================
export function useTripPresence(tripId: string, userName: string) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    const channel = supabase.channel(`trip:${tripId}`)

    // Track presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = Object.values(state).flat() as any[]
        setOnlineUsers(users.map(u => u.name))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ name: userName, online_at: new Date().toISOString() })
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [tripId, userName])

  return onlineUsers
}

// =====================================================
// Usage Example in a Component
// =====================================================

/*
function TripDashboard({ userId, tripId }) {
  const { trips } = useRealtimeTrips(userId)
  const { expenses, totalBudget } = useLiveBudget(tripId)
  const onlineUsers = useTripPresence(tripId, 'Current User')

  return (
    <div>
      <h1>My Trips</h1>
      {trips.map(trip => (
        <div key={trip.id}>{trip.title}</div>
      ))}

      <h2>Budget: ${totalBudget}</h2>
      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>
            {expense.description}: ${expense.amount}
          </li>
        ))}
      </ul>

      <h3>Currently Viewing:</h3>
      <ul>
        {onlineUsers.map(user => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  )
}
*/
