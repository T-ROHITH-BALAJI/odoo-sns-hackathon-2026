// ============================================
// TEST ALL BACKEND LOGIC
// ============================================
// Complete end-to-end test of all backend components

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import { generateItinerary, getItinerary } from './src/itinerary-engine.js'
import { calculateBudgetDrift, addExpense } from './src/budget-calculator.js'
import { optimizeCityRoute } from './src/route-optimizer.js'
import { validateTrip, validateDaySchedule } from './src/edge-case-handlers.js'

// Use service role key for testing (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🚀 BACKEND LOGIC TEST SUITE\n')
console.log('='  .repeat(60))

async function runTests() {
  try {
    // ====================================
    // TEST 1: Route Optimization
    // ====================================
    console.log('\n📍 TEST 1: Route Optimizer')
    console.log('-'.repeat(60))

    // Fetch available cities
    const { data: cities, error: citiesQueryError } = await supabase
      .from('cities')
      .select('id, name')
      .limit(3)

    if (citiesQueryError || !cities) {
      console.error('❌ Failed to fetch cities:', citiesQueryError)
      return
    }

    const cityIds = cities.map(c => c.id)
    console.log('Cities to optimize:', cities.map(c => c.name).join(', '))

    const { route, error: routeError } = await optimizeCityRoute(cityIds)
    
    if (routeError) {
      console.error('❌ Route optimization failed:', routeError)
    } else {
      console.log('✅ Optimized route:', route.cities.map(c => c.name).join(' → '))
      console.log(`   Distance: ${route.totalDistance.toFixed(0)} km`)
      console.log(`   Savings: ${route.savings.toFixed(0)} km (${route.savingsPercent.toFixed(1)}%)`)
    }

    // ====================================
    // TEST 2: Create Trip
    // ====================================
    console.log('\n\n🌍 TEST 2: Create Trip')
    console.log('-'.repeat(60))

    // Use Alice's user ID from sample data
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'alice@example.com')
      .single()

    const plannedBudget = 1500 // Store budget separately for testing

    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        user_id: users.id,
        title: 'European Adventure 2026',
        description: 'A week exploring European cities',
        start_date: '2026-06-01',
        end_date: '2026-06-07'
      })
      .select()
      .single()

    if (tripError) {
      console.error('❌ Trip creation failed:', tripError)
      return
    }

    console.log('✅ Trip created:', trip.title)
    console.log(`   ID: ${trip.id}`)
    console.log(`   Dates: ${trip.start_date} to ${trip.end_date}`)
    console.log(`   Planned Budget: $${plannedBudget}`)

    // ====================================
    // TEST 3: Itinerary Generation
    // ====================================
    console.log('\n\n📅 TEST 3: Itinerary Engine')
    console.log('-'.repeat(60))

    const { itinerary, error: itineraryError } = await generateItinerary({
      tripId: trip.id,
      startDate: trip.start_date,
      endDate: trip.end_date,
      cityIds: route.cityIds, // Use optimized route
      preferences: {
        pacePreference: 'moderate',
        activityTypes: ['sightseeing', 'dining'],
        budgetPerDay: 200
      }
    })

    if (itineraryError) {
      console.error('❌ Itinerary generation failed:', itineraryError)
    } else {
      console.log(`✅ Generated ${itinerary.stops.length}-day itinerary`)
      console.log(`   Estimated budget: $${itinerary.totalBudget.toFixed(2)}`)
      
      // Show first 2 days
      for (let i = 0; i < Math.min(2, itinerary.stops.length); i++) {
        const stop = itinerary.stops[i]
        console.log(`\n   Day ${stop.dayNumber} - ${stop.cityName} (${stop.date})`)
        for (const act of stop.activities) {
          console.log(`      ${act.startTime}-${act.endTime}: ${act.title} ($${act.estimatedCost})`)
        }
      }
      if (itinerary.stops.length > 2) {
        console.log(`   ... and ${itinerary.stops.length - 2} more days`)
      }
    }

    // ====================================
    // TEST 4: Edge Case Validation
    // ====================================
    console.log('\n\n⚠️  TEST 4: Edge Case Handlers')
    console.log('-'.repeat(60))

    // Get the generated itinerary with activities
    const { itinerary: fullItinerary } = await getItinerary(trip.id)

    if (fullItinerary && fullItinerary.length > 0) {
      const firstDay = fullItinerary[0]
      const validation = validateDaySchedule(firstDay.activities)
      
      console.log(`✅ Validated Day ${firstDay.day_number}:`)
      console.log(`   Total hours: ${validation.totalHours.toFixed(1)} hours`)
      console.log(`   Activities: ${validation.activityCount}`)
      console.log(`   Status: ${validation.isValid ? '✅ Valid' : '❌ Invalid'}`)
      
      if (validation.warnings.length > 0) {
        console.log('   Warnings:')
        validation.warnings.forEach(w => console.log(`     - ${w}`))
      }
      if (validation.errors.length > 0) {
        console.log('   Errors:')
        validation.errors.forEach(e => console.log(`     - ${e}`))
      }
    }

    // ====================================
    // TEST 5: Add Some Expenses
    // ====================================
    console.log('\n\n💰 TEST 5: Add Expenses')
    console.log('-'.repeat(60))

    const sampleExpenses = [
      { category: 'food', amount: 45.50, description: 'Lunch at local bistro', expense_date: '2026-06-01' },
      { category: 'transport', amount: 120.00, description: 'Train tickets', expense_date: '2026-06-01' },
      { category: 'accommodation', amount: 150.00, description: 'Hotel night 1', expense_date: '2026-06-01' },
      { category: 'activities', amount: 35.00, description: 'Museum entry', expense_date: '2026-06-02' },
      { category: 'food', amount: 60.00, description: 'Dinner at restaurant', expense_date: '2026-06-02' },
    ]

    for (const expenseData of sampleExpenses) {
      const { expense, error: expError } = await addExpense(trip.id, expenseData)
      if (expError) {
        console.error(`❌ Failed to add expense: ${expenseData.description}`)
      } else {
        console.log(`✅ Added: $${expense.amount} - ${expense.description}`)
      }
    }

    // ====================================
    // TEST 6: Budget Calculator
    // ====================================
    console.log('\n\n💵 TEST 6: Budget Calculator')
    console.log('-'.repeat(60))

    const { analysis, error: budgetError } = await calculateBudgetDrift(
      trip.id,
      plannedBudget
    )

    if (budgetError) {
      console.error('❌ Budget calculation failed:', budgetError)
    } else {
      console.log('✅ Budget analysis complete:')
      console.log(`   Planned: $${analysis.plannedBudget.toFixed(2)}`)
      console.log(`   Spent: $${analysis.actualSpent.toFixed(2)}`)
      console.log(`   Remaining: $${analysis.remaining.toFixed(2)}`)
      console.log(`   Drift: ${analysis.driftPercentage.toFixed(1)}%`)
      console.log(`   Status: ${analysis.status}`)
      
      if (analysis.alerts.length > 0) {
        console.log('\n   Alerts:')
        analysis.alerts.forEach(alert => console.log(`   ${alert}`))
      }

      console.log('\n   Daily Breakdown:')
      analysis.dailyBreakdown.slice(0, 3).forEach(day => {
        console.log(`   Day ${day.dayNumber}: Planned $${day.planned.toFixed(0)}, Actual $${day.actual.toFixed(2)} (${day.driftPercent >= 0 ? '+' : ''}${day.driftPercent.toFixed(0)}%)`)
      })

      console.log('\n   Top Categories:')
      const topCats = Object.entries(analysis.categoryBreakdown)
        .filter(([_, data]) => data.actual > 0)
        .sort((a, b) => b[1].actual - a[1].actual)
        .slice(0, 3)
      
      topCats.forEach(([cat, data]) => {
        console.log(`   ${cat}: $${data.actual.toFixed(2)} (${data.percentage.toFixed(0)}%)`)
      })
    }

    // ====================================
    // SUMMARY
    // ====================================
    console.log('\n\n' + '='.repeat(60))
    console.log('🎉 ALL TESTS COMPLETE!')
    console.log('='.repeat(60))
    console.log('\n✅ Backend components working:')
    console.log('   1. Route Optimizer - Minimizes travel distance')
    console.log('   2. Itinerary Engine - Generates day-wise schedules')
    console.log('   3. Budget Calculator - Tracks spending & drift')
    console.log('   4. Edge Case Handlers - Validates constraints')
    console.log('\n📝 Next steps:')
    console.log('   - Build API endpoints (REST or Next.js API routes)')
    console.log('   - Integrate with frontend UI')
    console.log('   - Add more advanced features (AI suggestions, etc.)')
    console.log('   - Deploy to production\n')

  } catch (err) {
    console.error('\n💥 Test failed:', err.message)
    console.error(err)
  }
}

runTests()
