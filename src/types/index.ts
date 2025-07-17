export interface RiskLevel {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
  score: number;
}

export interface AlertStatus {
  status: 'ACTIVE' | 'RESOLVED' | 'UNDER_REVIEW' | 'BLOCKED' | 'APPROVED' | 'INVESTIGATING' | 'TAKEN_DOWN';
}

export interface TimeSeriesData {
  date: string;
  [key: string]: string | number;
}

export interface OFACAlert {
  id: string;
  address: string;
  amount: string;
  riskLevel: RiskLevel['level'];
  reason: string;
  timestamp: string;
  status: AlertStatus['status'];
}

export interface DeFiProtocol {
  id: string;
  name: string;
  category: string;
  tvl: string;
  riskScore: number;
  riskLevel: RiskLevel['level'];
  vulnerabilities: string[];
  governanceRisk: RiskLevel['level'];
  smartContractRisk: RiskLevel['level'];
  liquidityRisk: RiskLevel['level'];
  lastAudit: string;
  developerReputation: number;
}

export interface MixerService {
  id: string;
  name: string;
  type: string;
  status: string;
  riskLevel: RiskLevel['level'];
  totalVolume: string;
  transactionCount: number;
  lastActivity: string;
  addresses: string[];
}

export interface ExploitEvent {
  id: string;
  protocol: string;
  exploitType: string;
  amount: string;
  currency: string;
  timestamp: string;
  status: AlertStatus['status'];
  severity: RiskLevel['level'];
  description: string;
  affectedAddresses: string[];
  mitigation: string;
}

export interface FraudAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  riskLevel: RiskLevel['level'];
  affectedUsers: number;
  estimatedLoss: string;
  status: AlertStatus['status'];
  indicators: string[];
  reportedBy: string;
  timestamp: string;
}

export interface UserRiskProfile {
  userId: string;
  riskScore: number;
  riskLevel: RiskLevel['level'];
  factors: string[];
  lastActivity: string;
  accountAge: string;
  transactionCount: number;
  totalVolume: string;
}

// Scam Address Detection types
export interface ScamAddressResponse {
  network: string;
  address: string;
  reportCount: string;
  riskLevel: 'Clean' | 'Low' | 'Medium' | 'High';
  srcUrl: string;
}

export interface ScamAddressError {
  error: string;
  details?: string;
}

export type ScamCheckResult = ScamAddressResponse | ScamAddressError;

// Enhanced Risk Assessment types for API v1.1
export interface VulnerabilityDetection {
  detector_name: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  title: string;
  description: string;
  impact: string;
  code_locations: Array<{
    file: string;
    line: number;
    column?: number;
    code_snippet: string;
  }>;
  recommendations: string[];
  references: string[];
}

export interface SecurityAnalysisResult {
  risk_score: number;
  risk_level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  confidence: number;
  vulnerabilities: VulnerabilityDetection[];
  analysis_metadata: {
    analysis_time_ms: number;
    slither_enabled: boolean;
    detectors_used: string[];
    source_files_analyzed: number;
    lines_of_code: number;
  };
}

export interface ProtocolAssessmentStatus {
  id: string;
  protocol_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress_percentage: number;
  current_stage: string;
  estimated_completion_time?: string;
  created_at: string;
  updated_at: string;
}

// Risk levels with enhanced scoring
export interface EnhancedRiskLevel extends RiskLevel {
  technical_score: number;
  governance_score: number;
  liquidity_score: number;
  reputation_score: number;
  vulnerability_count: number;
  critical_vulnerabilities: number;
}
