# Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 🐳 Docker Issues

#### Services Won't Start

**Problem:** Containers fail to start or show unhealthy status
```bash
docker-compose ps
# Shows services as "Exited" or "unhealthy"
```

**Solutions:**
```bash
# 1. Clean restart with rebuild
docker-compose down --volumes --remove-orphans
docker-compose up -d --build

# 2. Check logs for specific errors
docker-compose logs sanction-detector
docker-compose logs threat-intel
docker-compose logs stablecoin-monitor

# 3. Check available resources
docker system df
docker system prune  # If low on space

# 4. Verify ports aren't in use
lsof -i :3000,3002,8000,8001
```

#### Port Conflicts

**Problem:** "Port already in use" errors
```
Error: bind: address already in use
```

**Solutions:**
```bash
# 1. Find processes using ports
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:3002 | xargs kill -9
sudo lsof -ti:8000 | xargs kill -9
sudo lsof -ti:8001 | xargs kill -9

# 2. Change ports in docker-compose.yml
services:
  defi-guard-frontend:
    ports:
      - "3003:80"  # Change from 3002 to 3003

# 3. Use different port ranges
ports:
  - "4000:3000"  # Sanction detector
  - "4001:80"    # Frontend
  - "4002:8000"  # Threat intel
  - "4003:8000"  # Stablecoin monitor
```

#### Memory/Resource Issues

**Problem:** Containers restart frequently or fail to respond
```bash
# Check resource usage
docker stats

# Check container logs for OOM errors
docker-compose logs | grep -i "killed\|memory\|oom"
```

**Solutions:**
```bash
# 1. Increase Docker memory allocation (Docker Desktop)
# Go to Docker Desktop > Settings > Resources > Memory

# 2. Add memory limits to docker-compose.yml
services:
  sanction-detector:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

# 3. Clean up unused containers/images
docker system prune -a
```

### 🌐 Frontend Issues

#### White Screen/App Won't Load

**Problem:** Frontend shows blank page or loading screen
```bash
# Check frontend logs
docker-compose logs defi-guard-frontend
```

**Common Causes & Solutions:**

1. **Build Errors:**
```bash
# Rebuild frontend
docker-compose up defi-guard-frontend --build

# Check for TypeScript errors
npm run type-check
```

2. **Environment Variables Missing:**
```bash
# Verify env vars in container
docker-compose exec defi-guard-frontend env | grep REACT_APP

# Add missing variables to docker-compose.yml
environment:
  - REACT_APP_THREAT_INTEL_API_URL=http://localhost:8000
  - REACT_APP_STABLECOIN_MONITOR_API_URL=http://localhost:8001
  - REACT_APP_SANCTION_DETECTOR_API_URL=http://localhost:3000
```

3. **API Connection Issues:**
```bash
# Test API connectivity from browser console
fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(console.log)
```

#### API Requests Failing

**Problem:** Network errors in browser console
```
Failed to fetch
CORS error
ERR_CONNECTION_REFUSED
```

**Solutions:**

1. **CORS Issues:**
```javascript
// Check browser console for CORS errors
// Solution: Ensure proper CORS headers on backend

// Temporary workaround - disable CORS in Chrome (development only)
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```

2. **Backend Service Down:**
```bash
# Check if services are responding
curl http://localhost:3000/api/health
curl http://localhost:8000/
curl http://localhost:8001/

# Restart specific service
docker-compose restart sanction-detector
```

3. **Wrong API URLs:**
```bash
# Check environment variables in browser
// In browser console:
console.log({
  threatIntel: import.meta.env.VITE_THREAT_INTEL_API_URL,
  stablecoin: import.meta.env.VITE_STABLECOIN_MONITOR_API_URL,
  sanction: import.meta.env.VITE_SANCTION_DETECTOR_API_URL
});
```

### 🛡️ Sanction Detector Issues

#### Address Screening Fails

**Problem:** Address screening returns errors
```json
{
  "success": false,
  "error": {
    "code": "EXTERNAL_API_ERROR",
    "message": "Failed to fetch transaction"
  }
}
```

**Solutions:**

1. **Invalid Address Format:**
```bash
# Test with valid Bitcoin addresses
# Valid examples:
# Legacy: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
# SegWit: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
# Testnet: tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx

# Test API directly
curl -X POST http://localhost:3000/api/screening/address \
  -H "Content-Type: application/json" \
  -d '{"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}'
```

2. **Blockchain API Issues:**
```bash
# Check sanction detector logs
docker-compose logs sanction-detector | grep -i error

# Common issues:
# - Rate limiting from blockchain APIs
# - Network connectivity issues
# - API key requirements (if applicable)
```

3. **Service Configuration:**
```bash
# Check service health
curl http://localhost:3000/api/health | jq .

# Restart service
docker-compose restart sanction-detector

# Check data directories
docker-compose exec sanction-detector ls -la /app/data/
```

#### Transaction Screening Fails

**Problem:** Transaction screening returns 404 or invalid data
```json
{
  "error": {
    "code": "EXTERNAL_API_ERROR",
    "message": "Failed to fetch transaction: Request failed with status code 404"
  }
}
```

**Solutions:**

1. **Invalid Transaction Hash:**
```bash
# Ensure transaction hash is 64 hex characters
# Valid format: [a-fA-F0-9]{64}

# Test with real Bitcoin transaction
# Example: 4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b
```

2. **Transaction Not Found:**
```bash
# Transaction might not exist or be too recent
# Try with older, confirmed transactions
# Check on blockchain explorer first: https://mempool.space/tx/TXHASH
```

### 🕵️ Threat Intelligence Issues

#### No Threat Data Loading

**Problem:** Threat intelligence shows empty or loading state
```bash
# Check service logs
docker-compose logs threat-intel
```

**Solutions:**

1. **Service Startup Issues:**
```bash
# Service might be slow to start (initial data collection)
# Wait 2-3 minutes after container starts

# Check service status
curl http://localhost:8000/
```

2. **Database Issues:**
```bash
# Check if database is initialized
docker-compose exec threat-intel ls -la /app/data/

# Restart service to reinitialize
docker-compose restart threat-intel
```

3. **Network/Scraping Issues:**
```bash
# Check logs for scraping errors
docker-compose logs threat-intel | grep -i "error\|fail"

# Common causes:
# - External website blocking requests
# - Rate limiting
# - Network connectivity issues
```

#### API Rate Limiting

**Problem:** Threat intelligence service getting rate limited
```bash
# Look for rate limiting errors in logs
docker-compose logs threat-intel | grep -i "rate\|limit\|429"
```

**Solutions:**
```bash
# Increase scraper delay in environment
environment:
  - SCRAPER_DELAY=5  # Increase from 2 to 5 seconds
  - MAX_CONCURRENT_REQUESTS=3  # Decrease from 5 to 3

# Restart service
docker-compose restart threat-intel
```

### 💰 Stablecoin Monitor Issues

#### No Stablecoin Data

**Problem:** Stablecoin monitoring shows no data or errors
```bash
# Check service logs
docker-compose logs stablecoin-monitor
```

**Solutions:**

1. **API Connection Issues:**
```bash
# Test API endpoints
curl http://localhost:8001/metrics/current
curl http://localhost:8001/alerts/active

# Check service health
curl http://localhost:8001/
```

2. **Data Source Issues:**
```bash
# Check logs for external API errors
docker-compose logs stablecoin-monitor | grep -i "error\|fail"

# Common issues:
# - CoinGecko/price API rate limiting
# - Network connectivity
# - API key issues (if required)
```

3. **Service Configuration:**
```bash
# Restart service
docker-compose restart stablecoin-monitor

# Check data persistence
docker-compose exec stablecoin-monitor ls -la /app/data/
```

### 🔧 Development Issues

#### npm/Node.js Issues

**Problem:** Frontend development server won't start
```bash
npm run dev
# Error: Module not found, dependency issues, etc.
```

**Solutions:**
```bash
# 1. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Clear npm cache
npm cache clean --force

# 3. Check Node.js version
node --version  # Should be 18+
nvm use 18      # If using nvm

# 4. Check for conflicting global packages
npm list -g --depth=0
```

#### TypeScript Errors

**Problem:** TypeScript compilation errors
```bash
npm run type-check
# Shows TypeScript errors
```

**Solutions:**
```bash
# 1. Fix common issues
# - Missing type imports
# - Incorrect interface usage
# - Environment variable typing

# 2. Check TypeScript configuration
cat tsconfig.json

# 3. Update dependencies
npm update
npm audit fix

# 4. Regenerate types if needed
npm run build  # This will show type errors
```

#### Build Issues

**Problem:** Production build fails
```bash
npm run build
# Build errors, out of memory, etc.
```

**Solutions:**
```bash
# 1. Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# 2. Check for large dependencies
npm run build -- --bundleAnalyzer

# 3. Clear build cache
rm -rf dist .vite
npm run build

# 4. Update Vite and dependencies
npm update vite @vitejs/plugin-react
```

### 🔍 Debugging Techniques

#### Enable Debug Mode

```bash
# Frontend debug mode
VITE_ENABLE_DEBUG_MODE=true npm run dev

# Backend service logs
docker-compose logs -f sanction-detector
docker-compose logs -f threat-intel
docker-compose logs -f stablecoin-monitor
```

#### Browser DevTools

```javascript
// Check environment variables
console.log('Environment:', import.meta.env);

// Check API connectivity
fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Check local storage
console.log('Local Storage:', localStorage);

// Monitor network requests
// Go to DevTools > Network tab and monitor API calls
```

#### API Testing with curl

```bash
# Test all API endpoints
echo "Testing Sanction Detector..."
curl -s http://localhost:3000/api/health | jq .status

echo "Testing Threat Intel..."
curl -s http://localhost:8000/ | jq .status

echo "Testing Stablecoin Monitor..."
curl -s http://localhost:8001/ | jq .message

# Test address screening
curl -X POST http://localhost:3000/api/screening/address \
  -H "Content-Type: application/json" \
  -d '{"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}' | jq .
```

### 📊 Performance Issues

#### Slow API Responses

**Problem:** API calls taking too long to respond

**Solutions:**
```bash
# 1. Check container resource usage
docker stats

# 2. Monitor API response times
time curl http://localhost:3000/api/health

# 3. Check for memory leaks
docker-compose logs | grep -i "memory\|leak"

# 4. Restart slow services
docker-compose restart sanction-detector
```

#### High Memory Usage

**Problem:** Containers using excessive memory

**Solutions:**
```bash
# 1. Check memory usage
docker stats --no-stream

# 2. Add memory limits
# In docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 512M

# 3. Optimize service configuration
# Reduce concurrent requests, cache sizes, etc.
```

### 🆘 Emergency Recovery

#### Complete System Reset

```bash
# Nuclear option - reset everything
docker-compose down --volumes --remove-orphans
docker system prune -a --volumes
rm -rf node_modules package-lock.json
npm install
docker-compose up -d --build
```

#### Backup Important Data

```bash
# Backup container data before reset
docker cp $(docker-compose ps -q threat-intel):/app/data ./backup-threat-intel-data
docker cp $(docker-compose ps -q stablecoin-monitor):/app/data ./backup-stablecoin-data
```

### 📞 Getting Help

#### Collecting Debug Information

```bash
# Create debug report
echo "=== System Information ===" > debug-report.txt
date >> debug-report.txt
docker --version >> debug-report.txt
docker-compose --version >> debug-report.txt

echo "=== Service Status ===" >> debug-report.txt
docker-compose ps >> debug-report.txt

echo "=== Service Logs ===" >> debug-report.txt
docker-compose logs --tail=50 >> debug-report.txt

echo "=== Resource Usage ===" >> debug-report.txt
docker stats --no-stream >> debug-report.txt

echo "=== Port Usage ===" >> debug-report.txt
lsof -i :3000,3002,8000,8001 >> debug-report.txt
```

#### Quick Health Check Script

```bash
#!/bin/bash
# health-check.sh
echo "🔍 DeFi Guard Health Check"
echo "=========================="

services=("3000:Sanction Detector" "8000:Threat Intel" "8001:Stablecoin Monitor" "3002:Frontend")

for service in "${services[@]}"; do
  port=$(echo $service | cut -d: -f1)
  name=$(echo $service | cut -d: -f2)
  
  if curl -s --max-time 5 http://localhost:$port > /dev/null; then
    echo "✅ $name (port $port) - OK"
  else
    echo "❌ $name (port $port) - ERROR"
  fi
done

echo "=========================="
echo "Run 'docker-compose ps' for detailed status"
```
