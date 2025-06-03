const Transaction = require("../models/Transaction");
const Account = require("../models/Account");

const ANOMALY_THRESHOLDS = {
  HIGH_VALUE: 50000, // $50,000+ transactions
  RAPID_SUCCESSIVE: { count: 5, minutes: 10 }, // 5+ transactions in 10 mins
  STRUCTURING_LIMIT: 10000, // Multiple just-below-$10k transactions
  RISKY_COUNTRIES: ["XX", "YY", "ZZ"], // High-risk country codes
};
