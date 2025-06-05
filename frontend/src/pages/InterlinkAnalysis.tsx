import { useAML } from "../hooks/useApi";
import { FileUpload } from "../components/Input/FileUpload";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiAlertTriangle } from "react-icons/fi";
import { useState, useEffect } from "react";

export const InterlinkAnalysis = () => {
  const { uploadCase } = useAML();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleUpload = async (
    files: File[],
    onProgress: (progress: number) => void
  ) => {
    if (files.length < 2) {
      setError("Please select exactly 2 case files");
      return;
    }

    try {
      let progress1 = 0;
      let progress2 = 0;

      const updateProgress = () => {
        const total = (progress1 + progress2) / 2;
        onProgress(total);
      };

      const [case1Id, case2Id] = await Promise.all([
        uploadCase(files[0], (p) => {
          progress1 = p;
          updateProgress();
        }),
        uploadCase(files[1], (p) => {
          progress2 = p;
          updateProgress();
        }),
      ]);

      alert(`Cases uploaded! IDs: ${case1Id}, ${case2Id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process files");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] p-6 relative"
    >
      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-red-900/80 backdrop-blur-sm border border-red-500/30 px-6 py-3 rounded-xl"
          >
            <FiAlertTriangle className="text-red-400" />
            <span className="font-mono text-red-300">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center space-x-2 text-[#00ff9d] hover:text-[#00ff9d]/80 transition-colors group"
      >
        <FiHome className="group-hover:rotate-[-10deg] transition-transform" />
        <span className="font-mono opacity-80 group-hover:opacity-100">
          Return to Hub
        </span>
      </motion.button>

      {/* Main Content */}
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] bg-clip-text text-transparent">
              Cross-Case Investigation
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Analyze and compare transaction data from two cases
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-8 rounded-2xl border border-[#00ff9d]/30 bg-[#111111]/90 backdrop-blur-lg shadow-xl shadow-[#00ff9d]/10"
        >
          <FileUpload onUpload={handleUpload} multiple maxFiles={2} />
        </motion.div>
      </div>
    </motion.div>
  );
};
