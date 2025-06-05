import { useParams } from "react-router-dom";
import { useAML } from "../hooks/useApi";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiShield,
  FiActivity,
  FiUsers,
  FiTrendingUp,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import { NetworkGraph } from "../components/DataDisplay/NetworkGraph";
import { RiskMeter } from "../components/DataDisplay/RiskMeter";
import { AnomalyTable } from "../components/DataDisplay/AnomalyTable";
import { GeographicMap } from "../components/DataDisplay/GeographicMap";
import { TransactionTimeline } from "../components/DataDisplay/TransactionTimeline";

interface NetworkData {
  nodes: any[];
  edges: any[];
}

export const Results = () => {
  const { caseId } = useParams();
  const { getCase } = useAML();
  const [caseData, setCaseData] = useState<any>(null);
  const [riskScore, setRiskScore] = useState(0);
  const [networkData, setNetworkData] = useState<NetworkData>({
    nodes: [],
    edges: [],
  });

  const generateNetworkData = (transactions: any[]) => {
    const accounts = new Set<string>();
    transactions.forEach((tx) => {
      accounts.add(tx.fromAccount);
      accounts.add(tx.toAccount);
    });

    const nodes = Array.from(accounts).map((account, index) => ({
      id: account,
      data: { label: account },
      position: { x: index * 200, y: 100 },
    }));

    const edges = transactions.map((tx, index) => ({
      id: `e${index}`,
      source: tx.fromAccount,
      target: tx.toAccount,
      label: `$${tx.amount}`,
    }));

    return { nodes, edges };
  };

  // Calculate risk score
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

  useEffect(() => {
    const loadData = async () => {
      if (caseId) {
        const data = await getCase(caseId);
        setCaseData(data);
        const network = generateNetworkData(data.transactions || []);
        setNetworkData(network);
        setRiskScore(calculateRiskScore(data));
      }
    };
    loadData();
  }, [caseId]);

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
      <div className="flex items-center justify-between mb-8">
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

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#17002E] border border-[#00ff9d] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FiActivity className="text-2xl text-[#00ff9d]" />
            <span className="text-xs text-green-400">+12%</span>
          </div>
          <h3 className="text-sm opacity-80 mb-1">Total Transactions</h3>
          <p className="text-2xl font-bold text-[#00ff9d]">
            {caseData.transactions?.length || 0}
          </p>
        </div>
        <div className="bg-[#17002E] border border-[#00ff9d] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FiUsers className="text-2xl text-[#00ff9d]" />
            <span className="text-xs text-green-400">+5%</span>
          </div>
          <h3 className="text-sm opacity-80 mb-1">Accounts Involved</h3>
          <p className="text-2xl font-bold text-[#00ff9d]">
            {
              new Set([
                ...(caseData.transactions?.map((t: any) => t.fromAccount) ||
                  []),
                ...(caseData.transactions?.map((t: any) => t.toAccount) || []),
              ]).size
            }
          </p>
        </div>
        <div className="bg-[#17002E] border border-red-400 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FiShield className="text-2xl text-red-400" />
            <span className="text-xs text-green-400">+23%</span>
          </div>
          <h3 className="text-sm opacity-80 mb-1">Anomalies Detected</h3>
          <p className="text-2xl font-bold text-red-400">
            {Array.isArray(caseData.anomalies)
              ? caseData.anomalies.reduce(
                  (sum: number, a: any) => sum + a.count,
                  0
                )
              : 0}
          </p>
        </div>
        <div className="bg-[#17002E] border border-[#00ff9d] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FiTrendingUp className="text-2xl text-[#00ff9d]" />
            <span className="text-xs text-green-400">+18%</span>
          </div>
          <h3 className="text-sm opacity-80 mb-1">Total Volume</h3>
          <p className="text-2xl font-bold text-[#00ff9d]">
            $
            {caseData.transactions
              ?.reduce((sum: number, t: any) => sum + t.amount, 0)
              .toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Network Graph Section */}
      <div className="mb-12 border-2 border-[#00ff9d] rounded-xl p-6 bg-[#17002E]">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiActivity className="mr-2" />
          Transaction Network
        </h2>
        <NetworkGraph
          nodes={networkData.nodes}
          edges={networkData.edges}
          height={400}
        />
      </div>

      {/* Geographic Map Section */}
      <div className="mb-12 border-2 border-[#00ff9d] rounded-xl p-6 bg-[#17002E]">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiMapPin className="mr-2" />
          Geographic Distribution
        </h2>
        <GeographicMap transactions={caseData.transactions || []} />
      </div>

      {/* Transaction Timeline Section */}
      <div className="mb-12 border-2 border-[#00ff9d] rounded-xl p-6 bg-[#17002E]">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiClock className="mr-2" />
          Transaction Timeline
        </h2>
        <TransactionTimeline transactions={caseData.transactions || []} />
      </div>

      {/* Anomaly Table Section */}
      <div className="mb-12 border-2 border-[#00ff9d] rounded-xl p-6 bg-[#17002E]">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiShield className="mr-2" />
          Detected Anomalies
        </h2>
        <AnomalyTable data={caseData.anomalies || []} />
      </div>
    </div>
  );
};
