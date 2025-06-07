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
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
  height?: number;
}

const CustomNode = ({ data, selected }: any) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`px-6 py-4 shadow-2xl rounded-xl border-2 min-w-[160px] relative overflow-hidden ${
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
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff9d]/5 to-transparent transform -skew-x-12 -translate-x-full animate-pulse" />

      <div className="relative z-10">
        <div className="text-[#00ff9d] font-bold text-lg font-mono tracking-wide">
          {data.label}
        </div>
        {data.subtitle && (
          <div className="text-gray-300 text-sm mt-1 opacity-80">
            {data.subtitle}
          </div>
        )}
        {data.amount && (
          <div className="text-white font-semibold text-xs mt-2 bg-[#00ff9d]/20 px-2 py-1 rounded">
            {data.amount}
          </div>
        )}
      </div>

      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#00ff9d]/30 to-transparent" />
    </motion.div>
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
      initialNodes.map((node) => ({
        ...node,
        type: "custom",
        data: {
          ...node.data,
          subtitle: node.data.accountHolder ? "Account Holder" : "Entity",
        },
        style: {
          background: "transparent",
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })),
    [initialNodes]
  );

  const enhancedEdges = useMemo(
    () =>
      initialEdges.map((edge) => ({
        ...edge,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#00ff9d",
          strokeWidth: 3,
          filter: "drop-shadow(0 0 6px rgba(0, 255, 157, 0.6))",
        },
        labelStyle: {
          fill: "#00ff9d",
          fontWeight: "bold",
          fontSize: "12px",
          fontFamily: "monospace",
          background: "rgba(23, 0, 46, 0.9)",
          padding: "4px 8px",
          borderRadius: "6px",
          border: "1px solid rgba(0, 255, 157, 0.3)",
        },
        labelBgStyle: {
          fill: "transparent",
        },
      })),
    [initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(enhancedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(enhancedEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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
            padding: 0.2,
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
            style={{ opacity: 0.15 }}
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
        <div className="bg-gradient-to-r from-[#17002E]/90 to-transparent px-4 py-2 rounded-lg border border-[#00ff9d]/30 backdrop-blur-sm">
          <h3 className="text-[#00ff9d] font-bold text-sm font-mono">
            Transaction Network
          </h3>
          <p className="text-gray-300 text-xs mt-1">
            {nodes.length} entities • {edges.length} connections
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-gradient-to-l from-[#17002E]/90 to-transparent px-3 py-2 rounded-lg border border-[#00ff9d]/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-[#00ff9d] shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
            <span className="text-gray-300">Active Entity</span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#00ff9d]/10 to-transparent rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#00ff9d]/10 to-transparent rounded-tl-full" />
    </motion.div>
  );
};
