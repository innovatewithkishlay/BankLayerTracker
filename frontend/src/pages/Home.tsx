import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GlowingButton } from "../components/UI/GlowingButton";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#050505] via-[#0f0f0f] to-[#1a1a1a] flex flex-col items-center justify-center px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl sm:text-6xl font-orbitron text-cyber-green mb-4 cyber-glow"
      >
        THREATLENS
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-gray-400 max-w-2xl text-sm sm:text-base mb-12"
      >
        Visualize and trace suspicious financial activity with nodal spider
        maps, detect patterns of money layering, and uncover connections across
        bank accounts in real-time.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="space-y-6 w-full max-w-sm"
      >
        <GlowingButton onClick={() => navigate("/plugin")}>
          <TerminalText text="Single Case Analysis" />
        </GlowingButton>

        <GlowingButton variant="danger" onClick={() => navigate("/interlink")}>
          <TerminalText text="Cross-Case Investigation" />
        </GlowingButton>
      </motion.div>
    </div>
  );
};

const TerminalText = ({ text }: { text: string }) => (
  <span className="font-mono tracking-widest text-sm sm:text-base">{`> ${text}`}</span>
);
