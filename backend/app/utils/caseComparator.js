const Case = require("../models/Case");
const { ANOMALY_THRESHOLDS } = require("./anomalyDetector");

const compareCases = async (caseId1, caseId2) => {
  const [case1, case2] = await Promise.all([
    Case.findById(caseId1).populate("accounts transactions").lean(),
    Case.findById(caseId2).populate("accounts transactions").lean(),
  ]);

  return {
    directLinks: await findDirectLinks(case1, case2),
    patternSimilarity: calculatePatternSimilarity(case1, case2),
    networkAnalysis: performNetworkAnalysis(case1, case2),
    riskAssessment: assessCombinedRisk(case1, case2),
    temporalAnalysis: compareTemporalPatterns(case1, case2),
    geographicAnalysis: compareGeographicData(case1, case2),
  };
};

// 1. Direct Links Detection
const findDirectLinks = async (case1, case2) => {
  const case1Accounts = new Set(case1.accounts.map((a) => a.accountNumber));
  const case2Accounts = new Set(case2.accounts.map((a) => a.accountNumber));

  const sharedAccounts = [...case1Accounts].filter((acc) =>
    case2Accounts.has(acc)
  );
  const sharedMetadata = {
    emails: findCommonMetadata(case1, case2, "email"),
    phones: findCommonMetadata(case2, case2, "mobile"),
    ips: findCommonMetadata(case1, case2, "ipAddress"),
  };

  const transactionLinks = case1.transactions.reduce((links, t1) => {
    case2.transactions.forEach((t2) => {
      if (t1.toAccount === t2.fromAccount) {
        links.push({
          path: [t1.fromAccount, t1.toAccount, t2.toAccount],
          totalAmount: t1.amount + t2.amount,
          transactions: [t1._id, t2._id],
          timeGap: timeDifference(t1.date, t2.date),
        });
      }
    });
    return links;
  }, []);

  return { sharedAccounts, sharedMetadata, transactionLinks };
};

// 2. Pattern Similarity Analysis
const calculatePatternSimilarity = (case1, case2) => ({
  highValue: calculateSimilarity(
    case1.anomalies.highValue.map((hv) => hv.amount),
    case2.anomalies.highValue.map((hv) => hv.amount)
  ),
  structuring: calculateSimilarity(
    case1.anomalies.structuring.map((s) => s.count),
    case2.anomalies.structuring.map((s) => s.count)
  ),
  circular: compareCircularPatterns(
    case1.anomalies.circular,
    case2.anomalies.circular
  ),
});

// 3. Network Analysis
const performNetworkAnalysis = (case1, case2) => {
  const allNodes = [
    ...case1.anomalies.network.nodes,
    ...case2.anomalies.network.nodes,
  ];
  const allEdges = [
    ...case1.anomalies.network.edges,
    ...case2.anomalies.network.edges,
  ];

  const connectorAccounts = allNodes.filter(
    (node) =>
      allEdges.filter((e) => e.from === node.account || e.to === node.account)
        .length > 10
  );

  const bridgeEdges = allEdges.filter(
    (edge) =>
      case1.accounts.some((a) => a.accountNumber === edge.from) &&
      case2.accounts.some((a) => a.accountNumber === edge.to)
  );

  return { connectorAccounts, bridgeEdges };
};

// 4. Risk Assessment
const assessCombinedRisk = (case1, case2) => {
  const riskFactors = {
    sharedAccounts:
      case1.accounts.filter((a) =>
        case2.accounts.some((a2) => a2.accountNumber === a.accountNumber)
      ).length * 15,
    highValueOverlap:
      case1.anomalies.highValue.filter((hv1) =>
        case2.anomalies.highValue.some((hv2) => hv2.amount >= hv1.amount * 0.8)
      ).length * 20,
    geographicRisk:
      [
        ...new Set([
          ...case1.anomalies.geographic.map((g) => g.country),
          ...case2.anomalies.geographic.map((g) => g.country),
        ]),
      ].filter((c) => ANOMALY_THRESHOLDS.HIGH_RISK_COUNTRIES.includes(c))
        .length * 25,
  };

  const totalRisk = Object.values(riskFactors).reduce(
    (sum, val) => sum + val,
    0
  );
  return {
    riskFactors,
    totalRisk,
    riskLevel:
      totalRisk > 200
        ? "CRITICAL"
        : totalRisk > 100
        ? "HIGH"
        : totalRisk > 50
        ? "MEDIUM"
        : "LOW",
  };
};

// 5. Temporal Analysis
const compareTemporalPatterns = (case1, case2) => {
  const case1Hours = getHourlyDistribution(case1.transactions);
  const case2Hours = getHourlyDistribution(case2.transactions);

  return {
    similarity: cosineSimilarity(case1Hours, case2Hours),
    overlap: getOverlappingPeriod(
      case1.transactions.map((t) => t.date),
      case2.transactions.map((t) => t.date)
    ),
  };
};

// 6. Geographic Analysis
const compareGeographicData = (case1, case2) => ({
  commonCountries: findCommonCountries(case1, case2),
  newHighRisk: findNewHighRiskCountries(case1, case2),
});

// Helper: Cosine Similarity Implementation
const cosineSimilarity = (a, b) => {
  const vecA = Array.isArray(a) ? a : Object.values(a);
  const vecB = Array.isArray(b) ? b : Object.values(b);

  const dotProduct = vecA.reduce(
    (sum, val, i) => sum + val * (vecB[i] || 0),
    0
  );
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));

  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

// Helper: Hourly Distribution Calculation
const getHourlyDistribution = (transactions) => {
  const distribution = Array(24).fill(0);
  transactions.forEach((t) => {
    const hour = new Date(t.date).getHours();
    distribution[hour]++;
  });
  return distribution;
};

// Helper: Find Common Metadata
const findCommonMetadata = (case1, case2, field) => {
  const values1 = case1.accounts.flatMap((a) => a.metadata[field] || []);
  const values2 = case2.accounts.flatMap((a) => a.metadata[field] || []);
  return [...new Set(values1.filter((v) => values2.includes(v)))];
};

// Helper: Compare Circular Patterns
const compareCircularPatterns = (circular1, circular2) => {
  const paths1 = circular1.map((c) => c.path.join("-"));
  const paths2 = circular2.map((c) => c.path.join("-"));
  return (
    paths1.filter((p) => paths2.includes(p)).length / Math.max(paths1.length, 1)
  );
};

module.exports = { compareCases };
