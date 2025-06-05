import { useParams } from "react-router-dom";
import { useAML } from "../hooks/useApi";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiShield,
  FiAlertTriangle,
  FiActivity,
  FiUsers,
  FiTrendingUp,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import { NetworkGraph } from "../components/DataDisplay/NetworkGraph";
import { RiskMeter } from "../components/DataDisplay/RiskMeter";
import { AnomalySparkline } from "../components/DataDisplay/AnomalySparkline";
import { TransactionTimeline } from "../components/DataDisplay/TransactionTimeline";
import { GeographicMap } from "../components/DataDisplay/GeographicMap";

export const Results = () => {
  const { caseId } = useParams();
  const { getCase } = useAML();
  const [caseData, setCaseData] = useState<any>(null);
  const [riskScore, setRiskScore] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (caseId) {
        const data = await getCase(caseId);
        setCaseData(data);
        // Calculate overall risk score
        const score = calculateRiskScore(data);
        setRiskScore(score);
      }
    };
    loadData();
  }, [caseId]);

  const calculateRiskScore = (data: any) => {
    if (!data.transactions) return 0;

    let score = 0;
    const highValueTransactions = data.transactions.filter(
      (t: any) => t.amount > 50000
    );
    const structuringTransactions = data.transactions.filter(
      (t: any) => t.amount >= 9000 && t.amount <= 10000
    );

    score += highValueTransactions.length * 25;
    score += structuringTransactions.length * 15;

    return Math.min(score, 100);
  };

  if (!caseData) {
    return (
      <div className="h-screen bg-[#0A001A] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#00ff9d] border-t-transparent rounded-full"
        />
        <span className="ml-4 text-[#00ff9d] font-mono">
          Analyzing threat patterns...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A001A] text-[#00ff9d] p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-orbitron mb-2">
              THREAT ANALYSIS REPORT
            </h1>
            <p className="text-xl opacity-80">Case ID: {caseData.caseId}</p>
          </div>
          <div className="flex items-center space-x-4">
            <RiskMeter score={riskScore} />
            <div className="text-right">
              <p className="text-sm opacity-60">Risk Level</p>
              <p
                className={`text-2xl font-bold ${
                  riskScore > 75
                    ? "text-red-400"
                    : riskScore > 50
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {riskScore > 75
                  ? "CRITICAL"
                  : riskScore > 50
                  ? "HIGH"
                  : riskScore > 25
                  ? "MEDIUM"
                  : "LOW"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <MetricCard
          icon={<FiActivity />}
          title="Total Transactions"
          value={caseData.transactions?.length || 0}
          trend="+12%"
        />
        <MetricCard
          icon={<FiUsers />}
          title="Accounts Involved"
          value={
            new Set([
              ...(caseData.transactions?.map((t: any) => t.fromAccount) || []),
              ...(caseData.transactions?.map((t: any) => t.toAccount) || []),
            ]).size
          }
          trend="+5%"
        />
        <MetricCard
          icon={<FiAlertTriangle />}
          title="Anomalies Detected"
          value={
            caseData.anomalies?.reduce(
              (sum: number, a: any) => sum + a.count,
              0
            ) || 0
          }
          trend="+23%"
          isAlert
        />
        <MetricCard
          icon={<FiTrendingUp />}
          title="Total Volume"
          value={`$${
            caseData.transactions
              ?.reduce((sum: number, t: any) => sum + t.amount, 0)
              .toLocaleString() || 0
          }`}
          trend="+18%"
        />
      </motion.div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Network Visualization */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-[#17002E] border border-[#00ff9d] rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <FiMapPin className="mr-2" />
              Transaction Network Analysis
            </h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-[#00ff9d] text-[#0A001A] rounded text-sm">
                Force Layout
              </button>
              <button className="px-3 py-1 border border-[#00ff9d] rounded text-sm">
                Hierarchical
              </button>
            </div>
          </div>
          <NetworkGraph
            transactions={caseData.transactions || []}
            height={400}
          />
        </motion.div>

        {/* Anomaly Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#17002E] border border-[#00ff9d] rounded-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiShield className="mr-2" />
            Threat Patterns
          </h2>
          <div className="space-y-4">
            {caseData.anomalies?.map((anomaly: any, index: number) => (
              <AnomalyCard key={index} anomaly={anomaly} />
            )) || <p className="text-gray-400">No anomalies detected</p>}
          </div>
        </motion.div>
      </div>

      {/* Timeline and Geographic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#17002E] border border-[#00ff9d] rounded-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiClock className="mr-2" />
            Transaction Timeline
          </h2>
          <TransactionTimeline transactions={caseData.transactions || []} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#17002E] border border-[#00ff9d] rounded-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#17002E]">
                <tr className="border-b border-[#00ff9d]/30">
                  <th className="text-left py-2">From</th>
                  <th className="text-left py-2">To</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {caseData.transactions?.map((tx: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-[#00ff9d]/10 hover:bg-[#00ff9d]/5"
                  >
                    <td className="py-2">{tx.fromAccount}</td>
                    <td className="py-2">{tx.toAccount}</td>
                    <td
                      className={`py-2 font-bold ${
                        tx.amount > 50000 ? "text-red-400" : ""
                      }`}
                    >
                      ${tx.amount.toLocaleString()}
                    </td>
                    <td className="py-2">
                      {new Date(tx.date).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon, title, value, trend, isAlert = false }: any) => (
  <div
    className={`bg-[#17002E] border ${
      isAlert ? "border-red-400" : "border-[#00ff9d]"
    } rounded-xl p-6`}
  >
    <div className="flex items-center justify-between mb-2">
      <div
        className={`text-2xl ${isAlert ? "text-red-400" : "text-[#00ff9d]"}`}
      >
        {icon}
      </div>
      <span className="text-xs text-green-400">{trend}</span>
    </div>
    <h3 className="text-sm opacity-80 mb-1">{title}</h3>
    <p
      className={`text-2xl font-bold ${
        isAlert ? "text-red-400" : "text-[#00ff9d]"
      }`}
    >
      {value}
    </p>
  </div>
);

// Anomaly Card Component
const AnomalyCard = ({ anomaly }: any) => (
  <div className="border border-[#00ff9d]/30 rounded-lg p-4 hover:border-[#00ff9d] transition-colors">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold">{anomaly.type.replace("_", " ")}</h3>
      <span className="text-red-400 font-bold">{anomaly.count}</span>
    </div>
    <div className="w-full bg-[#0A001A] rounded-full h-2">
      <div
        className="bg-gradient-to-r from-[#00ff9d] to-red-400 h-2 rounded-full"
        style={{ width: `${Math.min(anomaly.count * 20, 100)}%` }}
      />
    </div>
  </div>
);
