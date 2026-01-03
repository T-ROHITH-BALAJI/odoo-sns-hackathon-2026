import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Import pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import CreateTrip from '../pages/CreateTrip';
import MyTrips from '../pages/MyTrips';
import BuildItinerary from '../pages/BuildItinerary';
import ActivitySearch from '../pages/ActivitySearch';
import BudgetAnalytics from '../pages/BudgetAnalytics';
import CalendarView from '../pages/CalendarView';
import CommunityTrips from '../pages/CommunityTrips';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import Layout from '../components/Layout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* All routes with Layout - No auth required for demo */}
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/register" element={<Navigate to="/dashboard" replace />} />
              <Route path="/community" element={<CommunityTrips />} />
              <Route path="/my-trips" element={<MyTrips />} />
              <Route path="/create-trip" element={<CreateTrip />} />
              <Route path="/build-itinerary/:tripId" element={<BuildItinerary />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/budget/:tripId" element={<BudgetAnalytics />} />
              <Route path="/activities" element={<ActivitySearch />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
