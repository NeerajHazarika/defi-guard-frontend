# Security Dashboard Documentation

## Overview

The Security Dashboard is a comprehensive overview page that aggregates key metrics and activities from all DeFi Guard services into a single, organized interface.

## Features

### 🔍 **Service Health Monitoring**
- Real-time status of all backend services
- Visual health indicators (healthy/warning/error)
- Service availability tracking

### 📊 **Key Metrics Overview**
- **Total Alerts**: Active alerts across all services
- **Addresses Monitored**: Total addresses under sanctions screening
- **Stablecoin Status**: Number of monitored stablecoins and depegged tokens
- **Market Cap**: Total market capitalization of monitored stablecoins

### 🛡️ **Security Overview Section**
- Risk level distribution (Critical, High, Medium, Low)
- Real-time security status across all monitored assets

### ⚖️ **Sanctions & Compliance Section**
- Daily address screening statistics
- OFAC sanctions matches
- Transaction screening counts
- High-risk addresses identified

### 🚨 **Threat Intelligence Section**
- New threats detected
- Security exploit events
- Security incidents tracked
- Affected protocols count

### 📈 **DeFi Risk Assessment Section**
- Protocols analyzed
- High-risk protocol identification
- Average risk scores
- Recent audit activity

### 📋 **Recent Activity Feed**
- Real-time activity stream from all services
- Alert prioritization by severity
- Source service identification
- Timestamp tracking

## Data Sources

The dashboard aggregates data from:

1. **Stablecoin Monitor Service** (Port 8001)
   - Stablecoin metrics and alerts
   - Depeg detection data
   - Market capitalization data

2. **Threat Intelligence Service** (Port 8000)
   - Security threats and exploits
   - News and intelligence feeds
   - Risk classifications

3. **Sanctions Detector Service** (Port 3000)
   - Address screening results
   - OFAC compliance data
   - Transaction analysis

4. **Scam Detector Service** (Port 3001)
   - Scam address detection
   - Risk assessment data

5. **DeFi Risk Assessment Service** (Port 3003)
   - Protocol risk analysis
   - Security audit information

## Auto-Refresh

- Dashboard automatically refreshes every 30 seconds
- Real-time updates for critical alerts
- Visual loading indicators during refresh

## Navigation

- Accessible via root path (`/`) or `/dashboard`
- Listed as "Security Dashboard" in the sidebar
- Set as the default home page

## Technical Implementation

- **Framework**: React with TypeScript
- **UI Library**: Material-UI
- **State Management**: React hooks
- **API Integration**: Centralized apiService
- **Error Handling**: Graceful fallbacks for service unavailability
- **Performance**: Optimized with Promise.allSettled for parallel API calls

## Configuration

The dashboard requires the following environment variables:

```bash
VITE_SANCTION_DETECTOR_API_URL=http://localhost:3000
VITE_SCAM_DETECTOR_API_URL=http://localhost:3001
VITE_DEFI_RISK_API_URL=http://localhost:3003
VITE_THREAT_INTEL_API_URL=http://localhost:8000
VITE_STABLECOIN_MONITOR_API_URL=http://localhost:8001
VITE_STABLECOIN_OSINT_API_URL=http://localhost:8080
```

## Future Enhancements

Planned improvements:
- Historical trend charts
- Configurable refresh intervals
- Custom metric widgets
- Export functionality
- Advanced filtering options
- Real-time WebSocket updates
