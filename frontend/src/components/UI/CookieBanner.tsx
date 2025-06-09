import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
export default function CookieBanner() {
  const [consent, setConsent] = useState(
    () => localStorage.getItem("cookie_consent") || "undecided"
  );
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (consent === "undecided") {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [consent]);

  useEffect(() => {
    if (consent !== "undecided") {
      localStorage.setItem("cookie_consent", consent);
    }
  }, [consent]);

  const handleAccept = () => {
    setLeaving(true);
    setTimeout(() => setConsent("yes"), 400);
  };

  const handleReject = () => {
    setLeaving(true);
    setTimeout(() => setConsent("no"), 400);
  };

  const handleReset = () => {
    localStorage.removeItem("cookie_consent");
    setConsent("undecided");
    setShow(true);
    setLeaving(false);
  };

  return (
    <AnimatePresence>
      {show && consent === "undecided" && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ x: 500, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            duration: 0.4,
          }}
          style={{
            position: "fixed",
            bottom: 24,
            left: 0,
            right: 0,
            margin: "0 auto",
            maxWidth: 420,
            background: "#181a20",
            color: "#fff",
            padding: "1.2rem 1.5rem",
            borderRadius: "12px",
            border: "2px solid #00FF9D",
            boxShadow: "0 0 16px #00ff9d33",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onAnimationComplete={() => {
            if (leaving) setShow(false);
          }}
        >
          <div style={{ textAlign: "center" }}>
            We use cookies to enhance your experience.{" "}
            <Link
              to="/cookie-policy"
              style={{ color: "#00ff9d", textDecoration: "underline" }}
            >
              Learn more
            </Link>
          </div>
          <div style={{ marginTop: "0.7rem", display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleAccept}
              style={{
                background: "#00ff9d",
                color: "#181a20",
                border: "none",
                borderRadius: 6,
                padding: "0.5rem 1.2rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Accept All
            </button>
            <button
              onClick={handleReject}
              style={{
                background: "#222",
                color: "#00ff9d",
                border: "none",
                borderRadius: 6,
                padding: "0.5rem 1.2rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reject All
            </button>
            <button
              onClick={handleReset}
              style={{
                background: "none",
                color: "#00ff9d",
                border: "none",
                textDecoration: "underline",
                cursor: "pointer",
                padding: "0.5rem 0.8rem",
              }}
            >
              Reset Cookies
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
