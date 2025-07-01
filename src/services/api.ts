// Backend service URLs
const THREAT_INTEL_API_URL = import.meta.env.VITE_THREAT_INTEL_API_URL || 'http://localhost:8000';
const STABLECOIN_MONITOR_API_URL = import.meta.env.VITE_STABLECOIN_MONITOR_API_URL || 'http://localhost:8001';
const SANCTION_DETECTOR_API_URL = import.meta.env.VITE_SANCTION_DETECTOR_API_URL || 'http://localhost:3000';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'; // Legacy API for backward compatibility

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
      const transformedAlerts: StablecoinAlert[] = alerts.map(alert => ({
        id: alert.id || Math.random().toString(),
        coin_symbol: alert.symbol || 'Unknown',
        alert_type: alert.type || 'volatility',
        severity: alert.severity || 'medium',
        message: alert.message || 'Stablecoin alert',
        price_at_alert: alert.price || 0,
        deviation: alert.deviation || 0,
        timestamp: alert.timestamp || new Date().toISOString()
      }));

      return {
        stablecoins,
        alerts: transformedAlerts,
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
      return response.map(alert => ({
        id: alert.id || Math.random().toString(),
        coin_symbol: alert.symbol || 'Unknown',
        alert_type: alert.type || 'volatility',
        severity: alert.severity || 'medium',
        message: alert.message || 'Stablecoin alert',
        price_at_alert: alert.price || 0,
        deviation: alert.deviation || 0,
        timestamp: alert.timestamp || new Date().toISOString()
      }));
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

  async getSanctionDetectorHealth(): Promise<SanctionDetectorHealth> {
    try {
      return await this.fetchApi<SanctionDetectorHealth>('/', SANCTION_DETECTOR_API_URL);
    } catch (error) {
      console.error('[API] Error fetching sanction detector health:', error);
      return { status: 'unhealthy', timestamp: new Date().toISOString(), uptime: 0, version: '', environment: '', services: { dataDirectories: { sanctionsDir: false, riskAssessmentsDir: false, auditLogsDir: false, configDir: false } } };
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
