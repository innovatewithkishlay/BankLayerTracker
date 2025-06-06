import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GlowingButton } from "../components/UI/GlowingButton";
import {
  FiActivity,
  FiMapPin,
  FiShield,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const Home = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.name}!`, {
        style: {
          background: "#0d0d0d",
          color: "#00ff9d",
          border: "1px solid #00ff9d50",
        },
        icon: "👋",
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

  // Get user initial from email
  const userInitial = user?.email?.[0].toUpperCase() || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] text-white overflow-hidden flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6">
        <div className="pl-6 md:pl-8">
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

        <div className="relative pr-6">
          {user ? (
            <motion.div
              className="relative cursor-pointer select-none"
              onClick={() => setShowDropdown((prev) => !prev)}
              onBlur={() => setShowDropdown(false)}
              tabIndex={0}
            >
              <div className="flex items-center space-x-3 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 rounded-lg px-4 py-2 transition-colors">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-[#00ff9d]"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#00ff9d] flex items-center justify-center font-bold text-black text-lg">
                    {userInitial}
                  </div>
                )}
                <span className="text-gray-300 font-medium truncate max-w-[180px]">
                  {user.name || user.email}
                </span>
                <motion.div
                  animate={{ rotate: showDropdown ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[#00ff9d]"
                >
                  ▼
                </motion.div>
              </div>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-[#0d0d0d] border border-[#00ff9d]/20 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  <button
                    onClick={async () => {
                      await logout();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left text-gray-300 hover:bg-[#00ff9d]/10 hover:text-[#00ff9d] transition-colors flex items-center gap-2 font-semibold"
                  >
                    <FiLogOut className="ml-2" />
                    Log Out
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.a
              href={import.meta.env.VITE_APP_GOOGLE_AUTH_URL}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-[#00ff9d] text-black rounded-lg font-semibold hover:bg-[#00ff9d]/90 transition-all flex items-center gap-3 shadow-lg"
              aria-label="Sign Up with Google"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-6 w-6"
              >
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.54 0 6.7 1.21 9.14 3.59l6.83-6.83C34.06 2.63 29.35 0 24 0 14.64 0 6.25 6.64 3.3 15.82l7.96 6.18C12.62 16.04 17.77 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.5 24c0-1.57-.14-3.08-.41-4.54H24v8.59h12.7c-.55 3.09-3.27 5.61-6.7 5.61-4.09 0-7.41-3.37-7.41-7.52 0-.52.06-1.03.18-1.51h-7.29v5.48c1.94 3.75 6.04 6.45 11.32 6.45 6.62 0 11.98-5.49 11.98-12.66z"
                />
                <path
                  fill="#FBBC05"
                  d="M12.17 28.3c-.6-1.68-.6-3.58 0-5.26V17.56H4.21C2.54 20.3 1.5 23.54 1.5 27c0 3.4 1.07 6.55 2.84 9.19l7.83-7.9z"
                />
                <path
                  fill="#EA4335"
                  d="M24 46.5c6.09 0 11.22-2.01 15.16-5.48l-7.26-7.3c-2.33 1.56-5.34 2.55-8.05 2.55-4.74 0-8.77-3.22-10.22-7.57H4.21l7.96 7.96c2.15 2.6 5.58 4.24 9.83 4.24z"
                />
              </svg>
              Sign Up with Google
            </motion.a>
          )}
        </div>
      </nav>

      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 w-full">
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
