import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2400);
    const removeTimer = setTimeout(() => setVisible(false), 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="preloader-overlay"
      style={{ opacity: fading ? 0 : 1 }}
      aria-live="polite"
      aria-label="Loading ZChemistry Lab"
    >
      {/* Atom animation */}
      <div className="preloader-atom">
        <div className="preloader-nucleus" />

        <div className="preloader-orbit preloader-orbit-1">
          <div className="preloader-electron" />
        </div>

        <div className="preloader-orbit preloader-orbit-2">
          <div className="preloader-electron preloader-electron-purple" />
        </div>

        <div className="preloader-orbit preloader-orbit-3">
          <div
            className="preloader-electron"
            style={{
              background: "#0891b2",
              boxShadow: "0 0 10px #0891b2, 0 0 20px rgba(8,145,178,0.5)",
            }}
          />
        </div>
      </div>

      {/* Logo */}
      <div className="text-center mb-4">
        <h1
          className="text-4xl font-bold tracking-wider mb-1"
          style={{
            color: "#1d4ed8",
            textShadow:
              "0 0 20px rgba(37,99,235,0.35), 0 0 40px rgba(37,99,235,0.15)",
            fontFamily: "var(--font-display)",
          }}
        >
          ZChemistry Lab
        </h1>
        <p
          style={{
            color: "#2563eb",
            fontSize: "0.85rem",
            letterSpacing: "0.12em",
            fontWeight: 600,
            opacity: 0.75,
          }}
        >
          by Atharv Shah
        </p>
        <p
          style={{
            color: "rgba(37,99,235,0.5)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            marginTop: "0.25rem",
          }}
        >
          VIRTUAL CHEMISTRY LABORATORY
        </p>
      </div>

      {/* Loading bar */}
      <div className="preloader-bar-track">
        <div className="preloader-bar-fill" />
      </div>

      <p
        style={{
          color: "rgba(37,99,235,0.5)",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          marginTop: "0.75rem",
        }}
      >
        INITIALIZING EXPERIMENTS...
      </p>
    </div>
  );
}
