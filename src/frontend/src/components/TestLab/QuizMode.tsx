import { useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "What happens when NaOH is added to red litmus?",
    options: ["Turns blue", "Turns red", "No change", "Turns yellow"],
    correct: 0,
    explanation:
      "NaOH is a strong base. Bases turn red litmus blue due to OH⁻ ions.",
  },
  {
    question: "What color does phenolphthalein show in an acid?",
    options: ["Pink", "Colorless", "Blue", "Red"],
    correct: 1,
    explanation:
      "Phenolphthalein remains colorless in acidic and neutral solutions. It only turns pink in bases.",
  },
  {
    question: "HCl turns blue litmus what color?",
    options: ["Blue", "Green", "Red", "Yellow"],
    correct: 2,
    explanation:
      "HCl is a strong acid. Acids turn blue litmus red due to H⁺ ions.",
  },
  {
    question: "Which indicator turns pink/magenta in a base?",
    options: [
      "Methyl Orange",
      "Blue Litmus",
      "Phenolphthalein",
      "Universal Indicator",
    ],
    correct: 2,
    explanation:
      "Phenolphthalein is the classic indicator that turns pink/magenta in basic solutions.",
  },
  {
    question: "What does methyl orange do in an acid?",
    options: ["Turns blue", "Turns red", "Remains yellow", "Turns green"],
    correct: 1,
    explanation:
      "Methyl orange turns red in acidic solutions (pH < 3.1) where H⁺ ions are present.",
  },
  {
    question: "What is the approximate pH of Distilled Water?",
    options: ["1", "7", "14", "0"],
    correct: 1,
    explanation:
      "Distilled water is neutral with a pH of exactly 7 — equal concentrations of H⁺ and OH⁻.",
  },
  {
    question: "Which chemical makes universal indicator turn purple?",
    options: ["HCl (pH 1)", "NaCl (pH 7)", "NaOH (pH 13)", "CH₃COOH (pH 3)"],
    correct: 2,
    explanation:
      "Universal indicator turns purple/violet at high pH (>11–12). NaOH has pH 13.",
  },
  {
    question: "What does red litmus do when tested with lemon juice?",
    options: ["Turns blue", "Turns red", "No change", "Turns orange"],
    correct: 2,
    explanation:
      "Lemon juice is acidic (pH ~2.5), but red litmus only changes in a base. So it shows no change.",
  },
  {
    question: "Baking soda (NaHCO₃) turns phenolphthalein what color?",
    options: ["Colorless", "Red", "Slight pink", "Dark purple"],
    correct: 2,
    explanation:
      "NaHCO₃ is mildly alkaline (pH ~8.5) — phenolphthalein shows a slight pink in weak bases.",
  },
  {
    question: "Which of these is a strong base?",
    options: ["NH₄OH", "NaOH", "Ca(OH)₂", "Soap solution"],
    correct: 1,
    explanation:
      "NaOH (sodium hydroxide) is a strong base — it fully dissociates in water giving high pH ~13.",
  },
];

interface QuizModeProps {
  onClose: () => void;
}

export default function QuizMode({ onClose }: QuizModeProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const q = QUIZ_QUESTIONS[current];
  const isCorrect = selected === q.correct;
  const total = QUIZ_QUESTIONS.length;

  const handleOption = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore((s) => s + 1);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setShowExplanation(false);
  };

  const progressPct = (current / total) * 100;

  return (
    <div
      data-ocid="testlab.quiz.dialog"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        style={{
          background: "rgba(17,24,39,0.98)",
          border: "1px solid rgba(168,85,247,0.4)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "520px",
          padding: "28px",
          position: "relative",
          boxShadow:
            "0 0 60px rgba(168,85,247,0.15), 0 24px 48px rgba(0,0,0,0.5)",
          animation: "scaleIn 0.3s ease",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          data-ocid="testlab.quiz.close_button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            transition: "all 0.2s",
          }}
          aria-label="Close quiz"
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#a855f7",
              marginBottom: "4px",
            }}
          >
            🧪 Quiz Mode
          </h2>
          {!finished && (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
              Question {current + 1} of {total}
            </p>
          )}
        </div>

        {/* Progress bar */}
        {!finished && (
          <div
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "2px",
              marginBottom: "22px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #a855f7, #00d4ff)",
                borderRadius: "2px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        )}

        {finished ? (
          /* Final score screen */
          <div
            style={{ textAlign: "center", padding: "20px 0" }}
            data-ocid="testlab.quiz.score_panel"
          >
            <div
              style={{
                fontSize: "56px",
                marginBottom: "12px",
                animation: "popIn 0.5s ease",
              }}
            >
              {score >= total * 0.8 ? "🏆" : score >= total * 0.5 ? "⭐" : "🔬"}
            </div>
            <h3
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "6px",
              }}
            >
              {score}/{total} Correct
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "24px",
              }}
            >
              {score >= total * 0.8
                ? "Excellent! You mastered indicators!"
                : score >= total * 0.5
                  ? "Good job! Keep practicing chemistry."
                  : "Keep studying — you'll get it next time!"}
            </p>

            {/* Score bar */}
            <div
              style={{
                height: "8px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "4px",
                marginBottom: "24px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(score / total) * 100}%`,
                  background:
                    score >= total * 0.8
                      ? "#22c55e"
                      : score >= total * 0.5
                        ? "#a855f7"
                        : "#ef4444",
                  borderRadius: "4px",
                  transition: "width 1s ease",
                }}
              />
            </div>

            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                type="button"
                data-ocid="testlab.quiz.restart_button"
                onClick={handleRestart}
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid rgba(168,85,247,0.5)",
                  background: "rgba(168,85,247,0.15)",
                  color: "#a855f7",
                  transition: "all 0.2s",
                }}
              >
                ↺ Try Again
              </button>
              <button
                type="button"
                data-ocid="testlab.quiz.close_button"
                onClick={onClose}
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.5)",
                  transition: "all 0.2s",
                }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Question */
          <div>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#fff",
                lineHeight: 1.55,
                marginBottom: "20px",
              }}
            >
              {q.question}
            </p>

            {/* Options */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "18px",
              }}
            >
              {q.options.map((opt, idx) => {
                const isChosen = selected === idx;
                const isRight = idx === q.correct;
                let bg = "rgba(255,255,255,0.04)";
                let border = "1px solid rgba(255,255,255,0.1)";
                let color = "rgba(255,255,255,0.75)";

                if (selected !== null) {
                  if (isRight) {
                    bg = "rgba(34,197,94,0.12)";
                    border = "1px solid rgba(34,197,94,0.5)";
                    color = "#22c55e";
                  } else if (isChosen && !isRight) {
                    bg = "rgba(239,68,68,0.1)";
                    border = "1px solid rgba(239,68,68,0.4)";
                    color = "#ef4444";
                  }
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    data-ocid={`testlab.quiz.option.${idx + 1}`}
                    onClick={() => handleOption(idx)}
                    disabled={selected !== null}
                    style={{
                      textAlign: "left",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      cursor: selected !== null ? "default" : "pointer",
                      background: bg,
                      border,
                      color,
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "6px",
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        flexShrink: 0,
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                    {selected !== null && isRight && (
                      <span style={{ marginLeft: "auto", color: "#22c55e" }}>
                        ✓
                      </span>
                    )}
                    {selected !== null && isChosen && !isRight && (
                      <span style={{ marginLeft: "auto", color: "#ef4444" }}>
                        ✗
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div
                data-ocid="testlab.quiz.feedback"
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: isCorrect
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(239,68,68,0.08)",
                  border: `1px solid ${isCorrect ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                  marginBottom: "16px",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: isCorrect ? "#22c55e" : "#ef4444",
                    marginBottom: "4px",
                  }}
                >
                  {isCorrect ? "✓ Correct!" : "✗ Not quite..."}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.55,
                  }}
                >
                  {q.explanation}
                </p>
              </div>
            )}

            {/* Score + Next */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Score: {score}/{current}
              </span>
              {selected !== null && (
                <button
                  type="button"
                  data-ocid="testlab.quiz.next_button"
                  onClick={handleNext}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1px solid rgba(0,212,255,0.5)",
                    background: "rgba(0,212,255,0.12)",
                    color: "#00d4ff",
                    transition: "all 0.2s",
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  {current + 1 >= total ? "See Results →" : "Next →"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
