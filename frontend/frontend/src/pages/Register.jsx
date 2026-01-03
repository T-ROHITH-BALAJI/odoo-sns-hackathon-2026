import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    Mail,
    Phone,
    User,
    Camera,
    ArrowRight,
    Sun,
    Moon,
    ArrowLeft,
    Check,
    Plane,
    X,
    Lock,
    Eye,
    EyeOff,
    Loader2
} from 'lucide-react';

export default function Register() {
    const { isDark, toggleTheme } = useTheme();
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [profileImage, setProfileImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        agreeToTerms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.fullName || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.agreeToTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        setLoading(true);

        try {
            await signUp(formData.email, formData.password, formData.fullName);
            toast.success('Account created! Please check your email to verify.');
            navigate('/login');
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
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
                            backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=1600&fit=crop')"
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
                            "The journey of a thousand miles begins with a single step. Join us and discover the unseen corners of the world."
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div
                                className="h-12 w-12 rounded-full border-2 border-white/30 bg-cover bg-center"
                                style={{
                                    backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop')"
                                }}
                            />
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">Marcus Chen</span>
                                <span className="text-white/70 text-xs">GlobeTrotter Since 2021</span>
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

                    {/* Scrollable Form Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:px-20 lg:py-10">
                        <div className="max-w-lg mx-auto w-full">
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                                    Start your journey
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 text-base">
                                    Create your traveler profile to access exclusive guides and community features.
                                </p>
                            </div>

                            {/* Profile Photo Upload */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                                <div className="relative group">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-700 shadow-md flex items-center justify-center overflow-hidden transition-all cursor-pointer hover:border-primary"
                                    >
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                        )}
                                    </div>
                                    {profileImage ? (
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-sm border-2 border-white dark:border-background-dark hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-sm border-2 border-white dark:border-background-dark cursor-pointer hover:bg-primary/90 transition-colors"
                                        >
                                            <Camera className="w-3 h-3" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Profile Photo</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">JPG, PNG up to 5MB</p>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        {profileImage ? 'Change Image' : 'Upload Image'}
                                    </button>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                {/* Name Row */}
                                <div className="flex flex-col md:flex-row gap-5">
                                    <label className="flex flex-col flex-1 group">
                                        <span className="text-gray-900 dark:text-gray-200 text-sm font-semibold mb-2">First Name</span>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 outline-none"
                                                placeholder="Amelia"
                                                required
                                            />
                                            {formData.firstName && (
                                                <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                    </label>
                                    <label className="flex flex-col flex-1">
                                        <span className="text-gray-900 dark:text-gray-200 text-sm font-semibold mb-2">Last Name</span>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 outline-none"
                                            placeholder="Earhart"
                                            required
                                        />
                                    </label>
                                </div>

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
                                            placeholder="amelia@explorer.com"
                                            required
                                        />
                                    </div>
                                </label>

                                {/* Phone */}
                                <label className="flex flex-col">
                                    <span className="text-gray-900 dark:text-gray-200 text-sm font-semibold mb-2">Phone Number</span>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white h-12 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 outline-none"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </label>

                                {/* Location Row */}
                                <div className="flex flex-col md:flex-row gap-5">
                                    <label className="flex flex-col flex-1">
                                        <span className="text-gray-900 dark:text-gray-200 text-sm font-semibold mb-2">City</span>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 outline-none"
                                            placeholder="New York"
                                        />
                                    </label>
                                    <label className="flex flex-col flex-1">
                                        <span className="text-gray-900 dark:text-gray-200 text-sm font-semibold mb-2">Country</span>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer outline-none"
                                        >
                                            <option>United States</option>
                                            <option>United Kingdom</option>
                                            <option>Japan</option>
                                            <option>France</option>
                                            <option>India</option>
                                            <option>Australia</option>
                                        </select>
                                    </label>
                                </div>

                                {/* Bio */}
                                <label className="flex flex-col">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-900 dark:text-gray-200 text-sm font-semibold">Additional Information</span>
                                        <span className="text-xs text-gray-400">Optional</span>
                                    </div>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white min-h-[100px] p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 resize-none outline-none"
                                        placeholder="Tell us a bit about your travel style..."
                                    />
                                </label>

                                {/* Terms */}
                                <label className="flex items-start gap-3 mt-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className="h-5 w-5 rounded text-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-primary/20 transition-all mt-0.5 accent-primary"
                                        required
                                    />
                                    <span className="text-sm text-gray-500 dark:text-gray-400 leading-normal select-none group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                        I agree to the <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>.
                                    </span>
                                </label>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="mt-4 w-full h-14 bg-primary hover:bg-primary/90 active:scale-[0.99] text-white rounded-xl text-base font-bold transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                                >
                                    <span>Complete Registration</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 text-center pb-6">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Already have an account?
                                    <Link to="/login" className="text-primary font-bold hover:underline ml-1">Log In</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
