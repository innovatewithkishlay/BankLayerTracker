import { motion, AnimatePresence } from "framer-motion";

export const CyberLoader = ({ progress }: { progress: number }) => (
  <div className="relative h-screen w-full flex items-center justify-center bg-[#0A001A] overflow-hidden">
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 text-center space-y-8"
      >
        <motion.div
          className="relative inline-block text-6xl font-bold font-orbitron text-[#00ff9d]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.span
            className="absolute top-0 left-0 w-full h-full text-[#00ff9d] opacity-50"
            animate={{ x: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            THREATLENS
          </motion.span>
          <motion.span
            className="absolute top-0 left-0 w-full h-full text-[#00ff9d] opacity-50"
            animate={{ x: [2, -2, 2] }}
            transition={{ repeat: Infinity, duration: 0.5, delay: 0.25 }}
          >
            THREATLENS
          </motion.span>
          <span>THREATLENS</span>
        </motion.div>

        {/* Progress bar */}
        <div className="w-96 h-2 bg-gray-900 rounded-full mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-[#00ff9d] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2 font-mono text-[#00ff9d]"
        >
          <p>
            {progress < 33 && "> Accessing blockchain ledger..."}
            {progress >= 33 &&
              progress < 66 &&
              "> Analyzing transaction patterns..."}
            {progress >= 66 && "> Finalizing threat assessment..."}
          </p>
          <p className="text-4xl font-bold text-[#00ff9d]">{progress}%</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </div>
);
