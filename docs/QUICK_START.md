# Quick Start Guide

## ⚡ Fastest Way to Get DeFi Guard Running

### Prerequisites
- Docker & Docker Compose installed
- Git (for cloning repositories)
- Node.js 18+ (for local development)

### 🚀 1-Minute Setup (Docker)

**Option 1: Using the Management Script (Recommended)**
```bash
# Clone the repository
git clone https://github.com/your-org/defi-guard-frontend.git
cd defi-guard-frontend

# Use the interactive management script
./defi-guard-manager.sh
# Then select option 1 to start all services
```

**Option 2: Manual Docker Compose**
```bash
# Clone and start all services
git clone https://github.com/your-org/defi-guard-frontend.git
cd defi-guard-frontend
docker-compose up -d

# Wait for services to start (2-3 minutes)
# Check when ready:
curl http://localhost:3002  # Frontend should return HTML
```

### 🔍 Service Status Check

**Using the Management Script (Recommended)**
```bash
# Interactive health check and status
./defi-guard-manager.sh
# Then select option 2 for health check or option 3 for status
```

**Manual Commands**
```bash
# Check all services
docker-compose ps

# Expected output:
# defi-guard-frontend      Up (healthy)    0.0.0.0:3002->80/tcp
# sanction-detector        Up (healthy)    0.0.0.0:3000->3000/tcp
# threat-intel             Up (healthy)    0.0.0.0:8000->8000/tcp
# stablecoin-monitor       Up (healthy)    0.0.0.0:8001->8000/tcp
```

### 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3002 | Main application UI |
| **Sanction Detector** | http://localhost:3000/api/health | Address screening API |
| **Threat Intel** | http://localhost:8000/ | Threat intelligence API |
| **Stablecoin Monitor** | http://localhost:8001/ | Stablecoin monitoring API |

### 🧪 Quick Test

```bash
# Test address screening
curl -X POST http://localhost:3000/api/screening/address \
  -H "Content-Type: application/json" \
  -d '{"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}'

# Expected: {"success": true, "data": {...}}
```

## 🛠️ Development Setup

### Frontend Development Server

```bash
# Install dependencies
npm install

# Start development server (without Docker)
npm run dev

# Access at http://localhost:5173
```

### Environment Variables

Create `.env.local` for local development:

```bash
# Frontend environment
VITE_THREAT_INTEL_API_URL=http://localhost:8000
VITE_STABLECOIN_MONITOR_API_URL=http://localhost:8001  
VITE_SANCTION_DETECTOR_API_URL=http://localhost:3000
```

### Backend Services Only

```bash
# Start only backend services
docker-compose up threat-intel stablecoin-monitor sanction-detector -d

# Then run frontend locally
npm run dev
```

## 📋 Available Scripts

```bash
# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run type-check   # TypeScript check

# Docker
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs [service]     # View service logs
docker-compose restart [service]  # Restart specific service
```

## 🔧 Common Commands

### Health Checks
```bash
# All services health check
curl http://localhost:3000/api/health | jq .status
curl http://localhost:8000/ | jq .status  
curl http://localhost:8001/ | jq .message
```

### View Logs
```bash
# Frontend logs
docker-compose logs defi-guard-frontend

# Backend service logs
docker-compose logs sanction-detector
docker-compose logs threat-intel
docker-compose logs stablecoin-monitor
```

### Database & Data
```bash
# Check threat intel data
curl "http://localhost:8000/api/v1/threat-intel?limit=5" | jq .count

# Check stablecoin data
curl "http://localhost:8001/metrics/current" | jq length
```

## 🐛 Troubleshooting Quick Fixes

### Services Won't Start
```bash
# Clean restart
docker-compose down --volumes
docker-compose up -d --build
```

### Port Conflicts
```bash
# Check what's using ports
lsof -i :3000,3002,8000,8001

# Kill processes if needed
sudo lsof -ti:3000 | xargs kill -9
```

### Frontend Not Loading
```bash
# Check if frontend container is running
docker-compose logs defi-guard-frontend

# Rebuild frontend
docker-compose up defi-guard-frontend --build
```

### API Errors
```bash
# Check backend service logs
docker-compose logs sanction-detector | tail -20

# Test individual services
curl http://localhost:3000/api/health
curl http://localhost:8000/
curl http://localhost:8001/
```

## 📊 Testing the Interface

### 1. Address Screening
- Navigate to http://localhost:3002/#/address-screening
- Enter: `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa` (Genesis address)
- Click "Screen Address"
- Should show LOW risk result

### 2. Transaction Screening  
- Switch to "Transaction Screening" tab
- Enter a valid Bitcoin transaction hash
- Select direction: "Both"
- Click "Screen Transaction"

### 3. Bulk Screening
- Switch to "Bulk Screening" tab
- Enter multiple addresses (one per line):
  ```
  1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
  1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2
  ```
- Click "Screen Bulk"

### 4. Dashboard Overview
- Visit http://localhost:3002/
- Check service health indicators
- View threat intelligence cards
- Monitor stablecoin status

## 🔄 Update & Rebuild

### Pull Latest Changes
```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Update Individual Service
```bash
# Update just frontend
docker-compose up defi-guard-frontend --build

# Update backend service
docker-compose up sanction-detector --build
```

## 📱 Mobile Testing

```bash
# Find your local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Access from mobile (replace with your IP)
http://192.168.1.100:3002
```

## 🚦 Production Deployment

### Build for Production
```bash
npm run build
docker build -t defi-guard-frontend:latest .
```

### Environment Variables for Production
```bash
# Set production URLs
VITE_THREAT_INTEL_API_URL=https://threat-intel.yourdomain.com
VITE_STABLECOIN_MONITOR_API_URL=https://stablecoin.yourdomain.com  
VITE_SANCTION_DETECTOR_API_URL=https://sanction.yourdomain.com
```

## 📚 Next Steps

After getting the system running:

1. **Explore the Interface** - Try all screening features
2. **Review Documentation** - Check [Architecture](./ARCHITECTURE.md) for deeper understanding
3. **API Integration** - See [API Services](./API_SERVICES.md) for development
4. **Customization** - Check [Configuration](./CONFIGURATION.md) for settings
5. **Troubleshooting** - Refer to [Troubleshooting](./TROUBLESHOOTING.md) if issues arise

## 🆘 Need Help?

### Check Logs First
```bash
docker-compose logs --tail=50
```

### Common Issues
- **Port already in use**: Stop conflicting services or change ports in docker-compose.yml
- **Container won't start**: Check Docker daemon is running
- **API not responding**: Wait for health checks to pass (can take 2-3 minutes)
- **Frontend shows errors**: Check if backend services are healthy

### Documentation Links
- [Full Architecture](./ARCHITECTURE.md)
- [API Reference](./API_SERVICES.md)  
- [Component Guide](./FRONTEND_COMPONENTS.md)
- [Data Models](./DATA_MODELS.md)
- [Docker Setup](./DOCKER_SETUP.md)
