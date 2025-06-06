import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLogOut, FiTerminal } from "react-icons/fi";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsProfileOpen(false));
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between p-6">
      <div className="flex items-center space-x-3 pl-6 md:pl-8">
        <motion.img
          src="/src/assets/threatlens.png"
          alt="ThreatLens Logo"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          className="h-16 w-16 md:h-20 md:w-20 object-contain rounded-lg shadow-lg"
          style={{ boxShadow: "0 2px 20px #00ff9daa" }}
        />
      </div>

      <div className="flex items-center space-x-4 pr-6">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 rounded-lg transition-all"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#00ff9d] rounded-full blur-[10px] opacity-20" />
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-8 h-8 rounded-full border-2 border-[#00ff9d]/50"
                    alt="Profile"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#0d0d0d] border-2 border-[#00ff9d]/50 flex items-center justify-center">
                    <FiUser className="text-[#00ff9d]" />
                  </div>
                )}
              </div>
              <span className="font-mono text-sm bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] bg-clip-text text-transparent">
                {user.email}
              </span>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute right-0 mt-2 w-48 bg-[#0d0d0d] border-2 border-[#00ff9d]/30 rounded-xl backdrop-blur-xl z-50"
                >
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-[#00ff9d] hover:bg-[#00ff9d]/10 flex items-center gap-2 transition-colors rounded-xl"
                  >
                    <FiLogOut />
                    <span className="font-mono">Terminate Session</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.a
            href={`${import.meta.env.VITE_APP_GOOGLE_AUTH_URL}`}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 bg-[#00ff9d] text-black rounded-lg font-semibold hover:bg-[#00ff9d]/90 flex items-center gap-2"
          >
            <FiTerminal className="rotate-12" />
            <span>Initiate Auth Sequence</span>
          </motion.a>
        )}
      </div>
    </nav>
  );
};
