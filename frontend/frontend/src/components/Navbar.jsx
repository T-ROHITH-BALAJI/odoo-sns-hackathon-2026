import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Search, Sun, Moon, Plane } from 'lucide-react';

export default function Navbar() {
    const { isDark, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Destinations', href: '#destinations' },
        { name: 'Travel Guides', href: '#guides' },
        { name: 'Inspiration', href: '#inspiration' },
        { name: 'Stay', href: '#stay' },
    ];

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm'
                : 'bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                        <Plane className="w-7 h-7 text-primary rotate-45" />
                        <span className="font-serif font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
                            GLOBE<span className="text-primary">TROTTER</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium hover-underline-animation text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Right side buttons */}
                    <div className="flex items-center space-x-3">
                        {/* Search button */}
                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Sign In button */}
                        <Link
                            to="/login"
                            className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-full text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-all shadow-sm"
                        >
                            Sign In
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col space-y-3">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-2"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-full text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-all mt-2"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
