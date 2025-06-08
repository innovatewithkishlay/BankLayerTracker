import { useState, useEffect } from "react";
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

const ProTooltip = ({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: -10, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute left-1/2 -translate-x-1/2 -top-3 z-50"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="bg-[#181818] border border-[#00ff9d]/30 rounded-lg px-4 py-2 shadow-lg text-xs text-white font-mono"
          style={{
            minWidth: "200px",
            textAlign: "center",
            boxShadow: "0 6px 32px #00ff9d22",
            pointerEvents: "auto",
          }}
        >
          <span className="font-semibold text-[#00ff9d]">Pro Feature</span>
          <div className="mt-1">
            You need to purchase for this feature.
            <br />
            Contact owner:{" "}
            <span className="underline">kishlaykumar141@gmail.com</span>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [proTooltip, setProTooltip] = useState(false);

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
          <div className="max-w-7xl mx-auto px-6 py-20">
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

                <div className="relative flex items-center">
                  <GlowingButton
                    variant="danger"
                    onClick={() => {}}
                    onMouseEnter={() => setProTooltip(true)}
                    onMouseLeave={() => setProTooltip(false)}
                    onTouchStart={() => setProTooltip(true)}
                    onTouchEnd={() => setProTooltip(false)}
                    style={{
                      position: "relative",
                      paddingRight: "2.8em",
                    }}
                  >
                    <span className="relative flex items-center">
                      <TerminalText text="Cross-Case Investigation" />
                      <span
                        className="absolute -top-3 right-2 flex items-center"
                        style={{ pointerEvents: "none" }}
                      >
                        <span
                          className="bg-yellow-400 text-yellow-900 font-bold text-xs px-2 py-0.5 rounded-full shadow-md flex items-center"
                          style={{
                            fontFamily: "monospace",
                            fontSize: "1rem",
                            transform: "translateY(-0.2em)",
                            boxShadow: "0 2px 12px #0002",
                          }}
                        >
                          <span role="img" aria-label="pro" className="mr-1">
                            👑
                          </span>
                          PRO
                        </span>
                      </span>
                    </span>
                  </GlowingButton>
                  <ProTooltip show={proTooltip} />
                </div>
              </motion.div>

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
                Comprehensive AML investigation tools powered by machine
                learning and advanced analytics
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
                Streamlined investigation workflows with automated case
                management and reporting
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
        <Footer />
      </div>
    </div>
  );
};

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

export default Home;
