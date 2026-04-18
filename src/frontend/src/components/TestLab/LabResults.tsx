import type { LabHistoryEntry } from "../../store/appStore";
import type { Chemical } from "../../types/chemistry";

type IndicatorKey =
  | "blueLitmus"
  | "redLitmus"
  | "phenolphthalein"
  | "methylOrange"
  | "universalIndicator";

interface LabResultsProps {
  chemical: Chemical | null;
  indicator: IndicatorKey;
  testResult: string;
  notebook: LabHistoryEntry[];
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
}

const INDICATOR_LABELS: Record<IndicatorKey, string> = {
  blueLitmus: "Blue Litmus",
  redLitmus: "Red Litmus",
  phenolphthalein: "Phenolphthalein",
  methylOrange: "Methyl Orange",
  universalIndicator: "Universal Indicator",
};

function getExplanation(
  chemical: Chemical | null,
  indicator: IndicatorKey,
  result: string,
): string {
  if (!chemical || !result) return "";
  const type = chemical.type;
  const strength = chemical.strength;
  const name = chemical.name;
  const ph = chemical.ph;

  if (indicator === "blueLitmus") {
    if (type === "acid")
      return `${name} is a ${strength} acid (pH ~${ph}). Blue litmus paper turns red because acids contain H⁺ ions that neutralize the blue dye and cause the color change.`;
    return `${name} (pH ~${ph}) does not affect blue litmus. Only acids can turn blue litmus red.`;
  }
  if (indicator === "redLitmus") {
    if (type === "base")
      return `${name} is a ${strength} base (pH ~${ph}). Red litmus paper turns blue because bases contain OH⁻ ions that react with the red dye.`;
    return `${name} (pH ~${ph}) does not affect red litmus. Only bases can turn red litmus blue.`;
  }
  if (indicator === "phenolphthalein") {
    if (type === "base" || ph > 8)
      return `${name} is ${type === "base" ? "a base" : "alkaline"} (pH ~${ph}). Phenolphthalein turns pink/magenta in basic solutions due to the indicator's structural change at high pH.`;
    return `${name} (pH ~${ph}) keeps phenolphthalein colorless. This indicator only shows color in basic conditions (pH > 8).`;
  }
  if (indicator === "methylOrange") {
    if (type === "acid" || ph < 6)
      return `${name} is ${type === "acid" ? "an acid" : "acidic"} (pH ~${ph}). Methyl orange turns red in acidic solutions where H⁺ ions protonate the indicator molecule.`;
    return `${name} (pH ~${ph}) keeps methyl orange yellow/orange. This indicator turns red only in acidic conditions.`;
  }
  return `Universal indicator shows ${result} for ${name} at pH ${ph}. The indicator mixture changes color across the full pH scale from red (acidic) to violet (strongly basic).`;
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function LabResults({
  chemical,
  indicator,
  testResult,
  notebook,
  onDeleteEntry,
  onClearAll,
}: LabResultsProps) {
  const explanation = getExplanation(chemical, indicator, testResult);

  return (
    <div
      style={{
        background: "rgba(17,24,39,0.8)",
        border: "1px solid rgba(34,197,94,0.15)",
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
            color: "#22c55e",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Test Results
        </h3>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(34,197,94,0.3) transparent",
        }}
      >
        {/* Current test result */}
        <div
          style={{
            background: "rgba(0,0,0,0.25)",
            borderRadius: "12px",
            padding: "14px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Current Test
          </p>

          {chemical ? (
            <>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "baseline",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#00d4ff",
                  }}
                >
                  {chemical.formula}
                </span>
                <span
                  style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}
                >
                  pH {chemical.ph}
                </span>
              </div>

              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "8px",
                }}
              >
                {chemical.name}
              </p>

              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: "8px",
                  display: "flex",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "5px",
                    background: "rgba(168,85,247,0.12)",
                    border: "1px solid rgba(168,85,247,0.25)",
                    color: "#a855f7",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  {INDICATOR_LABELS[indicator]}
                </span>
              </div>

              {testResult ? (
                <>
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "rgba(34,197,94,0.08)",
                      border: "1px solid rgba(34,197,94,0.2)",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#22c55e",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      → {testResult}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.65,
                    }}
                    data-ocid="testlab.explanation"
                  >
                    {explanation}
                  </p>
                </>
              ) : (
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.25)",
                    fontStyle: "italic",
                  }}
                >
                  Click "Test" to run the experiment
                </p>
              )}

              {/* Safety warning */}
              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  fontSize: "10px",
                  color: "rgba(239,68,68,0.7)",
                  lineHeight: 1.5,
                }}
              >
                ⚠ {chemical.safetyWarning.substring(0, 80)}…
              </div>
            </>
          ) : (
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.25)",
                fontStyle: "italic",
              }}
              data-ocid="testlab.results.empty_state"
            >
              No chemical selected. Choose a chemical from the left panel.
            </p>
          )}
        </div>

        {/* Lab Notebook */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Lab Notebook ({notebook.length})
            </p>
            {notebook.length > 0 && (
              <button
                type="button"
                data-ocid="testlab.clear_notebook_button"
                onClick={onClearAll}
                style={{
                  fontSize: "10px",
                  color: "rgba(239,68,68,0.6)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  transition: "color 0.2s",
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {notebook.length === 0 ? (
            <div
              data-ocid="testlab.notebook.empty_state"
              style={{
                textAlign: "center",
                padding: "20px 0",
                fontSize: "12px",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              📓 No saved tests yet
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {notebook.map((entry, i) => (
                <div
                  key={entry.id}
                  data-ocid={`testlab.notebook.item.${i + 1}`}
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: "8px",
                    padding: "9px 11px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#00d4ff",
                        marginBottom: "2px",
                        fontFamily: "'JetBrains Mono', monospace",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {entry.experimentName}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.4)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {entry.result}
                    </p>
                    <p
                      style={{
                        fontSize: "9px",
                        color: "rgba(255,255,255,0.2)",
                        marginTop: "2px",
                      }}
                    >
                      {formatTimestamp(entry.timestamp)}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid={`testlab.delete_button.${i + 1}`}
                    onClick={() => onDeleteEntry(entry.id)}
                    style={{
                      color: "rgba(239,68,68,0.5)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      padding: "2px",
                      flexShrink: 0,
                      lineHeight: 1,
                      transition: "color 0.2s",
                    }}
                    aria-label="Delete entry"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
