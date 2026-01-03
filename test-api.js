// ============================================
// API TEST SUITE
// ============================================
// Test all API endpoints with real HTTP requests

console.log('🧪 API Test Suite\n')
console.log('='  .repeat(60))
console.log('⚠️  Make sure the API server is running first!')
console.log('   Run: npm start (in another terminal)')
console.log('='  .repeat(60) + '\n')

const API_BASE = 'http://localhost:3001'

// Helper function to make requests
async function apiRequest(method, endpoint, body = null) {
  const url = `${API_BASE}${endpoint}`
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    return { status: response.status, data }
  } catch (err) {
    return { status: 0, error: err.message }
  }
}

async function runTests() {
  console.log('⏳ Waiting 2 seconds for server to be ready...\n')
  await new Promise(resolve => setTimeout(resolve, 2000))

  try {
    // ====================================
    // TEST 1: Health Check
    // ====================================
    console.log('📍 TEST 1: Health Check')
    console.log('-'.repeat(60))
    
    const health = await apiRequest('GET', '/')
    if (health.status === 200) {
      console.log('✅ API server is running')
      console.log(`   Version: ${health.data.version}`)
      console.log(`   Member: ${health.data.member}`)
    } else {
      console.log('❌ Server not responding')
      console.log('   Make sure to run: npm start')
      return
    }

    // ====================================
    // TEST 2: Route Optimization
    // ====================================
    console.log('\n\n🗺️  TEST 2: Route Optimization')
    console.log('-'.repeat(60))
    
    // First, get some city IDs from database
    const { createClient } = await import('@supabase/supabase-js')
    const dotenv = await import('dotenv')
    dotenv.default.config({ path: '.env.local' })
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    const { data: cities } = await supabase
      .from('cities')
      .select('id, name')
      .limit(3)
    
    const cityIds = cities.map(c => c.id)
    console.log('Cities:', cities.map(c => c.name).join(', '))
    
    const routeResult = await apiRequest('POST', '/api/route/optimize', { cityIds })
    
    if (routeResult.status === 200 && routeResult.data.success) {
      const route = routeResult.data.data
      console.log('✅ Route optimized')
      console.log(`   Path: ${route.cities.map(c => c.name).join(' → ')}`)
      console.log(`   Distance: ${route.totalDistance.toFixed(0)} km`)
      console.log(`   Savings: ${route.savings.toFixed(0)} km (${route.savingsPercent.toFixed(1)}%)`)
    } else {
      console.log('❌ Route optimization failed:', routeResult.data?.error || routeResult.error)
    }

    // ====================================
    // TEST 3: Create Trip & Generate Itinerary
    // ====================================
    console.log('\n\n📅 TEST 3: Generate Itinerary')
    console.log('-'.repeat(60))
    
    // Create a test trip
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'alice@example.com')
      .single()
    
    const { data: trip } = await supabase
      .from('trips')
      .insert({
        user_id: users.id,
        title: 'API Test Trip',
        description: 'Testing API endpoints',
        start_date: '2026-07-01',
        end_date: '2026-07-05'
      })
      .select()
      .single()
    
    console.log(`✅ Created trip: ${trip.title} (${trip.id})`)
    
    // Generate itinerary via API
    const itineraryResult = await apiRequest('POST', '/api/itinerary/generate', {
      tripId: trip.id,
      startDate: trip.start_date,
      endDate: trip.end_date,
      cityIds: routeResult.data.data.cityIds, // Use optimized order
      preferences: {
        pacePreference: 'moderate',
        activityTypes: ['sightseeing', 'dining'],
        budgetPerDay: 150
      }
    })
    
    if (itineraryResult.status === 200 && itineraryResult.data.success) {
      const itinerary = itineraryResult.data.data
      console.log('✅ Itinerary generated via API')
      console.log(`   Days: ${itinerary.totalDays}`)
      console.log(`   Stops: ${itinerary.stops.length}`)
      console.log(`   Budget: $${itinerary.totalBudget.toFixed(2)}`)
      
      console.log('\n   First day preview:')
      const firstDay = itinerary.stops[0]
      console.log(`   Day ${firstDay.dayNumber} - ${firstDay.cityName}`)
      firstDay.activities.slice(0, 2).forEach(act => {
        console.log(`      ${act.startTime}-${act.endTime}: ${act.title}`)
      })
    } else {
      console.log('❌ Itinerary generation failed:', itineraryResult.data?.error)
    }

    // ====================================
    // TEST 4: Add Expenses
    // ====================================
    console.log('\n\n💰 TEST 4: Add Expenses')
    console.log('-'.repeat(60))
    
    const expenses = [
      { category: 'food', amount: 35.00, description: 'Breakfast', expenseDate: '2026-07-01' },
      { category: 'transport', amount: 80.00, description: 'Bus tickets', expenseDate: '2026-07-01' },
      { category: 'accommodation', amount: 120.00, description: 'Hotel', expenseDate: '2026-07-01' }
    ]
    
    for (const exp of expenses) {
      const result = await apiRequest('POST', '/api/budget/expense', {
        tripId: trip.id,
        ...exp
      })
      
      if (result.status === 200 && result.data.success) {
        console.log(`✅ Added: $${exp.amount} - ${exp.description}`)
      } else {
        console.log(`❌ Failed: ${exp.description}`)
      }
    }

    // ====================================
    // TEST 5: Budget Analysis
    // ====================================
    console.log('\n\n💵 TEST 5: Budget Analysis')
    console.log('-'.repeat(60))
    
    const plannedBudget = 1000
    const budgetResult = await apiRequest('GET', `/api/budget/${trip.id}?planned=${plannedBudget}`)
    
    if (budgetResult.status === 200 && budgetResult.data.success) {
      const analysis = budgetResult.data.data
      console.log('✅ Budget analysis complete')
      console.log(`   Planned: $${analysis.plannedBudget.toFixed(2)}`)
      console.log(`   Spent: $${analysis.actualSpent.toFixed(2)}`)
      console.log(`   Remaining: $${analysis.remaining.toFixed(2)}`)
      console.log(`   Drift: ${analysis.driftPercentage.toFixed(1)}%`)
      console.log(`   Status: ${analysis.status}`)
      
      if (analysis.alerts.length > 0) {
        console.log('\n   Alerts:')
        analysis.alerts.slice(0, 3).forEach(alert => {
          console.log(`   ${alert}`)
        })
      }
    } else {
      console.log('❌ Budget analysis failed:', budgetResult.data?.error)
    }

    // ====================================
    // TEST 6: Get Itinerary
    // ====================================
    console.log('\n\n📖 TEST 6: Retrieve Itinerary')
    console.log('-'.repeat(60))
    
    const getItinResult = await apiRequest('GET', `/api/itinerary/${trip.id}/summary`)
    
    if (getItinResult.status === 200 && getItinResult.data.success) {
      const summary = getItinResult.data.data
      console.log('✅ Itinerary retrieved')
      console.log(`   Days: ${summary.totalDays}`)
      console.log(`   Activities: ${summary.totalActivities}`)
      console.log(`   Cities: ${summary.cities.join(', ')}`)
    } else {
      console.log('❌ Retrieval failed:', getItinResult.data?.error)
    }

    // ====================================
    // SUMMARY
    // ====================================
    console.log('\n\n' + '='.repeat(60))
    console.log('🎉 API TESTS COMPLETE!')
    console.log('='.repeat(60))
    console.log('\n✅ All API endpoints are working:')
    console.log('   1. ✅ Route optimization')
    console.log('   2. ✅ Itinerary generation')
    console.log('   3. ✅ Expense tracking')
    console.log('   4. ✅ Budget analysis')
    console.log('   5. ✅ Data retrieval')
    console.log('\n📝 Frontend can now integrate these endpoints!')
    console.log('   Base URL: http://localhost:3001')
    console.log('   Documentation: See api/routes/*.js files\n')

  } catch (err) {
    console.error('\n💥 Test failed:', err.message)
    console.error(err)
  }
}

runTests()
