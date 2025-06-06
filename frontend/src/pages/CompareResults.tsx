import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAML } from "../hooks/useApi";
import { CaseComparison } from "../types/apiTypes";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertTriangle,
  FiClock,
  FiGlobe,
  FiLink,
  FiActivity,
  FiUser,
  FiSmartphone,
  FiAtSign,
  FiServer,
} from "react-icons/fi";
import { RiskMeter } from "../components/DataDisplay/RiskMeter";

export const CompareResults = () => {
  const { case1Id, case2Id } = useParams<{
    case1Id: string;
    case2Id: string;
  }>();
  const { compareCases } = useAML();
  const [comparisonData, setComparisonData] = useState<CaseComparison | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComparison = async () => {
      if (!case1Id || !case2Id) {
        setError("Invalid case IDs");
        setIsLoading(false);
        return;
      }

      try {
        const data = await compareCases(case1Id, case2Id);
        setComparisonData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load comparison"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadComparison();
  }, [case1Id, case2Id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#151515] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#00ff9d] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#151515] flex items-center justify-center text-red-400">
        <FiAlertTriangle className="mr-2" /> {error}
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#151515] flex items-center justify-center text-gray-400">
        No comparison data found
      </div>
    );
  }

  // Helper functions
  const getMetadataItems = (items: string[], icon: React.ReactNode) => (
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 text-gray-300"
        >
          {icon}
          <span className="font-mono text-sm">{item}</span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#151515] text-[#00ff9d] p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] bg-clip-text text-transparent">
          Cross-Case Intelligence
        </h1>
        <p className="text-gray-400 font-mono">
          Analyzing connections between Case {case1Id} and Case {case2Id}
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Risk Overview Card */}
        <Section title="Risk Overview" icon={<FiActivity />}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1">
              <RiskMeter
                score={comparisonData.comparison.riskAssessment.totalRisk || 0}
                level={
                  comparisonData.comparison.riskAssessment.riskLevel || "LOW"
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4 col-span-2">
              <InfoCard
                icon={<FiUser />}
                label="Shared Accounts"
                value={
                  comparisonData.comparison.riskAssessment.riskFactors
                    .sharedAccounts
                }
                unit="accounts"
              />
              <InfoCard
                icon={<FiLink />}
                label="High Value Links"
                value={
                  comparisonData.comparison.riskAssessment.riskFactors
                    .highValueOverlap
                }
                unit="transactions"
              />
              <InfoCard
                icon={<FiGlobe />}
                label="Geo Risk"
                value={
                  comparisonData.comparison.riskAssessment.riskFactors
                    .geographicRisk
                }
                unit="points"
              />
            </div>
          </div>
        </Section>

        {/* Connection Map */}
        <Section title="Connection Map" icon={<FiLink />}>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Shared Accounts */}
            <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-[#00ff9d]/20">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <FiUser className="text-[#00ff9d]" />
                <span>Shared Accounts</span>
              </h3>
              {comparisonData.comparison.directLinks.sharedAccounts.length >
              0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {comparisonData.comparison.directLinks.sharedAccounts.map(
                    (account) => (
                      <span
                        key={account}
                        className="font-mono px-3 py-1.5 bg-[#00ff9d]/10 rounded-full"
                      >
                        {account}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <div className="text-gray-400">No shared accounts found</div>
              )}
            </div>

            {/* Shared Metadata */}
            <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-[#00ff9d]/20">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <FiServer className="text-[#00ff9d]" />
                <span>Digital Footprint</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetadataSection
                  icon={<FiAtSign className="text-[#00ff9d]" />}
                  title="Emails"
                  items={
                    comparisonData.comparison.directLinks.sharedMetadata.emails
                  }
                />
                <MetadataSection
                  icon={<FiSmartphone className="text-[#00ff9d]" />}
                  title="Phones"
                  items={
                    comparisonData.comparison.directLinks.sharedMetadata.phones
                  }
                />
                <MetadataSection
                  icon={<FiGlobe className="text-[#00ff9d]" />}
                  title="IPs"
                  items={
                    comparisonData.comparison.directLinks.sharedMetadata.ips
                  }
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Transaction Network */}
        <Section title="Transaction Network" icon={<FiGlobe />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bridge Transactions */}
            <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-[#00ff9d]/20">
              <h3 className="text-lg font-bold mb-4">Bridge Transactions</h3>
              <div className="space-y-3">
                {comparisonData.comparison.networkAnalysis.bridgeEdges.map(
                  (edge, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-[#00ff9d]/5 rounded-lg border border-[#00ff9d]/10"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-mono">
                          {edge.from} → {edge.to}
                        </div>
                        <div className="text-[#00ff9d]">
                          ${edge.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </div>

            {/* Temporal Patterns */}
            <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-[#00ff9d]/20">
              <h3 className="text-lg font-bold mb-4">Temporal Patterns</h3>
              {comparisonData.comparison.temporalAnalysis.overlap ? (
                <div className="space-y-4">
                  <InfoCard
                    icon={<FiClock />}
                    label="Overlap Period"
                    value={`${new Date(
                      comparisonData.comparison.temporalAnalysis.overlap.start
                    ).toLocaleDateString()} - ${new Date(
                      comparisonData.comparison.temporalAnalysis.overlap.end
                    ).toLocaleDateString()}`}
                  />
                  <InfoCard
                    icon={<FiActivity />}
                    label="Pattern Similarity"
                    value={`${comparisonData.comparison.temporalAnalysis.similarity.toFixed(
                      2
                    )}%`}
                  />
                </div>
              ) : (
                <div className="text-gray-400">
                  No temporal patterns detected
                </div>
              )}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

// Reusable Components
const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="flex items-center space-x-3 text-xl font-bold border-b border-[#00ff9d]/30 pb-2">
      <span className="text-[#00ff9d]">{icon}</span>
      <span>{title}</span>
    </div>
    {children}
  </motion.div>
);

const InfoCard = ({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
}) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="p-4 bg-[#00ff9d]/5 rounded-xl border border-[#00ff9d]/10"
  >
    <div className="flex items-center space-x-3">
      <div className="text-[#00ff9d]">{icon}</div>
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-xl font-mono">
          {value}{" "}
          {unit && <span className="text-sm text-gray-400">{unit}</span>}
        </div>
      </div>
    </div>
  </motion.div>
);

const MetadataSection = ({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2 text-[#00ff9d]">
      {icon}
      <span className="font-semibold">{title}</span>
    </div>
    {items.length > 0 ? (
      items.map((item, i) => (
        <div key={i} className="font-mono text-sm text-gray-300 pl-6">
          {item}
        </div>
      ))
    ) : (
      <div className="text-gray-400 pl-6">None found</div>
    )}
  </div>
);
