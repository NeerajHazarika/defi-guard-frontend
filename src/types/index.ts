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
