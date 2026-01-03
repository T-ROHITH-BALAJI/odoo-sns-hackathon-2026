import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Plus, Calendar, MapPin, Users, Share2, ChevronRight, Sun,
    Plane, Clock, ArrowRight, Trash2, Edit
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function MyTrips() {
    const { user } = useAuth()
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchTrips()
        }
    }, [user])

    const fetchTrips = async () => {
        try {
            const { data, error } = await supabase
                .from('trips')
                .select(`
                    *,
                    trip_stops(
                        id,
                        city_id,
                        day_number,
                        cities(name, country)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setTrips(data || [])
        } catch (error) {
            console.error('Error fetching trips:', error)
            toast.error('Failed to load trips')
        } finally {
            setLoading(false)
        }
    }

    const deleteTrip = async (tripId) => {
        if (!confirm('Are you sure you want to delete this trip?')) return

        try {
            const { error } = await supabase
                .from('trips')
                .delete()
                .eq('id', tripId)

            if (error) throw error
            toast.success('Trip deleted successfully')
            fetchTrips()
        } catch (error) {
            console.error('Error deleting trip:', error)
            toast.error('Failed to delete trip')
        }
    }

    const getTripDuration = (start, end) => {
        const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
        return `${days} days`
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading trips...</div>
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <p className="text-[#FF7E5F] font-medium mb-2 tracking-wide uppercase text-sm">Welcome back, Traveler</p>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
                            Your Travel <span className="relative inline-block">
                                Journal
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#FF7E5F] opacity-30" preserveAspectRatio="none" viewBox="0 0 100 10">
                                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                </svg>
                            </span>
                        </h1>
                    </div>
                    <Link
                        to="/create-trip"
                        className="bg-[#FF7E5F] hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-[#FF7E5F]/30 flex items-center gap-2 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Plan new trip
                    </Link>
                </div>

                {/* Happening Now Section */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7E5F] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF7E5F]"></span>
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Happening Now</h2>
                    </div>

                    <div className="relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-lg group border border-gray-100 dark:border-zinc-700 transition-all hover:shadow-xl">
                        <div className="grid md:grid-cols-2 gap-0">
                            <div className="relative h-64 md:h-auto overflow-hidden">
                                <img
                                    alt={currentTrip.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    src={currentTrip.image}
                                />
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#FF7E5F] flex items-center gap-1">
                                    <Plane className="w-3 h-3" />
                                    ONGOING
                                </div>
                            </div>
                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-serif text-3xl font-bold mb-1 text-gray-900 dark:text-white">{currentTrip.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                                            <Calendar className="w-4 h-4" /> {currentTrip.dates}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-[#FF7E5F]">Day {currentTrip.currentDay}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">of {currentTrip.totalDays} days</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                                    {currentTrip.description}
                                </p>
                                <div className="bg-[#FDFBF7] dark:bg-zinc-900 p-4 rounded-xl mb-6 flex items-center justify-between border border-gray-100 dark:border-zinc-700">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 p-2 rounded-lg">
                                            <Sun className="w-5 h-5" />
                                        </span>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">{currentTrip.weather.condition}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{currentTrip.weather.temp} • UV Moderate</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">Next Activity</p>
                                        <p className="text-xs text-[#FF7E5F]">{currentTrip.nextActivity}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                                        View Itinerary
                                    </button>
                                    <button className="aspect-square bg-gray-100 dark:bg-zinc-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors text-gray-700 dark:text-white">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Upcoming Adventures */}
                <section className="mb-16">
                    <h2 className="font-serif text-2xl font-bold mb-6 text-gray-900 dark:text-white">Upcoming Adventures</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {upcomingTrips.map((trip) => (
                            <article key={trip.id} className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group border border-gray-100 dark:border-zinc-700 flex flex-col">
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        alt={trip.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        src={trip.image}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 dark:text-white flex items-center gap-1">
                                        IN {trip.daysUntil}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="font-serif text-xl font-bold mb-1 text-gray-900 dark:text-white">{trip.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{trip.dates}</p>
                                    <div className="mt-auto">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            <Calendar size={16} />
                                            <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin size={16} />
                                            <span>{trip.trip_stops?.length || 0} destinations</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 pb-6 pt-0">
                                    <Link to={`/build-itinerary/${trip.id}`} className="w-full py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center">
                                        Continue Planning
                                    </Link>
                                </div>
                            </article>
                        ))}

                        {/* Add new trip card */}
                        <Link
                            to="/create-trip"
                            className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl flex flex-col items-center justify-center text-center p-8 hover:border-[#FF7E5F] hover:bg-[#FF7E5F]/5 transition-all group h-full min-h-[400px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 group-hover:text-[#FF7E5F] group-hover:bg-white dark:group-hover:bg-zinc-900 flex items-center justify-center mb-4 transition-colors">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">Dreaming of somewhere?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px]">Start planning your next getaway. We'll help you organize everything.</p>
                        </Link>
                    </div>
                </section>

                {/* Past Trips */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white opacity-90">Memories & Past Trips</h2>
                        <button className="text-sm font-medium text-[#FF7E5F] hover:text-orange-600 flex items-center gap-1">
                            View all <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {pastTrips.map((trip, index) => (
                            <div key={index} className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-md cursor-pointer">
                                <img
                                    alt={trip.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    src={trip.image}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                                <div className="absolute bottom-0 left-0 p-4 w-full">
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-md mb-2">COMPLETED</span>
                                    <h4 className="text-white font-serif font-bold text-lg">{trip.name}</h4>
                                    <p className="text-gray-300 text-xs">{trip.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="mt-16 relative overflow-hidden rounded-2xl p-8 md:p-12 bg-gray-900">
                    <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=600&fit=crop')" }}></div>
                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                            <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-white">Get Travel Inspiration<br />Straight to Your Inbox</h3>
                            <p className="text-gray-300 mb-0">Join 50,000+ travelers and get our exclusive guides.</p>
                        </div>
                        <div>
                            <form className="flex flex-col md:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-grow bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7E5F] backdrop-blur-sm"
                                />
                                <button type="submit" className="bg-[#FF7E5F] hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-[#FF7E5F]/30">
                                    Subscribe
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-3">We respect your privacy. Unsubscribe at any time.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
