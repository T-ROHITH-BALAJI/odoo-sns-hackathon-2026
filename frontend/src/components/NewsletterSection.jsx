import { useState } from 'react';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle newsletter signup
        console.log('Newsletter signup:', email);
        setEmail('');
    };

    return (
        <section className="relative py-24">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                <img
                    alt="Travel Landscape"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=600&fit=crop"
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
                    Get Your Travel Inspiration <br /> Straight to Your Inbox
                </h2>
                <p className="text-gray-200 mb-8 max-w-xl mx-auto">
                    Join our community of travelers and get exclusive deals, hidden gem alerts, and expert travel tips delivered weekly.
                </p>

                {/* Email form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-grow px-6 py-4 rounded-full border-0 focus:ring-2 focus:ring-primary text-gray-900 placeholder-gray-500 outline-none bg-white"
                        required
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg transform active:scale-95"
                    >
                        Subscribe
                    </button>
                </form>

                <p className="text-xs text-gray-300 mt-4">
                    By subscribing you agree to our privacy policy and terms.
                </p>
            </div>
        </section>
    );
}
