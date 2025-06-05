import React from "react";
import { useParams } from "react-router-dom";
import { useAML } from "../hooks/useApi";
import { useEffect, useState } from "react";
import { NetworkGraph } from "../components/DataDisplay/NetworkGraph";
import { AnomalyTable } from "../components/DataDisplay/AnomalyTable";
import type { Node, Edge } from "reactflow";
const generateLayout = (transactions: any[]) => {
  const accounts = new Set<string>();
  transactions.forEach((tx) => {
    accounts.add(tx.fromAccount);
    accounts.add(tx.toAccount);
  });

  const nodes: Node[] = Array.from(accounts).map((account, index) => ({
    id: account,
    data: { label: account },
    position: { x: index * 200, y: 100 },
    style: {
      background: "#00ff9d20",
      border: "2px solid #00ff9d",
      borderRadius: "8px",
      padding: "16px",
      color: "#00ff9d",
      fontFamily: "'Space Mono', monospace",
    },
  }));

  const edges: Edge[] = transactions.map((tx, index) => ({
    id: `e${index}`,
    source: tx.fromAccount,
    target: tx.toAccount,
    label: `$${tx.amount}`,
    style: { stroke: "#00ff9d", strokeWidth: 2 },
    labelStyle: { fill: "#00ff9d", fontSize: 12 },
  }));

  return { nodes, edges };
};

export const Results = () => {
  const { caseId } = useParams();
  const { getCase } = useAML();
  const [caseData, setCaseData] = useState<any>(null);
  const [networkData, setNetworkData] = useState<{
    nodes: Node[];
    edges: Edge[];
  }>({ nodes: [], edges: [] });

  useEffect(() => {
    const loadData = async () => {
      if (caseId) {
        const data = await getCase(caseId);
        setCaseData(data);
        // Generate network layout from transactions
        const { nodes, edges } = generateLayout(data.transactions || []);
        setNetworkData({ nodes, edges });
      }
    };
    loadData();
  }, [caseId]);

  if (!caseData)
    return (
      <div className="text-cyber-green font-mono p-6">
        Initializing threat analysis...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-cyber-background min-h-screen">
      {/* Header */}
      <h1 className="text-4xl font-orbitron text-cyber-green mb-8 cyber-glow">
        CASE ANALYSIS: {caseData.caseId}
      </h1>

      {/* Network Graph Section */}
      <div className="mb-12 border-2 border-cyber-green rounded-xl p-4 shadow-cyber">
        <h2 className="text-2xl font-orbitron text-cyber-green mb-4">
          TRANSACTION NETWORK MAP
        </h2>
        <div className="h-[600px]">
          <NetworkGraph nodes={networkData.nodes} edges={networkData.edges} />
        </div>
      </div>

      {/* Anomaly Table */}
      <div className="mb-12 border-2 border-cyber-green rounded-xl p-4 shadow-cyber">
        <h2 className="text-2xl font-orbitron text-cyber-green mb-4">
          DETECTED THREAT PATTERNS
        </h2>
        <AnomalyTable data={caseData.anomalies || []} />
      </div>

      {/* Transaction Log */}
      <div className="border-2 border-cyber-green rounded-xl p-4 shadow-cyber">
        <h2 className="text-2xl font-orbitron text-cyber-green mb-4">
          TRANSACTION LOG
        </h2>
        <div className="grid grid-cols-4 gap-4 font-mono text-cyber-green">
          <div className="col-span-1 font-bold">FROM</div>
          <div className="col-span-1 font-bold">TO</div>
          <div className="col-span-1 font-bold">AMOUNT</div>
          <div className="col-span-1 font-bold">DATE</div>

          {caseData.transactions?.map((t: any, index: number) => (
            <React.Fragment key={index}>
              <div className="col-span-1">{t.fromAccount}</div>
              <div className="col-span-1">{t.toAccount}</div>
              <div className="col-span-1">${t.amount.toLocaleString()}</div>
              <div className="col-span-1">
                {new Date(t.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
