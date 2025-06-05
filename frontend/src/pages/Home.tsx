import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GlowingButton } from "../components/UI/GlowingButton";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] flex flex-col items-center justify-center px-6 relative text-white">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-bold text-cyber-green mb-4"
      >
        THREATLENS
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-gray-400 max-w-2xl text-center mb-12 text-sm md:text-base"
      >
        Detect, visualize, and trace suspicious financial trails using advanced
        bank account layering analysis. Investigate single or cross-case
        activities in a streamlined interface.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col md:flex-row gap-6 w-full max-w-xl justify-center"
      >
        <GlowingButton onClick={() => navigate("/plugin")}>
          <TerminalText text="Single Case Analysis" />
        </GlowingButton>

        <GlowingButton variant="danger" onClick={() => navigate("/interlink")}>
          <TerminalText text="Cross-Case Investigation" />
        </GlowingButton>
      </motion.div>

      <div className="absolute bottom-4 text-gray-600 text-sm">
        Cybercrime Intelligence Suite — v1.0
      </div>
    </div>
  );
};

const TerminalText = ({ text }: { text: string }) => (
  <span className="font-mono tracking-wide text-base md:text-lg">{`> ${text}`}</span>
);
