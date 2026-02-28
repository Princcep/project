import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { UserIcon, EnvelopeIcon, CogIcon, KeyIcon, LockClosedIcon, ArrowLeftIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'engineer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <img src="/logo.svg" alt="Smart Bridge" className="mb-3 inline-block transform hover:scale-110 transition-transform duration-300 h-12 w-auto" />
          <h1 className="text-4xl font-bold text-white mb-2">Smart Bridge</h1>
          <p className="text-slate-400 text-lg">Create Your Account</p>
        </div>

        {/* Register Card */}
        <div className="card-glow border-2 border-cyan-500 border-opacity-60 shadow-glow-lg p-8 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-8 text-center">
            Join Our Platform
          </h2>

          {error && (
            <div className="bg-red-500 bg-opacity-30 border-2 border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 animate-slide-down backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-fade-in">
              <label className="block text-sm font-bold text-cyan-400 mb-3">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-modern"
                placeholder="John Doe"
                required
              />
            </div>

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
              <label className="block text-sm font-bold text-cyan-400 mb-3">Select Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-modern"
              >
                <option value="engineer" className="bg-slate-800">Engineer (View Access)</option>
                <option value="admin" className="bg-slate-800">Admin (Full Access)</option>
              </select>
              <p className="text-xs text-slate-400 mt-2">Choose your role. You can change it later from settings.</p>
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
              <p className="text-xs text-slate-400 mt-2">Minimum 6 characters required</p>
            </div>

            <div className="animate-fade-in">
              <label className="block text-sm font-bold text-cyan-400 mb-3">✓ Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-300">
              Login Now
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
        <p className="text-center text-slate-500 text-xs mt-6">Built for Hackathon 2026</p>
      </div>
    </div>
  );
};

export default RegisterPage;
