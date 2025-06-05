import ReactFlow, { Background, Controls } from "reactflow";
import type { Edge, Node } from "reactflow";
import "reactflow/dist/style.css";

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
}
