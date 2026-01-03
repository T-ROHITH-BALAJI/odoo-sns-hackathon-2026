// ============================================
// API SERVER - Backend Logic & Intelligence
// ============================================
// Express.js REST API for GlobeTrotter Hackathon
// Member 2 - Backend Logic & Intelligence Engineer

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Import route modules
import itineraryRoutes from './routes/itinerary.js'
import budgetRoutes from './routes/budget.js'
import routeRoutes from './routes/route.js'

const app = express()
const PORT = process.env.PORT || 3001

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS for frontend integration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Parse JSON request bodies
app.use(express.json())

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.path}`)
  next()
})

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GlobeTrotter Backend API',
    version: '1.0.0',
    member: 'Backend Logic & Intelligence Engineer',
    endpoints: {
      itinerary: '/api/itinerary',
      budget: '/api/budget',
      route: '/api/route'
    },
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/itinerary', itineraryRoutes)
app.use('/api/budget', budgetRoutes)
app.use('/api/route', routeRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  })
})

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60))
  console.log('🚀 GlobeTrotter Backend API Server')
  console.log('='.repeat(60))
  console.log(`📍 Server running on: http://localhost:${PORT}`)
  console.log(`📅 Started at: ${new Date().toISOString()}`)
  console.log('\n📚 Available Endpoints:')
  console.log('   GET  / → API info')
  console.log('\n   📅 Itinerary:')
  console.log('   POST /api/itinerary/generate → Generate itinerary')
  console.log('   GET  /api/itinerary/:tripId → Get itinerary')
  console.log('   GET  /api/itinerary/:tripId/summary → Get summary')
  console.log('\n   💰 Budget:')
  console.log('   GET  /api/budget/:tripId?planned=1500 → Calculate drift')
  console.log('   POST /api/budget/expense → Add expense')
  console.log('   GET  /api/budget/expenses/:tripId → Get all expenses')
  console.log('   GET  /api/budget/validate/:tripId?planned=1500 → Quick validation')
  console.log('\n   🗺️  Route:')
  console.log('   POST /api/route/optimize → Optimize city order')
  console.log('   POST /api/route/distance-matrix → Get distance matrix')
  console.log('   GET  /api/route/health → Health check')
  console.log('\n' + '='.repeat(60) + '\n')
})

export default app
