import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import {
  ChartBarIcon,
  StarIcon,
  ClockIcon,
  BellIcon,
  UserCircleIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show full navbar on landing page
  const isLandingPage = location.pathname === '/';

  if (isLandingPage && !isAuthenticated) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-500 border-opacity-30 shadow-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group">
            <img src="/logo.svg" alt="Smart Bridge" className="h-8 w-auto group-hover:scale-110 transition-transform duration-300" />
            <h1 className="text-2xl font-bold hidden sm:block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Smart Bridge</h1>
          </Link>

          {/* Center - Status */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-300">
              Real-time Structural Monitoring
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-glow"></div>
              <span className="text-xs text-green-400 font-semibold">Live</span>
            </div>
          </div>

          {/* Right - Navigation & User */}
          <div className="flex items-center space-x-6">
            {isAuthenticated && (
              <>
                {/* Navigation Links */}
                <div className="hidden lg:flex space-x-2">
                  {[
                    { path: '/dashboard', label: 'Dashboard', icon: <ChartBarIcon className="h-5 w-5" /> },
                    { path: '/features', label: 'Features', icon: <StarIcon className="h-5 w-5" /> },
                    { path: '/history', label: 'History', icon: <ClockIcon className="h-5 w-5" /> },
                    { path: '/alerts', label: 'Alerts', icon: <BellIcon className="h-5 w-5" /> },
                    // Show admin panel link only for admins
                    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: <CogIcon className="h-5 w-5" /> }] : []),
                    { path: '/profile', label: 'Profile', icon: <UserCircleIcon className="h-5 w-5" /> },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow'
                          : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-700 hover:bg-opacity-50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-cyan-500 border-opacity-30 hover:border-opacity-100 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-glow"
                  >
                    <span className="text-lg">👤</span>
                    <span className="text-sm font-semibold text-cyan-400 hidden sm:block">{user?.name}</span>
                    <span className={`text-xs text-cyan-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-72 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 rounded-xl shadow-glow backdrop-blur-md border border-cyan-500 border-opacity-30 py-3 z-50 animate-slide-down">
                      <div className="px-4 py-4 border-b border-cyan-500 border-opacity-20">
                        <p className="text-sm font-bold text-cyan-400">{user?.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
                        <div className="mt-3 flex gap-2">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                            user?.role === 'admin' 
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                              : user?.role === 'engineer'
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                              : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                          }`}>
                            <span>{user?.role === 'admin' ? '⚡' : user?.role === 'engineer' ? '⚙️' : '🔐'}</span>
                            <span>{user?.role === 'admin' ? 'Admin' : user?.role === 'engineer' ? 'Engineer' : 'User'}</span>
                          </span>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-3 text-sm text-slate-300 hover:bg-cyan-500 hover:bg-opacity-20 hover:text-cyan-400 transition-all duration-300 space-x-2 flex items-center"
                      >
                        <span>👤</span>
                        <span>View Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-red-500 hover:bg-opacity-20 hover:text-red-400 transition-all duration-300 space-x-2 flex items-center"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
