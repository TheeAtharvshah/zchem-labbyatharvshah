import { useEffect, useRef, useState } from "react";
import type { Chemical } from "../../types/chemistry";

type IndicatorKey =
  | "blueLitmus"
  | "redLitmus"
  | "phenolphthalein"
  | "methylOrange"
  | "universalIndicator";

interface LabBenchProps {
  chemical: Chemical | null;
  indicator: IndicatorKey;
  onIndicatorChange: (ind: IndicatorKey) => void;
  onTestComplete: (result: string) => void;
  onSaveNotebook: () => void;
}

const INDICATORS: { key: IndicatorKey; label: string }[] = [
  { key: "blueLitmus", label: "Blue Litmus" },
  { key: "redLitmus", label: "Red Litmus" },
  { key: "phenolphthalein", label: "Phenolphthalein" },
  { key: "methylOrange", label: "Methyl Orange" },
  { key: "universalIndicator", label: "Universal" },
];

function getLiquidColor(chemical: Chemical | null): string {
  if (!chemical) return "rgba(255,255,255,0.08)";
  if (chemical.type === "acid") return "rgba(255,220,100,0.25)";
  if (chemical.type === "base") return "rgba(0,180,255,0.2)";
  if (chemical.ph > 7) return "rgba(100,180,255,0.18)";
  return "rgba(200,230,255,0.12)";
}

function getStripInitialColor(indicator: IndicatorKey): string {
  if (indicator === "blueLitmus") return "#3b82f6";
  if (indicator === "redLitmus") return "#ef4444";
  if (indicator === "phenolphthalein") return "rgba(255,255,255,0.85)";
  if (indicator === "methylOrange") return "#f97316";
  return "#f0fdf4";
}

function getStripResultColor(
  indicator: IndicatorKey,
  chemical: Chemical | null,
): string {
  if (!chemical) return getStripInitialColor(indicator);
  const result = chemical.indicatorResults[indicator].toLowerCase();
  if (result.includes("no change") || result.includes("remains"))
    return getStripInitialColor(indicator);
  if (result.includes("red")) return "#ef4444";
  if (result.includes("blue")) return "#3b82f6";
  if (result.includes("pink") || result.includes("magenta")) return "#ec4899";
  if (result.includes("yellow")) return "#eab308";
  if (result.includes("orange")) return "#f97316";
  if (result.includes("purple")) return "#a855f7";
  if (result.includes("green")) return "#22c55e";
  if (result.includes("colorless")) return "rgba(255,255,255,0.85)";
  return getStripInitialColor(indicator);
}

function hasReaction(
  indicator: IndicatorKey,
  chemical: Chemical | null,
): boolean {
  if (!chemical) return false;
  const result = chemical.indicatorResults[indicator].toLowerCase();
  return !result.includes("no change") && !result.includes("remains");
}

export default function LabBench({
  chemical,
  indicator,
  onIndicatorChange,
  onTestComplete,
  onSaveNotebook,
}: LabBenchProps) {
  const [testing, setTesting] = useState(false);
  const [stripY, setStripY] = useState(0);
  const [stripColor, setStripColor] = useState(getStripInitialColor(indicator));
  const [glowing, setGlowing] = useState(false);
  const [tested, setTested] = useState(false);
  const bubblesRef = useRef<number[]>([]);

  const chemicalId = chemical?.id ?? null;

  // Reset strip when indicator or chemical changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: chemicalId tracks chemical identity
  useEffect(() => {
    setStripY(0);
    setStripColor(getStripInitialColor(indicator));
    setGlowing(false);
    setTested(false);
    setTesting(false);
  }, [indicator, chemicalId]);

  const handleTest = () => {
    if (testing || !chemical) return;
    setTesting(true);
    setTested(false);
    setStripY(0);
    setStripColor(getStripInitialColor(indicator));
    setGlowing(false);

    // Animate strip down
    setTimeout(() => setStripY(110), 50);

    // Color change after ~1s immersion
    setTimeout(() => {
      const resultColor = getStripResultColor(indicator, chemical);
      setStripColor(resultColor);
      if (hasReaction(indicator, chemical)) {
        setGlowing(true);
      }
    }, 1200);

    // Complete
    setTimeout(() => {
      setTesting(false);
      setTested(true);
      const result = chemical.indicatorResults[indicator];
      onTestComplete(result);
    }, 1800);
  };

  const handleReset = () => {
    setStripY(0);
    setStripColor(getStripInitialColor(indicator));
    setGlowing(false);
    setTested(false);
    setTesting(false);
  };

  const liquidColor = getLiquidColor(chemical);
  const isStrong = chemical?.strength === "strong";
  const showBubbles = isStrong && chemical !== null;

  // Generate bubble positions
  if (bubblesRef.current.length === 0) {
    bubblesRef.current = Array.from({ length: 6 }, (_, i) => 15 + i * 13);
  }

  const resultText =
    tested && chemical ? chemical.indicatorResults[indicator] : "";
  const reacted = tested && hasReaction(indicator, chemical);

  return (
    <div
      style={{
        background: "rgba(17,24,39,0.6)",
        border: "1px solid rgba(168,85,247,0.2)",
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <h3
        style={{
          color: "#a855f7",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          alignSelf: "flex-start",
        }}
      >
        Lab Bench
      </h3>

      {/* Indicator selector */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {INDICATORS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            data-ocid={`testlab.indicator_${key}`}
            onClick={() => onIndicatorChange(key)}
            style={{
              padding: "5px 12px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              border:
                indicator === key
                  ? "1px solid #a855f7"
                  : "1px solid rgba(255,255,255,0.1)",
              background:
                indicator === key ? "rgba(168,85,247,0.2)" : "transparent",
              color: indicator === key ? "#a855f7" : "rgba(255,255,255,0.45)",
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Beaker + Strip animation */}
      <div
        style={{
          position: "relative",
          width: "180px",
          height: "260px",
          flexShrink: 0,
        }}
      >
        {/* Strip above beaker */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: `translateX(-50%) translateY(${stripY}px)`,
            transition: "transform 1.5s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0",
          }}
        >
          {/* Clamp/holder */}
          <div
            style={{
              width: "16px",
              height: "8px",
              background: "#4b5563",
              borderRadius: "3px 3px 0 0",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
          {/* Strip */}
          <div
            style={{
              width: "8px",
              height: "80px",
              background: stripColor,
              borderRadius: "2px",
              transition: "background-color 0.8s ease",
              boxShadow: glowing
                ? `0 0 16px ${stripColor}, 0 0 32px ${stripColor}60`
                : "0 0 4px rgba(0,0,0,0.4)",
            }}
          />
        </div>

        {/* SVG Beaker */}
        <svg
          width="180"
          height="220"
          viewBox="0 0 180 220"
          aria-labelledby="beaker-title"
          style={{ position: "absolute", top: "40px", left: 0 }}
        >
          <title id="beaker-title">Lab beaker visualization</title>
          {/* Beaker outer glass */}
          <path
            d="M 50 20 L 50 160 Q 50 180 70 180 L 110 180 Q 130 180 130 160 L 130 20 Z"
            fill="none"
            stroke="rgba(0,212,255,0.35)"
            strokeWidth="2"
          />
          {/* Beaker lip */}
          <rect
            x="40"
            y="15"
            width="100"
            height="10"
            rx="3"
            fill="rgba(0,212,255,0.15)"
            stroke="rgba(0,212,255,0.4)"
            strokeWidth="1.5"
          />
          {/* Beaker spout */}
          <path
            d="M 120 15 L 140 5 L 145 12 L 130 20"
            fill="rgba(0,212,255,0.15)"
            stroke="rgba(0,212,255,0.4)"
            strokeWidth="1.5"
          />

          {/* Liquid fill */}
          <clipPath id="beaker-clip">
            <rect x="51" y="21" width="78" height="158" rx="0" />
          </clipPath>
          <rect
            x="51"
            y="80"
            width="78"
            height="99"
            fill={liquidColor}
            clipPath="url(#beaker-clip)"
          />

          {/* Liquid surface shimmer */}
          <line
            x1="51"
            y1="80"
            x2="129"
            y2="80"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Measurement lines */}
          {[100, 120, 140, 160].map((y) => (
            <line
              key={y}
              x1="125"
              y1={y}
              x2="130"
              y2={y}
              stroke="rgba(0,212,255,0.3)"
              strokeWidth="1"
            />
          ))}

          {/* Bubbles for strong acids/bases */}
          {showBubbles &&
            bubblesRef.current.map((x) => (
              <circle
                key={`bubble-x${x}`}
                cx={x + 55}
                cy="100"
                r={x % 2 === 0 ? 3 : 2}
                fill="rgba(255,255,255,0.2)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.5"
                style={{
                  animation: `bubbleRise ${1.2 + (x % 6) * 0.3}s infinite ease-in`,
                  animationDelay: `${(x % 6) * 0.2}s`,
                }}
              />
            ))}
        </svg>

        {/* No chemical message */}
        {!chemical && (
          <div
            style={{
              position: "absolute",
              top: "120px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "10px",
              color: "rgba(255,255,255,0.25)",
              textAlign: "center",
              width: "100px",
            }}
          >
            Select a chemical to begin
          </div>
        )}
      </div>

      {/* Result badge */}
      {tested && resultText && (
        <div
          style={{
            padding: "7px 16px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 600,
            background: reacted
              ? "rgba(34,197,94,0.12)"
              : "rgba(148,163,184,0.1)",
            border: `1px solid ${reacted ? "rgba(34,197,94,0.4)" : "rgba(148,163,184,0.25)"}`,
            color: reacted ? "#22c55e" : "#94a3b8",
            textAlign: "center",
            boxShadow: reacted ? "0 0 16px rgba(34,197,94,0.15)" : "none",
            animation: "fadeInUp 0.4s ease",
          }}
          data-ocid="testlab.test_result"
        >
          {resultText}
        </div>
      )}

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          data-ocid="testlab.test_button"
          onClick={handleTest}
          disabled={!chemical || testing}
          style={{
            padding: "8px 18px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: !chemical || testing ? "not-allowed" : "pointer",
            border: "1px solid rgba(34,197,94,0.5)",
            background:
              !chemical || testing
                ? "rgba(34,197,94,0.05)"
                : "rgba(34,197,94,0.15)",
            color: !chemical || testing ? "rgba(34,197,94,0.35)" : "#22c55e",
            transition: "all 0.2s",
            letterSpacing: "0.05em",
          }}
        >
          {testing ? "Testing..." : "▶ Test"}
        </button>
        <button
          type="button"
          data-ocid="testlab.reset_button"
          onClick={handleReset}
          style={{
            padding: "8px 18px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent",
            color: "rgba(255,255,255,0.45)",
            transition: "all 0.2s",
          }}
        >
          ↺ Reset
        </button>
        <button
          type="button"
          data-ocid="testlab.save_button"
          onClick={onSaveNotebook}
          disabled={!tested || !chemical}
          style={{
            padding: "8px 18px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: !tested || !chemical ? "not-allowed" : "pointer",
            border: "1px solid rgba(168,85,247,0.4)",
            background:
              !tested || !chemical
                ? "rgba(168,85,247,0.04)"
                : "rgba(168,85,247,0.15)",
            color: !tested || !chemical ? "rgba(168,85,247,0.3)" : "#a855f7",
            transition: "all 0.2s",
          }}
        >
          📓 Save
        </button>
      </div>

      <style>{`
        @keyframes bubbleRise {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
