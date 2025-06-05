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

export interface CaseComparison {
  directLinks: {
    sharedAccounts: string[];
    transactionLinks: Array<{
      path: string[];
      totalAmount: number;
    }>;
  };
  riskAssessment: {
    totalRisk: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  };
}
