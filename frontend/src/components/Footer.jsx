import { Plane, Facebook, Twitter, Instagram } from 'lucide-react';

const footerLinks = {
    aboutUs: [
        { name: 'Our Story', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Press', href: '#' },
    ],
    travelInterest: [
        { name: 'Adventure Travel', href: '#' },
        { name: 'Art and Culture', href: '#' },
        { name: 'Wildlife and Nature', href: '#' },
        { name: 'Family Holidays', href: '#' },
        { name: 'Food and Drink', href: '#' },
    ],
    topDestinations: [
        { name: 'Italy', href: '#' },
        { name: 'Japan', href: '#' },
        { name: 'New York City', href: '#' },
        { name: 'Paris', href: '#' },
        { name: 'Los Angeles', href: '#' },
    ],
    guidebookShop: [
        { name: 'Destination Guides', href: '#' },
        { name: 'Non-English Guides', href: '#' },
        { name: 'Phrasebooks', href: '#' },
        { name: 'Gift Cards', href: '#' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-background-light dark:bg-background-dark pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main footer grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand column */}
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Plane className="w-5 h-5 text-primary rotate-45" />
                            <span className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                                GLOBE<span className="text-primary">TROTTER</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Discovering the world, one hidden wonder at a time.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* About Us */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">About Us</h4>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            {footerLinks.aboutUs.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Travel Interest */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Travel Interest</h4>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            {footerLinks.travelInterest.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Top Destinations */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Top Destinations</h4>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            {footerLinks.topDestinations.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Guidebook Shop */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Guidebook Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            {footerLinks.guidebookShop.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                    <p>© 2026 GlobeTrotter, Inc. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                            Cookie Settings
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
