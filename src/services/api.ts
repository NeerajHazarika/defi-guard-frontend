// Backend service URLs
const THREAT_INTEL_API_URL = import.meta.env.VITE_THREAT_INTEL_API_URL || 'http://localhost:8000';
const STABLECOIN_MONITOR_API_URL = import.meta.env.VITE_STABLECOIN_MONITOR_API_URL || 'http://localhost:8001';
const STABLECOIN_OSINT_API_URL = import.meta.env.VITE_STABLECOIN_OSINT_API_URL || 'http://localhost:8080';
const SANCTION_DETECTOR_API_URL = import.meta.env.VITE_SANCTION_DETECTOR_API_URL || 'http://localhost:3000';
const SCAM_DETECTOR_API_URL = import.meta.env.VITE_SCAM_DETECTOR_API_URL || 'http://localhost:3001';
const DEFI_RISK_ASSESSMENT_API_URL = import.meta.env.VITE_DEFI_RISK_ASSESSMENT_API_URL || 'http://localhost:3003';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'; // Legacy API for backward compatibility

// Import types
import type { ScamAddressResponse, ScamAddressError } from '../types';

// Threat Intelligence API interfaces
export interface ThreatIntelItem {
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

export interface ThreatIntelResponse {
  items: ThreatIntelItem[];
  total: number;
  page: number;
  per_page: number;
}

// Stablecoin Monitor API interfaces
export interface StablecoinData {
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

export interface StablecoinAlert {
  id: string;
  coin_symbol: string;
  alert_type: 'depeg' | 'recovery' | 'volatility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  price_at_alert: number;
  deviation: number;
  timestamp: string;
}

export interface StablecoinResponse {
  stablecoins: StablecoinData[];
  alerts: StablecoinAlert[];
  total_monitored: number;
  last_updated: string;
}

// Sanction Detector API interfaces
export interface SanctionMatch {
  listSource: string;
  entityName: string;
  entityId: string;
  matchType: 'DIRECT' | 'INDIRECT' | 'CLUSTER';
  confidence: number;
  matchedAddress: string;
}

export interface AddressScreeningResult {
  address: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sanctionMatches: SanctionMatch[];
  timestamp: string;
  confidence: number;
  processingTimeMs: number;
}

// Transaction Screening interfaces
export interface TransactionAddress {
  address: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sanctionMatches: SanctionMatch[];
}

export interface TransactionScreeningResult {
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

export interface TransactionScreeningRequest {
  txHash: string;
  direction?: 'inputs' | 'outputs' | 'both';
  includeMetadata?: boolean;
}

export interface BulkScreeningRequest {
  addresses?: string[];
  transactions?: string[];
  batchId?: string;
  includeTransactionAnalysis?: boolean;
}

export interface BulkScreeningSummary {
  totalProcessed: number;
  highRiskCount: number;
  sanctionMatchesCount: number;
  processingTimeMs: number;
}

export interface BulkScreeningResponse {
  batchId?: string;
  summary: BulkScreeningSummary;
  results: {
    addresses: AddressScreeningResult[];
    transactions: TransactionScreeningResult[];
  };
  timestamp: string;
}

export interface SanctionDetectorHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    dataDirectories: {
      sanctionsDir: boolean;
      riskAssessmentsDir: boolean;
      auditLogsDir: boolean;
      configDir: boolean;
    };
  };
}

// Legacy interfaces for backward compatibility
export interface ApiHealth {
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

export interface ApiStats {
  last_cycle: string;
  tracked_addresses: number;
  system_health: ApiHealth;
  uptime: number;
}

export interface ApiProtocols {
  protocols: string[];
  total: number;
}

export interface ApiResponse {
  name: string;
  version: string;
  description: string;
  status: string;
  endpoints: Record<string, string>;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source: string;
  affectedProtocols: string[];
}

export interface Threat {
  threat_id: string;
  threat_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  indicators: string[];
  source: string;
  timestamp: string;
  confidence_score: number;
  tags: string[];
  related_protocols: string[];
}

export interface Exploit {
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
  lossAmount?: number; // computed field for backwards compatibility
}

// DeFi Risk Assessment API interfaces
export interface Protocol {
  id: string;
  name: string;
  description?: string;
  website?: string;
  category?: string;
  chainId?: number;
  contractAddress?: string;
  deployed_date?: string;
  audit_reports?: string[];
  governance_token?: string;
  tvl_usd?: number;
  created_at: string;
  updated_at: string;
}

export interface RiskAssessmentResult {
  technical: {
    score: number;
    findings: Array<{
      category: string;
      severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
      title: string;
      description: string;
      impact?: string;
      confidence: number;
    }>;
    vulnerabilities_count: number;
    code_quality_score: number;
    audit_coverage: number;
  };
  governance: {
    score: number;
    decentralization_score: number;
    token_distribution: {
      gini_coefficient: number;
      top_10_holders_percentage: number;
    };
    voting_mechanism: string;
    proposal_activity: number;
    multisig_threshold?: string;
  };
  liquidity: {
    score: number;
    tvl_usd: number;
    volume_24h_usd: number;
    market_depth: number;
    slippage_analysis: {
      '1k_usd': number;
      '10k_usd': number;
      '100k_usd': number;
    };
  };
  reputation: {
    score: number;
    team_score: number;
    development_activity: number;
    code_quality: number;
    audit_history: {
      audit_count: number;
      last_audit_date?: string;
      audit_firms: string[];
    };
    historical_exploits: number;
  };
}

export interface Assessment {
  id: string;
  protocolId: string;
  contractAddress?: string;
  chainId?: number;
  analysisTypes: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  riskScore: number;
  riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  confidence: number;
  results?: RiskAssessmentResult;
  findings?: Array<{
    category: string;
    severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    recommendation?: string;
  }>;
  recommendations?: string[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  error_message?: string;
  processing_time_ms?: number;
}

export interface CreateAssessmentRequest {
  protocolId: string;
  contractAddress?: string;
  chainId?: number;
  analysisTypes?: string[];
  force_refresh?: boolean;
}

export interface AssessmentsListResponse {
  assessments: Assessment[];
  total: number;
  page: number;
  per_page: number;
}

export interface ProtocolsListResponse {
  protocols: Protocol[];
  total: number;
  page: number;
  per_page: number;
}

export interface CreateProtocolRequest {
  name: string;
  description?: string;
  website?: string;
  category?: string;
  chainId?: number;
  contractAddress?: string;
  deployed_date?: string;
  audit_reports?: string[];
  governance_token?: string;
}

export interface RiskAssessmentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    slither: boolean;
    blockchain_rpc: boolean;
    external_apis: {
      etherscan: boolean;
      defillama: boolean;
      coingecko: boolean;
    };
  };
  cache_stats: {
    hit_rate: number;
    size: number;
  };
}

// Stablecoin OSINT API interfaces
export interface CountryRegulation {
  id: number;
  name: string;
  code: string;
  region: string;
  crypto_friendly: boolean;
  regulatory_status: 'friendly' | 'neutral' | 'hostile' | 'regulated' | 'unclear';
  stablecoins_accepted: string[];
  last_updated: string;
  notes?: string;
}

export interface StablecoinNews {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  published_date: string;
  category: 'regulation' | 'audit' | 'security' | 'compliance' | 'market' | 'technology';
  stablecoins_mentioned: string[];
  countries_mentioned: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  impact_score: number;
}

export interface StablecoinAcceptance {
  country: CountryRegulation;
  stablecoin: {
    id: number;
    name: string;
    symbol: string;
    blockchain: string;
    issuer: string;
  };
  is_accepted: boolean;
  acceptance_level: 'full' | 'partial' | 'restricted' | 'banned';
  legal_status: string;
  use_cases: string[];
  confidence_score: number;
  last_updated: string;
}

export interface OSINTResponse<T> {
  data: T;
  success: boolean;
  total?: number;
  page?: number;
  per_page?: number;
  cache_metadata?: {
    cached: boolean;
    age_minutes: number;
    expires_at: string;
  };
}

// API Service class
class ApiService {
  private async fetchApi<T>(endpoint: string, baseUrl?: string): Promise<T> {
    try {
      const url = baseUrl ? `${baseUrl}${endpoint}` : `${API_BASE_URL}${endpoint}`;
      console.log(`[API] Fetching: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log(`[API] Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`[API] Response data for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`[API] Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // New Backend API Methods
  async getThreatIntelNews(limit: number = 50, forceFresh: boolean = true): Promise<ThreatIntelResponse> {
    try {
      console.log(`[API] Fetching threat intel with fresh_scrape=${forceFresh}, limit=${limit}`);
      const response = await this.fetchApi<{
        status: string;
        count: number;
        total_count: number | null;
        data: any[];
      }>(`/api/v1/threat-intel?limit=${limit}&fresh_scrape=${forceFresh}`, THREAT_INTEL_API_URL);
      
      // Transform the response to match our interface
      const transformedItems: ThreatIntelItem[] = response.data.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.description,
        url: item.source_url,
        source: item.source_name,
        published_date: item.published_date,
        threat_level: item.severity_score,
        protocols_mentioned: item.protocol_name ? [item.protocol_name] : [],
        classification: {
          exploit_type: item.attack_type,
          attack_vector: item.additional_data?.attack_vector,
          severity: item.risk_level as 'low' | 'medium' | 'high' | 'critical'
        }
      }));

      console.log(`[API] Successfully fetched ${transformedItems.length} threat intel items`);
      return {
        items: transformedItems,
        total: response.total_count || response.count,
        page: 1,
        per_page: limit
      };
    } catch (error) {
      console.error('[API] Error fetching threat intel news:', error);
      // Return fallback data
      return {
        items: [],
        total: 0,
        page: 1,
        per_page: limit
      };
    }
  }

  async getStablecoinData(): Promise<StablecoinResponse> {
    try {
      const [metricsResponse, alertsResponse] = await Promise.allSettled([
        this.fetchApi<any[]>('/metrics/current', STABLECOIN_MONITOR_API_URL),
        this.fetchApi<any[]>('/alerts/active', STABLECOIN_MONITOR_API_URL)
      ]);

      const metrics = metricsResponse.status === 'fulfilled' ? metricsResponse.value : [];
      const alerts = alertsResponse.status === 'fulfilled' ? alertsResponse.value : [];

      // Transform metrics to our interface
      const stablecoins: StablecoinData[] = metrics.map(coin => ({
        symbol: coin.symbol,
        name: coin.name,
        current_price: coin.price,
        target_price: 1.0,
        deviation_percentage: ((coin.price - 1.0) / 1.0) * 100,
        status: Math.abs(coin.price - 1.0) > 0.005 ? 'depegged' : 
                Math.abs(coin.price - 1.0) > 0.002 ? 'warning' : 'stable',
        last_updated: coin.last_updated,
        market_cap: coin.market_cap,
        volume_24h: coin.volume_24h
      }));

      // Transform alerts to our interface  
      const transformedAlerts: StablecoinAlert[] = alerts.map(alert => {
        // Generate a stable ID based on multiple factors to ensure uniqueness
        const symbol = alert.symbol || 'unknown';
        const type = alert.type || 'volatility';
        const severity = alert.severity || 'medium';
        const deviation = Math.round((alert.deviation || 0) * 1000) / 1000; // Round to 3 decimal places
        const price = Math.round((alert.price || 0) * 10000) / 10000; // Round to 4 decimal places
        
        // Create a content-based hash for deduplication
        const contentHash = `${symbol}-${type}-${severity}-${deviation}-${price}`.toLowerCase();
        const stableId = alert.id || contentHash;
        
        return {
          id: stableId,
          coin_symbol: alert.symbol || 'Unknown',
          alert_type: alert.type || 'volatility',
          severity: alert.severity || 'medium',
          message: alert.message || 'Stablecoin alert',
          price_at_alert: alert.price || 0,
          deviation: alert.deviation || 0,
          timestamp: alert.timestamp || new Date().toISOString()
        };
      });

      // Remove duplicates based on content similarity
      const uniqueAlerts = transformedAlerts.filter((alert, index, self) => {
        return index === self.findIndex(a => 
          a.coin_symbol === alert.coin_symbol &&
          a.alert_type === alert.alert_type &&
          a.severity === alert.severity &&
          Math.abs(a.deviation - alert.deviation) < 0.01 && // Same deviation within 0.01%
          Math.abs(a.price_at_alert - alert.price_at_alert) < 0.0001 // Same price within 0.0001
        );
      });

      return {
        stablecoins,
        alerts: uniqueAlerts,
        total_monitored: stablecoins.length,
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('[API] Error fetching stablecoin data:', error);
      // Return fallback data
      return {
        stablecoins: [],
        alerts: [],
        total_monitored: 0,
        last_updated: new Date().toISOString()
      };
    }
  }

  async getStablecoinAlerts(): Promise<StablecoinAlert[]> {
    try {
      const response = await this.fetchApi<any[]>('/alerts/active', STABLECOIN_MONITOR_API_URL);
      
      const transformedAlerts = response.map(alert => {
        // Generate a stable ID based on multiple factors to ensure uniqueness
        const symbol = alert.symbol || 'unknown';
        const type = alert.type || 'volatility';
        const severity = alert.severity || 'medium';
        const deviation = Math.round((alert.deviation || 0) * 1000) / 1000; // Round to 3 decimal places
        const price = Math.round((alert.price || 0) * 10000) / 10000; // Round to 4 decimal places
        
        // Create a content-based hash for deduplication
        const contentHash = `${symbol}-${type}-${severity}-${deviation}-${price}`.toLowerCase();
        const stableId = alert.id || contentHash;
        
        return {
          id: stableId,
          coin_symbol: alert.symbol || 'Unknown',
          alert_type: alert.type || 'volatility',
          severity: alert.severity || 'medium',
          message: alert.message || 'Stablecoin alert',
          price_at_alert: alert.price || 0,
          deviation: alert.deviation || 0,
          timestamp: alert.timestamp || new Date().toISOString()
        };
      });

      // Remove duplicates based on content similarity
      const uniqueAlerts = transformedAlerts.filter((alert, index, self) => {
        return index === self.findIndex(a => 
          a.coin_symbol === alert.coin_symbol &&
          a.alert_type === alert.alert_type &&
          a.severity === alert.severity &&
          Math.abs(a.deviation - alert.deviation) < 0.01 && // Same deviation within 0.01%
          Math.abs(a.price_at_alert - alert.price_at_alert) < 0.0001 // Same price within 0.0001
        );
      });

      return uniqueAlerts;
    } catch (error) {
      console.error('[API] Error fetching stablecoin alerts:', error);
      return [];
    }
  }

  async getThreatIntelHealth(): Promise<{ status: string; last_updated: string }> {
    try {
      return await this.fetchApi<{ status: string; last_updated: string }>('/', THREAT_INTEL_API_URL);
    } catch (error) {
      console.error('[API] Error fetching threat intel health:', error);
      return { status: 'error', last_updated: new Date().toISOString() };
    }
  }

  async getStablecoinHealth(): Promise<{ status: string; last_updated: string }> {
    try {
      return await this.fetchApi<{ status: string; last_updated: string }>('/', STABLECOIN_MONITOR_API_URL);
    } catch (error) {
      console.error('[API] Error fetching stablecoin health:', error);
      return { status: 'error', last_updated: new Date().toISOString() };
    }
  }

  async getSanctionDetectorHealth(): Promise<{ status: string; last_updated: string }> {
    try {
      const response = await this.fetchApi<{ status: string; message?: string }>('/', SANCTION_DETECTOR_API_URL);
      return { 
        status: response.status || 'healthy', 
        last_updated: new Date().toISOString() 
      };
    } catch (error) {
      console.error('[API] Error fetching sanction detector health:', error);
      return { status: 'error', last_updated: new Date().toISOString() };
    }
  }

  async getApiInfo(): Promise<ApiResponse> {
    return this.fetchApi<ApiResponse>('/');
  }

  async getHealth(): Promise<ApiHealth> {
    return this.fetchApi<ApiHealth>('/health');
  }

  async getStats(): Promise<ApiStats> {
    return this.fetchApi<ApiStats>('/stats');
  }

  async getProtocols(): Promise<ApiProtocols> {
    return this.fetchApi<ApiProtocols>('/protocols/monitored');
  }

  async getRecentAlerts(): Promise<{ alerts: Alert[] }> {
    return this.fetchApi<{ alerts: Alert[] }>('/alerts/recent');
  }

  async getThreatIntel(): Promise<{ threats: Threat[] }> {
    return this.fetchApi<{ threats: Threat[] }>('/threats/intel');
  }

  async getRecentExploits(): Promise<{ exploits: Exploit[] }> {
    const response = await this.fetchApi<{ exploits: any[] }>('/database/exploits/recent');
    // Transform the response to match our interface
    const transformedExploits = response.exploits.map(exploit => ({
      ...exploit,
      id: exploit.exploit_id,
      lossAmount: exploit.amount_lost, // Add backwards compatibility field
    }));
    return { exploits: transformedExploits };
  }

  async getRektNews(): Promise<{ articles: any[] }> {
    return this.fetchApi<{ articles: any[] }>('/rekt-news/latest');
  }

  async getFundMovements(): Promise<{ movements: any[] }> {
    return this.fetchApi<{ movements: any[] }>('/funds/movements');
  }

  async getExploitsBySeverity(severity: string): Promise<{ exploits: Exploit[] }> {
    const response = await this.fetchApi<{ exploits: any[] }>(`/database/exploits/severity/${severity}`);
    const transformedExploits = response.exploits.map(exploit => ({
      ...exploit,
      id: exploit.exploit_id,
      lossAmount: exploit.amount_lost,
    }));
    return { exploits: transformedExploits };
  }

  async getDatabaseHealth(): Promise<any> {
    return this.fetchApi<any>('/database/health');
  }

  // Mock methods for authenticated endpoints (for demo purposes)
  async getTrackedAddresses(): Promise<any> {
    // This would normally require authentication
    return {
      addresses: [],
      message: "Authentication required for tracked addresses endpoint"
    };
  }

  // Sanction Detector API methods
  async screenAddress(
    address: string, 
    includeTransactionAnalysis: boolean = false, 
    maxHops: number = 5
  ): Promise<AddressScreeningResult> {
    try {
      const payload = {
        address,
        includeTransactionAnalysis,
        maxHops
      };
      
      const url = `${SANCTION_DETECTOR_API_URL}/api/screening/address`;
      console.log(`[API] Screening address: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[API] Address screening response:`, result);
      
      return result.data;
    } catch (error) {
      console.error('[API] Error screening address:', error);
      throw error;
    }
  }

  async screenTransaction(request: TransactionScreeningRequest): Promise<TransactionScreeningResult> {
    try {
      const payload = {
        txHash: request.txHash,
        direction: request.direction || 'both',
        includeMetadata: request.includeMetadata || false
      };
      
      const url = `${SANCTION_DETECTOR_API_URL}/api/screening/transaction`;
      console.log(`[API] Screening transaction: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[API] Transaction screening response:`, result);
      
      return result.data;
    } catch (error) {
      console.error('[API] Error screening transaction:', error);
      throw error;
    }
  }

  async bulkScreening(request: BulkScreeningRequest): Promise<BulkScreeningResponse> {
    try {
      const url = `${SANCTION_DETECTOR_API_URL}/api/screening/bulk`;
      console.log(`[API] Bulk screening: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[API] Bulk screening response:`, result);
      
      // Transform the API response to match our interface
      if (result.success && result.data) {
        const apiData = result.data;
        
        // Calculate processing time from individual results
        const totalProcessingTime = (
          (apiData.addresses?.reduce((sum: number, addr: any) => 
            sum + (addr.processingTimeMs || 0), 0) || 0) +
          (apiData.transactions?.reduce((sum: number, tx: any) => 
            sum + (tx.processingTimeMs || 0), 0) || 0)
        );
        
        // Count sanction matches from addresses and transactions
        const addressSanctionMatches = apiData.addresses?.reduce((sum: number, addr: any) => 
          sum + (addr.sanctionMatches?.length || 0), 0) || 0;
        
        const transactionSanctionMatches = apiData.transactions?.reduce((sum: number, tx: any) => 
          sum + (tx.sanctionMatchesCount || 0), 0) || 0;
        
        const sanctionMatchesCount = addressSanctionMatches + transactionSanctionMatches;
        
        const transformedResponse: BulkScreeningResponse = {
          batchId: request.batchId,
          summary: {
            totalProcessed: (apiData.addresses?.length || 0) + (apiData.transactions?.length || 0),
            highRiskCount: apiData.summary?.highRiskItems || 0,
            sanctionMatchesCount: sanctionMatchesCount,
            processingTimeMs: totalProcessingTime
          },
          results: {
            addresses: apiData.addresses || [],
            transactions: apiData.transactions || []
          },
          timestamp: result.timestamp || new Date().toISOString()
        };
        
        return transformedResponse;
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      console.error('[API] Error in bulk screening:', error);
      throw error;
    }
  }

  async getSanctionDetectorHealthDetailed(): Promise<SanctionDetectorHealth> {
    try {
      const response = await this.fetchApi<{ data: SanctionDetectorHealth }>(
        '/api/health', 
        SANCTION_DETECTOR_API_URL
      );
      
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching sanction detector health:', error);
      return { 
        status: 'unhealthy', 
        timestamp: new Date().toISOString(), 
        uptime: 0, 
        version: '', 
        environment: '', 
        services: { 
          dataDirectories: { 
            sanctionsDir: false, 
            riskAssessmentsDir: false, 
            auditLogsDir: false, 
            configDir: false 
          } 
        } 
      };
    }
  }
}

export const apiService = new ApiService();

// Scam Address Detection API
export const scamDetectorApi = {
  async checkAddress(address: string): Promise<ScamAddressResponse | ScamAddressError> {
    try {
      const response = await fetch(`${SCAM_DETECTOR_API_URL}/api/check-address/${encodeURIComponent(address)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          error: `HTTP ${response.status}`,
          details: errorText || 'Unknown error occurred'
        };
      }

      const data = await response.json();
      return data as ScamAddressResponse;
    } catch (error) {
      return {
        error: 'Network Error',
        details: error instanceof Error ? error.message : 'Failed to connect to scam detector service'
      };
    }
  },

  async healthCheck(): Promise<{ status: string; timestamp: string } | { error: string }> {
    try {
      const response = await fetch(`${SCAM_DETECTOR_API_URL}/health`);
      if (!response.ok) {
        return { error: `Health check failed: HTTP ${response.status}` };
      }
      return await response.json();
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Health check failed' 
      };
    }
  }
};

// DeFi Risk Assessment API
export const defiRiskAssessmentApi = {
  // Protocol Management
  async getProtocols(page = 1, perPage = 20): Promise<ProtocolsListResponse> {
    try {
      const response = await fetch(`${DEFI_RISK_ASSESSMENT_API_URL}/api/v1/protocols?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[API] Error fetching protocols:', error);
      throw error;
    }
  },

  async getProtocol(id: string): Promise<Protocol> {
    try {
      const response = await fetch(`${DEFI_RISK_ASSESSMENT_API_URL}/api/v1/protocols/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[API] Error fetching protocol:', error);
      throw error;
    }
  },

  async createProtocol(protocol: CreateProtocolRequest): Promise<Protocol> {
    try {
      const response = await fetch(`${DEFI_RISK_ASSESSMENT_API_URL}/api/v1/protocols`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(protocol),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[API] Error creating protocol:', error);
      throw error;
    }
  },

  async updateProtocol(id: string, protocol: Partial<CreateProtocolRequest>): Promise<Protocol> {
    try {
      const response = await fetch(`${DEFI_RISK_ASSESSMENT_API_URL}/api/v1/protocols/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(protocol),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[API] Error updating protocol:', error);
      throw error;
    }
  },

  async deleteProtocol(id: string): Promise<void> {
    try {
      const response = await fetch(`${DEFI_RISK_ASSESSMENT_API_URL}/api/v1/protocols/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('[API] Error deleting protocol:', error);
      throw error;
    }
  },

  // Risk Assessment Management
  async getAssessments(page = 1, perPage = 20, protocolId?: string, status?: string): Promise<AssessmentsListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });

      if (protocolId) params.append('protocol_id', protocolId);
      if (status) params.append('status', status);

      const response = await fetch(`${DEFI_RISK_ASSESSMENT_API_URL}/api/v1/assessments?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[API] Error fetching assessments:', error);
      throw error;
    }
  },

  async getAssessment(id: string): Promise<Assessment> {
    try {
      const response = await fetch(`${DEFI_RISK_ASSESSMENT_API_URL}/api/v1/assessments/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[API] Error fetching assessment:', error);
      throw error;
    }
  },

  async createAssessment(assessment: CreateAssessmentRequest): Promise<Assessment> {
    try {
      const response = await fetch(`${DEFI_RISK_ASSESSMENT_API_URL}/api/v1/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessment),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[API] Error creating assessment:', error);
      throw error;
    }
  },

  async deleteAssessment(id: string): Promise<void> {
    try {
      const response = await fetch(`${DEFI_RISK_ASSESSMENT_API_URL}/api/v1/assessments/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('[API] Error deleting assessment:', error);
      throw error;
    }
  },

  // Health Check
  async healthCheck(): Promise<RiskAssessmentHealth> {
    try {
      const response = await fetch(`${DEFI_RISK_ASSESSMENT_API_URL}/api/v1/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('[API] Error fetching risk assessment health:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: 0,
        version: '',
        environment: '',
        services: {
          slither: false,
          blockchain_rpc: false,
          external_apis: {
            etherscan: false,
            defillama: false,
            coingecko: false,
          },
        },
        cache_stats: {
          hit_rate: 0,
          size: 0,
        },
      };
    }
  }
};

// Stablecoin OSINT Service APIs
export const stablecoinOSINTApi = {
  // Countries API
  getCountries: async (params?: {
    region?: string;
    crypto_friendly?: boolean;
    regulatory_status?: string;
    limit?: number;
  }): Promise<OSINTResponse<CountryRegulation[]>> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.region) searchParams.append('region', params.region);
      if (params?.crypto_friendly !== undefined) searchParams.append('crypto_friendly', params.crypto_friendly.toString());
      if (params?.regulatory_status) searchParams.append('regulatory_status', params.regulatory_status);
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const response = await fetch(`${STABLECOIN_OSINT_API_URL}/api/v1/countries/?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching countries:', error);
      return {
        data: [],
        success: false,
      };
    }
  },

  getCountryByCode: async (countryCode: string): Promise<OSINTResponse<CountryRegulation>> => {
    try {
      const response = await fetch(`${STABLECOIN_OSINT_API_URL}/api/v1/countries/code/${countryCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching country by code:', error);
      return {
        data: {} as CountryRegulation,
        success: false,
      };
    }
  },

  getCountryStablecoins: async (countryId: number, acceptedOnly: boolean = false): Promise<OSINTResponse<StablecoinAcceptance[]>> => {
    try {
      const searchParams = new URLSearchParams();
      if (acceptedOnly) searchParams.append('accepted_only', 'true');

      const response = await fetch(`${STABLECOIN_OSINT_API_URL}/api/v1/countries/${countryId}/stablecoins?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching country stablecoins:', error);
      return {
        data: [],
        success: false,
      };
    }
  },

  // News API
  getNews: async (params?: {
    category?: string;
    stablecoin_symbol?: string;
    country?: string;
    sentiment?: string;
    limit?: number;
    fresh?: boolean;
  }): Promise<OSINTResponse<StablecoinNews[]>> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.append('category', params.category);
      if (params?.stablecoin_symbol) searchParams.append('stablecoin_symbol', params.stablecoin_symbol);
      if (params?.country) searchParams.append('country', params.country);
      if (params?.sentiment) searchParams.append('sentiment', params.sentiment);
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const endpoint = params?.fresh ? '/api/v1/news/articles/fresh' : '/api/v1/news/articles';
      const response = await fetch(`${STABLECOIN_OSINT_API_URL}${endpoint}?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      return {
        data: [],
        success: false,
      };
    }
  },

  refreshNews: async (): Promise<OSINTResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${STABLECOIN_OSINT_API_URL}/api/v1/news/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error refreshing news:', error);
      return {
        data: { message: 'Failed to refresh news' },
        success: false,
      };
    }
  },

  // Search API
  search: async (query: string, params?: {
    country_code?: string;
    stablecoin_symbol?: string;
    is_accepted?: boolean;
    limit?: number;
  }): Promise<OSINTResponse<StablecoinAcceptance[]>> => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('query', query);
      if (params?.country_code) searchParams.append('country_code', params.country_code);
      if (params?.stablecoin_symbol) searchParams.append('stablecoin_symbol', params.stablecoin_symbol);
      if (params?.is_accepted !== undefined) searchParams.append('is_accepted', params.is_accepted.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const response = await fetch(`${STABLECOIN_OSINT_API_URL}/api/v1/search?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching OSINT data:', error);
      return {
        data: [],
        success: false,
      };
    }
  },

  // Service health
  getHealth: async (): Promise<{ status: string; timestamp: string }> => {
    try {
      const response = await fetch(`${STABLECOIN_OSINT_API_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking OSINT service health:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
