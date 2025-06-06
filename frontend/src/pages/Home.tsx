import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GlowingButton } from "../components/UI/GlowingButton";
import {
  FiActivity,
  FiMapPin,
  FiShield,
  FiUsers,
  FiUser,
  FiLogOut,
  FiTerminal,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

export const Home = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.name}`, {
        icon: "👋",
        style: {
          background: "#0d0d0d",
          color: "#00ff9d",
          border: "1px solid #00ff9d50",
        },
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#00ff9d] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] text-white overflow-hidden flex flex-col">
      {/* Navigation Bar */}
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
            <div className="relative">
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

      {/* Main Content */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 w-full">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-[#00ff9d]">AML</span> Investigation
              <br />
              Made <span className="text-[#00ff9d]">Precise</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
            >
              Analyze transaction patterns, detect suspicious activities, and
              visualize financial networks with forensic precision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-6 justify-center"
            >
              <GlowingButton
                variant="primary"
                onClick={() => navigate("/plugin")}
              >
                <TerminalText text="Single Case Analysis" />
              </GlowingButton>

              <GlowingButton
                variant="danger"
                onClick={() => navigate("/interlink")}
              >
                <TerminalText text="Cross-Case Investigation" />
              </GlowingButton>
            </motion.div>
          </div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <FeatureCard
              icon={<FiActivity className="text-3xl" />}
              title="Network Visualization"
              description="Map transaction flows between accounts and entities"
            />
            <FeatureCard
              icon={<FiMapPin className="text-3xl" />}
              title="Geographic Analysis"
              description="Track transaction origins across jurisdictions"
            />
            <FeatureCard
              icon={<FiShield className="text-3xl" />}
              title="Anomaly Detection"
              description="Identify unusual transaction patterns"
            />
            <FeatureCard
              icon={<FiUsers className="text-3xl" />}
              title="Cross-Case Linking"
              description="Connect related cases for deeper insights"
            />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center border-t border-[#00ff9d]/20">
        <div className="text-gray-400 text-sm">
          Transaction Analysis System — v1.0
        </div>
      </div>
    </div>
  );
};

// Sub-components
const TerminalText = ({ text }: { text: string }) => (
  <span className="font-mono tracking-wide">{`> ${text}`}</span>
);

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 border border-[#00ff9d]/20 rounded-xl bg-[#0d0d0d] hover:border-[#00ff9d]/40 transition-colors"
  >
    <div className="text-[#00ff9d] mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);
