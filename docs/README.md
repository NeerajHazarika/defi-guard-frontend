# DeFi Guard Frontend Documentation

## Quick Reference Index

This documentation is designed for rapid lookup by AI coding agents and human developers to accelerate development.

### 📚 Documentation Structure

| Document | Purpose | For AI Agents | For Humans |
|----------|---------|---------------|------------|
| [🏗️ Architecture Overview](./ARCHITECTURE.md) | System design & service interactions | ✅ Essential | ✅ Essential |
| [🔧 API Services](./API_SERVICES.md) | All backend API integration details | ✅ Critical | ✅ Critical |
| [🛡️ Sanction Detector](./SANCTION_DETECTOR.md) | Address/transaction screening service | ✅ Critical | ✅ Important |
| [🕵️ Threat Intelligence](./THREAT_INTELLIGENCE.md) | OSINT threat monitoring service | ✅ Important | ✅ Important |
| [💰 Stablecoin Monitor](./STABLECOIN_MONITOR.md) | Depeg detection & monitoring service | ✅ Important | ✅ Important |
| [🔄 Transaction Screening](./TRANSACTION_SCREENING_INTEGRATION.md) | TXID screening & multi-hop analysis | ✅ Critical | ✅ Important |
| [🐳 Docker Setup](./DOCKER_SETUP.md) | Container orchestration & deployment | ✅ Important | ✅ Critical |
| [🎨 Frontend Components](./FRONTEND_COMPONENTS.md) | React components & UI patterns | ✅ Critical | ✅ Important |
| [📊 Data Models](./DATA_MODELS.md) | TypeScript interfaces & data structures | ✅ Essential | ✅ Important |
| [🔧 Configuration](./CONFIGURATION.md) | Environment variables & settings | ✅ Important | ✅ Critical |
| [🐛 Troubleshooting](./TROUBLESHOOTING.md) | Common issues & solutions | ✅ Important | ✅ Critical |
| [⚡ Quick Start](./QUICK_START.md) | Fastest way to get running | ✅ Essential | ✅ Essential |

### 🚀 Quick Start Commands

```bash
# Start all services
docker-compose up -d

# Frontend only (development)
npm install && npm run dev

# Check service health
curl http://localhost:3000/api/health  # Sanction Detector
curl http://localhost:8000/            # Threat Intel
curl http://localhost:8001/            # Stablecoin Monitor
curl http://localhost:3002/            # Frontend
```

### 🔗 Service Endpoints

| Service | Port | Health Check | Documentation |
|---------|------|--------------|---------------|
| **Frontend** | 3002 | `GET /` | [Frontend Components](./FRONTEND_COMPONENTS.md) |
| **Sanction Detector** | 3000 | `GET /api/health` | [Sanction Detector](./SANCTION_DETECTOR.md) |
| **Threat Intel** | 8000 | `GET /` | [Threat Intelligence](./THREAT_INTELLIGENCE.md) |
| **Stablecoin Monitor** | 8001 | `GET /` | [Stablecoin Monitor](./STABLECOIN_MONITOR.md) |

### 🎯 AI Agent Quick Lookup

**For Code Generation:**
- [Data Models](./DATA_MODELS.md) - TypeScript interfaces
- [API Services](./API_SERVICES.md) - API integration patterns
- [Frontend Components](./FRONTEND_COMPONENTS.md) - React patterns

**For Debugging:**
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues
- [Configuration](./CONFIGURATION.md) - Environment setup

**For Architecture Understanding:**
- [Architecture Overview](./ARCHITECTURE.md) - System design
- [Docker Setup](./DOCKER_SETUP.md) - Container setup

### 📋 Recent Changes

- ✅ [Transaction Screening Integration](./TRANSACTION_SCREENING_INTEGRATION.md) - TXID screening & multi-hop analysis
- ✅ [Docker Setup Improvements](./DOCKER_SETUP.md) - Multi-service orchestration
- ✅ [API Service Refactoring](./API_SERVICES.md) - Enhanced error handling & type safety

### 🔍 Search Tags

`#sanction-screening` `#transaction-analysis` `#threat-intelligence` `#stablecoin-monitoring` `#docker` `#react` `#typescript` `#api-integration` `#defi-security`
