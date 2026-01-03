import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import { Calendar, BarChart3, Users, LayoutDashboard, LogOut, Sun, Moon, Plane } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
    const location = useLocation()
    const { isDark, toggleTheme } = useTheme()
    const { user, loading } = useAuth()
    const isActive = (path) => location.pathname.startsWith(path)

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    // Redirect to login if not authenticated
    if (!loading && !user) {
        return <Navigate to="/login" replace />
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/community', label: 'Community', icon: Users },
        { path: '/admin', label: 'Analytics', icon: BarChart3 },
    ]

    return (
        <div className="min-h-screen bg-[#FDFCF6] dark:bg-slate-900 transition-colors duration-300">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-[#FDFCF6]/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <Plane className="w-7 h-7 text-[#FF7E5F] rotate-45" />
                            <span className="font-serif font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
                                Globe<span className="text-[#FF7E5F]">Trotter</span>
                            </span>
                        </Link>

                        {/* Nav Links - Desktop */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`font-medium transition flex items-center gap-2 ${isActive(link.path)
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-[#FF7E5F] dark:hover:text-[#FF7E5F]'
                                        }`}
                                >
                                    <link.icon size={18} />
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* User Profile & Logout */}
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                                <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer">
                                    <img
                                        alt="User Profile"
                                        className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                                    />
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">Traveler</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Explorer</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-around py-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${isActive(link.path)
                                    ? 'text-[#FF7E5F] bg-orange-50 dark:bg-orange-900/20'
                                    : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                <link.icon size={20} />
                                <span className="text-xs font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-800 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Plane className="w-5 h-5 text-[#FF7E5F] rotate-45" />
                            <span className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                                Globe<span className="text-[#FF7E5F]">Trotter</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © 2024 GlobeTrotter Inc. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <a href="#" className="hover:text-[#FF7E5F] transition">Privacy</a>
                            <a href="#" className="hover:text-[#FF7E5F] transition">Terms</a>
                            <a href="#" className="hover:text-[#FF7E5F] transition">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
