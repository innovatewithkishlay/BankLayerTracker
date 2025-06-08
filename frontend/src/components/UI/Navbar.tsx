import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLogOut, FiTerminal } from "react-icons/fi";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useNavigate } from "react-router-dom";

const logoVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const separatorVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 0.5, y: 0, transition: { delay: 0.7, duration: 0.4 } },
};

const textContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.85,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 24 },
  },
};

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsProfileOpen(false));
  const navigate = useNavigate();

  const brandText = "Threatlens";

  return (
    <nav className="flex items-center justify-between p-4 sm:p-6 w-full">
      <div className="flex items-center pl-2 sm:pl-6 md:pl-8">
        <motion.img
          src="/assets/threatlens.png"
          alt="ThreatLens Logo"
          className="h-14 w-14 object-contain"
          style={{
            borderRadius: 0,
            boxShadow: "none",
            background: "none",
            margin: 0,
            padding: 0,
            border: "none",
            filter: "none",
            display: "block",
          }}
          draggable={false}
          variants={logoVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.span
          className="mx-2"
          style={{
            color: "#00ff9d",
            fontWeight: 400,
            fontSize: "1.5rem",
            fontFamily: "'Inter', 'Poppins', sans-serif",
            lineHeight: 1,
            userSelect: "none",
            opacity: 0.5,
            letterSpacing: 0,
          }}
          variants={separatorVariants}
          initial="hidden"
          animate="visible"
        >
          |
        </motion.span>
        <motion.div
          className="flex space-x-0.5"
          style={{
            fontFamily: "'Inter', 'Montserrat', sans-serif",
            fontWeight: 500,
            fontSize: "1.8rem",
            letterSpacing: "0.045em",
            color: "#00ff9d",
            userSelect: "none",
            textShadow: "0 2px 10px #00ff9d22",
            lineHeight: 1,
          }}
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {brandText.split("").map((char, idx) => (
            <motion.span key={idx} variants={letterVariants}>
              {char}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Profile/Login */}
      <div className="flex items-center space-x-2 sm:space-x-4 pr-2 sm:pr-6">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-[#0d0d0d] rounded-xl border-2 border-[#00ff9d]/30 hover:border-[#00ff9d]/50 transition-all"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#00ff9d] rounded-full blur-[12px] opacity-20 group-hover:opacity-30 transition-opacity" />
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-[#00ff9d]/50"
                    alt="Profile"
                  />
                ) : (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d0d0d] border-2 border-[#00ff9d]/50 flex items-center justify-center">
                    <FiUser className="text-[#00ff9d] text-sm sm:text-base" />
                  </div>
                )}
              </div>
              <span className="font-mono text-xs sm:text-sm bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] bg-clip-text text-transparent hidden sm:block">
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
                  className="absolute right-0 mt-2 w-48 sm:w-56 bg-[#0d0d0d] border-2 border-[#00ff9d]/40 rounded-xl backdrop-blur-xl z-50"
                >
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-[#00ff9d] hover:bg-[#00ff9d]/10 flex items-center gap-2 transition-colors rounded-xl"
                  >
                    <FiLogOut className="text-base sm:text-lg" />
                    <span className="font-mono text-xs sm:text-sm">
                      Terminate Session
                    </span>
                    <span className="ml-auto text-xs text-[#00ff9d]/70 hidden sm:inline">
                      Logout
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.a
            href={`${import.meta.env.VITE_APP_GOOGLE_AUTH_URL}`}
            onClick={() => localStorage.setItem("showWelcomeToast", "true")}
            whileHover={{ y: -2 }}
            className="group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3
              bg-gradient-to-r from-[#00ff9d] to-[#00d4ff]
              text-black font-bold text-xs sm:text-sm md:text-base rounded-xl
              shadow-lg shadow-[#00ff9d]/20
              transition-all duration-300
              hover:from-[#00ff9d]/90 hover:to-[#00d4ff]/80
              hover:shadow-xl hover:scale-105
              focus:outline-none focus:ring-4 focus:ring-[#00ff9d]/40
              overflow-hidden"
            style={{
              letterSpacing: "0.04em",
              fontFamily: "monospace",
            }}
          >
            <span className="relative flex items-center">
              <FiTerminal className="mr-1 sm:mr-2 text-sm sm:text-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
              <span className="hidden sm:inline">Sign in</span>
              <span className="sm:hidden">Login</span>
            </span>
            <span
              className="
                absolute inset-0 rounded-xl
                bg-white/10 opacity-0 group-hover:opacity-100
                transition-opacity duration-300 pointer-events-none
              "
            />
          </motion.a>
        )}
      </div>
    </nav>
  );
};
