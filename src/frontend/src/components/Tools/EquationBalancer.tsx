import { useMemo, useState } from "react";

interface AtomCount {
  [element: string]: number;
}

interface BalanceResult {
  element: string;
  lhs: number;
  rhs: number;
  balanced: boolean;
}

const PRACTICE_EQUATIONS = [
  { eq: "H2 + O2 -> H2O", hint: "Try coefficient 2 for H2O" },
  { eq: "CH4 + O2 -> CO2 + H2O", hint: "Balance C first, then H, then O" },
  { eq: "Fe + O2 -> Fe2O3", hint: "Try 4Fe + 3O2" },
  { eq: "N2 + H2 -> NH3", hint: "Try N2 + 3H2" },
  { eq: "C + O2 -> CO2", hint: "This one is already balanced!" },
  { eq: "Mg + HCl -> MgCl2 + H2", hint: "Balance Cl atoms on each side" },
  { eq: "Al + O2 -> Al2O3", hint: "Try 4Al + 3O2 → 2Al2O3" },
  { eq: "Na + H2O -> NaOH + H2", hint: "Try 2Na + 2H2O" },
];

function parseFormulaSide(side: string): AtomCount {
  const counts: AtomCount = {};
  // Split on + to get individual compounds with optional coefficients
  const parts = side.split("+").map((s) => s.trim());
  for (const part of parts) {
    const match = part.match(/^(\d*)(.+)$/);
    if (!match) continue;
    const coeff = match[1] ? Number.parseInt(match[1]) : 1;
    const formula = match[2].trim();
    const atomCounts = parseFormula(formula);
    for (const [el, cnt] of Object.entries(atomCounts)) {
      counts[el] = (counts[el] ?? 0) + cnt * coeff;
    }
  }
  return counts;
}

function parseFormula(formula: string): AtomCount {
  const counts: AtomCount = {};
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let m: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex iteration
  while ((m = regex.exec(formula)) !== null) {
    const el = m[1];
    const cnt = m[2] ? Number.parseInt(m[2]) : 1;
    counts[el] = (counts[el] ?? 0) + cnt;
  }
  return counts;
}

function analyzeEquation(equation: string): {
  lhsCounts: AtomCount;
  rhsCounts: AtomCount;
  results: BalanceResult[];
  isBalanced: boolean;
  lhsWeight: number;
  rhsWeight: number;
} {
  const arrow = equation.includes("->")
    ? "->"
    : equation.includes("→")
      ? "→"
      : "=";
  const sides = equation.split(arrow);
  if (sides.length !== 2) {
    return {
      lhsCounts: {},
      rhsCounts: {},
      results: [],
      isBalanced: false,
      lhsWeight: 0,
      rhsWeight: 0,
    };
  }
  const lhsCounts = parseFormulaSide(sides[0]);
  const rhsCounts = parseFormulaSide(sides[1]);
  const allElements = Array.from(
    new Set([...Object.keys(lhsCounts), ...Object.keys(rhsCounts)]),
  );
  const results: BalanceResult[] = allElements.map((el) => ({
    element: el,
    lhs: lhsCounts[el] ?? 0,
    rhs: rhsCounts[el] ?? 0,
    balanced: (lhsCounts[el] ?? 0) === (rhsCounts[el] ?? 0),
  }));
  const isBalanced = results.length > 0 && results.every((r) => r.balanced);
  const lhsWeight = Object.values(lhsCounts).reduce((a, b) => a + b, 0);
  const rhsWeight = Object.values(rhsCounts).reduce((a, b) => a + b, 0);
  return { lhsCounts, rhsCounts, results, isBalanced, lhsWeight, rhsWeight };
}

export default function EquationBalancer() {
  const [equation, setEquation] = useState("H2 + O2 -> H2O");
  const [checked, setChecked] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const analysis = useMemo(() => analyzeEquation(equation), [equation]);

  const handleCheck = () => {
    setChecked(true);
    if (analysis.isBalanced && practiceMode) {
      setScore((s) => s + 1);
    }
  };

  const handleReset = () => {
    setEquation(
      practiceMode ? PRACTICE_EQUATIONS[practiceIdx].eq : "H2 + O2 -> H2O",
    );
    setChecked(false);
    setShowHint(false);
  };

  const handleNextPractice = () => {
    const next = (practiceIdx + 1) % PRACTICE_EQUATIONS.length;
    setPracticeIdx(next);
    setEquation(PRACTICE_EQUATIONS[next].eq);
    setChecked(false);
    setShowHint(false);
  };

  const togglePractice = () => {
    setPracticeMode((p) => !p);
    setEquation(PRACTICE_EQUATIONS[0].eq);
    setPracticeIdx(0);
    setChecked(false);
    setShowHint(false);
  };

  // Taraju tilt: positive = left heavy, negative = right heavy
  const diff = analysis.lhsWeight - analysis.rhsWeight;
  const maxTilt = 18;
  const tiltAngle =
    analysis.lhsWeight + analysis.rhsWeight > 0
      ? Math.max(
          -maxTilt,
          Math.min(
            maxTilt,
            (diff / Math.max(analysis.lhsWeight, analysis.rhsWeight, 1)) *
              maxTilt,
          ),
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Enter a chemical equation using{" "}
          <code
            style={{
              color: "#a855f7",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            -&gt;
          </code>{" "}
          as arrow
        </p>
        <button
          type="button"
          data-ocid="balancer.practice_toggle"
          onClick={togglePractice}
          className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200"
          style={{
            background: practiceMode
              ? "rgba(168,85,247,0.2)"
              : "rgba(255,255,255,0.06)",
            border: `1px solid ${practiceMode ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.1)"}`,
            color: practiceMode ? "#a855f7" : "rgba(255,255,255,0.6)",
          }}
        >
          {practiceMode
            ? `🎯 Practice ON — Score: ${score}`
            : "🎯 Practice Mode"}
        </button>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          data-ocid="balancer.equation_input"
          type="text"
          value={equation}
          onChange={(e) => {
            setEquation(e.target.value);
            setChecked(false);
            setShowHint(false);
          }}
          placeholder="e.g. H2 + O2 -> H2O"
          className="w-full px-4 py-4 rounded-xl text-base outline-none"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(168,85,247,0.3)",
            color: "#ffffff",
            fontFamily: "JetBrains Mono, monospace",
            caretColor: "#a855f7",
          }}
        />
        {checked && analysis.isBalanced && (
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 text-lg"
            style={{ filter: "drop-shadow(0 0 8px #22c55e)" }}
          >
            ✅
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taraju Scale */}
        <div
          className="rounded-xl p-4 flex flex-col items-center"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(168,85,247,0.15)",
          }}
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Taraju Balance Scale
          </p>
          <svg width="240" height="160" viewBox="0 0 240 160" role="img">
            <title>Taraju weighing scale</title>
            {/* Stand */}
            <line
              x1="120"
              y1="60"
              x2="120"
              y2="150"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <ellipse
              cx="120"
              cy="152"
              rx="30"
              ry="5"
              fill="rgba(168,85,247,0.3)"
            />
            {/* Pivot */}
            <circle cx="120" cy="60" r="5" fill="#a855f7" />

            {/* Arm group — rotates around pivot */}
            <g
              transform={`rotate(${tiltAngle}, 120, 60)`}
              style={{ transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
            >
              <line
                x1="40"
                y1="60"
                x2="200"
                y2="60"
                stroke="rgba(168,85,247,0.7)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Left chain */}
              <line
                x1="60"
                y1="60"
                x2="60"
                y2="90"
                stroke="rgba(168,85,247,0.5)"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
              {/* Right chain */}
              <line
                x1="180"
                y1="60"
                x2="180"
                y2="90"
                stroke="rgba(0,212,255,0.5)"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
              {/* Left plate */}
              <ellipse
                cx="60"
                cy="92"
                rx="28"
                ry="7"
                fill="rgba(168,85,247,0.2)"
                stroke="rgba(168,85,247,0.5)"
                strokeWidth="1.5"
              />
              {/* Right plate */}
              <ellipse
                cx="180"
                cy="92"
                rx="28"
                ry="7"
                fill="rgba(0,212,255,0.2)"
                stroke="rgba(0,212,255,0.5)"
                strokeWidth="1.5"
              />

              {/* LHS label */}
              <text
                x="60"
                y="110"
                textAnchor="middle"
                fontSize="9"
                fill="rgba(168,85,247,0.9)"
                fontFamily="JetBrains Mono, monospace"
              >
                LHS: {analysis.lhsWeight}
              </text>
              {/* RHS label */}
              <text
                x="180"
                y="110"
                textAnchor="middle"
                fontSize="9"
                fill="rgba(0,212,255,0.9)"
                fontFamily="JetBrains Mono, monospace"
              >
                RHS: {analysis.rhsWeight}
              </text>
            </g>
          </svg>

          {/* Balance status */}
          <div
            className="mt-3 px-4 py-2 rounded-full text-xs font-bold"
            style={{
              background:
                analysis.isBalanced && checked
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(239,68,68,0.1)",
              border: `1px solid ${analysis.isBalanced && checked ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.2)"}`,
              color:
                analysis.isBalanced && checked
                  ? "#22c55e"
                  : "rgba(239,68,68,0.8)",
            }}
          >
            {checked
              ? analysis.isBalanced
                ? "✓ Equation is balanced!"
                : tiltAngle > 0
                  ? "← LHS is heavier"
                  : "→ RHS is heavier"
              : "Check balance to see result"}
          </div>
        </div>

        {/* Atom comparison table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="px-4 py-3 text-xs font-semibold tracking-widest uppercase"
            style={{
              color: "rgba(255,255,255,0.4)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Atom Count
          </div>
          {analysis.results.length === 0 ? (
            <div
              className="p-6 text-center text-sm"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Enter an equation above to see atom counts
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {["Element", "LHS", "RHS", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-xs font-semibold"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analysis.results.map((r) => (
                  <tr
                    key={r.element}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      background: checked
                        ? r.balanced
                          ? "rgba(34,197,94,0.05)"
                          : "rgba(239,68,68,0.06)"
                        : "transparent",
                    }}
                  >
                    <td
                      className="px-4 py-2.5 font-bold"
                      style={{
                        color: "#a855f7",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {r.element}
                    </td>
                    <td
                      className="px-4 py-2.5"
                      style={{
                        color: "#00d4ff",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {r.lhs}
                    </td>
                    <td
                      className="px-4 py-2.5"
                      style={{
                        color: "#00d4ff",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {r.rhs}
                    </td>
                    <td className="px-4 py-2.5">
                      {checked ? (
                        r.balanced ? (
                          <span
                            className="text-xs font-bold"
                            style={{ color: "#22c55e" }}
                          >
                            ✓ OK
                          </span>
                        ) : (
                          <span
                            className="text-xs font-bold"
                            style={{ color: "#ef4444" }}
                          >
                            ✗ Off by {Math.abs(r.lhs - r.rhs)}
                          </span>
                        )
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.2)" }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Hint */}
      {showHint && (
        <div
          className="p-4 rounded-xl text-sm"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.25)",
            color: "rgba(245,158,11,0.9)",
          }}
        >
          💡{" "}
          {practiceMode
            ? PRACTICE_EQUATIONS[practiceIdx].hint
            : analysis.results.find((r) => !r.balanced)
              ? `Try adjusting the coefficient for ${analysis.results.find((r) => !r.balanced)?.element}`
              : "All atoms are balanced!"}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          data-ocid="balancer.check_button"
          onClick={handleCheck}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: "rgba(168,85,247,0.2)",
            border: "1px solid rgba(168,85,247,0.4)",
            color: "#a855f7",
          }}
        >
          ⚖️ Check Balance
        </button>
        <button
          type="button"
          data-ocid="balancer.hint_button"
          onClick={() => setShowHint((s) => !s)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
            color: "rgba(245,158,11,0.9)",
          }}
        >
          💡 Hint
        </button>
        <button
          type="button"
          data-ocid="balancer.reset_button"
          onClick={handleReset}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "rgba(239,68,68,0.8)",
          }}
        >
          ↺ Reset
        </button>
        {practiceMode && (
          <button
            type="button"
            data-ocid="balancer.next_button"
            onClick={handleNextPractice}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ml-auto"
            style={{
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: "#22c55e",
            }}
          >
            Next Equation →
          </button>
        )}
      </div>

      {/* Success overlay glow */}
      {checked && analysis.isBalanced && (
        <div
          className="rounded-xl p-4 text-center font-bold"
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#22c55e",
            boxShadow: "0 0 30px rgba(34,197,94,0.15)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          🎉 Equation perfectly balanced! All atoms account for.
        </div>
      )}
    </div>
  );
}
