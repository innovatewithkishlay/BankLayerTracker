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
