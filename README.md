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
npm start
```

**🌐 Server URLs:**
- **Main App:** http://localhost:3000
- **GraphQL Playground:** http://localhost:3000/graphql
- **API Documentation:** http://localhost:3000/api-docs

## 📦 Installation

### Prerequisites

- **Node.js:** Version 18 or higher
- **npm:** Version 8 or higher (comes with Node.js 18+)


### Core Endpoints

- `GET /` - Market status
- `GET /api/marketStatus` - Market status information
- `GET /api/glossary` - NSE glossary
- `GET /api/equity/:symbol` - Equity details
- `GET /api/equity/:symbol/historical` - Historical data
- `GET /api/indices` - Market indices
- `GET /api-docs` - Interactive API documentation

### Container URLs

- **Main App:** http://localhost:3001
- **GraphQL:** http://localhost:3001/graphql
- **API Docs:** http://localhost:3001/api-docs

## 📊 API Methods

### Core Methods

- **`getAllStockSymbols()`** - Get all NSE stock symbols
- **`getData()`** - Generic data retrieval
- **`getDataByEndpoint()`** - Get data by specific NSE API endpoints

---

**⭐ Star this repository if you find it helpful!**



















