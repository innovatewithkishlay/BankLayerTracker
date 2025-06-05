import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { motion } from "framer-motion";

export const FileUpload = ({
  onUpload,
}: {
  onUpload: (file: File) => Promise<void>;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(
    async (files: File[]) => {
      setIsProcessing(true);
      try {
        await onUpload(files[0]);
      } finally {
        setIsProcessing(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "text/csv": [".csv"] },
  });

  return (
    <motion.div
      className={`p-8 border-2 border-dashed rounded-lg ${
        isDragActive ? "border-cyber-green" : "border-cyber-secondary"
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <div {...getRootProps()} className="text-center cursor-pointer">
        <input {...getInputProps()} />

        <FiUploadCloud className="mx-auto text-4xl text-cyber-green mb-4" />

        {isProcessing ? (
          <div className="text-cyber-green">
            <p>DECRYPTING TRANSACTION DATA...</p>
            <div className="mt-4 h-1 bg-cyber-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyber-green"
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        ) : (
          <p className="text-cyber-green font-mono">
            {isDragActive
              ? "RELEASE TO INITIATE SCAN"
              : "DRAG CSV HERE OR CLICK TO BROWSE"}
          </p>
        )}
      </div>
    </motion.div>
  );
};
