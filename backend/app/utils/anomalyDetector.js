const Transaction = require("../models/Transaction");
const Account = require("../models/Account");

const ANOMALY_THRESHOLDS = {
  HIGH_VALUE: 50000, // $50,000+ transactions
  RAPID_SUCCESSIVE: {
    // 5+ transactions in 10 mins
    count: 5,
    minutes: 10,
  },
  STRUCTURING_LIMIT: 10000, // Just below $10k transactions
  SMURFING_COUNT: 10, // >10 small txns in 24h
  NEW_ACCOUNT_DAYS: 7, // Accounts <7 days old
  NEW_ACCOUNT_HIGH_VALUE: 20000, // $20k+ from new accounts
  FREQUENT_SAME_ACCOUNTS: 5, // >5 txns between same accounts
  UNUSUAL_HOURS: [0, 4], // 12 AM - 4 AM
  HIGH_RISK_COUNTRIES: ["XX", "YY", "ZZ"],
};

// Main anomaly detection function
const detectAnomalies = async (caseId) => {
  try {
    const transactions = await Transaction.find({ caseId }).lean();
    const accounts = await Account.find({ caseId }).lean();

    const anomalies = {
      highValue: [],
      rapidSuccessive: [],
      structuring: [],
      geographic: [],
      circular: [],
    };

    // 1. High-Value Transactions
    transactions.forEach((txn) => {
      if (txn.amount >= ANOMALY_THRESHOLDS.HIGH_VALUE) {
        anomalies.highValue.push({
          transactionId: txn._id,
          amount: txn.amount,
          reason: `High-value transaction ($${txn.amount})`,
        });
      }
    });

    // 2. Rapid Successive Transactions (Layering)
    const accountTxns = {};
    transactions.forEach((txn) => {
      const key = txn.fromAccount;
      if (!accountTxns[key]) accountTxns[key] = [];
      accountTxns[key].push(txn);
    });

    for (const [account, txns] of Object.entries(accountTxns)) {
      txns.sort((a, b) => new Date(a.date) - new Date(b.date));
      for (let i = 1; i < txns.length; i++) {
        const prevDate = new Date(txns[i - 1].date);
        const currDate = new Date(txns[i].date);
        const diffMinutes = (currDate - prevDate) / (1000 * 60);

        if (
          i >= ANOMALY_THRESHOLDS.RAPID_SUCCESSIVE.count &&
          diffMinutes <= ANOMALY_THRESHOLDS.RAPID_SUCCESSIVE.minutes
        ) {
          anomalies.rapidSuccessive.push({
            account,
            transactions: txns.slice(0, i + 1).map((t) => t._id),
            reason: `${i + 1} transactions within ${diffMinutes.toFixed(
              1
            )} minutes`,
          });
          break;
        }
      }
    }

    // 3. Structuring (Just below reporting thresholds)
    const structuringAccounts = new Set();
    transactions.forEach((txn) => {
      if (
        txn.amount >= ANOMALY_THRESHOLDS.STRUCTURING_LIMIT * 0.9 &&
        txn.amount < ANOMALY_THRESHOLDS.STRUCTURING_LIMIT
      ) {
        structuringAccounts.add(txn.fromAccount);
      }
    });

    if (structuringAccounts.size > 0) {
      anomalies.structuring = Array.from(structuringAccounts).map((acc) => ({
        account: acc,
        reason: "Multiple transactions just below $10k threshold",
      }));
    }

    // 4. Geographic Mismatches
    accounts.forEach((acc) => {
      if (
        ANOMALY_THRESHOLDS.RISKY_COUNTRIES.includes(acc.metadata?.ipCountry)
      ) {
        anomalies.geographic.push({
          account: acc.accountNumber,
          country: acc.metadata.ipCountry,
          reason: "Linked to high-risk jurisdiction",
        });
      }
    });

    // 5. Circular Transactions (A -> B -> C -> A)
    const circular = detectCircularTransactions(transactions);
    anomalies.circular = circular;

    // Save flags to database
    await Transaction.bulkWrite(
      transactions.map((txn) => ({
        updateOne: {
          filter: { _id: txn._id },
          update: {
            $set: { isSuspicious: isTransactionFlagged(txn, anomalies) },
          },
        },
      }))
    );

    return anomalies;
  } catch (err) {
    console.error("Anomaly detection failed:", err);
    throw new Error("Anomaly detection failed");
  }
};

// Detect circular transactions
const detectCircularTransactions = (transactions) => {
  const graph = {};
  transactions.forEach((txn) => {
    if (!graph[txn.fromAccount]) graph[txn.fromAccount] = [];
    graph[txn.fromAccount].push(txn.toAccount);
  });

  const circular = [];
  for (const startAccount in graph) {
    const visited = new Set();
    const stack = [{ account: startAccount, path: [startAccount] }];

    while (stack.length > 0) {
      const { account, path } = stack.pop();
      if (visited.has(account)) continue;
      visited.add(account);

      for (const nextAccount of graph[account] || []) {
        if (path.includes(nextAccount)) {
          const cycle = path
            .slice(path.indexOf(nextAccount))
            .concat(nextAccount);
          circular.push({
            accounts: cycle,
            reason: "Circular transaction path",
          });
        } else {
          stack.push({ account: nextAccount, path: [...path, nextAccount] });
        }
      }
    }
  }
  return circular;
};
// Helper: Check if transaction is flagged
const isTransactionFlagged = (txn, anomalies) => {
  return (
    anomalies.highValue.some((t) => t.transactionId.equals(txn._id)) ||
    anomalies.rapidSuccessive.some((t) => t.transactions.includes(txn._id)) ||
    anomalies.circular.some((c) => c.accounts.includes(txn.fromAccount))
  );
};

module.exports = { detectAnomalies };
