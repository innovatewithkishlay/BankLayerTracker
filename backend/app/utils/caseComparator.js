const Case = require("../models/Case");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

const compareCaseData = async (caseId1, caseId2) => {
  const [case1, case2] = await Promise.all([
    Case.findById(caseId1).populate("accounts transactions"),
    Case.findById(caseId2).populate("accounts transactions"),
  ]);

  // 1. Direct Account Matches
  const case1Accounts = case1.accounts.map((a) => a.accountNumber);
  const case2Accounts = case2.accounts.map((a) => a.accountNumber);
  const sharedAccounts = case1Accounts.filter((acc) =>
    case2Accounts.includes(acc)
  );

  // 2. Metadata Matches (email, phone, IP)
  const metadataMatches = {
    emails: findCommonMetadata(case1, case2, "email"),
    phones: findCommonMetadata(case1, case2, "mobile"),
    ips: findCommonMetadata(case1, case2, "ipAddress"),
  };

  // 3. Transaction Links (A→B in Case1, B→C in Case2)
  const transactionLinks = findTransactionLinks(case1, case2);

  // 4. Shared Anomaly Patterns
  const sharedAnomalies = {
    highValue: compareAnomalyType(case1, case2, "highValue"),
    structuring: compareAnomalyType(case1, case2, "structuring"),
  };

  return {
    sharedAccounts,
    metadataMatches,
    transactionLinks,
    sharedAnomalies,
  };
};

// Helper: Find common metadata values
const findCommonMetadata = (case1, case2, field) => {
  const values1 = case1.accounts.flatMap((a) => a.metadata[field] || []);
  const values2 = case2.accounts.flatMap((a) => a.metadata[field] || []);
  return [...new Set(values1.filter((v) => values2.includes(v)))];
};

// Helper: Find transaction chains across cases
const findTransactionLinks = (case1, case2) => {
  const links = [];
  case1.transactions.forEach((t1) => {
    case2.transactions.forEach((t2) => {
      if (t1.toAccount === t2.fromAccount) {
        links.push({
          path: [t1.fromAccount, t1.toAccount, t2.toAccount],
          amount: t1.amount + t2.amount,
          case1Transaction: t1._id,
          case2Transaction: t2._id,
        });
      }
    });
  });
  return links;
};
