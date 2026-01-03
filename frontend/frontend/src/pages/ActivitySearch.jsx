import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Search, MapPin, Calendar, Filter, ChevronDown, LayoutGrid, List,
    Star, Heart, Plane, ArrowRight, ArrowLeft
} from 'lucide-react'

export default function ActivitySearch() {
    const [viewMode, setViewMode] = useState('grid')

    const activities = [
        {
            id: 1,
            title: "Sunset Hiking in the Dolomites",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
            location: "Italian Alps",
            category: "Adventure",
            duration: "3 hours",
            rating: 4.9,
            price: 45,
            description: "Experience the breathtaking views of the Italian Alps with a guided sunset tour including local snacks.",
            bestseller: true
        },
        {
            id: 2,
            title: "Private Tea Ceremony in Kyoto",
            image: "https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800&h=600&fit=crop",
            location: "Kyoto, Japan",
            category: "Culture",
            duration: "5 hours",
            rating: 4.8,
            price: 120,
            description: "Immerse yourself in traditional Japanese culture with an exclusive tea ceremony in a historic garden."
        },
        {
            id: 3,
            title: "Hidden Tapas Bars of Barcelona",
            image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&h=600&fit=crop",
            location: "Barcelona, Spain",
            category: "Food",
            duration: "4 hours",
            rating: 5.0,
            price: 65,
            description: "Follow a local foodie to the best kept secrets in the Gothic Quarter and taste authentic flavors."
        },
        {
            id: 4,
            title: "Cinque Terre Coastal Boat Tour",
            image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=600&fit=crop",
            location: "Cinque Terre, Italy",
            category: "Day Trip",
            duration: "10 hours",
            rating: 4.7,
            price: 88,
            originalPrice: 110,
            description: "Discover the colorful villages of Cinque Terre from the sea on a private boat excursion."
        },
        {
            id: 5,
            title: "Sunrise at the Taj Mahal",
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop",
            location: "Agra, India",
            category: "Sightseeing",
            duration: "3 hours",
            rating: 4.9,
            price: 30,
            description: "Beat the crowds and witness the marble mausoleum bathe in the soft morning light."
        },
        {
            id: 6,
            title: "Santorini Photo Walk",
            image: "https://images.unsplash.com/photo-1613395877344-13d4c79e4df1?w=800&h=600&fit=crop",
            location: "Santorini, Greece",
            category: "Photography",
            duration: "2 hours",
            rating: 4.6,
            price: 90,
            description: "Capture the iconic blue domes and white walls with a professional photographer guide."
        },
        {
            id: 7,
            title: "Sahara Desert Glamping",
            image: "https://images.unsplash.com/photo-1539650116453-62ccff82d1ae?w=800&h=600&fit=crop",
            location: "Merzouga, Morocco",
            category: "Adventure",
            duration: "Overnight",
            rating: 4.9,
            price: 150,
            description: "Ride camels into the sunset and sleep under a billion stars in a luxury desert camp."
        },
        {
            id: 8,
            title: "Vintage Fashion in Le Marais",
            image: "https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?w=800&h=600&fit=crop",
            location: "Paris, France",
            category: "Shopping",
            duration: "4 hours",
            rating: 4.5,
            price: 75,
            description: "Discover the chicest vintage shops in Paris with a personal stylist and shopper."
        }
    ]

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-zinc-900 font-sans">
            {/* Hero Section */}
            <section className="relative pt-12 pb-20 px-6 md:px-12 flex flex-col items-center text-center">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#E87051]/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>

                <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                    Find the <span className="text-[#E87051] italic">Hidden Gems</span> <br /> of the World
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mb-10 text-lg">
                    Explore unique activities, tours, and local experiences curated for the modern traveler.
                </p>

                {/* Search Bar */}
                <div className="w-full max-w-4xl bg-white dark:bg-zinc-800 p-2 rounded-full shadow-sm flex flex-col md:flex-row items-center gap-2 border border-gray-100 dark:border-zinc-700 relative z-20">
                    <div className="flex-grow w-full md:w-auto flex items-center px-4 h-12 md:h-14">
                        <MapPin className="text-gray-400 mr-3 w-5 h-5" />
                        <input
                            className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 font-medium outline-none"
                            placeholder="Where are you going?"
                            type="text"
                        />
                    </div>
                    <div className="h-8 w-[1px] bg-gray-200 dark:bg-zinc-700 hidden md:block"></div>
                    <div className="w-full md:w-48 flex items-center px-4 h-12 md:h-14 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50 rounded-full transition-colors">
                        <Calendar className="text-gray-400 mr-3 w-5 h-5" />
                        <span className="text-gray-900 dark:text-white text-sm font-medium truncate">Add Dates</span>
                    </div>
                    <button className="w-full md:w-auto bg-[#E87051] hover:bg-[#d66345] text-white px-8 py-3 md:py-4 rounded-full font-medium transition-colors shadow-lg shadow-[#E87051]/30 flex items-center justify-center gap-2">
                        <Search className="w-4 h-4" />
                        <span>Search</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm font-medium hover:border-[#E87051] dark:hover:border-[#E87051] transition-colors flex items-center gap-2 shadow-sm text-gray-700 dark:text-gray-300">
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                    <button className="px-4 py-2 bg-[#E87051] text-white border border-[#E87051] rounded-full text-sm font-medium shadow-sm transition-colors">
                        All
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm font-medium hover:border-[#E87051] dark:hover:border-[#E87051] hover:text-[#E87051] transition-colors shadow-sm text-gray-700 dark:text-gray-300">
                        Outdoor
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm font-medium hover:border-[#E87051] dark:hover:border-[#E87051] hover:text-[#E87051] transition-colors shadow-sm text-gray-700 dark:text-gray-300">
                        Cultural
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm font-medium hover:border-[#E87051] dark:hover:border-[#E87051] hover:text-[#E87051] transition-colors shadow-sm text-gray-700 dark:text-gray-300">
                        Food & Drink
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm font-medium hover:border-[#E87051] dark:hover:border-[#E87051] hover:text-[#E87051] transition-colors shadow-sm flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        Cost <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-grow px-6 md:px-12 pb-20 max-w-[1400px] mx-auto w-full">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white font-serif">Top Experiences</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Found 124 activities matching your criteria</p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-full shadow-sm border ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-800 text-[#E87051] border-gray-100 dark:border-zinc-700' : 'bg-transparent text-gray-400 border-transparent hover:text-gray-600'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-full shadow-sm border ${viewMode === 'list' ? 'bg-white dark:bg-zinc-800 text-[#E87051] border-gray-100 dark:border-zinc-700' : 'bg-transparent text-gray-400 border-transparent hover:text-gray-600'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {activities.map((activity) => (
                        <article key={activity.id} className="group flex flex-col bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-zinc-700">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    alt={activity.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    src={activity.image}
                                />
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 text-gray-900 dark:text-white">
                                    <Star className="text-yellow-500 w-3 h-3 fill-current" /> {activity.rating}
                                </div>
                                {activity.bestseller && (
                                    <div className="absolute top-3 left-3 bg-[#E87051] text-white px-2 py-1 rounded-md text-xs font-bold">
                                        Bestseller
                                    </div>
                                )}
                                <button className="absolute bottom-3 right-3 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-[#E87051] uppercase tracking-wider">{activity.category}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{activity.duration}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-[#E87051] transition-colors text-gray-900 dark:text-white font-serif">{activity.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{activity.description}</p>
                                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-700 flex items-center justify-between">
                                    <div>
                                        {activity.originalPrice && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 block line-through">${activity.originalPrice}</span>
                                        )}
                                        <div className="flex items-center gap-1">
                                            {!activity.originalPrice && <span className="text-xs text-gray-500 dark:text-gray-400">From</span>}
                                            <span className={`text-lg font-bold ${activity.originalPrice ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>${activity.price}</span>
                                        </div>
                                    </div>
                                    <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-[#E87051] dark:hover:bg-[#E87051] dark:hover:text-white transition-colors">
                                        Add to Trip
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-16 flex justify-center items-center gap-2">
                    <button className="px-6 py-3 border border-gray-200 dark:border-zinc-700 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-gray-300">Previous</button>
                    <button className="w-10 h-10 flex items-center justify-center bg-[#E87051] text-white rounded-full text-sm font-bold shadow-md">1</button>
                    <button className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-sm font-medium transition-colors">2</button>
                    <button className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-sm font-medium transition-colors">3</button>
                    <button className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-white rounded-full text-sm font-medium">...</button>
                    <button className="px-6 py-3 border border-gray-200 dark:border-zinc-700 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-gray-300">Next</button>
                </div>
            </main>

            {/* Newsletter Section */}
            <section className="bg-white dark:bg-zinc-800 pt-16 pb-8 border-t border-gray-200 dark:border-zinc-800">
                <div className="px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="relative rounded-2xl overflow-hidden bg-gray-900 dark:bg-black text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        <div className="absolute inset-0 opacity-20">
                            <img alt="Travel Pattern" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&h=400&fit=crop" />
                        </div>
                        <div className="relative z-10 max-w-lg">
                            <h3 className="text-3xl font-bold font-serif mb-2">Get Your Travel Inspiration</h3>
                            <p className="text-gray-300">Join 50,000+ travelers and get exclusive deals straight to your inbox.</p>
                        </div>
                        <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                            <input className="px-5 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E87051] w-full sm:w-64" placeholder="Your email address" type="email" />
                            <button className="bg-[#E87051] hover:bg-[#d66345] text-white px-8 py-3 rounded-full font-medium transition-colors">Subscribe</button>
                        </div>
                    </div>
                    {/* Simplified Footer Links for this page component */}
                </div>
            </section>
        </div>
    )
}
