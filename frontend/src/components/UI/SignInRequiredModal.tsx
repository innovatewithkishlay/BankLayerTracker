import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTerminal } from "react-icons/fi";

export default function SignInRequiredModal({
  show,
  onClose,
  onSignIn,
}: {
  show: boolean;
  onClose: () => void;
  onSignIn: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-[#181a20] border border-[#00ff9d]/30 rounded-xl shadow-2xl p-8 w-full max-w-xs sm:max-w-md text-center relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-[#00ff9d] transition-colors"
              aria-label="Close"
            >
              <FiX size={22} />
            </button>
            <div className="flex justify-center mb-4">
              <span className="bg-[#00ff9d]/10 p-3 rounded-full mb-2">
                <FiTerminal className="text-[#00ff9d] text-2xl" />
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-[#00ff9d]">
              Sign In Required
            </h2>
            <p className="text-gray-300 mb-6">
              You need to sign in first to continue.
              <br />
              <span className="text-[#00ff9d] font-semibold">
                Be part of the ThreatLens family!
              </span>
            </p>
            <button
              onClick={onSignIn}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 border border-[#00ff9d]/40 rounded-lg text-[#00ff9d] font-mono font-semibold transition-all"
            >
              <FiTerminal className="text-lg" />
              Sign in
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
