import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { EnvelopeIcon, KeyIcon, BoltIcon, CogIcon, UserIcon, IdentificationIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login, MOCK_USERS } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await login(formData.email, formData.password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Quick login functions
  const quickLogin = async (email) => {
    const mockUser = MOCK_USERS[email];
    if (!mockUser) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await login(email, mockUser.password);
      setSuccess(`Logged in as ${mockUser.name}! Redirecting...`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <img src="/logo.svg" alt="Smart Bridge" className="mb-3 inline-block transform hover:scale-110 transition-transform duration-300 h-12 w-auto" />
          <h1 className="text-4xl font-bold text-white mb-2">Smart Bridge</h1>
          <p className="text-slate-400 text-lg">Digital Twin Platform</p>
        </div>

        {/* Main Card */}
        <div className="card-glow border-2 border-cyan-500 border-opacity-60 shadow-glow-lg p-8 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-8 text-center">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-500 bg-opacity-30 border-2 border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 animate-slide-down backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <ExclamationCircleIcon className="h-6 w-6 text-red-200" />
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-500 bg-opacity-30 border-2 border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 animate-slide-down backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-200" />
                <span className="font-semibold">{success}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-fade-in">
              <label className="block text-sm font-bold text-cyan-400 mb-3">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-modern"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="animate-fade-in">
              <label className="block text-sm font-bold text-cyan-400 mb-3">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-modern"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-8 font-bold text-lg py-3 transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {loading ? 'Logging in...' : 'Login Now'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-500 border-opacity-30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400 font-semibold">or quick login</span>
            </div>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => quickLogin('admin@example.com')}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-4 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-glow"
            >
              <span className="flex items-center gap-2"><BoltIcon className="h-5 w-5" />Admin</span>
              <span className="text-xs opacity-75 font-normal">admin@example.com</span>
            </button>

            <button
              onClick={() => quickLogin('engineer@example.com')}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-4 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-glow"
            >
              <span className="flex items-center gap-2"><CogIcon className="h-5 w-5" />Engineer</span>
              <span className="text-xs opacity-75 font-normal">engineer@example.com</span>
            </button>

            <button
              onClick={() => quickLogin('demo@example.com')}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-cyan-400 font-bold rounded-lg transition border-2 border-cyan-500 border-opacity-50 hover:border-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-4 transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2"><IdentificationIcon className="h-5 w-5" />Demo</span>
              <span className="text-xs opacity-75 font-normal">demo@example.com</span>
            </button>
          </div>

          {/* Test Credentials Info */}
          <div className="p-4 bg-cyan-500 bg-opacity-15 border-2 border-cyan-500 border-opacity-40 rounded-lg backdrop-blur-sm">
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-cyan-400">💡 Quick Start:</span>
              <br />
              <span className="text-slate-400">All passwords:</span>
              <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300 text-xs ml-1 font-mono">password123456</code>
              <br />
              <span className="text-slate-400 text-xs">Click any button above to login ⬆️</span>
            </p>
          </div>

          {/* Register Link */}
          <p className="text-center text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-300">
              Register Here
            </Link>
          </p>

          {/* Home Link */}
          <p className="text-center text-slate-500 mt-4">
            <Link to="/" className="text-slate-500 hover:text-slate-400 transition-colors duration-300 text-sm font-semibold">
              ← Back to Home
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-500 text-xs mt-6">🚀 Built for Hackathon 2026</p>
      </div>
    </div>
  );
};

export default LoginPage;
