import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

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
}

export const FileUpload = ({ onUpload, multiple = false }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const handleCancel = () => {
    setFiles([]);
    setUploadProgress(0);
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      await onUpload(files, (progress) => setUploadProgress(progress));
    } catch (err) {
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
              className="px-6 py-2 bg-[#00ff9d] text-black rounded-lg font-semibold hover:bg-[#00ff9d]/90 transition-all flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? "Uploading..." : "Start Analysis"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
