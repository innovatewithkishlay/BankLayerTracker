import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GlowingButton } from "../components/UI/GlowingButton";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-cyber-background flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-6xl font-orbitron text-cyber-green mb-12 cyber-glow"
      >
        THREATLENS
      </motion.h1>

      <div className="space-y-6">
        <GlowingButton onClick={() => navigate("/plugin")}>
          <TerminalText text="Single Case Analysis" />
        </GlowingButton>

        <GlowingButton variant="danger" onClick={() => navigate("/interlink")}>
          <TerminalText text="Cross-Case Investigation" />
        </GlowingButton>
      </div>
    </div>
  );
};

const TerminalText = ({ text }: { text: string }) => (
  <span className="font-mono tracking-widest">{`> ${text}`}</span>
);
