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
  const className = `
    px-6 py-3 rounded-md font-mono text-sm md:text-base tracking-wider
    transition-all border border-transparent
    ${
      variant === "primary"
        ? "bg-cyber-green text-black hover:bg-[#50fa7b] focus:ring focus:ring-green-300"
        : "bg-red-600 text-white hover:bg-red-500 focus:ring focus:ring-red-300"
    }
    shadow-md hover:shadow-lg
  `;

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};
