import { ArrowRight } from 'lucide-react';

const mainStory = {
    title: "Los Angeles food & drink guide: 10 things to try in Los Angeles, California",
    category: "Food and Drink",
    date: "Aug 24, 2024",
    readTime: "8 min read",
    description: "From street tacos to Michelin-starred dining, explore the culinary landscape of LA. Discover hidden gems and local favorites that define the city's vibrant food scene.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop",
};

const sideStories = [
    {
        id: 1,
        title: "15 South London Markets You'll Love: Best Markets in South London",
        category: "Shopping",
        date: "Aug 15, 2024",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop",
    },
    {
        id: 2,
        title: "10 incredible hotels around the world you can book with points in 2024",
        category: "Hotels",
        date: "Aug 10, 2024",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop",
    },
    {
        id: 3,
        title: "Visiting Chicago on a Budget: Affordable Eats and Attraction Deals",
        category: "Travel Budget",
        date: "Aug 02, 2024",
        image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200&h=200&fit=crop",
    },
];

export default function StoriesSection() {
    return (
        <section className="py-16 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
                        Latest Stories
                    </h2>
                    <a
                        href="#"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Read more on blog
                    </a>
                </div>

                {/* Stories grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main featured story */}
                    <div className="lg:col-span-2 group cursor-pointer">
                        <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden mb-6">
                            <img
                                alt={mainStory.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src={mainStory.image}
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                                    {mainStory.category}
                                </span>
                            </div>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                            {mainStory.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                            <span>{mainStory.date}</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>{mainStory.readTime}</span>
                        </div>
                        <p className="mt-3 text-gray-600 dark:text-gray-400 line-clamp-2">
                            {mainStory.description}
                        </p>
                    </div>

                    {/* Side stories list */}
                    <div className="flex flex-col gap-6">
                        {sideStories.map((story) => (
                            <div key={story.id} className="flex gap-4 group cursor-pointer">
                                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                                    <img
                                        alt={story.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        src={story.image}
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-primary text-xs font-semibold mb-1">{story.category}</span>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                        {story.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{story.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
