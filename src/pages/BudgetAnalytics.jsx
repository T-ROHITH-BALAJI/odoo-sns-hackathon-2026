import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, AlertCircle, DollarSign, PieChart as PieChartIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './BudgetAnalytics.css'

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function BudgetAnalytics() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [budgetData, setBudgetData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tripId) {
      fetchBudgetData()
    }
  }, [tripId])

  const fetchBudgetData = async () => {
    try {
      // Fetch trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single()

      if (tripError) throw tripError
      setTrip(tripData)

      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)

      if (expensesError) throw expensesError
      
      const expensesList = expensesData || []
      setExpenses(expensesList)

      // Calculate budget analytics
      calculateBudgetAnalytics(tripData, expensesList)
    } catch (error) {
      console.error('Error fetching budget data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateBudgetAnalytics = (tripData, expensesList) => {
    // Calculate totals by category
    const categoryTotals = {}
    const dailySpending = {}
    
    expensesList.forEach(expense => {
      const category = expense.category || 'Other'
      const amount = expense.actual_cost || expense.estimated_cost || 0
      const date = expense.date || 'Unknown'

      categoryTotals[category] = (categoryTotals[category] || 0) + amount
      dailySpending[date] = (dailySpending[date] || 0) + amount
    })

    // Prepare category data for pie chart
    const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }))

    // Prepare daily spending data for line chart
    const dailyData = Object.entries(dailySpending)
      .map(([date, amount]) => ({
        date,
        amount: parseFloat(amount.toFixed(2))
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    const totalEstimated = expensesList.reduce((sum, exp) => sum + (exp.estimated_cost || 0), 0)
    const totalActual = expensesList.reduce((sum, exp) => sum + (exp.actual_cost || 0), 0)
    const totalBudget = tripData.budget || 0
    const remaining = totalBudget - totalActual
    const drift = totalActual - totalEstimated
    const driftPercentage = totalEstimated > 0 ? ((drift / totalEstimated) * 100).toFixed(1) : 0

    setBudgetData({
      totalBudget,
      totalEstimated,
      totalActual,
      remaining,
      drift,
      driftPercentage,
      categoryData,
      dailyData,
      isOverBudget: totalActual > totalBudget,
      hasDrift: Math.abs(drift) > 0.01
    })
  }

  if (loading) {
    return <div className="loading">Loading budget analytics...</div>
  }

  if (!trip || !budgetData) {
    return (
      <div className="empty-state">
        <p>Trip not found</p>
        <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="budget-analytics">
      <div className="budget-header">
        <div>
          <Link to="/" className="back-link">← Back to Trips</Link>
          <h1>Budget Analytics</h1>
          <p className="trip-name">{trip.name}</p>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="budget-cards">
        <div className="budget-card">
          <div className="card-icon" style={{ backgroundColor: '#EEF2FF' }}>
            <DollarSign size={24} color="#4F46E5" />
          </div>
          <div className="card-content">
            <p className="card-label">Total Budget</p>
            <h2 className="card-value">${budgetData.totalBudget.toFixed(2)}</h2>
          </div>
        </div>

        <div className="budget-card">
          <div className="card-icon" style={{ backgroundColor: '#D1FAE5' }}>
            <DollarSign size={24} color="#10B981" />
          </div>
          <div className="card-content">
            <p className="card-label">Estimated Cost</p>
            <h2 className="card-value">${budgetData.totalEstimated.toFixed(2)}</h2>
          </div>
        </div>

        <div className="budget-card">
          <div className="card-icon" style={{ backgroundColor: budgetData.isOverBudget ? '#FEE2E2' : '#DBEAFE' }}>
            <DollarSign size={24} color={budgetData.isOverBudget ? '#EF4444' : '#3B82F6'} />
          </div>
          <div className="card-content">
            <p className="card-label">Actual Spent</p>
            <h2 className="card-value">${budgetData.totalActual.toFixed(2)}</h2>
          </div>
        </div>

        <div className="budget-card">
          <div className="card-icon" style={{ backgroundColor: budgetData.remaining >= 0 ? '#D1FAE5' : '#FEE2E2' }}>
            {budgetData.remaining >= 0 ? (
              <TrendingUp size={24} color="#10B981" />
            ) : (
              <TrendingDown size={24} color="#EF4444" />
            )}
          </div>
          <div className="card-content">
            <p className="card-label">Remaining</p>
            <h2 className={`card-value ${budgetData.remaining < 0 ? 'negative' : ''}`}>
              ${Math.abs(budgetData.remaining).toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {(budgetData.isOverBudget || budgetData.hasDrift) && (
        <div className="budget-alerts">
          {budgetData.isOverBudget && (
            <div className="alert alert-danger">
              <AlertCircle size={20} />
              <div>
                <strong>Over Budget!</strong>
                <p>You've exceeded your budget by ${(budgetData.totalActual - budgetData.totalBudget).toFixed(2)}</p>
              </div>
            </div>
          )}
          {budgetData.hasDrift && Math.abs(budgetData.drift) > 0.01 && (
            <div className={`alert ${budgetData.drift > 0 ? 'alert-warning' : 'alert-info'}`}>
              <TrendingUp size={20} />
              <div>
                <strong>Budget Drift Detected</strong>
                <p>
                  {budgetData.drift > 0 ? 'Spending' : 'Saving'} ${Math.abs(budgetData.drift).toFixed(2)} 
                  ({budgetData.drift > 0 ? '+' : ''}{budgetData.driftPercentage}%) compared to estimates
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Spending by Category - Pie Chart */}
        <div className="chart-card">
          <h3 className="chart-title">
            <PieChartIcon size={20} />
            Spending by Category
          </h3>
          {budgetData.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {budgetData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No expense data available</div>
          )}
          <div className="legend">
            {budgetData.categoryData.map((item, index) => (
              <div key={item.name} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>{item.name}: ${item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spending Trend - Line Chart */}
        <div className="chart-card">
          <h3 className="chart-title">
            <TrendingUp size={20} />
            Daily Spending Trend
          </h3>
          {budgetData.dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={budgetData.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  name="Daily Spend"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No daily spending data available</div>
          )}
        </div>

        {/* Budget Comparison - Bar Chart */}
        <div className="chart-card full-width">
          <h3 className="chart-title">
            <BarChart size={20} />
            Budget vs Actual Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Budget', amount: budgetData.totalBudget },
              { name: 'Estimated', amount: budgetData.totalEstimated },
              { name: 'Actual', amount: budgetData.totalActual }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar dataKey="amount" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="expenses-table-card">
        <h3>Recent Expenses</h3>
        {expenses.length > 0 ? (
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Estimated</th>
                <th>Actual</th>
                <th>Variance</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => {
                const variance = (expense.actual_cost || 0) - (expense.estimated_cost || 0)
                return (
                  <tr key={expense.id}>
                    <td>{expense.date || 'N/A'}</td>
                    <td>
                      <span className="category-badge">{expense.category || 'Other'}</span>
                    </td>
                    <td>{expense.description || 'N/A'}</td>
                    <td>${(expense.estimated_cost || 0).toFixed(2)}</td>
                    <td>${(expense.actual_cost || 0).toFixed(2)}</td>
                    <td className={variance > 0 ? 'negative' : 'positive'}>
                      {variance !== 0 ? `${variance > 0 ? '+' : ''}$${variance.toFixed(2)}` : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-data">No expenses recorded yet</div>
        )}
      </div>
    </div>
  )
}
