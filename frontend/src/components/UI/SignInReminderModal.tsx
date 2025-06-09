import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function SignInReminderModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed z-50 top-4 right-4 w-full max-w-xs sm:max-w-sm sm:right-6 sm:top-6 mx-auto sm:mx-0 bg-[#181a20]/95 backdrop-blur-lg rounded-xl border border-[#00ff9d]/30 p-6 shadow-xl"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[#00ff9d] font-mono text-lg font-bold flex items-center gap-2">
              <FiClock className="text-[#00ff9d] text-xl" />
              Session Reminder
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#00ff9d] transition-colors"
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            You've been exploring ThreatLens for a while! To continue using all
            features and save your progress:
          </p>
          <ul className="text-gray-400 text-xs mb-4 list-disc list-inside space-y-2">
            <li>Access advanced analysis tools</li>
            <li>Save investigation histories</li>
            <li>Collaborate with team members</li>
          </ul>
          <button
            onClick={() => {
              window.location.href = import.meta.env.VITE_APP_GOOGLE_AUTH_URL;
              onClose();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 border border-[#00ff9d]/30 rounded-lg text-[#00ff9d] font-mono transition-all"
          >
            Sign In Now
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
