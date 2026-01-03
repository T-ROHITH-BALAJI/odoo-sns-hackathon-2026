import { useState } from 'react';
import { Heart, MapPin, ArrowRight } from 'lucide-react';

const destinations = [
    {
        id: 1,
        name: "Golden Bridge, Ba Na Hills",
        location: "Vietnam",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=500&fit=crop",
        isFavorite: true,
    },
    {
        id: 2,
        name: "Old Town Dubrovnik",
        location: "Croatia",
        image: "https://images.unsplash.com/photo-1555990538-1d0bd2839c21?w=400&h=500&fit=crop",
        isFavorite: false,
    },
    {
        id: 3,
        name: "The Taj Mahal",
        location: "India",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=500&fit=crop",
        isFavorite: false,
    },
    {
        id: 4,
        name: "Sydney Harbour Bridge",
        location: "Australia",
        image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=500&fit=crop",
        isFavorite: false,
    },
];

const filters = ['Popular', 'USA', 'Europe', 'Asia', 'Middle East'];

export default function DestinationsSection() {
    const [activeFilter, setActiveFilter] = useState('Popular');
    const [favorites, setFavorites] = useState(
        destinations.reduce((acc, dest) => ({ ...acc, [dest.id]: dest.isFavorite }), {})
    );

    const toggleFavorite = (id) => {
        setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <section className="py-16 bg-white dark:bg-surface-dark transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Top Destinations
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Curated specifically for the adventurous soul.
                        </p>
                    </div>
                    <a
                        href="#"
                        className="hidden sm:inline-flex items-center text-sm font-semibold text-primary hover:text-orange-600 transition-colors gap-1"
                    >
                        Explore all destinations
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-3 mb-10 overflow-x-auto hide-scrollbar pb-2">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === filter
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Destination cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {destinations.map((dest) => (
                        <div key={dest.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-4">
                                <img
                                    alt={dest.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    src={dest.image}
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(dest.id);
                                    }}
                                    className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors"
                                >
                                    <Heart className={`w-4 h-4 ${favorites[dest.id] ? 'fill-red-500 text-red-500' : ''}`} />
                                </button>
                            </div>
                            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                {dest.name}
                            </h3>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {dest.location}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
