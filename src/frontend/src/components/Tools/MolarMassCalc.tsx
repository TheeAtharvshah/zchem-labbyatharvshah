import { useEffect, useMemo, useRef, useState } from "react";
import { elementData } from "../../data/elements";

interface ParsedAtom {
  symbol: string;
  count: number;
  atomicMass: number;
  subtotal: number;
  found: boolean;
}

function parseFormula(formula: string): Map<string, number> {
  const stack: Map<string, number>[] = [new Map()];

  const addToTop = (el: string, n: number) => {
    const top = stack[stack.length - 1];
    top.set(el, (top.get(el) ?? 0) + n);
  };

  let i = 0;
  while (i < formula.length) {
    if (formula[i] === "(") {
      stack.push(new Map());
      i++;
    } else if (formula[i] === ")") {
      i++;
      let numStr = "";
      while (i < formula.length && /\d/.test(formula[i])) {
        numStr += formula[i];
        i++;
      }
      const multiplier = numStr ? Number.parseInt(numStr) : 1;
      const top = stack.pop()!;
      for (const [el, cnt] of top.entries()) addToTop(el, cnt * multiplier);
    } else if (/[A-Z]/.test(formula[i])) {
      let el = formula[i];
      i++;
      while (i < formula.length && /[a-z]/.test(formula[i])) {
        el += formula[i];
        i++;
      }
      let numStr = "";
      while (i < formula.length && /\d/.test(formula[i])) {
        numStr += formula[i];
        i++;
      }
      const cnt = numStr ? Number.parseInt(numStr) : 1;
      addToTop(el, cnt);
    } else {
      i++;
    }
  }

  return stack[0];
}

function getAtomBreakdown(formula: string): {
  atoms: ParsedAtom[];
  total: number;
  valid: boolean;
} {
  if (!formula.trim()) return { atoms: [], total: 0, valid: false };
  try {
    const atomMap = parseFormula(formula);
    const atoms: ParsedAtom[] = [];
    let total = 0;
    for (const [symbol, count] of atomMap.entries()) {
      const el = elementData.find((e) => e.symbol === symbol);
      const mass = el?.atomicMass ?? 0;
      const subtotal = mass * count;
      total += subtotal;
      atoms.push({ symbol, count, atomicMass: mass, subtotal, found: !!el });
    }
    return { atoms, total, valid: atoms.length > 0 };
  } catch {
    return { atoms: [], total: 0, valid: false };
  }
}

const COMMON_FORMULAS = [
  "H2O",
  "NaCl",
  "H2SO4",
  "CO2",
  "NH3",
  "C6H12O6",
  "Ca3(PO4)2",
  "CuSO4",
];

export default function MolarMassCalc() {
  const [formula, setFormula] = useState("H2SO4");
  const [displayedMass, setDisplayedMass] = useState(0);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { atoms, total, valid } = useMemo(
    () => getAtomBreakdown(formula),
    [formula],
  );

  // Animate the display number counting up
  useEffect(() => {
    if (animRef.current) clearTimeout(animRef.current);
    if (!valid || total === 0) {
      setDisplayedMass(0);
      return;
    }

    const startTime = performance.now();
    const duration = 900;
    const startVal = 0;
    const endVal = total;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayedMass(startVal + (endVal - startVal) * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [total, valid]);

  const barPercent = Math.min((total / 400) * 100, 100); // 400 g/mol as max for visual

  return (
    <div className="space-y-6">
      {/* Quick formula buttons */}
      <div>
        <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
          Quick formulas:
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMON_FORMULAS.map((f) => (
            <button
              key={f}
              type="button"
              data-ocid={`molar.formula.${f.toLowerCase()}`}
              onClick={() => setFormula(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
              style={{
                background:
                  formula === f
                    ? "rgba(0,212,255,0.2)"
                    : "rgba(255,255,255,0.05)",
                border: `1px solid ${formula === f ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.1)"}`,
                color: formula === f ? "#00d4ff" : "rgba(255,255,255,0.5)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <input
        data-ocid="molar.formula_input"
        type="text"
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
        placeholder="e.g. H2SO4, NaCl, Ca3(PO4)2"
        className="w-full px-4 py-4 rounded-xl text-lg outline-none"
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(0,212,255,0.3)",
          color: "#00d4ff",
          fontFamily: "JetBrains Mono, monospace",
          caretColor: "#00d4ff",
        }}
      />

      {/* Animated digital scale display */}
      <div
        className="rounded-xl p-5 flex flex-col items-center gap-3"
        style={{
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(0,212,255,0.2)",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5)",
        }}
      >
        <p
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "rgba(0,212,255,0.5)" }}
        >
          ⚗️ Molar Mass Display
        </p>

        {/* Digital display */}
        <div
          className="rounded-lg px-8 py-4 text-4xl font-bold text-center min-w-[200px]"
          style={{
            background: "#050a10",
            border: "1px solid rgba(0,212,255,0.3)",
            color: "#00d4ff",
            fontFamily: "JetBrains Mono, monospace",
            textShadow: "0 0 20px rgba(0,212,255,0.6)",
            boxShadow: "inset 0 0 30px rgba(0,212,255,0.05)",
            letterSpacing: "0.1em",
          }}
        >
          {displayedMass.toFixed(2)}
          <span
            className="text-base ml-2"
            style={{ color: "rgba(0,212,255,0.5)" }}
          >
            g/mol
          </span>
        </div>

        {/* Bar meter */}
        <div className="w-full">
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${barPercent}%`,
                background: "linear-gradient(90deg, #00d4ff, #a855f7)",
                boxShadow: "0 0 8px rgba(0,212,255,0.5)",
              }}
            />
          </div>
          <div
            className="flex justify-between mt-1 text-xs"
            style={{
              color: "rgba(255,255,255,0.25)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            <span>0</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>400+ g/mol</span>
          </div>
        </div>
      </div>

      {/* Breakdown table */}
      {valid && atoms.length > 0 ? (
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
            Element Breakdown
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Symbol", "Count", "Atomic Mass", "Subtotal"].map((h) => (
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
              {atoms.map((atom) => (
                <tr
                  key={atom.symbol}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td
                    className="px-4 py-2.5 font-bold"
                    style={{
                      color: "#a855f7",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {atom.symbol}
                    {!atom.found && (
                      <span
                        className="text-xs ml-1"
                        style={{ color: "#ef4444" }}
                      >
                        (unknown)
                      </span>
                    )}
                  </td>
                  <td
                    className="px-4 py-2.5"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    × {atom.count}
                  </td>
                  <td
                    className="px-4 py-2.5"
                    style={{
                      color: "#00d4ff",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {atom.atomicMass.toFixed(4)}
                  </td>
                  <td
                    className="px-4 py-2.5 font-bold"
                    style={{
                      color: "#22c55e",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {atom.subtotal.toFixed(4)}
                  </td>
                </tr>
              ))}
              <tr style={{ background: "rgba(0,212,255,0.06)" }}>
                <td
                  colSpan={3}
                  className="px-4 py-3 font-bold text-right"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Total Molar Mass:
                </td>
                <td
                  className="px-4 py-3 font-bold text-lg"
                  style={{
                    color: "#00d4ff",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {total.toFixed(4)} g/mol
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : formula.trim() ? (
        <div
          className="p-4 rounded-xl text-sm text-center"
          style={{
            color: "rgba(239,68,68,0.7)",
            border: "1px solid rgba(239,68,68,0.2)",
            background: "rgba(239,68,68,0.05)",
          }}
        >
          ⚠️ Could not parse formula. Check the format (e.g. H2SO4, NaCl)
        </div>
      ) : null}
    </div>
  );
}
