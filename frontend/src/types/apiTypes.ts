export interface Transaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  date: string;
  metadata?: {
    ipCountry?: string;
    deviceHash?: string;
  };
}

export interface ConnectorAccount {
  account: string;
  case1Transactions: string[];
  case2Transactions: string[];
  totalAmount: number;
  riskScore: number;
}

export interface BridgeEdge {
  from: string;
  to: string;
  totalAmount: number;
  _id: string;
}

export interface TemporalOverlap {
  start: string;
  end: string;
  transactionCount: number;
}

export interface HighRiskLocation {
  countryCode: string;
  riskLevel: "low" | "medium" | "high";
  transactionCount: number;
}

export interface RiskMeterProps {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH";
}

export interface RiskFactors {
  sharedAccounts: number;
  highValueOverlap: number;
  geographicRisk: number;
}

export interface CaseComparison {
  case1: string;
  case2: string;
  comparison: {
    directLinks: {
      sharedAccounts: string[];
      sharedMetadata: {
        emails: string[];
        phones: string[];
        ips: string[];
      };
      transactionLinks: {
        path: string[];
        totalAmount: number;
        transactions: string[];
        timeGap: string;
        _id: string;
      }[];
    };
    patternSimilarity: {
      highValue: number;
      structuring: number;
      circular: number;
    };
    networkAnalysis: {
      connectorAccounts: ConnectorAccount[];
      bridgeEdges: BridgeEdge[];
    };
    riskAssessment: {
      riskFactors: RiskFactors;
      totalRisk: number;
      riskLevel: "LOW" | "MEDIUM" | "HIGH";
    };
    temporalAnalysis: {
      similarity: number;
      overlap: TemporalOverlap | null;
    };
    geographicAnalysis: {
      commonCountries: string[];
      newHighRisk: HighRiskLocation[];
    };
  };
}
