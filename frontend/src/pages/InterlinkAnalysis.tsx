import { useAML } from "../hooks/useApi";
import { FileUpload } from "../components/Input/FileUpload";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const InterlinkAnalysis = () => {
  const { uploadCase } = useAML();
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleUpload = async (files: File[]) => {
    if (files.length < 2) {
      alert("Please upload exactly 2 files");
      return;
    }
    setIsProcessing(true);
    try {
      const case1Id = await uploadCase(files[0]);
      const case2Id = await uploadCase(files[1]);
      alert(`Cases uploaded! IDs: ${case1Id}, ${case2Id}`);
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
        Cross-Case Investigation
      </h2>
      <FileUpload onUpload={handleUpload} multiple />
      {isProcessing && (
        <p className="mt-4 font-mono text-cyber-green">
          Processing transaction data...
        </p>
      )}
    </motion.div>
  );
};
