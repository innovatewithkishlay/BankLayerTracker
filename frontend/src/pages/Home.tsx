import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GlowingButton } from "../components/UI/GlowingButton";
import {
  FiActivity,
  FiMapPin,
  FiClock,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiArrowRight,
  FiPlay,
} from "react-icons/fi";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-6 relative z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] rounded-lg" />
          <span className="text-xl font-bold">THREATLENS</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
            Login
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-[#00ff9d]/25 transition-all">
            Sign Up
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 py-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#00ff9d]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="px-4 py-2 bg-gradient-to-r from-[#00ff9d]/20 to-[#00d4ff]/20 border border-[#00ff9d]/30 rounded-full text-sm text-[#00ff9d] font-medium">
                ✨ Next-Gen Financial Intelligence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6"
            >
              THREAT
              <span className="bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] bg-clip-text text-transparent">
                LENS
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Uncover hidden financial threats with AI-powered analysis.
              <br />
              <span className="text-[#00ff9d]">
                Visualize, analyze, and act
              </span>{" "}
              on suspicious patterns.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => navigate("/plugin")}
                className="group px-8 py-4 bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] text-black rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#00ff9d]/25 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Analysis</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="flex items-center space-x-2 px-8 py-4 border border-gray-600 rounded-xl text-gray-300 hover:border-[#00ff9d] hover:text-[#00ff9d] transition-all duration-300">
                <FiPlay />
                <span>Watch Demo</span>
              </button>
            </motion.div>
          </div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          >
            <FeatureCard
              icon={<FiActivity />}
              title="Network Intelligence"
              description="Visualize complex transaction relationships with interactive network graphs"
              gradient="from-[#00ff9d]/20 to-[#00ff9d]/5"
              iconColor="text-[#00ff9d]"
            />
            <FeatureCard
              icon={<FiMapPin />}
              title="Geographic Tracking"
              description="Map transaction origins and identify cross-border suspicious activity"
              gradient="from-[#00d4ff]/20 to-[#00d4ff]/5"
              iconColor="text-[#00d4ff]"
            />
            <FeatureCard
              icon={<FiShield />}
              title="AI Threat Detection"
              description="Machine learning algorithms identify patterns humans might miss"
              gradient="from-[#ff6b6b]/20 to-[#ff6b6b]/5"
              iconColor="text-[#ff6b6b]"
            />
            <FeatureCard
              icon={<FiClock />}
              title="Real-time Analysis"
              description="Process and analyze transaction data in seconds, not hours"
              gradient="from-[#ffd93d]/20 to-[#ffd93d]/5"
              iconColor="text-[#ffd93d]"
            />
            <FeatureCard
              icon={<FiTrendingUp />}
              title="Risk Scoring"
              description="Dynamic risk assessment with actionable threat levels"
              gradient="from-[#a78bfa]/20 to-[#a78bfa]/5"
              iconColor="text-[#a78bfa]"
            />
            <FeatureCard
              icon={<FiUsers />}
              title="Cross-Case Intel"
              description="Connect seemingly unrelated cases to reveal hidden networks"
              gradient="from-[#f97316]/20 to-[#f97316]/5"
              iconColor="text-[#f97316]"
            />
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div>
              <div className="text-4xl font-bold text-[#00ff9d] mb-2">
                99.7%
              </div>
              <div className="text-gray-400">Detection Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#00d4ff] mb-2">2.3s</div>
              <div className="text-gray-400">Average Analysis Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#ffd93d] mb-2">1M+</div>
              <div className="text-gray-400">Transactions Analyzed</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <div className="text-gray-600 text-sm">
          Cybercrime Intelligence Suite — v2.0 | Powered by AI
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  gradient,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group`}
  >
    <div
      className={`${iconColor} text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);
