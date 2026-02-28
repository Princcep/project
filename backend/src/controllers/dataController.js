const Bridge = require('../models/Bridge');
const BridgeData = require('../models/BridgeData');
const Alert = require('../models/Alert');

// Get all bridges (public)
exports.getBridges = async (req, res) => {
  try {
    const bridges = await Bridge.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bridges.length,
      data: bridges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create bridge (admin only)
exports.createBridge = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bridge name and location',
      });
    }

    const bridge = await Bridge.create({
      name,
      location,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: bridge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get bridge by ID
exports.getBridgeById = async (req, res) => {
  try {
    const bridge = await Bridge.findById(req.params.id);

    if (!bridge) {
      return res.status(404).json({
        success: false,
        message: 'Bridge not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bridge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get latest sensor data for a bridge
exports.getLatestData = async (req, res) => {
  try {
    const { bridgeId } = req.params;

    const data = await BridgeData.findOne({ bridgeId }).sort({ timestamp: -1 });

    if (!data) {
      return res.status(404).json({
        success: true,
        data: null,
        message: 'No data found',
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get historical data for a bridge (last 24 hours or custom range)
exports.getHistoricalData = async (req, res) => {
  try {
    const { bridgeId } = req.params;
    const { hours = 24, limit = 100 } = req.query;

    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const data = await BridgeData.find({
      bridgeId,
      timestamp: { $gte: startTime },
    })
      .sort({ timestamp: 1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add sensor data
exports.addSensorData = async (req, res) => {
  try {
    const { bridgeId, vibration, load, crack, temperature, riskScore } = req.body;

    if (!bridgeId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bridgeId',
      });
    }

    // Create new sensor data
    const data = await BridgeData.create({
      bridgeId,
      vibration: vibration || 0,
      load: load || 0,
      crack: crack || 0,
      temperature: temperature || 0,
      riskScore: riskScore || 0,
    });

    // Check if alert should be created
    if (riskScore > 75) {
      // Check for existing unresolved alert
      const existingAlert = await Alert.findOne({
        bridgeId,
        type: 'risk',
        resolved: false,
      });

      if (!existingAlert) {
        await Alert.create({
          bridgeId,
          type: 'risk',
          severity: riskScore > 90 ? 'critical' : 'high',
          message: `High risk score detected: ${riskScore.toFixed(2)}`,
          value: riskScore,
          riskScore,
        });

        // Update bridge status
        await Bridge.findByIdAndUpdate(bridgeId, { status: 'alert' });
      }
    } else {
      // Resolve alert if risk score is back to normal
      const alert = await Alert.findOne({
        bridgeId,
        type: 'risk',
        resolved: false,
      });

      if (alert && riskScore <= 75) {
        alert.resolved = true;
        alert.resolvedAt = new Date();
        await alert.save();

        // Update bridge status back to operational
        await Bridge.findByIdAndUpdate(bridgeId, { status: 'operational' });
      }
    }

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get alerts for a bridge
exports.getAlerts = async (req, res) => {
  try {
    const { bridgeId } = req.params;
    const { resolved } = req.query;

    let query = { bridgeId };
    if (resolved !== undefined) {
      query.resolved = resolved === 'true';
    }

    const alerts = await Alert.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current market load (stock volume mapped to load)
exports.getMarketLoad = async (req, res) => {
  try {
    const finnhubService = require('../utils/finnhubService');
    const marketData = await finnhubService.getMarketLoad();

    res.status(200).json({
      success: true,
      data: marketData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get market insights (price, volume, status)
exports.getMarketInsights = async (req, res) => {
  try {
    const finnhubService = require('../utils/finnhubService');
    const insights = await finnhubService.getMarketInsights();

    res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate market-influenced sensor data
exports.generateMarketSensorData = async (req, res) => {
  try {
    const finnhubService = require('../utils/finnhubService');
    const sensorData = await finnhubService.generateMarketInfluencedSensorData();

    res.status(200).json({
      success: true,
      data: sensorData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
