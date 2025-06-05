import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

export const NetworkGraph = ({
  nodes,
  edges,
}: {
  nodes: any[];
  edges: any[];
}) => (
  <ReactFlow nodes={nodes} edges={edges} fitView>
    <Background color="#00ff9d" gap={32} className="opacity-20" />
    <Controls
      style={{
        backgroundColor: "#0A001A",
        border: "2px solid #00ff9d",
        borderRadius: "8px",
      }}
    />
    <MiniMap
      nodeColor="#00ff9d30"
      maskColor="#0A001A"
      style={{ background: "#0A001A", border: "1px solid #00ff9d" }}
    />
  </ReactFlow>
);
