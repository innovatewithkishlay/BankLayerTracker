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
  FiDatabase,
  FiTrendingUp,
  FiEye,
  FiCheck,
  FiClock,
  FiBarChart,
} from "react-icons/fi";

import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useClickOutside } from "../hooks/useClickOutside";

export const Home = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dropdownRef = useClickOutside(() => setIsProfileOpen(false));

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

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold mb-8"
            >
              <span className="text-[#00ff9d]">AML</span> Investigation
              <br />
              Made <span className="text-[#00ff9d]">Precise</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              Advanced AI-powered platform for financial crime detection,
              transaction analysis, and regulatory compliance. Detect money
              laundering patterns with forensic precision and reduce
              investigation time by up to 85%.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-8 justify-center mb-16"
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

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
            >
              <StatCard value="99.7%" label="Detection Accuracy" />
              <StatCard value="<2min" label="Analysis Time" />
              <StatCard value="85%" label="False Positive Reduction" />
            </motion.div>
          </div>

          {/* Core Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              <span className="text-[#00ff9d]">Core</span> Capabilities
            </h2>
            <p className="text-gray-400 text-center mb-12 text-lg max-w-3xl mx-auto">
              Comprehensive AML investigation tools powered by machine learning
              and advanced analytics
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<FiActivity className="text-4xl" />}
                title="Advanced Transaction Monitoring"
                description="Real-time analysis of transaction patterns using AI algorithms to detect suspicious activities, structuring, and layering schemes across multiple accounts and jurisdictions."
              />
              <FeatureCard
                icon={<FiMapPin className="text-4xl" />}
                title="Geographic Risk Analysis"
                description="Track fund movements across geographic boundaries, identify high-risk jurisdictions, and analyze cross-border transaction flows with integrated sanctions screening."
              />
              <FeatureCard
                icon={<FiShield className="text-4xl" />}
                title="Behavioral Anomaly Detection"
                description="Machine learning models that establish customer baselines and detect deviations indicating potential money laundering, terrorist financing, or fraud schemes."
              />
              <FeatureCard
                icon={<FiUsers className="text-4xl" />}
                title="Network & Entity Analysis"
                description="Visualize complex relationship networks between accounts, entities, and beneficial owners to uncover hidden connections and layered ownership structures."
              />
              <FeatureCard
                icon={<FiDatabase className="text-4xl" />}
                title="Multi-Source Data Integration"
                description="Seamlessly integrate transaction data, customer information, sanctions lists, and external databases for comprehensive risk assessment and due diligence."
              />
              <FeatureCard
                icon={<FiTrendingUp className="text-4xl" />}
                title="Predictive Risk Scoring"
                description="Advanced analytics engine that calculates dynamic risk scores based on transaction patterns, customer behavior, and external risk factors."
              />
            </div>
          </motion.div>

          {/* Investigation Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              Investigation <span className="text-[#00ff9d]">Excellence</span>
            </h2>
            <p className="text-gray-400 text-center mb-12 text-lg max-w-3xl mx-auto">
              Streamlined investigation workflows with automated case management
              and reporting
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InvestigationFeature
                icon={<FiEye className="text-3xl" />}
                title="Automated Case Generation"
                description="Intelligent alert prioritization and case creation based on risk severity, reducing manual review time and ensuring high-risk cases receive immediate attention."
                features={[
                  "Smart alert triage",
                  "Risk-based prioritization",
                  "Automated workflows",
                ]}
              />
              <InvestigationFeature
                icon={<FiBarChart className="text-3xl" />}
                title="Advanced Analytics Dashboard"
                description="Interactive visualizations and comprehensive reporting tools for investigators, compliance officers, and regulatory reporting requirements."
                features={[
                  "Real-time dashboards",
                  "Custom report generation",
                  "Regulatory compliance tracking",
                ]}
              />
              <InvestigationFeature
                icon={<FiClock className="text-3xl" />}
                title="Rapid Investigation Tools"
                description="Accelerated investigation capabilities with automated data gathering, timeline reconstruction, and evidence compilation for faster case resolution."
                features={[
                  "Timeline analysis",
                  "Evidence management",
                  "Case documentation",
                ]}
              />
              <InvestigationFeature
                icon={<FiCheck className="text-3xl" />}
                title="Compliance Automation"
                description="Automated SAR filing, regulatory reporting, and audit trail maintenance ensuring consistent compliance with AML regulations and standards."
                features={[
                  "SAR automation",
                  "Audit trails",
                  "Regulatory reporting",
                ]}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 text-center border-t border-[#00ff9d]/20">
        <div className="text-gray-400 text-lg">
          Enterprise AML Investigation Platform — v2.0
        </div>
        <div className="text-gray-500 text-sm mt-2">
          Powered by Advanced AI & Machine Learning
        </div>
      </div>
    </div>
  );
};

// Enhanced Components
const TerminalText = ({ text }: { text: string }) => (
  <span className="font-mono tracking-wide text-lg">{`> ${text}`}</span>
);

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="text-center p-6 bg-[#00ff9d]/5 rounded-xl border border-[#00ff9d]/20"
  >
    <div className="text-4xl font-bold text-[#00ff9d] mb-2">{value}</div>
    <div className="text-gray-400 text-lg">{label}</div>
  </motion.div>
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
    whileHover={{ y: -8, scale: 1.02 }}
    className="p-8 border border-[#00ff9d]/20 rounded-2xl bg-[#0d0d0d] hover:border-[#00ff9d]/50 transition-all duration-300 group"
  >
    <div className="text-[#00ff9d] mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-[#00ff9d] transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
  </motion.div>
);

const InvestigationFeature = ({
  icon,
  title,
  description,
  features,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-8 border border-[#00ff9d]/20 rounded-2xl bg-[#0d0d0d] hover:border-[#00ff9d]/40 transition-all"
  >
    <div className="flex items-center mb-6">
      <div className="text-[#00ff9d] mr-4">{icon}</div>
      <h3 className="text-2xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-400 mb-6 text-lg">{description}</p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-300">
          <FiCheck className="text-[#00ff9d] mr-3" />
          {feature}
        </li>
      ))}
    </ul>
  </motion.div>
);
