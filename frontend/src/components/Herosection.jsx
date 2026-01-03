import { Play, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Background blob decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl dark:bg-primary/10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Content */}
                    <div className="lg:col-span-5 relative z-10">
                        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                            Discover the <br />
                            World's <span className="text-primary italic">Hidden</span> <br />
                            Wonders
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-md">
                            Find the unique moments and hidden gems that ignite unforgettable experiences. From rare encounters to remarkable destinations, we help you uncover the spark.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-full text-white bg-primary shadow-lg hover:bg-opacity-90 hover:scale-105 transition-all duration-200"
                            >
                                Plan your trip
                            </Link>
                            <button className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-surface-dark shadow-md text-primary hover:text-gray-900 dark:hover:text-white hover:scale-105 transition-all">
                                <Play className="w-5 h-5 fill-current" />
                            </button>
                        </div>
                    </div>

                    {/* Right Image Grid */}
                    <div className="lg:col-span-7 relative">
                        {/* SVG Background blob */}
                        <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 dark:opacity-10 z-0 pointer-events-none"
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M45.7,-76.3C58.9,-69.3,69.1,-55.5,76.3,-40.8C83.5,-26.1,87.7,-10.5,85.6,4.2C83.5,18.9,75.1,32.7,65.3,44.5C55.5,56.3,44.3,66.1,31.4,72.4C18.5,78.7,3.9,81.5,-9.7,79.1C-23.3,76.7,-35.9,69.1,-47.3,59.8C-58.7,50.5,-68.9,39.5,-75.4,26.4C-81.9,13.3,-84.7,-1.9,-81.4,-16.1C-78.1,-30.3,-68.7,-43.5,-57.1,-51.7C-45.5,-59.9,-31.7,-63.1,-18.2,-64.8C-4.7,-66.5,8.5,-66.7,21.8,-66.7"
                                fill="#F26C4F"
                            />
                        </svg>

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {/* Main large image - spans 2 rows */}
                            <div className="relative row-span-2 group">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors rounded-3xl z-10"></div>
                                <img
                                    alt="Exotic Hotel Resort"
                                    className="w-full h-full object-cover rounded-3xl shadow-xl transform transition-transform duration-500 group-hover:-translate-y-2"
                                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=800&fit=crop"
                                />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <span className="bg-white/90 dark:bg-black/70 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-gray-900 dark:text-white">
                                        Resorts
                                    </span>
                                </div>
                            </div>

                            {/* Top right image */}
                            <div className="relative h-48 sm:h-64 group">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors rounded-3xl z-10"></div>
                                <img
                                    alt="Mountain Landscape"
                                    className="w-full h-full object-cover rounded-3xl shadow-xl transform transition-transform duration-500 group-hover:-translate-y-2"
                                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                                />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <span className="bg-white/90 dark:bg-black/70 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-gray-900 dark:text-white">
                                        Nature
                                    </span>
                                </div>
                            </div>

                            {/* Bottom right image */}
                            <div className="relative h-48 sm:h-64 group">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors rounded-3xl z-10"></div>
                                <img
                                    alt="Asian Architecture"
                                    className="w-full h-full object-cover rounded-3xl shadow-xl transform transition-transform duration-500 group-hover:-translate-y-2"
                                    src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop"
                                />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <span className="bg-white/90 dark:bg-black/70 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-gray-900 dark:text-white">
                                        Culture
                                    </span>
                                </div>
                            </div>

                            {/* Floating flight card */}
                            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-xl z-30 animate-float">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/20 p-2 rounded-full text-primary">
                                        <Plane className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Flight to</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Bali, Indonesia</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
