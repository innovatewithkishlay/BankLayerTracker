import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
  height?: number;
}

export const NetworkGraph = ({
  nodes,
  edges,
  height = 500,
}: NetworkGraphProps) => (
  <div
    style={{ height: `${height}px` }}
    className="border-2 border-cyber-green rounded-xl"
  >
    <ReactFlow nodes={nodes} edges={edges} fitView>
      <Background color="#00ff9d" gap={32} />
      <Controls
        style={{
          backgroundColor: "#17002E",
          border: "2px solid #00ff9d",
          borderRadius: "8px",
        }}
      />
    </ReactFlow>
  </div>
);
