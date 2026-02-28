import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../utils/AuthContext';

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [bridges, setBridges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', location: '' });
  const [message, setMessage] = useState('');

  const STORAGE_KEY = 'bridge_admin_data';

  useEffect(() => {
    if (isAdmin) {
      loadBridges();
    }
  }, [isAdmin]);

  const loadBridges = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : [];
      setBridges(data);
    } catch (err) {
      console.error('Error loading bridges:', err);
      setBridges([]);
    }
  };

  const saveBridges = (bridgesData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bridgesData));
    } catch (err) {
      console.error('Error saving bridges:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.location) {
      setMessage('❌ Please provide both name and location');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setLoading(true);

      const newBridge = {
        _id: Date.now().toString(),
        name: form.name,
        location: form.location,
        createdAt: new Date().toISOString(),
      };

      const updatedBridges = [...bridges, newBridge];
      saveBridges(updatedBridges);
      setBridges(updatedBridges);

      setMessage('✅ Bridge added successfully!');
      setForm({ name: '', location: '' });

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error creating bridge:', err);
      setMessage('❌ Error adding bridge');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const deleteBridge = (id) => {
    const updatedBridges = bridges.filter(b => b._id !== id);
    saveBridges(updatedBridges);
    setBridges(updatedBridges);
    setMessage('🗑️ Bridge deleted');
    setTimeout(() => setMessage(''), 2000);
  };

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">Admin Panel</h1>

        {/* Bridge administration */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Bridges Management</h2>
          
          {message && (
            <div className="bg-blue-600 bg-opacity-30 border-2 border-blue-500 text-blue-100 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{message}</p>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4 mb-6 bg-slate-800 bg-opacity-50 p-6 rounded-lg border border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bridge Name</label>
                <input
                  className="input-modern"
                  name="name"
                  placeholder="e.g., Golden Gate Bridge"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  className="input-modern"
                  name="location"
                  placeholder="e.g., San Francisco, CA"
                  value={form.location}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <button
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? '⏳ Adding...' : '➕ Add Bridge'}
            </button>
          </form>

          <div className="space-y-3">
            {bridges.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No bridges added yet</p>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-cyan-400 mb-3">📍 {bridges.length} Bridge{bridges.length !== 1 ? 's' : ''}</h3>
                {bridges.map((b) => (
                  <div key={b._id} className="bg-slate-700 bg-opacity-40 p-4 rounded border border-slate-600 hover:border-cyan-500 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-semibold text-lg">{b.name}</p>
                        <p className="text-gray-400 text-sm">📍 {b.location}</p>
                        <p className="text-gray-500 text-xs mt-2">{new Date(b.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => deleteBridge(b._id)}
                        className="ml-4 bg-red-600 bg-opacity-50 hover:bg-opacity-70 text-red-200 px-3 py-2 rounded text-sm transition-all"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Users</h2>
          <p className="text-gray-300">User management coming soon...</p>
        </section>

      </main>
    </div>
  );
};

export default AdminPage;
