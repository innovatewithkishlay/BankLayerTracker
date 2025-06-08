import { useState } from "react";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative" style={{ minHeight: 200 }}>
        <button
          className="px-8 py-3 bg-[#181a20] text-[#00ff9d] font-mono text-lg font-bold rounded-lg border border-[#00ff9d]/40 shadow-lg hover:bg-[#23262e] transition-all relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ paddingRight: "3.5em" }}
        >
          <span className="relative flex items-center">
            Cross-Case Investigation
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

        {isHovered && (
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-20 z-50 bg-[#181818] border border-[#00ff9d]/30 text-white text-xs rounded-md px-4 py-3 shadow-xl font-mono w-60"
            style={{ pointerEvents: "none" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse" />
              <span className="font-semibold text-[#00ff9d]">Pro Feature</span>
            </div>
            <div className="text-gray-300 leading-snug">
              For using this feature you need to purchase PRO.
              <br />
              Contact owner:{" "}
              <span className="text-[#00ff9d] underline">
                kishlay141@gmail.com
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
