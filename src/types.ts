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
  originLocation?: string;
  locationCoords?: { lat: number; lng: number };
  originCoords?: { lat: number; lng: number };
  travelDistanceKm?: number;
  timeDeltaMinutes?: number;
  calculatedKmhSpeed?: number;
  deviceId: string;
  timestamp: string;
  fraudProbability: number;
  flagged: boolean;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'FROZEN' | 'DISMISSED' | 'AUTO_APPROVED';
  mobile2FAStatus?: 'NONE' | 'REQUESTED' | 'CONFIRMED_USER' | 'DENIED_FRAUD';
  mobile2FAResponseTime?: string;
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

export interface FraudRule {
  id: string;
  name: string;
  description: string;
  field: 'amount' | 'velocity' | 'device' | 'country';
  operator: 'GREATER_THAN' | 'EQUALS' | 'NOT_EQUALS' | 'EXCEEDS_RATIO';
  thresholdValue: string | number;
  action: 'FLAG' | 'STEP_UP_2FA' | 'FREEZE' | 'ALLOW';
  enabled: boolean;
  priority: number;
  triggeredCount: number;
  updatedAt: string;
}
