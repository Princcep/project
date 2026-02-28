/**
 * Finnhub API Service
 * Fetches real-time stock market data and maps it to bridge load metrics
 * Uses AAPL stock volume to simulate traffic/load on the structure
 */

const axios = require('axios');

// Get API key from environment or use placeholder
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo'; // Get free key from finnhub.io
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const STOCK_SYMBOL = 'AAPL'; // Apple stock

let lastStockData = {
  volume: 0,
  price: 0,
  volumeMax: 100000000, // Baseline for normalization
};

/**
 * Fetch real-time stock quote from Finnhub
 */
const fetchStockQuote = async () => {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
      params: {
        symbol: STOCK_SYMBOL,
        token: FINNHUB_API_KEY,
      },
      timeout: 5000,
    });

    const { v: volume, c: price } = response.data;

    if (volume && price) {
      lastStockData = {
        volume,
        price,
        volumeMax: Math.max(lastStockData.volumeMax, volume),
        timestamp: new Date().toISOString(),
      };
      return lastStockData;
    }
  } catch (error) {
    console.error('Finnhub API Error:', error.message);
    // Return last known data on error
    return lastStockData;
  }
};

/**
 * Map stock volume to bridge load metrics
 * Normal trading volume: ~50-100M shares/day
 * Converts trading volume to load percentage (0-100)
 */
const mapVolumeToLoad = (volume) => {
  // Normalize volume: average daily volume ~50M, max spike ~200M
  const normalizedVolume = (volume / 80000000) * 100; // 80M shares = baseline
  return Math.min(100, Math.max(0, normalizedVolume));
};

/**
 * Map stock volume to vibration (secondary indicator)
 * High trading activity = more price fluctuations = simulated vibration
 */
const mapVolumeToVibration = (volume, price) => {
  // Higher volume = potential price volatility = vibration
  const baseLine = 15;
  const volumeFactor = (volume / 100000000) * 30; // Up to +30 from volume
  return Math.min(80, baseLine + volumeFactor);
};

/**
 * Get current load level based on stock market activity
 */
const getMarketLoad = async () => {
  const stockData = await fetchStockQuote();
  const load = mapVolumeToLoad(stockData.volume);
  const vibration = mapVolumeToVibration(stockData.volume, stockData.price);

  return {
    load,
    vibration,
    stockSymbol: STOCK_SYMBOL,
    stockPrice: stockData.price,
    stockVolume: stockData.volume,
    timestamp: stockData.timestamp,
    source: 'finnhub',
  };
};

/**
 * Generate sensor data influenced by market activity
 * Blends real market data with sensor data for realistic simulation
 */
const generateMarketInfluencedSensorData = async () => {
  const marketData = await getMarketLoad();
  
  const lastData = global.lastSensorData || {
    vibration: 20,
    load: 40,
    crack: 5,
    temperature: 25,
  };

  // Apply market influence (70% market, 30% random variation)
  const marketWeight = 0.7;
  const randomWeight = 0.3;

  const vibration = Math.max(
    0,
    Math.min(
      100,
      marketData.vibration * marketWeight + lastData.vibration * randomWeight +
      (Math.random() - 0.5) * 5
    )
  );

  const load = Math.max(
    0,
    Math.min(
      100,
      marketData.load * marketWeight + lastData.load * randomWeight +
      (Math.random() - 0.5) * 3
    )
  );

  // Crack: minimal changes, independent of market
  const crack = Math.max(
    0,
    Math.min(10, lastData.crack + (Math.random() - 0.5) * 0.5)
  );

  // Temperature: slight correlation with vibration (friction from movement)
  const tempInfluence = (vibration / 100) * 15; // Up to 15°C from vibration
  const temperature = Math.max(
    -10,
    Math.min(70, 20 + tempInfluence + (Math.random() - 0.5) * 2)
  );

  const sensorData = {
    vibration: parseFloat(vibration.toFixed(2)),
    load: parseFloat(load.toFixed(2)),
    crack: parseFloat(crack.toFixed(2)),
    temperature: parseFloat(temperature.toFixed(2)),
    marketData: {
      symbol: STOCK_SYMBOL,
      price: parseFloat(marketData.stockPrice.toFixed(2)),
      volume: marketData.stockVolume,
      loadInfluence: parseFloat(marketData.load.toFixed(2)),
    },
  };

  global.lastSensorData = sensorData;
  return sensorData;
};

/**
 * Get market status and trading insights
 */
const getMarketInsights = async () => {
  const stockData = await fetchStockQuote();
  const load = mapVolumeToLoad(stockData.volume);

  let trafficStatus = 'Low';
  if (load > 70) trafficStatus = 'Critical';
  else if (load > 50) trafficStatus = 'High';
  else if (load > 30) trafficStatus = 'Moderate';

  return {
    symbol: STOCK_SYMBOL,
    price: parseFloat(stockData.price.toFixed(2)),
    volume: stockData.volume,
    marketLoadPercent: parseFloat(load.toFixed(2)),
    trafficStatus,
    timestamp: stockData.timestamp,
  };
};

module.exports = {
  fetchStockQuote,
  mapVolumeToLoad,
  mapVolumeToVibration,
  getMarketLoad,
  generateMarketInfluencedSensorData,
  getMarketInsights,
};
