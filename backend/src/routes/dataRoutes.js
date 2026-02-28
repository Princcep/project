const express = require('express');
const {
  getBridges,
  createBridge,
  getBridgeById,
  getLatestData,
  getHistoricalData,
  addSensorData,
  getAlerts,
} = require('../controllers/dataController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Bridge routes
// GET all bridges is public for demo/mock users (no auth required)
router.get('/bridges', getBridges);
router.post('/bridges', protect, authorize('admin'), createBridge);
router.get('/bridges/:id', protect, getBridgeById);

// Sensor data routes
router.post('/sensor-data', addSensorData); // No auth for simulation
router.get('/sensor-data/:bridgeId/latest', protect, getLatestData);
router.get('/sensor-data/:bridgeId/history', protect, getHistoricalData);

// Alert routes
router.get('/alerts/:bridgeId', protect, getAlerts);

module.exports = router;
