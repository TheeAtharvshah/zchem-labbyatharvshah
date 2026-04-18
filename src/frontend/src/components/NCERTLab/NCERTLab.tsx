import { useState } from "react";
import type { Experiment } from "../../types/chemistry";
import BunsenBurner from "./BunsenBurner";
import LabBench from "./LabBench";
import LabShelf from "./LabShelf";
import ObservationPanel from "./ObservationPanel";

type BurnerIntensity = "low" | "medium" | "high";

export default function NCERTLab() {
  const [selectedExperiment, setSelectedExperiment] =
    useState<Experiment | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [burnerOn, setBurnerOn] = useState(false);
  const [burnerIntensity, setBurnerIntensity] =
    useState<BurnerIntensity>("medium");
  const [showTeacherNotes, setShowTeacherNotes] = useState(false);

  const totalSteps = selectedExperiment?.steps.length ?? 0;
  const isComplete = isRunning && currentStep >= totalSteps - 1;

  const handleSelectExperiment = (exp: Experiment) => {
    setSelectedExperiment(exp);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const handleStart = () => {
    if (!selectedExperiment) return;
    setCurrentStep(0);
    setIsRunning(true);
  };

  const handleNext = () => {
    if (!selectedExperiment) return;
    if (currentStep < selectedExperiment.steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsRunning(false);
    setBurnerOn(false);
  };

  return (
    <section
      id="ncert-lab"
      className="min-h-screen py-16 px-4"
      style={{ background: "rgba(11,15,26,0.97)" }}
      data-ocid="ncert-lab.page"
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-semibold tracking-widest px-3 py-1 rounded-full uppercase"
                style={{
                  color: "#f59e0b",
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.25)",
                }}
              >
                NCERT Virtual Lab
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NCERT Virtual Chemistry Lab
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Perform NCERT experiments with Bunsen burner, observe reactions,
              and save your results
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowTeacherNotes((v) => !v)}
            data-ocid="ncert-lab.teacher_notes_toggle"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shrink-0"
            style={{
              background: showTeacherNotes
                ? "rgba(168,85,247,0.18)"
                : "rgba(255,255,255,0.05)",
              border: showTeacherNotes
                ? "1px solid rgba(168,85,247,0.45)"
                : "1px solid rgba(255,255,255,0.1)",
              color: showTeacherNotes ? "#a855f7" : "rgba(255,255,255,0.5)",
              boxShadow: showTeacherNotes
                ? "0 0 14px rgba(168,85,247,0.2)"
                : "none",
            }}
          >
            👩‍🏫 {showTeacherNotes ? "Hide" : "Show"} Teacher Notes
          </button>
        </div>

        {/* Lab Layout: Left | Center | Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-5">
          {/* LEFT: Shelf + Burner */}
          <div className="flex flex-col gap-5">
            {/* Burner */}
            <div
              className="rounded-xl p-5 flex flex-col items-center"
              style={{
                background: "rgba(17,24,39,0.8)",
                border: "1px solid rgba(249,115,22,0.2)",
              }}
              data-ocid="ncert-lab.burner_panel"
            >
              <h3
                className="text-xs font-semibold mb-4 tracking-widest uppercase self-start"
                style={{ color: "#f97316" }}
              >
                Bunsen Burner
              </h3>
              <BunsenBurner
                burnerOn={burnerOn}
                burnerIntensity={burnerIntensity}
                onToggle={() => setBurnerOn((v) => !v)}
                onIntensityChange={setBurnerIntensity}
              />
            </div>

            {/* Shelf */}
            <LabShelf
              selectedExperiment={selectedExperiment}
              onSelectExperiment={handleSelectExperiment}
            />
          </div>

          {/* CENTER: Lab Bench */}
          <LabBench
            selectedExperiment={selectedExperiment}
            currentStep={currentStep}
            isRunning={isRunning}
            burnerOn={burnerOn}
            onStart={handleStart}
            onNext={handleNext}
            onReset={handleReset}
          />

          {/* RIGHT: Observation Panel */}
          <div
            className="flex flex-col gap-4"
            data-ocid="ncert-lab.observations"
          >
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(17,24,39,0.8)",
                border: "1px solid rgba(34,197,94,0.12)",
              }}
            >
              <h3
                className="text-sm font-semibold mb-3 tracking-widest uppercase"
                style={{ color: "#22c55e" }}
              >
                Observations
              </h3>
              <ObservationPanel
                selectedExperiment={selectedExperiment}
                currentStep={currentStep}
                isRunning={isRunning}
                isComplete={isComplete}
                showTeacherNotes={showTeacherNotes}
              />
            </div>
          </div>
        </div>

        {/* Safety banner */}
        <div
          className="mt-8 px-5 py-4 rounded-xl flex items-start gap-3"
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <span className="text-lg">⚠️</span>
          <div>
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "#ef4444" }}
            >
              Laboratory Safety Guidelines
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(255,200,200,0.7)" }}
            >
              Always wear safety goggles. Work in a well-ventilated area. Never
              directly inhale chemical fumes. Keep a sand bucket nearby. Read
              the full safety warning before each experiment. This is a virtual
              simulation — actual chemistry experiments must be supervised by a
              qualified teacher.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
