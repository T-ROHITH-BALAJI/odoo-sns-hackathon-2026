// ============================================
// ITINERARY API ROUTES
// ============================================
// Endpoints for itinerary generation and retrieval

import express from 'express'
import { generateItinerary, getItinerary } from '../../src/itinerary-engine.js'
import { validateTrip } from '../../src/edge-case-handlers.js'

const router = express.Router()

/**
 * POST /api/itinerary/generate
 * Generate a new itinerary for a trip
 * 
 * Body: {
 *   tripId: string,
 *   startDate: string (YYYY-MM-DD),
 *   endDate: string (YYYY-MM-DD),
 *   cityIds: string[],
 *   preferences: {
 *     pacePreference: 'relaxed' | 'moderate' | 'packed',
 *     activityTypes: string[],
 *     budgetPerDay: number
 *   }
 * }
 */
router.post('/generate', async (req, res) => {
  try {
    const { tripId, startDate, endDate, cityIds, preferences } = req.body

    // Validation
    if (!tripId || !startDate || !endDate || !cityIds || cityIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tripId, startDate, endDate, cityIds'
      })
    }

    console.log(`📅 API: Generating itinerary for trip ${tripId}`)

    // Call your backend logic
    const { itinerary, error } = await generateItinerary({
      tripId,
      startDate,
      endDate,
      cityIds,
      preferences: preferences || {}
    })

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }

    res.json({
      success: true,
      data: itinerary,
      message: `Generated ${itinerary.totalDays}-day itinerary with ${itinerary.stops.length} stops`
    })

  } catch (err) {
    console.error('❌ API Error:', err)
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
})

/**
 * GET /api/itinerary/:tripId
 * Get existing itinerary for a trip
 */
router.get('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params

    console.log(`📖 API: Fetching itinerary for trip ${tripId}`)

    const { itinerary, error } = await getItinerary(tripId)

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }

    if (!itinerary || itinerary.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No itinerary found for this trip'
      })
    }

    res.json({
      success: true,
      data: itinerary,
      message: `Found ${itinerary.length} stops`
    })

  } catch (err) {
    console.error('❌ API Error:', err)
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
})

/**
 * GET /api/itinerary/:tripId/summary
 * Get itinerary summary with statistics
 */
router.get('/:tripId/summary', async (req, res) => {
  try {
    const { tripId } = req.params

    const { itinerary, error } = await getItinerary(tripId)

    if (error) {
      return res.status(500).json({ success: false, error })
    }

    if (!itinerary || itinerary.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No itinerary found'
      })
    }

    // Calculate summary statistics
    const totalDays = itinerary.length
    const totalActivities = itinerary.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0)
    const cities = [...new Set(itinerary.map(stop => stop.cities?.name).filter(Boolean))]

    res.json({
      success: true,
      data: {
        totalDays,
        totalActivities,
        cities,
        stops: itinerary
      }
    })

  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
