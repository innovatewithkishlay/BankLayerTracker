import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GlowingButton } from "../components/UI/GlowingButton";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import {
  FiActivity,
  FiMapPin,
  FiShield,
  FiUsers,
  FiDatabase,
  FiTrendingUp,
  FiEye,
  FiCheck,
  FiClock,
  FiBarChart,
} from "react-icons/fi";
import { Navbar } from "../components/UI/Navbar";
import Footer from "../components/UI/Footer";
import ContributePopup from "../components/UI/ContributePopup";
import SignInRequiredModal from "../components/UI/SignInRequiredModal";

export const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showProPopup, setShowProPopup] = useState(false);
  const [showContributePopup, setShowContributePopup] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const signInTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (user && localStorage.getItem("showWelcomeToast") === "true") {
      toast.success(`Welcome back, ${user.name}`, {
        icon: "👋",
        style: {
          background: "#0d0d0d",
          color: "#00ff9d",
          border: "1px solid #00ff9d50",
        },
      });
      localStorage.removeItem("showWelcomeToast");
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContributePopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      signInTimerRef.current = setTimeout(() => {
        setShowSignInModal(true);
      }, 180000);
    }
    return () => {
      if (signInTimerRef.current) clearTimeout(signInTimerRef.current);
    };
  }, [user]);

  const handleSingleCaseClick = () => {
    if (!user) {
      setShowSignInModal(true);
    } else {
      navigate("/plugin");
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] text-white overflow-hidden flex flex-col relative">
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.18,
          background: "transparent",
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", left: 0, top: 0 }}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="smallGrid"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="#00ff9d"
                strokeWidth="1"
                opacity="0.18"
              />
            </pattern>
            <pattern
              id="grid"
              width="112"
              height="112"
              patternUnits="userSpaceOnUse"
            >
              <rect width="112" height="112" fill="url(#smallGrid)" />
              <path
                d="M 112 0 L 0 0 0 112"
                fill="none"
                stroke="#00ff9d"
                strokeWidth="1"
                opacity="0.28"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)">
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="28 28"
              dur="20s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="text-center mb-16 sm:mb-20">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8 px-4"
              >
                <span className="text-[#00ff9d]">Transaction</span> Analysis
                <br />
                Made <span className="text-[#00ff9d]">Precise</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg sm:text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
              >
                Powerful platform for advanced data analysis, transaction
                review, and workflow automation. Identify unusual patterns with
                forensic precision and reduce investigation time by up to 85%.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center mb-12 sm:mb-16 px-4"
              >
                <GlowingButton
                  variant="primary"
                  onClick={handleSingleCaseClick}
                >
                  <TerminalText text="Single Case Analysis" />
                </GlowingButton>

                <div
                  className="relative inline-block"
                  onMouseEnter={() => setShowProPopup(true)}
                  onMouseLeave={() => setShowProPopup(false)}
                >
                  <button
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#181a20] text-[#00ff9d] font-mono text-base sm:text-lg font-bold rounded-lg border border-[#00ff9d]/40 shadow-lg hover:bg-[#23262e] transition-all relative"
                    style={{ paddingRight: "3.5em" }}
                    disabled
                  >
                    <span className="relative flex items-center justify-center sm:justify-start">
                      <TerminalText text="Cross-Case Investigation" />
                      <span
                        className="absolute -top-4 right-2 flex items-center"
                        style={{ pointerEvents: "none" }}
                      >
                        <span
                          className="bg-[#181a20]/90 border border-[#00ff9d] text-[#00ff9d] font-bold text-xs px-2 py-0.5 rounded-full shadow-md flex items-center backdrop-blur"
                          style={{
                            fontFamily: "monospace",
                            fontSize: "0.95rem",
                            transform: "translateY(-0.2em)",
                            boxShadow: "0 2px 12px #00ff9d33",
                            letterSpacing: "0.08em",
                          }}
                        >
                          <span role="img" aria-label="pro" className="mr-1">
                            👑
                          </span>
                          PRO
                        </span>
                      </span>
                    </span>
                  </button>
                  <AnimatePresence>
                    {showProPopup && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          duration: 0.2,
                        }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 bg-[#181818]/95 border border-[#00ff9d]/30 text-white text-xs rounded-lg px-4 py-3 shadow-xl font-mono w-64 sm:w-72 text-center backdrop-blur-sm"
                        style={{ pointerEvents: "none" }}
                      >
                        <div className="flex items-center gap-2 mb-1 justify-center">
                          <motion.div
                            className="w-2 h-2 bg-[#00ff9d] rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="font-semibold text-[#00ff9d] text-sm">
                            Pro Feature
                          </span>
                        </div>
                        <div className="text-gray-300 leading-snug mb-1 text-xs sm:text-sm">
                          Advanced features require enterprise license.
                          <br />
                          Contact:{" "}
                          <a
                            href="mailto:kishlay141@gmail.com"
                            className="text-[#00ff9d] underline"
                          >
                            kishlay141@gmail.com
                          </a>
                        </div>
                        <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-3 h-3 bg-[#181818]/95 border-l border-t border-[#00ff9d]/30 rotate-45"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20 px-4"
              >
                <StatCard value="99.7%" label="Pattern Detection Accuracy" />
                <StatCard value="<2min" label="Analysis Time" />
                <StatCard value="85%" label="Noise Reduction" />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16 sm:mb-20"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 px-4">
                <span className="text-[#00ff9d]">Core</span> Features
              </h2>
              <p className="text-gray-400 text-center mb-8 sm:mb-12 text-base sm:text-lg max-w-3xl mx-auto px-4">
                Comprehensive investigation tools for data-driven pattern
                recognition and workflow automation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
                <FeatureCard
                  icon={<FiActivity className="text-3xl sm:text-4xl" />}
                  title="Advanced Transaction Monitoring"
                  description="Real-time analysis of transaction patterns to identify suspicious activities, structuring, and layering schemes across multiple accounts and jurisdictions."
                />
                <FeatureCard
                  icon={<FiMapPin className="text-3xl sm:text-4xl" />}
                  title="Geographic Risk Analysis"
                  description="Track fund movements across geographic boundaries, identify high-risk jurisdictions, and analyze cross-border transaction flows with integrated screening."
                />
                <FeatureCard
                  icon={<FiShield className="text-3xl sm:text-4xl" />}
                  title="Behavioral Pattern Detection"
                  description="Establishes customer activity baselines and detects deviations that may indicate potential money laundering, terrorist financing, or fraud schemes."
                />
                <FeatureCard
                  icon={<FiUsers className="text-3xl sm:text-4xl" />}
                  title="Network & Entity Analysis"
                  description="Visualize complex relationship networks between accounts and entities to uncover hidden connections and layered ownership structures."
                />
                <FeatureCard
                  icon={<FiDatabase className="text-3xl sm:text-4xl" />}
                  title="Multi-Source Data Integration"
                  description="Integrate transaction data, customer information, lists, and external databases for comprehensive assessment and due diligence."
                />
                <FeatureCard
                  icon={<FiTrendingUp className="text-3xl sm:text-4xl" />}
                  title="Dynamic Risk Scoring"
                  description="Calculate dynamic risk scores based on transaction patterns, customer behavior, and external risk factors."
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-16 sm:mb-20"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 px-4">
                Investigation <span className="text-[#00ff9d]">Workflows</span>
              </h2>
              <p className="text-gray-400 text-center mb-8 sm:mb-12 text-base sm:text-lg max-w-3xl mx-auto px-4">
                Streamlined investigation workflows with automated case
                management and reporting.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-4">
                <InvestigationFeature
                  icon={<FiEye className="text-2xl sm:text-3xl" />}
                  title="Automated Case Generation"
                  description="Intelligent alert prioritization and case creation based on risk severity, reducing manual review time and ensuring high-risk cases receive immediate attention."
                  features={[
                    "Smart alert triage",
                    "Risk-based prioritization",
                    "Automated workflows",
                  ]}
                />
                <InvestigationFeature
                  icon={<FiBarChart className="text-2xl sm:text-3xl" />}
                  title="Advanced Analytics Dashboard"
                  description="Interactive visualizations and comprehensive reporting tools for investigators and compliance officers."
                  features={[
                    "Real-time dashboards",
                    "Custom report generation",
                    "Compliance tracking",
                  ]}
                />
                <InvestigationFeature
                  icon={<FiClock className="text-2xl sm:text-3xl" />}
                  title="Rapid Investigation Tools"
                  description="Accelerated investigation capabilities with automated data gathering, timeline reconstruction, and evidence compilation for faster case resolution."
                  features={[
                    "Timeline analysis",
                    "Evidence management",
                    "Case documentation",
                  ]}
                />
                <InvestigationFeature
                  icon={<FiCheck className="text-2xl sm:text-3xl" />}
                  title="Compliance Automation"
                  description="Automated reporting and audit trail maintenance ensuring consistent compliance with regulations and standards."
                  features={[
                    "Reporting automation",
                    "Audit trails",
                    "Regulatory reporting",
                  ]}
                />
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
      {/* Popups */}
      <ContributePopup
        show={showContributePopup}
        onClose={() => setShowContributePopup(false)}
      />
      <SignInRequiredModal
        show={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={() => {
          if (signInTimerRef.current) clearTimeout(signInTimerRef.current);
          window.location.href = import.meta.env.VITE_APP_GOOGLE_AUTH_URL;
        }}
      />
    </div>
  );
};

const TerminalText = ({ text }: { text: string }) => (
  <span className="font-mono tracking-wide text-sm sm:text-lg">{`> ${text}`}</span>
);

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="text-center p-4 sm:p-6 bg-[#00ff9d]/5 rounded-xl border border-[#00ff9d]/20"
  >
    <div className="text-2xl sm:text-4xl font-bold text-[#00ff9d] mb-2">
      {value}
    </div>
    <div className="text-gray-400 text-sm sm:text-lg">{label}</div>
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
    className="p-6 sm:p-8 border border-[#00ff9d]/20 rounded-2xl bg-[#0d0d0d] hover:border-[#00ff9d]/50 transition-all duration-300 group"
  >
    <div className="text-[#00ff9d] mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white group-hover:text-[#00ff9d] transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 text-sm sm:text-lg leading-relaxed">
      {description}
    </p>
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
    className="p-6 sm:p-8 border border-[#00ff9d]/20 rounded-2xl bg-[#0d0d0d] hover:border-[#00ff9d]/40 transition-all"
  >
    <div className="flex items-center mb-4 sm:mb-6">
      <div className="text-[#00ff9d] mr-3 sm:mr-4">{icon}</div>
      <h3 className="text-xl sm:text-2xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-lg">
      {description}
    </p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li
          key={index}
          className="flex items-center text-gray-300 text-sm sm:text-base"
        >
          <FiCheck className="text-[#00ff9d] mr-2 sm:mr-3 flex-shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
  </motion.div>
);

export default Home;
