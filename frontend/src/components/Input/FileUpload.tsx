import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

interface FileUploadProps {
  onUpload: (
    files: File[],
    onProgress: (progress: number) => void
  ) => Promise<void>;
  multiple?: boolean;
  maxFiles?: number;
}

export const FileUpload = ({
  onUpload,
  multiple = false,
  maxFiles,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setError(null);
  }, []);

  const handleCancel = () => {
    setFiles([]);
    setUploadProgress(0);
  };

  const handleSubmit = async () => {
    if (maxFiles && files.length !== maxFiles) {
      setError(`Please select exactly ${maxFiles} files`);
      return;
    }
    setIsProcessing(true);
    try {
      await onUpload(files, (progress) => setUploadProgress(progress));
      setFiles([]);
      setUploadProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setFiles([]);
      setUploadProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple,
  });

  return (
    <div className="space-y-4 w-full">
      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-red-900/80 backdrop-blur-sm border border-red-500/30 px-6 py-3 rounded-xl z-50"
          >
            <FiAlertTriangle className="text-red-400" />
            <span className="font-mono text-red-300">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {files.length === 0 ? (
        <motion.div
          {...getRootProps()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            border-2 border-dashed rounded-2xl p-10 cursor-pointer
            bg-[#0a0a0a]/90 backdrop-blur-sm
            border-[#00ff9d] hover:border-[#00ff9d]/80
            shadow-xl shadow-[#00ff9d]/20
            text-center flex flex-col items-center justify-center
            min-h-[220px]
          `}
        >
          <input {...getInputProps()} />
          <FiUploadCloud className="text-[#00ff9d] text-6xl mb-6" />
          <p className="text-gray-400 font-mono text-lg">
            {isDragActive
              ? "Drop CSV files here"
              : `Drag & drop ${
                  multiple ? "files" : "a file"
                } or click to browse`}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* File Count */}
          {maxFiles && (
            <p className="text-gray-400 text-sm text-center">
              {files.length}/{maxFiles} files selected
            </p>
          )}

          {/* Selected Files */}
          <div className="border border-[#00ff9d]/30 rounded-xl p-4 bg-[#111111]/50">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <span className="font-mono text-gray-300 truncate">
                  {file.name}
                </span>
                <span className="text-gray-400 text-sm">
                  {formatFileSize(file.size)}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-[#00ff9d] h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors flex-1"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 bg-[#00ff9d] text-black rounded-lg font-semibold hover:bg-[#00ff9d]/90 transition-all flex-1 ${
                maxFiles && files.length !== maxFiles
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={isProcessing || (maxFiles && files.length !== maxFiles)}
            >
              {isProcessing ? "Uploading..." : "Start Analysis"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
