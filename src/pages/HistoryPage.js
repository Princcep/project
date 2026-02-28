import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sensorDataAPI, bridgesAPI, alertsAPI } from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import Navbar from '../components/Navbar';
import BridgeModel from '../components/BridgeModel';

const HistoryPage = () => {
  const [bridges, setBridges] = useState([]);
  const [selectedBridgeId, setSelectedBridgeId] = useState('');
  const [hours, setHours] = useState(24);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latestData, setLatestData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [simRunning, setSimRunning] = useState(false);
  const [onlyShowGreen, setOnlyShowGreen] = useState(false);
  const simRef = React.useRef(null);
  const { user } = useAuth();

  // Fetch bridges on mount
  useEffect(() => {
    fetchBridges();
  }, []);

  // Fetch historical data when bridge or hours changes
  useEffect(() => {
    if (selectedBridgeId) {
      fetchHistoricalData();
      fetchLatestData();
      fetchAlerts();
    }
    // stop simulation when switching bridge
    return () => stopSimulation();
  }, [selectedBridgeId, hours]);

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

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await sensorDataAPI.getHistory(selectedBridgeId, hours);
      const data = response.data.data || [];
      
      // Format data for chart
      const formattedData = data.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp).toLocaleTimeString(),
        vibration: parseFloat(item.vibration.toFixed(2)),
        load: parseFloat(item.load.toFixed(2)),
        crack: parseFloat(item.crack.toFixed(2)),
        temperature: parseFloat(item.temperature.toFixed(2)),
        riskScore: parseFloat(item.riskScore.toFixed(2)),
      }));
      
      setHistoryData(formattedData);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Failed to load historical data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestData = async () => {
    try {
      if (!selectedBridgeId) return;
      const res = await sensorDataAPI.getLatest(selectedBridgeId);
      setLatestData(res.data.data || null);
    } catch (err) {
      console.error('Error fetching latest data:', err);
    }
  };

  const fetchAlerts = async () => {
    try {
      if (!selectedBridgeId) return;
      const res = await alertsAPI.getAlerts(selectedBridgeId);
      setAlerts(res.data.data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  const startSimulation = (intervalMs = 2500) => {
    if (!selectedBridgeId || simRef.current) return;
    setSimRunning(true);
    simRef.current = setInterval(async () => {
      try {
        // generate realistic random values around last known values
        const base = latestData || { vibration: 10, load: 20, crack: 2, temperature: 22, riskScore: 5 };
        const rand = (v, pct=0.15) => Math.max(0, v + (Math.random() - 0.5) * v * pct);
        const payload = {
          bridgeId: selectedBridgeId,
          vibration: parseFloat(rand(base.vibration || 10).toFixed(2)),
          load: parseFloat(rand(base.load || 20).toFixed(2)),
          crack: parseFloat(rand(base.crack || 2).toFixed(2)),
          temperature: parseFloat(rand(base.temperature || 22).toFixed(2)),
          riskScore: parseFloat(Math.min(100, rand(base.riskScore || 5, 0.4)).toFixed(2)),
        };
        await sensorDataAPI.addData(payload);
        // refresh lists
        await fetchHistoricalData();
        await fetchLatestData();
        await fetchAlerts();
      } catch (e) {
        console.error('Simulation error', e);
      }
    }, intervalMs);
  };

  const stopSimulation = () => {
    if (simRef.current) {
      clearInterval(simRef.current);
      simRef.current = null;
    }
    setSimRunning(false);
  };

  const triggerAlert = async () => {
    if (!selectedBridgeId) return;
    const payload = {
      bridgeId: selectedBridgeId,
      vibration: 200,
      load: 200,
      crack: 50,
      temperature: 120,
      riskScore: 95,
    };
    try {
      await sensorDataAPI.addData(payload);
      await fetchHistoricalData();
      await fetchLatestData();
      await fetchAlerts();
    } catch (e) {
      console.error('Error triggering alert', e);
    }
  };

  const downloadCSV = () => {
    if (historyData.length === 0) {
      alert('No data to download');
      return;
    }

    const selectedBridge = bridges.find((b) => b._id === selectedBridgeId);
    const headers = ['Timestamp', 'Vibration', 'Load', 'Crack', 'Temperature', 'Risk Score'];
    
    const csvContent = [
      `Bridge: ${selectedBridge?.name}`,
      `Location: ${selectedBridge?.location}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Time Range: Last ${hours} hours`,
      '',
      headers.join(','),
      ...historyData.map((row) =>
        [
          row.timestamp,
          row.vibration,
          row.load,
          row.crack,
          row.temperature,
          row.riskScore,
        ].join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bridge-data-${selectedBridge?.name}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="card-glow border-2 border-cyan-500 border-opacity-60 rounded-xl p-8 mb-8 shadow-glow-lg">
          <h1 className="text-4xl font-bold text-cyan-400 flex items-center space-x-3">
            <span className="text-5xl">📈</span>
            <span>Historical Data & Analytics</span>
          </h1>
          <p className="text-slate-400 text-lg mt-3">View sensor data trends and patterns over time</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2" />
          <div className="card-elevated border-2 border-cyan-500 border-opacity-30 p-4">
            <h3 className="text-sm font-bold text-cyan-400 mb-3">3D Model & Simulation</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Show only green sensors</label>
                <input type="checkbox" checked={onlyShowGreen} onChange={(e) => setOnlyShowGreen(e.target.checked)} />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => startSimulation()}
                  disabled={simRunning || !selectedBridgeId}
                  className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
                >Start Test Simulation</button>
                <button
                  onClick={() => stopSimulation()}
                  disabled={!simRunning}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50"
                >Stop</button>
              </div>

              <button
                onClick={() => triggerAlert()}
                className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >Trigger Alert (create test alert)</button>

              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-2">Recent Alerts</p>
                <div className="space-y-2 max-h-40 overflow-auto">
                  {alerts.length === 0 && <p className="text-xs text-gray-500">No alerts</p>}
                  {alerts.map((a) => (
                    <div key={a._id} className={`p-2 rounded-md border ${a.resolved ? 'bg-slate-800 border-slate-700 text-slate-300' : a.severity === 'critical' ? 'bg-red-900 border-red-600 text-red-200' : 'bg-yellow-900 border-yellow-700 text-yellow-200'}`}>
                      <p className="text-sm font-semibold">{a.message}</p>
                      <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
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

          <div className="card-elevated border-2 border-cyan-500 border-opacity-30 p-4">
            <label className="block text-sm font-bold text-cyan-400 mb-3">⏰ Time Range</label>
            <select
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="input-modern"
            >
              <option value={1} className="bg-slate-800">Last 1 hour</option>
              <option value={6} className="bg-slate-800">Last 6 hours</option>
              <option value={12} className="bg-slate-800">Last 12 hours</option>
              <option value={24} className="bg-slate-800">Last 24 hours</option>
              <option value={168} className="bg-slate-800">Last 7 days</option>
              <option value={720} className="bg-slate-800">Last 30 days</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={downloadCSV}
              disabled={loading || historyData.length === 0}
              className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📥 Download CSV
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading data...</p>
            </div>
          </div>
        )}

        {/* Charts */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Existing charts and stats will remain here (unchanged) */}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 bg-opacity-40 rounded-lg p-4 border border-cyan-500 border-opacity-20">
              <h3 className="text-sm font-semibold text-white mb-2">3D Bridge Preview</h3>
              <div style={{ height: 360 }}>
                <BridgeModel
                  riskScore={latestData?.riskScore || 0}
                  vibration={latestData?.vibration || 0}
                  load={latestData?.load || 0}
                  crack={latestData?.crack || 0}
                  temperature={latestData?.temperature || 0}
                  onlyShowGreen={onlyShowGreen}
                />
              </div>
            </div>

            <div className="bg-slate-800 bg-opacity-40 rounded-lg p-4 border border-cyan-500 border-opacity-20">
              <h3 className="text-sm font-semibold text-white mb-2">Latest Values</h3>
              {latestData ? (
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                  <div>Vibration: <strong className="text-white">{latestData.vibration}</strong></div>
                  <div>Load: <strong className="text-white">{latestData.load}</strong></div>
                  <div>Crack: <strong className="text-white">{latestData.crack}</strong></div>
                  <div>Temp: <strong className="text-white">{latestData.temperature}</strong></div>
                  <div>Risk: <strong className="text-white">{latestData.riskScore}</strong></div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">No latest data</p>
              )}
            </div>
          </div>
        </div>
        {!loading && historyData.length > 0 && (
          <div className="space-y-8">
            {/* Vibration Chart */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Vibration</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="rgba(209, 213, 219, 0.5)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(209, 213, 219, 0.5)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="vibration" 
                    stroke="#3b82f6" 
                    dot={false}
                    name="Vibration (m/s²)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Load Chart */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Load Stress</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="rgba(209, 213, 219, 0.5)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(209, 213, 219, 0.5)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="load" 
                    stroke="#10b981" 
                    dot={false}
                    name="Load Stress (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Crack Chart */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Crack Width</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="rgba(209, 213, 219, 0.5)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(209, 213, 219, 0.5)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="crack" 
                    stroke="#f59e0b" 
                    dot={false}
                    name="Crack Width (mm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Temperature Chart */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Temperature</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="rgba(209, 213, 219, 0.5)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(209, 213, 219, 0.5)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ef4444" 
                    dot={false}
                    name="Temperature (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Score Chart */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Risk Score</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="rgba(209, 213, 219, 0.5)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(209, 213, 219, 0.5)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="riskScore" 
                    stroke="#a855f7" 
                    dot={false}
                    name="Risk Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Data Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Total Records</p>
                <p className="text-2xl font-bold text-white">{historyData.length}</p>
              </div>
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Avg Vibration</p>
                <p className="text-2xl font-bold text-blue-400">
                  {(historyData.reduce((sum, d) => sum + d.vibration, 0) / historyData.length).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Avg Load</p>
                <p className="text-2xl font-bold text-green-400">
                  {(historyData.reduce((sum, d) => sum + d.load, 0) / historyData.length).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Max Risk</p>
                <p className="text-2xl font-bold text-red-400">
                  {Math.max(...historyData.map((d) => d.riskScore)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && historyData.length === 0 && selectedBridgeId && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No historical data available for this bridge</p>
          </div>
        )}
        {!selectedBridgeId && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Please select a bridge to view historical data</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
