import { useState } from "react";
import { chemicalData } from "../../data/chemicals";
import { useAppStore } from "../../store/appStore";
import type { Chemical } from "../../types/chemistry";
import ChemicalSelector from "./ChemicalSelector";
import LabBench from "./LabBench";
import LabResults from "./LabResults";
import QuizMode from "./QuizMode";

type IndicatorKey =
  | "blueLitmus"
  | "redLitmus"
  | "phenolphthalein"
  | "methylOrange"
  | "universalIndicator";

export default function TestLab() {
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(
    null,
  );
  const [indicator, setIndicator] = useState<IndicatorKey>("blueLitmus");
  const [testResult, setTestResult] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  const { labHistory, addLabHistory, clearLabHistory } = useAppStore();

  const handleTestComplete = (result: string) => {
    setTestResult(result);
  };

  const handleSaveNotebook = () => {
    if (!selectedChemical || !testResult) return;
    addLabHistory({
      experimentName: `${selectedChemical.formula} — ${indicator === "blueLitmus" ? "Blue Litmus" : indicator === "redLitmus" ? "Red Litmus" : indicator === "phenolphthalein" ? "Phenolphthalein" : indicator === "methylOrange" ? "Methyl Orange" : "Universal Indicator"}`,
      result: testResult,
    });
  };

  const handleDeleteEntry = (id: string) => {
    const currentHistory = useAppStore.getState().labHistory;
    useAppStore.setState({
      labHistory: currentHistory.filter((e) => e.id !== id),
    });
  };

  return (
    <>
      <section
        id="test-lab"
        style={{
          background:
            "linear-gradient(180deg, #0b0f1a 0%, rgba(17,24,39,0.6) 50%, #0b0f1a 100%)",
          padding: "80px 0 60px",
          position: "relative",
        }}
      >
        {/* Section divider */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)",
          }}
        />

        <div className="max-w-screen-xl mx-auto" style={{ padding: "0 20px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: "20px",
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                fontSize: "11px",
                fontWeight: 700,
                color: "#22c55e",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Interactive Experiment
            </div>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 40px)",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "10px",
                lineHeight: 1.15,
              }}
            >
              Virtual Chemistry{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #22c55e, #00d4ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Test Lab
              </span>
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.45)",
                maxWidth: "520px",
                margin: "0 auto 20px",
                lineHeight: 1.65,
              }}
            >
              Select chemicals and indicators, run litmus tests with animated
              simulations, and save results to your lab notebook.
            </p>

            {/* Quiz button */}
            <button
              type="button"
              data-ocid="testlab.quiz_open_button"
              onClick={() => setShowQuiz(true)}
              style={{
                padding: "9px 22px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                border: "1px solid rgba(168,85,247,0.5)",
                background: "rgba(168,85,247,0.12)",
                color: "#a855f7",
                transition: "all 0.2s",
                letterSpacing: "0.04em",
              }}
            >
              🎯 Quiz Mode
            </button>
          </div>

          {/* Three-panel layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 1fr)",
              gap: "16px",
              alignItems: "start",
            }}
            className="lab-grid"
          >
            {/* Left: Chemical Selector */}
            <div style={{ minHeight: "580px" }}>
              <ChemicalSelector
                chemicals={chemicalData}
                selected={selectedChemical}
                onSelect={(c) => {
                  setSelectedChemical(c);
                  setTestResult("");
                }}
              />
            </div>

            {/* Center: Lab Bench */}
            <LabBench
              chemical={selectedChemical}
              indicator={indicator}
              onIndicatorChange={(ind) => {
                setIndicator(ind);
                setTestResult("");
              }}
              onTestComplete={handleTestComplete}
              onSaveNotebook={handleSaveNotebook}
            />

            {/* Right: Results */}
            <div style={{ minHeight: "580px" }}>
              <LabResults
                chemical={selectedChemical}
                indicator={indicator}
                testResult={testResult}
                notebook={labHistory}
                onDeleteEntry={handleDeleteEntry}
                onClearAll={clearLabHistory}
              />
            </div>
          </div>

          {/* Indicator reference table */}
          <div
            style={{
              marginTop: "32px",
              background: "rgba(17,24,39,0.6)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "20px",
              overflowX: "auto",
            }}
          >
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Quick Reference — Indicator Color Changes
            </h4>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <thead>
                <tr>
                  {["Indicator", "Acid", "Base", "Neutral"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        textAlign: "left",
                        color: "rgba(255,255,255,0.35)",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        fontWeight: 700,
                        fontSize: "11px",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Blue Litmus",
                    acid: "Red",
                    base: "No Change",
                    neutral: "No Change",
                  },
                  {
                    name: "Red Litmus",
                    acid: "No Change",
                    base: "Blue",
                    neutral: "No Change",
                  },
                  {
                    name: "Phenolphthalein",
                    acid: "Colorless",
                    base: "Pink/Magenta",
                    neutral: "Colorless",
                  },
                  {
                    name: "Methyl Orange",
                    acid: "Red",
                    base: "Yellow",
                    neutral: "Orange",
                  },
                  {
                    name: "Universal",
                    acid: "Red-Orange",
                    base: "Blue-Purple",
                    neutral: "Green",
                  },
                ].map((row) => (
                  <tr
                    key={row.name}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <td
                      style={{
                        padding: "8px 12px",
                        color: "rgba(255,255,255,0.7)",
                        fontWeight: 600,
                      }}
                    >
                      {row.name}
                    </td>
                    <td style={{ padding: "8px 12px", color: "#ef4444" }}>
                      {row.acid}
                    </td>
                    <td style={{ padding: "8px 12px", color: "#3b82f6" }}>
                      {row.base}
                    </td>
                    <td
                      style={{
                        padding: "8px 12px",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {row.neutral}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .lab-grid {
              grid-template-columns: 1fr !important;
            }
          }
          @media (max-width: 600px) {
            .lab-grid > div {
              min-height: auto !important;
            }
          }
        `}</style>
      </section>

      {showQuiz && <QuizMode onClose={() => setShowQuiz(false)} />}
    </>
  );
}
