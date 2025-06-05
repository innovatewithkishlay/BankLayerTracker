import ReactFlow, { Background, Controls } from "reactflow";
import type { Edge, Node } from "reactflow";
import "reactflow/dist/style.css";

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
}

const nodeStyle = {
  background: "#0A001A",
  border: "2px solid #00FF9D",
  color: "#00FF9D",
  borderRadius: "8px",
  padding: 16,
  fontFamily: "Space Mono, monospace",
};

export const NetworkGraph = ({ nodes, edges }: NetworkGraphProps) => (
  <div className="h-[600px] bg-cyber-secondary rounded-xl shadow-cyber">
    <ReactFlow
      nodes={nodes.map((n) => ({ ...n, style: nodeStyle }))}
      edges={edges}
      fitView
    >
      <Background color="#1A1A2F" gap={32} />
      <Controls
        style={{
          backgroundColor: "#0A001A",
          border: "2px solid #00FF9D",
          borderRadius: "8px",
        }}
      />
    </ReactFlow>
  </div>
);
