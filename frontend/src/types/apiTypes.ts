export interface Transaction {
  fromAccount: string;
  toAccount: string;
  amount: number;
  date: string;
  metadata?: {
    ipCountry?: string;
  };
}
