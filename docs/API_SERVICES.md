# API Services Documentation

## Overview

Complete reference for all backend API integrations in the DeFi Guard frontend platform.

## Service Architecture

The platform consists of six services communicating via REST APIs:

| Service | Port | Technology | Purpose |
|---------|------|------------|---------|
| Frontend | 3002 | React/TS/Nginx | User Interface |
| Sanction Detector | 3000 | Node.js/TypeScript | Bitcoin OFAC screening |
| Scam Detector | 3001 | Node.js | Multi-blockchain scam detection |
| DeFi Risk Assessment | 3003 | Node.js/TypeScript | Protocol security analysis |
| Threat Intelligence | 8000 | Python/FastAPI | OSINT threat monitoring |
| Stablecoin Monitor | 8001 | Python/FastAPI | Depeg detection & alerts |

## Service Configuration

### Environment Variables
```typescript
// Backend service URLs
const THREAT_INTEL_API_URL = import.meta.env.VITE_THREAT_INTEL_API_URL || 'http://localhost:8000';
const STABLECOIN_MONITOR_API_URL = import.meta.env.VITE_STABLECOIN_MONITOR_API_URL || 'http://localhost:8001';
const SANCTION_DETECTOR_API_URL = import.meta.env.VITE_SANCTION_DETECTOR_API_URL || 'http://localhost:3000';
const SCAM_DETECTOR_API_URL = import.meta.env.VITE_SCAM_DETECTOR_API_URL || 'http://localhost:3001';
const DEFI_RISK_API_URL = import.meta.env.VITE_DEFI_RISK_API_URL || 'http://localhost:3003';
```

### Docker Environment Setup
```yaml
# In docker-compose.yml
environment:
  - REACT_APP_THREAT_INTEL_API_URL=http://localhost:8000
  - REACT_APP_STABLECOIN_MONITOR_API_URL=http://localhost:8001
  - REACT_APP_SANCTION_DETECTOR_API_URL=http://localhost:3000
  - REACT_APP_SCAM_DETECTOR_API_URL=http://localhost:3001
  - REACT_APP_DEFI_RISK_API_URL=http://localhost:3003
```

## 🛡️ Sanction Detector Service API

### Base URL: `http://localhost:3000`

#### Health Check
```typescript
GET /api/health
// Response
{
  success: true,
  data: {
    status: "healthy",
    timestamp: "2025-07-01T07:52:49.074Z",
    uptime: 184.111637333,
    version: "1.0.0",
    environment: "production",
    services: {
      dataDirectories: {
        sanctionsDir: true,
        riskAssessmentsDir: true,
        auditLogsDir: true,
        configDir: true
      }
    }
  }
}
```

#### Address Screening
```typescript
POST /api/screening/address
// Request
{
  address: string,
  includeTransactionAnalysis?: boolean,
  maxHops?: number
}

// Response
{
  success: true,
  data: {
    address: string,
    riskScore: number,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    sanctionMatches: SanctionMatch[],
    timestamp: string,
    confidence: number,
    processingTimeMs: number
  }
}

// Frontend Usage
const result = await apiService.screenAddress(
  '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  false, // includeTransactionAnalysis
  5      // maxHops
);
```

#### Transaction Screening
```typescript
POST /api/screening/transaction
// Request
{
  txHash: string,
  direction?: 'inputs' | 'outputs' | 'both',
  includeMetadata?: boolean
}

// Response
{
  success: true,
  data: {
    txHash: string,
    inputAddresses: TransactionAddress[],
    outputAddresses: TransactionAddress[],
    overallRiskScore: number,
    overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    sanctionMatchesCount: number,
    confidence: number,
    processingTimeMs: number,
    timestamp: string
  }
}

// Frontend Usage
const result = await apiService.screenTransaction({
  txHash: '1234567890abcdef...',
  direction: 'both',
  includeMetadata: true
});
```

#### Bulk Screening
```typescript
POST /api/screening/bulk
// Request
{
  addresses?: string[],
  transactions?: string[],
  batchId?: string,
  includeTransactionAnalysis?: boolean
}

// Response
{
  success: true,
  data: {
    addresses: AddressScreeningResult[],
    transactions: TransactionScreeningResult[],
    summary: {
      totalAddresses: number,
      totalTransactions: number,
      processedAddresses: number,
      processedTransactions: number,
      highRiskItems: number
    }
  }
}

// Frontend Usage
const result = await apiService.bulkScreening({
  addresses: ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'],
  transactions: ['abcdef1234567890...'],
  batchId: 'batch-001'
});
```

## 🔍 Scam Detector Service API

### Base URL: `http://localhost:3001`

#### Health Check
```typescript
GET /
// Response
{
  message: "Scam Detector Service is running",
  status: "healthy",
  timestamp: "2025-07-12T09:00:00.000Z"
}
```

#### Address Risk Assessment
```typescript
POST /api/check-address
// Request
{
  address: string,
  blockchain?: string  // 'bitcoin', 'ethereum', 'bsc', 'polygon', etc.
}

// Response
{
  success: true,
  data: {
    address: string,
    blockchain: string,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    riskScore: number,
    isScam: boolean,
    confidence: number,
    reasons: string[],
    sources: string[],
    lastUpdated: string,
    processingTimeMs: number
  }
}

// Frontend Usage
const result = await fetch('http://localhost:3001/api/check-address', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    address: '0x1234567890abcdef...',
    blockchain: 'ethereum'
  })
});
```

#### Bulk Address Screening
```typescript
POST /api/bulk-check
// Request
{
  addresses: Array<{
    address: string,
    blockchain?: string
  }>,
  batchId?: string
}

// Response
{
  success: true,
  data: {
    batchId: string,
    results: Array<AddressRiskResult>,
    totalProcessed: number,
    processingTimeMs: number
  }
}
```

## 📊 DeFi Risk Assessment Service API

### Base URL: `http://localhost:3003`

#### Health Check
```typescript
GET /
// Response
{
  status: "healthy",
  service: "DeFi Risk Assessment",
  timestamp: "2025-07-12T09:00:00.000Z",
  uptime: 3600
}
```

#### Protocol Risk Assessment
```typescript
POST /api/assess-protocol
// Request
{
  protocolAddress: string,
  blockchain: string,
  includeGovernance?: boolean,
  includeTVL?: boolean
}

// Response
{
  success: true,
  data: {
    protocolAddress: string,
    protocolName: string,
    blockchain: string,
    overallRiskScore: number,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    findings: Array<{
      id: string,
      category: string,
      severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
      title: string,
      description: string,
      impact: string,
      recommendation: string
    }>,
    metrics: {
      tvl: number,
      governanceScore: number,
      codeQualityScore: number,
      auditScore: number
    },
    recommendations: string[],
    lastAssessed: string,
    processingTimeMs: number
  }
}

// Frontend Usage
const result = await fetch('http://localhost:3003/api/assess-protocol', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    protocolAddress: '0xabcdef1234567890...',
    blockchain: 'ethereum',
    includeGovernance: true,
    includeTVL: true
  })
});
```

#### Protocol List
```typescript
GET /api/protocols?blockchain=ethereum&category=lending
// Response
{
  success: true,
  data: {
    protocols: Array<{
      address: string,
      name: string,
      category: string,
      blockchain: string,
      tvl: number,
      lastRiskScore: number,
      lastAssessed: string
    }>,
    total: number
  }
}
```

## 🕵️ Threat Intelligence Service API

### Base URL: `http://localhost:8000`

#### Health Check
```typescript
GET /
// Response
{
  message: "DeFi Guard OSINT API is running",
  status: "healthy"
}
```

#### Threat Intelligence Data
```typescript
GET /api/v1/threat-intel?limit={limit}&fresh_scrape={boolean}
// Response
{
  status: "success",
  count: number,
  total_count: number | null,
  data: ThreatIntelItem[]
}

// Frontend Usage
const response = await apiService.getThreatIntelNews(50, true);
// Returns transformed ThreatIntelResponse with standardized interface
```

#### Transformed Response Interface
```typescript
interface ThreatIntelResponse {
  items: ThreatIntelItem[];
  total: number;
  page: number;
  per_page: number;
}

interface ThreatIntelItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  published_date: string;
  threat_level: number;
  protocols_mentioned: string[];
  classification: {
    exploit_type?: string;
    attack_vector?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}
```

## 💰 Stablecoin Monitor Service API

### Base URL: `http://localhost:8001`

#### Health Check
```typescript
GET /
// Response
{
  message: "Welcome to the Stablecoin Peg Monitor API!",
  docs_url: "/docs",
  redoc_url: "/redoc"
}
```

#### Current Metrics
```typescript
GET /metrics/current
// Response
StablecoinData[]

// Frontend Usage
const data = await apiService.getStablecoinData();
// Returns StablecoinResponse with standardized interface
```

#### Active Alerts
```typescript
GET /alerts/active
// Response
StablecoinAlert[]

// Frontend Usage
const alerts = await apiService.getStablecoinAlerts();
```

#### Transformed Response Interfaces
```typescript
interface StablecoinResponse {
  stablecoins: StablecoinData[];
  alerts: StablecoinAlert[];
  total_monitored: number;
  last_updated: string;
}

interface StablecoinData {
  symbol: string;
  name: string;
  current_price: number;
  target_price: number;
  deviation_percentage: number;
  status: 'stable' | 'depegged' | 'warning';
  last_updated: string;
  market_cap?: number;
  volume_24h?: number;
}

interface StablecoinAlert {
  id: string;
  coin_symbol: string;
  alert_type: 'depeg' | 'recovery' | 'volatility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  price_at_alert: number;
  deviation: number;
  timestamp: string;
}
```

## 🔍 Stablecoin OSINT Service

**Port:** 8080  
**Technology:** Python 3.11, FastAPI, PostgreSQL, Redis  
**Purpose:** Stablecoin regulatory intelligence and geographic monitoring

### Key Features
- Country-specific stablecoin acceptance tracking
- Regulatory status monitoring by region
- News aggregation and sentiment analysis
- Geographic compliance mapping
- Exchange acceptance data
- Real-time regulatory updates

### API Endpoints

#### Countries API
```bash
# Get all countries with regulatory information
GET /api/v1/countries/

# Get country by ISO code
GET /api/v1/countries/code/{country_code}

# Get stablecoins accepted in a country
GET /api/v1/countries/{country_id}/stablecoins

# Get countries by region
GET /api/v1/countries/region/{region_name}

# Get country statistics
GET /api/v1/countries/stats/overview
```

#### Stablecoins API
```bash
# Get all stablecoins with acceptance data
GET /api/v1/stablecoins/

# Get stablecoin by symbol
GET /api/v1/stablecoins/symbol/{symbol}

# Get countries where stablecoin is accepted
GET /api/v1/stablecoins/{stablecoin_id}/countries

# Get stablecoin statistics
GET /api/v1/stablecoins/stats/overview
```

#### News Intelligence API
```bash
# Get regulatory news articles
GET /api/v1/news/articles

# Get fresh news (triggers scraping)
GET /api/v1/news/articles/fresh

# Trigger background news refresh
POST /api/v1/news/refresh

# Get news by category
GET /api/v1/news/articles?category={regulation|audit|security|compliance}
```

#### Search & Query API
```bash
# Basic search across all data
GET /api/v1/search?query={search_term}

# Advanced query with filters
GET /api/v1/query?country_code={code}&stablecoin_symbol={symbol}&is_accepted={true|false}
```

### Data Models

#### Country Model
```typescript
interface Country {
  id: number;
  name: string;
  code: string; // ISO country code
  region: string;
  crypto_friendly: boolean;
  regulatory_status: 'friendly' | 'neutral' | 'hostile' | 'regulated' | 'unclear';
  stablecoins_accepted: string[];
  last_updated: string;
}
```

#### Stablecoin Model
```typescript
interface Stablecoin {
  id: number;
  name: string;
  symbol: string;
  blockchain: string;
  issuer: string;
  market_cap?: number;
  is_active: boolean;
}
```

#### News Article Model
```typescript
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  published_date: string;
  category: 'regulation' | 'audit' | 'security' | 'compliance' | 'market';
  stablecoins_mentioned: string[];
  countries_mentioned: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  impact_score: number; // 1-10
}
```

#### Acceptance Data Model
```typescript
interface StablecoinAcceptance {
  country: Country;
  stablecoin: Stablecoin;
  is_accepted: boolean;
  acceptance_level: 'full' | 'partial' | 'restricted' | 'banned';
  legal_status: string;
  use_cases: string[];
  confidence_score: number; // 0-1
  source_url?: string;
  last_updated: string;
}
```

### Integration Examples

#### Frontend Integration
```typescript
// Fetch country regulations for world map
const countriesResponse = await fetch('http://localhost:8080/api/v1/countries/');
const countries = await countriesResponse.json();

// Get stablecoin news for specific category
const newsResponse = await fetch('http://localhost:8080/api/v1/news/articles?category=regulation&limit=10');
const news = await newsResponse.json();

// Search for USDC acceptance data
const searchResponse = await fetch('http://localhost:8080/api/v1/search?query=USDC&stablecoin_symbol=USDC');
const results = await searchResponse.json();
```

#### Environment Configuration
```bash
# Stablecoin OSINT Service
VITE_STABLECOIN_OSINT_API_URL=http://localhost:8080

# Docker service name (for internal communication)
STABLECOIN_OSINT_SERVICE_URL=http://stablecoin-osint:8080
```

### Service Health
```bash
# Health check endpoint
GET /health

# Service status
GET /api/v1/status
```

### Rate Limits
- **Default:** 100 requests per minute per IP
- **Search endpoints:** 30 requests per minute per IP
- **Fresh data endpoints:** 10 requests per minute per IP (triggers scraping)

### Caching Strategy
- **Cached data:** Served from database (fast)
- **Fresh data:** Triggers real-time scraping (slower)
- **Auto-refresh:** Background scraping every 6 hours
- **Cache TTL:** Country data (24h), News data (1h)
