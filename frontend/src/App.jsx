import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { supabase } from './lib/supabaseClient';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected pages (require auth)
// Protected pages (require auth)
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import BuildItinerary from './pages/BuildItinerary';
import MyTrips from './pages/MyTrips';
import ActivitySearch from './pages/ActivitySearch';
import CalendarView from './pages/CalendarView';
import BudgetAnalytics from './pages/BudgetAnalytics';
import CommunityTrips from './pages/CommunityTrips';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

import './index.css';

// Protected Route wrapper component
function ProtectedRoute({ children, session }) {
    if (!session) {
        return <Navigate to="/login" replace />;
    }
    return <Layout>{children}</Layout>;
}

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontFamily: 'Inter, system-ui, sans-serif'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Dashboard routes - accessible without login for now */}
                    <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                    <Route path="/create-trip" element={<Layout><CreateTrip /></Layout>} />
                    <Route path="/build-itinerary/:tripId" element={<Layout><BuildItinerary /></Layout>} />
                    <Route path="/my-trips" element={<Layout><MyTrips /></Layout>} />
                    <Route path="/activities" element={<Layout><ActivitySearch /></Layout>} />
                    <Route path="/calendar/:tripId" element={<Layout><CalendarView /></Layout>} />
                    <Route path="/budget/:tripId" element={<Layout><BudgetAnalytics /></Layout>} />
                    <Route path="/community" element={<Layout><CommunityTrips /></Layout>} />
                    <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
                    <Route path="/profile" element={<Layout><Profile /></Layout>} />

                    {/* Fallback - redirect unknown routes to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
