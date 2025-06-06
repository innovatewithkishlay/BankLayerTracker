import { Toaster, ToastIcon, resolveValue } from "react-hot-toast";
import { motion } from "framer-motion";

export const CyberToast = () => (
  <Toaster position="bottom-right">
    {(t) => (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className={`p-4 font-mono text-sm border-2 ${
          t.type === "error"
            ? "border-red-500/30 text-red-400"
            : "border-[#00ff9d]/30 text-[#00ff9d]"
        } bg-[#0d0d0d]/90 backdrop-blur-lg rounded-lg shadow-cyber`}
        style={{
          boxShadow: "0 0 15px rgba(0, 255, 157, 0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <ToastIcon toast={t} />
          {resolveValue(t.message, t)}
        </div>
      </motion.div>
    )}
  </Toaster>
);
