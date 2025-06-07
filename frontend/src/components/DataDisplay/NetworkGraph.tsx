import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  Position,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
  height?: number;
}

const CustomNode = ({ data, selected }: any) => {
  const totalSent = data.totalSent || 0;
  const totalReceived = data.totalReceived || 0;
  const transactionCount = data.transactionCount || 0;
  const riskLevel = data.riskLevel || "normal";

  const getRiskColor = () => {
    switch (riskLevel) {
      case "high":
        return "#ff4444";
      case "medium":
        return "#ffaa44";
      default:
        return "#00ff9d";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`px-4 py-3 shadow-2xl rounded-xl border-2 min-w-[200px] relative overflow-hidden ${
        selected
          ? "border-[#00ff9d] bg-gradient-to-br from-[#00ff9d]/20 to-[#17002E] shadow-[#00ff9d]/50"
          : "border-[#00ff9d]/50 bg-gradient-to-br from-[#17002E] to-[#0A001A] hover:border-[#00ff9d] hover:shadow-[#00ff9d]/30"
      } transition-all duration-300`}
      style={{
        boxShadow: selected
          ? "0 0 30px rgba(0, 255, 157, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          : "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      <div
        className="absolute top-2 right-2 w-3 h-3 rounded-full animate-pulse"
        style={{ backgroundColor: getRiskColor() }}
      />

      <div className="relative z-10">
        <div className="text-[#00ff9d] font-bold text-base font-mono tracking-wide mb-2">
          {data.label}
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Account:</span>
            <span className="text-white font-mono">
              {data.accountNumber?.slice(-6) || "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Transactions:</span>
            <span className="text-[#00ff9d]">{transactionCount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Sent:</span>
            <span className="text-red-300">${totalSent.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Received:</span>
            <span className="text-green-300">
              ${totalReceived.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Net:</span>
            <span
              className={
                totalReceived - totalSent >= 0
                  ? "text-green-300"
                  : "text-red-300"
              }
            >
              ${(totalReceived - totalSent).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div
        className="absolute top-0 right-0 w-8 h-8 opacity-30"
        style={{
          background: `linear-gradient(to bottom left, ${getRiskColor()}, transparent)`,
        }}
      />
    </motion.div>
  );
};

const CustomEdge = ({ data }: any) => {
  const amount = data?.amount || 0;
  const transactionType = data?.type || "normal";
  const timestamp = data?.timestamp || "";

  return (
    <div className="bg-[#17002E] border border-[#00ff9d]/50 rounded px-2 py-1 text-xs font-mono">
      <div className="text-[#00ff9d] font-bold">${amount.toLocaleString()}</div>
      {timestamp && (
        <div className="text-gray-400 text-[10px]">
          {new Date(timestamp).toLocaleDateString()}
        </div>
      )}
      {transactionType === "high-risk" && (
        <div className="text-red-400 text-[10px]">⚠ High Risk</div>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export const NetworkGraph = ({
  nodes: initialNodes,
  edges: initialEdges,
  height = 500,
}: NetworkGraphProps) => {
  const enhancedNodes = useMemo(
    () =>
      initialNodes.map((node) => {
        const relatedEdges = initialEdges.filter(
          (edge) => edge.source === node.id || edge.target === node.id
        );

        const totalSent = relatedEdges
          .filter((edge) => edge.source === node.id)
          .reduce((sum, edge) => sum + (edge.data?.amount || 0), 0);

        const totalReceived = relatedEdges
          .filter((edge) => edge.target === node.id)
          .reduce((sum, edge) => sum + (edge.data?.amount || 0), 0);

        const transactionCount = relatedEdges.length;

        const maxSingle = Math.max(
          ...relatedEdges.map((e) => e.data?.amount || 0)
        );
        const riskLevel =
          maxSingle > 50000 ? "high" : totalSent > 100000 ? "medium" : "normal";

        return {
          ...node,
          type: "custom",
          data: {
            ...node.data,
            totalSent,
            totalReceived,
            transactionCount,
            riskLevel,
            accountNumber: node.data.accountNumber || node.id,
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        };
      }),
    [initialNodes, initialEdges]
  );

  const enhancedEdges = useMemo(
    () =>
      initialEdges.map((edge) => {
        const amount = edge.data?.amount || 0;
        const isHighValue = amount > 50000;
        const isStructuring = amount >= 9000 && amount <= 10000;

        return {
          ...edge,
          type: "smoothstep",
          animated: true,
          style: {
            stroke: isHighValue
              ? "#ff4444"
              : isStructuring
              ? "#ffaa44"
              : "#00ff9d",
            strokeWidth: Math.max(2, Math.min(8, amount / 10000)),
            filter: `drop-shadow(0 0 ${isHighValue ? 8 : 4}px ${
              isHighValue ? "rgba(255, 68, 68, 0.8)" : "rgba(0, 255, 157, 0.6)"
            })`,
          },
          label: `$${amount.toLocaleString()}`,
          labelStyle: {
            fill: "#ffffff",
            fontWeight: "bold",
            fontSize: "11px",
            fontFamily: "monospace",
            backgroundColor: isHighValue
              ? "#ff4444"
              : isStructuring
              ? "#ffaa44"
              : "#17002E",
            padding: "4px 8px",
            borderRadius: "6px",
            border: `1px solid ${
              isHighValue ? "#ff4444" : isStructuring ? "#ffaa44" : "#00ff9d"
            }`,
          },
          labelBgStyle: {
            fill: "transparent",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: isHighValue
              ? "#ff4444"
              : isStructuring
              ? "#ffaa44"
              : "#00ff9d",
          },
          data: {
            ...edge.data,
            type: isHighValue
              ? "high-risk"
              : isStructuring
              ? "structuring"
              : "normal",
          },
        };
      }),
    [initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(enhancedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(enhancedEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const totalValue = edges.reduce(
    (sum, edge) => sum + (edge.data?.amount || 0),
    0
  );
  const highRiskTransactions = edges.filter(
    (edge) => edge.data?.amount > 50000
  ).length;
  const avgTransactionSize = edges.length > 0 ? totalValue / edges.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ height: `${height}px` }}
      className="relative rounded-2xl overflow-hidden border-2 border-[#00ff9d]/30 bg-gradient-to-br from-[#0A001A] to-[#17002E]"
    >
      <div
        className="absolute inset-0 rounded-2xl shadow-2xl"
        style={{
          boxShadow:
            "0 0 50px rgba(0, 255, 157, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      />

      <div className="relative z-10 h-full rounded-2xl overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.3,
            includeHiddenNodes: false,
          }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.2}
          maxZoom={2}
          attributionPosition="bottom-left"
          className="bg-transparent"
        >
          <Background
            color="#00ff9d"
            gap={24}
            size={1}
            style={{ opacity: 0.1 }}
          />

          <MiniMap
            nodeStrokeColor="#00ff9d"
            nodeColor="#17002E"
            nodeBorderRadius={8}
            maskColor="rgba(10, 0, 26, 0.8)"
            style={{
              backgroundColor: "#17002E",
              border: "2px solid rgba(0, 255, 157, 0.3)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
            pannable
            zoomable
          />

          <Controls
            style={{
              backgroundColor: "#17002E",
              border: "2px solid rgba(0, 255, 157, 0.4)",
              borderRadius: "16px",
              padding: "8px",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 157, 0.2)",
            }}
            showInteractive={false}
          />
        </ReactFlow>
      </div>

      <div className="absolute top-4 left-4 z-20">
        <div className="bg-gradient-to-r from-[#17002E]/95 to-[#17002E]/80 px-4 py-3 rounded-lg border border-[#00ff9d]/30 backdrop-blur-sm">
          <h3 className="text-[#00ff9d] font-bold text-sm font-mono mb-2">
            Transaction Network Analysis
          </h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-gray-300">Entities:</span>
              <span className="text-[#00ff9d] font-mono">{nodes.length}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-300">Transactions:</span>
              <span className="text-[#00ff9d] font-mono">{edges.length}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-300">Total Value:</span>
              <span className="text-[#00ff9d] font-mono">
                ${totalValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-300">Avg Amount:</span>
              <span className="text-[#00ff9d] font-mono">
                ${Math.round(avgTransactionSize).toLocaleString()}
              </span>
            </div>
            {highRiskTransactions > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-red-300">High Risk:</span>
                <span className="text-red-400 font-mono">
                  {highRiskTransactions}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-gradient-to-l from-[#17002E]/95 to-[#17002E]/80 px-3 py-3 rounded-lg border border-[#00ff9d]/30 backdrop-blur-sm">
          <h4 className="text-[#00ff9d] font-bold text-xs mb-2 font-mono">
            Transaction Types
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-0.5 bg-[#00ff9d]"
                style={{
                  filter: "drop-shadow(0 0 4px rgba(0, 255, 157, 0.6))",
                }}
              />
              <span className="text-gray-300">Normal (&lt;$50K)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-0.5 bg-[#ffaa44]"
                style={{
                  filter: "drop-shadow(0 0 4px rgba(255, 170, 68, 0.6))",
                }}
              />
              <span className="text-gray-300">Structuring ($9-10K)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-1 bg-[#ff4444]"
                style={{
                  filter: "drop-shadow(0 0 6px rgba(255, 68, 68, 0.8))",
                }}
              />
              <span className="text-gray-300">High Risk (&gt;$50K)</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-3 h-3 rounded-full bg-[#ff4444] animate-pulse" />
              <span className="text-gray-300">Risk Indicator</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className="bg-gradient-to-l from-[#17002E]/95 to-[#17002E]/80 px-3 py-2 rounded-lg border border-[#00ff9d]/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-300">Money Flow:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-0.5 bg-[#00ff9d]" />
              <div className="w-0 h-0 border-l-[4px] border-l-[#00ff9d] border-y-[2px] border-y-transparent" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
