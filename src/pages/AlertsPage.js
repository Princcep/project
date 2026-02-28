import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const AlertsPage = () => {
  const [bridges, setBridges] = useState([]);
  const [selectedBridgeId, setSelectedBridgeId] = useState('');
  const [selectedBridgeName, setSelectedBridgeName] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [showResolved, setShowResolved] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddAlertForm, setShowAddAlertForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    severity: 'medium',
    message: '',
    type: 'System',
    value: 0,
  });

  const BRIDGES_STORAGE = 'bridge_admin_data';
  const ALERTS_STORAGE = 'bridge_alerts_data';

  useEffect(() => {
    loadBridges();
  }, []);

  useEffect(() => {
    if (selectedBridgeId) {
      loadAlerts();
    }
  }, [selectedBridgeId, showResolved]);

  const loadBridges = () => {
    try {
      const stored = localStorage.getItem(BRIDGES_STORAGE);
      const data = stored ? JSON.parse(stored) : [];
      setBridges(data);
      if (data.length > 0) {
        setSelectedBridgeId(data[0]._id);
        setSelectedBridgeName(data[0].name);
      }
    } catch (err) {
      console.error('Error loading bridges:', err);
    }
  };

  const loadAlerts = () => {
    try {
      const stored = localStorage.getItem(ALERTS_STORAGE);
      const allAlerts = stored ? JSON.parse(stored) : [];
      let filtered = allAlerts.filter(a => a.bridgeId === selectedBridgeId);
      if (!showResolved) {
        filtered = filtered.filter(a => !a.resolved);
      }
      setAlerts(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error('Error loading alerts:', err);
    }
  };

  const saveAlerts = (allAlerts) => {
    try {
      localStorage.setItem(ALERTS_STORAGE, JSON.stringify(allAlerts));
    } catch (err) {
      console.error('Error saving alerts:', err);
    }
  };

  const handleBridgeChange = (e) => {
    const bridgeId = e.target.value;
    const bridge = bridges.find(b => b._id === bridgeId);
    setSelectedBridgeId(bridgeId);
    if (bridge) {
      setSelectedBridgeName(bridge.name);
    }
  };

  const addAlert = () => {
    if (!newAlert.message.trim()) {
      setMessage('❌ Please enter an alert message');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const stored = localStorage.getItem(ALERTS_STORAGE);
      const allAlerts = stored ? JSON.parse(stored) : [];

      const alert = {
        _id: Date.now().toString(),
        bridgeId: selectedBridgeId,
        bridgeName: selectedBridgeName,
        severity: newAlert.severity,
        message: newAlert.message,
        type: newAlert.type,
        value: parseFloat(newAlert.value) || 0,
        riskScore: Math.random() * 100,
        createdAt: new Date().toISOString(),
        resolved: false,
      };

      allAlerts.push(alert);
      saveAlerts(allAlerts);
      loadAlerts();

      setNewAlert({ severity: 'medium', message: '', type: 'System', value: 0 });
      setShowAddAlertForm(false);
      setMessage('✅ Alert created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error adding alert:', err);
      setMessage('❌ Error creating alert');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteAlert = (alertId) => {
    try {
      const stored = localStorage.getItem(ALERTS_STORAGE);
      const allAlerts = stored ? JSON.parse(stored) : [];
      const filtered = allAlerts.filter(a => a._id !== alertId);
      saveAlerts(filtered);
      loadAlerts();
      setMessage('🗑️ Alert deleted');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Error deleting alert:', err);
    }
  };

  const toggleResolve = (alertId) => {
    try {
      const stored = localStorage.getItem(ALERTS_STORAGE);
      const allAlerts = stored ? JSON.parse(stored) : [];
      const alert = allAlerts.find(a => a._id === alertId);
      if (alert) {
        alert.resolved = !alert.resolved;
        alert.resolvedAt = alert.resolved ? new Date().toISOString() : null;
        saveAlerts(allAlerts);
        loadAlerts();
        setMessage(alert.resolved ? '✅ Alert marked resolved' : '📋 Alert marked unresolved');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      console.error('Error updating alert:', err);
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
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="card-glow border-2 border-cyan-500 border-opacity-60 rounded-xl p-8 mb-8 shadow-glow-lg">
          <h1 className="text-4xl font-bold text-cyan-400 flex items-center space-x-3">
            <span className="text-5xl">🚨</span>
            <span>Alerts & Notifications</span>
          </h1>
          <p className="text-slate-400 text-lg mt-3">Monitor and manage system alerts for your bridges</p>
        </div>

        {message && (
          <div className="bg-blue-600 bg-opacity-30 border-2 border-blue-500 text-blue-100 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card-elevated border-2 border-cyan-500 border-opacity-30 p-4">
            <label className="block text-sm font-bold text-cyan-400 mb-3">🌉 Select Bridge</label>
            {bridges.length > 0 ? (
              <select
                value={selectedBridgeId}
                onChange={handleBridgeChange}
                className="input-modern w-full"
              >
                {bridges.map((bridge) => (
                  <option key={bridge._id} value={bridge._id}>
                    {bridge.name} - {bridge.location}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-400 text-sm italic">No bridges added yet. Create one in Admin Panel.</p>
            )}
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-3 cursor-pointer bg-slate-800 bg-opacity-40 border-2 border-cyan-500 border-opacity-30 px-4 py-3 rounded-lg hover:border-opacity-100 transition-all w-full">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="w-5 h-5 rounded accent-cyan-500"
              />
              <span className="text-base font-semibold text-slate-300">Show Resolved</span>
            </label>
          </div>
        </div>

        {selectedBridgeId && alerts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="card-elevated border-2 border-cyan-500 border-opacity-40 p-6">
              <p className="text-slate-400 text-sm mb-2 font-semibold">📊 Total</p>
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

        {selectedBridgeId && (
          <button
            onClick={() => setShowAddAlertForm(!showAddAlertForm)}
            className="btn-primary mb-6"
          >
            {showAddAlertForm ? '✕ Cancel' : '➕ Add Test Alert'}
          </button>
        )}

        {showAddAlertForm && selectedBridgeId && (
          <div className="bg-slate-800 bg-opacity-50 border-2 border-cyan-500 border-opacity-30 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Create Alert</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                  className="input-modern w-full"
                >
                  <option value="low">🔵 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="critical">🔴 Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                  className="input-modern w-full"
                >
                  <option value="System">System</option>
                  <option value="Vibration">Vibration</option>
                  <option value="Stress">Stress</option>
                  <option value="Temperature">Temperature</option>
                  <option value="Crack">Crack Detection</option>
                </select>
              </div>
            </div>
            <textarea
              value={newAlert.message}
              onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
              placeholder="Alert message..."
              className="input-modern w-full mb-4"
              rows="3"
            />
            <input
              type="number"
              value={newAlert.value}
              onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
              placeholder="Sensor value"
              className="input-modern w-full mb-4"
            />
            <button onClick={addAlert} className="btn-primary w-full">
              ✓ Create
            </button>
          </div>
        )}

        {selectedBridgeId && (
          <div className="space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert._id} className={`card-glow border-2 ${getSeverityColor(alert.severity)} p-6`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-2xl">{getSeverityBadge(alert.severity)}</span>
                        <span className="text-xs px-2 py-1 bg-slate-700 rounded text-cyan-300">{alert.type}</span>
                        {alert.resolved && <span className="text-xs px-2 py-1 bg-green-600 rounded text-green-300">✓ Done</span>}
                      </div>
                      <p className="text-white font-bold mb-3">{alert.message}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div><p className="text-gray-400">Value</p><p className="text-white font-bold">{alert.value?.toFixed(2)}</p></div>
                        <div><p className="text-gray-400">Risk</p><p className="text-white font-bold">{alert.riskScore?.toFixed(2)}</p></div>
                        <div><p className="text-gray-400">Date</p><p className="text-white font-mono text-xs">{formatDate(alert.createdAt)}</p></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleResolve(alert._id)} className={`px-3 py-2 rounded text-sm ${alert.resolved ? 'bg-yellow-600 text-yellow-200' : 'bg-green-600 text-green-200'}`}>
                        {alert.resolved ? '📋' : '✓'}
                      </button>
                      <button onClick={() => deleteAlert(alert._id)} className="px-3 py-2 bg-red-600 text-red-200 rounded text-sm">🗑️</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">✓ No alerts</div>
            )}
          </div>
        )}

        {!selectedBridgeId && bridges.length > 0 && (
          <div className="text-center py-12 text-slate-400">Select a bridge to view alerts</div>
        )}
      </main>
    </div>
  );
};

export default AlertsPage;
