import { motion } from "framer-motion";
import { MdCookie } from "react-icons/md";
import { FiInfo, FiSettings, FiMail, FiLink } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/UI/Footer";

export default function CookiePolicy() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#181a20]/70 backdrop-blur-lg rounded-xl p-8 shadow-xl"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
            <span className="text-[#00ff9d]">Cookie</span> Policy
          </h1>

          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <MdCookie className="text-[#00ff9d] text-xl" />
                What Are Cookies?
              </h2>
              <p className="text-gray-300">
                Cookies are small text files stored on your device by websites
                to enhance functionality, analyze usage, and personalize your
                experience.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <FiInfo className="text-[#00ff9d] text-xl" />
                Types of Cookies We Use
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#181a20]/80 p-4 rounded-lg border border-[#00ff9d]/30">
                  <h3 className="font-semibold text-[#00ff9d] mb-2">
                    Essential Cookies
                  </h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Session management (login, user preferences)</li>
                    <li>• Security tokens</li>
                    <li>• Load balancing</li>
                  </ul>
                </div>
                <div className="bg-[#181a20]/80 p-4 rounded-lg border border-[#00ff9d]/30">
                  <h3 className="font-semibold text-[#00ff9d] mb-2">
                    Non-Essential Cookies
                  </h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Analytics (usage tracking)</li>
                    <li>• Marketing pixels</li>
                    <li>• Personalization</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <FiSettings className="text-[#00ff9d] text-xl" />
                Detailed Cookie List
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[#00ff9d]/30">
                  <thead>
                    <tr className="bg-[#181a20]/90">
                      <th className="px-4 py-2 text-left text-gray-300">
                        Cookie Name
                      </th>
                      <th className="px-4 py-2 text-left text-gray-300">
                        Purpose
                      </th>
                      <th className="px-4 py-2 text-left text-gray-300">
                        Provider
                      </th>
                      <th className="px-4 py-2 text-left text-gray-300">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-b border-[#00ff9d]/50">
                        session_id
                      </td>
                      <td className="px-4 py-2 border-b border-[#00ff9d]/50">
                        Authentication
                      </td>
                      <td className="px-4 py-2 border-b border-[#00ff9d]/50">
                        ThreatLens
                      </td>
                      <td className="px-4 py-2 border-b border-[#00ff9d]/50">
                        Session
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">_ga</td>
                      <td className="px-4 py-2">Analytics</td>
                      <td className="px-4 py-2">Google</td>
                      <td className="px-4 py-2">2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <FiLink className="text-[#00ff9d] text-xl" />
                Manage Your Preferences
              </h2>
              <p className="text-gray-300 mb-4">
                You can change cookie settings at any time via our{" "}
                <span className="text-[#00ff9d] underline cursor-pointer">
                  consent banner
                </span>
                .
              </p>
              <div className="space-y-2 text-gray-400">
                <li>• Accept all cookies for full functionality</li>
                <li>• Reject non-essential cookies</li>
                <li>• Customize preferences</li>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <FiMail className="text-[#00ff9d] text-xl" />
                Contact Us
              </h2>
              <p className="text-gray-300">
                For cookie-related inquiries:{" "}
                <a
                  href="mailto:kishlay141@gmail.com"
                  className="text-[#00ff9d] underline"
                >
                  kishlay141@gmail.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
