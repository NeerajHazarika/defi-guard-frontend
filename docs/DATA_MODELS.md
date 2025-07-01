# Data Models & TypeScript Interfaces

## Overview

Complete TypeScript interface definitions for all data models used across the DeFi Guard frontend application.

## 🛡️ Sanction Detector Interfaces

### Core Screening Results

```typescript
// Individual address screening result
interface AddressScreeningResult {
  address: string;                                    // Bitcoin address
  riskScore: number;                                  // 0-100 risk score
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; // Risk classification
  sanctionMatches: SanctionMatch[];                  // Detected sanctions
  timestamp: string;                                  // ISO timestamp
  confidence: number;                                 // Confidence score 0-100
  processingTimeMs: number;                          // Processing duration
}

// Sanction match details
interface SanctionMatch {
  listSource: string;                                // e.g., "OFAC", "EU", "UN"
  entityName: string;                                // Sanctioned entity name
  entityId: string;                                  // Unique entity identifier
  matchType: 'DIRECT' | 'INDIRECT' | 'CLUSTER';     // Match type
  confidence: number;                                // Match confidence 0-100
  matchedAddress: string;                            // Matched address
}

// Service health status
interface SanctionDetectorHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;                                    // Uptime in seconds
  version: string;                                   // Service version
  environment: string;                               // Environment name
  services: {
    dataDirectories: {
      sanctionsDir: boolean;                         // Sanctions data available
      riskAssessmentsDir: boolean;                   // Risk assessments available
      auditLogsDir: boolean;                         // Audit logs available
      configDir: boolean;                            // Configuration available
    };
  };
}
```

### Transaction Screening

```typescript
// Transaction screening request
interface TransactionScreeningRequest {
  txHash: string;                                    // Bitcoin transaction hash (64 hex)
  direction?: 'inputs' | 'outputs' | 'both';        // Analysis direction
  includeMetadata?: boolean;                         // Include additional metadata
}

// Individual address within transaction
interface TransactionAddress {
  address: string;                                   // Bitcoin address
  riskScore: number;                                 // 0-100 risk score
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sanctionMatches: SanctionMatch[];                  // Detected sanctions
}

// Complete transaction screening result
interface TransactionScreeningResult {
  txHash: string;                                    // Transaction hash
  inputAddresses: TransactionAddress[];              // Input addresses analysis
  outputAddresses: TransactionAddress[];             // Output addresses analysis
  overallRiskScore: number;                          // Aggregated risk score
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sanctionMatchesCount: number;                      // Total sanction matches
  confidence: number;                                // Overall confidence
  processingTimeMs: number;                          // Processing duration
  timestamp: string;                                 // ISO timestamp
}
```

### Bulk Screening

```typescript
// Bulk screening request
interface BulkScreeningRequest {
  addresses?: string[];                              // Up to 100 addresses
  transactions?: string[];                           // Up to 50 transactions
  batchId?: string;                                  // Optional batch identifier
  includeTransactionAnalysis?: boolean;              // Multi-hop analysis
}

// Bulk screening summary statistics
interface BulkScreeningSummary {
  totalProcessed: number;                            // Total items processed
  highRiskCount: number;                             // High/critical risk items
  sanctionMatchesCount: number;                      // Total sanction matches
  processingTimeMs: number;                          // Total processing time
}

// Complete bulk screening response
interface BulkScreeningResponse {
  batchId?: string;                                  // Batch identifier
  summary: BulkScreeningSummary;                     // Processing summary
  results: {
    addresses: AddressScreeningResult[];             // Address results
    transactions: TransactionScreeningResult[];      // Transaction results
  };
  timestamp: string;                                 // ISO timestamp
}
```

## 🕵️ Threat Intelligence Interfaces

### Threat Intelligence Data

```typescript
// Individual threat intelligence item
interface ThreatIntelItem {
  id: string;                                        // Unique identifier
  title: string;                                     // Threat title
  summary: string;                                   // Brief description
  url: string;                                       // Source URL
  source: string;                                    // Source name
  published_date: string;                            // Publication date
  threat_level: number;                              // Threat level 0-100
  protocols_mentioned: string[];                     // Affected protocols
  classification: {
    exploit_type?: string;                           // Type of exploit
    attack_vector?: string;                          // Attack method
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

// Threat intelligence response with pagination
interface ThreatIntelResponse {
  items: ThreatIntelItem[];                          // Threat items
  total: number;                                     // Total available items
  page: number;                                      // Current page
  per_page: number;                                  // Items per page
}
```

### Legacy Threat Data (Backward Compatibility)

```typescript
// Legacy threat interface
interface Threat {
  threat_id: string;
  threat_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  indicators: string[];                              // IOCs
  source: string;
  timestamp: string;
  confidence_score: number;
  tags: string[];
  related_protocols: string[];
}

// Legacy alert interface
interface Alert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source: string;
  affectedProtocols: string[];
}

// Exploit data interface
interface Exploit {
  id: string;
  exploit_id: string;
  timestamp: string;
  protocol: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  amount_lost: number;
  exploit_addresses: string[];
  description: string;
  source: string;
  threat_type: string;
  metadata: any;
  status: 'active' | 'resolved' | 'investigating';
  lossAmount?: number;                               // Computed field for compatibility
}
```

## 💰 Stablecoin Monitor Interfaces

### Stablecoin Data

```typescript
// Individual stablecoin data
interface StablecoinData {
  symbol: string;                                    // e.g., "USDT", "USDC"
  name: string;                                      // Full name
  current_price: number;                             // Current price in USD
  target_price: number;                              // Target peg price (usually 1.0)
  deviation_percentage: number;                      // Deviation from peg
  status: 'stable' | 'depegged' | 'warning';        // Current status
  last_updated: string;                              // ISO timestamp
  market_cap?: number;                               // Market capitalization
  volume_24h?: number;                               // 24h trading volume
}

// Stablecoin alert
interface StablecoinAlert {
  id: string;                                        // Unique identifier
  coin_symbol: string;                               // Stablecoin symbol
  alert_type: 'depeg' | 'recovery' | 'volatility';  // Alert type
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;                                   // Alert message
  price_at_alert: number;                            // Price when alert triggered
  deviation: number;                                 // Deviation percentage
  timestamp: string;                                 // ISO timestamp
}

// Complete stablecoin response
interface StablecoinResponse {
  stablecoins: StablecoinData[];                     // Stablecoin data array
  alerts: StablecoinAlert[];                         // Active alerts
  total_monitored: number;                           // Total monitored coins
  last_updated: string;                              // Last update timestamp
}
```

## 🏥 Health Check Interfaces

### Service Health

```typescript
// Generic health response
interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime?: number;
  version?: string;
  environment?: string;
}

// Legacy API health (backward compatibility)
interface ApiHealth {
  status: string;
  last_update: string;
  components: {
    exploit_detection: string;
    vulnerability_monitoring: string;
    fund_tracking: string;
    threat_processing: string;
    fraud_classification: string;
    alert_system: string;
    database: string;
  };
}

// API statistics
interface ApiStats {
  last_cycle: string;
  tracked_addresses: number;
  system_health: ApiHealth;
  uptime: number;
}

// API protocols
interface ApiProtocols {
  protocols: string[];
  total: number;
}

// API response info
interface ApiResponse {
  name: string;
  version: string;
  description: string;
  status: string;
  endpoints: Record<string, string>;
}
```

## 🔧 Utility Types

### Common Enums

```typescript
// Risk levels
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Service status
type ServiceStatus = 'healthy' | 'degraded' | 'unhealthy' | 'loading' | 'error';

// Alert severity
type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

// Match types for sanctions
type MatchType = 'DIRECT' | 'INDIRECT' | 'CLUSTER';

// Transaction directions
type TransactionDirection = 'inputs' | 'outputs' | 'both';

// Stablecoin status
type StablecoinStatus = 'stable' | 'depegged' | 'warning';

// Alert types for stablecoins
type StablecoinAlertType = 'depeg' | 'recovery' | 'volatility';
```

### Form Data Types

```typescript
// Address screening form
interface AddressScreeningForm {
  address: string;
  includeTransactionAnalysis: boolean;
  maxHops: number;
}

// Transaction screening form
interface TransactionScreeningForm {
  txHash: string;
  direction: TransactionDirection;
  includeMetadata: boolean;
}

// Bulk screening form
interface BulkScreeningForm {
  addresses: string;                                 // Newline-separated addresses
  transactions: string;                              // Newline-separated tx hashes
  batchId?: string;
}
```

### UI State Types

```typescript
// Loading states
interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Tab state for multi-tab components
interface TabState {
  activeTab: number;
  tabCount: number;
}

// Filter state for data tables
interface FilterState {
  severity?: AlertSeverity;
  riskLevel?: RiskLevel;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// Sort state for data tables
interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}
```

## 🧪 API Response Wrappers

### Standard API Response

```typescript
// Success response wrapper
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
  correlationId?: string;
}

// Error response wrapper
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  correlationId: string;
}

// Union type for all API responses
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### Custom Hook Return Types

```typescript
// useApiData hook return type
interface UseApiDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// useBackendData hook options
interface UseBackendDataOptions {
  refreshInterval?: number;
  enabled?: boolean;
  onError?: (error: string) => void;
}
```

## 📊 Chart & Visualization Types

### Chart Data

```typescript
// Time series data point
interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

// Risk score trend data
interface RiskTrendData {
  address: string;
  dataPoints: TimeSeriesDataPoint[];
  currentRisk: RiskLevel;
}

// Threat level distribution
interface ThreatDistribution {
  severity: AlertSeverity;
  count: number;
  percentage: number;
}

// Stablecoin price chart data
interface StablecoinChartData {
  symbol: string;
  priceHistory: TimeSeriesDataPoint[];
  deviationHistory: TimeSeriesDataPoint[];
  alerts: StablecoinAlert[];
}
```

## 🔍 Search & Filter Types

### Search Parameters

```typescript
// Address search criteria
interface AddressSearchCriteria {
  address?: string;
  riskLevel?: RiskLevel[];
  sanctionLists?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
}

// Threat intelligence search
interface ThreatSearchCriteria {
  keywords?: string[];
  severity?: AlertSeverity[];
  protocols?: string[];
  sources?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
}

// Transaction search criteria
interface TransactionSearchCriteria {
  txHash?: string;
  addresses?: string[];
  riskLevel?: RiskLevel[];
  dateRange?: {
    from: string;
    to: string;
  };
}
```

## 🛠️ Configuration Types

### Environment Configuration

```typescript
// Frontend environment variables
interface EnvironmentConfig {
  VITE_THREAT_INTEL_API_URL: string;
  VITE_STABLECOIN_MONITOR_API_URL: string;
  VITE_SANCTION_DETECTOR_API_URL: string;
  VITE_API_URL?: string;                             // Legacy API URL
  VITE_APP_VERSION?: string;
  VITE_APP_ENVIRONMENT?: 'development' | 'staging' | 'production';
}

// Service configuration
interface ServiceConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  healthCheckInterval: number;
}
```

## 🧩 Component Props Types

### Common Component Props

```typescript
// MetricCard component props
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

// TabPanel component props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  dir?: string;
}

// ErrorBoundary component state
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}
```

## 🔄 State Management Types

### Redux/Context State (if applicable)

```typescript
// Application state structure
interface AppState {
  user: {
    isAuthenticated: boolean;
    preferences: UserPreferences;
  };
  services: {
    healthStatuses: Record<string, ServiceStatus>;
    lastHealthCheck: string;
  };
  cache: {
    addresses: Record<string, AddressScreeningResult>;
    transactions: Record<string, TransactionScreeningResult>;
    threats: ThreatIntelResponse | null;
    stablecoins: StablecoinResponse | null;
  };
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    notifications: Notification[];
  };
}

// User preferences
interface UserPreferences {
  defaultMaxHops: number;
  autoRefreshInterval: number;
  notificationSettings: {
    threatAlerts: boolean;
    stablecoinAlerts: boolean;
    systemAlerts: boolean;
  };
}
```

## 🔐 Type Guards & Validation

### Type Guards

```typescript
// Check if response is success
function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.success === true;
}

// Check if address is valid Bitcoin address
function isValidBitcoinAddress(address: string): boolean {
  const legacyPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const segwitPattern = /^bc1[a-z0-9]{39,59}$/;
  const testnetPattern = /^[mn2][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  return legacyPattern.test(address) || segwitPattern.test(address) || testnetPattern.test(address);
}

// Check if transaction hash is valid
function isValidTransactionHash(hash: string): boolean {
  return /^[a-fA-F0-9]{64}$/.test(hash);
}

// Check if risk level is high or critical
function isHighRisk(riskLevel: RiskLevel): boolean {
  return riskLevel === 'HIGH' || riskLevel === 'CRITICAL';
}
```
