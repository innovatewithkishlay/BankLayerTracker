import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [consent, setConsent] = useState(
    () => localStorage.getItem("cookie_consent") || "undecided"
  );

  useEffect(() => {
    if (consent !== "undecided") {
      localStorage.setItem("cookie_consent", consent);
    }
  }, [consent]);

  if (consent !== "undecided") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        left: 0,
        background: "#181a20",
        color: "#fff",
        padding: "1rem",
        borderRadius: "8px 8px 0 0",
        boxShadow: "0 0 16px #00ff9d33",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>
        We use cookies to enhance your experience.{" "}
        <a href="/cookie-policy" style={{ color: "#00ff9d" }}>
          Learn more
        </a>
      </div>
      <div style={{ marginTop: "0.5rem" }}>
        <button
          onClick={() => setConsent("yes")}
          style={{
            marginRight: 8,
            background: "#00ff9d",
            color: "#181a20",
            border: "none",
            borderRadius: 6,
            padding: "0.5rem 1.2rem",
            fontWeight: 700,
          }}
        >
          Accept All
        </button>
        <button
          onClick={() => setConsent("no")}
          style={{
            background: "#222",
            color: "#00ff9d",
            border: "none",
            borderRadius: 6,
            padding: "0.5rem 1.2rem",
            fontWeight: 700,
          }}
        >
          Reject All
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("cookie_consent");
            setConsent("undecided");
          }}
          style={{
            marginLeft: 8,
            background: "none",
            color: "#00ff9d",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Reset Cookies
        </button>
      </div>
    </div>
  );
}
