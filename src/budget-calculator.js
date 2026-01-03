// ============================================
// BUDGET CALCULATOR - Backend Logic
// ============================================
// Calculate budget drift and generate alerts

import { supabaseBackend as supabase } from '../lib/supabase-backend.js'

/**
 * Calculate budget drift and analysis
 * @param {string} tripId - Trip ID to analyze
 * @param {number} plannedBudget - User's planned total budget
 * @returns {Promise<Object>} Budget analysis or error
 */
export async function calculateBudgetDrift(tripId, plannedBudget) {
  try {
    console.log('💰 Calculating budget drift...')
    console.log(`   Trip: ${tripId}`)
    console.log(`   Planned: $${plannedBudget}`)

    // Fetch all expenses for this trip
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select(`
        *,
        trip_stops (day_number)
      `)
      .eq('trip_id', tripId)

    if (expensesError) throw expensesError

    // Calculate totals
    const actualSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    const remaining = plannedBudget - actualSpent
    const driftPercentage = plannedBudget > 0 
      ? ((actualSpent - plannedBudget) / plannedBudget) * 100 
      : 0

    // Determine status
    let status
    if (driftPercentage > 10) status = 'over'
    else if (driftPercentage < -10) status = 'under'
    else status = 'on-track'

    console.log(`   Actual: $${actualSpent.toFixed(2)}`)
    console.log(`   Drift: ${driftPercentage.toFixed(1)}%`)
    console.log(`   Status: ${status}`)

    // Get trip details for daily breakdown
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('start_date, end_date')
      .eq('id', tripId)
      .single()

    if (tripError) throw tripError

    const start = new Date(trip.start_date)
    const end = new Date(trip.end_date)
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    const plannedPerDay = plannedBudget / totalDays

    // Daily breakdown
    const dailyMap = new Map()
    
    for (const expense of expenses) {
      const day = expense.trip_stops?.day_number || 1
      if (!dailyMap.has(day)) {
        dailyMap.set(day, { planned: plannedPerDay, actual: 0 })
      }
      dailyMap.get(day).actual += Number(expense.amount)
    }

    const dailyBreakdown = Array.from(dailyMap.entries())
      .map(([day, data]) => ({
        dayNumber: day,
        planned: data.planned,
        actual: data.actual,
        drift: data.actual - data.planned,
        driftPercent: ((data.actual - data.planned) / data.planned) * 100
      }))
      .sort((a, b) => a.dayNumber - b.dayNumber)

    // Category breakdown
    const categories = ['food', 'transport', 'accommodation', 'activities', 'shopping', 'other']
    const categoryBreakdown = {}
    
    for (const cat of categories) {
      const catExpenses = expenses.filter(e => e.category === cat)
      const actual = catExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
      categoryBreakdown[cat] = {
        planned: plannedBudget / categories.length, // Simple equal distribution
        actual: actual,
        percentage: (actual / actualSpent) * 100
      }
    }

    // Generate alerts
    const alerts = []
    
    if (status === 'over') {
      alerts.push(`⚠️ OVER BUDGET by $${Math.abs(remaining).toFixed(2)} (${Math.abs(driftPercentage).toFixed(1)}%)`)
    } else if (status === 'under') {
      alerts.push(`✅ Under budget by $${remaining.toFixed(2)} (${Math.abs(driftPercentage).toFixed(1)}%)`)
    } else {
      alerts.push(`✅ On track with budget`)
    }

    // Check daily drifts
    for (const day of dailyBreakdown) {
      if (day.drift > day.planned * 0.5) {
        alerts.push(`⚠️ Day ${day.dayNumber}: Overspent by $${day.drift.toFixed(2)} (${day.driftPercent.toFixed(0)}% over daily budget)`)
      }
    }

    // Check if any category is >40% of budget
    for (const [cat, data] of Object.entries(categoryBreakdown)) {
      if (data.percentage > 40) {
        alerts.push(`⚠️ ${cat} spending is ${data.percentage.toFixed(0)}% of total (consider reducing)`)
      }
    }

    // Projection alert
    if (expenses.length > 0) {
      const avgDailySpend = actualSpent / dailyBreakdown.length
      const projectedTotal = avgDailySpend * totalDays
      if (projectedTotal > plannedBudget * 1.1) {
        alerts.push(`🔮 Projected total: $${projectedTotal.toFixed(2)} (may exceed budget by end of trip)`)
      }
    }

    console.log(`\n📊 Analysis complete:`)
    console.log(`   ${alerts.length} alerts generated`)

    return {
      analysis: {
        tripId,
        plannedBudget,
        actualSpent,
        remaining,
        driftPercentage,
        status,
        dailyBreakdown,
        categoryBreakdown,
        alerts,
        summary: {
          totalDays,
          plannedPerDay,
          avgActualPerDay: actualSpent / (dailyBreakdown.length || 1)
        }
      },
      error: null
    }

  } catch (err) {
    console.error('❌ Budget calculation error:', err.message)
    return {
      analysis: null,
      error: err.message
    }
  }
}

/**
 * Add an expense and recalculate budget
 */
export async function addExpense(tripId, expenseData) {
  try {
    const { data: expense, error } = await supabase
      .from('expenses')
      .insert({
        trip_id: tripId,
        ...expenseData
      })
      .select()
      .single()

    if (error) throw error

    console.log(`✅ Expense added: $${expense.amount} - ${expense.description}`)
    
    return { expense, error: null }
  } catch (err) {
    return { expense: null, error: err.message }
  }
}

/**
 * Get all expenses for a trip
 */
export async function getExpenses(tripId) {
  try {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', tripId)
      .order('expense_date', { ascending: true })

    if (error) throw error

    return { expenses, error: null }
  } catch (err) {
    return { expenses: null, error: err.message }
  }
}
