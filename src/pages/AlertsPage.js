import React, { useState, useEffect } from 'react';
import { alertsAPI, bridgesAPI } from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import Navbar from '../components/Navbar';

const AlertsPage = () => {
  const [bridges, setBridges] = useState([]);
  const [selectedBridgeId, setSelectedBridgeId] = useState('');
  const [showResolved, setShowResolved] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Fetch bridges on mount
  useEffect(() => {
    fetchBridges();
  }, []);

  // Fetch alerts when bridge or showResolved changes
  useEffect(() => {
    if (selectedBridgeId) {
      fetchAlerts();
    }
  }, [selectedBridgeId, showResolved]);

  const fetchBridges = async () => {
    try {
      const response = await bridgesAPI.getAll();
      setBridges(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedBridgeId(response.data.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching bridges:', err);
      setError('Failed to load bridges');
    }
  };

  const fetchAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await alertsAPI.getAlerts(selectedBridgeId, showResolved);
      setAlerts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 bg-opacity-20 border-red-500';
      case 'high':
        return 'bg-orange-500 bg-opacity-20 border-orange-500';
      case 'medium':
        return 'bg-yellow-500 bg-opacity-20 border-yellow-500';
      default:
        return 'bg-blue-500 bg-opacity-20 border-blue-500';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return '🔴 Critical';
      case 'high':
        return '🟠 High';
      case 'medium':
        return '🟡 Medium';
      default:
        return '🔵 Low';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="card-glow border-2 border-cyan-500 border-opacity-60 rounded-xl p-8 mb-8 shadow-glow-lg">
          <h1 className="text-4xl font-bold text-cyan-400 flex items-center space-x-3">
            <span className="text-5xl">🚨</span>
            <span>System Alerts & Notifications</span>
          </h1>
          <p className="text-slate-400 text-lg mt-3">Monitor and manage critical system alerts in real-time</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-elevated border-2 border-cyan-500 border-opacity-30 p-4">
            <label className="block text-sm font-bold text-cyan-400 mb-3">
              <img src="/logo.svg" alt="Bridge" className="inline h-4 w-auto mr-1" />
              Select Bridge
            </label>
            <select
              value={selectedBridgeId}
              onChange={(e) => setSelectedBridgeId(e.target.value)}
              className="input-modern"
            >
              <option value="">-- Select a bridge --</option>
              {bridges.map((bridge) => (
                <option key={bridge._id} value={bridge._id} className="bg-slate-800">
                  {bridge.name} - {bridge.location}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-3 cursor-pointer bg-slate-800 bg-opacity-40 border-2 border-cyan-500 border-opacity-30 px-4 py-3 rounded-lg hover:border-opacity-100 transition-all duration-300">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="w-5 h-5 rounded accent-cyan-500"
              />
              <span className="text-base font-semibold text-slate-300">Show Resolved Alerts</span>
            </label>
          </div>

          <div className="flex items-end justify-end">
            <button
              onClick={fetchAlerts}
              disabled={loading}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        {selectedBridgeId && alerts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card-elevated border-2 border-cyan-500 border-opacity-40 p-6">
              <p className="text-slate-400 text-sm mb-2 font-semibold">📊 Total Alerts</p>
              <p className="text-4xl font-bold text-cyan-400">{alerts.length}</p>
            </div>
            <div className="card-elevated border-2 border-red-500 border-opacity-40 p-6">
              <p className="text-slate-400 text-sm mb-2 font-semibold">🔴 Critical</p>
              <p className="text-4xl font-bold text-red-400">
                {alerts.filter((a) => a.severity === 'critical').length}
              </p>
            </div>
            <div className="card-elevated border-2 border-orange-500 border-opacity-40 p-6">
              <p className="text-slate-400 text-sm mb-2 font-semibold">🟠 High</p>
              <p className="text-4xl font-bold text-orange-400">
                {alerts.filter((a) => a.severity === 'high').length}
              </p>
            </div>
            <div className="card-elevated border-2 border-yellow-500 border-opacity-40 p-6">
              <p className="text-slate-400 text-sm mb-2 font-semibold">🟡 Unresolved</p>
              <p className="text-4xl font-bold text-yellow-400">
                {alerts.filter((a) => !a.resolved).length}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-30 border-2 border-red-500 text-red-200 px-6 py-4 rounded-lg mb-6 animate-slide-down backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mx-auto mb-4 shadow-glow"></div>
              <p className="text-slate-400 text-lg font-semibold">Loading alerts...</p>
            </div>
          </div>
        )}

        {/* Alerts List */}
        {!loading && selectedBridgeId && (
          <div className="space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert._id}
                  className={`card-glow border-2 ${getSeverityColor(alert.severity)} p-6 backdrop-blur-md hover-lift transition-all duration-300`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3 flex-wrap gap-2">
                        <span className="text-2xl font-bold">{getSeverityBadge(alert.severity)}</span>
                        <span className="text-xs px-3 py-1 bg-slate-700 bg-opacity-50 rounded-full font-semibold text-cyan-300 border border-cyan-500 border-opacity-30">
                          {alert.type}
                        </span>
                        {alert.resolved && (
                          <span className="text-xs px-3 py-1 bg-green-500 bg-opacity-30 rounded-full text-green-400 border border-green-500 border-opacity-40 font-bold">
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-slate-100 font-bold text-lg mb-3">{alert.message}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-slate-800 bg-opacity-40 p-3 rounded-lg border border-slate-600 border-opacity-40">
                          <p className="text-slate-400 text-xs mb-1 font-semibold">Value</p>
                          <p className="text-white font-bold text-lg">{alert.value?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <div className="bg-slate-800 bg-opacity-40 p-3 rounded-lg border border-slate-600 border-opacity-40">
                          <p className="text-slate-400 text-xs mb-1 font-semibold">Risk Score</p>
                          <p className="text-white font-bold text-lg">{alert.riskScore?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <div className="bg-slate-800 bg-opacity-40 p-3 rounded-lg border border-slate-600 border-opacity-40">
                          <p className="text-slate-400 text-xs mb-1 font-semibold">Created</p>
                          <p className="text-white font-mono text-xs">{formatDate(alert.createdAt)}</p>
                        </div>
                        {alert.resolved && alert.resolvedAt && (
                          <div className="bg-slate-800 bg-opacity-40 p-3 rounded-lg border border-slate-600 border-opacity-40">
                            <p className="text-slate-400 text-xs mb-1 font-semibold">Resolved</p>
                            <p className="text-white font-mono text-xs">{formatDate(alert.resolvedAt)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card-glow border-2 border-green-500 border-opacity-40 text-center py-12 backdrop-blur-md">
                <p className="text-slate-300 text-xl font-semibold">✓ No Alerts Found</p>
                <p className="text-slate-400 text-base mt-2">All bridge systems operating normally</p>
              </div>
            )}
          </div>
        )}

        {!selectedBridgeId && (
          <div className="card-glow border-2 border-cyan-500 border-opacity-40 text-center py-12 backdrop-blur-md">
            <p className="text-slate-300 text-xl font-semibold">
              <img src="/logo.svg" alt="Bridge" className="inline h-4 w-auto mr-1" />
              Select a Bridge
            </p>
            <p className="text-slate-400 text-base mt-2">Choose a bridge from the dropdown to view alerts</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AlertsPage;
