import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlowingButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "danger";
  href?: string;
}

export const GlowingButton = ({
  onClick,
  children,
  variant = "primary",
  href,
}: GlowingButtonProps) => {
  const className = `px-8 py-3 rounded-lg font-mono text-lg tracking-widest transition-all
    ${
      variant === "primary"
        ? "bg-cyber-green text-white hover:bg-green-400"
        : "bg-red-600 text-white hover:bg-red-500"
    }
    shadow-lg hover:shadow-xl`;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};
