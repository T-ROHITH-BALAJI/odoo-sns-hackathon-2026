import { useState, useEffect } from 'react'
import {
    MapPin, Calendar, DollarSign, Users, Heart, Share2, Copy,
    Search, Moon, Sun, MoreHorizontal, Clock, MessageCircle,
    UserPlus, Star, CheckCircle, RefreshCw, ArrowRight, Plane
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function CommunityTrips() {
    const [publicTrips, setPublicTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // 'all', 'popular', 'recent'
    const [selectedTrip, setSelectedTrip] = useState(null)

    // Mock data for sidebars
    const topTravelers = [
        { name: "Anna Lee", trips: 42, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIfMlvynNDv2SoUw5YzttXHggaAS5M7flSPBItKuMqd0oh7_Md8V4_aT0CKAFKNvzLLYH3rTFcU3Io186kN8LH0JjRl3LdsH-v2ckQ6eDtTyLK7F9DbQVeTYtwEFRGpCLTHiVOymF_MCPytpyMWyCHRhJC-9kkwPlQGXg95bEvxF9O2kNu9bJcGgLz1LvnK6G_Wj7VaoYVHZkVjbEurqn3f2xf_ExNBEXj-JlxNOgEZBLPZQRUURYGaAxptWCNtiNv6sUbQqv3w1xZ", badge: "star", badgeColor: "bg-yellow-400" },
        { name: "David Chen", trips: 28, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqQHsIyNXxYlmsfJX-MagZCwyAkX2z_2bLGW2ve6Un_Rm_O8ZsvCUgS4PSBySkDJhNPK7VLRGxiAKdEF3Jg0FrZgZKTzt9V6kS9YnxAgBJeDr9C4ANV4ZklxdLpf0egDHvrcKksiYbCS8Wlz7XDKq6cOG_eyKXC7Zei8OB7g3Dyb9wOg3TaboEji2Cmkz047tpLPXzEWDyJ4NGJi---xQTATJrgDg-05q8DU4p8GjWdDi6k2zTvUqV1shfYSK9oaYcW4bTvDUFOdji" },
        { name: "Elise Void", trips: 156, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmGYWWxBazHsuurSdB55TsMTvpLau1bh3ydZfCipj16PYQ6r-SOvJzIwOCXRy514tI8dfqtEGVDFDUa0RBJ1Iy8GRkZTV16cJo0ni0xkVQ9lu1PTLkDD8jqL9bDhf6nXF320FxCdGN5ICPfb5Ud220i_H9ZGF2LcJYZSk5ozhOQ8gH6jKmNRzXRxe5Bob40Q1iL5vXBs3Md5m5L00ZKCrm_Sv3dATnj-YEgDRvsBQtOqBldT4gA3T_z1BgFGvaglHP08z3P6BzHfpI", badge: "verified", badgeColor: "bg-blue-400" }
    ]

    const trendingDestinations = [
        { name: "Bali, Indonesia", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXBggpxXkQxopbOerQbmA8R-IWYrt22qoQwelBa0W2_M_SFi84KJNwtKWGSLv3Ms8VZSm8kbeGGyaLfOdh6x8M4440vmPPJg6GxNDhMvwMy4Im3BFRN8LEym6vVgXSYmlzcHZm4v30_bCJW71Bhx5dQUvsxxfaOVgXtRy3KllLV4lxr4Nv6Eeypa5Gzv1N-4Z9H64oI-ZdQ1JQf7ProcdIHCtHkcqs3w7a1-wnfRj2oCl0rhd8jso3KYrYi3tbGCXT7NLsU-QAEyMO" },
        { name: "Swiss Alps", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0rPH6EdywAv4Gc0eR9PotJdRWG7KSK8sMgKgLUwPG_nSUT-PPfgRSOEPWczzMdlyjHxWDVDACnbGIMocYT4tukmlxVthpuBHVdv4dSa_ONunoura_Iuxp2KlJL52Kdb1jQCNPZ7ADZ_TzR2SbYhxW2kAbpfF7Esb4rb9IoLSk6yOwTyAE61vFqiHHrnRSVm6ns1oQHRLfGUfa-kkttUJFLQzOlI5_nwSgAtziX3F2QYZlGMc7LdMRaXKD5FptMMBwtSnzYsJ-5lbS" }
    ]

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
            if (!user) {
                alert("Please sign in to like trips")
                return
            }

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
            if (!user) {
                alert("Please sign in to copy trips")
                return
            }

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
        return (
            <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
                <RefreshCw className="animate-spin text-primary w-8 h-8" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#18181B] text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Main Content */}
            <main className="pt-8 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    {/* Hero Section */}
                    <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
                        <span className="inline-block py-1 px-3 rounded-full bg-[#F27A54]/10 text-[#F27A54] text-xs font-bold tracking-wider uppercase">Beta Access</span>
                        <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                            Discover the World's <br />
                            <span className="relative inline-block">
                                <span className="relative z-10 text-[#F27A54] italic pr-2">Hidden Itineraries</span>
                                <svg className="absolute bottom-2 left-0 w-full h-3 -z-10 text-yellow-200 dark:text-yellow-900/40 opacity-60" preserveAspectRatio="none" viewBox="0 0 100 10">
                                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            Explore curated trips by our community of 50,000+ passionate travelers. Copy their plans or get inspired for your next escape.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="relative mb-12">
                        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar py-2 no-scrollbar">
                            <button
                                onClick={() => setFilter('all')}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium text-sm transition-transform hover:scale-105 ${filter === 'all' ? 'bg-[#F27A54] text-white shadow-lg shadow-[#F27A54]/30' : 'bg-white dark:bg-[#27272A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-[#F27A54]'}`}
                            >
                                🔥 Trending
                            </button>
                            <button
                                onClick={() => setFilter('popular')}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium text-sm transition-transform hover:scale-105 ${filter === 'popular' ? 'bg-[#F27A54] text-white shadow-lg shadow-[#F27A54]/30' : 'bg-white dark:bg-[#27272A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-[#F27A54]'}`}
                            >
                                ⭐ Most Popular
                            </button>
                            <button
                                onClick={() => setFilter('recent')}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium text-sm transition-transform hover:scale-105 ${filter === 'recent' ? 'bg-[#F27A54] text-white shadow-lg shadow-[#F27A54]/30' : 'bg-white dark:bg-[#27272A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-[#F27A54]'}`}
                            >
                                🕒 Recent
                            </button>
                            <button className="flex-shrink-0 px-6 py-2.5 rounded-full bg-white dark:bg-[#27272A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-[#F27A54] font-medium text-sm transition-all hover:scale-105">
                                🇪🇺 Europe Summer
                            </button>
                            <button className="flex-shrink-0 px-6 py-2.5 rounded-full bg-white dark:bg-[#27272A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-[#F27A54] font-medium text-sm transition-all hover:scale-105">
                                🎒 Solo Travel
                            </button>
                            <button className="flex-shrink-0 px-6 py-2.5 rounded-full bg-white dark:bg-[#27272A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-[#F27A54] font-medium text-sm transition-all hover:scale-105">
                                🍜 Foodie Tours
                            </button>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#FAF7F2] dark:from-[#18181B] to-transparent pointer-events-none md:block hidden"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Feed Column */}
                        <div className="lg:col-span-8 space-y-8">
                            {publicTrips.length === 0 ? (
                                <div className="text-center py-20 bg-white dark:bg-[#27272A] rounded-3xl border border-gray-100 dark:border-gray-800">
                                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">No public trips found</h2>
                                    <p className="text-gray-500">Be the first to share your journey!</p>
                                </div>
                            ) : (
                                publicTrips.map((trip) => (
                                    <article key={trip.id} className="bg-white dark:bg-[#27272A] rounded-3xl p-4 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800 group">
                                        <div className="flex justify-between items-center mb-4 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold border-2 border-[#F27A54] p-0.5">
                                                    {trip.user?.name ? trip.user.name.charAt(0).toUpperCase() : <Users size={16} />}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#F27A54] cursor-pointer">
                                                        {trip.user?.name || trip.user?.email?.split('@')[0] || 'Anonymous'}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Shared recently • {trip.stops?.[0]?.cities?.name || "Global Trip"}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-[#F27A54] transition-colors">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </div>

                                        <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                                            {/* Placeholder for trip image if none exists */}
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                                                <MapPin size={48} className="text-gray-300 dark:text-gray-600" />
                                            </div>

                                            {/* Overlay Badge */}
                                            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1 shadow-lg">
                                                <Clock size={14} /> {trip.stops?.length || 1} Stops
                                            </div>

                                            <button
                                                onClick={() => handleLikeTrip(trip.id)}
                                                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors"
                                            >
                                                <Heart size={20} className={trip.is_liked ? "fill-red-500 text-red-500" : ""} />
                                            </button>
                                        </div>

                                        <div className="mt-4 px-2">
                                            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#F27A54] transition-colors">
                                                {trip.name}
                                            </h2>
                                            <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm leading-relaxed mb-4">
                                                {trip.description || "No description provided. Explore this itinerary to see the hidden gems!"}
                                            </p>

                                            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                                                <div className="flex gap-2">
                                                    <span className="px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium">#{trip.budget ? 'BudgetFriendly' : 'Travel'}</span>
                                                    <span className="px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium">#Adventure</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
                                                    <button
                                                        onClick={() => handleLikeTrip(trip.id)}
                                                        className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors"
                                                    >
                                                        <Heart size={18} /> {trip.likes_count || 0}
                                                    </button>
                                                    <span className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
                                                        <MessageCircle size={18} /> 4
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleShareTrip(trip)}
                                                            className="hover:text-gray-900 dark:hover:text-white transition-colors"
                                                        >
                                                            <Share2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCopyTrip(trip)}
                                                            className="hover:text-gray-900 dark:hover:text-white transition-colors"
                                                            title="Copy to my trips"
                                                        >
                                                            <Copy size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}

                            <div className="text-center pt-8">
                                <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-[#27272A] text-gray-900 dark:text-white">
                                    <RefreshCw className="animate-spin text-[#F27A54]" size={16} />
                                    Load more adventures
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <aside className="hidden lg:block lg:col-span-4 space-y-8">
                            {/* CTA Card */}
                            <div className="bg-[#F27A54]/5 dark:bg-[#F27A54]/10 rounded-3xl p-6 border border-[#F27A54]/20">
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">Share your journey</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Build your own itinerary and inspire thousands of travelers.
                                </p>
                                <a href="/create-trip" className="block text-center w-full py-3 bg-[#F27A54] hover:bg-[#D65F3B] text-white rounded-xl font-medium shadow-lg shadow-[#F27A54]/30 transition-all transform hover:-translate-y-0.5">
                                    Create Trip +
                                </a>
                            </div>

                            {/* Top Travelers */}
                            <div className="bg-white dark:bg-[#27272A] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">Top Travelers</h3>
                                    <a href="#" className="text-xs font-bold text-[#F27A54] hover:underline">View All</a>
                                </div>
                                <div className="space-y-5">
                                    {topTravelers.map((traveler, index) => (
                                        <div key={index} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img alt={traveler.name} className="w-10 h-10 rounded-full object-cover" src={traveler.avatar} />
                                                    {traveler.badge && (
                                                        <div className={`absolute -bottom-1 -right-1 ${traveler.badgeColor} text-white rounded-full p-0.5 border-2 border-white dark:border-[#27272A]`}>
                                                            {traveler.badge === 'star' ? <Star size={10} fill="currentColor" /> : <CheckCircle size={10} />}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#F27A54] transition-colors cursor-pointer">{traveler.name}</p>
                                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{traveler.trips} Itineraries</p>
                                                </div>
                                            </div>
                                            <button className="text-[#F27A54] hover:bg-[#F27A54]/10 p-2 rounded-full transition-colors">
                                                <UserPlus size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Trending Now */}
                            <div className="bg-white dark:bg-[#27272A] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">Trending Now</h3>
                                <div className="space-y-3">
                                    {trendingDestinations.map((dest, index) => (
                                        <a key={index} className="block group relative overflow-hidden rounded-xl h-24" href="#">
                                            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={dest.image} alt={dest.name} />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                <span className="text-white font-bold tracking-wide">{dest.name}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    )
}
