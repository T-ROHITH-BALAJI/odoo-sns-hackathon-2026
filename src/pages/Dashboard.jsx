import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MapPin, Calendar as CalendarIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './Dashboard.css'

export default function Dashboard() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTrips(data || [])
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Trips</h1>
          <p>Plan, organize, and track your travel adventures</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          New Trip
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading trips...</div>
      ) : trips.length === 0 ? (
        <div className="empty-state">
          <MapPin size={64} color="var(--gray-400)" />
          <h2>No trips yet</h2>
          <p>Start planning your next adventure!</p>
          <button className="btn btn-primary">
            <Plus size={20} />
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => (
            <div key={trip.id} className="trip-card">
              <div className="trip-card-header">
                <h3>{trip.name}</h3>
                <span className="trip-status">{trip.status || 'Planning'}</span>
              </div>
              <div className="trip-card-body">
                <div className="trip-meta">
                  <CalendarIcon size={16} />
                  <span>{trip.start_date} - {trip.end_date}</span>
                </div>
                <div className="trip-meta">
                  <MapPin size={16} />
                  <span>{trip.destination_count || 0} destinations</span>
                </div>
              </div>
              <div className="trip-card-footer">
                <Link to={`/calendar/${trip.id}`} className="btn btn-secondary">
                  View Calendar
                </Link>
                <Link to={`/budget/${trip.id}`} className="btn btn-secondary">
                  Budget
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
