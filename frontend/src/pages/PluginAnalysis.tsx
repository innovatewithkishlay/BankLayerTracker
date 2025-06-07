import { useState } from "react";
import { useAML } from "../hooks/useApi";
import { FileUpload } from "../components/Input/FileUpload";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { ErrorModal } from "../components/UI/ErrorModal";

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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] p-6 relative"
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

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start mt-12">
        <div className="p-8 rounded-2xl border border-[#00ff9d]/30 bg-[#0d0d0d] flex flex-col justify-between min-h-[420px]">
          <h3 className="text-2xl font-semibold text-[#00ff9d] mb-6">
            How to Prepare Your CSV File
          </h3>
          <ul className="space-y-4 text-gray-300 text-base mb-8">
            <li className="flex items-start gap-2">
              <FiCheckCircle className="text-[#00ff9d] mt-1 flex-shrink-0" />
              <span>
                <strong>Required columns:</strong>
                <span className="font-mono">
                  {" "}
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
            href="/sample-case.csv"
            download
            className="block mt-4 w-full py-4 text-lg font-bold text-center
              bg-[#00ff9d] text-black rounded-xl hover:bg-[#00d4ff] transition-colors
              shadow-lg"
            style={{ letterSpacing: "0.04em" }}
          >
            Download Sample CSV
          </a>
        </div>

        <div className="flex flex-col items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full p-8 rounded-2xl border border-[#00ff9d]/30 bg-[#111111]/90 backdrop-blur-lg shadow-xl shadow-[#00ff9d]/10"
          >
            <FileUpload
              onUpload={handleUpload}
              multiple={false}
              maxFiles={1}
              enableAddMore={false}
            />
          </motion.div>
        </div>
      </div>

      <div className="mt-16 w-full max-w-4xl flex flex-col md:flex-row justify-center items-center gap-8">
        <Step
          number={1}
          title="Upload CSV"
          description="Drag & drop or browse to select your transaction data file."
        />
        <Step
          number={2}
          title="Instant Analysis"
          description="Our engine validates, parses, and analyzes your data in seconds."
        />
        <Step
          number={3}
          title="Visualize Results"
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

const Step = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center text-center max-w-xs">
    <div className="w-12 h-12 mb-3 rounded-full bg-[#00ff9d]/10 border-2 border-[#00ff9d]/40 flex items-center justify-center font-bold text-2xl text-[#00ff9d]">
      {number}
    </div>
    <div className="font-semibold text-[#00ff9d] mb-1">{title}</div>
    <div className="text-gray-400 text-sm">{description}</div>
  </div>
);
