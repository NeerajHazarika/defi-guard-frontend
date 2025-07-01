# 🚀 DeFi Guard - Documentation Quick Reference

## ⚡ Instant Start
```bash
docker-compose up -d    # Start all services
open http://localhost:3002  # Access frontend
```

## 🔗 Service Endpoints
- **Frontend**: http://localhost:3002
- **Sanction Detector**: http://localhost:3000/api/health
- **Threat Intel**: http://localhost:8000/
- **Stablecoin Monitor**: http://localhost:8001/

## 📚 Documentation Index
- [📋 Quick Start](./docs/QUICK_START.md) - Get running in 1 minute
- [🏗️ Architecture](./docs/ARCHITECTURE.md) - System overview
- [🔧 API Services](./docs/API_SERVICES.md) - Backend integration
- [🧩 Components](./docs/FRONTEND_COMPONENTS.md) - React components
- [📊 Data Models](./docs/DATA_MODELS.md) - TypeScript interfaces
- [⚙️ Configuration](./docs/CONFIGURATION.md) - Settings & env vars
- [🐛 Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues

### Service-Specific Docs
- [🛡️ Sanction Detector](./docs/SANCTION_DETECTOR.md) - Address screening
- [🕵️ Threat Intelligence](./docs/THREAT_INTELLIGENCE.md) - OSINT monitoring
- [💰 Stablecoin Monitor](./docs/STABLECOIN_MONITOR.md) - Depeg detection
- [🔄 Transaction Screening](./docs/TRANSACTION_SCREENING_INTEGRATION.md) - TXID analysis

### Deployment & DevOps
- [🐳 Docker Setup](./docs/DOCKER_SETUP.md) - Container deployment
- [🔧 Fixes Applied](./docs/FIXES_APPLIED.md) - Development history

## 🧪 Quick Tests
```bash
# Test APIs
curl http://localhost:3000/api/health | jq .status
curl http://localhost:8000/ | jq .status  
curl http://localhost:8001/ | jq .message

# Test address screening
curl -X POST http://localhost:3000/api/screening/address \
  -H "Content-Type: application/json" \
  -d '{"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}' | jq .
```

## 🆘 Emergency Commands
```bash
# Reset everything
docker-compose down --volumes && docker-compose up -d --build

# Check logs
docker-compose logs --tail=20

# Service status
docker-compose ps
```

---
**💡 Tip**: All documentation is optimized for quick lookup by AI coding agents and human developers.
