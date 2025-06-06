import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLogOut, FiTerminal } from "react-icons/fi";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useNavigate } from "react-router-dom";
