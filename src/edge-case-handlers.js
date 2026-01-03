// ============================================
// EDGE CASE HANDLERS - Backend Logic
// ============================================
// Validate and handle edge cases (overbooked, overbudget, conflicts)

/**
 * Validate if a day's schedule is overbooked
 * @param {Array} activities - Array of activities with start/end times
 * @returns {Object} Validation result with errors and warnings
 */
export function validateDaySchedule(activities) {
  const errors = []
  const warnings = []

  if (!activities || activities.length === 0) {
    return { isValid: true, errors, warnings, totalHours: 0 }
  }

  // Calculate total hours
  let totalHours = 0
  for (const activity of activities) {
    if (!activity.startTime || !activity.endTime) continue
    
    const start = parseTime(activity.startTime)
    const end = parseTime(activity.endTime)
    const duration = end - start
    
    if (duration < 0) {
      errors.push(`Invalid time range: ${activity.title} (${activity.startTime} to ${activity.endTime})`)
      continue
    }
    
    totalHours += duration
  }

  // Check if overbooked
  if (totalHours > 14) {
    errors.push(`Day is severely overbooked: ${totalHours.toFixed(1)} hours (max 14 hours recommended)`)
  } else if (totalHours > 12) {
    warnings.push(`Day is overbooked: ${totalHours.toFixed(1)} hours (recommended: 10-12 hours)`)
  } else if (totalHours > 10) {
    warnings.push(`Day is packed: ${totalHours.toFixed(1)} hours of activities`)
  }

  // Check for overlapping activities
  const sorted = [...activities]
    .filter(a => a.startTime && a.endTime)
    .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime))

  for (let i = 0; i < sorted.length - 1; i++) {
    const endCurrent = parseTime(sorted[i].endTime)
    const startNext = parseTime(sorted[i + 1].startTime)
    
    if (endCurrent > startNext) {
      errors.push(
        `Time conflict: "${sorted[i].title}" (ends ${sorted[i].endTime}) ` +
        `overlaps with "${sorted[i + 1].title}" (starts ${sorted[i + 1].startTime})`
      )
    } else if (endCurrent === startNext) {
      warnings.push(
        `No break between: "${sorted[i].title}" and "${sorted[i + 1].title}" ` +
        `(recommended: 30-60 min break)`
      )
    }
  }

  // Check if activities are too early or too late
  for (const activity of sorted) {
    const start = parseTime(activity.startTime)
    if (start < 7) {
      warnings.push(`Early start: "${activity.title}" at ${activity.startTime} (before 7 AM)`)
    }
    if (start > 22) {
      warnings.push(`Late activity: "${activity.title}" at ${activity.startTime} (after 10 PM)`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalHours,
    activityCount: activities.length
  }
}

/**
 * Validate if budget is exceeded
 * @param {number} plannedBudget - Planned total budget
 * @param {Array} expenses - Array of expense objects with amount
 * @returns {Object} Validation result with errors and warnings
 */
export function validateBudget(plannedBudget, expenses) {
  const errors = []
  const warnings = []

  if (!expenses || expenses.length === 0) {
    return { isValid: true, errors, warnings, remaining: plannedBudget }
  }

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const remaining = plannedBudget - totalSpent
  const percentUsed = (totalSpent / plannedBudget) * 100

  // Check if over budget
  if (remaining < 0) {
    errors.push(
      `OVER BUDGET by $${Math.abs(remaining).toFixed(2)} ` +
      `(spent: $${totalSpent.toFixed(2)}, planned: $${plannedBudget.toFixed(2)})`
    )
  } else if (percentUsed > 90) {
    warnings.push(
      `Budget almost exhausted: ${percentUsed.toFixed(0)}% used ` +
      `(only $${remaining.toFixed(2)} remaining)`
    )
  } else if (percentUsed > 75) {
    warnings.push(
      `Budget running low: ${percentUsed.toFixed(0)}% used ` +
      `($${remaining.toFixed(2)} remaining)`
    )
  }

  // Check for unusually large expenses
  const avgExpense = totalSpent / expenses.length
  for (const expense of expenses) {
    if (Number(expense.amount) > avgExpense * 3) {
      warnings.push(
        `Large expense detected: $${expense.amount} for "${expense.description || expense.category}" ` +
        `(3x average expense)`
      )
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalSpent,
    remaining,
    percentUsed
  }
}

/**
 * Validate trip dates and duration
 */
export function validateTripDates(startDate, endDate) {
  const errors = []
  const warnings = []

  const start = new Date(startDate)
  const end = new Date(endDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if dates are valid
  if (isNaN(start.getTime())) {
    errors.push('Invalid start date')
  }
  if (isNaN(end.getTime())) {
    errors.push('Invalid end date')
  }

  if (errors.length > 0) {
    return { isValid: false, errors, warnings }
  }

  // Check if end date is before start date
  if (end < start) {
    errors.push('End date must be after start date')
  }

  // Check if trip is in the past
  if (start < today) {
    warnings.push('Trip start date is in the past')
  }

  // Calculate duration
  const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1

  if (durationDays > 30) {
    warnings.push(`Very long trip: ${durationDays} days (consider splitting into multiple trips)`)
  } else if (durationDays === 1) {
    warnings.push('Single-day trip (consider extending for better experience)')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    durationDays
  }
}

/**
 * Helper: Parse time string to decimal hours
 */
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours + (minutes || 0) / 60
}

/**
 * Validate expense amount
 */
export function validateExpense(amount, category, description) {
  const errors = []
  const warnings = []

  if (amount <= 0) {
    errors.push('Expense amount must be positive')
  }

  if (amount > 10000) {
    warnings.push(`Very large expense: $${amount.toFixed(2)} (verify this is correct)`)
  }

  if (!category) {
    warnings.push('No category specified for expense')
  }

  if (!description || description.trim() === '') {
    warnings.push('No description provided for expense')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Comprehensive trip validation
 */
export function validateTrip(trip, stops, expenses) {
  const results = {
    dates: validateTripDates(trip.start_date, trip.end_date),
    budget: null,
    schedule: [],
    overall: { errors: [], warnings: [] }
  }

  // Validate budget if available
  if (trip.planned_budget && expenses) {
    results.budget = validateBudget(trip.planned_budget, expenses)
  }

  // Validate each day's schedule if stops available
  if (stops && stops.length > 0) {
    for (const stop of stops) {
      if (stop.activities && stop.activities.length > 0) {
        const validation = validateDaySchedule(stop.activities)
        results.schedule.push({
          dayNumber: stop.day_number,
          cityName: stop.cities?.name,
          ...validation
        })
      }
    }
  }

  // Aggregate all errors and warnings
  results.overall.errors = [
    ...results.dates.errors,
    ...(results.budget?.errors || []),
    ...results.schedule.flatMap(s => s.errors)
  ]

  results.overall.warnings = [
    ...results.dates.warnings,
    ...(results.budget?.warnings || []),
    ...results.schedule.flatMap(s => s.warnings)
  ]

  results.overall.isValid = results.overall.errors.length === 0

  return results
}
