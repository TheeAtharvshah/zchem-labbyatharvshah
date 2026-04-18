import { useState } from "react";

type TempUnit = "celsius" | "fahrenheit" | "kelvin";
type MassUnit = "g" | "kg" | "mg";
type VolumeUnit = "L" | "mL" | "cm3";
type Category = "temperature" | "mass" | "volume";

// --- Temperature conversions ---
function tempToBase(val: number, from: TempUnit): number {
  if (from === "celsius") return val;
  if (from === "fahrenheit") return (val - 32) * (5 / 9);
  return val - 273.15; // kelvin → celsius
}
function tempFromBase(celsius: number, to: TempUnit): number {
  if (to === "celsius") return celsius;
  if (to === "fahrenheit") return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

// --- Mass conversions (base: grams) ---
function massToBase(val: number, from: MassUnit): number {
  if (from === "g") return val;
  if (from === "kg") return val * 1000;
  return val / 1000; // mg → g
}
function massFromBase(g: number, to: MassUnit): number {
  if (to === "g") return g;
  if (to === "kg") return g / 1000;
  return g * 1000; // g → mg
}

// --- Volume conversions (base: liters) ---
function volToBase(val: number, from: VolumeUnit): number {
  if (from === "L") return val;
  if (from === "mL") return val / 1000;
  return val / 1000; // cm³ = mL
}
function volFromBase(L: number, to: VolumeUnit): number {
  if (to === "L") return L;
  if (to === "mL") return L * 1000;
  return L * 1000; // L → cm³
}

function fmt(n: number): string {
  if (Number.isNaN(n) || !Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 1e-4 && n !== 0))
    return n.toExponential(4);
  return Number.parseFloat(n.toPrecision(7)).toString();
}

interface QuickRef {
  label: string;
  value: number;
  unit: string;
}

const TEMP_REFS: QuickRef[] = [
  { label: "Absolute Zero", value: -273.15, unit: "°C" },
  { label: "Water Freezing", value: 0, unit: "°C" },
  { label: "Room Temp", value: 25, unit: "°C" },
  { label: "Body Temp", value: 37, unit: "°C" },
  { label: "Water Boiling", value: 100, unit: "°C" },
];

const MASS_REFS: QuickRef[] = [
  { label: "1 mg", value: 1, unit: "mg" },
  { label: "1 g", value: 1, unit: "g" },
  { label: "100 g", value: 100, unit: "g" },
  { label: "1 kg", value: 1, unit: "kg" },
  { label: "1 metric ton", value: 1000, unit: "kg" },
];

const VOL_REFS: QuickRef[] = [
  { label: "1 mL", value: 1, unit: "mL" },
  { label: "1 cm³", value: 1, unit: "cm³" },
  { label: "250 mL flask", value: 250, unit: "mL" },
  { label: "500 mL", value: 500, unit: "mL" },
  { label: "1 L flask", value: 1, unit: "L" },
];

const CATEGORY_TABS: {
  id: Category;
  label: string;
  icon: string;
  color: string;
}[] = [
  { id: "temperature", label: "Temperature", icon: "🌡️", color: "#ef4444" },
  { id: "mass", label: "Mass", icon: "⚖️", color: "#f59e0b" },
  { id: "volume", label: "Volume", icon: "🧪", color: "#3b82f6" },
];

interface DisplayRowProps {
  label: string;
  value: string;
  unit: string;
  color: string;
}
function DisplayRow({ label, value, unit, color }: DisplayRowProps) {
  return (
    <div
      className="rounded-xl p-4 flex items-center justify-between gap-4"
      style={{
        background: "#050a10",
        border: `1px solid ${color}25`,
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
      }}
    >
      <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span
          className="text-2xl font-bold"
          style={{
            color,
            fontFamily: "JetBrains Mono, monospace",
            textShadow: `0 0 16px ${color}88`,
            letterSpacing: "0.05em",
          }}
        >
          {value}
        </span>
        <span
          className="text-sm font-bold"
          style={{
            color: `${color}99`,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("temperature");

  // Temperature state
  const [tempInput, setTempInput] = useState<{
    celsius: string;
    fahrenheit: string;
    kelvin: string;
  }>({
    celsius: "25",
    fahrenheit: "77",
    kelvin: "298.15",
  });

  // Mass state
  const [massInput, setMassInput] = useState<{
    g: string;
    kg: string;
    mg: string;
  }>({
    g: "1",
    kg: "0.001",
    mg: "1000",
  });

  // Volume state
  const [volInput, setVolInput] = useState<{
    L: string;
    mL: string;
    cm3: string;
  }>({
    L: "1",
    mL: "1000",
    cm3: "1000",
  });

  const handleTempChange = (from: TempUnit, val: string) => {
    const n = Number.parseFloat(val);
    if (val === "" || val === "-") {
      setTempInput((prev) => ({ ...prev, [from]: val }));
      return;
    }
    if (Number.isNaN(n)) {
      setTempInput((prev) => ({ ...prev, [from]: val }));
      return;
    }
    const base = tempToBase(n, from);
    setTempInput({
      celsius: from === "celsius" ? val : fmt(tempFromBase(base, "celsius")),
      fahrenheit:
        from === "fahrenheit" ? val : fmt(tempFromBase(base, "fahrenheit")),
      kelvin: from === "kelvin" ? val : fmt(tempFromBase(base, "kelvin")),
    });
  };

  const handleMassChange = (from: MassUnit, val: string) => {
    const n = Number.parseFloat(val);
    if (val === "" || Number.isNaN(n)) {
      setMassInput((prev) => ({ ...prev, [from]: val }));
      return;
    }
    const base = massToBase(n, from);
    setMassInput({
      g: from === "g" ? val : fmt(massFromBase(base, "g")),
      kg: from === "kg" ? val : fmt(massFromBase(base, "kg")),
      mg: from === "mg" ? val : fmt(massFromBase(base, "mg")),
    });
  };

  const handleVolChange = (from: VolumeUnit, val: string) => {
    const n = Number.parseFloat(val);
    if (val === "" || Number.isNaN(n)) {
      setVolInput((prev) => ({ ...prev, [from]: val }));
      return;
    }
    const base = volToBase(n, from);
    setVolInput({
      L: from === "L" ? val : fmt(volFromBase(base, "L")),
      mL: from === "mL" ? val : fmt(volFromBase(base, "mL")),
      cm3: from === "cm3" ? val : fmt(volFromBase(base, "cm3")),
    });
  };

  const currentCat = CATEGORY_TABS.find((c) => c.id === category)!;

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex gap-2">
        {CATEGORY_TABS.map((tab) => {
          const isActive = category === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-ocid={`converter.${tab.id}.tab`}
              onClick={() => setCategory(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: isActive
                  ? `${tab.color}18`
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${isActive ? `${tab.color}45` : "rgba(255,255,255,0.08)"}`,
                color: isActive ? tab.color : "rgba(255,255,255,0.45)",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* Temperature */}
      {category === "temperature" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            {[
              {
                key: "celsius" as TempUnit,
                label: "Celsius",
                unit: "°C",
                color: "#ef4444",
              },
              {
                key: "fahrenheit" as TempUnit,
                label: "Fahrenheit",
                unit: "°F",
                color: "#f97316",
              },
              {
                key: "kelvin" as TempUnit,
                label: "Kelvin",
                unit: "K",
                color: "#a855f7",
              },
            ].map(({ key, label, unit, color }) => (
              <div key={key}>
                <label
                  htmlFor={`temp-${key}`}
                  className="block text-xs mb-1.5"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {label}
                </label>
                <div className="relative">
                  <input
                    id={`temp-${key}`}
                    data-ocid={`converter.temp_${key}_input`}
                    type="number"
                    value={tempInput[key]}
                    onChange={(e) => handleTempChange(key, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-right outline-none pr-14"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      border: `1px solid ${color}35`,
                      color: "#ffffff",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                    style={{ color, fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Display */}
          <div className="space-y-3">
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Lab Display
            </p>
            <DisplayRow
              label="Celsius"
              value={tempInput.celsius || "—"}
              unit="°C"
              color="#ef4444"
            />
            <DisplayRow
              label="Fahrenheit"
              value={tempInput.fahrenheit || "—"}
              unit="°F"
              color="#f97316"
            />
            <DisplayRow
              label="Kelvin"
              value={tempInput.kelvin || "—"}
              unit="K"
              color="#a855f7"
            />
            {/* Quick refs */}
            <p
              className="text-xs mt-2"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Quick references:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TEMP_REFS.map((ref) => (
                <button
                  key={ref.label}
                  type="button"
                  data-ocid={`converter.temp_ref.${ref.label.toLowerCase().replace(/\s+/g, "_")}`}
                  onClick={() =>
                    handleTempChange("celsius", ref.value.toString())
                  }
                  className="px-2.5 py-1 rounded-lg text-xs transition-all duration-150"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "rgba(239,68,68,0.8)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {ref.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mass */}
      {category === "mass" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              {
                key: "g" as MassUnit,
                label: "Grams",
                unit: "g",
                color: "#f59e0b",
              },
              {
                key: "kg" as MassUnit,
                label: "Kilograms",
                unit: "kg",
                color: "#22c55e",
              },
              {
                key: "mg" as MassUnit,
                label: "Milligrams",
                unit: "mg",
                color: "#00d4ff",
              },
            ].map(({ key, label, unit, color }) => (
              <div key={key}>
                <label
                  htmlFor={`mass-${key}`}
                  className="block text-xs mb-1.5"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {label}
                </label>
                <div className="relative">
                  <input
                    id={`mass-${key}`}
                    data-ocid={`converter.mass_${key}_input`}
                    type="number"
                    value={massInput[key]}
                    onChange={(e) => handleMassChange(key, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-right outline-none pr-14"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      border: `1px solid ${color}35`,
                      color: "#ffffff",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                    style={{ color, fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Lab Display
            </p>
            <DisplayRow
              label="Grams"
              value={massInput.g || "—"}
              unit="g"
              color="#f59e0b"
            />
            <DisplayRow
              label="Kilograms"
              value={massInput.kg || "—"}
              unit="kg"
              color="#22c55e"
            />
            <DisplayRow
              label="Milligrams"
              value={massInput.mg || "—"}
              unit="mg"
              color="#00d4ff"
            />
            <p
              className="text-xs mt-2"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Quick references:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {MASS_REFS.map((ref) => (
                <button
                  key={ref.label}
                  type="button"
                  data-ocid={`converter.mass_ref.${ref.label.toLowerCase().replace(/\s+/g, "_")}`}
                  onClick={() => {
                    const unit =
                      ref.unit === "mg" ? "mg" : ref.unit === "kg" ? "kg" : "g";
                    handleMassChange(unit as MassUnit, ref.value.toString());
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs transition-all duration-150"
                  style={{
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    color: "rgba(245,158,11,0.8)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {ref.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Volume */}
      {category === "volume" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              {
                key: "L" as VolumeUnit,
                label: "Liters",
                unit: "L",
                color: "#3b82f6",
              },
              {
                key: "mL" as VolumeUnit,
                label: "Milliliters",
                unit: "mL",
                color: "#00d4ff",
              },
              {
                key: "cm3" as VolumeUnit,
                label: "Cubic Centimeters",
                unit: "cm³",
                color: "#a855f7",
              },
            ].map(({ key, label, unit, color }) => (
              <div key={key}>
                <label
                  htmlFor={`vol-${key}`}
                  className="block text-xs mb-1.5"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {label}
                </label>
                <div className="relative">
                  <input
                    id={`vol-${key}`}
                    data-ocid={`converter.vol_${key}_input`}
                    type="number"
                    value={volInput[key]}
                    onChange={(e) => handleVolChange(key, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-right outline-none pr-14"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      border: `1px solid ${color}35`,
                      color: "#ffffff",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                    style={{ color, fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Lab Display
            </p>
            <DisplayRow
              label="Liters"
              value={volInput.L || "—"}
              unit="L"
              color="#3b82f6"
            />
            <DisplayRow
              label="Milliliters"
              value={volInput.mL || "—"}
              unit="mL"
              color="#00d4ff"
            />
            <DisplayRow
              label="cm³"
              value={volInput.cm3 || "—"}
              unit="cm³"
              color="#a855f7"
            />
            <p
              className="text-xs mt-2"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Quick references:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {VOL_REFS.map((ref) => (
                <button
                  key={ref.label}
                  type="button"
                  data-ocid={`converter.vol_ref.${ref.label.toLowerCase().replace(/\s+/g, "_")}`}
                  onClick={() => {
                    const unit =
                      ref.unit === "L"
                        ? "L"
                        : ref.unit === "cm³"
                          ? "cm3"
                          : "mL";
                    handleVolChange(unit as VolumeUnit, ref.value.toString());
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs transition-all duration-150"
                  style={{
                    background: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    color: "rgba(59,130,246,0.8)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {ref.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer hint */}
      <div
        className="rounded-xl p-3 text-xs flex items-center gap-2"
        style={{
          background: `${currentCat.color}08`,
          border: `1px solid ${currentCat.color}18`,
          color: "rgba(255,255,255,0.35)",
        }}
      >
        <span>{currentCat.icon}</span>
        <span>
          {category === "temperature" &&
            "Type in any field — all others update automatically in real time."}
          {category === "mass" &&
            "1 kg = 1000 g = 1,000,000 mg. All fields sync instantly."}
          {category === "volume" &&
            "1 L = 1000 mL = 1000 cm³. Conversion is live as you type."}
        </span>
      </div>
    </div>
  );
}
