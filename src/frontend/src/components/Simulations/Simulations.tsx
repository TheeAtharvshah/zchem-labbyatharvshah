import { useState } from "react";

// ─── Atom Builder ────────────────────────────────────────────────────────────

interface AtomInfo {
  name: string;
  symbol: string;
  atomicNumber: number;
  shells: number[];
  config: string;
}

const ATOMS: AtomInfo[] = [
  {
    name: "Hydrogen",
    symbol: "H",
    atomicNumber: 1,
    shells: [1],
    config: "1s¹",
  },
  { name: "Helium", symbol: "He", atomicNumber: 2, shells: [2], config: "1s²" },
  {
    name: "Lithium",
    symbol: "Li",
    atomicNumber: 3,
    shells: [2, 1],
    config: "1s² 2s¹",
  },
  {
    name: "Beryllium",
    symbol: "Be",
    atomicNumber: 4,
    shells: [2, 2],
    config: "1s² 2s²",
  },
  {
    name: "Boron",
    symbol: "B",
    atomicNumber: 5,
    shells: [2, 3],
    config: "1s² 2s² 2p¹",
  },
  {
    name: "Carbon",
    symbol: "C",
    atomicNumber: 6,
    shells: [2, 4],
    config: "1s² 2s² 2p²",
  },
  {
    name: "Nitrogen",
    symbol: "N",
    atomicNumber: 7,
    shells: [2, 5],
    config: "1s² 2s² 2p³",
  },
  {
    name: "Oxygen",
    symbol: "O",
    atomicNumber: 8,
    shells: [2, 6],
    config: "1s² 2s² 2p⁴",
  },
  {
    name: "Fluorine",
    symbol: "F",
    atomicNumber: 9,
    shells: [2, 7],
    config: "1s² 2s² 2p⁵",
  },
  {
    name: "Neon",
    symbol: "Ne",
    atomicNumber: 10,
    shells: [2, 8],
    config: "1s² 2s² 2p⁶",
  },
  {
    name: "Sodium",
    symbol: "Na",
    atomicNumber: 11,
    shells: [2, 8, 1],
    config: "[Ne] 3s¹",
  },
  {
    name: "Magnesium",
    symbol: "Mg",
    atomicNumber: 12,
    shells: [2, 8, 2],
    config: "[Ne] 3s²",
  },
  {
    name: "Aluminium",
    symbol: "Al",
    atomicNumber: 13,
    shells: [2, 8, 3],
    config: "[Ne] 3s² 3p¹",
  },
  {
    name: "Silicon",
    symbol: "Si",
    atomicNumber: 14,
    shells: [2, 8, 4],
    config: "[Ne] 3s² 3p²",
  },
  {
    name: "Phosphorus",
    symbol: "P",
    atomicNumber: 15,
    shells: [2, 8, 5],
    config: "[Ne] 3s² 3p³",
  },
  {
    name: "Sulphur",
    symbol: "S",
    atomicNumber: 16,
    shells: [2, 8, 6],
    config: "[Ne] 3s² 3p⁴",
  },
  {
    name: "Chlorine",
    symbol: "Cl",
    atomicNumber: 17,
    shells: [2, 8, 7],
    config: "[Ne] 3s² 3p⁵",
  },
  {
    name: "Argon",
    symbol: "Ar",
    atomicNumber: 18,
    shells: [2, 8, 8],
    config: "[Ne] 3s² 3p⁶",
  },
  {
    name: "Potassium",
    symbol: "K",
    atomicNumber: 19,
    shells: [2, 8, 8, 1],
    config: "[Ar] 4s¹",
  },
  {
    name: "Calcium",
    symbol: "Ca",
    atomicNumber: 20,
    shells: [2, 8, 8, 2],
    config: "[Ar] 4s²",
  },
];

const SHELL_RADII = [38, 60, 82, 104];
const COLORS = ["#00d4ff", "#a855f7", "#22c55e", "#f59e0b"];

function BohrModelSVG({ atom }: { atom: AtomInfo }) {
  const cx = 110;
  const cy = 110;

  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      role="img"
      aria-label={`Bohr model for ${atom.name}`}
      className="bohr-model-svg"
    >
      <title>Bohr model for {atom.name}</title>
      {/* Nucleus glow */}
      <circle cx={cx} cy={cy} r="22" fill="rgba(0,212,255,0.08)" />
      <circle
        cx={cx}
        cy={cy}
        r="15"
        fill="rgba(0,212,255,0.18)"
        stroke="#00d4ff"
        strokeWidth="1.5"
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill="#00d4ff"
        fontSize="11"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="bold"
      >
        {atom.symbol}
      </text>

      {/* Shells + electrons */}
      {atom.shells.map((count, si) => {
        const r = SHELL_RADII[si];
        const color = COLORS[si % COLORS.length];
        return (
          <g key={`shell-${atom.symbol}-${si}`}>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="0.8"
              strokeDasharray="3 3"
              opacity="0.35"
            />
            {Array.from({ length: count }, (_, ei) => {
              const angle = (360 / count) * ei - 90;
              const rad = (angle * Math.PI) / 180;
              const ex = cx + r * Math.cos(rad);
              const ey = cy + r * Math.sin(rad);
              const animDur = 2 + si * 0.8;
              const animDelay = (ei / count) * -animDur;
              return (
                <g
                  key={`e-${atom.symbol}-${si}-${ei}`}
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    animation: `bohr-orbit ${animDur}s linear infinite`,
                    animationDelay: `${animDelay}s`,
                  }}
                >
                  <circle cx={ex} cy={ey} r="4" fill={color} opacity="0.9">
                    <animate
                      attributeName="opacity"
                      values="0.7;1;0.7"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function AtomBuilder() {
  const [selected, setSelected] = useState<AtomInfo>(ATOMS[5]);

  return (
    <div className="flex flex-col gap-4">
      <select
        data-ocid="atom-builder.select"
        value={selected.atomicNumber}
        onChange={(e) => {
          const atom = ATOMS.find(
            (a) => a.atomicNumber === Number(e.target.value),
          );
          if (atom) setSelected(atom);
        }}
        className="w-full rounded-xl px-3 py-2 text-sm font-mono"
        style={{
          background: "rgba(0,212,255,0.07)",
          border: "1px solid rgba(0,212,255,0.25)",
          color: "#e2e8f0",
          outline: "none",
        }}
        aria-label="Select element for atom builder"
      >
        {ATOMS.map((a) => (
          <option
            key={a.atomicNumber}
            value={a.atomicNumber}
            style={{ background: "#111827" }}
          >
            {a.atomicNumber}. {a.name} ({a.symbol})
          </option>
        ))}
      </select>

      <div className="flex justify-center">
        <BohrModelSVG atom={selected} />
      </div>

      <div
        className="rounded-xl p-3 text-sm space-y-1 font-mono"
        style={{
          background: "rgba(0,212,255,0.05)",
          border: "1px solid rgba(0,212,255,0.15)",
        }}
      >
        <div className="flex justify-between">
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Element</span>
          <span style={{ color: "#00d4ff" }}>{selected.name}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Atomic No.</span>
          <span style={{ color: "#a855f7" }}>{selected.atomicNumber}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Shells</span>
          <span style={{ color: "#22c55e" }}>{selected.shells.join(", ")}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Config</span>
          <span style={{ color: "#f59e0b", fontSize: "11px" }}>
            {selected.config}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Chemical Bonding ────────────────────────────────────────────────────────

type BondMode = "ionic" | "covalent";
type IonicState = "idle" | "bonding" | "bonded";
type CovalentState = "idle" | "bonding" | "bonded";

function ChemicalBonding() {
  const [mode, setMode] = useState<BondMode>("ionic");
  const [ionicState, setIonicState] = useState<IonicState>("idle");
  const [covalentState, setCovalentState] = useState<CovalentState>("idle");

  const handleIonicBond = () => {
    setIonicState("bonding");
    setTimeout(() => setIonicState("bonded"), 800);
  };
  const handleCovalentBond = () => {
    setCovalentState("bonding");
    setTimeout(() => setCovalentState("bonded"), 800);
  };
  const handleReset = () => {
    setIonicState("idle");
    setCovalentState("idle");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mode toggle */}
      <div
        className="flex rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(168,85,247,0.25)" }}
      >
        {(["ionic", "covalent"] as BondMode[]).map((m) => (
          <button
            key={m}
            type="button"
            data-ocid={`bonding.${m}_tab`}
            onClick={() => {
              setMode(m);
              handleReset();
            }}
            className="flex-1 py-2 text-xs font-semibold transition-smooth capitalize"
            style={{
              background: mode === m ? "rgba(168,85,247,0.2)" : "transparent",
              color: mode === m ? "#a855f7" : "rgba(255,255,255,0.4)",
              borderRight:
                m === "ionic" ? "1px solid rgba(168,85,247,0.2)" : "none",
            }}
          >
            {m} Bond
          </button>
        ))}
      </div>

      {mode === "ionic" ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-6">
            {/* Na */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center relative text-sm font-bold font-mono transition-all duration-700"
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "2px solid rgba(239,68,68,0.5)",
                  color: "#ef4444",
                  transform:
                    ionicState === "bonded"
                      ? "translateX(18px)"
                      : "translateX(0)",
                }}
              >
                Na
                {ionicState !== "bonded" && (
                  <span
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-xs flex items-center justify-center"
                    style={{
                      background: "#ef4444",
                      fontSize: "8px",
                      color: "white",
                    }}
                  >
                    e
                  </span>
                )}
              </div>
              <span
                className="text-xs font-mono"
                style={{
                  color:
                    ionicState === "bonded"
                      ? "#ef4444"
                      : "rgba(255,255,255,0.5)",
                }}
              >
                {ionicState === "bonded" ? "Na⁺" : "Na"}
              </span>
            </div>

            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "20px" }}>
              {ionicState === "bonded" ? "→" : "+"}
            </span>

            {/* Cl */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center relative text-sm font-bold font-mono transition-all duration-700"
                style={{
                  background: "rgba(59,130,246,0.15)",
                  border: "2px solid rgba(59,130,246,0.5)",
                  color: "#3b82f6",
                  transform:
                    ionicState === "bonded"
                      ? "translateX(-18px)"
                      : "translateX(0)",
                }}
              >
                Cl
                {ionicState === "bonded" && (
                  <span
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
                    style={{
                      background: "#3b82f6",
                      fontSize: "8px",
                      color: "white",
                    }}
                  >
                    e
                  </span>
                )}
              </div>
              <span
                className="text-xs font-mono"
                style={{
                  color:
                    ionicState === "bonded"
                      ? "#3b82f6"
                      : "rgba(255,255,255,0.5)",
                }}
              >
                {ionicState === "bonded" ? "Cl⁻" : "Cl"}
              </span>
            </div>
          </div>

          {ionicState === "bonded" && (
            <div
              className="text-center rounded-xl px-4 py-2 font-mono font-bold text-lg animate-fade-in-up"
              style={{
                background: "rgba(168,85,247,0.15)",
                border: "1px solid rgba(168,85,247,0.4)",
                color: "#a855f7",
              }}
            >
              NaCl — Ionic Crystal
            </div>
          )}

          <div className="flex gap-2 w-full">
            {ionicState !== "bonded" ? (
              <button
                type="button"
                data-ocid="bonding.ionic_bond_button"
                onClick={handleIonicBond}
                className="flex-1 py-2 rounded-xl text-xs font-semibold btn-neon-purple"
                disabled={ionicState === "bonding"}
              >
                {ionicState === "bonding" ? "Bonding..." : "Bond"}
              </button>
            ) : (
              <button
                type="button"
                data-ocid="bonding.reset_button"
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl text-xs font-semibold btn-neon-blue"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-4">
            {/* H1 */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold font-mono transition-all duration-700"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "2px solid rgba(0,212,255,0.4)",
                color: "#00d4ff",
                transform:
                  covalentState === "bonded"
                    ? "translateX(10px)"
                    : "translateX(0)",
              }}
            >
              H
            </div>

            {/* Shared region */}
            {covalentState === "bonded" && (
              <div
                className="flex flex-col items-center gap-1 animate-fade-in-up"
                style={{ color: "#22c55e" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                  style={{
                    background: "rgba(34,197,94,0.2)",
                    border: "1px solid rgba(34,197,94,0.5)",
                  }}
                >
                  ••
                </div>
              </div>
            )}

            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "20px" }}>
              +
            </span>

            {/* H2 */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold font-mono transition-all duration-700"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "2px solid rgba(0,212,255,0.4)",
                color: "#00d4ff",
                transform:
                  covalentState === "bonded"
                    ? "translateX(-10px)"
                    : "translateX(0)",
              }}
            >
              H
            </div>
          </div>

          {covalentState === "bonded" && (
            <div
              className="text-center rounded-xl px-4 py-2 font-mono font-bold text-lg animate-fade-in-up"
              style={{
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.35)",
                color: "#22c55e",
              }}
            >
              H₂ — Shared electrons
            </div>
          )}

          <div className="flex gap-2 w-full">
            {covalentState !== "bonded" ? (
              <button
                type="button"
                data-ocid="bonding.covalent_bond_button"
                onClick={handleCovalentBond}
                className="flex-1 py-2 rounded-xl text-xs font-semibold btn-neon-green"
                disabled={covalentState === "bonding"}
              >
                {covalentState === "bonding" ? "Bonding..." : "Bond"}
              </button>
            ) : (
              <button
                type="button"
                data-ocid="bonding.reset_button"
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl text-xs font-semibold btn-neon-blue"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Formula Builder ─────────────────────────────────────────────────────────

interface Ion {
  label: string;
  name: string;
  charge: number;
  type: "cation" | "anion";
}

const IONS: Ion[] = [
  { label: "Na⁺", name: "Sodium", charge: 1, type: "cation" },
  { label: "K⁺", name: "Potassium", charge: 1, type: "cation" },
  { label: "Ca²⁺", name: "Calcium", charge: 2, type: "cation" },
  { label: "Al³⁺", name: "Aluminium", charge: 3, type: "cation" },
  { label: "Cl⁻", name: "Chloride", charge: -1, type: "anion" },
  { label: "O²⁻", name: "Oxide", charge: -2, type: "anion" },
  { label: "SO₄²⁻", name: "Sulphate", charge: -2, type: "anion" },
  { label: "NO₃⁻", name: "Nitrate", charge: -1, type: "anion" },
];

function buildFormula(cation: Ion, anion: Ion): string {
  const c = Math.abs(anion.charge);
  const a = Math.abs(cation.charge);
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  const g = gcd(c, a);
  const cCount = c / g;
  const aCount = a / g;

  const cBase = cation.label.replace(/[⁺⁻²³]/g, "").replace(/[⁰¹⁴⁵⁶⁷⁸⁹]/g, "");
  const aBase = anion.label.replace(/[⁺⁻²³]/g, "").replace(/[⁰¹⁴⁵⁶⁷⁸⁹]/g, "");

  const cPart = cCount === 1 ? cBase : `${cBase}${cCount}`;
  const needsParens =
    aBase.includes("₄") || aBase.includes("₃") || aBase.includes("₂O");
  const aPart =
    aCount === 1
      ? aBase
      : needsParens
        ? `(${aBase})${aCount}`
        : `${aBase}${aCount}`;
  return `${cPart}${aPart}`;
}

function FormulaBuilder() {
  const [cation, setCation] = useState<Ion | null>(null);
  const [anion, setAnion] = useState<Ion | null>(null);
  const [bonded, setBonded] = useState(false);

  const formula = cation && anion ? buildFormula(cation, anion) : null;

  const handleBuild = () => {
    if (cation && anion) setBonded(true);
  };

  const handleReset = () => {
    setCation(null);
    setAnion(null);
    setBonded(false);
  };

  const selectIon = (ion: Ion) => {
    setBonded(false);
    if (ion.type === "cation") setCation(ion);
    else setAnion(ion);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-1.5">
        {IONS.map((ion) => {
          const isSelected =
            ion.type === "cation"
              ? cation?.label === ion.label
              : anion?.label === ion.label;
          const borderColor =
            ion.type === "cation"
              ? "rgba(0,212,255,0.5)"
              : "rgba(168,85,247,0.5)";
          const bgColor =
            ion.type === "cation"
              ? "rgba(0,212,255,0.15)"
              : "rgba(168,85,247,0.15)";
          return (
            <button
              key={ion.label}
              type="button"
              data-ocid={`formula.ion_${ion.name.toLowerCase()}`}
              onClick={() => selectIon(ion)}
              className="rounded-lg py-2 text-xs font-mono font-bold transition-smooth"
              style={{
                border: `1px solid ${isSelected ? borderColor : "rgba(255,255,255,0.1)"}`,
                background: isSelected ? bgColor : "rgba(255,255,255,0.04)",
                color: isSelected
                  ? ion.type === "cation"
                    ? "#00d4ff"
                    : "#a855f7"
                  : "rgba(255,255,255,0.6)",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
              }}
              aria-pressed={isSelected}
            >
              {ion.label}
            </button>
          );
        })}
      </div>

      <div
        className="flex items-center gap-2 text-xs"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        <span style={{ color: "#00d4ff" }}>Cyan = Cation</span>
        <span>·</span>
        <span style={{ color: "#a855f7" }}>Purple = Anion</span>
      </div>

      {/* Selected preview */}
      <div className="flex items-center justify-center gap-3 py-2">
        <span
          className="text-sm font-mono px-3 py-1 rounded-lg"
          style={{
            background: "rgba(0,212,255,0.1)",
            border: "1px solid rgba(0,212,255,0.25)",
            color: "#00d4ff",
          }}
        >
          {cation?.label ?? "—"}
        </span>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>+</span>
        <span
          className="text-sm font-mono px-3 py-1 rounded-lg"
          style={{
            background: "rgba(168,85,247,0.1)",
            border: "1px solid rgba(168,85,247,0.25)",
            color: "#a855f7",
          }}
        >
          {anion?.label ?? "—"}
        </span>
      </div>

      {bonded && formula && (
        <div
          className="text-center rounded-xl py-3 animate-fade-in-up"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.35)",
          }}
        >
          <div
            className="text-2xl font-bold font-mono"
            style={{
              color: "#22c55e",
              textShadow: "0 0 15px rgba(34,197,94,0.5)",
            }}
          >
            {formula}
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {cation?.name} {anion?.name.toLowerCase()}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          data-ocid="formula.build_button"
          onClick={handleBuild}
          disabled={!cation || !anion}
          className="flex-1 py-2 rounded-xl text-xs font-semibold btn-neon-green transition-smooth"
          style={{ opacity: !cation || !anion ? 0.4 : 1 }}
        >
          Build Formula
        </button>
        <button
          type="button"
          data-ocid="formula.reset_button"
          onClick={handleReset}
          className="px-4 py-2 rounded-xl text-xs transition-smooth"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// ─── Main Simulations Section ─────────────────────────────────────────────────

const CARDS = [
  {
    id: "atom-builder",
    title: "Atom Builder",
    subtitle: "Select an element and explore its Bohr model",
    color: "#00d4ff",
    component: <AtomBuilder />,
  },
  {
    id: "chemical-bonding",
    title: "Chemical Bonding",
    subtitle: "Visualize ionic and covalent bond formation",
    color: "#a855f7",
    component: <ChemicalBonding />,
  },
  {
    id: "formula-builder",
    title: "Formula Builder",
    subtitle: "Select ions and generate compounds using criss-cross rule",
    color: "#22c55e",
    component: <FormulaBuilder />,
  },
];

export default function Simulations() {
  return (
    <section
      id="simulations"
      className="py-20 relative"
      style={{ background: "rgba(17,24,39,0.4)" }}
    >
      <div className="neon-blob-blue absolute -top-20 -left-20 opacity-30 animate-blob pointer-events-none" />
      <div className="neon-blob-purple absolute -bottom-20 -right-20 opacity-20 animate-blob pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-xs font-semibold tracking-wider uppercase"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "#00d4ff",
            }}
          >
            ⚡ Interactive Simulations
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gradient-blue-purple">
            Virtual Chemistry Simulations
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Explore atomic structure, chemical bonding, and compound formation
            with interactive models.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card) => (
            <div
              key={card.id}
              data-ocid={`simulations.${card.id}.card`}
              className="rounded-2xl p-5 flex flex-col gap-4 hover-glow transition-smooth"
              style={{
                background: "rgba(15,23,42,0.7)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${card.color}22`,
              }}
            >
              <div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color: card.color }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {card.subtitle}
                </p>
              </div>
              <div className="flex-1">{card.component}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
