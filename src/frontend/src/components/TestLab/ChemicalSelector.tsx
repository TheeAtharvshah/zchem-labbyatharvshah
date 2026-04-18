import { useState } from "react";
import type { Chemical, ChemicalType } from "../../types/chemistry";

interface ChemicalSelectorProps {
  chemicals: Chemical[];
  selected: Chemical | null;
  onSelect: (chemical: Chemical) => void;
}

const TYPE_COLORS: Record<
  ChemicalType,
  { bg: string; border: string; text: string; label: string }
> = {
  acid: {
    bg: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.5)",
    text: "#ef4444",
    label: "Acid",
  },
  base: {
    bg: "rgba(0,212,255,0.15)",
    border: "rgba(0,212,255,0.5)",
    text: "#00d4ff",
    label: "Base",
  },
  salt: {
    bg: "rgba(34,197,94,0.15)",
    border: "rgba(34,197,94,0.5)",
    text: "#22c55e",
    label: "Salt",
  },
  neutral: {
    bg: "rgba(148,163,184,0.15)",
    border: "rgba(148,163,184,0.4)",
    text: "#94a3b8",
    label: "Neutral",
  },
};

export default function ChemicalSelector({
  chemicals,
  selected,
  onSelect,
}: ChemicalSelectorProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ChemicalType | "all">("all");

  const filtered = chemicals.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.formula.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || c.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div
      style={{
        background: "rgba(17,24,39,0.8)",
        border: "1px solid rgba(0,212,255,0.15)",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <h3
          style={{
            color: "#00d4ff",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            marginBottom: "10px",
            textTransform: "uppercase",
          }}
        >
          Chemical Selector
        </h3>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or formula..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="testlab.search_input"
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: "8px",
            padding: "7px 12px",
            color: "#fff",
            fontSize: "12px",
            marginBottom: "10px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {(["all", "acid", "base", "salt", "neutral"] as const).map((type) => (
            <button
              key={type}
              type="button"
              data-ocid={`testlab.filter_${type}`}
              onClick={() => setFilterType(type)}
              style={{
                padding: "3px 9px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                border:
                  filterType === type
                    ? `1px solid ${type === "all" ? "#a855f7" : TYPE_COLORS[type as ChemicalType].text}`
                    : "1px solid rgba(255,255,255,0.1)",
                background:
                  filterType === type
                    ? type === "all"
                      ? "rgba(168,85,247,0.2)"
                      : TYPE_COLORS[type as ChemicalType].bg
                    : "transparent",
                color:
                  filterType === type
                    ? type === "all"
                      ? "#a855f7"
                      : TYPE_COLORS[type as ChemicalType].text
                    : "rgba(255,255,255,0.4)",
                transition: "all 0.2s",
              }}
            >
              {type === "all" ? "All" : TYPE_COLORS[type as ChemicalType].label}
            </button>
          ))}
        </div>
      </div>

      {/* Chemical list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,212,255,0.3) transparent",
        }}
      >
        {filtered.length === 0 ? (
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              textAlign: "center",
              fontSize: "12px",
              padding: "20px 0",
            }}
          >
            No chemicals found
          </p>
        ) : (
          filtered.map((c, i) => {
            const tc = TYPE_COLORS[c.type];
            const isSelected = selected?.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                data-ocid={`testlab.chemical.${i + 1}`}
                onClick={() => onSelect(c)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: isSelected
                    ? "rgba(0,212,255,0.08)"
                    : "transparent",
                  border: isSelected
                    ? "1px solid rgba(0,212,255,0.4)"
                    : "1px solid transparent",
                  borderRadius: "10px",
                  padding: "9px 11px",
                  marginBottom: "4px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  boxShadow: isSelected
                    ? "0 0 10px rgba(0,212,255,0.1)"
                    : "none",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: isSelected ? "#00d4ff" : "#fff",
                      }}
                    >
                      {c.formula}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.name}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "4px",
                    background: tc.bg,
                    border: `1px solid ${tc.border}`,
                    color: tc.text,
                    letterSpacing: "0.06em",
                    flexShrink: 0,
                  }}
                >
                  {tc.label.toUpperCase()}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Selected chemical info */}
      {selected && (
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.2)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
              marginBottom: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "16px",
                fontWeight: 700,
                color: "#00d4ff",
              }}
            >
              {selected.formula}
            </span>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: "5px",
                fontSize: "10px",
                fontWeight: 700,
                background: TYPE_COLORS[selected.type].bg,
                border: `1px solid ${TYPE_COLORS[selected.type].border}`,
                color: TYPE_COLORS[selected.type].text,
              }}
            >
              {TYPE_COLORS[selected.type].label.toUpperCase()} ·{" "}
              {selected.strength.toUpperCase()}
            </span>
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "4px",
            }}
          >
            {selected.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.45)",
              marginBottom: "6px",
            }}
          >
            <span>pH:</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color:
                  selected.ph < 7
                    ? "#ef4444"
                    : selected.ph > 7
                      ? "#00d4ff"
                      : "#22c55e",
                fontWeight: 600,
              }}
            >
              {selected.ph}
            </span>
          </div>
          <p
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.5,
            }}
          >
            {selected.uses.split(",").slice(0, 2).join(",")}
          </p>
        </div>
      )}
    </div>
  );
}
