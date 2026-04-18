import type { Experiment } from "../../types/chemistry";

interface LabBenchProps {
  selectedExperiment: Experiment | null;
  currentStep: number;
  isRunning: boolean;
  burnerOn: boolean;
  onStart: () => void;
  onNext: () => void;
  onReset: () => void;
}

// Returns a CSS animation/visual descriptor for experiment + step combos
function ExperimentVisual({
  experimentId,
  step,
  burnerOn,
}: {
  experimentId: string;
  step: number;
  isRunning: boolean;
  burnerOn: boolean;
}) {
  if (experimentId === "exp-1") {
    // CuSO4: step 0-1 = blue crystal, 2-3 = heating, 4 = white, 5 = blue again
    const phase =
      step <= 1
        ? "blue"
        : step <= 3
          ? "heating"
          : step === 4
            ? "white"
            : "blue-again";
    return (
      <div className="flex flex-col items-center justify-end h-full gap-3 pb-6">
        <style>{`
          @keyframes bubble-rise { 0%{transform:translateY(0);opacity:0.8} 100%{transform:translateY(-60px);opacity:0} }
          .bubble { animation: bubble-rise 1.2s ease-out infinite; }
          .bubble:nth-child(2){animation-delay:0.4s;}
          .bubble:nth-child(3){animation-delay:0.8s;}
          @keyframes crystal-glow { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.4)} }
        `}</style>
        {/* Test tube */}
        <div
          className="relative flex flex-col items-center"
          style={{ width: 60 }}
        >
          {/* Crystal inside */}
          <div
            className="rounded-sm mx-auto mb-1 transition-all duration-1000"
            style={{
              width: 28,
              height: 28,
              background:
                phase === "white"
                  ? "linear-gradient(135deg, #e5e7eb, #f9fafb)"
                  : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              boxShadow:
                phase === "blue" || phase === "blue-again"
                  ? "0 0 12px rgba(59,130,246,0.6)"
                  : phase === "white"
                    ? "0 0 12px rgba(255,255,255,0.4)"
                    : "0 0 18px rgba(59,130,246,0.3)",
              animation:
                phase === "heating" ? "crystal-glow 0.6s infinite" : "none",
            }}
          />
          {/* Heat steam when heating */}
          {phase === "heating" && burnerOn && (
            <div
              className="absolute -top-8 flex gap-2"
              style={{ left: "50%", transform: "translateX(-50%)" }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bubble rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    background: "rgba(255,255,255,0.3)",
                    animationDelay: `${i * 0.35}s`,
                  }}
                />
              ))}
            </div>
          )}
          {/* Tube body */}
          <div
            className="rounded-b-full"
            style={{
              width: 40,
              height: 60,
              border: "2px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.04)",
            }}
          />
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          {phase === "blue" && "Blue CuSO₄·5H₂O crystals"}
          {phase === "heating" && "Heating... water being lost"}
          {phase === "white" && "White anhydrous CuSO₄"}
          {phase === "blue-again" && "Blue color restored with water!"}
        </p>
      </div>
    );
  }

  if (experimentId === "exp-2") {
    // FeSO4: green → brown + gas
    const phase = step <= 1 ? "green" : step <= 3 ? "heating" : "brown";
    return (
      <div className="flex flex-col items-center justify-end h-full gap-3 pb-6">
        <style>{`
          @keyframes gas-rise { 0%{transform:translateY(0) scale(1);opacity:0.7} 100%{transform:translateY(-70px) scale(1.5);opacity:0} }
          .gas-bubble { animation: gas-rise 1s ease-out infinite; }
          .gas-bubble:nth-child(2){animation-delay:0.33s;}
          .gas-bubble:nth-child(3){animation-delay:0.66s;}
        `}</style>
        <div
          className="relative flex flex-col items-center"
          style={{ width: 60 }}
        >
          {(phase === "heating" || phase === "brown") && (
            <div
              className="absolute flex gap-1.5"
              style={{ top: -50, left: "50%", transform: "translateX(-50%)" }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="gas-bubble rounded-full"
                  style={{
                    width: 10,
                    height: 10,
                    background: "rgba(234,179,8,0.5)",
                    border: "1px solid rgba(234,179,8,0.6)",
                    animationDelay: `${i * 0.33}s`,
                  }}
                />
              ))}
            </div>
          )}
          <div
            className="rounded-sm transition-all duration-1500"
            style={{
              width: 32,
              height: 32,
              background:
                phase === "green"
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : "linear-gradient(135deg, #92400e, #b45309)",
              boxShadow:
                phase === "green"
                  ? "0 0 12px rgba(34,197,94,0.5)"
                  : "0 0 12px rgba(180,83,9,0.5)",
            }}
          />
          <div
            className="rounded-b-full mt-1"
            style={{
              width: 40,
              height: 60,
              border: "2px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.04)",
            }}
          />
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          {phase === "green" && "Green FeSO₄·7H₂O crystals"}
          {phase === "heating" && "Decomposing... SO₂ released"}
          {phase === "brown" && "Brown Fe₂O₃ residue"}
        </p>
      </div>
    );
  }

  if (experimentId === "exp-3") {
    // Baking soda: white powder → CO2 bubbles → lime water milky
    const phase =
      step <= 1
        ? "setup"
        : step <= 3
          ? "bubbling"
          : step === 4
            ? "milky"
            : "clear";
    return (
      <div className="flex flex-col items-center justify-end h-full gap-3 pb-4">
        <style>{`
          @keyframes co2-rise { 0%{transform:translateY(0);opacity:0.9} 100%{transform:translateY(-50px);opacity:0} }
          .co2-b { animation: co2-rise 0.9s ease-out infinite; }
          .co2-b:nth-child(2){animation-delay:0.3s;} .co2-b:nth-child(3){animation-delay:0.6s;}
        `}</style>
        <div className="flex items-end gap-4">
          {/* Source tube (baking soda) */}
          <div className="flex flex-col items-center relative">
            <div
              style={{
                width: 36,
                height: 50,
                borderRadius: "0 0 18px 18px",
                border: "2px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                position: "relative",
                overflow: "visible",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 4,
                  left: 4,
                  right: 4,
                  height: 20,
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: 4,
                }}
              />
              {phase !== "setup" && (
                <div
                  className="absolute flex flex-col items-center gap-0.5"
                  style={{
                    top: -40,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="co2-b rounded-full"
                      style={{
                        width: 8,
                        height: 8,
                        background: "rgba(255,255,255,0.4)",
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}
            >
              NaHCO₃
            </p>
          </div>
          {/* Arrow */}
          <div
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 20,
              marginBottom: 14,
            }}
          >
            →
          </div>
          {/* Lime water tube */}
          <div className="flex flex-col items-center">
            <div
              style={{
                width: 36,
                height: 50,
                borderRadius: "0 0 18px 18px",
                border: "2px solid rgba(255,255,255,0.2)",
                background:
                  phase === "milky"
                    ? "rgba(240,240,230,0.4)"
                    : phase === "clear"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(220,255,220,0.08)",
                transition: "background 0.8s ease",
              }}
            />
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}
            >
              {phase === "milky" ? "Milky!" : "Ca(OH)₂"}
            </p>
          </div>
        </div>
        <p
          className="text-xs text-center"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {phase === "setup" && "Setup with delivery tube"}
          {phase === "bubbling" && "CO₂ bubbles forming"}
          {phase === "milky" && "Lime water turns milky (CaCO₃)"}
          {phase === "clear" && "Excess CO₂ clears solution"}
        </p>
      </div>
    );
  }

  if (experimentId === "exp-4") {
    // Zinc + HCl: bubbles
    const phase =
      step === 0 ? "zinc" : step <= 2 ? "reaction" : step <= 4 ? "test" : "pop";
    return (
      <div className="flex flex-col items-center justify-end h-full gap-3 pb-6">
        <style>{`
          @keyframes h2-rise { 0%{transform:translateY(0) scale(0.8);opacity:1} 100%{transform:translateY(-80px) scale(1.4);opacity:0} }
          .h2-b { animation: h2-rise 0.7s ease-out infinite; }
          .h2-b:nth-child(2){animation-delay:0.18s;} .h2-b:nth-child(3){animation-delay:0.35s;} .h2-b:nth-child(4){animation-delay:0.53s;}
          @keyframes flash { 0%,100%{opacity:0} 50%{opacity:1} }
        `}</style>
        <div className="relative flex flex-col items-center">
          {phase !== "zinc" && (
            <div
              className="absolute flex gap-1"
              style={{ top: -55, left: "50%", transform: "translateX(-50%)" }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h2-b rounded-full"
                  style={{
                    width: 7,
                    height: 7,
                    background: "rgba(0,212,255,0.6)",
                    border: "1px solid rgba(0,212,255,0.8)",
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              ))}
            </div>
          )}
          {phase === "pop" && (
            <div
              className="absolute"
              style={{
                top: -75,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 20,
                animation: "flash 0.6s 3",
              }}
            >
              💥
            </div>
          )}
          {/* Beaker */}
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "0 0 12px 12px",
              border: "2px solid rgba(255,255,255,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Liquid */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "65%",
                background:
                  phase === "zinc" ? "transparent" : "rgba(0,212,255,0.12)",
                transition: "background 0.5s",
              }}
            />
            {/* Zinc granules */}
            {["zinc", "reaction"].includes(phase) && (
              <div
                className="absolute"
                style={{
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 3,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: "#9ca3af",
                      border: "1px solid #d1d5db",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          {phase === "zinc" && "Zinc granules in test tube"}
          {phase === "reaction" && "HCl added — H₂ bubbles forming!"}
          {phase === "test" && "Collecting gas..."}
          {phase === "pop" && "POP! Hydrogen confirmed ✓"}
        </p>
      </div>
    );
  }

  if (experimentId === "exp-5") {
    // Mg ribbon: silver → white flash → white ash
    const phase = step <= 1 ? "ribbon" : step <= 3 ? "burning" : "ash";
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <style>{`
          @keyframes mg-burn { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.08)} }
          @keyframes white-flash { 0%{opacity:0;transform:scale(0.5)} 30%{opacity:1;transform:scale(1.5)} 100%{opacity:0.3;transform:scale(1.2)} }
          .mg-flame { animation: mg-burn 0.15s ease-in-out infinite; }
          .white-flash { animation: white-flash 0.8s ease-out forwards; }
        `}</style>
        {phase === "ribbon" && (
          <div className="flex flex-col items-center gap-2">
            <div
              style={{
                width: 6,
                height: 80,
                background: "linear-gradient(to bottom, #d1d5db, #9ca3af)",
                borderRadius: 3,
                boxShadow: "0 0 8px rgba(156,163,175,0.5)",
              }}
            />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Magnesium ribbon
            </p>
          </div>
        )}
        {phase === "burning" && (
          <div className="flex flex-col items-center gap-2">
            <div
              className="mg-flame"
              style={{
                width: 60,
                height: 60,
                borderRadius: "50% 50% 30% 30%",
                background:
                  "radial-gradient(circle, #ffffff 20%, #fffde7 50%, #ffd600 80%)",
                boxShadow:
                  "0 0 30px 15px rgba(255,255,200,0.7), 0 0 60px 30px rgba(255,230,0,0.4)",
              }}
            />
            <p className="text-xs" style={{ color: "#fde68a" }}>
              Burning intensely — DO NOT look directly!
            </p>
          </div>
        )}
        {phase === "ash" && (
          <div className="flex flex-col items-center gap-2">
            <div
              style={{
                width: 50,
                height: 14,
                background: "rgba(255,255,255,0.7)",
                borderRadius: 4,
                boxShadow: "0 0 10px rgba(255,255,255,0.3)",
              }}
            />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              White MgO powder formed
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
        Select an experiment to begin
      </p>
    </div>
  );
}

export default function LabBench({
  selectedExperiment,
  currentStep,
  isRunning,
  burnerOn,
  onStart,
  onNext,
  onReset,
}: LabBenchProps) {
  const totalSteps = selectedExperiment?.steps.length ?? 0;
  const isComplete = isRunning && currentStep >= totalSteps - 1;
  const needsBurner = selectedExperiment?.requiredItems.some((r) =>
    r.toLowerCase().includes("burner"),
  );

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: "rgba(11,15,26,0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      data-ocid="ncert-lab.bench"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-semibold tracking-wider uppercase"
          style={{ color: "#a855f7" }}
        >
          Lab Bench
        </h3>
        {selectedExperiment && (
          <span
            className="text-xs px-2 py-1 rounded"
            style={{
              color: isRunning ? "#22c55e" : "rgba(255,255,255,0.35)",
              background: isRunning
                ? "rgba(34,197,94,0.12)"
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${isRunning ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {isRunning
              ? isComplete
                ? "✓ Complete"
                : `Step ${currentStep + 1}/${totalSteps}`
              : "Ready"}
          </span>
        )}
      </div>

      {/* Experiment name */}
      {selectedExperiment && (
        <div
          className="px-3 py-2 rounded-lg"
          style={{
            background: "rgba(0,212,255,0.05)",
            border: "1px solid rgba(0,212,255,0.1)",
          }}
        >
          <p className="text-xs font-medium" style={{ color: "#00d4ff" }}>
            {selectedExperiment.name}
          </p>
        </div>
      )}

      {/* Animation stage */}
      <div
        className="rounded-xl relative overflow-hidden"
        style={{
          width: "100%",
          height: 300,
          background: "rgba(5,8,18,0.95)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Lab bench surface line */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 3, background: "rgba(255,255,255,0.05)" }}
        />

        {/* Grid dots pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <ExperimentVisual
          experimentId={selectedExperiment?.id ?? ""}
          step={currentStep}
          isRunning={isRunning}
          burnerOn={burnerOn}
        />
      </div>

      {/* Burner reminder */}
      {needsBurner && isRunning && !burnerOn && currentStep >= 2 && (
        <div
          className="px-3 py-2 rounded-lg flex items-center gap-2"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
          data-ocid="ncert-lab.burner_reminder"
        >
          <span>🔥</span>
          <p className="text-xs" style={{ color: "#ef4444" }}>
            Turn on the Bunsen burner for this step!
          </p>
        </div>
      )}

      {/* Step stepper */}
      {selectedExperiment && isRunning && (
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {selectedExperiment.steps.map((step, i) => (
            <div
              key={step.animation}
              className="flex-shrink-0 rounded-full transition-all duration-300"
              style={{
                width: i === currentStep ? 24 : 10,
                height: 10,
                background:
                  i < currentStep
                    ? "#22c55e"
                    : i === currentStep
                      ? "#00d4ff"
                      : "rgba(255,255,255,0.1)",
                boxShadow:
                  i === currentStep ? "0 0 8px rgba(0,212,255,0.5)" : "none",
              }}
            />
          ))}
        </div>
      )}

      {/* Current step instruction */}
      {selectedExperiment && isRunning && (
        <div
          className="px-4 py-3 rounded-lg"
          style={{
            background: "rgba(0,212,255,0.06)",
            border: "1px solid rgba(0,212,255,0.15)",
          }}
        >
          <p className="text-xs mb-1" style={{ color: "rgba(0,212,255,0.6)" }}>
            Step {currentStep + 1}
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {selectedExperiment.steps[currentStep]?.instruction}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            type="button"
            onClick={onStart}
            disabled={!selectedExperiment}
            data-ocid="ncert-lab.start_button"
            className="flex-1 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-200"
            style={{
              background: selectedExperiment
                ? "linear-gradient(135deg, #00d4ff22, #00d4ff18)"
                : "rgba(255,255,255,0.04)",
              border: selectedExperiment
                ? "1px solid rgba(0,212,255,0.4)"
                : "1px solid rgba(255,255,255,0.08)",
              color: selectedExperiment ? "#00d4ff" : "rgba(255,255,255,0.25)",
              boxShadow: selectedExperiment
                ? "0 0 16px rgba(0,212,255,0.15)"
                : "none",
              cursor: selectedExperiment ? "pointer" : "not-allowed",
            }}
          >
            ▶ Start Experiment
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onNext}
              disabled={isComplete}
              data-ocid="ncert-lab.next_step_button"
              className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200"
              style={{
                background: isComplete
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(168,85,247,0.15)",
                border: isComplete
                  ? "1px solid rgba(34,197,94,0.3)"
                  : "1px solid rgba(168,85,247,0.4)",
                color: isComplete ? "#22c55e" : "#a855f7",
                cursor: isComplete ? "default" : "pointer",
              }}
            >
              {isComplete ? "✓ Done" : "Next Step →"}
            </button>
            <button
              type="button"
              onClick={onReset}
              data-ocid="ncert-lab.reset_button"
              className="px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#ef4444",
              }}
            >
              ↺ Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
