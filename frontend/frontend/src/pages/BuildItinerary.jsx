import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Plus, ChevronDown, ChevronUp, MapPin, Calendar,
    DollarSign, Users, Clock, Trash2, Edit2, Save, Search
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function BuildItinerary() {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [trip, setTrip] = useState(null)
    const [stops, setStops] = useState([])
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [expandedStop, setExpandedStop] = useState(null)
    const [showCitySearch, setShowCitySearch] = useState(false)
    const [citySearch, setCitySearch] = useState('')

    useEffect(() => {
        if (tripId && user) {
            fetchTrip()
            fetchStops()
            fetchCities()
        }
    }, [tripId, user])

    const fetchTrip = async () => {
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('id', tripId)
                .single()

            if (error) throw error
            setTrip(data)
        } catch (error) {
            console.error('Error fetching trip:', error)
            toast.error('Failed to load trip')
        }
    }

    const fetchStops = async () => {
        try {
            const { data, error } = await supabase
                .from('trip_stops')
                .select(`
                    *,
                    cities(id, name, country, latitude, longitude),
                    activities(*)
                `)
                .eq('trip_id', tripId)
                .order('day_number', { ascending: true })

            if (error) throw error
            setStops(data || [])
            if (data && data.length > 0) {
                setExpandedStop(data[0].id)
            }
        } catch (error) {
            console.error('Error fetching stops:', error)
            toast.error('Failed to load stops')
        } finally {
            setLoading(false)
        }
    }

    const fetchCities = async () => {
        try {
            const { data, error } = await supabase
                .from('cities')
                .select('*')
                .order('name')

            if (error) throw error
            setCities(data || [])
        } catch (error) {
            console.error('Error fetching cities:', error)
        }
    }

    const addStop = async (cityId) => {
        const orderIndex = stops.length + 1

        // Demo mode - create local stop without database
        if (isDemo) {
            const newStop = {
                id: 'stop-' + Date.now(),
                trip_id: tripId,
                order_index: orderIndex,
                notes: '',
                start_date: null,
                end_date: null,
                duration_days: 1,
                location: '',
                accommodation: '',
                budget: 0
            }
            setStops([...stops, newStop])
            setExpandedStop(newStop.id)
            return
        }

        try {
            const newStop = {
                trip_id: tripId,
                order_index: orderIndex,
                notes: '',
                start_date: null,
                end_date: null,
                duration_days: 1
            }

            const { data, error } = await supabase
                .from('trip_stops')
                .insert(newStop)
                .select()
                .single()

            if (error) throw error

            const stopWithUIFields = {
                ...data,
                location: '',
                accommodation: '',
                budget: 0
            }

            setStops([...stops, stopWithUIFields])
            setExpandedStop(data.id)
        } catch (error) {
            console.error('Error adding stop:', error)
        }
    }

    const updateStop = async (stopId, updates) => {
        // Separate database fields from UI-only fields
        const dbFields = ['start_date', 'end_date', 'notes', 'duration_days', 'order_index']
        const dbUpdates = {}
        const uiUpdates = {}

        Object.keys(updates).forEach(key => {
            if (dbFields.includes(key)) {
                dbUpdates[key] = updates[key]
            } else {
                uiUpdates[key] = updates[key]
            }
        })

        // Update local state immediately
        setStops(stops.map(s => s.id === stopId ? { ...s, ...updates } : s))

        // Only update database if there are database-valid fields and not in demo mode
        if (Object.keys(dbUpdates).length > 0 && !isDemo) {
            try {
                const { error } = await supabase
                    .from('trip_stops')
                    .update(dbUpdates)
                    .eq('id', stopId)

                if (error) throw error
            } catch (error) {
                console.error('Error updating stop:', error)
            }
        }
    }

    const deleteStop = async (stopId) => {
        if (!confirm('Are you sure you want to delete this stop?')) return

        // Demo mode - just remove from local state
        if (isDemo) {
            setStops(stops.filter(s => s.id !== stopId))
            return
        }

        try {
            const { error } = await supabase
                .from('trip_stops')
                .delete()
                .eq('id', stopId)

            if (error) throw error
            setStops(stops.filter(s => s.id !== stopId))
        } catch (error) {
            console.error('Error deleting stop:', error)
        }
    }

    const calculateTotalBudget = () => {
        return stops.reduce((total, stop) => total + (parseFloat(stop.budget) || 0), 0)
    }

    const calculateTotalDays = () => {
        return stops.reduce((total, stop) => total + (parseInt(stop.duration_days) || 0), 0)
    }

    const finalizeItinerary = async () => {
        setSaving(true)

        // Demo mode - just navigate without database updates
        if (isDemo) {
            setTimeout(() => {
                setSaving(false)
                navigate('/dashboard')
            }, 500)
            return
        }

        try {
            await supabase
                .from('trips')
                .update({
                    status: 'planned',
                    destination_count: stops.length
                })
                .eq('id', tripId)

            navigate('/dashboard')
        } catch (error) {
            console.error('Error finalizing itinerary:', error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] dark:bg-zinc-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E87051]"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-zinc-900">
            {/* Background Map Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 dark:opacity-[0.02]">
                <img
                    alt="Vintage World Map"
                    className="w-full h-full object-cover grayscale"
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&h=900&fit=crop"
                />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#E87051] transition font-medium mb-8"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-900 dark:text-white">
                        Build Your <span className="relative inline-block text-[#E87051]">
                            Dream
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#E87051] opacity-30" preserveAspectRatio="none" viewBox="0 0 100 10">
                                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3"></path>
                            </svg>
                        </span> Itinerary
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Craft your perfect journey step by step. Plan stops, manage budgets, and organize your adventures in one place.
                    </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); finalizeItinerary(); }} className="space-y-8">
                    {/* Trip Info Card */}
                    <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-zinc-700">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Cover Photo Upload */}
                            <div className="w-full md:w-1/3 shrink-0">
                                <label className="group relative flex flex-col items-center justify-center w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300 dark:border-zinc-600 hover:border-[#E87051] dark:hover:border-[#E87051] bg-gray-50 dark:bg-zinc-800/50 cursor-pointer transition-all overflow-hidden">
                                    <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-[#E87051] mb-2 transition-colors" />
                                    <span className="text-sm font-medium text-gray-500 group-hover:text-[#E87051] transition-colors">Add Cover Photo</span>
                                    <input type="file" className="hidden" accept="image/*" />
                                </label>
                            </div>

                            {/* Trip Details */}
                            <div className="w-full space-y-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                        Trip Name
                                    </label>
                                    <input
                                        type="text"
                                        value={tripForm.name}
                                        onChange={(e) => setTripForm({ ...tripForm, name: e.target.value })}
                                        onBlur={updateTrip}
                                        className="w-full bg-transparent text-2xl md:text-3xl font-serif font-bold border-0 border-b-2 border-gray-200 dark:border-zinc-700 focus:border-[#E87051] focus:ring-0 px-0 py-2 placeholder-gray-300 dark:placeholder-zinc-600 transition-colors text-gray-900 dark:text-white"
                                        placeholder="e.g. Backpacking Asia"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                            Start Date
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="date"
                                                value={tripForm.start_date || ''}
                                                onChange={(e) => setTripForm({ ...tripForm, start_date: e.target.value })}
                                                onBlur={updateTrip}
                                                className="w-full bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#E87051]/20 focus:border-[#E87051] transition-shadow text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                            Travelers
                                        </label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <select
                                                value={tripForm.travelers}
                                                onChange={(e) => setTripForm({ ...tripForm, travelers: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-[#E87051]/20 focus:border-[#E87051] transition-shadow appearance-none text-gray-900 dark:text-white"
                                            >
                                                <option value="1">Solo Traveler</option>
                                                <option value="2">Couple</option>
                                                <option value="3">Family (3+)</option>
                                                <option value="4">Group of Friends</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                        Trip Summary
                                    </label>
                                    <textarea
                                        value={tripForm.description || ''}
                                        onChange={(e) => setTripForm({ ...tripForm, description: e.target.value })}
                                        onBlur={updateTrip}
                                        rows={2}
                                        className="w-full bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E87051]/20 focus:border-[#E87051] transition-shadow resize-none text-gray-900 dark:text-white"
                                        placeholder="What's the goal of this trip?"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Itinerary Stops Divider */}
                    <div className="flex items-center gap-4 py-4">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-700"></div>
                        <span className="font-serif text-xl font-bold text-gray-900 dark:text-white">Itinerary Stops</span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-700"></div>
                    </div>

                    {/* Stops List */}
                    <div className="space-y-4">
                        {stops.map((stop, index) => (
                            <div
                                key={stop.id}
                                className={`bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${expandedStop === stop.id
                                    ? 'border-[#E87051]/30 ring-1 ring-[#E87051]/30'
                                    : 'border-gray-200 dark:border-zinc-700'
                                    }`}
                            >
                                {/* Stop Header */}
                                <button
                                    type="button"
                                    onClick={() => setExpandedStop(expandedStop === stop.id ? null : stop.id)}
                                    className="w-full flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-serif text-lg ${stop.location
                                            ? 'bg-[#E87051]/10 text-[#E87051]'
                                            : 'bg-gray-100 dark:bg-zinc-700 text-gray-500'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white">
                                                {stop.location || 'New Destination'}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {stop.start_date && stop.end_date
                                                    ? `${stop.start_date} - ${stop.end_date} • ${stop.duration_days || 1} Night(s)`
                                                    : 'Select dates...'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {stop.status && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                {stop.status}
                                            </span>
                                        )}
                                        {expandedStop === stop.id ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </button>

                                {/* Stop Details */}
                                {expandedStop === stop.id && (
                                    <div className="p-5 pt-0 border-t border-gray-100 dark:border-zinc-700/50">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                                            <div className="lg:col-span-8 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                                                            Location
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={stop.location || ''}
                                                            onChange={(e) => updateStop(stop.id, { location: e.target.value })}
                                                            className="w-full bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-[#E87051] focus:ring-[#E87051]/20 text-gray-900 dark:text-white"
                                                            placeholder="City, Country"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                                                            Accommodation
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={stop.accommodation || ''}
                                                            onChange={(e) => updateStop(stop.id, { accommodation: e.target.value })}
                                                            className="w-full bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-[#E87051] focus:ring-[#E87051]/20 text-gray-900 dark:text-white"
                                                            placeholder="Hotel name"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                                                            Start Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={stop.start_date || ''}
                                                            onChange={(e) => updateStop(stop.id, { start_date: e.target.value })}
                                                            className="w-full bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-[#E87051] focus:ring-[#E87051]/20 text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                                                            End Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={stop.end_date || ''}
                                                            onChange={(e) => updateStop(stop.id, { end_date: e.target.value })}
                                                            className="w-full bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-[#E87051] focus:ring-[#E87051]/20 text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                                                        Notes & Activities
                                                    </label>
                                                    <textarea
                                                        value={stop.notes || ''}
                                                        onChange={(e) => updateStop(stop.id, { notes: e.target.value })}
                                                        rows={3}
                                                        className="w-full bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-[#E87051] focus:ring-[#E87051]/20 text-gray-900 dark:text-white"
                                                        placeholder="- Activities planned&#10;- Places to visit&#10;- Restaurant reservations"
                                                    />
                                                </div>
                                            </div>

                                            <div className="lg:col-span-4 space-y-4">
                                                {/* Stop Image */}
                                                <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-zinc-700 cursor-pointer group">
                                                    <img
                                                        alt={stop.location || 'Destination'}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        src={`https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop`}
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                        <Edit2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>

                                                {/* Budget */}
                                                <div className="bg-[#E87051]/5 dark:bg-[#E87051]/10 rounded-xl p-4 border border-[#E87051]/10">
                                                    <label className="flex items-center gap-2 text-xs font-bold text-[#E87051] mb-2">
                                                        <DollarSign className="w-4 h-4" />
                                                        Budget Allocation
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                                        <input
                                                            type="number"
                                                            value={stop.budget || ''}
                                                            onChange={(e) => updateStop(stop.id, { budget: e.target.value })}
                                                            className="w-full bg-white dark:bg-zinc-900 border-transparent rounded-lg pl-7 pr-3 py-2 text-sm font-bold text-right focus:border-[#E87051] focus:ring-[#E87051]/20 text-gray-900 dark:text-white"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stop Actions */}
                                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-zinc-700/50">
                                            <button
                                                type="button"
                                                onClick={() => deleteStop(stop.id)}
                                                className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-2 transition-colors"
                                            >
                                                Delete Stop
                                            </button>
                                            <button
                                                type="button"
                                                className="text-xs font-medium text-[#E87051] hover:text-[#d66345] px-3 py-2 border border-[#E87051]/20 hover:bg-[#E87051]/5 rounded-lg transition-all"
                                            >
                                                Add Activity
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Stop Button */}
                        <button
                            type="button"
                            onClick={addStop}
                            className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl flex items-center justify-center gap-2 text-gray-500 hover:text-[#E87051] hover:border-[#E87051] hover:bg-[#E87051]/5 transition-all group"
                        >
                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Add Another Destination</span>
                        </button>
                    </div>

                    {/* Sticky Footer */}
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-zinc-700 sticky bottom-4 z-10 backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex gap-6 text-sm">
                                <div>
                                    <span className="block text-gray-500 dark:text-gray-400 text-xs">Total Duration</span>
                                    <span className="font-bold font-serif text-lg text-gray-900 dark:text-white">
                                        {calculateTotalDays() || stops.length} Days
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 dark:text-gray-400 text-xs">Est. Total Cost</span>
                                    <span className="font-bold font-serif text-lg text-[#E87051]">
                                        ${calculateTotalBudget().toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <Link
                                    to="/dashboard"
                                    className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-gray-300 dark:border-zinc-600 font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-center text-gray-700 dark:text-white"
                                >
                                    Save Draft
                                </Link>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-[#E87051] hover:bg-[#d66345] text-white font-medium shadow-md shadow-[#E87051]/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'Saving...' : 'Finalize Itinerary'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
