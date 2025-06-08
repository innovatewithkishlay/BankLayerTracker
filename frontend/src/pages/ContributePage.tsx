import { FiGithub, FiCode, FiShield, FiBookOpen } from "react-icons/fi";

export default function ContributePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] bg-clip-text text-transparent">
            Contribute to ThreadLens
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Help us build the next generation of open-source AML investigation
            tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-[#181a20]/50 rounded-xl border border-[#00ff9d]/20">
            <FiCode className="text-4xl text-[#00ff9d] mb-4" />
            <h3 className="text-2xl font-bold mb-4">For Developers</h3>
            <ul className="space-y-4 text-gray-300">
              <li>• Enhance AI/ML detection models</li>
              <li>• Build new visualization tools</li>
              <li>• Optimize backend performance</li>
            </ul>
          </div>

          <div className="p-8 bg-[#181a20]/50 rounded-xl border border-[#00ff9d]/20">
            <FiShield className="text-4xl text-[#00ff9d] mb-4" />
            <h3 className="text-2xl font-bold mb-4">For AML Experts</h3>
            <ul className="space-y-4 text-gray-300">
              <li>• Improve detection patterns</li>
              <li>• Validate real-world use cases</li>
              <li>• Enhance compliance features</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://github.com/yourusername/yourrepo"
            className="inline-flex items-center gap-4 px-8 py-4 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 border border-[#00ff9d]/30 rounded-xl text-lg font-mono transition-all group"
          >
            <FiGithub className="group-hover:scale-125 transition-transform" />
            Get Started on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
