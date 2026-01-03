import { Link, useLocation } from 'react-router-dom'
import { Calendar, BarChart3, Users, LayoutDashboard, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './Layout.css'

export default function Layout({ children }) {
  const location = useLocation()
  const isActive = (path) => location.pathname.startsWith(path)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>🌍 GlobeTrotter</h1>
        </div>
        <ul className="sidebar-nav">
          <li>
            <Link to="/" className={isActive('/') && location.pathname === '/' ? 'active' : ''}>
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/calendar" className={isActive('/calendar') ? 'active' : ''}>
              <Calendar size={20} />
              Calendar
            </Link>
          </li>
          <li>
            <Link to="/budget" className={isActive('/budget') ? 'active' : ''}>
              <BarChart3 size={20} />
              Budget
            </Link>
          </li>
          <li>
            <Link to="/community" className={isActive('/community') ? 'active' : ''}>
              <Users size={20} />
              Community
            </Link>
          </li>
          <li>
            <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
              <BarChart3 size={20} />
              Analytics
            </Link>
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
