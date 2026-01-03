import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Plus, Search, ChevronRight, Bookmark, Heart, Star, Camera, Play, Filter } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function CreateTrip() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        title: '',
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        travelers: 1,
        description: ''
    })
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!user) {
            toast.error('You must be logged in to create a trip')
            navigate('/login')
            return
        }

        setLoading(true)

        try {
            // Create the trip in database
            const { data: trip, error } = await supabase
                .from('trips')
                .insert([{
                    user_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    start_date: formData.startDate,
                    end_date: formData.endDate
                }])
                .select()
                .single()

            if (error) throw error

            toast.success('Trip created successfully!')
            // Navigate to build itinerary
            navigate(`/trips/${trip.id}/itinerary`)
        } catch (error) {
            console.error('Error creating trip:', error)
            toast.error('Failed to create trip. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Sample destinations for inspiration
    const destinations = [
        { name: 'Golden Bridge', location: 'Da Nang, Vietnam', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=500&fit=crop', topRated: false },
        { name: 'Dubrovnik Old Town', location: 'Dubrovnik, Croatia', image: 'https://images.unsplash.com/photo-1555990538-c1a1a9a3dd8f?w=400&h=500&fit=crop', topRated: false },
        { name: 'Cappadocia Balloons', location: 'Cappadocia, Turkey', image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=400&h=500&fit=crop', topRated: true },
        { name: 'Sydney Harbour', location: 'Sydney, Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=500&fit=crop', topRated: false },
    ]

    return (
        <div className="min-h-screen bg-[#FDFCF6] dark:bg-slate-900">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 py-8">
                <div className="space-y-8 relative">
                    {/* Back Button */}
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#FF7E5F] transition font-medium"
                    >
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </Link>

                    {/* Decorative SVG */}
                    <svg className="absolute -top-10 -left-10 w-24 h-24 text-[#FF7E5F] opacity-20" fill="none" stroke="currentColor" viewBox="0 0 100 100">
                        <path d="M10 50 Q 25 25 50 50 T 90 50" strokeDasharray="5,5" strokeWidth="2"></path>
                    </svg>

                    <div className="relative z-10">
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#FF7E5F] text-sm font-bold mb-4 tracking-wide uppercase">
                            Create New Trip
                        </span>
                        <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                            Plan Your Next <span className="text-[#FF7E5F] italic">Adventure</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-lg leading-relaxed">
                            Fill in the details below to start planning your perfect getaway. From destinations to budgets, we've got you covered.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#FF7E5F] dark:hover:border-[#FF7E5F] transition flex items-center gap-2 shadow-sm">
                            <Play size={18} className="text-[#FF7E5F]" />
                            Watch how it works
                        </button>
                    </div>
                </div>

                {/* Image Grid */}
                <div className="relative h-[500px] w-full hidden md:block">
                    <div className="grid grid-cols-2 grid-rows-6 gap-4 h-full w-full">
                        <div className="row-span-6 col-span-1 relative group overflow-hidden rounded-2xl shadow-xl">
                            <img
                                alt="Quebec City"
                                className="absolute w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=800&fit=crop"
                            />
                            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-900 dark:text-white">
                                Canada
                            </div>
                        </div>
                        <div className="row-span-3 col-span-1 relative group overflow-hidden rounded-2xl shadow-xl">
                            <img
                                alt="Thailand"
                                className="absolute w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop"
                            />
                            <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-[#FF7E5F] transition">
                                <Heart size={16} />
                            </button>
                        </div>
                        <div className="row-span-3 col-span-1 relative group overflow-hidden rounded-2xl shadow-xl">
                            <img
                                alt="Japan"
                                className="absolute w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Create Trip Form Section */}
            <section className="px-4 py-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 lg:p-8">
                    <h2 className="font-serif font-bold text-2xl text-gray-900 dark:text-white mb-6">Trip Details</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Trip Name */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Trip Name
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FF7E5F] focus:border-transparent outline-none transition"
                                    placeholder="e.g., Summer in Bali, European Adventure"
                                    required
                                />
                            </div>

                            {/* Destination */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Where do you want to go?
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        name="destination"
                                        value={formData.destination}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FF7E5F] focus:border-transparent outline-none transition"
                                        placeholder="Search destinations..."
                                    />
                                </div>
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF7E5F] focus:border-transparent outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    End Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF7E5F] focus:border-transparent outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Budget (USD)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FF7E5F] focus:border-transparent outline-none transition"
                                        placeholder="5000"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Number of Travelers */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Number of Travelers
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="number"
                                        name="travelers"
                                        value={formData.travelers}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF7E5F] focus:border-transparent outline-none transition"
                                        min="1"
                                        max="20"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Trip Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FF7E5F] focus:border-transparent outline-none transition resize-none"
                                    placeholder="Tell us about your trip plans, activities you want to do, places you want to visit..."
                                />
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-[#FF7E5F] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating Trip...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Create Trip
                                    </>
                                )}
                            </button>
                            <Link
                                to="/dashboard"
                                className="flex-1 sm:flex-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-bold py-4 px-8 rounded-full border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={20} />
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </section>

            {/* Inspiration Section */}
            <section className="px-4 py-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="font-serif font-bold text-3xl text-gray-900 dark:text-white">Need Inspiration?</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Popular destinations to get you started</p>
                    </div>
                    <Link
                        to="/community"
                        className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#FF7E5F] hover:text-orange-600 transition px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Explore all
                        <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {destinations.map((dest, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer"
                            onClick={() => setFormData(prev => ({ ...prev, destination: dest.location }))}
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                                <img
                                    alt={dest.name}
                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                    src={dest.image}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                {dest.topRated && (
                                    <div className="absolute bottom-3 left-3 bg-[#FF7E5F] text-white text-xs font-bold px-2 py-1 rounded">
                                        Top Rated
                                    </div>
                                )}
                                <button className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-[#FF7E5F] transition">
                                    <Bookmark size={16} />
                                </button>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#FF7E5F] transition">{dest.name}</h3>
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                                <MapPin size={14} />
                                {dest.location}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative rounded-3xl overflow-hidden mx-4 my-8">
                <div className="absolute inset-0">
                    <img
                        alt="Travel Landscape"
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=600&fit=crop"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative z-10 px-6 py-16 md:py-20 text-center max-w-2xl mx-auto">
                    <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-4">
                        Ready to Start Your Adventure?
                    </h2>
                    <p className="text-gray-200 mb-8">Fill in the form above and let's make your travel dreams come true.</p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="bg-[#FF7E5F] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg"
                    >
                        Create Your Trip Now
                    </button>
                </div>
            </section>
        </div>
    )
}
