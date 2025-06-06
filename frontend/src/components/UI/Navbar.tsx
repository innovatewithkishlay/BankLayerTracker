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
          whileHover={{ scale: 1.03 }}
          className="h-16 w-16 md:h-20 md:w-20 object-contain rounded-lg"
        />
      </div>
      <div className="flex items-center space-x-4 pr-6">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-gray-100/5"
            >
              <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-full h-full rounded-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <FiUser className="text-gray-400" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-200">
                {user.email}
              </span>
            </button>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl z-50"
                >
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 transition-colors rounded-xl"
                  >
                    <FiLogOut className="text-gray-400" />
                    <span className="text-sm font-medium">Log out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.a
            href={`${import.meta.env.VITE_APP_GOOGLE_AUTH_URL}`}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <FiTerminal />
            <span>Sign in</span>
          </motion.a>
        )}
      </div>
    </nav>
  );
};
