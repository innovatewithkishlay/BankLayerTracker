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
    <div className="relative border-2 border-dashed border-primary rounded-lg p-8">
      <div
        {...getRootProps()}
        className={`text-center cursor-pointer ${
          isDragActive ? "opacity-75" : ""
        }`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="mx-auto text-4xl text-primary mb-4" />

        {isProcessing ? (
          <p className="text-terminalText">Decrypting transaction data...</p>
        ) : (
          <p className="text-terminalText">
            {isDragActive
              ? "Release to initiate scan"
              : `Drag CSV ${
                  multiple ? "files" : "file"
                } here or click to browse`}
          </p>
        )}

        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </div>
  );
};
