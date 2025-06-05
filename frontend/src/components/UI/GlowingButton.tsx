import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlowingButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "danger";
  href?: string;
}
