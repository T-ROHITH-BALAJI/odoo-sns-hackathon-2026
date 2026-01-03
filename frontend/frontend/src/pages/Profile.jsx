import {
    MapPin,
    Calendar,
    Clock,
    Sun,
    Share2,
    Plus,
    ArrowRight,
    Plane,
    Camera,
    Mail,
    Save
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
    // Mock user data - in a real app this would come from the auth context/database
    const user = {
        name: "Sarah",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgG6EvDOVFmlp-ZBBV86WLbUwyiXrXR2egALpmVc-NGmEI7k3JZkg1QKephADUUU_-bJYh7CXmZ8wRDNLKmC3B_Jv7rwAi9NtM-pBUOjE0xo2otZ3hbk8vpuDeOpVYed4oqfpadg5RIhTb9Dt9va0Vn90HEL4FVop5909Y0tRn_-pbM-teESBaDs2phC_xKVHLAnDdWrqtATY3nqQ4OZ-IJ_uY3w9gs1GE8JZJ9-oFvn4no1QkNohCHdSlmfCwdtkH4RgtZM-9ooU0"
    };

    return (
        <div className="flex-grow w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">Welcome back, {user.name}</p>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
                        Your Travel <span className="relative inline-block">
                            Journal
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" preserveAspectRatio="none" viewBox="0 0 100 10">
                                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3"></path>
                            </svg>
                        </span>
                    </h1>
                </div>
                <Link to="/create-trip" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-primary/30 flex items-center gap-2 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Plan new trip
                </Link>
            </div>

            {/* Personal Details Section */}
            <section className="mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-md">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-0 right-0 bg-[#FF7E5F] text-white p-2 rounded-full shadow-lg hover:bg-[#E86343] transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-1">Maria Angelica</h2>
                        <p className="text-[#FF7E5F] font-medium text-sm mb-8">Global Nomad</p>

                        <div className="flex justify-center gap-8 w-full mb-8 border-t border-b border-gray-100 dark:border-gray-800 py-6">
                            <div>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mt-1">Countries</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">12</p>
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mt-1">Trips</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">148</p>
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mt-1">Reviews</p>
                            </div>
                        </div>

                        <div className="w-full text-left">
                            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white mb-3">About Me</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                Passionate traveler seeking hidden gems and culinary adventures. Based in San Francisco but mentally in Kyoto. Love photography and sustainable travel.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Personal Details Form */}
                    <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-2xl p-8 shadow-soft border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Personal Details</h2>
                            <button className="text-[#FF7E5F] hover:text-[#E86343] font-medium text-sm flex items-center gap-1 transition-colors">
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">First Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Maria"
                                        className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7E5F] text-gray-900 dark:text-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Last Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Angelica"
                                        className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7E5F] text-gray-900 dark:text-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="email"
                                        defaultValue="maria.angelica@example.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7E5F] text-gray-900 dark:text-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone</label>
                                    <input
                                        type="tel"
                                        defaultValue="+1 (555) 123-4567"
                                        className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7E5F] text-gray-900 dark:text-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">City</label>
                                    <input
                                        type="text"
                                        defaultValue="San Francisco"
                                        className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7E5F] text-gray-900 dark:text-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Additional Preferences</label>
                                <textarea
                                    rows="3"
                                    defaultValue="Vegetarian, allergic to peanuts. Prefer window seats."
                                    className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7E5F] text-gray-900 dark:text-white transition-all resize-none"
                                ></textarea>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Happening Now Section */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Happening Now</h2>
                </div>
                <div className="relative bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-soft group border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl">
                    <div className="grid md:grid-cols-2 gap-0">
                        <div className="relative h-64 md:h-auto overflow-hidden">
                            <img
                                alt="Kyoto Streets"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtZPuq-Xklf_JBwnIzK7B8EvMod1DQt1EGHSR_PNMANMoo87bibpiuCE35yzTbmvJ5YTx2PN912TxeI7kIKJL-5UixsWtbb_J3v47xtZ8mHkfelUuus0xUE5LKCCVwFJiulcveMEvJ7i7PHDq1VbjB6VGQupIYcG9eLCBkeWyCWlvtiZiL8z3cy2uZI6zXQvlLGtsHPsOpKvB21eKcmV1dThMfFCKJ_uHoOzAz3aak-3ZgrbcO_Q60Aw_zDxRMVrcIQuOUaCk8jiJI"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                                <Plane className="w-3 h-3" />
                                ONGOING
                            </div>
                        </div>
                        <div className="p-8 md:p-10 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-serif text-3xl font-bold mb-1 text-gray-900 dark:text-white">Kyoto, Japan</h3>
                                    <p className="text-text-muted-light dark:text-text-muted-dark text-sm flex items-center gap-1">
                                        <Calendar className="w-4 h-4" /> Oct 12 - Oct 24, 2023
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">Day 4</p>
                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">of 12 days</p>
                                </div>
                            </div>
                            <p className="text-text-main-light dark:text-text-main-dark mb-6 leading-relaxed">
                                Currently exploring the historic Gion district. The autumn leaves are starting to turn, creating a beautiful contrast with the wooden Machiya houses. Tomorrow: Fushimi Inari Taisha.
                            </p>
                            <div className="bg-background-light dark:bg-background-dark p-4 rounded-xl mb-6 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 p-2 rounded-lg">
                                        <Sun className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">Sunny</p>
                                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">22°C • UV Moderate</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">Next Activity</p>
                                    <p className="text-xs text-primary">Tea Ceremony @ 3:00 PM</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-text-main-light dark:bg-white text-white dark:text-black py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                                    View Itinerary
                                </button>
                                <button className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-text-main-light dark:text-text-main-dark">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Upcoming Adventures Section */}
            <section className="mb-16">
                <h2 className="font-serif text-2xl font-bold mb-6 text-gray-900 dark:text-white">Upcoming Adventures</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <article className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all hover:-translate-y-1 group border border-gray-100 dark:border-gray-800 flex flex-col">
                        <div className="relative h-56 overflow-hidden">
                            <img
                                alt="Cinque Terre"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA8bYrJme0VoFPLA5iCQZpPpaClSXoLn9XSmkvWHAPSRJWvt7D4irR-X9_Tzu7n6mPMmxrj6OYT8Tx8CQfBjkGrGJnX1kly2IbXCRICOKNo9vLhJuVYy8bJSr5LQlHmHXi7Pt31lRWM9Pw9KY93JMEX1Ya8tBXDLrRkWcJjDPDxw78gvHl5zWDUohD0z4Iw8PcqglUcIActN8eOBO-gq6ul0jihKcdoadYOge_pO6VOt2r4DwAuoZmluKGVjZdGk3JcWoR915CreBX"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-text-main-light dark:text-white flex items-center gap-1">
                                IN 45 DAYS
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-serif text-xl font-bold mb-1 text-gray-900 dark:text-white">Cinque Terre, Italy</h3>
                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">Dec 10 - Dec 18, 2023</p>
                            <div className="mt-auto">
                                <div className="flex -space-x-2 mb-4">
                                    <img alt="Friend" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUUO4Y51kAwQFxBk1cPEGFLy4aqU9vlRxWiXlfaHQfJZAlHmVh1Yp69aigde5Tgmpy-GPS32FC8_7RqmeZGtLnE1Kjp0cPZeqCj5B3D8jKEJFLASfAnFJwOC1W7rKdJYrvdaICAzcTueF_DfGVugjBsaXGmYfWxtYbCluWs2CsUHNnwbhuW0GpwpcIqhXSsy0JVqjHQsKKZd3Xc7ajVaGsmaRKrB9dDaSENW_naJFgRKfonBOV3Hu_Gn4JKP_kqzBk8eVyhHm5AMSx" />
                                    <img alt="Friend" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJf5yonlme8zTRqNu37TKfc0wKSP0BuLjGkdbARjKPA097ld3zulM4SFYCsqH239PMBLZIT-4MfBmZs8Y6VyPr1YZxTOQ3wUgtSnrVcaHsWHT5Stk1wTg4sOD-UN7rOYeOjRqFTFbNp8sbZ5Cd00yZHqWXyrR4l9nRAsYTUxPQ1aKHDFGysMiy-HIIx4FDfsknEPGISbGo39dPpT31ctdUwPVkdS_oXS8GwSnO9Fdmri8zw-xG22FkiRHzk0CkjXuw7avPXfP4BHQY" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">+2</div>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                                </div>
                                <div className="flex justify-between text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                                    <span>Planning Status</span>
                                    <span className="text-green-500">80% Ready</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-6 pt-0">
                            <button className="w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white">
                                Continue Planning
                            </button>
                        </div>
                    </article>

                    {/* Card 2 */}
                    <article className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all hover:-translate-y-1 group border border-gray-100 dark:border-gray-800 flex flex-col">
                        <div className="relative h-56 overflow-hidden">
                            <img
                                alt="Rome"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfC-3ju6dJ724y0s4boMbBFN65zzLyEArwc0L4w8EXxWZMGIzunUjTE8JGvejx3LgSixKR-fxw0XiD1SfzGAhtuJuimeJffwvm3VOEwuIVYmKzjiNgvxeAriVHXeUeaimcHccNs8Fee7TkVrrk3GWDtbyfbn7pXTZt1FQx5iOTrZlHKTYWHNkAt6t5O8tus67lDSA8uzAEjKt_PiYAmR1ScG9M8U5T4i8Gyb5q5NESighZLC8zJpTz7IWbjs3s1KctRU1P5Dd6cBSb"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-text-main-light dark:text-white flex items-center gap-1">
                                IN 3 MONTHS
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-serif text-xl font-bold mb-1 text-gray-900 dark:text-white">Rome, Italy</h3>
                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">Feb 14 - Feb 20, 2024</p>
                            <div className="mt-auto">
                                <div className="flex -space-x-2 mb-4">
                                    <img alt="Me" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1ir-s4IPt_XOU8YsLeX53RROrT6B6FlBaMUU0D-ngV79NxrD9gd34216P_fVzf2V7LKUkkr20mqb-1vwf4xhBxOMH6D99sDjBA1rdfsbtu4YPjoIyp-P0lLOuOtkG7bHzgeBeCTerWwmO-h613aOzZsna1BE0TkF1Mhf8P79S3niLOrtxkNLjha822oujYZ92lgcImjs8sbKKtrINjfbjpuTVhnqhksHpT4gk902afP7Zd8GZXu06LSwK6gN7JPoKrWfoTKjHuj1G" />
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
                                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '20%' }}></div>
                                </div>
                                <div className="flex justify-between text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                                    <span>Planning Status</span>
                                    <span className="text-yellow-500">Just Started</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-6 pt-0">
                            <button className="w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white">
                                Continue Planning
                            </button>
                        </div>
                    </article>

                    {/* New Trip Card */}
                    <Link to="/create-trip" className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center p-8 hover:border-primary hover:bg-primary/5 transition-all group h-full min-h-[400px]">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-primary group-hover:bg-white dark:group-hover:bg-gray-900 flex items-center justify-center mb-4 transition-colors">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-text-main-light dark:text-text-main-dark mb-2">Dreaming of somewhere?</h3>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark max-w-[200px]">Start planning your next getaway. We'll help you organize everything.</p>
                    </Link>
                </div>
            </section>

            {/* Memories Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl font-bold text-text-main-light dark:text-text-main-dark opacity-90">Memories & Past Trips</h2>
                    <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Memory 1 */}
                    <a href="#" className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-md">
                        <img
                            alt="Paris"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKJ3MbcT_8l9UvzpB83OoSiR4wvFrvEOm73fI41sfEAQXhuDIaEZzrG5Ki2wZv2uXOr9G-MiGRAxSG1BmX23q8x31yjItTkHEGrkpA8vETcxp_XPrKLNUaGDPtitgixrk5bANBrAUQfsPBwuqZTUYRaNeKMin6JwUG0P4gieoVhOFpQwm33l_c-u6NYPdx_zcZRu2G8TRW015fNHUhtGmT4VNRPn7S36LPEad-vZXTcueriSlHscMDwrS7s-j211cbV66BFxTiuX79"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-md mb-2">COMPLETED</span>
                            <h4 className="text-white font-serif font-bold text-lg">Paris, France</h4>
                            <p className="text-gray-300 text-xs">June 2023</p>
                        </div>
                    </a>

                    {/* Memory 2 */}
                    <a href="#" className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-md">
                        <img
                            alt="Bali"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtqRSb6xGq4Rt5rjGV4vRf974Lep2vI_BEHxVTYSeOXDDHXU4wqeG9b3NvySszENOtqDGfnNZaIXo8YVmNpk9ZvU4sUfe3mfklUN8F85Jv6u6hgbqTw7lqznYoaXKGNJwSJ-dJSg40ojRCsBHZb6uywB0vvS_-TuI39GIroCMx2N9op9MkF0vWfcRNxgllic0ZPFfsAxpbgUDL_LoyUMTQ4n-8IwCqqzHhLqyojl8HjtzXgTfiwHT-hS1f1FIpcUWDweMKMwyUppTa"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-md mb-2">COMPLETED</span>
                            <h4 className="text-white font-serif font-bold text-lg">Bali, Indonesia</h4>
                            <p className="text-gray-300 text-xs">August 2022</p>
                        </div>
                    </a>

                    {/* Memory 3 */}
                    <a href="#" className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-md">
                        <img
                            alt="Thailand"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPP8INxJl0hVO7fQR6IGot5WR0ZMZwxwrb_movYrQbTJHZ7wqhZEVNnCDRijqsXy-2uCc6ikdCBKG7jCuJsZHHaVEvPnhvNLoP7mI-V_ctlyJ-PwiocMWVssstsPWltcK_Ufo9GSSKHMvlUlQOhX9RbZ1R6xo7K0fkUhl_b_ZJ3dOpPfF68E28vuMLYB8duHT3S1nDtt2kTgW6LNiKL3d0rpPTOMujJrezIdX3DjI-bfAGCa03avPL_i7nEerqLwq1JeptM49IzAig"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-md mb-2">COMPLETED</span>
                            <h4 className="text-white font-serif font-bold text-lg">Krabi, Thailand</h4>
                            <p className="text-gray-300 text-xs">Jan 2022</p>
                        </div>
                    </a>

                    {/* Memory 4 */}
                    <a href="#" className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-md">
                        <img
                            alt="New York"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9gs41KROuoFk873Y5v911mXa0_Xvx-Tak9_Hgsq2nn1r-OVhnkNbqRsKuy0-PuauBGHWt6zpeuPbZE9yBOqPpF8QLe3BNe5IRtU61z2Z4yM0mXqaNVUgrqa2FVC_X8PobwgYIdW1FcWzjeN0AJpl5k9zYpyfyybqdN36x_ya4haCR4rHR6hF8XZwhim_wDWTbHvtau-BhPv6JpqjJ2JTUoayq0LLoSoDB2hz7EQ9jaPEfL_fMpuVM8QLO_xlgSyMeyxgdCAZ76HJ5"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-md mb-2">COMPLETED</span>
                            <h4 className="text-white font-serif font-bold text-lg">NYC, USA</h4>
                            <p className="text-gray-300 text-xs">Dec 2021</p>
                        </div>
                    </a>
                </div>
            </section>
        </div>
    );
}
