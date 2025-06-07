import { useState } from "react";
import { useAML } from "../hooks/useApi";
import { FileUpload } from "../components/Input/FileUpload";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { ErrorModal } from "../components/UI/ErrorModal";
import { AxiosError } from "axios";

export const PluginAnalysis = () => {
  const { uploadCase } = useAML();
  const navigate = useNavigate();
  const [error, setError] = useState({
    isOpen: false,
    title: "",
    message: "",
    details: [],
  });

  const handleUpload = async (files, onProgress) => {
    if (files.length === 0) return;
    try {
      const caseId = await uploadCase(files[0], onProgress);
      navigate(`/results/${caseId}`);
    } catch (err) {
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
        {/* Header */}
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
            Upload your transaction data for instant AML analysis and network
            visualization.
          </p>
        </motion.div>

        {/* File Upload */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-8 rounded-2xl border border-[#00ff9d]/30 bg-[#111111]/90 backdrop-blur-lg shadow-xl shadow-[#00ff9d]/10 mb-8"
        >
          <FileUpload
            onUpload={handleUpload}
            multiple={false}
            maxFiles={1}
            enableAddMore={false}
          />
        </motion.div>

        {/* Step-by-step guide */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="p-6 rounded-2xl border border-[#00ff9d]/30 bg-[#0d0d0d]">
            <h3 className="text-xl font-semibold text-[#00ff9d] mb-4">
              How to Prepare Your CSV File
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <FiCheckCircle className="text-[#00ff9d] mt-1 flex-shrink-0" />
                <span>
                  <strong>Required columns:</strong>{" "}
                  <span className="font-mono">
                    fromAccount, toAccount, amount, date
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="text-[#00ff9d] mt-1 flex-shrink-0" />
                <span>Amounts must be numeric</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="text-[#00ff9d] mt-1 flex-shrink-0" />
                <span>
                  Dates must be in <span className="font-mono">YYYY-MM-DD</span>{" "}
                  format
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="text-[#00ff9d] mt-1 flex-shrink-0" />
                <span>No empty rows</span>
              </li>
              <li className="flex items-start gap-2">
                <FiAlertTriangle className="text-yellow-400 mt-1 flex-shrink-0" />
                <span>
                  <strong>Tip:</strong> Download a sample template for best
                  results.
                </span>
              </li>
            </ul>
            <a
              href="/assets/case1.csv"
              download
              className="inline-block mt-4 px-4 py-2 bg-[#00ff9d] text-black rounded-lg font-semibold hover:bg-[#00d4ff] transition-colors text-sm"
            >
              Download Sample CSV
            </a>
          </div>

          {/* Sample CSV Preview */}
          <div className="p-6 rounded-2xl border border-[#00ff9d]/30 bg-[#0d0d0d]">
            <h3 className="text-xl font-semibold text-[#00ff9d] mb-4">
              Sample CSV Structure
            </h3>
            <pre className="font-mono text-xs sm:text-sm text-gray-400 p-4 rounded-lg bg-[#111111] overflow-x-auto">
              {`fromAccount,toAccount,amount,date
ACC001,ACC002,5000,2025-06-01
ACC002,ACC003,9500,2025-06-01
ACC003,ACC001,48000,2025-06-01`}
            </pre>
          </div>
        </div>

        {/* Process Explanation */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-8">
          <Step
            title="1. Upload CSV"
            description="Drag & drop or browse to select your transaction data file."
          />
          <Step
            title="2. Instant Analysis"
            description="Our engine validates, parses, and analyzes your data in seconds."
          />
          <Step
            title="3. Visualize Results"
            description="Explore detected patterns, anomalies, and network graphs."
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>Supported format: CSV &nbsp; | &nbsp; Max file size: 10MB</p>
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

// Step component for visual workflow
const Step = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center text-center max-w-xs">
    <div className="w-12 h-12 mb-3 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center">
      <span className="text-lg font-bold text-[#00ff9d]">
        {title.charAt(0)}
      </span>
    </div>
    <div className="font-semibold text-[#00ff9d] mb-1">{title}</div>
    <div className="text-gray-400 text-sm">{description}</div>
  </div>
);
