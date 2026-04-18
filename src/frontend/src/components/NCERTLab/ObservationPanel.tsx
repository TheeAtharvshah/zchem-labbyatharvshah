import { useState } from "react";
import { useAppStore } from "../../store/appStore";
import type { Experiment } from "../../types/chemistry";

interface ObservationPanelProps {
  selectedExperiment: Experiment | null;
  currentStep: number;
  isRunning: boolean;
  isComplete: boolean;
  showTeacherNotes: boolean;
}

interface SectionProps {
  title: string;
  color: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  color,
  icon,
  children,
  defaultOpen = false,
}: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: `1px solid ${color}25`,
        background: "rgba(17,24,39,0.6)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 transition-all duration-200"
        style={{
          borderLeft: `3px solid ${color}`,
          background: open ? `${color}10` : "transparent",
        }}
      >
        <span
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color }}
        >
          <span>{icon}</span>
          {title}
        </span>
        <span
          className="text-xs transition-transform duration-200"
          style={{
            color: "rgba(255,255,255,0.3)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div
          className="px-4 pb-4 pt-3"
          style={{ borderTop: `1px solid ${color}15` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function ObservationPanel({
  selectedExperiment,
  currentStep,
  isRunning,
  isComplete,
  showTeacherNotes,
}: ObservationPanelProps) {
  const { addLabHistory } = useAppStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!selectedExperiment) return;
    addLabHistory({
      experimentName: selectedExperiment.name,
      result: selectedExperiment.observation,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!selectedExperiment) {
    return (
      <div
        className="rounded-xl flex flex-col items-center justify-center py-16"
        style={{
          background: "rgba(17,24,39,0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        data-ocid="ncert-lab.observation_panel.empty_state"
      >
        <div className="text-4xl mb-3 opacity-40">🔬</div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          Select an experiment and start to see observations
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-3"
      data-ocid="ncert-lab.observation_panel"
    >
      {/* Steps progress */}
      {isRunning && (
        <CollapsibleSection
          title="Procedure Steps"
          color="#00d4ff"
          icon="📋"
          defaultOpen
        >
          <ol className="flex flex-col gap-2">
            {selectedExperiment.steps.map((step, i) => (
              <li
                key={step.animation}
                className="flex items-start gap-3 text-xs leading-relaxed"
                style={{
                  color:
                    i < currentStep
                      ? "#22c55e"
                      : i === currentStep
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.3)",
                }}
              >
                <span
                  className="shrink-0 rounded-full flex items-center justify-center font-bold"
                  style={{
                    width: 20,
                    height: 20,
                    fontSize: 10,
                    background:
                      i < currentStep
                        ? "rgba(34,197,94,0.2)"
                        : i === currentStep
                          ? "rgba(0,212,255,0.2)"
                          : "rgba(255,255,255,0.05)",
                    border:
                      i < currentStep
                        ? "1px solid rgba(34,197,94,0.5)"
                        : i === currentStep
                          ? "1px solid rgba(0,212,255,0.5)"
                          : "1px solid rgba(255,255,255,0.1)",
                    color:
                      i < currentStep
                        ? "#22c55e"
                        : i === currentStep
                          ? "#00d4ff"
                          : "rgba(255,255,255,0.3)",
                  }}
                >
                  {i < currentStep ? "✓" : i + 1}
                </span>
                {step.instruction}
              </li>
            ))}
          </ol>
        </CollapsibleSection>
      )}

      {/* Observation */}
      <CollapsibleSection
        title="Observation"
        color="#22c55e"
        icon="👁"
        defaultOpen={isRunning}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {selectedExperiment.observation}
        </p>
      </CollapsibleSection>

      {/* Inference — shown only when complete */}
      {isComplete && (
        <CollapsibleSection
          title="Inference"
          color="#a855f7"
          icon="💡"
          defaultOpen
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {selectedExperiment.inference}
          </p>
        </CollapsibleSection>
      )}

      {/* Chemical Equation */}
      <CollapsibleSection
        title="Balanced Equation"
        color="#f59e0b"
        icon="⚗️"
        defaultOpen={isComplete}
      >
        <pre
          className="text-sm leading-relaxed whitespace-pre-wrap break-words"
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            color: "#fde68a",
            background: "rgba(245,158,11,0.08)",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          {selectedExperiment.equation}
        </pre>
      </CollapsibleSection>

      {/* Conclusion — only when complete */}
      {isComplete && (
        <CollapsibleSection
          title="Conclusion"
          color="#00d4ff"
          icon="📝"
          defaultOpen
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {selectedExperiment.conclusion}
          </p>
        </CollapsibleSection>
      )}

      {/* Safety Warning */}
      <CollapsibleSection
        title="Safety Warning"
        color="#ef4444"
        icon="⚠️"
        defaultOpen
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(255,200,200,0.85)" }}
        >
          {selectedExperiment.safetyWarning}
        </p>
      </CollapsibleSection>

      {/* Teacher Notes — conditional */}
      {showTeacherNotes && (
        <CollapsibleSection
          title="Teacher Notes"
          color="#a855f7"
          icon="👩‍🏫"
          defaultOpen
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {selectedExperiment.teacherNotes}
          </p>
        </CollapsibleSection>
      )}

      {/* Save to history */}
      {isRunning && (
        <button
          type="button"
          onClick={handleSave}
          data-ocid="ncert-lab.save_history_button"
          className="w-full py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-200"
          style={{
            background: saved
              ? "rgba(34,197,94,0.15)"
              : "rgba(168,85,247,0.12)",
            border: `1px solid ${saved ? "rgba(34,197,94,0.4)" : "rgba(168,85,247,0.35)"}`,
            color: saved ? "#22c55e" : "#a855f7",
            boxShadow: saved ? "0 0 12px rgba(34,197,94,0.2)" : "none",
          }}
        >
          {saved ? "✓ Saved to Lab Notebook!" : "💾 Save to Lab Notebook"}
        </button>
      )}
    </div>
  );
}
