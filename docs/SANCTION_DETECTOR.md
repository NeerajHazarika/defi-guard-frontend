# Sanction Detector Service Documentation

## Overview

The Sanction Detector is a specialized Bitcoin address and transaction screening service that checks against OFAC sanctions lists and performs risk assessment analysis.

## Service Details

- **Port:** 3000
- **Technology:** Node.js, TypeScript, Express.js
- **Repository:** `sanction-detector` (external dependency)
- **Purpose:** Real-time Bitcoin address and transaction screening for compliance

## Core Features

### 🎯 Address Screening
- Individual Bitcoin address risk assessment
- OFAC sanctions list matching
- Risk score calculation (0-100)
- Confidence scoring
- Multi-hop transaction analysis (optional)

### 🔄 Transaction Screening
- Individual transaction hash analysis
- Input/output address screening
- Multi-directional analysis (inputs, outputs, both)
- Metadata inclusion options
- Overall transaction risk assessment

### 📊 Bulk Operations
- Batch processing of multiple addresses
- Batch processing of multiple transactions
- Combined address + transaction screening
- Processing summary statistics
- Efficient batch optimization

## API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-07-01T07:52:49.074Z",
    "uptime": 184.111637333,
    "version": "1.0.0",
    "environment": "production",
    "services": {
      "dataDirectories": {
        "sanctionsDir": true,
        "riskAssessmentsDir": true,
        "auditLogsDir": true,
        "configDir": true
      }
    }
  }
}
```

### Address Screening
```http
POST /api/screening/address
```

**Request:**
```json
{
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "includeTransactionAnalysis": false,
  "maxHops": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "riskScore": 0,
    "riskLevel": "LOW",
    "sanctionMatches": [],
    "timestamp": "2025-07-01T07:54:12.556Z",
    "confidence": 30,
    "processingTimeMs": 16
  }
}
```

### Transaction Screening
```http
POST /api/screening/transaction
```

**Request:**
```json
{
  "txHash": "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  "direction": "both",
  "includeMetadata": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txHash": "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "inputAddresses": [
      {
        "address": "1Input1...",
        "riskScore": 25,
        "riskLevel": "LOW",
        "sanctionMatches": []
      }
    ],
    "outputAddresses": [
      {
        "address": "1Output1...",
        "riskScore": 75,
        "riskLevel": "HIGH",
        "sanctionMatches": [
          {
            "listSource": "OFAC",
            "entityName": "Sanctioned Entity",
            "entityId": "ENTITY-123",
            "matchType": "DIRECT",
            "confidence": 95,
            "matchedAddress": "1Output1..."
          }
        ]
      }
    ],
    "overallRiskScore": 50,
    "overallRiskLevel": "MEDIUM",
    "sanctionMatchesCount": 1,
    "confidence": 85,
    "processingTimeMs": 245,
    "timestamp": "2025-07-01T08:00:00.000Z"
  }
}
```

### Bulk Screening
```http
POST /api/screening/bulk
```

**Request:**
```json
{
  "addresses": [
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"
  ],
  "transactions": [
    "tx1234567890abcdef...",
    "txabcdef1234567890..."
  ],
  "batchId": "batch-001",
  "includeTransactionAnalysis": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        "riskScore": 0,
        "riskLevel": "LOW",
        "sanctionMatches": [],
        "timestamp": "2025-07-01T07:54:21.041Z",
        "confidence": 30,
        "processingTimeMs": 1
      }
    ],
    "transactions": [
      {
        "txHash": "tx1234567890abcdef...",
        "inputAddresses": [],
        "outputAddresses": [],
        "overallRiskScore": 15,
        "overallRiskLevel": "LOW",
        "sanctionMatchesCount": 0,
        "confidence": 60,
        "processingTimeMs": 125,
        "timestamp": "2025-07-01T08:00:00.000Z"
      }
    ],
    "summary": {
      "totalAddresses": 2,
      "totalTransactions": 2,
      "processedAddresses": 2,
      "processedTransactions": 2,
      "highRiskItems": 0
    }
  }
}
```

## Data Models

### TypeScript Interfaces

```typescript
// Core screening result
interface AddressScreeningResult {
  address: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sanctionMatches: SanctionMatch[];
  timestamp: string;
  confidence: number;
  processingTimeMs: number;
}

// Sanction match details
interface SanctionMatch {
  listSource: string;
  entityName: string;
  entityId: string;
  matchType: 'DIRECT' | 'INDIRECT' | 'CLUSTER';
  confidence: number;
  matchedAddress: string;
}

// Transaction screening
interface TransactionScreeningResult {
  txHash: string;
  inputAddresses: TransactionAddress[];
  outputAddresses: TransactionAddress[];
  overallRiskScore: number;
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sanctionMatchesCount: number;
  confidence: number;
  processingTimeMs: number;
  timestamp: string;
}

// Transaction address details
interface TransactionAddress {
  address: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sanctionMatches: SanctionMatch[];
}

// Request interfaces
interface TransactionScreeningRequest {
  txHash: string;
  direction?: 'inputs' | 'outputs' | 'both';
  includeMetadata?: boolean;
}

interface BulkScreeningRequest {
  addresses?: string[];
  transactions?: string[];
  batchId?: string;
  includeTransactionAnalysis?: boolean;
}
```

## Risk Assessment Logic

### Risk Score Calculation
- **0-25:** LOW risk
- **26-50:** MEDIUM risk  
- **51-75:** HIGH risk
- **76-100:** CRITICAL risk

### Risk Factors
1. **Direct Sanctions Match:** Immediate CRITICAL rating
2. **Indirect Association:** Based on transaction history
3. **Cluster Analysis:** Network effect scoring
4. **Historical Activity:** Pattern recognition
5. **Confidence Scoring:** Data quality assessment

### Match Types
- **DIRECT:** Address directly on sanctions list
- **INDIRECT:** Address connected to sanctioned entity
- **CLUSTER:** Address in same transaction cluster

## Error Handling

### Common Error Codes
- `EXTERNAL_API_ERROR`: Blockchain API failure
- `INVALID_ADDRESS`: Address format validation failed
- `INVALID_TRANSACTION`: Transaction hash validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVICE_UNAVAILABLE`: Backend service down

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "EXTERNAL_API_ERROR",
    "message": "Failed to fetch transaction: Request failed with status code 404",
    "details": {
      "txid": "invalid-tx-hash",
      "service": "mempool.space"
    }
  },
  "timestamp": "2025-07-01T07:54:05.166Z",
  "correlationId": "bc85b6ad-fb72-4fdd-b0fb-7919a6c55a6d"
}
```

## Frontend Integration

### API Service Usage
```typescript
// Address screening
const result = await apiService.screenAddress(
  '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  false, // includeTransactionAnalysis
  5      // maxHops
);

// Transaction screening
const txResult = await apiService.screenTransaction({
  txHash: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  direction: 'both',
  includeMetadata: true
});

// Bulk screening
const bulkResult = await apiService.bulkScreening({
  addresses: ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'],
  transactions: ['tx1234567890abcdef...'],
  batchId: 'batch-001'
});
```

### UI Component Integration
```typescript
// Risk level display helper
const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'LOW': return 'success';
    case 'MEDIUM': return 'warning';
    case 'HIGH': return 'error';
    case 'CRITICAL': return 'error';
    default: return 'default';
  }
};

// Risk score visualization
const getRiskScoreColor = (score: number): string => {
  if (score <= 25) return '#4CAF50';
  if (score <= 50) return '#FF9800';
  if (score <= 75) return '#FF5722';
  return '#F44336';
};
```

## Performance Characteristics

### Response Times
- **Address Screening:** 10-50ms average
- **Transaction Screening:** 100-500ms average (depends on blockchain API)
- **Bulk Screening:** 50ms per address + 200ms per transaction

### Throughput
- **Single Address:** 1000+ requests/minute
- **Bulk Operations:** 100 addresses or 50 transactions per batch
- **Concurrent Requests:** Limited by blockchain API rate limits

### Caching
- Sanctions list data cached for 24 hours
- Address risk scores cached for 1 hour
- Transaction data cached for 30 minutes

## Monitoring & Observability

### Health Check Indicators
- Service status (healthy/degraded/unhealthy)
- Data directory availability
- Sanctions list freshness
- Response time metrics
- Error rate tracking

### Logging
- Structured JSON logging
- Correlation ID tracking
- Performance metrics
- Error details and stack traces

### Alerts
- Service downtime alerts
- High error rate warnings
- Sanctions list update failures
- Performance degradation notices

## Development & Testing

### Local Development
```bash
# Start sanction detector service
docker-compose up sanction-detector

# Health check
curl http://localhost:3000/api/health

# Test address screening
curl -X POST http://localhost:3000/api/screening/address \
  -H "Content-Type: application/json" \
  -d '{"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}'
```

### Testing Strategies
1. **Unit Tests:** Risk calculation algorithms
2. **Integration Tests:** Blockchain API interactions
3. **End-to-End Tests:** Full screening workflows
4. **Performance Tests:** Load testing with bulk operations

### Mock Data for Testing
```typescript
// Test addresses for different risk levels
const TEST_ADDRESSES = {
  LOW_RISK: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',    // Genesis address
  MEDIUM_RISK: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',  // Exchange address
  HIGH_RISK: '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF',   // Known mixer
  CRITICAL_RISK: 'sanctions-test-address'              // Test sanctions match
};
```

## Configuration

### Environment Variables
```bash
# Service configuration
SANCTION_DETECTOR_PORT=3000
SANCTIONS_LIST_UPDATE_INTERVAL=24h
BLOCKCHAIN_API_TIMEOUT=30s
MAX_BULK_ADDRESSES=100
MAX_BULK_TRANSACTIONS=50

# External APIs
MEMPOOL_SPACE_API_URL=https://mempool.space/api
BLOCKCHAIN_INFO_API_URL=https://blockchain.info
```

### Docker Configuration
```yaml
sanction-detector:
  image: sanction-detector:latest
  ports:
    - "3000:3000"
  environment:
    - NODE_ENV=production
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```
