import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { motion } from "framer-motion";

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  multiple?: boolean;
}

export const FileUpload = ({ onUpload, multiple = false }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (files: File[]) => {
      try {
        setIsProcessing(true);
        await onUpload(files);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsProcessing(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple,
  });

  return (
    <motion.div
      {...getRootProps()}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className={`
        relative border-2 border-dashed rounded-2xl p-10 cursor-pointer
        bg-[#0a0a0a]/90 backdrop-blur-sm
        border-[#00ff9d] hover:border-[#00ff9d]/80
        shadow-xl shadow-[#00ff9d]/20
        text-center flex flex-col items-center justify-center
        min-h-[220px]
      `}
    >
      <input {...getInputProps()} />
      <FiUploadCloud className="text-[#00ff9d] text-6xl mb-6" />

      {isProcessing ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#00ff9d] font-mono text-lg"
        >
          Decrypting and analyzing transaction data...
        </motion.p>
      ) : isDragActive ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#00ff9d] font-mono text-lg"
        >
          Release to upload {multiple ? "files" : "file"}
        </motion.p>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 font-mono text-lg"
        >
          Drag & drop {multiple ? "CSV files" : "a CSV file"} here, or click to
          browse
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 mt-4 font-mono"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};
