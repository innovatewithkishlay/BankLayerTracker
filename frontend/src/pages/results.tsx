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
  FiMenu,
  FiX,
} from "react-icons/fi";

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
      className={`text-xl lg:text-2xl font-bold ${
        danger ? "text-red-400" : "text-[var(--cyber-accent)]"
      }`}
    >
      {value}
    </div>
  </div>
);

const MobileTabSelector = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeTabData = TABS.find((tab) => tab.key === activeTab);

  return (
    <div className="relative lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-[var(--cyber-card)] border border-[var(--cyber-border)] rounded-xl"
      >
        <div className="flex items-center gap-2">
          {activeTabData?.icon}
          <span className="font-semibold text-[var(--cyber-accent)]">
            {activeTabData?.label}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[var(--cyber-card)] border border-[var(--cyber-border)] rounded-xl z-50"
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 flex items-center gap-2 transition-colors ${
                  activeTab === tab.key
                    ? "text-[var(--cyber-accent)]"
                    : "text-gray-400 hover:bg-[var(--cyber-accent)]/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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

  const anomaliesArr = Array.isArray(caseData?.anomalies)
    ? caseData.anomalies
    : [];
  const transactionsArr = Array.isArray(caseData?.transactions)
    ? caseData.transactions
    : [];
  const accountsArr = Array.isArray(caseData?.accounts)
    ? caseData.accounts
    : [];

  const riskScore = caseData ? calculateRiskScore(caseData) : 0;

  if (loading || !caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cyber-bg)]">
        <div className="w-16 h-16 border-4 border-[var(--cyber-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const networkData = {
    nodes: accountsArr.map((acc: any) => ({
      id: acc.accountNumber,
      data: {
        label: acc.accountHolder || acc.accountNumber,
        accountNumber: acc.accountNumber,
      },
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
      data: {
        amount: tx.amount,
        date: tx.date,
        timestamp: tx.date,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--cyber-bg)] text-white">
      <div className="sticky top-0 z-10 bg-[var(--cyber-bg)]/95 backdrop-blur px-4 py-4 border-b border-[var(--cyber-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                {caseData.caseId}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg opacity-80 mt-1">
                {caseData.description || "AML Case Analysis"}
              </p>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-4">
                <RiskMeter
                  score={Math.round(riskScore)}
                  level={getRiskLevel(riskScore)}
                />
                <div className="flex flex-col">
                  <div className="text-xs opacity-60 mb-1">Risk Level</div>
                  <div
                    className={`text-lg lg:text-xl font-bold ${getRiskColor(
                      riskScore
                    )}`}
                  >
                    {getRiskLevel(riskScore)}
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    {Math.round(riskScore)}% Risk Score
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex border-b border-[var(--cyber-border)]">
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

          <MobileTabSelector
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-8">
          <div className="xl:col-span-1 order-2 xl:order-1">
            <SectionCard title="Key Metrics" icon={<FiGrid />} defaultOpen>
              <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
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

          <div className="xl:col-span-3 order-1 xl:order-2">
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
                    <div className="h-[400px] sm:h-[450px] lg:h-[500px]">
                      <TransactionTimeline transactions={transactionsArr} />
                    </div>
                  </SectionCard>
                  <SectionCard title="Top Anomalies" icon={<FiAlertTriangle />}>
                    <div className="overflow-x-auto">
                      <AnomalyTable data={anomaliesArr} />
                    </div>
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
                  <SectionCard
                    title="Transaction Network"
                    icon={<FiActivity />}
                  >
                    <div className="h-64 sm:h-80 lg:h-[500px]">
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
                    <div className="h-64 sm:h-80 lg:h-[500px]">
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
                    <div className="h-[400px] sm:h-[450px] lg:h-[500px]">
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
                    <div className="overflow-x-auto">
                      <AnomalyTable data={anomaliesArr} />
                    </div>
                  </SectionCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
