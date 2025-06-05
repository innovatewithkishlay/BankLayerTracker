import { useAML } from "../hooks/useApi";
import { FileUpload } from "../components/Input/FileUpload";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";

export const InterlinkAnalysis = () => {
  const { uploadCase } = useAML();
  const navigate = useNavigate();

  const handleUpload = async (
    files: File[],
    onProgress: (progress: number) => void
  ) => {
    if (files.length < 2) {
      alert("Please upload exactly 2 files");
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
      // Navigate to comparison page here if needed
    } catch (err) {
      alert(
        "Upload failed: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      throw err;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] p-6 relative"
    >
      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/")}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
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
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] bg-clip-text text-transparent">
              Cross-Case Investigation
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Analyze and compare transaction data from two cases to uncover
            hidden connections.
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-2xl border border-[#00ff9d]/30 bg-[#111111]/90 backdrop-blur-lg shadow-xl shadow-[#00ff9d]/10"
        >
          <FileUpload onUpload={handleUpload} multiple />
        </motion.div>

        {/* Instructions */}
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
