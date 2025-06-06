import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  details?: string[];
}

export const ErrorModal = ({
  isOpen,
  onClose,
  title,
  message,
  details,
}: ErrorModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0d0d0d] border-2 border-red-500/50 rounded-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FiAlertTriangle className="text-red-500 text-2xl" />
                <h3 className="text-red-400 font-bold text-lg">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>

            <p className="text-gray-300 mb-4">{message}</p>

            {details && details.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-red-300 text-sm font-semibold mb-2">
                  Required columns:
                </p>
                <ul className="text-red-200 text-sm space-y-1">
                  {details.map((detail, i) => (
                    <li key={i} className="font-mono">
                      • {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Understood
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
