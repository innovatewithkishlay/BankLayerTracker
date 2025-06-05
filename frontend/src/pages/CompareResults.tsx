import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAML } from "../hooks/useApi";
import { CaseComparison } from "../types/apiTypes";

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

  useEffect(() => {
    const loadComparison = async () => {
      if (!case1Id || !case2Id) return;
      try {
        const data = await compareCases(case1Id, case2Id);
        setComparisonData(data);
      } catch (err) {
        console.error("Failed to load comparison:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadComparison();
  }, [case1Id, case2Id]);

  if (isLoading)
    return <div className="text-cyber-green">Analyzing connections...</div>;
  if (!comparisonData)
    return <div className="text-red-400">Failed to load comparison</div>;

  return (
    <div className="bg-[#0A001A] text-[#00ff9d] p-6">
      <h1 className="text-3xl font-bold mb-8">
        Cross-Case Analysis: {case1Id} vs {case2Id}
      </h1>

      {/* Shared Transactions */}
      <div className="mb-12 border border-[#00ff9d] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Shared Transactions</h2>
        <ul className="space-y-2">
          {comparisonData.sharedTransactions.map((tx, i) => (
            <li key={i} className="font-mono">
              {tx.fromAccount} → {tx.toAccount}: ${tx.amount}
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Comparison */}
      <div className="grid grid-cols-2 gap-6">
        <div className="border border-[#00ff9d] rounded-xl p-6">
          <h3 className="text-lg font-bold mb-2">Case {case1Id} Risk</h3>
          <p className="text-4xl">{comparisonData.case1RiskScore}</p>
        </div>
        <div className="border border-[#00ff9d] rounded-xl p-6">
          <h3 className="text-lg font-bold mb-2">Case {case2Id} Risk</h3>
          <p className="text-4xl">{comparisonData.case2RiskScore}</p>
        </div>
      </div>
    </div>
  );
};
