// ============================================
// ROUTE OPTIMIZATION API ROUTES
// ============================================
// Endpoints for city route optimization

import express from 'express'
import { optimizeCityRoute, getDistanceMatrix } from '../../src/route-optimizer.js'

const router = express.Router()

/**
 * POST /api/route/optimize
 * Optimize the order of cities to minimize travel distance
 * 
 * Body: {
 *   cityIds: string[]
 * }
 */
router.post('/optimize', async (req, res) => {
  try {
    const { cityIds } = req.body

    // Validation
    if (!cityIds || !Array.isArray(cityIds) || cityIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid cityIds array'
      })
    }

    if (cityIds.length > 20) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 20 cities allowed for optimization'
      })
    }

    console.log(`🗺️  API: Optimizing route for ${cityIds.length} cities`)

    const { route, error } = await optimizeCityRoute(cityIds)

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }

    res.json({
      success: true,
      data: route,
      message: `Optimized route: ${route.cities.map(c => c.name).join(' → ')}`
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
 * POST /api/route/distance-matrix
 * Get distance matrix for all city pairs
 * 
 * Body: {
 *   cityIds: string[]
 * }
 */
router.post('/distance-matrix', async (req, res) => {
  try {
    const { cityIds } = req.body

    if (!cityIds || !Array.isArray(cityIds) || cityIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid cityIds array'
      })
    }

    console.log(`📏 API: Calculating distance matrix for ${cityIds.length} cities`)

    const { matrix, error } = await getDistanceMatrix(cityIds)

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }

    res.json({
      success: true,
      data: matrix,
      message: `Distance matrix generated for ${cityIds.length} cities`
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
 * GET /api/route/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Route optimization API is running',
    timestamp: new Date().toISOString()
  })
})

export default router
