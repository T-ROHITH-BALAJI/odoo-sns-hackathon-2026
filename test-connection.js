// Test Supabase connection
import { supabase } from './lib/supabase.js'

async function testConnection() {
  console.log('🔌 Testing Supabase connection...\n')

  try {
    // Test 1: Fetch users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5)

    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
      return
    }

    console.log('✅ Connection successful!')
    console.log(`📊 Found ${users.length} users:`)
    users.forEach(user => {
      console.log(`  - ${user.full_name} (${user.email})`)
    })

    // Test 2: Fetch cities
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*')

    if (citiesError) {
      console.error('❌ Error fetching cities:', citiesError.message)
      return
    }

    console.log(`\n🌍 Found ${cities.length} cities:`)
    cities.forEach(city => {
      console.log(`  - ${city.name}, ${city.country}`)
    })

    // Test 3: Fetch trips
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('*')

    if (tripsError) {
      console.error('❌ Error fetching trips:', tripsError.message)
      return
    }

    console.log(`\n✈️ Found ${trips.length} trips:`)
    trips.forEach(trip => {
      console.log(`  - ${trip.title} (${trip.start_date} to ${trip.end_date})`)
    })

    console.log('\n🎉 All tests passed! Your Supabase setup is working perfectly!\n')

  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

testConnection()
