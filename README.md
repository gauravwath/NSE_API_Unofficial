# NSE_API_Unofficial
National Stock Exchange API (Unofficial)
API server for accessing equity/index details and historical data from the National Stock Exchange of India.

## ✨ Features
- **🔒 CORS Configuration** - Configurable cross-origin resource sharing
- **📊 Real-time Data** - Live market data and historical information
- **📈 Multiple Data Types** - Equity, Index, Commodity, and Options data

## 🚀 Quick Start

**⚠️ Prerequisites:** Node.js 18+ required

# Start the server
npm run start


**🌐 Server URLs:**
- **Main App:** http://localhost:6123
- http://localhost:6123/api/equity/?identifier=infy
- http://localhost:6123/api/marketAnalysis/?identifier=gainers
- http://localhost:6123/api/holidays?type=trading
- http://localhost:6123/api/top-corp-info?symbol=TATATECH
- **common Method:**
- http://localhost:6123/api/common?type=/api/live-analysis-data-52weekhighstock
- http://localhost:6123/api/common?type=/api/quote-equity?symbol=ABINFRA
- http://localhost:6123/api/common?type=/api/marketStatus

#### Query Methods
- ** if your developer so you goto NSE website inspect element and check network section xhr/fetch 
Request Header --> :path : /api/NextApi/apiClient/GetQuoteApi?functionName=getSymbolName&symbol=TCS
so u check get data use common method
example : http://localhost:6123/api/common?type=/api/NextApi/apiClient?functionName=getGiftNifty

## 📦 Installation

### Prerequisites

- **Node.js:** Version 18 or higher
- **npm:** Version 8 or higher (comes with Node.js 18+)
- npm i

### Core Endpoints

- `GET /` - Market status
- `GET /api/marketStatus` - Market status information
- `GET /api/equity/:symbol` - Equity details
- `GET /api/equity/:symbol/historical` - Historical data


### Container URLs

- **Main App:** http://localhost:6123


## 📊 API Methods

### Core Methods

- **`getAllStockSymbols()`** - Get all NSE stock symbols
- **`getData()`** - Generic data retrieval
- **`getDataByEndpoint()`** - Get data by specific NSE API endpoints

---

**⭐ Star this repository if you find it helpful!**



















