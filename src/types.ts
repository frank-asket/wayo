export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  accountAgeDays: number;
  averageTransactionAmount: number;
  maxHistoricalAmount: number;
  knownDevices: string[];
  knownLocations: string[];
  homeCountry: string;
  isAccountFrozen?: boolean;
}

export interface LLMInvestigation {
  summary: string;
  reasons: string[];
  recommendedAction?: 'FREEZE_ACCOUNT' | 'REQUEST_2FA' | 'MANUAL_REVIEW' | 'ALLOW';
  confidenceScore?: number;
  modelUsed?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName?: string;
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  location: string;
  deviceId: string;
  timestamp: string;
  fraudProbability: number;
  flagged: boolean;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'FROZEN' | 'DISMISSED' | 'AUTO_APPROVED';
  llmInvestigation?: LLMInvestigation;
  riskFactors?: {
    amountDeviationRatio: number;
    isNewDevice: boolean;
    isGeoAnomaly: boolean;
    velocityScore: number;
    merchantRisk: number;
  };
  shapValues?: {
    feature: string;
    impact: number; // positive = increased risk, negative = lowered risk
    description: string;
  }[];
  frequency24h?: number;
  accountAgeDays?: number;
  auditTrail?: {
    timestamp: string;
    actor: string;
    action: string;
    details: string;
  }[];
}

export interface AuditRecord {
  id: string;
  transactionId: string;
  userId: string;
  action: 'FREEZE' | 'APPROVE' | 'REQUEST_2FA' | 'DISMISS' | 'ESCALATE' | 'AUTO_TRIGGER';
  actor: string;
  notes?: string;
  timestamp: string;
  previousStatus: string;
  newStatus: string;
  riskScore: number;
  shapSummary?: any;
  llmSummary?: string;
}

export interface SystemStats {
  totalEvaluated: number;
  totalFlagged: number;
  preventedFraudUsd: number;
  averageLatencyMs: number;
  activeInvestigations: number;
  mttiMinutes: number;
  rocAuc: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}
