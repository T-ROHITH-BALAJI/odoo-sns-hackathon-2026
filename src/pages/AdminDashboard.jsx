import { useState, useEffect } from 'react'
import { Users, MapPin, TrendingUp, Calendar, Activity, Globe } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './AdminDashboard.css'

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Fetch trip statistics
      const { data: trips } = await supabase
        .from('trips')
        .select('id, created_at, status, budget, is_public')

      // Fetch cities data
      const { data: cities } = await supabase
        .from('cities')
        .select('id, name, country')

      // Fetch activity data
      const { data: activities } = await supabase
        .from('activities')
        .select('id, category, estimated_cost')

      // Fetch trip stops to find popular destinations
      const { data: tripStops } = await supabase
        .from('trip_stops')
        .select('city_id, cities(name, country)')

      // Calculate statistics
      const totalTrips = trips?.length || 0
      const publicTrips = trips?.filter(t => t.is_public)?.length || 0
      const totalCities = cities?.length || 0
      const totalActivities = activities?.length || 0

      // Trip status breakdown
      const statusBreakdown = {}
      trips?.forEach(trip => {
        const status = trip.status || 'Planning'
        statusBreakdown[status] = (statusBreakdown[status] || 0) + 1
      })

      const statusData = Object.entries(statusBreakdown).map(([name, value]) => ({
        name,
        value
      }))

      // Monthly trip creation trend
      const monthlyData = {}
      trips?.forEach(trip => {
        const date = new Date(trip.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
      })

      const trendData = Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, count]) => ({
          month,
          trips: count
        }))

      // Popular destinations
      const destinationCounts = {}
      tripStops?.forEach(stop => {
        const cityName = stop.cities?.name
        if (cityName) {
          destinationCounts[cityName] = (destinationCounts[cityName] || 0) + 1
        }
      })

      const popularDestinations = Object.entries(destinationCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, value]) => ({ name, value }))

      // Activity category breakdown
      const categoryBreakdown = {}
      activities?.forEach(activity => {
        const category = activity.category || 'Other'
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1
      })

      const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({
        name,
        value
      }))

      // Average budget calculation
      const budgets = trips?.map(t => t.budget || 0).filter(b => b > 0) || []
      const avgBudget = budgets.length > 0 
        ? budgets.reduce((sum, b) => sum + b, 0) / budgets.length 
        : 0

      setStats({
        userCount: userCount || 0,
        totalTrips,
        publicTrips,
        totalCities,
        totalActivities,
        avgBudget,
        statusData,
        trendData,
        popularDestinations,
        categoryData,
        engagementRate: totalTrips > 0 ? ((publicTrips / totalTrips) * 100).toFixed(1) : 0
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading analytics...</div>
  }

  if (!stats) {
    return (
      <div className="empty-state">
        <p>Unable to load analytics</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Analytics Dashboard</h1>
        <p>Platform usage and user engagement insights</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#EEF2FF' }}>
            <Users size={24} color="#4F46E5" />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Users</p>
            <h2 className="kpi-value">{stats.userCount}</h2>
            <p className="kpi-change positive">
              <TrendingUp size={14} />
              Active platform users
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#D1FAE5' }}>
            <Calendar size={24} color="#10B981" />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Trips</p>
            <h2 className="kpi-value">{stats.totalTrips}</h2>
            <p className="kpi-change">
              {stats.publicTrips} public trips
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#FEF3C7' }}>
            <Globe size={24} color="#F59E0B" />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Destinations</p>
            <h2 className="kpi-value">{stats.totalCities}</h2>
            <p className="kpi-change">
              Available cities
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#DBEAFE' }}>
            <Activity size={24} color="#3B82F6" />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Activities</p>
            <h2 className="kpi-value">{stats.totalActivities}</h2>
            <p className="kpi-change">
              Total activities
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#E9D5FF' }}>
            <TrendingUp size={24} color="#8B5CF6" />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Avg Budget</p>
            <h2 className="kpi-value">${stats.avgBudget.toFixed(0)}</h2>
            <p className="kpi-change">
              Per trip
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#FCE7F3' }}>
            <Users size={24} color="#EC4899" />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Engagement</p>
            <h2 className="kpi-value">{stats.engagementRate}%</h2>
            <p className="kpi-change">
              Public trip share rate
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-grid">
        {/* Trip Creation Trend */}
        <div className="chart-card full-width">
          <h3 className="chart-title">
            <TrendingUp size={20} />
            Trip Creation Trend (Last 6 Months)
          </h3>
          {stats.trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="trips" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  name="Trips Created"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No trend data available</div>
          )}
        </div>

        {/* Trip Status Breakdown */}
        <div className="chart-card">
          <h3 className="chart-title">
            <Activity size={20} />
            Trip Status Distribution
          </h3>
          {stats.statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No status data available</div>
          )}
        </div>

        {/* Activity Categories */}
        <div className="chart-card">
          <h3 className="chart-title">
            <MapPin size={20} />
            Activity Categories
          </h3>
          {stats.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No category data available</div>
          )}
        </div>

        {/* Popular Destinations */}
        <div className="chart-card full-width">
          <h3 className="chart-title">
            <Globe size={20} />
            Top 10 Popular Destinations
          </h3>
          {stats.popularDestinations.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.popularDestinations} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No destination data available</div>
          )}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="activity-table-card">
        <h3>Platform Metrics Summary</h3>
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>User Adoption</td>
              <td>{stats.userCount} users</td>
              <td>Total registered users on the platform</td>
            </tr>
            <tr>
              <td>Trip Creation Rate</td>
              <td>{(stats.totalTrips / Math.max(stats.userCount, 1)).toFixed(2)} trips/user</td>
              <td>Average trips created per user</td>
            </tr>
            <tr>
              <td>Public Engagement</td>
              <td>{stats.engagementRate}%</td>
              <td>Percentage of trips marked as public</td>
            </tr>
            <tr>
              <td>Content Library</td>
              <td>{stats.totalActivities} activities</td>
              <td>Total available activities across all destinations</td>
            </tr>
            <tr>
              <td>Geographic Coverage</td>
              <td>{stats.totalCities} cities</td>
              <td>Number of supported destination cities</td>
            </tr>
            <tr>
              <td>Average Budget</td>
              <td>${stats.avgBudget.toFixed(2)}</td>
              <td>Mean budget across all trips</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
