import { Star, Play, ArrowRight } from 'lucide-react';

export default function HighlightsSection() {
    return (
        <section className="py-16 bg-white dark:bg-surface-dark transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-10">
                    Trekker's Highlights
                </h2>

                <div className="bg-background-light dark:bg-background-dark rounded-3xl p-6 lg:p-10 flex flex-col lg:flex-row gap-8 items-center">
                    {/* Testimonial content */}
                    <div className="lg:w-1/2">
                        {/* User info */}
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                alt="Maria Angelica"
                                className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                            />
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">Maria Angelica</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Travel Enthusiast</p>
                            </div>
                        </div>

                        {/* Star rating */}
                        <div className="flex text-yellow-400 mb-4 text-sm gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                        </div>

                        {/* Testimonial text */}
                        <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-3">
                            An Unforgettable Journey Through Turkey
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                            "Thanks to GlobeTrotter, my trip to Turkey was truly magical. From vibrant spices and mysterious bazaars to hidden gems and must-see spots, I would have missed without them. The suggested itinerary made exploring Istanbul's blend of east and west seamless."
                        </p>
                    </div>

                    {/* Video grid */}
                    <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
                        <div className="relative rounded-2xl overflow-hidden aspect-video col-span-1 group cursor-pointer">
                            <img
                                alt="Cappadocia"
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                src="https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=400&h=250&fit=crop"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                <Play className="w-12 h-12 text-white drop-shadow-lg fill-white/30" />
                            </div>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden aspect-video col-span-1 group cursor-pointer">
                            <img
                                alt="Istanbul"
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=250&fit=crop"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                <Play className="w-12 h-12 text-white drop-shadow-lg fill-white/30" />
                            </div>
                        </div>

                        <div className="col-span-2 flex justify-end">
                            <a
                                href="#"
                                className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors gap-1"
                            >
                                See more highlights
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
