import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabaseClient';
import {
    Mail,
    Lock,
    ArrowRight,
    Sun,
    Moon,
    ArrowLeft,
    Eye,
    EyeOff,
    Plane,
    Loader2
} from 'lucide-react';

export default function Login() {
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            // Successful login - navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            });

            if (error) throw error;
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="font-sans bg-background-light dark:bg-background-dark text-gray-900 dark:text-white min-h-screen overflow-hidden">
            <div className="flex h-screen w-full">
                {/* Left Side: Visual Hero (Hidden on mobile) */}
                <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden group">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-110"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=1600&fit=crop')"
                        }}
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>

                    {/* Top Content - Logo */}
                    <div className="relative z-10 flex items-center gap-2">
                        <Plane className="w-7 h-7 text-primary rotate-45" />
                        <span className="font-serif font-bold text-2xl tracking-tight text-white">
                            GLOBE<span className="text-primary">TROTTER</span>
                        </span>
                    </div>

                    {/* Bottom Content - Quote */}
                    <div className="relative z-10 max-w-lg">
                        <blockquote className="font-serif text-2xl font-medium text-white leading-relaxed mb-6 italic">
                            "Adventure awaits around every corner. Welcome back to continue your exploration of the world's most beautiful destinations."
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div
                                className="h-12 w-12 rounded-full border-2 border-white/30 bg-cover bg-center"
                                style={{
                                    backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop')"
                                }}
                            />
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">Sarah Mitchell</span>
                                <span className="text-white/70 text-xs">Visited 42 Countries</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Container */}
                <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-background-dark relative z-0">
                    {/* Mobile Header */}
                    <div className="lg:hidden p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <Link to="/" className="flex items-center gap-2">
                            <Plane className="w-6 h-6 text-primary rotate-45" />
                            <span className="font-serif font-bold text-xl text-gray-900 dark:text-white">
                                GLOBE<span className="text-primary">TROTTER</span>
                            </span>
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:text-primary transition-colors"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Desktop top bar */}
                    <div className="hidden lg:flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Centered Form Area */}
                    <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:px-20">
                        <div className="max-w-md mx-auto w-full">
                            {/* Header */}
                            <div className="mb-10 text-center">
                                <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                                    Welcome back
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 text-base">
                                    Sign in to continue planning your next adventure
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                    <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                                </div>
                            )}

                            {/* Google Login Button */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full h-12 flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
                            </button>

                            {/* Divider */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white dark:bg-background-dark text-gray-500 dark:text-gray-400">or continue with email</span>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                {/* Email */}
                                <label className="flex flex-col">
                                    <span className="text-gray-900 dark:text-gray-200 text-sm font-semibold mb-2">Email Address</span>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white h-12 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 outline-none"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </label>

                                {/* Password */}
                                <label className="flex flex-col">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-900 dark:text-gray-200 text-sm font-semibold">Password</span>
                                        <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</a>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white h-12 pl-12 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </label>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-4 w-full h-14 bg-primary hover:bg-primary/90 active:scale-[0.99] text-white rounded-xl text-base font-bold transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Don't have an account?
                                    <Link to="/register" className="text-primary font-bold hover:underline ml-1">Sign Up</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
