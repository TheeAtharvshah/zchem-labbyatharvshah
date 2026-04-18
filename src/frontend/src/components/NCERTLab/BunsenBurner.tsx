import { useEffect, useRef } from "react";

type BurnerIntensity = "low" | "medium" | "high";

interface BunsenBurnerProps {
  burnerOn: boolean;
  burnerIntensity: BurnerIntensity;
  onToggle: () => void;
  onIntensityChange: (intensity: BurnerIntensity) => void;
}

const FLAME_SIZES: Record<
  BurnerIntensity,
  { outer: number; mid: number; inner: number }
> = {
  low: { outer: 30, mid: 20, inner: 12 },
  medium: { outer: 50, mid: 35, inner: 22 },
  high: { outer: 80, mid: 56, inner: 36 },
};

const INTENSITY_LABELS: BurnerIntensity[] = ["low", "medium", "high"];

export default function BunsenBurner({
  burnerOn,
  burnerIntensity,
  onToggle,
  onIntensityChange,
}: BunsenBurnerProps) {
  const flameRef = useRef<HTMLDivElement>(null);
  const { outer, mid, inner } = FLAME_SIZES[burnerIntensity];

  useEffect(() => {
    if (!flameRef.current) return;
    flameRef.current.style.setProperty("--flame-outer", `${outer}px`);
    flameRef.current.style.setProperty("--flame-mid", `${mid}px`);
    flameRef.current.style.setProperty("--flame-inner", `${inner}px`);
  }, [outer, mid, inner]);

  return (
    <div
      className="flex flex-col items-center gap-4"
      data-ocid="ncert-lab.burner"
    >
      <style>{`
        @keyframes flicker {
          0%   { transform: scaleX(1)   scaleY(1)   skewX(0deg);  opacity: 1;    }
          20%  { transform: scaleX(0.93) scaleY(1.05) skewX(-3deg); opacity: 0.95; }
          40%  { transform: scaleX(1.04) scaleY(0.97) skewX(2deg);  opacity: 1;    }
          60%  { transform: scaleX(0.96) scaleY(1.04) skewX(-2deg); opacity: 0.92; }
          80%  { transform: scaleX(1.02) scaleY(0.98) skewX(1deg);  opacity: 0.97; }
          100% { transform: scaleX(1)   scaleY(1)   skewX(0deg);  opacity: 1;    }
        }
        @keyframes heatWave {
          0%   { transform: translateY(0) scaleX(1);   opacity: 0.4; }
          50%  { transform: translateY(-6px) scaleX(1.08); opacity: 0.15; }
          100% { transform: translateY(-12px) scaleX(0.94); opacity: 0; }
        }
        .flame-outer {
          animation: flicker 0.28s ease-in-out infinite alternate;
          transform-origin: bottom center;
        }
        .flame-mid {
          animation: flicker 0.22s ease-in-out infinite alternate-reverse;
          transform-origin: bottom center;
        }
        .flame-inner {
          animation: flicker 0.18s ease-in-out infinite alternate;
          transform-origin: bottom center;
        }
        .heat-wave {
          animation: heatWave 1s ease-out infinite;
        }
      `}</style>

      {/* Flame area */}
      <div
        ref={flameRef}
        className="relative flex items-end justify-center"
        style={{ width: 100, height: burnerOn ? Math.max(outer + 30, 60) : 30 }}
      >
        {burnerOn && (
          <>
            {/* Heat wave shimmer above flame */}
            <div
              className="heat-wave absolute rounded-full pointer-events-none"
              style={{
                width: outer * 1.4,
                height: 18,
                top: -16,
                left: "50%",
                transform: "translateX(-50%)",
                background:
                  "radial-gradient(ellipse, rgba(255,200,80,0.25) 0%, transparent 70%)",
                filter: "blur(4px)",
              }}
            />

            {/* Outer flame — orange / yellow */}
            <div
              className="flame-outer absolute rounded-t-full rounded-b-sm"
              style={{
                width: outer * 0.9,
                height: outer,
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                background:
                  "radial-gradient(ellipse at 50% 90%, #ff6a00 0%, #ffb347 40%, #ffe082 75%, transparent 100%)",
                boxShadow:
                  burnerIntensity === "high"
                    ? "0 0 24px 8px rgba(255,150,0,0.55), 0 0 48px 16px rgba(255,100,0,0.3)"
                    : "0 0 14px 4px rgba(255,140,0,0.4)",
                clipPath:
                  "polygon(50% 0%, 80% 60%, 100% 100%, 0% 100%, 20% 60%)",
              }}
            />

            {/* Mid flame — orange to yellow */}
            <div
              className="flame-mid absolute rounded-t-full"
              style={{
                width: mid * 0.85,
                height: mid,
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                background:
                  "radial-gradient(ellipse at 50% 85%, #f97316 0%, #fde68a 60%, #fff9c4 90%, transparent 100%)",
                clipPath:
                  "polygon(50% 0%, 78% 58%, 100% 100%, 0% 100%, 22% 58%)",
              }}
            />

            {/* Inner flame — blue core */}
            <div
              className="flame-inner absolute rounded-t-full"
              style={{
                width: inner,
                height: inner,
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                background:
                  "radial-gradient(ellipse at 50% 80%, #93c5fd 0%, #3b82f6 40%, #1e40af 80%, transparent 100%)",
                boxShadow: "0 0 8px 3px rgba(59,130,246,0.6)",
                clipPath:
                  "polygon(50% 0%, 75% 55%, 100% 100%, 0% 100%, 25% 55%)",
              }}
            />

            {/* Base glow ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: outer * 0.95,
                height: 10,
                bottom: -2,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255,160,50,0.35)",
                filter: "blur(6px)",
              }}
            />
          </>
        )}
      </div>

      {/* Burner body */}
      <div className="flex flex-col items-center" style={{ gap: 0 }}>
        {/* Barrel */}
        <div
          className="rounded-t-md"
          style={{
            width: 28,
            height: 36,
            background: "linear-gradient(to right, #374151, #6b7280, #374151)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: burnerOn ? "0 0 12px 2px rgba(255,140,0,0.3)" : "none",
          }}
        />
        {/* Air collar */}
        <div
          style={{
            width: 34,
            height: 8,
            background: "#4b5563",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "2px",
          }}
        />
        {/* Base */}
        <div
          className="rounded-b-md"
          style={{
            width: 44,
            height: 14,
            background: "linear-gradient(to right, #1f2937, #374151, #1f2937)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3 w-full max-w-[180px]">
        {/* ON/OFF toggle */}
        <button
          type="button"
          onClick={onToggle}
          data-ocid="ncert-lab.burner_toggle"
          className="w-full py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-200"
          style={{
            background: burnerOn
              ? "linear-gradient(135deg, #f97316, #ef4444)"
              : "rgba(255,255,255,0.06)",
            border: burnerOn
              ? "1px solid rgba(249,115,22,0.5)"
              : "1px solid rgba(255,255,255,0.12)",
            color: burnerOn ? "#fff" : "rgba(255,255,255,0.5)",
            boxShadow: burnerOn ? "0 0 16px rgba(249,115,22,0.4)" : "none",
          }}
        >
          {burnerOn ? "🔥 BURNER ON" : "BURNER OFF"}
        </button>

        {/* Intensity slider */}
        <div className="w-full">
          <div
            className="text-xs mb-2 text-center tracking-widest"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            INTENSITY
          </div>
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {INTENSITY_LABELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onIntensityChange(level)}
                data-ocid={`ncert-lab.burner_intensity_${level}`}
                className="flex-1 py-1.5 text-xs font-semibold capitalize transition-all duration-200"
                style={{
                  background:
                    burnerIntensity === level
                      ? level === "high"
                        ? "rgba(239,68,68,0.3)"
                        : level === "medium"
                          ? "rgba(249,115,22,0.3)"
                          : "rgba(234,179,8,0.2)"
                      : "transparent",
                  color:
                    burnerIntensity === level
                      ? level === "high"
                        ? "#ef4444"
                        : level === "medium"
                          ? "#f97316"
                          : "#eab308"
                      : "rgba(255,255,255,0.3)",
                  borderRight:
                    level !== "high"
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "none",
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
