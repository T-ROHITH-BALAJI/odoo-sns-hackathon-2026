import { useState, useEffect } from 'react'
import { MapPin, Calendar, DollarSign, Users, Heart, Share2, Copy } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './CommunityTrips.css'

export default function CommunityTrips() {
  const [publicTrips, setPublicTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'popular', 'recent'
  const [selectedTrip, setSelectedTrip] = useState(null)

  useEffect(() => {
    fetchPublicTrips()
  }, [filter])

  const fetchPublicTrips = async () => {
    try {
      let query = supabase
        .from('trips')
        .select(`
          *,
          user:users (name, email),
          stops:trip_stops (
            id,
            start_date,
            end_date,
            cities (name, country)
          )
        `)
        .eq('is_public', true)

      if (filter === 'popular') {
        query = query.order('likes_count', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      query = query.limit(20)

      const { data, error } = await query

      if (error) throw error
      setPublicTrips(data || [])
    } catch (error) {
      console.error('Error fetching public trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLikeTrip = async (tripId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Check if already liked
      const { data: existing } = await supabase
        .from('trip_likes')
        .select('id')
        .eq('trip_id', tripId)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        // Unlike
        await supabase.from('trip_likes').delete().eq('id', existing.id)
      } else {
        // Like
        await supabase.from('trip_likes').insert({ trip_id: tripId, user_id: user.id })
      }

      fetchPublicTrips()
    } catch (error) {
      console.error('Error liking trip:', error)
    }
  }

  const handleCopyTrip = async (trip) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Create a copy of the trip
      const { data: newTrip, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          name: `${trip.name} (Copy)`,
          description: trip.description,
          start_date: trip.start_date,
          end_date: trip.end_date,
          budget: trip.budget,
          is_public: false
        })
        .select()
        .single()

      if (tripError) throw tripError

      // Copy trip stops
      if (trip.stops && trip.stops.length > 0) {
        const stopsCopy = trip.stops.map(stop => ({
          trip_id: newTrip.id,
          city_id: stop.city_id,
          start_date: stop.start_date,
          end_date: stop.end_date,
          order_index: stop.order_index
        }))

        await supabase.from('trip_stops').insert(stopsCopy)
      }

      alert('Trip copied successfully! Check your dashboard.')
    } catch (error) {
      console.error('Error copying trip:', error)
      alert('Failed to copy trip')
    }
  }

  const handleShareTrip = (trip) => {
    const url = `${window.location.origin}/trip/${trip.id}`
    navigator.clipboard.writeText(url)
    alert('Trip link copied to clipboard!')
  }

  if (loading) {
    return <div className="loading">Loading community trips...</div>
  }

  return (
    <div className="community-trips">
      <div className="community-header">
        <div>
          <h1>Community Trips</h1>
          <p>Discover and get inspired by trips from fellow travelers</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Trips
        </button>
        <button
          className={`filter-tab ${filter === 'popular' ? 'active' : ''}`}
          onClick={() => setFilter('popular')}
        >
          Most Popular
        </button>
        <button
          className={`filter-tab ${filter === 'recent' ? 'active' : ''}`}
          onClick={() => setFilter('recent')}
        >
          Recently Added
        </button>
      </div>

      {publicTrips.length === 0 ? (
        <div className="empty-state">
          <Users size={64} color="var(--gray-400)" />
          <h2>No public trips yet</h2>
          <p>Be the first to share your travel plans with the community!</p>
        </div>
      ) : (
        <div className="trips-grid">
          {publicTrips.map((trip) => (
            <div key={trip.id} className="community-trip-card">
              <div className="trip-image-placeholder">
                <MapPin size={48} color="white" />
              </div>
              
              <div className="trip-content">
                <div className="trip-header">
                  <h3>{trip.name}</h3>
                  <div className="trip-author">
                    by {trip.user?.name || trip.user?.email?.split('@')[0] || 'Anonymous'}
                  </div>
                </div>

                {trip.description && (
                  <p className="trip-description">{trip.description}</p>
                )}

                <div className="trip-meta-info">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{trip.start_date} - {trip.end_date}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{trip.stops?.length || 0} destinations</span>
                  </div>
                  {trip.budget && (
                    <div className="meta-item">
                      <DollarSign size={16} />
                      <span>${trip.budget}</span>
                    </div>
                  )}
                </div>

                {trip.stops && trip.stops.length > 0 && (
                  <div className="trip-destinations">
                    <h4>Destinations:</h4>
                    <div className="destination-tags">
                      {trip.stops.slice(0, 4).map((stop, index) => (
                        <span key={index} className="destination-tag">
                          {stop.cities?.name}
                        </span>
                      ))}
                      {trip.stops.length > 4 && (
                        <span className="destination-tag more">
                          +{trip.stops.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="trip-actions">
                  <button
                    className="action-btn like-btn"
                    onClick={() => handleLikeTrip(trip.id)}
                  >
                    <Heart size={18} />
                    <span>{trip.likes_count || 0}</span>
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => handleShareTrip(trip)}
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                  <button
                    className="action-btn copy-btn"
                    onClick={() => handleCopyTrip(trip)}
                  >
                    <Copy size={18} />
                    Copy Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <div className="modal-overlay" onClick={() => setSelectedTrip(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTrip(null)}>
              ×
            </button>
            <h2>{selectedTrip.name}</h2>
            <p>{selectedTrip.description}</p>
            {/* Add more detailed trip information here */}
          </div>
        </div>
      )}
    </div>
  )
}
