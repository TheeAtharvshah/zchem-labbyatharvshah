import { experimentsData } from "../../data/experiments";
import type { Experiment } from "../../types/chemistry";

const SHELF_ITEMS = [
  { label: "Beaker", icon: "🧪", id: "Beaker" },
  { label: "Test Tube", icon: "🧫", id: "Test tube" },
  { label: "Dropper", icon: "💧", id: "Dropper" },
  { label: "Blue Litmus", icon: "🔵", id: "Damp red/blue litmus paper" },
  { label: "Red Litmus", icon: "🔴", id: "Red litmus" },
  { label: "Salt Bottle", icon: "🧂", id: "Salt bottle" },
  { label: "Acid Bottle", icon: "⚗️", id: "Dilute HCl solution" },
  { label: "Base Bottle", icon: "🫙", id: "Base bottle" },
  { label: "CuSO₄", icon: "💎", id: "Blue copper sulphate crystals" },
  { label: "FeSO₄", icon: "🟢", id: "Green ferrous sulphate crystals" },
  { label: "Baking Soda", icon: "🫗", id: "Baking soda (NaHCO₃)" },
  { label: "Lime Water", icon: "🥛", id: "Lime water (in a test tube)" },
  { label: "Zn Granules", icon: "⬡", id: "Zinc granules" },
  { label: "Mg Ribbon", icon: "〰️", id: "Magnesium ribbon (5 cm)" },
  { label: "Burner", icon: "🔥", id: "Bunsen burner" },
];

interface LabShelfProps {
  selectedExperiment: Experiment | null;
  onSelectExperiment: (exp: Experiment) => void;
}

const DIFFICULTY_MAP: Record<string, { label: string; color: string }> = {
  "exp-1": { label: "Easy", color: "#22c55e" },
  "exp-2": { label: "Medium", color: "#f59e0b" },
  "exp-3": { label: "Easy", color: "#22c55e" },
  "exp-4": { label: "Medium", color: "#f59e0b" },
  "exp-5": { label: "Hard", color: "#ef4444" },
};

export default function LabShelf({
  selectedExperiment,
  onSelectExperiment,
}: LabShelfProps) {
  const isHighlighted = (itemId: string) => {
    if (!selectedExperiment) return false;
    return selectedExperiment.requiredItems.some(
      (r) =>
        r.toLowerCase().includes(itemId.toLowerCase()) ||
        itemId.toLowerCase().includes(r.toLowerCase()),
    );
  };

  return (
    <div className="flex flex-col gap-4" data-ocid="ncert-lab.shelf">
      {/* Experiment selector */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(17,24,39,0.8)",
          border: "1px solid rgba(0,212,255,0.12)",
        }}
      >
        <h3
          className="text-sm font-semibold mb-3 tracking-widest uppercase"
          style={{ color: "#00d4ff" }}
        >
          Experiments
        </h3>
        <div
          className="flex flex-col gap-2"
          data-ocid="ncert-lab.experiment_list"
        >
          {experimentsData.map((exp, i) => {
            const diff = DIFFICULTY_MAP[exp.id] ?? {
              label: "Medium",
              color: "#f59e0b",
            };
            const isSelected = selectedExperiment?.id === exp.id;
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => onSelectExperiment(exp)}
                data-ocid={`ncert-lab.experiment_item.${i + 1}`}
                className="w-full text-left rounded-lg px-3 py-2.5 transition-all duration-200"
                style={{
                  background: isSelected
                    ? "rgba(0,212,255,0.1)"
                    : "rgba(255,255,255,0.03)",
                  border: isSelected
                    ? "1px solid rgba(0,212,255,0.4)"
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isSelected
                    ? "0 0 12px rgba(0,212,255,0.15)"
                    : "none",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="text-xs font-medium leading-tight"
                    style={{
                      color: isSelected ? "#00d4ff" : "rgba(255,255,255,0.8)",
                    }}
                  >
                    {i + 1}. {exp.name}
                  </span>
                  <span
                    className="text-xs shrink-0 px-1.5 py-0.5 rounded"
                    style={{
                      color: diff.color,
                      background: `${diff.color}18`,
                      border: `1px solid ${diff.color}30`,
                    }}
                  >
                    {diff.label}
                  </span>
                </div>
                <p
                  className="text-xs mt-1 leading-relaxed line-clamp-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {exp.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment shelf */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(17,24,39,0.8)",
          border: "1px solid rgba(168,85,247,0.12)",
        }}
      >
        <h3
          className="text-sm font-semibold mb-3 tracking-widest uppercase"
          style={{ color: "#a855f7" }}
        >
          Lab Shelf
        </h3>
        {selectedExperiment && (
          <p
            className="text-xs mb-3 italic"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Glowing items are required for this experiment
          </p>
        )}
        <div
          className="grid grid-cols-3 gap-2"
          data-ocid="ncert-lab.equipment_shelf"
        >
          {SHELF_ITEMS.map((item) => {
            const highlighted = isHighlighted(item.id);
            return (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center rounded-lg py-2 px-1 transition-all duration-300"
                style={{
                  background: highlighted
                    ? "rgba(0,212,255,0.1)"
                    : "rgba(255,255,255,0.03)",
                  border: highlighted
                    ? "1px solid rgba(0,212,255,0.4)"
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: highlighted
                    ? "0 0 10px rgba(0,212,255,0.25), inset 0 0 8px rgba(0,212,255,0.08)"
                    : "none",
                }}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span
                  className="text-center leading-tight"
                  style={{
                    color: highlighted ? "#00d4ff" : "rgba(255,255,255,0.45)",
                    fontSize: "9px",
                    lineHeight: "1.2",
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Required items list */}
      {selectedExperiment && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(17,24,39,0.8)",
            border: "1px solid rgba(34,197,94,0.15)",
          }}
        >
          <h3
            className="text-xs font-semibold mb-2 tracking-widest uppercase"
            style={{ color: "#22c55e" }}
          >
            Required Items
          </h3>
          <ul className="flex flex-col gap-1">
            {selectedExperiment.requiredItems.map((item) => (
              <li
                key={item}
                className="text-xs flex items-center gap-2"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                <span style={{ color: "#22c55e", fontSize: "8px" }}>●</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
