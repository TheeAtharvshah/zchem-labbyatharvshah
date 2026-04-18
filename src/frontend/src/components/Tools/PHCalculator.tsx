import { useState } from "react";

interface PHExample {
  name: string;
  ph: number;
  icon: string;
}

const PH_EXAMPLES: PHExample[] = [
  { name: "Battery Acid", ph: 0.5, icon: "🔋" },
  { name: "Lemon Juice", ph: 2.0, icon: "🍋" },
  { name: "Coffee", ph: 5.0, icon: "☕" },
  { name: "Pure Water", ph: 7.0, icon: "💧" },
  { name: "Blood", ph: 7.4, icon: "🩸" },
  { name: "Soap", ph: 9.5, icon: "🧼" },
  { name: "Milk of Magnesia", ph: 10.5, icon: "🥛" },
  { name: "Bleach", ph: 12.5, icon: "🧴" },
];

interface PHCategory {
  label: string;
  range: [number, number];
  color: string;
  description: string;
}

const PH_CATEGORIES: PHCategory[] = [
  {
    label: "Strong Acid",
    range: [0, 3],
    color: "#ef4444",
    description: "Highly corrosive. Reacts violently with metals and bases.",
  },
  {
    label: "Weak Acid",
    range: [3, 6],
    color: "#f97316",
    description: "Mildly acidic. Common in foods and biological fluids.",
  },
  {
    label: "Neutral",
    range: [6, 8],
    color: "#22c55e",
    description: "Balanced. Neither acidic nor basic.",
  },
  {
    label: "Weak Base",
    range: [8, 11],
    color: "#3b82f6",
    description: "Mildly alkaline. Common in cleaning products.",
  },
  {
    label: "Strong Base",
    range: [11, 14.01],
    color: "#a855f7",
    description: "Highly caustic. Can cause severe chemical burns.",
  },
];

function getPHColor(ph: number): string {
  if (ph <= 2) return "#ef4444";
  if (ph <= 4) return "#f97316";
  if (ph <= 6) return "#eab308";
  if (ph <= 7.5) return "#22c55e";
  if (ph <= 9) return "#14b8a6";
  if (ph <= 11) return "#3b82f6";
  return "#a855f7";
}

function getPHCategory(ph: number): PHCategory {
  return (
    PH_CATEGORIES.find((c) => ph >= c.range[0] && ph < c.range[1]) ??
    PH_CATEGORIES[0]
  );
}

// Build a CSS gradient string for the pH bar
const PH_GRADIENT = `linear-gradient(to right,
  #ef4444 0%,
  #f97316 20%,
  #eab308 35%,
  #22c55e 50%,
  #14b8a6 65%,
  #3b82f6 80%,
  #a855f7 100%
)`;

export default function PHCalculator() {
  const [ph, setPH] = useState(7.0);

  const category = getPHCategory(ph);
  const color = getPHColor(ph);
  const markerPercent = (ph / 14) * 100;

  const handleInputChange = (val: string) => {
    const n = Number.parseFloat(val);
    if (!Number.isNaN(n) && n >= 0 && n <= 14) setPH(Math.round(n * 10) / 10);
  };

  return (
    <div className="space-y-6">
      {/* pH input row */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label
            htmlFor="ph-slider"
            className="block text-xs mb-2"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            pH Value (0 – 14)
          </label>
          <input
            id="ph-slider"
            data-ocid="ph.slider_input"
            type="range"
            min={0}
            max={14}
            step={0.1}
            value={ph}
            onChange={(e) => setPH(Number.parseFloat(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: PH_GRADIENT,
              outline: "none",
            }}
          />
        </div>
        <div>
          <label
            htmlFor="ph-number"
            className="block text-xs mb-2 text-center"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Enter pH
          </label>
          <input
            id="ph-number"
            data-ocid="ph.number_input"
            type="number"
            min={0}
            max={14}
            step={0.1}
            value={ph}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-20 px-3 py-2 rounded-lg text-center text-base font-bold outline-none"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${color}55`,
              color,
              fontFamily: "JetBrains Mono, monospace",
            }}
          />
        </div>
      </div>

      {/* pH Thermometer Bar */}
      <div>
        <div
          className="relative h-10 rounded-full overflow-visible"
          style={{ background: PH_GRADIENT }}
        >
          {/* Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all duration-300"
            style={{
              left: `${markerPercent}%`,
              background: color,
              boxShadow: `0 0 12px ${color}, 0 0 24px ${color}66`,
              zIndex: 10,
            }}
          />
          {/* pH number labels */}
          <div className="absolute inset-0 flex items-end pb-0.5 px-2">
            {[0, 2, 4, 6, 7, 8, 10, 12, 14].map((n) => (
              <span
                key={n}
                className="absolute text-xs font-bold text-white select-none"
                style={{
                  left: `${(n / 14) * 100}%`,
                  transform: "translateX(-50%)",
                  bottom: "-22px",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "10px",
                }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
        {/* Spacer for labels */}
        <div className="h-7" />
      </div>

      {/* Category display */}
      <div
        className="rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4"
        style={{
          background: `${color}10`,
          border: `1px solid ${color}35`,
          boxShadow: `0 0 20px ${color}12`,
        }}
      >
        {/* Big pH number */}
        <div
          className="text-6xl font-bold min-w-[100px] text-center"
          style={{
            color,
            fontFamily: "JetBrains Mono, monospace",
            textShadow: `0 0 30px ${color}88`,
          }}
        >
          {ph.toFixed(1)}
        </div>
        <div className="flex-1">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-2"
            style={{
              background: `${color}20`,
              border: `1px solid ${color}50`,
              color,
            }}
          >
            {category.label}
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            {category.description}
          </p>
        </div>
      </div>

      {/* Examples panel */}
      <div>
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Common Examples — Click to set pH
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PH_EXAMPLES.map((ex) => {
            const exColor = getPHColor(ex.ph);
            const isActive = Math.abs(ph - ex.ph) < 0.2;
            return (
              <button
                key={ex.name}
                type="button"
                data-ocid={`ph.example.${ex.name.toLowerCase().replace(/\s+/g, "_")}`}
                onClick={() => setPH(ex.ph)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200"
                style={{
                  background: isActive
                    ? `${exColor}18`
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? `${exColor}55` : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <span className="text-xl">{ex.icon}</span>
                <span
                  className="text-xs font-bold"
                  style={{
                    color: exColor,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {ex.ph.toFixed(1)}
                </span>
                <span
                  className="text-xs text-center leading-tight"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {ex.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* pH scale legend */}
      <div className="grid grid-cols-5 gap-2">
        {PH_CATEGORIES.map((cat) => (
          <div
            key={cat.label}
            className="rounded-lg p-2 text-center text-xs"
            style={{
              background: `${cat.color}10`,
              border: `1px solid ${cat.color}25`,
              color: cat.color,
            }}
          >
            <div className="font-bold">{cat.label}</div>
            <div
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {cat.range[0]}–{Math.min(cat.range[1], 14)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
