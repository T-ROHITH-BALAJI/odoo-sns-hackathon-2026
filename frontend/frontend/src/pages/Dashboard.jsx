import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MapPin, Calendar as CalendarIcon, DollarSign, Users, BarChart3, Search, Filter, Play, Star, Camera, ChevronRight, Bookmark, Heart } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchTrips()
    }, [])

    const fetchTrips = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data, error } = await supabase
                    .from('trips')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setTrips(data || [])
            }
        } catch (error) {
            console.error('Error fetching trips:', error)
        } finally {
            setLoading(false)
        }
    }

    // Quick navigation cards for main features
    const quickLinks = [
        {
            title: 'Calendar',
            description: 'View and manage your trip schedule',
            icon: CalendarIcon,
            link: '/calendar',
            color: '#4F46E5'
        },
        {
            title: 'Budget Analytics',
            description: 'Track expenses and budget insights',
            icon: DollarSign,
            link: trips.length > 0 ? `/budget/${trips[0].id}` : '/budget/demo',
            color: '#10B981'
        },
        {
            title: 'Community Trips',
            description: 'Explore trips shared by travelers',
            icon: Users,
            link: '/community',
            color: '#F59E0B'
        },
        {
            title: 'Analytics',
            description: 'Platform insights and statistics',
            icon: BarChart3,
            link: '/admin',
            color: '#EC4899'
        }
    ]

    // Sample destinations for the UI
    const destinations = [
        { name: 'Golden Bridge', location: 'Da Nang, Vietnam', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=500&fit=crop', topRated: false },
        { name: 'Dubrovnik Old Town', location: 'Dubrovnik, Croatia', image: 'https://images.unsplash.com/photo-1555990538-c1a1a9a3dd8f?w=400&h=500&fit=crop', topRated: false },
        { name: 'Cappadocia Balloons', location: 'Cappadocia, Turkey', image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=400&h=500&fit=crop', topRated: true },
        { name: 'Sydney Harbour', location: 'Sydney, Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=500&fit=crop', topRated: false },
    ]

    // Sample previous trips for the UI
    const sampleTrips = [
        { title: 'Weekend in Paris', country: 'France', date: 'May 2023', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&h=200&fit=crop' },
        { title: 'Kyoto Temples', country: 'Japan', date: 'Apr 2023', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' },
        { title: 'Santorini Sun', country: 'Greece', date: 'Sep 2022', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=200&h=200&fit=crop' },
    ]

    return (
        <div className="min-h-screen bg-[#FDFCF6] dark:bg-slate-900">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 py-8">
                <div className="space-y-8 relative">
                    {/* Decorative SVG */}
                    <svg className="absolute -top-10 -left-10 w-24 h-24 text-primary opacity-20" fill="none" stroke="currentColor" viewBox="0 0 100 100">
                        <path d="M10 50 Q 25 25 50 50 T 90 50" strokeDasharray="5,5" strokeWidth="2"></path>
                    </svg>

                    <div className="relative z-10">
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#FF7E5F] text-sm font-bold mb-4 tracking-wide uppercase">
                            Start your journey
                        </span>
                        <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                            Discover the World's <span className="text-[#FF7E5F] italic">Hidden</span> Wonders
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-lg leading-relaxed">
                            Find unique destinations and hidden gems that ignite unforgettable experiences. From quiet encounters to remarkable adventures.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link
                            to="/create-trip"
                            className="bg-[#FF7E5F] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Plan a trip
                        </Link>
                        <Link
                            to="/my-trips"
                            className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-medium py-4 px-8 rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#FF7E5F] dark:hover:border-[#FF7E5F] transition flex items-center gap-2 shadow-sm"
                        >
                            <MapPin size={20} className="text-[#FF7E5F]" />
                            My Trips
                        </Link>
                        <Link
                            to="/activities"
                            className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-medium py-4 px-8 rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#FF7E5F] dark:hover:border-[#FF7E5F] transition flex items-center gap-2 shadow-sm"
                        >
                            <Search size={20} className="text-[#FF7E5F]" />
                            Activities
                        </Link>
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

            {/* Search Bar Section */}
            <section className="relative z-30 px-4 -mt-4 lg:mt-0">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                        <div className="flex-grow relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FF7E5F] outline-none"
                                placeholder="Where do you want to go?"
                            />
                        </div>
                        <div className="hidden lg:block h-10 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl transition">
                                <Filter size={16} />
                                <span className="text-sm font-medium">Filters</span>
                            </button>
                        </div>
                        <button className="w-full lg:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-lg">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Quick Navigation Cards */}
            <section className="px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickLinks.map((item) => (
                        <Link
                            key={item.title}
                            to={item.link}
                            className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${item.color}20` }}
                            >
                                <item.icon size={28} color={item.color} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Top Regional Selections */}
            <section className="px-4 py-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="font-serif font-bold text-3xl text-gray-900 dark:text-white">Top Regional Selections</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Popular destinations recommended for you</p>
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
                        <div key={index} className="group cursor-pointer">
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

            {/* Previous Trips / My Trips Section */}
            <section className="px-4 py-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="font-serif font-bold text-3xl text-gray-900 dark:text-white">
                            {trips.length > 0 ? 'My Trips' : 'Previous Trips'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {trips.length > 0 ? 'Plan, organize, and track your travel adventures' : 'Relive your memories'}
                        </p>
                    </div>
                    {trips.length > 0 && (
                        <Link to="/create-trip" className="bg-[#FF7E5F] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition flex items-center gap-2">
                            <Plus size={20} />
                            New Trip
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7E5F]"></div>
                    </div>
                ) : trips.length === 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Featured Trip Card */}
                        <div className="lg:col-span-2 relative group rounded-2xl overflow-hidden h-96 shadow-xl">
                            <img
                                alt="Bali Trip"
                                className="absolute w-full h-full object-cover transition duration-700 group-hover:scale-105"
                                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=800&fit=crop"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent">
                                <span className="bg-[#FF7E5F] text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Featured</span>
                                <h3 className="text-3xl font-serif font-bold text-white mb-2">Summer in Bali</h3>
                                <div className="flex items-center gap-6 text-gray-200 text-sm">
                                    <span className="flex items-center gap-1"><CalendarIcon size={14} /> Aug 12 - Aug 24</span>
                                    <span className="flex items-center gap-1"><Camera size={14} /> 142 Photos</span>
                                    <span className="flex items-center gap-1"><Star size={14} /> 5.0 Rating</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Adventures */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                            <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Recent Adventures</h3>
                            <div className="space-y-4 flex-grow">
                                {sampleTrips.map((trip, index) => (
                                    <div key={index} className="flex gap-4 group cursor-pointer">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                            <img
                                                alt={trip.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition"
                                                src={trip.image}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-[#FF7E5F] transition">{trip.title}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{trip.country}</p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                                <CalendarIcon size={12} /> {trip.date}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 space-y-3">
                                <Link
                                    to="/create-trip"
                                    className="w-full py-3 bg-[#FF7E5F] hover:bg-orange-600 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                                >
                                    <Plus size={20} />
                                    Create Your First Trip
                                </Link>
                                <Link
                                    to="/community"
                                    className="w-full py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold hover:border-[#FF7E5F] hover:text-[#FF7E5F] transition flex items-center justify-center gap-2 text-gray-700 dark:text-white"
                                >
                                    <Users size={16} />
                                    Explore Community Trips
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map((trip) => (
                            <div key={trip.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop"
                                        alt={trip.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <span className="absolute top-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 dark:text-white">
                                        Planning
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">{trip.title}</h3>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                            <CalendarIcon size={16} />
                                            <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                            <MapPin size={16} />
                                            <span>{trip.description || 'No description'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link
                                            to="/calendar"
                                            className="flex-1 py-2.5 bg-[#FF7E5F] hover:bg-orange-600 text-white font-medium rounded-xl transition text-center text-sm"
                                        >
                                            View Calendar
                                        </Link>
                                        <Link
                                            to={`/budget/${trip.id}`}
                                            className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white font-medium rounded-xl hover:border-[#FF7E5F] hover:text-[#FF7E5F] transition text-center text-sm"
                                        >
                                            Budget
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Newsletter Section */}
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
                        Get Your Travel Inspiration Straight to Your Inbox
                    </h2>
                    <p className="text-gray-200 mb-8">Join 50,000+ travelers and get exclusive deals and hidden gem alerts.</p>
                    <form className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            className="flex-grow py-3 px-6 rounded-full text-gray-900 border-none focus:ring-2 focus:ring-[#FF7E5F] outline-none"
                            placeholder="Your email address"
                        />
                        <button
                            type="submit"
                            className="bg-[#FF7E5F] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-xs text-gray-400 mt-4">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </section>
        </div>
    )
}
