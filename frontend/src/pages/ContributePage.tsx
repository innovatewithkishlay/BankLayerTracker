import {
  FiGithub,
  FiCode,
  FiShield,
  FiBookOpen,
  FiUsers,
  FiZap,
} from "react-icons/fi";

export default function ContributePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] bg-clip-text text-transparent">
            Contribute to{" "}
            <span className=" decoration-[#00ff9d] decoration-2">
              ThreatLens
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Help us build the next generation of{" "}
            <span className="text-[#00ff9d] font-semibold">open-source</span>{" "}
            AML investigation tools. Whether you’re a developer, data scientist,
            or AML expert, your contribution can make a real impact!
          </p>
        </div>

        <div className="mb-12">
          <div className="bg-[#181a20]/70 border border-[#00ff9d]/20 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 shadow-lg">
            <FiBookOpen className="text-4xl text-[#00ff9d] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold mb-1 text-[#00ff9d]">
                Why Open Source?
              </h2>
              <p className="text-gray-300 text-base">
                Open source means anyone can inspect, improve, and contribute to
                ThreadLens. Together, we can create more secure, innovative, and
                effective AML solutions for the global community.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-[#181a20]/50 rounded-xl border border-[#00ff9d]/20 flex flex-col h-full">
            <FiCode className="text-4xl text-[#00ff9d] mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              For Developers & Data Scientists
            </h3>
            <ul className="space-y-4 text-gray-300 flex-1">
              <li>• Enhance and optimize AI/ML anomaly detection models</li>
              <li>• Build new visualization and analytics tools</li>
              <li>• Refactor and scale backend performance</li>
              <li>• Improve code quality and add automated tests</li>
            </ul>
            <a
              href="https://github.com/innovatewithkishlay/Threatlens.git"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 border border-[#00ff9d]/30 rounded-lg text-[#00ff9d] font-mono transition-all group"
            >
              <FiGithub className="group-hover:scale-125 transition-transform" />
              Contribute on GitHub
            </a>
          </div>

          <div className="p-8 bg-[#181a20]/50 rounded-xl border border-[#00ff9d]/20 flex flex-col h-full">
            <FiShield className="text-4xl text-[#00ff9d] mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              For AML & Compliance Experts
            </h3>
            <ul className="space-y-4 text-gray-300 flex-1">
              <li>• Share real-world AML patterns and typologies</li>
              <li>• Validate and test detection models</li>
              <li>• Help define compliance features and workflows</li>
              <li>• Write educational content and documentation</li>
            </ul>
            <a
              href="mailto:kishlay141@gmail.com"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 border border-[#00ff9d]/30 rounded-lg text-[#00ff9d] font-mono transition-all group"
            >
              <FiUsers className="group-hover:scale-125 transition-transform" />
              Contact the Maintainer
            </a>
          </div>
        </div>

        <div className="mb-16">
          <div className="bg-[#181a20]/60 border border-[#00ff9d]/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[#00ff9d] mb-3 flex items-center gap-2">
              <FiZap /> How to Get Started
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-base">
              <li>
                <span className="font-semibold text-[#00ff9d]">Star</span> and{" "}
                <span className="font-semibold text-[#00ff9d]">fork</span> the
                repo on GitHub.
              </li>
              <li>
                Check out the{" "}
                <span className="font-semibold text-[#00ff9d]">
                  open issues
                </span>{" "}
                labeled{" "}
                <span className="bg-[#00ff9d]/20 text-[#00ff9d] px-2 py-0.5 rounded">
                  help wanted
                </span>{" "}
                or{" "}
                <span className="bg-[#00ff9d]/20 text-[#00ff9d] px-2 py-0.5 rounded">
                  good first issue
                </span>
                .
              </li>
              <li>
                Read the{" "}
                <span className="font-semibold text-[#00ff9d]">README</span> and{" "}
                <span className="font-semibold text-[#00ff9d]">
                  CONTRIBUTING.md
                </span>{" "}
                for guidelines.
              </li>
              <li>Submit your pull request or reach out to discuss ideas!</li>
            </ol>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://github.com/innovatewithkishlay/Threatlens.git"
            className="inline-flex items-center gap-4 px-8 py-4 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 border border-[#00ff9d]/30 rounded-xl text-lg font-mono transition-all group"
          >
            <FiGithub className="group-hover:scale-125 transition-transform" />
            <span>
              <span className="font-bold text-[#00ff9d]">Get Started</span> on
              GitHub
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
