const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const Case = require("../models/Case");
const ANOMALY_THRESHOLDS = require("../../config/thresholds");

const detectAnomalies = async (caseId) => {
  try {
    const transactions = await Transaction.find({ caseId }).lean();
    const accounts = await Account.find({ caseId }).lean();
    const now = new Date();

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
      network: { nodes: [], edges: [] },
    };

    // 1. High-Value Transactions
    transactions.forEach((txn) => {
      if (txn.amount >= ANOMALY_THRESHOLDS.HIGH_VALUE) {
        anomalies.highValue.push({
          transactionId: txn._id,
          amount: txn.amount,
          fromAccount: txn.fromAccount,
          toAccount: txn.toAccount,
          date: txn.date,
        });
      }
    });

    // 2. Rapid Successive Transactions
    const accountTxnsMap = transactions.reduce((acc, txn) => {
      acc[txn.fromAccount] = [...(acc[txn.fromAccount] || []), txn];
      return acc;
    }, {});

    Object.entries(accountTxnsMap).forEach(([account, txns]) => {
      txns.sort((a, b) => new Date(a.date) - new Date(b.date));
      for (
        let i = ANOMALY_THRESHOLDS.RAPID_SUCCESSIVE.count;
        i < txns.length;
        i++
      ) {
        const timeDiff =
          (new Date(txns[i].date) -
            new Date(
              txns[i - ANOMALY_THRESHOLDS.RAPID_SUCCESSIVE.count].date
            )) /
          60000;
        if (timeDiff <= ANOMALY_THRESHOLDS.RAPID_SUCCESSIVE.minutes) {
          anomalies.rapidSuccessive.push({
            account,
            transactions: txns
              .slice(i - ANOMALY_THRESHOLDS.RAPID_SUCCESSIVE.count, i + 1)
              .map((t) => t._id),
            reason: `Rapid successive transactions: ${
              ANOMALY_THRESHOLDS.RAPID_SUCCESSIVE.count + 1
            } txns in ${timeDiff.toFixed(1)} mins`,
          });
        }
      }
    });

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
    anomalies.structuring = [...structuringAccounts].map((account) => ({
      account,
      reason: "Structuring pattern detected",
    }));

    // 4. Geographic Risk
    anomalies.geographic = accounts
      .filter((acc) =>
        ANOMALY_THRESHOLDS.HIGH_RISK_COUNTRIES.includes(acc.metadata?.ipCountry)
      )
      .map((acc) => ({
        account: acc.accountNumber,
        country: acc.metadata.ipCountry,
        reason: "High-risk jurisdiction",
      }));

    // 5. Circular Transactions
    const graph = {};
    const circularPaths = [];
    transactions.forEach((txn) => {
      if (!graph[txn.fromAccount]) graph[txn.fromAccount] = [];
      graph[txn.fromAccount].push(txn.toAccount);
    });

    const findCycles = (account, path = []) => {
      if (path.includes(account)) {
        const cycleStart = path.indexOf(account);
        circularPaths.push({
          path: path.slice(cycleStart).concat(account),
          reason: "Circular transaction path",
        });
        return;
      }
      graph[account]?.forEach((nextAccount) => {
        findCycles(nextAccount, [...path, account]);
      });
    };
    Object.keys(graph).forEach((account) => findCycles(account));
    anomalies.circular = circularPaths;

    // 6. Smurfing Detection
    const smurfingCounts = transactions.reduce((acc, txn) => {
      if (txn.amount < ANOMALY_THRESHOLDS.STRUCTURING_LIMIT) {
        acc[txn.fromAccount] = (acc[txn.fromAccount] || 0) + 1;
      }
      return acc;
    }, {});
    Object.entries(smurfingCounts).forEach(([account, count]) => {
      if (count > ANOMALY_THRESHOLDS.SMURFING_COUNT) {
        anomalies.smurfing.push({
          account,
          count,
          reason: `Smurfing detected: ${count} small transactions`,
        });
      }
    });

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
          reason: "Unusual time transaction (12AM-4AM)",
        });
      }
    });

    // 8. Rapid Fund Movement
    const accountPaths = transactions.reduce((acc, txn) => {
      acc[txn.fromAccount] = [...(acc[txn.fromAccount] || []), txn];
      return acc;
    }, {});
    Object.values(accountPaths).forEach((txns) => {
      txns.sort((a, b) => new Date(a.date) - new Date(b.date));
      for (let i = 2; i < txns.length; i++) {
        const timeDiffHours =
          (new Date(txns[i].date) - new Date(txns[i - 2].date)) / 3600000;
        if (timeDiffHours <= 1) {
          anomalies.rapidMovement.push({
            path: [
              txns[i - 2].fromAccount,
              txns[i - 1].toAccount,
              txns[i].toAccount,
            ],
            reason: `Rapid movement: 3 accounts in ${timeDiffHours.toFixed(
              2
            )} hours`,
          });
        }
      }
    });

    // 9. New Account Large Transactions
    const accountCreationMap = accounts.reduce((accumulator, account) => {
      accumulator[account.accountNumber] = account.createdAt;
      return accumulator;
    }, {});
    transactions.forEach((txn) => {
      const accCreationDate = accountCreationMap[txn.fromAccount];
      if (accCreationDate) {
        const ageDays = (now - new Date(accCreationDate)) / (1000 * 3600 * 24);
        if (
          ageDays <= ANOMALY_THRESHOLDS.NEW_ACCOUNT_DAYS &&
          txn.amount > ANOMALY_THRESHOLDS.NEW_ACCOUNT_HIGH_VALUE
        ) {
          anomalies.newAccountLargeTxn.push({
            account: txn.fromAccount,
            amount: txn.amount,
            reason: `New account (${ageDays.toFixed(
              1
            )} days) large transaction`,
          });
        }
      }
    });

    // 10. Frequent Same-Account Transactions
    const pairCounts = transactions.reduce((acc, txn) => {
      const key = `${txn.fromAccount}-${txn.toAccount}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    Object.entries(pairCounts).forEach(([pair, count]) => {
      if (count > ANOMALY_THRESHOLDS.FREQUENT_SAME_ACCOUNTS) {
        anomalies.frequentTransactions.push({
          accounts: pair.split("-"),
          count,
          reason: `Frequent transactions between accounts (${count}x)`,
        });
      }
    });

    anomalies.network.nodes = accounts.map((acc) => ({
      account: acc.accountNumber,
      riskScore: calculateRiskScore(acc, transactions),
    }));

    anomalies.network.edges = transactions.map((txn) => ({
      from: txn.fromAccount,
      to: txn.toAccount,
      totalAmount: txn.amount,
      transactionCount: 1,
    }));

    const edgeMap = anomalies.network.edges.reduce((acc, edge) => {
      const key = `${edge.from}-${edge.to}`;
      if (acc[key]) {
        acc[key].totalAmount += edge.totalAmount;
        acc[key].transactionCount++;
      } else {
        acc[key] = { ...edge };
      }
      return acc;
    }, {});
    anomalies.network.edges = Object.values(edgeMap);

    await Case.findByIdAndUpdate(caseId, {
      $set: { anomalies },
    });

    await Transaction.bulkWrite(
      transactions.map((txn) => ({
        updateOne: {
          filter: { _id: txn._id },
          update: {
            $set: {
              isSuspicious: [
                anomalies.highValue,
                anomalies.rapidSuccessive,
                anomalies.structuring,
                anomalies.smurfing,
                anomalies.unusualTime,
                anomalies.rapidMovement,
                anomalies.newAccountLargeTxn,
                anomalies.frequentTransactions,
              ].some((arr) => arr.some((a) => a.transactionId === txn._id)),
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

const calculateRiskScore = (account, transactions) => {
  let score = 50;
  const accTxns = transactions.filter(
    (t) => t.fromAccount === account.accountNumber
  );

  const ageDays =
    (new Date() - new Date(account.createdAt)) / (1000 * 3600 * 24);
  if (ageDays < 7) score += 20;

  if (
    ANOMALY_THRESHOLDS.HIGH_RISK_COUNTRIES.includes(account.metadata?.ipCountry)
  )
    score += 30;

  if (accTxns.length > 10) score += 10;
  if (accTxns.some((t) => t.amount >= ANOMALY_THRESHOLDS.HIGH_VALUE))
    score += 20;

  return Math.min(score, 100);
};

const detectCircularTransactions = (transactions) => {
  const graph = {};
  const visited = new Set();
  const circularPaths = new Set();

  transactions.forEach((txn) => {
    if (!graph[txn.fromAccount]) graph[txn.fromAccount] = [];
    graph[txn.fromAccount].push(txn.toAccount);
  });

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

  return Object.keys(graph).reduce((acc, account) => {
    return acc.concat(dfs(account));
  }, []);
};

const detectRapidMovement = (transactions) => {
  const accountPaths = {};
  const anomalies = [];

  transactions.forEach((txn) => {
    const key = txn.fromAccount;
    if (!accountPaths[key]) accountPaths[key] = [];
    accountPaths[key].push({
      toAccount: txn.toAccount,
      timestamp: new Date(txn.date).getTime(),
    });
  });

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
