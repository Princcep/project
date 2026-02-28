import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../utils/AuthContext';
import Navbar from '../components/Navbar';
import BridgeModel from '../components/BridgeModel';

const HistoryPage = () => {
  const [bridges, setBridges] = useState([]);
  const [selectedBridgeId, setSelectedBridgeId] = useState('');
  const [selectedBridgeName, setSelectedBridgeName] = useState('');
  const [hours, setHours] = useState(24);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latestData, setLatestData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [simRunning, setSimRunning] = useState(false);
  const [onlyShowGreen, setOnlyShowGreen] = useState(false);
  const [message, setMessage] = useState('');
  const simRef = React.useRef(null);
  const { user } = useAuth();

  const BRIDGES_STORAGE = 'bridge_admin_data';
  const HISTORY_STORAGE = 'bridge_history_data';
  const ALERTS_STORAGE = 'bridge_alerts_data';

  // Fetch bridges from local storage on mount
  useEffect(() => {
    fetchBridgesFromStorage();
  }, []);

  // Fetch historical data when bridge or hours changes
  useEffect(() => {
    if (selectedBridgeId) {
      fetchHistoricalData();
      fetchLatestData();
      fetchAlerts();
    }
    return () => stopSimulation();
  }, [selectedBridgeId, hours]);

  // Load bridges from localStorage
  const fetchBridgesFromStorage = () => {
    try {
      const stored = localStorage.getItem(BRIDGES_STORAGE);
      const data = stored ? JSON.parse(stored) : [];
      setBridges(data);
      
      if (data.length > 0) {
        setSelectedBridgeId(data[0]._id);
        setSelectedBridgeName(data[0].name);
      }
    } catch (err) {
      console.error('Error loading bridges from storage:', err);
      setError('Failed to load bridges');
    }
  };

  // Load historical data from localStorage
  const fetchHistoricalData = () => {
    setLoading(true);
    setError('');
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE);
      const allHistory = stored ? JSON.parse(stored) : [];
      
      // Filter by selected bridge and time range
      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
      const filtered = allHistory.filter(
        item => item.bridgeId === selectedBridgeId && 
                new Date(item.timestamp) >= cutoffTime
      );

      // Format data for chart
      const formattedData = filtered
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map((item) => ({
          ...item,
          displayTime: new Date(item.timestamp).toLocaleTimeString(),
          vibration: parseFloat(item.vibration?.toFixed(2) || 0),
          load: parseFloat(item.load?.toFixed(2) || 0),
          crack: parseFloat(item.crack?.toFixed(2) || 0),
          temperature: parseFloat(item.temperature?.toFixed(2) || 0),
          riskScore: parseFloat(item.riskScore?.toFixed(2) || 0),
        }));

      setHistoryData(formattedData);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Failed to load historical data');
    } finally {
      setLoading(false);
    }
  };

  // Get latest data point
  const fetchLatestData = () => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE);
      const allHistory = stored ? JSON.parse(stored) : [];
      
      const bridgeData = allHistory
        .filter(item => item.bridgeId === selectedBridgeId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      if (bridgeData.length > 0) {
        setLatestData(bridgeData[0]);
      }
    } catch (err) {
      console.error('Error fetching latest data:', err);
    }
  };

  // Fetch alerts for this bridge
  const fetchAlerts = () => {
    try {
      const stored = localStorage.getItem(ALERTS_STORAGE);
      const allAlerts = stored ? JSON.parse(stored) : [];
      
      const bridgeAlerts = allAlerts
        .filter(alert => alert.bridgeId === selectedBridgeId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setAlerts(bridgeAlerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  // Delete a specific alert by ID
  const deleteAlert = (alertId) => {
    try {
      const stored = localStorage.getItem(ALERTS_STORAGE);
      const allAlerts = stored ? JSON.parse(stored) : [];
      const remaining = allAlerts.filter(a => a._id !== alertId);
      localStorage.setItem(ALERTS_STORAGE, JSON.stringify(remaining));
      fetchAlerts();
      setMessage('🗑️ Alert deleted');
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      console.error('Error deleting alert:', e);
      setMessage('❌ Failed to delete alert');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Delete a random alert (useful for quick testing)
  const deleteRandomAlert = () => {
    if (alerts.length === 0) {
      setMessage('❌ No alerts to delete');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    const random = alerts[Math.floor(Math.random() * alerts.length)];
    // dispatch color based on alert severity before deletion
    const colorMap = {
      critical: '#ff3b30',
      high: '#ff9500',
      medium: '#ffcc00',
      low: '#34c759',
    };
    const flashColor = colorMap[random.severity] || '#ffffff';
    window.dispatchEvent(new CustomEvent('model-light', { detail: { color: flashColor } }));
    try {
      localStorage.setItem('model_light_color', flashColor);
    } catch {}

    deleteAlert(random._id);
  };

  // Save historical data to localStorage
  const saveHistoryData = (data) => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE);
      const allHistory = stored ? JSON.parse(stored) : [];
      allHistory.push(data);
      // Keep only last 1000 entries
      const trimmed = allHistory.slice(-1000);
      localStorage.setItem(HISTORY_STORAGE, JSON.stringify(trimmed));
    } catch (err) {
      console.error('Error saving history:', err);
    }
  };

  // Start simulation - add data every 2.5 seconds
  const startSimulation = (intervalMs = 2500) => {
    if (!selectedBridgeId || simRef.current) return;
    setSimRunning(true);
    setMessage('');
    
    simRef.current = setInterval(() => {
      try {
        // Generate realistic random values
        const base = latestData || { 
          vibration: 10, 
          load: 20, 
          crack: 2, 
          temperature: 22, 
          riskScore: 5 
        };
        
        const rand = (v, pct = 0.15) => {
          const change = (Math.random() - 0.5) * v * pct;
          return Math.max(0, v + change);
        };
        
        const newData = {
          _id: Date.now().toString(),
          bridgeId: selectedBridgeId,
          bridgeName: selectedBridgeName,
          vibration: parseFloat(rand(base.vibration || 10).toFixed(2)),
          load: parseFloat(rand(base.load || 20).toFixed(2)),
          crack: parseFloat(Math.max(0, rand(base.crack || 2, 0.2)).toFixed(2)),
          temperature: parseFloat(rand(base.temperature || 22, 0.1).toFixed(2)),
          riskScore: parseFloat(Math.min(100, rand(base.riskScore || 5, 0.4)).toFixed(2)),
          timestamp: new Date().toISOString(),
        };
        
        saveHistoryData(newData);
        fetchHistoricalData();
        fetchLatestData();
      } catch (e) {
        console.error('Simulation error:', e);
      }
    }, intervalMs);
    
    setMessage('🟢 Simulation running... collecting data every 2.5s');
  };

  // Stop simulation
  const stopSimulation = () => {
    if (simRef.current) {
      clearInterval(simRef.current);
      simRef.current = null;
    }
    setSimRunning(false);
    setMessage('🛑 Simulation stopped');
    setTimeout(() => setMessage(''), 2000);
  };

  // Trigger alert - add high-stress data point
  const triggerAlert = async () => {
    if (!selectedBridgeId) {
      setMessage('❌ Please select a bridge first');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      // Generate realistic alert scenarios
      const scenarios = [
        {
          name: '🌡️ Thermal Stress Event',
          vibration: 42 + Math.random() * 15,
          load: 35 + Math.random() * 20,
          crack: 2.1 + Math.random() * 1.5,
          temperature: 72 + Math.random() * 18,
          riskScore: 68 + Math.random() * 12,
          severity: 'high',
          type: 'Temperature Anomaly',
        },
        {
          name: '📊 Vibration Spike',
          vibration: 78 + Math.random() * 22,
          load: 65 + Math.random() * 25,
          crack: 3.2 + Math.random() * 2,
          temperature: 38 + Math.random() * 10,
          riskScore: 75 + Math.random() * 18,
          severity: 'critical',
          type: 'Structural Vibration',
        },
        {
          name: '⚠️ Structural Crack Formation',
          vibration: 35 + Math.random() * 12,
          load: 55 + Math.random() * 30,
          crack: 7.8 + Math.random() * 3.2,
          temperature: 42 + Math.random() * 12,
          riskScore: 82 + Math.random() * 15,
          severity: 'critical',
          type: 'Crack Detection',
        },
        {
          name: '🚗 Overload Condition',
          vibration: 68 + Math.random() * 18,
          load: 88 + Math.random() * 12,
          crack: 4.5 + Math.random() * 2.5,
          temperature: 55 + Math.random() * 15,
          riskScore: 85 + Math.random() * 12,
          severity: 'critical',
          type: 'Load Threshold Exceeded',
        },
        {
          name: '❄️ Thermal Contraction',
          vibration: 52 + Math.random() * 14,
          load: 48 + Math.random() * 18,
          crack: 1.8 + Math.random() * 1.2,
          temperature: 8 + Math.random() * 5,
          riskScore: 58 + Math.random() * 15,
          severity: 'medium',
          type: 'Temperature Drop',
        },
        {
          name: '⛈️ Seismic Activity',
          vibration: 92 + Math.random() * 8,
          load: 76 + Math.random() * 22,
          crack: 6.5 + Math.random() * 2.8,
          temperature: 45 + Math.random() * 8,
          riskScore: 89 + Math.random() * 9,
          severity: 'critical',
          type: 'Seismic Event',
        },
        {
          name: '🔧 Corrosion Detection',
          vibration: 45 + Math.random() * 16,
          load: 42 + Math.random() * 22,
          crack: 3.5 + Math.random() * 2.2,
          temperature: 62 + Math.random() * 12,
          riskScore: 65 + Math.random() * 18,
          severity: 'high',
          type: 'Corrosion Alert',
        },
      ];

      // Pick a random scenario
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

      // Create alert data point
      const alertData = {
        _id: Date.now().toString(),
        bridgeId: selectedBridgeId,
        bridgeName: selectedBridgeName,
        vibration: parseFloat(scenario.vibration.toFixed(2)),
        load: parseFloat(scenario.load.toFixed(2)),
        crack: parseFloat(scenario.crack.toFixed(2)),
        temperature: parseFloat(scenario.temperature.toFixed(2)),
        riskScore: parseFloat(scenario.riskScore.toFixed(1)),
        timestamp: new Date().toISOString(),
      };

      saveHistoryData(alertData);
      fetchHistoricalData();
      fetchLatestData();

      // Create alert entry
      const stored = localStorage.getItem(ALERTS_STORAGE);
      const allAlerts = stored ? JSON.parse(stored) : [];

      const newAlert = {
        _id: Date.now().toString(),
        bridgeId: selectedBridgeId,
        bridgeName: selectedBridgeName,
        severity: scenario.severity,
        message: `${scenario.name}`,
        type: scenario.type,
        value: parseFloat(scenario.riskScore.toFixed(1)),
        riskScore: parseFloat(scenario.riskScore.toFixed(1)),
        createdAt: new Date().toISOString(),
        resolved: false,
      };

      allAlerts.push(newAlert);
      localStorage.setItem(ALERTS_STORAGE, JSON.stringify(allAlerts));
      fetchAlerts();

      // notify dashboard model to flash light color according to severity
      const colorMap = {
        critical: '#ff3b30',
        high: '#ff9500',
        medium: '#ffcc00',
        low: '#34c759',
      };
      const flashColor = colorMap[scenario.severity] || '#ffffff';
      window.dispatchEvent(new CustomEvent('model-light', { detail: { color: flashColor } }));
      // persist to storage so dashboard can pick it up after navigation
      try {
        localStorage.setItem('model_light_color', flashColor);
      } catch {};

      setMessage(`🚨 ${scenario.name} created (Risk: ${scenario.riskScore.toFixed(1)})`);
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      console.error('Error creating alert:', e);
      setMessage('❌ Error creating alert');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Handle bridge selection
  const handleBridgeChange = (e) => {
    const bridgeId = e.target.value;
    const bridge = bridges.find(b => b._id === bridgeId);
    setSelectedBridgeId(bridgeId);
    if (bridge) {
      setSelectedBridgeName(bridge.name);
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

        {/* Message Display */}
        {message && (
          <div className="bg-blue-600 bg-opacity-30 border-2 border-blue-500 text-blue-100 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-600 bg-opacity-30 border-2 border-red-500 text-red-100 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">❌ {error}</p>
          </div>
        )}

        {/* Bridge Selection and Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              <p className="text-gray-400 text-sm italic">No bridges available. Create one in Admin Panel.</p>
            )}
          </div>

          <div className="card-elevated border-2 border-cyan-500 border-opacity-30 p-4">
            <label className="block text-sm font-bold text-cyan-400 mb-3">⏰ Time Range</label>
            <select
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="input-modern w-full"
            >
              <option value={1}>Last 1 hour</option>
              <option value={6}>Last 6 hours</option>
              <option value={12}>Last 12 hours</option>
              <option value={24}>Last 24 hours</option>
              <option value={168}>Last 7 days</option>
              <option value={720}>Last 30 days</option>
            </select>
          </div>

          <div className="card-elevated border-2 border-cyan-500 border-opacity-30 p-4">
            <label className="block text-sm font-bold text-cyan-400 mb-3">📊 Data Points</label>
            <div className="text-2xl font-bold text-cyan-400">
              {historyData.length}
            </div>
            <p className="text-xs text-gray-400">readings</p>
          </div>

          <div className="card-elevated border-2 border-cyan-500 border-opacity-30 p-4">
            <label className="block text-sm font-bold text-cyan-400 mb-3">🚗 Latest Load</label>
            <div className="text-2xl font-bold text-yellow-400">
              {latestData?.load?.toFixed(1) || '--'} MN
            </div>
            <p className="text-xs text-gray-400">stress level</p>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="card-elevated border-2 border-cyan-500 border-opacity-30 p-6 mb-8">
          <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center space-x-2">
            <span>⚙️ Testing & Simulation</span>
            {simRunning && <span className="animate-pulse text-green-400">● Recording</span>}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-300 mb-3">Generate realistic sensor data:</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => startSimulation()}
                  disabled={simRunning || !selectedBridgeId}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  🟢 Start Simulation
                </button>
                <button
                  onClick={() => stopSimulation()}
                  disabled={!simRunning}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  🛑 Stop
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-3">Create sample alert data:</p>
              <button
                onClick={() => triggerAlert()}
                disabled={!selectedBridgeId}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                🚨 Create Sample Alert
              </button>
              <button
                onClick={() => deleteRandomAlert()}
                disabled={!selectedBridgeId || alerts.length === 0}
                className="w-full mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                🗑️ Delete Random Alert
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            💡 Simulation adds data every 2.5 seconds | Alert creates high-stress sample data point
          </p>
        </div>

        {/* Recent Alerts */}
        <div className="card-elevated border-2 border-amber-500 border-opacity-40 p-6 mb-8">
          <h3 className="text-lg font-bold text-amber-400 mb-4">📢 Recent Alerts for {selectedBridgeName || 'Selected Bridge'}</h3>
          {alerts.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No alerts yet. Click "Create Sample Alert" to add one.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-auto">
              {alerts.map((a) => (
                <div 
                  key={a._id} 
                  className={`relative p-3 rounded-lg border-2 ${
                    a.resolved 
                      ? 'bg-slate-800 border-slate-600 text-slate-300' 
                      : a.severity === 'critical' 
                      ? 'bg-red-900 border-red-600 text-red-200' 
                      : 'bg-yellow-900 border-yellow-600 text-yellow-200'
                  }`}
                >
                  <button
                    onClick={() => deleteAlert(a._id)}
                    className="absolute top-2 right-2 text-xs text-red-300 hover:text-red-100"
                    title="Delete alert"
                  >
                    🗑️
                  </button>
                  <p className="font-semibold text-sm">{a.message}</p>
                  <p className="text-xs mt-1 opacity-75">{new Date(a.createdAt).toLocaleString()}</p>
                  <p className="text-xs mt-1">Risk: {a.riskScore?.toFixed(1) || 'N/A'} | Type: {a.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extra Tools */}
        <div className="card-elevated border-2 border-cyan-500 border-opacity-30 p-6 mb-8">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">📥 Data Export</h3>
          <button
            onClick={downloadCSV}
            disabled={loading || historyData.length === 0}
            className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📥 Download CSV
          </button>
        </div>

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
