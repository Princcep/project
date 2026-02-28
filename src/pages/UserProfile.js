import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../utils/AuthContext';

const UserProfile = () => {
  const { user, isAdmin, isEngineer, logout } = useAuth();

  const getRoleInfo = () => {
    if (isAdmin) {
      return {
        name: 'Administrator',
        icon: '👤',
        color: 'from-purple-600 to-purple-800',
        badge: 'bg-purple-600',
        description: 'Full system access, user management, configuration',
        permissions: [
          '✓ View all dashboards',
          '✓ Manage users',
          '✓ Configure system settings',
          '✓ View all alerts',
          '✓ Generate reports',
          '✓ System administration',
        ],
      };
    } else if (isEngineer) {
      return {
        name: 'Engineer',
        icon: '⚙️',
        color: 'from-green-600 to-green-800',
        badge: 'bg-green-600',
        description: 'Monitor bridges, analyze data, manage alerts',
        permissions: [
          '✓ View monitoring dashboard',
          '✓ Analyze sensor data',
          '✓ Receive alerts',
          '✓ View history',
          '✓ Export data',
          '✓ Access technical support',
        ],
      };
    } else {
      return {
        name: 'User',
        icon: '👁️',
        color: 'from-blue-600 to-blue-800',
        badge: 'bg-blue-600',
        description: 'Limited access',
        permissions: [
          '✓ View dashboard',
          '✓ View alerts',
        ],
      };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">User Profile</h1>
          <p className="text-blue-300">Your account information and permissions</p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-8 mb-8 shadow-2xl">
          {/* User Info */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-blue-500 border-opacity-20">
            <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${roleInfo.color} flex items-center justify-center text-4xl shadow-lg`}>
              {roleInfo.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">{user?.name}</h2>
              <p className="text-blue-300 mb-2">{user?.email}</p>
              <span className={`inline-block px-4 py-1.5 text-sm font-bold text-white rounded-full ${roleInfo.badge}`}>
                {roleInfo.name}
              </span>
            </div>
          </div>

          {/* Role Description */}
          <div className="mb-8 pb-8 border-b border-blue-500 border-opacity-20">
            <h3 className="text-lg font-bold text-white mb-2">Role Overview</h3>
            <p className="text-gray-300">{roleInfo.description}</p>
          </div>

          {/* Permissions */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Your Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roleInfo.permissions.map((permission, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-500 bg-opacity-10 rounded-lg border border-blue-500 border-opacity-20">
                  <span className="text-green-400 font-bold">{permission.substring(0, 1)}</span>
                  <span className="text-gray-300">{permission.substring(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-blue-500 bg-opacity-10 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-bold text-white mb-3">Account Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">User ID:</span>
                <span className="text-blue-300">{user?.id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-blue-300">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Role:</span>
                <span className={`font-bold ${roleInfo.badge.replace('bg-', 'text-').split('-')[0]}-400`}>
                  {user?.role || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Testing Information */}
        <div className="bg-yellow-500 bg-opacity-10 backdrop-blur-sm border border-yellow-500 border-opacity-30 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-yellow-300 mb-3">🧪 Testing Information</h3>
          <p className="text-gray-300 mb-3">This is a test account. You can:</p>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>✓ Explore all features available for your role</li>
            <li>✓ Test the complete monitoring system</li>
            <li>✓ View 3D bridge models and data visualizations</li>
            <li>✓ Switch accounts using the quick login buttons on the login page</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition text-center"
          >
            📊 Go to Dashboard
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition text-center"
            >
              🛠️ Admin Panel
            </Link>
          )}
          <Link
            to="/alerts"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition text-center"
          >
            🔔 View Alerts
          </Link>
          <Link
            to="/history"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition text-center"
          >
            📈 View History
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
