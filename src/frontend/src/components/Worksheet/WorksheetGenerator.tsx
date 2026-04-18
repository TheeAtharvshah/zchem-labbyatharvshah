import { useEffect, useState } from "react";
import { worksheetQuestions } from "../../data/worksheets";
import type {
  AtomicNumberQuestion,
  BalancingEquationQuestion,
  Difficulty,
  ElementSymbolQuestion,
  ReactionTypeQuestion,
  ValencyQuestion,
} from "../../types/chemistry";

type WorksheetType =
  | "balancingEquations"
  | "elementSymbols"
  | "atomicNumbers"
  | "valency"
  | "reactionTypes";

type QuestionCount = 10 | 20 | 30 | 50;

type GeneratedQuestion = {
  id: string;
  text: string;
  answer: string;
  hint?: string;
};

const WORKSHEET_TYPES: { value: WorksheetType; label: string }[] = [
  { value: "balancingEquations", label: "Balancing Equations" },
  { value: "elementSymbols", label: "Element Symbols" },
  { value: "atomicNumbers", label: "Atomic Numbers" },
  { value: "valency", label: "Valency" },
  { value: "reactionTypes", label: "Reaction Types" },
];

const COUNTS: QuestionCount[] = [10, 20, 30, 50];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateQuestions(
  type: WorksheetType,
  difficulty: Difficulty,
  count: QuestionCount,
): GeneratedQuestion[] {
  let pool: GeneratedQuestion[] = [];

  if (type === "balancingEquations") {
    const filtered = worksheetQuestions.balancingEquations.filter(
      (q: BalancingEquationQuestion) => q.difficulty === difficulty,
    );
    pool = filtered.map((q: BalancingEquationQuestion, i: number) => ({
      id: `be-${i}`,
      text: `Balance the equation: ${q.question}`,
      answer: q.answer,
      hint: q.hint,
    }));
  } else if (type === "elementSymbols") {
    const filtered = worksheetQuestions.elementSymbols.filter(
      (q: ElementSymbolQuestion) => q.difficulty === difficulty,
    );
    pool = filtered.map((q: ElementSymbolQuestion, i: number) => ({
      id: `es-${i}`,
      text: `Write the symbol for ${q.element}.`,
      answer: q.symbol,
    }));
  } else if (type === "atomicNumbers") {
    const filtered = worksheetQuestions.atomicNumbers.filter(
      (q: AtomicNumberQuestion) => q.difficulty === difficulty,
    );
    pool = filtered.map((q: AtomicNumberQuestion, i: number) => ({
      id: `an-${i}`,
      text: `What is the atomic number of ${q.element}?`,
      answer: String(q.atomicNumber),
    }));
  } else if (type === "valency") {
    const filtered = worksheetQuestions.valency.filter(
      (q: ValencyQuestion) => q.difficulty === difficulty,
    );
    pool = filtered.map((q: ValencyQuestion, i: number) => ({
      id: `vl-${i}`,
      text: `What is the valency of ${q.element}?`,
      answer: q.valency,
    }));
  } else {
    const filtered = worksheetQuestions.reactionTypes.filter(
      (q: ReactionTypeQuestion) => q.difficulty === difficulty,
    );
    pool = filtered.map((q: ReactionTypeQuestion, i: number) => ({
      id: `rt-${i}`,
      text: `Identify the type of reaction: ${q.equation}`,
      answer: q.type,
    }));
  }

  // If filtered pool is smaller than requested, use full pool
  if (pool.length < count) {
    const allPool = getAllPool(type);
    return shuffleArray(allPool).slice(0, Math.min(count, allPool.length));
  }

  return shuffleArray(pool).slice(0, count);
}

function getAllPool(type: WorksheetType): GeneratedQuestion[] {
  if (type === "balancingEquations") {
    return worksheetQuestions.balancingEquations.map(
      (q: BalancingEquationQuestion, i: number) => ({
        id: `be-all-${i}`,
        text: `Balance the equation: ${q.question}`,
        answer: q.answer,
        hint: q.hint,
      }),
    );
  }
  if (type === "elementSymbols") {
    return worksheetQuestions.elementSymbols.map(
      (q: ElementSymbolQuestion, i: number) => ({
        id: `es-all-${i}`,
        text: `Write the symbol for ${q.element}.`,
        answer: q.symbol,
      }),
    );
  }
  if (type === "atomicNumbers") {
    return worksheetQuestions.atomicNumbers.map(
      (q: AtomicNumberQuestion, i: number) => ({
        id: `an-all-${i}`,
        text: `What is the atomic number of ${q.element}?`,
        answer: String(q.atomicNumber),
      }),
    );
  }
  if (type === "valency") {
    return worksheetQuestions.valency.map((q: ValencyQuestion, i: number) => ({
      id: `vl-all-${i}`,
      text: `What is the valency of ${q.element}?`,
      answer: q.valency,
    }));
  }
  return worksheetQuestions.reactionTypes.map(
    (q: ReactionTypeQuestion, i: number) => ({
      id: `rt-all-${i}`,
      text: `Identify the type of reaction: ${q.equation}`,
      answer: q.type,
    }),
  );
}

function getInstructions(type: WorksheetType): string {
  if (type === "balancingEquations")
    return "Balance each chemical equation by adding appropriate coefficients. Do not change the subscripts.";
  if (type === "elementSymbols")
    return "Write the correct chemical symbol for each element listed below.";
  if (type === "atomicNumbers")
    return "Write the atomic number for each element. Atomic number = number of protons.";
  if (type === "valency")
    return "Write the valency of each element. Valency is the combining capacity of an atom.";
  return "Identify the type of chemical reaction for each equation given below.";
}

export default function WorksheetGenerator() {
  const [wsType, setWsType] = useState<WorksheetType>("balancingEquations");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [count, setCount] = useState<QuestionCount>(10);
  const [showAnswers, setShowAnswers] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("zchem_last_worksheet");
      if (saved) {
        const parsed = JSON.parse(saved) as {
          type: WorksheetType;
          difficulty: Difficulty;
          count: QuestionCount;
          showAnswers: boolean;
          questions: GeneratedQuestion[];
        };
        setWsType(parsed.type);
        setDifficulty(parsed.difficulty);
        setCount(parsed.count);
        setShowAnswers(parsed.showAnswers);
        setQuestions(parsed.questions);
        setGenerated(parsed.questions.length > 0);
      }
    } catch {}
  }, []);

  const handleGenerate = () => {
    const qs = generateQuestions(wsType, difficulty, count);
    setQuestions(qs);
    setGenerated(true);
    try {
      localStorage.setItem(
        "zchem_last_worksheet",
        JSON.stringify({
          type: wsType,
          difficulty,
          count,
          showAnswers,
          questions: qs,
        }),
      );
    } catch {}
  };

  const wsTypeLabel =
    WORKSHEET_TYPES.find((t) => t.value === wsType)?.label ?? "";
  const today = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      id="worksheet"
      className="py-20 relative"
      style={{ background: "#0b0f1a" }}
    >
      <div className="neon-blob-purple absolute top-10 right-0 opacity-20 animate-blob pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-xs font-semibold tracking-wider uppercase"
            style={{
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.2)",
              color: "#a855f7",
            }}
          >
            📋 Generator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gradient-purple-green">
            Worksheet Generator
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Generate printable chemistry worksheets for NCERT class 9–10
            students.
          </p>
        </div>

        {/* Control Panel */}
        <div
          className="rounded-2xl p-6 mb-8 no-print"
          style={{
            background: "rgba(15,23,42,0.8)",
            border: "1px solid rgba(168,85,247,0.2)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Worksheet type */}
            <div className="space-y-2">
              <label
                htmlFor="ws-type"
                className="text-xs font-semibold tracking-wider uppercase"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Worksheet Type
              </label>
              <select
                id="ws-type"
                data-ocid="worksheet.type_select"
                value={wsType}
                onChange={(e) => setWsType(e.target.value as WorksheetType)}
                className="w-full rounded-xl px-3 py-2.5 text-sm font-mono"
                style={{
                  background: "rgba(168,85,247,0.07)",
                  border: "1px solid rgba(168,85,247,0.25)",
                  color: "#e2e8f0",
                  outline: "none",
                }}
              >
                {WORKSHEET_TYPES.map((t) => (
                  <option
                    key={t.value}
                    value={t.value}
                    style={{ background: "#111827" }}
                  >
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <span
                className="text-xs font-semibold tracking-wider uppercase block"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Difficulty
              </span>
              <div className="flex gap-2">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                  <label
                    key={d}
                    htmlFor={`diff-${d}`}
                    className="flex items-center gap-1.5 cursor-pointer"
                    style={{
                      color:
                        difficulty === d ? "#a855f7" : "rgba(255,255,255,0.45)",
                      fontSize: "12px",
                    }}
                  >
                    <input
                      type="radio"
                      id={`diff-${d}`}
                      name="difficulty"
                      data-ocid={`worksheet.difficulty_${d}`}
                      checked={difficulty === d}
                      onChange={() => setDifficulty(d)}
                      className="accent-purple-500"
                    />
                    <span className="capitalize">{d}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Number of questions */}
            <div className="space-y-2">
              <span
                className="text-xs font-semibold tracking-wider uppercase block"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Questions
              </span>
              <div className="flex gap-2 flex-wrap">
                {COUNTS.map((c) => (
                  <label
                    key={c}
                    htmlFor={`count-${c}`}
                    className="flex items-center gap-1 cursor-pointer"
                    style={{
                      color: count === c ? "#22c55e" : "rgba(255,255,255,0.45)",
                      fontSize: "12px",
                    }}
                  >
                    <input
                      type="radio"
                      id={`count-${c}`}
                      name="count"
                      data-ocid={`worksheet.count_${c}`}
                      checked={count === c}
                      onChange={() => setCount(c)}
                      className="accent-green-500"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Include answers + Generate */}
            <div className="space-y-2">
              <span
                className="text-xs font-semibold tracking-wider uppercase block"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Options
              </span>
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  data-ocid="worksheet.answers_toggle"
                  role="switch"
                  aria-checked={showAnswers}
                  onClick={() => setShowAnswers((v) => !v)}
                  className="relative w-10 h-5 rounded-full transition-smooth"
                  style={{
                    background: showAnswers
                      ? "rgba(34,197,94,0.6)"
                      : "rgba(255,255,255,0.12)",
                    border: `1px solid ${showAnswers ? "rgba(34,197,94,0.8)" : "rgba(255,255,255,0.2)"}`,
                  }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-smooth"
                    style={{
                      background: showAnswers
                        ? "#22c55e"
                        : "rgba(255,255,255,0.5)",
                      transform: showAnswers
                        ? "translateX(20px)"
                        : "translateX(0)",
                    }}
                  />
                </button>
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Include Answers
                </span>
              </div>
              <button
                type="button"
                data-ocid="worksheet.generate_button"
                onClick={handleGenerate}
                className="w-full py-2.5 rounded-xl text-sm font-bold btn-neon-green"
              >
                Generate Worksheet
              </button>
            </div>
          </div>
        </div>

        {/* Worksheet Preview */}
        {generated && questions.length > 0 && (
          <div className="worksheet-print-area">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(168,85,247,0.2)" }}
            >
              {/* Print button bar */}
              <div
                className="flex items-center justify-between px-6 py-3 no-print"
                style={{
                  background: "rgba(168,85,247,0.08)",
                  borderBottom: "1px solid rgba(168,85,247,0.15)",
                }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#a855f7" }}
                >
                  {questions.length} questions · {difficulty} · {wsTypeLabel}
                </span>
                <button
                  type="button"
                  data-ocid="worksheet.print_button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold btn-neon-green"
                >
                  🖨️ Print / Save PDF
                </button>
              </div>

              {/* The actual printable sheet */}
              <div
                id="printable-worksheet"
                className="p-8"
                style={{ background: "white", color: "#111" }}
              >
                {/* Header */}
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "24px",
                    borderBottom: "2px solid #111",
                    paddingBottom: "16px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      letterSpacing: "2px",
                      color: "#0b0f1a",
                    }}
                  >
                    ZCHEM LAB — Chemistry Worksheet
                  </h1>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#444",
                      marginTop: "4px",
                    }}
                  >
                    {wsTypeLabel} ·{" "}
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}{" "}
                    Level · {today}
                  </p>
                </div>

                {/* Name/Date/Class */}
                <div
                  style={{ display: "flex", gap: "40px", marginBottom: "20px" }}
                >
                  {["Name", "Class", "Date"].map((f) => (
                    <div
                      key={f}
                      style={{
                        flex: 1,
                        borderBottom: "1px solid #aaa",
                        paddingBottom: "4px",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        {f}:{" "}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                <div
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "12px",
                    color: "#374151",
                  }}
                >
                  <strong>Instructions: </strong>
                  {getInstructions(wsType)}
                </div>

                {/* Questions */}
                <ol style={{ paddingLeft: "20px", margin: 0 }}>
                  {questions.map((q, idx) => (
                    <li
                      key={q.id}
                      style={{
                        marginBottom: "16px",
                        fontSize: "13px",
                        color: "#111",
                      }}
                      data-ocid={`worksheet.question.${idx + 1}`}
                    >
                      <span style={{ fontWeight: 600 }}>Q{idx + 1}.</span>{" "}
                      <span style={{ fontFamily: "monospace" }}>{q.text}</span>
                      <div
                        style={{
                          marginTop: "6px",
                          borderBottom: "1px dashed #ccc",
                          height: "20px",
                        }}
                      />
                    </li>
                  ))}
                </ol>

                {/* Answer Key */}
                {showAnswers && (
                  <div
                    style={{
                      marginTop: "32px",
                      borderTop: "2px dashed #999",
                      paddingTop: "16px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        marginBottom: "12px",
                        color: "#1e3a5f",
                      }}
                    >
                      Answer Key
                    </h2>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "6px",
                      }}
                    >
                      {questions.map((q, idx) => (
                        <div
                          key={`ans-${q.id}`}
                          style={{ fontSize: "12px", color: "#374151" }}
                        >
                          <strong>Q{idx + 1}:</strong>{" "}
                          <span
                            style={{
                              fontFamily: "monospace",
                              color: "#1d4ed8",
                            }}
                          >
                            {q.answer}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div
                  style={{
                    marginTop: "24px",
                    textAlign: "center",
                    fontSize: "11px",
                    color: "#999",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "12px",
                  }}
                >
                  Generated by ZCHEM LAB · Interactive Chemistry Platform · For
                  NCERT Class 9–10
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
