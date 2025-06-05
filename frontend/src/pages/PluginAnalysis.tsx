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
      navigate(`/results/${caseId}`);
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
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] p-6"
    >
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] bg-clip-text text-transparent">
              Upload Case
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Analyze transaction data for suspicious patterns and visualize
            financial networks.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-2xl border border-[#00ff9d]/30 bg-[#111111]/90 backdrop-blur-lg shadow-xl shadow-[#00ff9d]/10"
        >
          <FileUpload onUpload={handleUpload} />

          {/* Processing Indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex items-center justify-center space-x-3"
            >
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      repeatDelay: 0.2,
                      delay: i * 0.2,
                    }}
                    className="h-2 w-2 bg-[#00ff9d] rounded-full"
                  />
                ))}
              </div>
              <span className="font-mono text-[#00ff9d]">
                Analyzing transaction data...
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Optional: Tips or Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>Supported formats: CSV</p>
          <p>Maximum file size: 10MB</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
