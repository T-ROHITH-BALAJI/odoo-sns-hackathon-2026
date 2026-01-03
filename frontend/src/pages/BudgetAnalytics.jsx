import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Calendar, Share2, Plus, DollarSign,
    ShoppingBag, MapPin, Receipt, Hotel, Coffee,
    Utensils, Plane, Train, Bus, Activity,
    ArrowLeft, PieChart, TrendingUp, TrendingDown
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function BudgetAnalytics() {
    const { tripId } = useParams()
    const [trip, setTrip] = useState(null)
    const [expenses, setExpenses] = useState([])
    const [tripStops, setTripStops] = useState([])
    const [loading, setLoading] = useState(true)
    const [budgetStats, setBudgetStats] = useState({
        total: 0,
        spent: 0,
        remaining: 0,
        percentUsed: 0,
        categoryBreakdown: []
    })

    useEffect(() => {
        if (tripId) {
            fetchData()
        }
    }, [tripId])

    const fetchData = async () => {
        try {
            // Fetch trip details
            const { data: tripData, error: tripError } = await supabase
                .from('trips')
                .select('*')
                .eq('id', tripId)
                .single()

            if (tripError) throw tripError
            setTrip(tripData)

            // Fetch expenses
            const { data: expensesData, error: expensesError } = await supabase
                .from('expenses')
                .select('*')
                .eq('trip_id', tripId)
                .order('date', { ascending: true })

            if (expensesError) throw expensesError
            setExpenses(expensesData || [])

            // Fetch trip stops (itinerary)
            // Note: Assuming 'trip_stops' logic exists based on previous files, 
            // if not we'll graceful fallback to just dates
            const { data: stopsData, error: stopsError } = await supabase
                .from('trip_stops')
                .select('*, cities(name)')
                .eq('trip_id', tripId)
                .order('start_date', { ascending: true })

            if (!stopsError) {
                setTripStops(stopsData || [])
            }

            calculateStats(tripData, expensesData || [])

        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateStats = (tripData, expensesList) => {
        const total = tripData.budget || 0
        const spent = expensesList.reduce((sum, item) => sum + (item.actual_cost || item.estimated_cost || 0), 0)
        const remaining = total - spent
        const percentUsed = total > 0 ? (spent / total) * 100 : 0

        // Category breakdown
        const categories = {}
        expensesList.forEach(exp => {
            const cat = exp.category || 'Other'
            const amount = exp.actual_cost || exp.estimated_cost || 0
            categories[cat] = (categories[cat] || 0) + amount
        })

        const categoryBreakdown = Object.entries(categories)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)

        setBudgetStats({
            total,
            spent,
            remaining,
            percentUsed,
            categoryBreakdown
        })
    }

    const groupExpensesByDate = () => {
        const grouped = {}
        // Initialize timeline with trip dates if possible, or just use expense dates
        expenses.forEach(exp => {
            const date = exp.date ? new Date(exp.date).toLocaleDateString() : 'Unscheduled'
            if (!grouped[date]) {
                grouped[date] = {
                    date: exp.date,
                    expenses: [],
                    total: 0
                }
            }
            grouped[date].expenses.push(exp)
            grouped[date].total += (exp.actual_cost || exp.estimated_cost || 0)
        })

        // Merge with stops/itinerary logic if needed, simplify for now to just grouped by date
        return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date))
    }

    const getCategoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'food': return <Utensils size={20} />;
            case 'transport': return <Train size={20} />;
            case 'accommodation': return <Hotel size={20} />;
            case 'activity': return <Activity size={20} />;
            case 'shopping': return <ShoppingBag size={20} />;
            case 'flight': return <Plane size={20} />;
            default: return <Receipt size={20} />;
        }
    }

    const getCategoryColor = (category) => {
        switch (category?.toLowerCase()) {
            case 'food': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
            case 'transport': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
            case 'accommodation': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
            case 'activity': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            case 'shopping': return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
        }
    }

    const convertToDayTitle = (dateStr) => {
        if (!dateStr || dateStr === 'Unscheduled') return 'Unscheduled Items'
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>

    const groupedExpenses = groupExpensesByDate()

    return (
        <div className="min-h-screen bg-[#FFFBF6] dark:bg-[#18181B] text-gray-900 dark:text-gray-100 pb-20 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

                {/* Header */}
                <header className="mb-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
                        <div>
                            <Link to="/my-trips" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF6B4A] transition-colors mb-4">
                                <ArrowLeft size={16} /> Back to My Trips
                            </Link>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#FF6B4A] text-xs font-bold uppercase tracking-wider">
                                    Current Trip
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                                    <Calendar size={16} />
                                    {trip?.start_date ? new Date(trip.start_date).toLocaleDateString() : 'Start Date'} - {trip?.end_date ? new Date(trip.end_date).toLocaleDateString() : 'End Date'}
                                </span>
                            </div>
                            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-2">
                                {trip?.name || "Trip Itinerary"}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg">
                                {trip?.description || "Plan your budget and track your expenses."}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2">
                                <Share2 size={18} /> Share
                            </button>
                            <button className="px-6 py-3 rounded-xl bg-[#FF6B4A] hover:bg-[#E65535] text-white font-medium shadow-lg shadow-orange-500/30 transition flex items-center gap-2">
                                <Plus size={18} /> Add Expense
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Budget */}
                        <div className="bg-white dark:bg-[#27272A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <DollarSign size={64} className="text-[#FF6B4A]" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Budget</p>
                            <h3 className="text-3xl font-bold font-serif">${budgetStats.total.toFixed(2)}</h3>
                            <div className="mt-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-[#FF6B4A] h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        {/* Spent */}
                        <div className="bg-white dark:bg-[#27272A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <ShoppingBag size={64} className="text-blue-500" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Spent so far</p>
                            <h3 className="text-3xl font-bold font-serif text-blue-600 dark:text-blue-400">${budgetStats.spent.toFixed(2)}</h3>
                            <div className="mt-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(budgetStats.percentUsed, 100)}%` }}></div>
                            </div>
                            <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">{budgetStats.percentUsed.toFixed(0)}% used</p>
                        </div>

                        {/* Remaining */}
                        <div className="bg-white dark:bg-[#27272A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <TrendingUp size={64} className="text-green-500" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Remaining</p>
                            <h3 className="text-3xl font-bold font-serif text-green-600 dark:text-green-400">${budgetStats.remaining.toFixed(2)}</h3>
                            <div className="mt-4 flex items-center gap-2">
                                {budgetStats.remaining >= 0 ? (
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-md font-bold">On Track</span>
                                ) : (
                                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs px-2 py-1 rounded-md font-bold">Over Budget</span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-1/4 space-y-6">
                        <div className="bg-white dark:bg-[#27272A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                            <h3 className="font-serif font-bold text-xl mb-4">Itinerary</h3>
                            <nav className="space-y-2">
                                {groupedExpenses.map((group, index) => (
                                    <a key={index} href={`#day-${index}`} className={`flex items-center justify-between p-3 rounded-xl transition-all ${index === 0 ? 'bg-[#FF6B4A] text-white shadow-lg shadow-orange-500/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-[#FF6B4A]'}`}>
                                        <span className="font-medium text-sm truncate max-w-[150px]">{convertToDayTitle(group.date)}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${index === 0 ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>${group.total.toFixed(0)}</span>
                                    </a>
                                ))}
                                {groupedExpenses.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">Add expenses to see timeline</p>
                                )}
                            </nav>

                            <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                                <h4 className="font-bold text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">Breakdown</h4>
                                <div className="space-y-3">
                                    {budgetStats.categoryBreakdown.map((cat, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${idx % 2 === 0 ? 'bg-blue-500' : 'bg-orange-400'}`}></div>
                                                <span className="capitalize">{cat.name}</span>
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {budgetStats.total > 0 ? ((cat.value / budgetStats.total) * 100).toFixed(0) : 0}%
                                            </span>
                                        </div>
                                    ))}
                                    {budgetStats.categoryBreakdown.length === 0 && (
                                        <p className="text-sm text-gray-400 italic">No expense data</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Timeline Content */}
                    <section className="w-full lg:w-3/4 space-y-10">
                        {groupedExpenses.length === 0 && (
                            <div className="text-center py-20 bg-white dark:bg-[#27272A] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FF6B4A]">
                                    <MapPin size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Start your Itinerary</h3>
                                <p className="text-gray-500 mb-6">Add expenses to build your visual timeline.</p>
                                <button className="px-6 py-2 rounded-xl bg-[#FF6B4A] text-white font-medium hover:bg-[#E65535] transition">
                                    Add First Expense
                                </button>
                            </div>
                        )}

                        {groupedExpenses.map((group, groupIndex) => (
                            <div key={groupIndex} className="relative" id={`day-${groupIndex}`}>
                                <div className="flex items-end justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold">{convertToDayTitle(group.date)}</h2>
                                        {/* Optional sub-label could go here */}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-text-sub-light dark:text-text-sub-dark uppercase tracking-wide">Daily Total</p>
                                        <p className="text-xl font-bold text-[#FF6B4A]">${group.total.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="relative pl-8 md:pl-20 pb-4">
                                    {/* Vertical Dotted Line */}
                                    <div className="absolute left-[15px] md:left-[28px] top-0 bottom-0 border-l-2 border-dashed border-gray-200 dark:border-gray-700 z-0"></div>

                                    {/* Expenses List */}
                                    {group.expenses.map((expense, expIndex) => (
                                        <div key={expense.id} className="relative mb-8 last:mb-0 group">
                                            {/* Timeline Node */}
                                            <div className="absolute -left-[35px] md:-left-[80px] top-0 flex flex-col items-center z-10">
                                                <span className="hidden md:block text-xs font-bold text-gray-400 mb-2">
                                                    {/* Fake timestamps for now as they aren't in expense table explicitly as separate field usually */}
                                                    {['09:00 AM', '12:30 PM', '03:00 PM', '07:00 PM'][expIndex % 4]}
                                                </span>
                                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-[#FFFBF6] dark:border-[#18181B] flex items-center justify-center shadow-sm ${getCategoryColor(expense.category)}`}>
                                                    {getCategoryIcon(expense.category)}
                                                </div>
                                            </div>

                                            {/* Content Card */}
                                            <div className="bg-white dark:bg-[#27272A] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
                                                <div className="flex flex-col md:flex-row gap-5">
                                                    <div className="flex-grow">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{expense.description || "Expense Detail"}</h4>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryColor(expense.category)} bg-opacity-20`}>
                                                                {expense.category}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                                            {expense.notes || "No additional notes provided."}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                                            <div className="flex items-center gap-2">
                                                                <Receipt size={16} className="text-gray-400" />
                                                                <span>Cost</span>
                                                            </div>
                                                            <div className="flex-grow border-b border-gray-300 dark:border-gray-600 border-dotted mx-2"></div>
                                                            <span className="font-bold text-gray-900 dark:text-white">
                                                                ${(expense.actual_cost || expense.estimated_cost || 0).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    )
}
