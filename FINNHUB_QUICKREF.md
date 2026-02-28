# Stock Market Load Integration - Quick Start

## 🚀 What's New

Your bridge monitoring system now integrates **real stock market data** to simulate traffic load! Real-time AAPL (Apple) stock trading volume is mapped to bridge structural stress.

## 📊 How It Works

```
Stock Market Activity (AAPL Volume)
          ↓
    Finnhub API
          ↓
    Volume → Load Mapping
          ↓
    Bridge Sensor Readings
    - Load Stress
    - Vibration Level  
    - Temperature
```

**Example**: High trading = Heavy traffic = High bridge load

## 🔧 Quick Setup (3 Steps)

### Step 1: Get Free API Key
1. Go to: https://finnhub.io/
2. Click **Sign Up** (free tier)
3. Copy your API key from dashboard

### Step 2: Configure Your System

**For Frontend Development:**
Create `.env.local` in project root:
```
REACT_APP_FINNHUB_API_KEY=your_key_here
```

**For Backend:**
Update `.env` in `/backend`:
```
FINNHUB_API_KEY=your_key_here
```

### Step 3: Start & See It Live

```bash
# Frontend
npm start

# Backend (in separate terminal)  
cd backend && npm start
```

Visit Dashboard → Scroll down to "📈 Stock Market Correlation"

## 💡 What You'll See

| Component | Shows |
|---|---|
| **Stock Price** | Current AAPL price ($) |
| **Trading Volume** | Shares traded (Millions) |
| **Load %** | How hard market is working |
| **Traffic Status** | Low/Moderate/High/Critical |
| **Vibration** | Real-time m/s² readings |
| **Load Stress** | MN (meganewtons) |
| **Temperature** | °C (derived from load) |

## 🎯 Update Frequency

- **Automatic updates**: Every 15 seconds during market hours
- **Market hours**: 9:30 AM - 4:00 PM EST (Monday-Friday)
- **Off-hours**: Minimal volume (simulated data) |

## 📈 Real-World Mapping

| AAPL Volume | Bridge Load | Status |
|---|---|---|
| 40M shares | 50% | Moderate |
| 80M shares | 100% | High |
| 120M shares | 150%* | Critical |

*Max load capped at 100%

## 🔗 API Endpoints

All public (no authentication required):

```
GET /api/data/market/load          → Current load & vibration
GET /api/data/market/insights      → Price, volume, status
GET /api/data/market/sensor-data   → Full sensor readings
```

## ✅ Files Created/Modified

**New Files:**
- `/backend/src/utils/finnhubService.js` - Stock data integration
- `/src/components/StockMarketImpact.js` - Display component
- `/FINNHUB_SETUP.md` - Detailed setup guide
- `/FINNHUB_QUICKREF.md` - This file

**Modified:**
- `/backend/src/controllers/dataController.js` - Added market endpoints
- `/backend/src/routes/dataRoutes.js` - Added market routes
- `/src/pages/Dashboard.js` - Added StockMarketImpact component

## 🚨 Without API Key

If you skip the API key setup:
- System shows friendly error message
- Falls back to simulated data
- Still fully functional
- **All features work normally**

## 💬 How Bridge Load Works

### Without Stock Data (Old):
- Random vibration: 5-95 m/s²
- Random load: 10-100 MN
- No real-world correlation

### With Stock Data (New):
- Vibration: Market activity + 30% randomness
- Load: AAPL volume + 30% randomness
- Temperature: Derived from movement
- **Realistic patterns tied to real events!**

## 🎓 Example Scenario

**Tuesday 2:00 PM EST:**
1. Markets are open
2. Apple announces new product → Trading volume spikes to 200M
3. API fetches this surge
4. Bridge load jumps to 150%+ (capped at 100%)
5. Vibration increases to 50+ m/s²
6. Temperature rises due to friction
7. **Alert system may trigger** for high stress
8. Dashboard shows "🔴 Critical" status

## 🔍 Monitoring Dashboard

The new panel shows:
- Real-time stock correlation
- Market-influenced sensor readings  
- Traffic status indicator
- Load percentage bars
- How market data influences bridge metrics

## ⚙️ Can I Try It Without Finnhub?

**Yes!** Your system uses fallback mode:
- Simulates market data
- Updates every 15 seconds
- No errors or warnings
- Fully functional

To upgrade later → just add the API key → automatic activation!

## 📚 Full Documentation

For detailed setup, troubleshooting, and production deployment:
→ See `FINNHUB_SETUP.md`

## 🆘 Verify It's Working

1. **Terminal shows**: No API errors
2. **Dashboard shows**: "📈 Stock Market Correlation" panel
3. **Numbers display**: Stock price, volume, load percentage
4. **Updates every**: 15 seconds (check timestamp)
5. **Status shows**: Not "Error" or "Offline"

---

**🎉 You're all set! Market-driven bridge monitoring is live!**
