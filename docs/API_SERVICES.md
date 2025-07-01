# API Services Documentation

## Overview

Complete reference for all backend API integrations in the DeFi Guard frontend.

## Service Configuration

### Environment Variables
```typescript
// Backend service URLs
const THREAT_INTEL_API_URL = import.meta.env.VITE_THREAT_INTEL_API_URL || 'http://localhost:8000';
const STABLECOIN_MONITOR_API_URL = import.meta.env.VITE_STABLECOIN_MONITOR_API_URL || 'http://localhost:8001';
const SANCTION_DETECTOR_API_URL = import.meta.env.VITE_SANCTION_DETECTOR_API_URL || 'http://localhost:3000';
```

### Docker Environment Setup
```yaml
# In docker-compose.yml
environment:
  - REACT_APP_THREAT_INTEL_API_URL=http://localhost:8000
  - REACT_APP_STABLECOIN_MONITOR_API_URL=http://localhost:8001
  - REACT_APP_SANCTION_DETECTOR_API_URL=http://localhost:3000
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

## API Service Class Implementation

### Core API Service Methods

```typescript
class ApiService {
  // Generic fetch method with error handling
  private async fetchApi<T>(endpoint: string, baseUrl?: string): Promise<T>
  
  // Sanction Detector methods
  async screenAddress(address: string, includeTransactionAnalysis?: boolean, maxHops?: number): Promise<AddressScreeningResult>
  async screenTransaction(request: TransactionScreeningRequest): Promise<TransactionScreeningResult>
  async bulkScreening(request: BulkScreeningRequest): Promise<BulkScreeningResponse>
  async getSanctionDetectorHealth(): Promise<SanctionDetectorHealth>
  
  // Threat Intelligence methods
  async getThreatIntelNews(limit?: number, forceFresh?: boolean): Promise<ThreatIntelResponse>
  async getThreatIntelHealth(): Promise<{ status: string; last_updated: string }>
  
  // Stablecoin Monitor methods
  async getStablecoinData(): Promise<StablecoinResponse>
  async getStablecoinAlerts(): Promise<StablecoinAlert[]>
  async getStablecoinHealth(): Promise<{ status: string; last_updated: string }>
}

export const apiService = new ApiService();
```

## Error Handling Patterns

### Standard Error Response
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  correlationId: string;
}
```

### Frontend Error Handling
```typescript
try {
  const result = await apiService.screenAddress(address);
  // Handle success
} catch (error) {
  // Error is already logged by apiService
  setError(String(error));
}
```

## Request/Response Logging

All API calls include comprehensive logging:

```typescript
// Request logging
console.log(`[API] Screening address: ${url}`);

// Response logging
console.log(`[API] Address screening response:`, result);

// Error logging
console.error('[API] Error screening address:', error);
```

## Rate Limiting & Constraints

### Bulk Screening Limits
- **Addresses:** Maximum 100 per batch
- **Transactions:** Maximum 50 per batch
- **Processing:** Sequential processing to avoid rate limits

### API Timeouts
- Default timeout: 30 seconds per request
- Bulk operations: Extended timeout for large batches
- Health checks: 5 second timeout

## Testing API Endpoints

### Manual Testing Commands
```bash
# Sanction Detector Health
curl -s "http://localhost:3000/api/health" | jq .

# Address Screening
curl -s -X POST "http://localhost:3000/api/screening/address" \
  -H "Content-Type: application/json" \
  -d '{"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}' | jq .

# Threat Intel
curl -s "http://localhost:8000/api/v1/threat-intel?limit=5" | jq .

# Stablecoin Monitor
curl -s "http://localhost:8001/metrics/current" | jq .
```

### Integration Testing
```typescript
// Example integration test
describe('API Service Integration', () => {
  it('should screen address successfully', async () => {
    const result = await apiService.screenAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
    expect(result.address).toBe('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
    expect(result.riskLevel).toBeOneOf(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
  });
});
```

## Performance Optimization

### Caching Strategy
- Client-side caching for static data
- Response transformation caching
- Health check result caching (5 minutes)

### Parallel Requests
```typescript
// Multiple health checks in parallel
const [threatHealth, stablecoinHealth, sanctionHealth] = await Promise.allSettled([
  apiService.getThreatIntelHealth(),
  apiService.getStablecoinHealth(),
  apiService.getSanctionDetectorHealth()
]);
```

### Error Recovery
- Automatic retry for network errors
- Fallback data for non-critical services
- Graceful degradation when services are unavailable
