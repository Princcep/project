import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../utils/AuthContext';
import { bridgesAPI } from '../utils/api';

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [bridges, setBridges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', location: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchBridges();
    }
  }, [isAdmin]);

  const fetchBridges = async () => {
    try {
      setLoading(true);
      const res = await bridgesAPI.getAll();
      setBridges(res.data.data || []);
    } catch (err) {
      console.error('Error fetching bridges:', err);
      setError('Failed to load bridges');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location) {
      setError('Please provide both name and location');
      return;
    }

    try {
      const res = await bridgesAPI.create(form);
      setMessage('Bridge created successfully');
      setForm({ name: '', location: '' });
      fetchBridges();
    } catch (err) {
      console.error('Error creating bridge:', err);
      setError('Failed to create bridge');
    }
  };

  if (!isAdmin) {
    // redirect non-admins away
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">Admin Panel</h1>

        {/* Bridge administration */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Bridges</h2>
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-300 px-4 py-2 rounded-lg mb-4">
              {message}
            </div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              className="input-modern"
              name="name"
              placeholder="Bridge name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="input-modern"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />
            <button
              className="btn-primary w-full md:col-span-2"
              type="submit"
            >
              Add Bridge
            </button>
          </form>
          {loading ? (
            <p className="text-gray-300">Loading bridges...</p>
          ) : (
            <ul className="space-y-2">
              {bridges.map((b) => (
                <li key={b._id} className="text-slate-300">
                  {b.name} — {b.location}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">User Management</h2>
          <p className="text-gray-300">(User management is not fully implemented in this demo. In production you would be able to view, edit and delete user accounts from here.)</p>
        </section>

      </main>
    </div>
  );
};

export default AdminPage;
