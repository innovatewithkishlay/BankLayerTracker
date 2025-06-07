import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAML } from "../hooks/useApi";
import { NetworkGraph } from "../components/DataDisplay/NetworkGraph";
import { RiskMeter } from "../components/DataDisplay/RiskMeter";
import { AnomalyTable } from "../components/DataDisplay/AnomalyTable";
import { GeographicMap } from "../components/DataDisplay/GeographicMap";
import { TransactionTimeline } from "../components/DataDisplay/TransactionTimeline";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiActivity,
  FiMap,
  FiClock,
  FiAlertTriangle,
  FiChevronDown,
} from "react-icons/fi";

// Risk calculation helpers (matches your old working version)
const getRiskLevel = (score: number): "LOW" | "MEDIUM" | "HIGH" => {
  if (score > 75) return "HIGH";
  if (score > 50) return "MEDIUM";
  return "LOW";
};

const getRiskColor = (score: number) => {
  if (score > 75) return "text-red-400";
  if (score > 50) return "text-yellow-400";
  return "text-green-400";
};

// YOUR OLD WORKING RISK CALCULATION
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

const TABS = [
  { key: "overview", label: "Overview", icon: <FiGrid /> },
  { key: "network", label: "Network", icon: <FiActivity /> },
  { key: "geography", label: "Geography", icon: <FiMap /> },
  { key: "timeline", label: "Timeline", icon: <FiClock /> },
  { key: "anomalies", label: "Anomalies", icon: <FiAlertTriangle /> },
];

const SectionCard = ({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-[var(--cyber-card)]/80 rounded-xl border border-[var(--cyber-border)] shadow-lg">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center justify-between w-full p-4 hover:bg-[var(--cyber-accent)]/5 rounded-t-xl transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MetricCard = ({
  label,
  value,
  trend,
  danger = false,
}: {
  label: string;
  value: string | number | undefined;
  trend?: string;
  danger?: boolean;
}) => (
  <div className="p-4 rounded-lg bg-[var(--cyber-bg)] border border-[var(--cyber-border)] flex flex-col">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs text-gray-400">{label}</span>
      {trend && (
        <span
          className={`text-xs ${danger ? "text-red-400" : "text-green-400"}`}
        >
          {trend}
        </span>
      )}
    </div>
    <div
      className={`text-2xl font-bold ${
        danger ? "text-red-400" : "text-[var(--cyber-accent)]"
      }`}
    >
      {value}
    </div>
  </div>
);

export const Results = () => {
  const { caseId } = useParams();
  const { getCase } = useAML();
  const [activeTab, setActiveTab] = useState("overview");
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCase(caseId!)
      .then((data) => setCaseData(data))
      .finally(() => setLoading(false));
  }, [caseId]);

  // Safe guards for arrays
  const anomaliesArr = Array.isArray(caseData?.anomalies)
    ? caseData.anomalies
    : [];
  const transactionsArr = Array.isArray(caseData?.transactions)
    ? caseData.transactions
    : [];
  const accountsArr = Array.isArray(caseData?.accounts)
    ? caseData.accounts
    : [];

  // USE YOUR OLD WORKING RISK CALCULATION
  const riskScore = caseData ? calculateRiskScore(caseData) : 0;

  if (loading || !caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cyber-bg)]">
        <div className="w-16 h-16 border-4 border-[var(--cyber-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Example: build networkData from your caseData
  const networkData = {
    nodes: accountsArr.map((acc: any) => ({
      id: acc.accountNumber,
      data: { label: acc.accountHolder || acc.accountNumber },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: {
        border: "2px solid var(--cyber-accent)",
        background: "var(--cyber-card)",
        color: "var(--cyber-accent)",
      },
    })),
    edges: transactionsArr.map((tx: any, i: number) => ({
      id: `e${i}`,
      source: tx.fromAccount,
      target: tx.toAccount,
      label: `$${tx.amount}`,
      animated: true,
      style: { stroke: "var(--cyber-accent)" },
      labelStyle: { fill: "var(--cyber-accent)", fontWeight: 700 },
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--cyber-bg)] text-white">
      {/* Sticky Summary Header */}
      <div className="sticky top-0 z-10 bg-[var(--cyber-bg)]/95 backdrop-blur px-4 py-4 border-b border-[var(--cyber-border)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Case {caseData.caseId}
            </h1>
            <p className="text-base sm:text-lg opacity-80">
              {caseData.description || "AML Case Analysis"}
            </p>
          </div>
          <div className="flex items-center gap-6 mt-3 sm:mt-0">
            <div className="flex flex-col items-center">
              <RiskMeter
                score={Math.round(riskScore)}
                level={getRiskLevel(riskScore)}
              />
              <div className="mt-2 text-center">
                <div className="text-xs opacity-60">Risk Level</div>
                <div className={`text-xl font-bold ${getRiskColor(riskScore)}`}>
                  {getRiskLevel(riskScore)}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--cyber-border)] mt-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 flex items-center gap-2 font-semibold transition-colors ${
                activeTab === tab.key
                  ? "text-[var(--cyber-accent)] border-b-2 border-[var(--cyber-accent)]"
                  : "text-gray-400 hover:bg-[var(--cyber-accent)]/5"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Key Metrics Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <SectionCard title="Key Metrics" icon={<FiGrid />} defaultOpen>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                label="Total Transactions"
                value={transactionsArr.length}
                trend="+12%"
              />
              <MetricCard
                label="Accounts Involved"
                value={accountsArr.length}
                trend="+5%"
              />
              <MetricCard
                label="Total Volume"
                value={`$${transactionsArr
                  .reduce((s: number, t: any) => s + t.amount, 0)
                  .toLocaleString()}`}
                trend="+18%"
              />
              <MetricCard
                label="Anomalies"
                value={anomaliesArr.length}
                trend="+23%"
                danger
              />
            </div>
          </SectionCard>
        </div>

        {/* Main Visualization Area */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <SectionCard title="Risk Overview" icon={<FiActivity />}>
                  <div className="h-64">
                    <TransactionTimeline transactions={transactionsArr} />
                  </div>
                </SectionCard>
                <SectionCard title="Top Anomalies" icon={<FiAlertTriangle />}>
                  <AnomalyTable data={anomaliesArr} />
                </SectionCard>
              </motion.div>
            )}

            {activeTab === "network" && (
              <motion.div
                key="network"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SectionCard title="Transaction Network" icon={<FiActivity />}>
                  <div className="h-[500px]">
                    <NetworkGraph
                      nodes={networkData.nodes}
                      edges={networkData.edges}
                    />
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {activeTab === "geography" && (
              <motion.div
                key="geography"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SectionCard title="Geographic Analysis" icon={<FiMap />}>
                  <div className="h-[500px]">
                    <GeographicMap transactions={transactionsArr} />
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {activeTab === "timeline" && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SectionCard title="Transaction Timeline" icon={<FiClock />}>
                  <div className="h-64">
                    <TransactionTimeline transactions={transactionsArr} />
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {activeTab === "anomalies" && (
              <motion.div
                key="anomalies"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SectionCard
                  title="Detected Anomalies"
                  icon={<FiAlertTriangle />}
                >
                  <AnomalyTable data={anomaliesArr} />
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
