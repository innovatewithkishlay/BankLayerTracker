import { useParams } from "react-router-dom";
import { useAML } from "../hooks/useApi";
import { useEffect, useState } from "react";
import { NetworkGraph } from "../components/DataDisplay/NetworkGraph";
import { AnomalyTable } from "../components/DataDisplay/AnomalyTable";

export const Results = () => {
  const { caseId } = useParams();
  const { getCase } = useAML();
  const [caseData, setCaseData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (caseId) {
        const data = await getCase(caseId);
        setCaseData(data);
      }
    };
    loadData();
  }, [caseId]);

  if (!caseData) return <div>Loading analysis...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-orbitron text-cyber-green mb-8">
        Case Analysis: {caseData.caseId}
      </h1>

      {/* Network Graph */}
      <div className="mb-12">
        <h2 className="text-xl font-orbitron text-cyber-green mb-4">
          Transaction Network
        </h2>
        <NetworkGraph
          nodes={caseData.network?.nodes || []}
          edges={caseData.network?.edges || []}
        />
      </div>

      {/* Anomalies Table */}
      <div className="mb-12">
        <h2 className="text-xl font-orbitron text-cyber-green mb-4">
          Detected Anomalies
        </h2>
        <AnomalyTable data={caseData.anomalies || []} />
      </div>

      {/* Transactions List */}
      <div>
        <h2 className="text-xl font-orbitron text-cyber-green mb-4">
          Transaction History
        </h2>
        <div className="grid grid-cols-4 gap-4 font-mono">
          <div className="col-span-1 font-bold">From</div>
          <div className="col-span-1 font-bold">To</div>
          <div className="col-span-1 font-bold">Amount</div>
          <div className="col-span-1 font-bold">Date</div>

          {caseData.transactions?.map((t: any) => (
            <>
              <div className="col-span-1">{t.fromAccount}</div>
              <div className="col-span-1">{t.toAccount}</div>
              <div className="col-span-1">${t.amount}</div>
              <div className="col-span-1">
                {new Date(t.date).toLocaleDateString()}
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
