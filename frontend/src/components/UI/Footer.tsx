import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="w-full border-t border-[#00ff9d]/20 bg-[#0a0a0a] pt-8 pb-6 px-4 mt-12">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
      <div className="flex flex-col items-center md:items-start gap-2">
        <div className="flex items-center gap-3">
          <img
            src="/assets/threatlens.png"
            alt="Thread Lens Logo"
            className="w-8 h-8 object-contain"
            style={{ borderRadius: 0, boxShadow: "none", background: "none" }}
            draggable={false}
          />
          <span className="text-lg font-bold uppercase tracking-wider text-[#00ff9d]">
            Thread Lens
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Enterprise AML Investigation Platform — v2.0
        </div>
        <div className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Thread Lens
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-4 text-sm font-medium">
          <Link
            to="/privacy-policy"
            className="text-gray-400 hover:text-[#00ff9d] transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="flex gap-4 mt-2">
          <a
            href="https://kishlaykumar.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-[#00ff9d]/30 text-[#00ff9d] hover:bg-[#00ff9d]/10 transition-colors text-xs font-semibold"
          >
            View Developer Portfolio
          </a>
        </div>
      </div>
      <div className="flex flex-col items-center md:items-end gap-1">
        <div className="text-xs text-gray-400">~ Kishlay Kumar</div>
        <div className="text-xs text-gray-500">All rights reserved.</div>
      </div>
    </div>
  </footer>
);

export default Footer;
