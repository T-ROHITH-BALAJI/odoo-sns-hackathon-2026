// ============================================
// ITINERARY ENGINE - Backend Logic
// ============================================
// Generates day-wise itinerary with activities

import { supabaseBackend as supabase } from '../lib/supabase-backend.js'

/**
 * Generate a complete itinerary for a trip
 * @param {Object} request - Itinerary generation request
 * @param {string} request.tripId - Trip ID to generate itinerary for
 * @param {string} request.startDate - Trip start date
 * @param {string} request.endDate - Trip end date
 * @param {string[]} request.cityIds - Array of city IDs to visit
 * @param {Object} request.preferences - User preferences
 * @returns {Promise<Object>} Generated itinerary or error
 */
export async function generateItinerary(request) {
  try {
    const { tripId, startDate, endDate, cityIds, preferences = {} } = request

    console.log('📅 Generating itinerary...')
    console.log(`   Trip: ${tripId}`)
    console.log(`   Dates: ${startDate} to ${endDate}`)
    console.log(`   Cities: ${cityIds.length} cities`)

    // STEP 1: Calculate total days
    const start = new Date(startDate)
    const end = new Date(endDate)
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1

    console.log(`   Duration: ${totalDays} days`)

    // STEP 2: Distribute days across cities
    const daysPerCity = Math.floor(totalDays / cityIds.length)
    const remainingDays = totalDays % cityIds.length

    console.log(`   Distribution: ${daysPerCity} days/city + ${remainingDays} extra`)

    // STEP 3: Fetch city details
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .in('id', cityIds)

    if (citiesError) throw citiesError

    // STEP 4: Generate stops and activities
    const stops = []
    let currentDay = 1
    let currentDate = new Date(start)

    for (let i = 0; i < cityIds.length; i++) {
      const cityId = cityIds[i]
      const city = cities.find(c => c.id === cityId)
      const daysInCity = daysPerCity + (i < remainingDays ? 1 : 0)

      console.log(`\n🏙️  ${city.name}: ${daysInCity} days`)

      for (let day = 0; day < daysInCity; day++) {
        const dateStr = currentDate.toISOString().split('T')[0]

        // Generate activities for this day
        const activities = generateDailyActivities(
          city,
          currentDay,
          preferences.pacePreference || 'moderate',
          preferences.activityTypes,
          preferences.budgetPerDay
        )

        // Insert trip stop
        const { data: tripStop, error: stopError } = await supabase
          .from('trip_stops')
          .insert({
            trip_id: tripId,
            city_id: cityId,
            day_number: currentDay,
            stop_date: dateStr,
            notes: `Day ${currentDay} in ${city.name}`
          })
          .select()
          .single()

        if (stopError) throw stopError

        console.log(`   ✅ Day ${currentDay} (${dateStr})`)

        // Insert activities
        for (const activity of activities) {
          const { error: activityError } = await supabase
            .from('activities')
            .insert({
              trip_stop_id: tripStop.id,
              title: activity.title,
              activity_type: activity.activityType,
              start_time: activity.startTime,
              end_time: activity.endTime,
              description: `Estimated cost: $${activity.estimatedCost}`,
              location: `${city.name}, ${city.country}`
            })

          if (activityError) throw activityError

          console.log(`      • ${activity.startTime}-${activity.endTime}: ${activity.title}`)
        }

        stops.push({
          dayNumber: currentDay,
          date: dateStr,
          cityId: cityId,
          cityName: city.name,
          activities: activities,
          totalDailyBudget: activities.reduce((sum, a) => sum + a.estimatedCost, 0)
        })

        currentDay++
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }

    const totalBudget = stops.reduce((sum, s) => sum + s.totalDailyBudget, 0)

    console.log(`\n✅ Itinerary generated!`)
    console.log(`   Total budget: $${totalBudget.toFixed(2)}`)

    return {
      itinerary: {
        tripId,
        stops,
        totalBudget,
        totalDays
      },
      error: null
    }

  } catch (err) {
    console.error('❌ Itinerary generation error:', err.message)
    return {
      itinerary: null,
      error: err.message
    }
  }
}

/**
 * Generate activities for one day based on pace preference
 */
function generateDailyActivities(city, dayNumber, pace, preferredTypes = [], budgetPerDay = 100) {
  const activitiesPerDay = pace === 'relaxed' ? 2 : pace === 'moderate' ? 3 : 5

  // Activity templates with realistic options
  const templates = [
    { title: `Morning Museum Visit in ${city.name}`, type: 'sightseeing', duration: 3, cost: 25 },
    { title: 'Lunch at Local Restaurant', type: 'dining', duration: 2, cost: 30 },
    { title: `Afternoon City Walk - ${city.name}`, type: 'sightseeing', duration: 2, cost: 0 },
    { title: 'Shopping District Visit', type: 'shopping', duration: 2, cost: 50 },
    { title: 'Evening Entertainment', type: 'entertainment', duration: 2, cost: 60 },
    { title: `Historical Site Tour in ${city.name}`, type: 'sightseeing', duration: 3, cost: 20 },
    { title: 'Coffee Break at Cafe', type: 'dining', duration: 1, cost: 10 },
    { title: 'Sunset Viewpoint', type: 'sightseeing', duration: 1, cost: 0 }
  ]

  // Filter by preferred types if specified
  let availableTemplates = templates
  if (preferredTypes && preferredTypes.length > 0) {
    availableTemplates = templates.filter(t => preferredTypes.includes(t.type))
    if (availableTemplates.length === 0) availableTemplates = templates // Fallback
  }

  const activities = []
  let currentTime = 9 // Start at 9 AM
  let totalCost = 0

  for (let i = 0; i < activitiesPerDay && currentTime < 20; i++) {
    const template = availableTemplates[i % availableTemplates.length]
    
    // Check if we're within budget
    if (totalCost + template.cost > budgetPerDay && i > 0) {
      break // Skip expensive activities if over budget
    }

    const startHour = currentTime
    const endHour = currentTime + template.duration

    if (endHour > 20) break // Don't schedule past 8 PM

    activities.push({
      title: template.title,
      startTime: `${String(startHour).padStart(2, '0')}:00`,
      endTime: `${String(endHour).padStart(2, '0')}:00`,
      activityType: template.type,
      estimatedCost: template.cost
    })

    totalCost += template.cost
    currentTime = endHour + 1 // 1 hour break
  }

  return activities
}

/**
 * Get itinerary for a trip (read existing)
 */
export async function getItinerary(tripId) {
  try {
    const { data: stops, error } = await supabase
      .from('trip_stops')
      .select(`
        *,
        cities (name, country),
        activities (*)
      `)
      .eq('trip_id', tripId)
      .order('day_number', { ascending: true })

    if (error) throw error

    return { itinerary: stops, error: null }
  } catch (err) {
    return { itinerary: null, error: err.message }
  }
}
