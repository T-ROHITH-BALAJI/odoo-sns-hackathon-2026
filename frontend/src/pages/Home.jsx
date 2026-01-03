import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import DestinationsSection from '../components/DestinationsSection';
import StoriesSection from '../components/StoriesSection';
import HighlightsSection from '../components/HighlightsSection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors">
            <Navbar />
            <main>
                <HeroSection />
                <DestinationsSection />
                <StoriesSection />
                <HighlightsSection />
                <NewsletterSection />
            </main>
            <Footer />
        </div>
    );
}
