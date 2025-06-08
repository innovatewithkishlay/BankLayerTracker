import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProButtonDemo() {
  const [show, setShow] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative" style={{ minWidth: 420 }}>
        <motion.button
          type="button"
          className="relative px-8 py-3 rounded-lg font-mono text-lg tracking-widest transition-all bg-[#181a20] text-[#00ff9d] hover:bg-[#23262e] border border-[#00ff9d]/40 shadow-lg hover:shadow-xl"
          style={{ paddingRight: "3.5em" }}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          onTouchStart={() => setShow(true)}
          onTouchEnd={() => setShow(false)}
          disabled
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
        </motion.button>
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-full top-1/2 -translate-y-1/2 z-50"
              style={{ pointerEvents: "none" }}
            >
              <div
                className="bg-[#181818]/90 border border-[#00ff9d]/30 rounded-lg p-4 shadow-xl text-xs text-white font-mono backdrop-blur flex flex-col gap-1.5 relative ml-2"
                style={{
                  width: "230px",
                  boxShadow: "0 6px 32px #00ff9d22",
                }}
              >
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#181818]/90 border-l border-t border-[#00ff9d]/30 rotate-45" />
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse" />
                  <span className="font-semibold text-[#00ff9d]">
                    Pro Feature
                  </span>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
