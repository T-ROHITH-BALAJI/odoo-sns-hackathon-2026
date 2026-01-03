// ============================================
// BUDGET API ROUTES
// ============================================
// Endpoints for budget calculation and expense tracking

import express from 'express'
import { calculateBudgetDrift, addExpense, getExpenses } from '../../src/budget-calculator.js'
import { validateBudget, validateExpense } from '../../src/edge-case-handlers.js'

const router = express.Router()

/**
 * GET /api/budget/:tripId?planned=1500
 * Calculate budget drift and get analysis
 */
router.get('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params
    const plannedBudget = parseFloat(req.query.planned)

    if (!plannedBudget || isNaN(plannedBudget)) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "planned" query parameter'
      })
    }

    console.log(`💰 API: Calculating budget for trip ${tripId}`)

    const { analysis, error } = await calculateBudgetDrift(tripId, plannedBudget)

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }

    res.json({
      success: true,
      data: analysis,
      message: `Budget status: ${analysis.status}`
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
 * POST /api/budget/expense
 * Add a new expense
 * 
 * Body: {
 *   tripId: string,
 *   category: 'food' | 'transport' | 'accommodation' | 'activities' | 'shopping' | 'other',
 *   amount: number,
 *   description: string,
 *   expenseDate: string (YYYY-MM-DD),
 *   tripStopId?: string (optional)
 * }
 */
router.post('/expense', async (req, res) => {
  try {
    const { tripId, category, amount, description, expenseDate, tripStopId } = req.body

    // Validation
    if (!tripId || !category || !amount || !expenseDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tripId, category, amount, expenseDate'
      })
    }

    // Validate expense using edge case handler
    const validation = validateExpense(amount, category, description)
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid expense',
        validationErrors: validation.errors,
        validationWarnings: validation.warnings
      })
    }

    console.log(`💵 API: Adding expense $${amount} for trip ${tripId}`)

    const { expense, error } = await addExpense(tripId, {
      category,
      amount,
      description: description || '',
      expense_date: expenseDate,
      trip_stop_id: tripStopId || null
    })

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }

    res.json({
      success: true,
      data: expense,
      message: `Added expense: $${amount}`,
      warnings: validation.warnings
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
 * GET /api/budget/expenses/:tripId
 * Get all expenses for a trip
 */
router.get('/expenses/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params

    console.log(`📋 API: Fetching expenses for trip ${tripId}`)

    const { expenses, error } = await getExpenses(tripId)

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }

    // Calculate total
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

    res.json({
      success: true,
      data: {
        expenses,
        total,
        count: expenses.length
      },
      message: `Found ${expenses.length} expenses`
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
 * GET /api/budget/validate/:tripId?planned=1500
 * Validate budget without full analysis (faster)
 */
router.get('/validate/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params
    const plannedBudget = parseFloat(req.query.planned)

    if (!plannedBudget || isNaN(plannedBudget)) {
      return res.status(400).json({
        success: false,
        error: 'Missing "planned" query parameter'
      })
    }

    // Get expenses
    const { expenses, error } = await getExpenses(tripId)

    if (error) {
      return res.status(500).json({ success: false, error })
    }

    // Quick validation using edge case handler
    const validation = validateBudget(plannedBudget, expenses)

    res.json({
      success: true,
      data: {
        isValid: validation.isValid,
        totalSpent: validation.totalSpent,
        remaining: validation.remaining,
        percentUsed: validation.percentUsed,
        errors: validation.errors,
        warnings: validation.warnings
      }
    })

  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
