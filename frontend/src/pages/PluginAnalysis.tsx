import { useState } from "react";
import { useAML } from "../hooks/useApi";
import { FileUpload } from "../components/Input/FileUpload";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";
import { ErrorModal } from "../components/UI/ErrorModal";

export const PluginAnalysis = () => {
  const { uploadCase } = useAML();
  const navigate = useNavigate();
  const [error, setError] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    details: string[];
  }>({
    isOpen: false,
    title: "",
    message: "",
    details: [],
  });

  const handleUpload = async (
    files: File[],
    onProgress: (progress: number) => void
  ) => {
    if (files.length === 0) return;

    try {
      const caseId = await uploadCase(files[0], onProgress);
      navigate(`/results/${caseId}`);
    } catch (err: any) {
      const backendError = err?.response?.data;

      setError({
        isOpen: true,
        title: "CSV Upload Failed",
        message:
          backendError?.error ||
          "Upload failed. Please check your CSV file format.",
        details: backendError?.details || [
          "Please check:",
          "• All required columns are present",
          "• Amounts are numeric values",
          "• Dates are in YYYY-MM-DD format",
          "• No empty rows exist",
        ],
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] p-6 relative"
    >
      <motion.button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center space-x-2 text-[#00ff9d] hover:text-[#00ff9d]/80 transition-colors group"
      >
        <FiHome className="group-hover:rotate-[-10deg] transition-transform" />
        <span className="font-mono opacity-80 group-hover:opacity-100">
          Return to Hub
        </span>
      </motion.button>

      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
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

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-8 rounded-2xl border border-[#00ff9d]/30 bg-[#111111]/90 backdrop-blur-lg shadow-xl shadow-[#00ff9d]/10"
        >
          <FileUpload
            onUpload={handleUpload}
            multiple={false}
            maxFiles={1}
            enableAddMore={false}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>Supported formats: CSV</p>
          <p>Maximum file size: 10MB</p>
        </motion.div>
      </div>

      <ErrorModal
        isOpen={error.isOpen}
        onClose={() => setError((prev) => ({ ...prev, isOpen: false }))}
        title={error.title}
        message={error.message}
        details={error.details}
      />
    </motion.div>
  );
};
