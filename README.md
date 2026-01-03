# 🌍 GlobeTrotter - AI-Powered Travel Planning Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

> **Transforming Travel Planning with Intelligence** - Odoo x SNS Coimbatore Hackathon 2026

**GlobeTrotter** is a full-stack travel planning application that revolutionizes how people plan, organize, and experience multi-city trips. Built with modern technologies and powered by real-time data, it provides an intuitive interface for creating detailed itineraries, tracking budgets, and discovering new destinations.

## 🎥 Quick Demo

**Demo Credentials:**
- Auto-login enabled (no registration required)
- Demo User: **Keerthivasan** from Chennai, India
- Phone: **9488627508**

Simply run `START_DEMO.bat` and the app opens with full access!

## ✨ Core Features

### 🗺️ Multi-City Trip Planning
- **Smart Itinerary Builder**: Add cities and organize day-by-day stops
- **30+ Pre-loaded Cities**: Major destinations across 6 continents
- **Activity Management**: Schedule activities for each destination
- **Notes & Customization**: Add personal notes and preferences
- **Date Range Planning**: Automated day numbering and duration tracking

### 📅 Calendar & Timeline Visualization
- **Interactive Calendar**: Month-view with trip overlays
- **Trip Timeline**: See your journey chronologically
- **Upcoming Trips Widget**: Quick glance at next adventure
- **Month Navigation**: Browse through your travel schedule
- **Visual Indicators**: Color-coded trip status and dates

### 💰 Comprehensive Budget Tracking
- **Expense Management**: Track all trip-related costs
- **Category Breakdown**: Food, Transport, Accommodation, Activities, Shopping
- **Visual Analytics**: 
  - Real-time spending charts with Recharts
  - Pie charts for category distribution
  - Bar charts for popular destinations
  - Line graphs for trip creation trends
- **Total vs Spent**: Monitor budget vs actual expenses
- **Currency Support**: Multi-currency expense tracking

### 👥 Community Discovery
- **Public Trip Gallery**: Browse trips shared by other travelers
- **Trip Inspiration**: Discover new destinations and itineraries
- **Copy & Customize**: Clone trips and make them your own
- **Social Engagement**: Like and save favorite trips
- **Travel Stories**: Get inspired by community experiences

### 📊 Admin Analytics Dashboard
- **Platform Insights**: Track total users, trips, and activities
- **Growth Metrics**: Monitor trip creation trends over time
- **Popular Destinations**: See most visited cities
- **Activity Distribution**: Understand user behavior patterns
- **Engagement Analytics**: Average trips per user
- **Interactive Charts**: Beautiful visualizations with Recharts

### 🎨 User Experience
- **Dark/Light Mode**: Complete theme support with smooth transitions
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Intuitive Navigation**: Easy-to-use interface with clear CTAs
- **Beautiful UI**: Modern design with Tailwind CSS
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Smooth transitions and loading indicators

## 🏗️ Technology Stack

### Frontend
- **React 19** - Latest version with modern hooks and optimizations
- **Vite 7.3** - Lightning-fast build tool and dev server
- **React Router 7** - Client-side routing and navigation
- **Tailwind CSS 3.4** - Utility-first styling framework
- **Recharts** - Beautiful, responsive chart library
- **Lucide React** - Modern icon library (1000+ icons)
- **Date-fns** - Lightweight date manipulation
- **React Hot Toast** - Elegant notification system

### Backend & Database
- **Supabase** - Complete backend-as-a-service
- **PostgreSQL** - Powerful relational database
- **Row Level Security (RLS)** - Database-level authorization
- **Supabase Auth** - Secure authentication system
- **Real-time subscriptions** - Live data updates

### Development Tools
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS transformations
- **Autoprefixer** - Browser compatibility

## 🗄️ Database Architecture

### Schema Overview
```sql
users (auth.users extension)
  └── trips
       ├── trip_stops
       │    ├── cities (foreign key)
       │    └── activities
       └── expenses
       
cities (master data - 30 cities)
  ├── name, country
  ├── latitude, longitude
  ├── cost_index (1-100)
  └── popularity_score

activities
  ├── trip_stop_id
  ├── activity_type
  ├── start_time, end_time
  └── location

expenses
  ├── trip_id
  ├── amount, currency
  ├── category
  └── expense_date
```

### Key Features
- **6 Core Tables** with proper relationships
- **28 RLS Policies** for data security
- **7 Performance Indexes** on foreign keys
- **Automatic Timestamps** with triggers
- **Data Validation** with CHECK constraints
- **Cascading Deletes** for data integrity

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- **Node.js 20.19+ or 22.12+** and npm
- **Supabase account** (free tier works perfectly)
- **Windows/Mac/Linux** (scripts provided for all platforms)

### Option 1: Instant Demo (No Setup Required)

**For immediate demo/presentation:**

```powershell
# 1. Clone the repository
git clone https://github.com/T-ROHITH-BALAJI/odoo-sns-hackathon-2026.git
cd odoo-sns-hackathon-2026

# 2. Install dependencies
cd frontend/frontend
npm install --legacy-peer-deps

# 3. Run the demo (auto-login enabled)
cd ../..
START_DEMO.bat
```

The app will open at `http://localhost:5173` with demo user already logged in!

**Demo User:** Keerthivasan | Chennai, India | 9488627508

### Option 2: Full Setup (With Database)

**For complete functionality with your own data:**

#### Step 1: Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in Supabase Dashboard
3. Copy and paste the entire content from `sql/00_complete_setup.sql`
4. Click **Run** to execute
5. Verify: Check that 6 tables and 30 cities were created

#### Step 2: Configure Environment

```powershell
# Navigate to frontend directory
cd frontend/frontend

# Create .env file
echo VITE_SUPABASE_URL=your_supabase_url > .env
echo VITE_SUPABASE_ANON_KEY=your_supabase_anon_key >> .env
```frontend/frontend/           # Main application directory
│   ├── src/
│   │   ├── app/
│   │   │   └── App.jsx         # Root component with routing
│   │   ├── components/
│   │   │   ├── Layout.jsx      # App shell with navbar & footer
│   │   │   ├── Navbar.jsx      # Top navigation
│   │   │   └── Footer.jsx      # Site footer
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Dashboard.jsx   # Main dashboard (auto-redirected)
│   │   │   ├── CreateTrip.jsx  # Trip creation form
│   │   │   ├── MyTrips.jsx     # User's trip list
│   │   │   ├── BuildItinerary.jsx # Multi-city itinerary builder
│   │   │   ├── CalendarView.jsx   # Calendar visualization
│   │   │   ├── BudgetAnalytics.jsx # Expense tracking & charts
│   │   │   ├── ActivitySearch.jsx  # Activity discovery
│   │   │   ├── CommunityTrips.jsx  # Public trip gallery
│   │   │   ├── AdminDashboard.jsx  # Platform analytics
│   │   │   ├── Profile.jsx         # User profile
│   │   │   ├── Login.jsx          # Authentication (bypassed in demo)
│   │   │   └── Register.jsx       # Sign up (bypassed in demo)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state (demo mode enabled)
│   │   │   └── ThemeContext.jsx   # Dark/light mode toggle
│   │   ├── lib/
│   │   │   └── supabaseClient.js  # Supabase configuration
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Tailwind & global styles
│   ├── .env                       # Environment variables
│   ├── package.json               # Dependencies
│   ├── tailwind.config.js         # Tailwind configuration
│   └── vite.config.js             # Vite build config
│
├── sql/                           # Database setup files
│   ├── 00_complete_setup.sql     # ⭐ Complete DB setup script
│   ├── 01_phase1_schema.sql      # Table definitions
│   ├── 02_phase2_rls_policies.sql # Security policies
│   ├── 03_phase3_realtime.sql    # Realtime features
│   └── 04_seed_data.sql          # 30 cities seed data
│
├── Misc/                          # Project documentation
│   ├── instruction.md            # Project requirements
│   ├── prompt.md                 # Technical analysis
│   └── tasks.md                  # Team task breakdown
│
├── START_DEMO.bat                 # ⭐ Windows quick start script
├── QUICKSTART.md                  # 5-minute setup guide
├── README_SETUP.md                # Detailed setup instructions
├── DEMO_VIDEO_GUIDE.md            # Video recording guide
├── DEPLOYMENT_CHECKLIST.md        # Production deployment
├── FINAL_VERIFICATION.md          # Schema verification report
└── PROJECT_COMPLETE.md            # Feature completion status
```

### Key Files

- **`sql/00_complete_setup.sql`** - Run this first in Supabase
- **`START_DEMO.bat`** - Quick demo launcher (Windows)
- **`frontend/frontend/.env`** - Your Supabase credentials
- **`DEMO_VIDEO_GUIDE.md`** - Complete demo scriptpowershell
# Just run this from project root:
START_DEMO.bat
```

This sFeature Highlights

### 🎨 Visualization & Analytics
- **Calendar View**: Interactive month-view calendar with trip overlays
- **Timeline Mode**: Chronological journey visualization
- **Budget Charts**: Real-time expense tracking with Recharts
  - Pie charts for category breakdown
  - Bar charts for trip comparisons
  - Line graphs for trends
  - Area charts for cumulative spending
- **Admin Dashboard**: Platform-wide analytics
  - User adoption metrics
  - Trip creation trends
  - Popular destinations heat map
  - Activity distribution analysis

### 💾 Data Management
- **Intelligent Caching**: Optimized data fetching
- **Real-time Updates**: Live data synchronization
- **Bulk Operations**: Efficient batch processing
- **Data Export**: Trip data export capabilities (planned)

### 🔐 Security Features
- **Row Level Security**: Users can only access their own data
- **Auth Policies**: 28 RLS policies across all tables
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: React's built-in escaping
- **Environment Security**: Sensitive data in environment variables

### 📱 User Experience
- **Responsive Design**: Mobile-first approach
  - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Dark Mode**: Complete theme support with persistence
- **Loading States**: Smooth loading animations
- **Error Handling**: Graceful error messages with recovery options
- **Toast Notifications**: Real-time user feedback
- **Empty States**: Helpful guidance when no data exists

### ⚡ Performance
- **Fast Build Times**: Vite's HMR (Hot Module Replacement)
- **Code Splitting**: Lazy-loaded routes
- **Optimized Images**: Efficient image loading
- **Database Indexes**: Fast query execution
- **Minimal Re-renders**: Optimized React hooks

## 🔑 Technical Achievements

### Database Design
- ✅ Normalized schema (3NF) with proper foreign keys
- ✅ CHECK constraints for data validation
- ✅ Automatic timestamp updates with triggers
- ✅ Cascading deletes for data integrity
- ✅ Optimized indexes on all foreign keys

### Frontend Architecture
- ✅ Component-based design with React 19
- ✅ Context API for state management
- ✅ Custom hooks for reusable logic
- ✅ Proper error b

### Available Scripts

```powershell
# Development
cd frontend/frontend
npm run dev              # Start dev server at localhost:5173
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Quick start (from project root)
START_DEMO.bat           # Windows: Auto-start with demo mode
```

### Project Configuration

**Vite Configuration** (`vite.config.js`)
```javascript
- React Fast Refresh enabled
- Automatic JSX transformation
- Port: 5173 (default)
```

**Tailwind Configuration** (`tailwind.config.js`)
```javascript
- Custom color schemes
- Dark mode: 'class' strategy
- Custom fonts: Inter (sans), Playfair Display (serif)
```

### Environment Variables

```env
# Required
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for backward compatibility)
NEXT_PUBLIC_SUPABASE_URL=same_as_above
NEXT_PUBLIC_SUPABASE_ANON_KEY=same_as_above
```

## 🚀 Deployment

### Option 1: Vercel (Recommended)

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Deploy to production
vercel --prod
```

### Option 2: Netlify

```powershell
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy
� Project Statistics

- **13 Pages** - Fully functional UI pages
- **7 Components** - Reusable React components
- **6 Database Tables** - Properly normalized schema
- **28 RLS Policies** - Comprehensive security
- **30 Cities** - Pre-loaded destination data
- **7 Indexes** - Optimized query performance
- **5000+ Lines** - Production-ready code
- **0 Vulnerabilities** - Secure dependencies

## 🎬 Demo & Presentation

### For Judges/Reviewers

1. **Clone the repo**
2. **Run `START_DEMO.bat`** - Instant demo with auto-login
3. **Explore features** - All pages accessible immediately
4. **Review code** - Clean, documented, production-ready

### Demo Highlights

- ✅ **No Setup Required** - Demo mode auto-login
- ✅ **Full Feature Access** - All 13 pages functional
- ✅ **Real Database** - Supabase PostgreSQL backend
- ✅ **Beautiful UI** - Modern, responsive design
- ✅ **Live Charts** - Real-time data visualization

## 📧 Contact

**GitHub:** [T-ROHITH-BALAJI](https://github.com/T-ROHITH-BALAJI)  
**Repository:** [odoo-sns-hackathon-2026](https://github.com/T-ROHITH-BALAJI/odoo-sns-hackathon-2026)

## 📝 License

This project is submitted for the Odoo x SNS Coimbatore Hackathon 2026.

## 🙏 Acknowledgments

- **Odoo** - For organizing the hackathon
- **SNS Coimbatore** - For hosting and support
- **Supabase** - Amazing backend platform
- **React Team** - Excellent framework and ecosystem
- **Vercel** - For Vite and deployment solutions
- **Tailwind Labs** - Beautiful styling framework

---

## 🌟 Quick Links

- 📖 **[Documentation](QUICKSTART.md)** - Complete setup guide
- 🎥 **[Demo Guide](DEMO_VIDEO_GUIDE.md)** - Video recording script
- 🚀 **[Deployment](DEPLOYMENT_CHECKLIST.md)** - Production deployment
- ✅ **[Features](PROJECT_COMPLETE.md)** - Complete feature list
- 🔍 **[Verification](FINAL_VERIFICATION.md)** - Schema verification

---

<div align="center">

### ✨ Built with ❤️ for travelers, by travelers ✨

**GlobeTrotter** - Your Journey, Perfectly Planned

*Odoo x SNS Coimbatore Hackathon 2026*

[![GitHub](https://img.shields.io/badge/GitHub-View_Repository-181717?logo=github)](https://github.com/T-ROHITH-BALAJI/odoo-sns-hackathon-2026)
[![Live Demo](https://img.shields.io/badge/Demo-Try_Now-FF7E5F)](http://localhost:5173)

</div>
## 📝 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[README_SETUP.md](README_SETUP.md)** - Detailed installation
- **[DEMO_VIDEO_GUIDE.md](DEMO_VIDEO_GUIDE.md)** - Video recording script
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment
- **[FINAL_VERIFICATION.md](FINAL_VERIFICATION.md)** - Schema verification
- **[PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)** - Feature checklist

## 🤝 Contributing

This project was built for the Odoo x SNS Coimbatore Hackathon 2026.

### Team

**Project Name:** GlobeTrotter  
**Institution:** SNS Coimbatore  
**Hackathon:** Odoo x SNS 2026  
**Repository:** [GitHub](https://github.com/T-ROHITH-BALAJI/odoo-sns-hackathon-2026)

### Commit Convention

```
feat(feature): add new feature
fix(component): fix bug
docs(readme): update documentation
style(ui): improve styling
refactor(code): refactor code
test(unit): add tests
chore(deps): update dependencieslor scheme for better UX
- **No Data States**: Graceful handling of empty datasets

### Performance Optimizations
- **Lazy Loading**: Components load on demand
- **Efficient Re-renders**: Proper use of React hooks
- **Database Indexing**: Optimized queries with proper indexes
- **Row Level Security**: Security without performance penalty

## 🎨 Design Principles

- **Clarity over Complexity**: Simple, intuitive interfaces
- **Data-Driven Insights**: Every chart tells a story
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: Proper semantic HTML and ARIA labels
- **Professional Polish**: Production-ready UI/UX

## 🔒 Security

- **Supabase Auth**: Secure authentication out of the box
- **Row Level Security (RLS)**: Database-level access control
- **Environment Variables**: Sensitive data never committed
- **API Key Protection**: Server-side only for sensitive operations

## 📊 Demo Flow

1. **Login/Register** → Create account or sign in
2. **Dashboard** → View trip overview
3. **Create Trip** → Add a new travel plan
4. **Calendar View** → Visualize itinerary in calendar/timeline
5. **Budget Analytics** → Review spending insights and drift
6. **Community** → Explore and copy public trips
7. **Admin** → View platform-wide analytics (demo purposes)

## 🛠️ Development Commands

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Commit Convention
```
feat(calendar): implement calendar itinerary view
feat(budget): add live budget drift calculation
feat(community): add public community trips view
feat(analytics): implement analytics dashboard
chore(demo): prepare demo flow and polish
```

## 📝 License

This project was created for the Odoo x SNS Coimbatore Hackathon 2026.

## 🙏 Acknowledgments

- **Odoo** for hosting the hackathon
- **SNS Coimbatore** for the opportunity
- **Supabase** for the amazing backend platform
- **React Team** for the excellent framework

---

**Built with ❤️ for travelers, by travelers**

For questions or demo requests, please refer to the presentation materials.


Database URL: https://jzjvurejhsbbwqmsided.supabase.co


