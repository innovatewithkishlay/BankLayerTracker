import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAML } from "../hooks/useApi";
import { Case2Comparison as CaseComparison } from "../types/apiTypes";
import { motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiClock,
  FiGlobe,
  FiLink,
  FiActivity,
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
      <div className="min-h-screen bg-[#0A001A] flex items-center justify-center">
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
      <div className="min-h-screen bg-[#0A001A] flex items-center justify-center text-red-400">
        <FiAlertTriangle className="mr-2" /> {error}
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="min-h-screen bg-[#0A001A] flex items-center justify-center text-gray-400">
        No comparison data found
      </div>
    );
  }

  // Helper to safely access nested risk factors
  const riskFactors = comparisonData?.comparison?.riskAssessment?.riskFactors;
  const riskAssessment = comparisonData?.comparison?.riskAssessment;
  const directLinks = comparisonData?.comparison?.directLinks;
  const networkAnalysis = comparisonData?.comparison?.networkAnalysis;
  const temporalAnalysis = comparisonData?.comparison?.temporalAnalysis;

  return (
    <div className="min-h-screen bg-[#0A001A] text-[#00ff9d] p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] bg-clip-text text-transparent">
            Cross-Case Analysis
          </span>
        </h1>
        <p className="text-gray-400 font-mono">
          Investigating connections between Case {case1Id} and Case {case2Id}
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Risk Assessment */}
        <Section title="Risk Assessment" icon={<FiActivity />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {riskAssessment && (
              <RiskMeter
                score={riskAssessment?.totalRisk || 0}
                level={riskAssessment?.riskLevel || "LOW"}
              />
            )}

            <div className="grid grid-cols-3 gap-4">
              <InfoGridItem
                label="Shared Accounts"
                value={riskFactors?.sharedAccounts ?? "N/A"}
              />
              <InfoGridItem
                label="High Value Overlap"
                value={riskFactors?.highValueOverlap ?? "N/A"}
              />
              <InfoGridItem
                label="Geographic Risk"
                value={riskFactors?.geographicRisk ?? "N/A"}
              />
            </div>
          </div>
        </Section>

        {/* Shared Connections */}
        <Section title="Shared Connections" icon={<FiLink />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#00ff9d]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Shared Accounts</h3>
              {directLinks?.sharedAccounts?.length ? (
                directLinks.sharedAccounts.map((account) => (
                  <div
                    key={account}
                    className="font-mono py-2 border-b border-[#00ff9d]/10"
                  >
                    {account}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No shared accounts found</p>
              )}
            </div>

            <div className="border border-[#00ff9d]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Transaction Links</h3>
              {directLinks?.transactionLinks?.length ? (
                directLinks.transactionLinks.map((link, i) => (
                  <div key={i} className="mb-4 p-4 bg-[#17002E] rounded-lg">
                    <div className="font-mono text-sm text-gray-400">
                      Path #{i + 1}
                    </div>
                    <div className="text-[#00ff9d]">
                      {link?.path?.join(" → ")}
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span>${link?.totalAmount?.toLocaleString()}</span>
                      <span>{link?.timeGap}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No transaction links found</p>
              )}
            </div>
          </div>
        </Section>

        {/* Network Analysis */}
        <Section title="Network Patterns" icon={<FiGlobe />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#00ff9d]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Bridge Transactions</h3>
              {networkAnalysis?.bridgeEdges?.length ? (
                networkAnalysis.bridgeEdges.map((edge, i) => (
                  <div key={i} className="mb-2 p-3 bg-[#17002E] rounded">
                    <span className="font-mono">
                      {edge?.from} → {edge?.to}
                    </span>
                    <span className="block text-sm text-gray-400 mt-1">
                      ${edge?.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No bridge transactions found</p>
              )}
            </div>

            <div className="border border-[#00ff9d]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Temporal Analysis</h3>
              {temporalAnalysis?.overlap ? (
                <div className="space-y-2">
                  <InfoGridItem
                    label="Overlap Period"
                    value={`${new Date(
                      temporalAnalysis.overlap.start
                    ).toLocaleDateString()} - ${new Date(
                      temporalAnalysis.overlap.end
                    ).toLocaleDateString()}`}
                  />
                  <InfoGridItem
                    label="Similarity Score"
                    value={temporalAnalysis.similarity?.toFixed(2) ?? "N/A"}
                  />
                </div>
              ) : (
                <p className="text-gray-400">No temporal overlap detected</p>
              )}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

// Reusable Section Component
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

// Reusable Info Grid Item
const InfoGridItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="border border-[#00ff9d]/30 rounded-lg p-4">
    <div className="text-sm text-gray-400">{label}</div>
    <div className="text-2xl font-mono">{value}</div>
  </div>
);
