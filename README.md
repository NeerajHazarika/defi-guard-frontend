# DeFi Guard Frontend

🛡️ **A comprehensive React TypeScript dashboard for DeFi security monitoring and blockchain compliance**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.x-blue.svg)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)

## 🌟 Overview

DeFi Guard Frontend is a professional security dashboard providing real-time monitoring and analysis of DeFi protocols, threat intelligence, and blockchain compliance. Built with modern React and TypeScript, it offers comprehensive tools for security professionals and DeFi operators.

## 🚀 Key Features

### 📊 **Security Dashboards**
- **Dashboard Overview**: Centralized metrics and real-time monitoring
- **Threat Intelligence**: Live OSINT feeds from security sources
- **Stablecoin Monitoring**: Price deviation and depeg alerts
- **Attack Surface Monitoring**: Protocol vulnerability tracking

### 🔍 **Compliance Tools**
- **OFAC Compliance**: Sanctions screening and address monitoring
- **DeFi Risk Assessment**: Protocol security analysis
- **Fraud Intelligence**: Scam detection and user risk profiling
- **Mixer Detection**: Privacy coin and tumbler identification

### 📈 **Analytics & Insights**
- **Exploit Monitoring**: Real-time security threat tracking
- **Risk Analytics**: Comprehensive compliance metrics
- **Interactive Charts**: Professional data visualization
- **Export Capabilities**: PDF and CSV report generation

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript 5.x |
| **Build Tool** | Vite with HMR |
| **UI Framework** | Material-UI (MUI) v5 |
| **Charts** | Recharts |
| **Routing** | React Router DOM v6 |
| **Styling** | Emotion CSS-in-JS |
| **Icons** | Material Design Icons |

## 📦 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- Modern browser with ES2022 support

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/defi-guard-frontend.git
cd defi-guard-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access dashboard at http://localhost:3000
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── MetricCard.tsx  # Dashboard metric cards
│   └── ErrorBoundary.tsx
├── pages/              # Main dashboard pages
│   ├── DashboardOverview.tsx
│   ├── ThreatIntelligence.tsx
│   ├── OFACCompliance.tsx
│   └── Analytics.tsx
├── hooks/              # Custom React hooks
│   ├── useBackendData.ts
│   └── useApiData.ts
├── services/           # API service layer
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
├── data/               # Static data and mock data
└── assets/             # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_THREAT_INTEL_API_URL=http://localhost:8001
VITE_STABLECOIN_API_URL=http://localhost:8002

# Optional: Development settings
VITE_DEV_MODE=true
```

### Backend Services

DeFi Guard Frontend requires the following backend services:

1. **Threat Intelligence Service** (Port 8001)
   - OSINT data aggregation
   - Security report analysis
   - Real-time threat feeds

2. **Stablecoin Monitoring Service** (Port 8002)
   - Price monitoring
   - Depeg detection
   - Alert generation

3. **Attack Surface Monitoring** (Port 8000)
   - Protocol vulnerability scanning
   - Risk assessment API
   - Compliance data

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code analysis |
| `npm run type-check` | Run TypeScript type checking |

## 🎨 Features in Detail

### Real-time Data Integration
- **WebSocket connections** for live updates
- **Intelligent caching** with 2-hour persistence
- **Background refresh** without UI disruption
- **Error recovery** with graceful fallbacks

### Professional UI/UX
- **Material Design 3** principles
- **Dark theme** optimized for security operations
- **Responsive design** for desktop and mobile
- **Accessibility compliance** (WCAG 2.1)

### Security Focus
- **Real-time threat intelligence** from multiple sources
- **Compliance dashboard** for regulatory requirements
- **Risk scoring** and alert prioritization
- **Audit trail** and reporting capabilities

## 🔐 Security

- **Environment-based configuration** for sensitive data
- **CSP headers** for XSS protection
- **HTTPS enforcement** in production
- **Input sanitization** for all user inputs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- 📧 **Email**: [your-email@domain.com]
- 📚 **Documentation**: [Link to docs]
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/defi-guard-frontend/issues)

---

**⚡ Built with modern React and TypeScript for professional DeFi security monitoring**

4. **Build for production**
   ```bash
   npm run build
   ```

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Application header with notifications
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── MetricCard.tsx  # Reusable metric display component
├── pages/              # Dashboard pages
│   ├── DashboardOverview.tsx
│   ├── OFACCompliance.tsx
│   ├── DeFiRiskAssessment.tsx
│   ├── MixerDetection.tsx
│   ├── ExploitMonitoring.tsx
│   ├── FraudIntelligence.tsx
│   └── Analytics.tsx
├── data/               # Mock data for demonstrations
│   ├── ofacData.ts
│   ├── defiRiskData.ts
│   ├── mixerData.ts
│   ├── exploitData.ts
│   └── fraudData.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── theme.ts            # MUI custom theme configuration
└── App.tsx             # Main application component
```

### Project Structure
```
defi-guard-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx      # App header with backend status
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── MetricCard.tsx  # Reusable metric display card
│   ├── pages/              # Dashboard pages
│   │   ├── DashboardOverview.tsx        # Main dashboard with backend integration
│   │   ├── AttackSurfaceMonitoring.tsx  # Real-time backend monitoring page
│   │   ├── OFACCompliance.tsx           # OFAC sanctions screening
│   │   ├── DeFiRiskAssessment.tsx       # DeFi protocol risk analysis
│   │   ├── MixerDetection.tsx           # Crypto mixer detection
│   │   ├── ExploitMonitoring.tsx        # Security exploit tracking
│   │   ├── FraudIntelligence.tsx        # Fraud detection & analysis
│   │   └── Analytics.tsx                # Advanced analytics dashboard
│   ├── services/           # API service layer
│   │   └── api.ts         # Backend API integration
│   ├── hooks/              # Custom React hooks
│   │   └── useApiData.ts  # Backend data management hook
│   ├── data/               # Mock data for demo purposes
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── README.md              # Project documentation
```

### Key Features Implemented
✅ **Complete Dashboard Suite**: 8 comprehensive dashboard pages covering all DeFi compliance use cases  
✅ **Live Backend Integration**: Real-time data from Attack Surface Monitoring API  
✅ **Responsive Design**: Mobile-first approach with Material-UI components  
✅ **Type Safety**: Full TypeScript implementation with proper interfaces  
✅ **Modern Build System**: Vite for fast development and optimized production builds  
✅ **Real-time Updates**: Auto-refreshing backend data every 30 seconds  
✅ **Error Handling**: Graceful fallback when backend is unavailable  
✅ **Status Monitoring**: Live backend status in header and dashboard  

## 🎨 Design System

### Theme
- **Primary Color**: Blue (#1976d2) for main actions and navigation
- **Background**: Dark theme optimized for financial dashboards
- **Risk Colors**: 
  - Low Risk: Green (#4caf50)
  - Medium Risk: Orange (#ff9800)  
  - High Risk: Red (#f44336)
  - Critical: Purple (#9c27b0)

### Components
- **MetricCard**: Standardized metric display with trend indicators
- **Charts**: Consistent styling across all data visualizations
- **Tables**: Enhanced Material-UI tables with custom styling
- **Navigation**: Persistent sidebar with collapsible sections

## 📊 Dashboard Features

### Dashboard Overview
- Key performance indicators
- Transaction volume trends
- Risk distribution charts
- Alert summary and recent activities

### OFAC Compliance
- Sanctions screening results
- Flagged addresses and entities
- Compliance score tracking
- Geographic risk distribution

### DeFi Protocol Risk Assessment
- Protocol security scores
- Total Value Locked (TVL) analysis
- Vulnerability assessments
- Smart contract risk metrics

### Mixer Detection
- Privacy coin transaction analysis
- Mixing pattern identification
- Volume tracking and suspicious activity alerts
- Transaction flow visualization

### Exploit Monitoring
- Real-time vulnerability tracking
- Exploit pattern analysis
- Security incident timeline
- Risk severity classifications

### Fraud Intelligence
- Scam detection algorithms
- User risk profiling
- Suspicious activity patterns
- Fraud prevention metrics

### Analytics
- Comprehensive compliance metrics
- Risk trend analysis
- Alert resolution statistics
- Performance benchmarking

## 🎯 Project Status: COMPLETED ✅

### ✅ Successfully Implemented
- **✅ Frontend Dashboard**: Complete React TypeScript application with 7 dashboard pages
- **✅ Backend Integration**: Live connection to Attack Surface Monitoring API (localhost:8000)
- **✅ Real-time Data**: Live metrics, system health, and protocol monitoring
- **✅ Error-free Build**: All TypeScript compilation issues resolved
- **✅ Production Ready**: Optimized build with 946KB bundle (gzipped: 272KB)

### 🔗 Live Backend Connection
The dashboard now displays **real-time data** from your Attack Surface Monitoring service:
- **System Status**: Live health monitoring of all components
- **Monitored Protocols**: Real-time count of DeFi protocols under surveillance  
- **Tracked Addresses**: Current number of addresses being monitored
- **Uptime Tracking**: Service uptime and last monitoring cycle timestamps
- **Auto-refresh**: Data updates every 30 seconds automatically

### 📊 Dashboard Pages Connected
1. **Dashboard Overview** - Shows backend connection status and live metrics
2. **Attack Surface Monitoring** - Dedicated page for real-time backend data
3. **OFAC Compliance** - Sanctions screening dashboard (uses mock data)
4. **DeFi Risk Assessment** - Protocol risk analysis (uses mock data)
5. **Mixer Detection** - Privacy technology detection (uses mock data) 
6. **Exploit Monitoring** - Security threat tracking (uses mock data)
7. **Fraud Intelligence** - Scam detection and profiling (uses mock data)

## 🔌 Backend Integration

### Attack Surface Monitoring Service
The frontend is integrated with a live backend service for real-time attack surface monitoring:

- **Backend URL**: `http://localhost:8000/`
- **Service**: DeFi Guard - Attack Surface Monitoring API
- **Real-time Data**: System health, monitored protocols, tracked addresses

### Available API Endpoints
- `GET /health` - System health status
- `GET /stats` - System statistics and metrics  
- `GET /protocols/monitored` - List of monitored DeFi protocols
- `GET /alerts/recent` - Recent security alerts
- `GET /threats/intel` - Threat intelligence data
- `GET /addresses/tracked` - Tracked addresses

### Frontend Integration Features
- **Real-time Status**: Live backend connection status in dashboard
- **Auto-refresh**: Automatic data refresh every 30 seconds
- **Error Handling**: Graceful fallback when backend is unavailable
- **Type Safety**: Full TypeScript interfaces for all API responses

### Usage
1. Start the backend service on `http://localhost:8000/`
2. Launch the frontend dashboard
3. Navigate to "Attack Surface Monitoring" for live backend data
