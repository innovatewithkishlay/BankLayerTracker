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
      smurfing: [],
      unusualTime: [],
      rapidMovement: [],
      newAccountLargeTxn: [],
      frequentTransactions: [],
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

    // 2. Rapid Successive Transactions
    const accountTxns = {};
    transactions.forEach((txn) => {
      accountTxns[txn.fromAccount] = [
        ...(accountTxns[txn.fromAccount] || []),
        txn,
      ];
    });

    for (const [account, txns] of Object.entries(accountTxns)) {
      txns.sort((a, b) => new Date(a.date) - new Date(b.date));
      for (let i = 1; i < txns.length; i++) {
        const diffMinutes =
          (new Date(txns[i].date) - new Date(txns[i - 1].date)) / (1000 * 60);
        if (
          i >= ANOMALY_THRESHOLDS.RAPID_SUCCESSIVE.count &&
          diffMinutes <= ANOMALY_THRESHOLDS.RAPID_SUCCESSIVE.minutes
        ) {
          anomalies.rapidSuccessive.push({
            account,
            transactions: txns.slice(0, i + 1).map((t) => t._id),
            reason: `${i + 1} txns in ${diffMinutes.toFixed(1)} mins`,
          });
          break;
        }
      }
    }

    // 3. Structuring Detection
    const structuringAccounts = new Set();
    transactions.forEach((txn) => {
      if (
        txn.amount >= ANOMALY_THRESHOLDS.STRUCTURING_LIMIT * 0.9 &&
        txn.amount < ANOMALY_THRESHOLDS.STRUCTURING_LIMIT
      ) {
        structuringAccounts.add(txn.fromAccount);
      }
    });
    anomalies.structuring = [...structuringAccounts].map((acc) => ({
      account: acc,
      reason: "Multiple just-below-$10k txns",
    }));

    // 4. Geographic Risk
    accounts.forEach((acc) => {
      if (
        ANOMALY_THRESHOLDS.HIGH_RISK_COUNTRIES.includes(acc.metadata?.ipCountry)
      ) {
        anomalies.geographic.push({
          account: acc.accountNumber,
          country: acc.metadata.ipCountry,
          reason: "High-risk jurisdiction",
        });
      }
    });

    // 5. Circular Transactions
    anomalies.circular = detectCircularTransactions(transactions);

    // 6. Smurfing Detection
    const smurfingMap = {};
    transactions.forEach((txn) => {
      if (txn.amount < ANOMALY_THRESHOLDS.STRUCTURING_LIMIT) {
        const key = txn.fromAccount;
        smurfingMap[key] = (smurfingMap[key] || 0) + 1;
      }
    });
    for (const [account, count] of Object.entries(smurfingMap)) {
      if (count > ANOMALY_THRESHOLDS.SMURFING_COUNT) {
        anomalies.smurfing.push({
          account,
          count,
          reason: `${count} small txns in 24h`,
        });
      }
    }

    // 7. Unusual Time Transactions
    transactions.forEach((txn) => {
      const hour = new Date(txn.date).getHours();
      if (
        hour >= ANOMALY_THRESHOLDS.UNUSUAL_HOURS[0] &&
        hour <= ANOMALY_THRESHOLDS.UNUSUAL_HOURS[1]
      ) {
        anomalies.unusualTime.push({
          transactionId: txn._id,
          hour,
          reason: "Txn between 12AM-4AM",
        });
      }
    });

    // 8. Rapid Fund Movement
    const movementPaths = detectRapidMovement(transactions);
    anomalies.rapidMovement = movementPaths;

    // 9. New Account Large Transactions
    const now = new Date();
    const accountMap = accounts.reduce((map, acc) => {
      map[acc.accountNumber] = acc;
      return map;
    }, {});

    transactions.forEach((txn) => {
      const acc = accountMap[txn.fromAccount];
      if (acc?.createdAt) {
        const ageDays = (now - new Date(acc.createdAt)) / (1000 * 60 * 60 * 24);
        if (
          ageDays <= ANOMALY_THRESHOLDS.NEW_ACCOUNT_DAYS &&
          txn.amount > ANOMALY_THRESHOLDS.NEW_ACCOUNT_HIGH_VALUE
        ) {
          anomalies.newAccountLargeTxn.push({
            account: txn.fromAccount,
            amount: txn.amount,
            reason: `New account (${ageDays.toFixed(1)} days) large txn`,
          });
        }
      }
    });

    // 10. Frequent Same-Account Transactions
    const pairCounts = {};
    transactions.forEach((txn) => {
      const key = `${txn.fromAccount}-${txn.toAccount}`;
      pairCounts[key] = (pairCounts[key] || 0) + 1;
    });
    for (const [pair, count] of Object.entries(pairCounts)) {
      if (count > ANOMALY_THRESHOLDS.FREQUENT_SAME_ACCOUNTS) {
        anomalies.frequentTransactions.push({
          accounts: pair.split("-"),
          count,
          reason: `Frequent txns (${count} times)`,
        });
      }
    }

    await Transaction.bulkWrite(
      transactions.map((txn) => ({
        updateOne: {
          filter: { _id: txn._id },
          update: {
            $set: {
              isSuspicious: isTransactionFlagged(txn, anomalies),
            },
          },
        },
      }))
    );

    return anomalies;
  } catch (err) {
    console.error("Detection failed:", err);
    throw new Error("Anomaly detection failed");
  }
};

// Detect circular transactions (A→B→C→A)
const detectCircularTransactions = (transactions) => {
  const graph = {};
  const visited = new Set();
  const circularPaths = new Set();

  // 1. Build transaction graph
  transactions.forEach((txn) => {
    if (!graph[txn.fromAccount]) graph[txn.fromAccount] = [];
    graph[txn.fromAccount].push(txn.toAccount);
  });

  // 2. Depth-First Search (DFS) to find cycles
  const dfs = (account, path = []) => {
    if (path.includes(account)) {
      const cycleStart = path.indexOf(account);
      const cycle = path.slice(cycleStart).concat(account);

      const sortedCycle = [...new Set(cycle)].sort().join("-");
      if (!circularPaths.has(sortedCycle)) {
        circularPaths.add(sortedCycle);
        return [{ accounts: cycle, reason: "Circular transaction path" }];
      }
      return [];
    }

    if (visited.has(account)) return [];
    visited.add(account);

    let cycles = [];
    for (const neighbor of graph[account] || []) {
      cycles = cycles.concat(dfs(neighbor, [...path, account]));
    }

    visited.delete(account);
    return cycles;
  };

  // 3. Check cycles for all accounts
  return Object.keys(graph).reduce((acc, account) => {
    return acc.concat(dfs(account));
  }, []);
};

// Detect rapid fund movement (A→B→C in <1 hour)
const detectRapidMovement = (transactions) => {
  const accountPaths = {};
  const anomalies = [];

  // 1. Group transactions by initial account and sort by time
  transactions.forEach((txn) => {
    const key = txn.fromAccount;
    if (!accountPaths[key]) accountPaths[key] = [];
    accountPaths[key].push({
      toAccount: txn.toAccount,
      timestamp: new Date(txn.date).getTime(),
    });
  });

  // 2. Check paths for rapid movement
  Object.entries(accountPaths).forEach(([startAccount, txns]) => {
    txns.sort((a, b) => a.timestamp - b.timestamp);

    let paths = {};
    txns.forEach((txn) => {
      const newPaths = {};

      Object.entries(paths).forEach(([currentAccount, { path, startTime }]) => {
        if (currentAccount === txn.toAccount) return;

        const newPath = [...path, txn.toAccount];
        const timeDiffHours = (txn.timestamp - startTime) / (1000 * 60 * 60);

        if (timeDiffHours <= 1) {
          if (newPath.length >= 3) {
            anomalies.push({
              path: newPath,
              duration: timeDiffHours.toFixed(2),
              reason: `Funds moved through ${
                newPath.length
              } accounts in ${timeDiffHours.toFixed(2)}h`,
            });
          }
          newPaths[txn.toAccount] = { path: newPath, startTime };
        }
      });

      if (!paths[txn.toAccount]) {
        newPaths[txn.toAccount] = {
          path: [startAccount, txn.toAccount],
          startTime: txn.timestamp,
        };
      }

      paths = { ...paths, ...newPaths };
    });
  });

  return anomalies;
};

const isTransactionFlagged = (txn, anomalies) => {
  return [
    "highValue",
    "rapidSuccessive",
    "structuring",
    "smurfing",
    "unusualTime",
    "rapidMovement",
    "newAccountLargeTxn",
    "frequentTransactions",
  ].some((type) =>
    anomalies[type].some(
      (anomaly) =>
        anomaly.transactionId?.equals?.(txn._id) ||
        anomaly.accounts?.includes(txn.fromAccount) ||
        anomaly.account === txn.fromAccount
    )
  );
};

module.exports = { detectAnomalies };
