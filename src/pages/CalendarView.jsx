import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MapPin, DollarSign, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns'
import './CalendarView.css'

export default function CalendarView() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' or 'timeline'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tripId) {
      fetchTripData()
    }
  }, [tripId])

  const fetchTripData = async () => {
    try {
      // Fetch trip details
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single()

      if (tripError) throw tripError
      setTrip(tripData)

      // Fetch trip stops with activities
      const { data: stopsData, error: stopsError } = await supabase
        .from('trip_stops')
        .select(`
          *,
          cities (name, country),
          activities:trip_activities (
            *,
            activity:activities (name, category, estimated_cost)
          )
        `)
        .eq('trip_id', tripId)
        .order('start_date', { ascending: true })

      if (stopsError) throw stopsError
      setStops(stopsData || [])
    } catch (error) {
      console.error('Error fetching trip data:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getActivitiesForDate = (date) => {
    return stops.filter(stop => {
      if (!stop.start_date) return false
      const stopStart = parseISO(stop.start_date)
      const stopEnd = stop.end_date ? parseISO(stop.end_date) : stopStart
      return date >= stopStart && date <= stopEnd
    })
  }

  const nextMonth = () => setCurrentMonth(addDays(monthStart, 32))
  const prevMonth = () => setCurrentMonth(addDays(monthStart, -1))

  if (loading) {
    return <div className="loading">Loading calendar...</div>
  }

  if (!trip) {
    return (
      <div className="empty-state">
        <p>Trip not found</p>
        <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div>
          <Link to="/" className="back-link">← Back to Trips</Link>
          <h1>{trip.name}</h1>
          <p className="trip-dates">
            {trip.start_date} - {trip.end_date}
          </p>
        </div>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </button>
          <button
            className={`toggle-btn ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="calendar-container">
          <div className="calendar-controls">
            <button onClick={prevMonth} className="btn btn-secondary">
              <ChevronLeft size={20} />
            </button>
            <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={nextMonth} className="btn btn-secondary">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {monthDays.map(day => {
                const activities = getActivitiesForDate(day)
                const isToday = isSameDay(day, new Date())
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                
                return (
                  <div
                    key={day.toString()}
                    className={`calendar-day ${!isSameMonth(day, currentMonth) ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${activities.length > 0 ? 'has-activities' : ''}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="day-number">{format(day, 'd')}</div>
                    {activities.length > 0 && (
                      <div className="day-indicators">
                        {activities.slice(0, 2).map((stop, idx) => (
                          <div key={idx} className="activity-dot" title={stop.cities?.name}>
                            <MapPin size={12} />
                          </div>
                        ))}
                        {activities.length > 2 && (
                          <span className="more-indicator">+{activities.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="day-details">
              <h3>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
              {getActivitiesForDate(selectedDate).length > 0 ? (
                <div className="activities-list">
                  {getActivitiesForDate(selectedDate).map(stop => (
                    <div key={stop.id} className="activity-item">
                      <div className="activity-header">
                        <MapPin size={18} />
                        <h4>{stop.cities?.name}</h4>
                      </div>
                      {stop.activities && stop.activities.length > 0 && (
                        <div className="sub-activities">
                          {stop.activities.map(act => (
                            <div key={act.id} className="sub-activity">
                              <span className="activity-name">{act.activity?.name}</span>
                              <span className="activity-cost">${act.activity?.estimated_cost}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-activities">No activities scheduled for this day</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="timeline-container">
          <div className="timeline">
            {stops.map((stop, index) => (
              <div key={stop.id} className="timeline-item">
                <div className="timeline-marker">
                  <div className="timeline-dot">{index + 1}</div>
                  {index < stops.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="timeline-content">
                  <div className="timeline-date">
                    <Clock size={16} />
                    {stop.start_date} {stop.end_date && `- ${stop.end_date}`}
                  </div>
                  <h3>{stop.cities?.name}</h3>
                  <p className="timeline-country">{stop.cities?.country}</p>
                  {stop.activities && stop.activities.length > 0 && (
                    <div className="timeline-activities">
                      <h4>Activities:</h4>
                      <ul>
                        {stop.activities.map(act => (
                          <li key={act.id}>
                            <span>{act.activity?.name}</span>
                            <span className="activity-meta">
                              {act.activity?.category} • ${act.activity?.estimated_cost}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {stop.notes && (
                    <div className="timeline-notes">
                      <strong>Notes:</strong> {stop.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
