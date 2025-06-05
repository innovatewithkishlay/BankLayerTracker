import { useAML } from "../hooks/useApi";
import { FileUpload } from "../components/Input/FileUpload";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const PluginAnalysis = () => {
  const { uploadCase } = useAML();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const caseId = await uploadCase(files[0]);
      alert(`Case uploaded! ID: ${caseId}`);
    } catch (err) {
      alert(
        "Upload failed: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <h2 className="text-2xl font-orbitron text-cyber-green mb-6">
        Single Case Analysis
      </h2>
      <FileUpload onUpload={handleUpload} />
      {isProcessing && (
        <p className="mt-4 font-mono text-cyber-green">
          Processing transaction data...
        </p>
      )}
    </motion.div>
  );
};
