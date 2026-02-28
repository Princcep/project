# Finnhub API Integration - Stock Market Load Monitoring

## Overview

This project integrates **Finnhub API** to correlate real stock market activity (Apple/AAPL stock trading volume) with bridge structural load. This creates a realistic simulation where high trading volumes represent heavy traffic/load on the bridge structure.

## How It Works

### Data Mapping:
- **Stock Trading Volume** → Bridge Load/Stress (MN)
- **Price Fluctuations** → Vibration Levels (m/s²)
- **Market Activity** → Structural Strain

### Logic:
1. **Fetch AAPL stock data** every 15 seconds from Finnhub API
2. **Extract trading volume** and normalize it (baseline: 80M shares = 100% load)
3. **Map volume to bridge metrics**:
   - Load: `(volume / 80M) * 100%`
   - Vibration: Base 15 + (volume / 100M) * 30
   - Temperature: Derived from vibration friction

## Setup Steps

### 1. Get a Free Finnhub API Key

Visit: https://finnhub.io/

- Click **Sign Up** (free tier available)
- Complete registration
- Go to **Dashboard** → Find your **API Key**
- Copy the key (looks like: `c123abc...xyz`)

### 2. Configure Environment Variables

#### For Development (.env.local):
```bash
REACT_APP_FINNHUB_API_KEY=your_finnhub_api_key_here
```

#### For Backend (.env):
```bash
FINNHUB_API_KEY=your_finnhub_api_key_here
```

### 3. Verify Integration

1. Start the application: `npm start` (frontend) and `npm start` (backend)
2. Navigate to **Dashboard**
3. Look for **"📈 Stock Market Correlation"** panel
4. Verify AAPL stock data displays:
   - Current price
   - Trading volume
   - Market load percentage
   - Traffic status (Low/Moderate/High/Critical)

## API Endpoints

### Backend Routes:

#### Get Current Market Load
```
GET /api/data/market/load
```
Returns:
```json
{
  "load": 45.5,
  "vibration": 32.1,
  "stockSymbol": "AAPL",
  "stockPrice": 195.42,
  "stockVolume": 52000000,
  "timestamp": "2026-02-28T10:30:00Z",
  "source": "finnhub"
}
```

#### Get Market Insights
```
GET /api/data/market/insights
```
Returns:
```json
{
  "symbol": "AAPL",
  "price": 195.42,
  "volume": 52000000,
  "marketLoadPercent": 45.5,
  "trafficStatus": "Moderate",
  "timestamp": "2026-02-28T10:30:00Z"
}
```

#### Generate Market-Influenced Sensor Data
```
GET /api/data/market/sensor-data
```
Returns:
```json
{
  "vibration": 32.1,
  "load": 45.5,
  "crack": 3.2,
  "temperature": 24.8,
  "marketData": {
    "symbol": "AAPL",
    "price": 195.42,
    "volume": 52000000,
    "loadInfluence": 65.0
  }
}
```

## Feature Highlights

### Real-time Stock Data
- Fetches AAPL stock quotes every 15 seconds
- Updates bridge load metrics automatically
- Shows current price, volume, and market activity

### Market-Influenced Sensors
- 70% weight on market data
- 30% weight on random variation
- Creates realistic fluctuations tied to real market events

### Traffic Status Indicators
- **Low**: < 30% market load
- **Moderate**: 30-50% market load
- **High**: 50-70% market load
- **Critical**: > 70% market load

### Sensor Correlations
- **Volume → Load**: Direct mapping of trading volume to structural stress
- **Volume → Vibration**: High trading activity creates price volatility
- **Vibration → Temperature**: Friction from movement generates heat

## Demo Data

When Finnhub API is unavailable:
- Uses simulated stock data
- Maintains realistic patterns
- Falls back gracefully without errors

Example volume ranges:
- **Normal Office Hours** (9:30 AM - 4:00 PM EST): 50-100M shares
- **High Activity/News**: 100-150M shares
- **Market Spike**: 150-200M+ shares
- **Off-Hours**: Minimal volume

## Volume-to-Load Conversion

| Trading Volume | Load % | Traffic Status |
|---|---|---|
| 10M shares | 12.5% | Low |
| 40M shares | 50% | Moderate |
| 80M shares | 100% | High |
| 130M shares | 162%* | Critical |

*Capped at 100% max load

## Troubleshooting

### Issue: "Unable to fetch market data" message
**Solution**: 
- Verify Finnhub API key is valid
- Check internet connection
- Ensure API key is set in environment variables
- Restart the development server

### Issue: Market data shows $0 or undefined
**Solution**:
- Wait for API response (first load takes ~2-3 seconds)
- Refresh the page
- Check browser console for API errors

### Issue: Volume numbers seem wrong
**Solution**:
- Finnhub shows volume in number of shares
- Display shows in millions (M) for readability
- 52000000 = 52M shares (correct)

## Finnhub Free Tier Limits

- **API Calls**: 60 requests/minute
- **Data Delay**: Real-time
- **Symbols**: All supported
- **Update Frequency**: Support recommends 15-30 seconds minimum

## Production Deployment

For production, consider:

1. **Rate Limiting**: Implement caching to avoid hitting API limits
2. **Error Handling**: Gracefully handle API failures
3. **Security**: Use backend API only (never expose API key to frontend)
4. **Monitoring**: Log API usage and failures

### Recommended Backend Setup:
```javascript
// Cache stock data for 15 seconds
const cache = {
  lastFetch: null,
  data: null,
  TTL: 15000, // 15 seconds
};

const getCachedStockData = async () => {
  if (cache.lastFetch && Date.now() - cache.lastFetch < cache.TTL) {
    return cache.data; // Return cached data
  }
  
  const data = await fetchStockQuote();
  cache.data = data;
  cache.lastFetch = Date.now();
  return data;
};
```

## Integration Test

To verify everything works:

1. Add a test bridge in Admin Panel
2. Go to Dashboard
3. Check "📈 Stock Market Correlation" panel
4. Verify:
   - Stock price updates (should match real AAPL price)
   - Volume number changes (market hours only)
   - Load percentage responds to volume
   - Sensor readings update with market data

## Stock Selection Notes

Currently using **AAPL (Apple)** because:
- ✅ Highly liquid (large trading volume)
- ✅ Consistent market hours (9:30 AM - 4:00 PM EST)
- ✅ Real-world volatility (good for testing)
- ✅ Easily accessible data

Could be changed to any stock in `finnhubService.js`:
```javascript
const STOCK_SYMBOL = 'TSLA'; // or 'SPY', 'GOOGL', etc.
```

## References

- Finnhub Documentation: https://finnhub.io/docs/api
- Free API Key: https://finnhub.io/
- Rate Limits: https://finnhub.io/pricing
