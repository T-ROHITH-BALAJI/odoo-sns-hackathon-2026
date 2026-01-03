// ============================================
// ROUTE OPTIMIZER - Backend Logic
// ============================================
// Optimize city visiting order to minimize distance

import { supabaseBackend as supabase } from '../lib/supabase-backend.js'

/**
 * Optimize the order of cities to minimize travel distance
 * @param {string[]} cityIds - Array of city IDs to optimize
 * @returns {Promise<Object>} Optimized route or error
 */
export async function optimizeCityRoute(cityIds) {
  try {
    console.log('🗺️  Optimizing route...')
    console.log(`   Cities to optimize: ${cityIds.length}`)

    // Fetch city details
    const { data: cities, error } = await supabase
      .from('cities')
      .select('*')
      .in('id', cityIds)

    if (error) throw error

    // If only 1-2 cities, no optimization needed
    if (cities.length <= 2) {
      return {
        route: {
          cityIds: cities.map(c => c.id),
          cities: cities.map(c => ({ id: c.id, name: c.name, country: c.country })),
          totalDistance: cities.length === 2 ? calculateDistance(cities[0], cities[1]) : 0,
          savings: 0,
          originalDistance: cities.length === 2 ? calculateDistance(cities[0], cities[1]) : 0
        },
        error: null
      }
    }

    // Calculate original distance (in order given)
    let originalDistance = 0
    for (let i = 0; i < cities.length - 1; i++) {
      originalDistance += calculateDistance(cities[i], cities[i + 1])
    }

    console.log(`   Original distance: ${originalDistance.toFixed(0)} km`)

    // Nearest neighbor algorithm for optimization
    const visited = new Set()
    const route = []
    let current = cities[0] // Start with first city
    route.push(current)
    visited.add(current.id)

    let totalDistance = 0

    while (visited.size < cities.length) {
      let nearest = null
      let minDistance = Infinity

      for (const city of cities) {
        if (!visited.has(city.id)) {
          const dist = calculateDistance(current, city)
          if (dist < minDistance) {
            minDistance = dist
            nearest = city
          }
        }
      }

      if (nearest) {
        route.push(nearest)
        visited.add(nearest.id)
        totalDistance += minDistance
        console.log(`   ${current.name} → ${nearest.name}: ${minDistance.toFixed(0)} km`)
        current = nearest
      }
    }

    const savings = originalDistance - totalDistance
    const savingsPercent = (savings / originalDistance) * 100

    console.log(`\n✅ Route optimized!`)
    console.log(`   Optimized distance: ${totalDistance.toFixed(0)} km`)
    console.log(`   Savings: ${savings.toFixed(0)} km (${savingsPercent.toFixed(1)}%)`)

    return {
      route: {
        cityIds: route.map(c => c.id),
        cities: route.map(c => ({ id: c.id, name: c.name, country: c.country })),
        totalDistance,
        savings,
        originalDistance,
        savingsPercent
      },
      error: null
    }

  } catch (err) {
    console.error('❌ Route optimization error:', err.message)
    return {
      route: null,
      error: err.message
    }
  }
}

/**
 * Calculate distance between two cities using Haversine formula
 * @param {Object} city1 - First city with lat/lng
 * @param {Object} city2 - Second city with lat/lng
 * @returns {number} Distance in kilometers
 */
function calculateDistance(city1, city2) {
  const R = 6371 // Earth radius in km

  const lat1 = city1.latitude
  const lon1 = city1.longitude
  const lat2 = city2.latitude
  const lon2 = city2.longitude

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

/**
 * Convert degrees to radians
 */
function toRad(degrees) {
  return degrees * (Math.PI / 180)
}

/**
 * Get distance matrix for all city pairs
 */
export async function getDistanceMatrix(cityIds) {
  try {
    const { data: cities, error } = await supabase
      .from('cities')
      .select('*')
      .in('id', cityIds)

    if (error) throw error

    const matrix = {}
    
    for (const city1 of cities) {
      matrix[city1.id] = {}
      for (const city2 of cities) {
        if (city1.id === city2.id) {
          matrix[city1.id][city2.id] = 0
        } else {
          matrix[city1.id][city2.id] = calculateDistance(city1, city2)
        }
      }
    }

    return { matrix, error: null }
  } catch (err) {
    return { matrix: null, error: err.message }
  }
}
