interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const FEATURES: FeatureCard[] = [
  {
    icon: "⚗️",
    title: "Interactive Periodic Table",
    description:
      "All 118 elements with Bohr models, electron config, properties, and animations.",
    color: "#2563eb",
    bgColor: "rgba(37,99,235,0.07)",
  },
  {
    icon: "🔬",
    title: "Chemistry Tools",
    description:
      "Equation balancer, molar mass calculator, pH meter, unit converter, and more.",
    color: "#0891b2",
    bgColor: "rgba(8,145,178,0.07)",
  },
  {
    icon: "🧪",
    title: "Virtual Test Lab",
    description:
      "Litmus indicator tests with animated color changes and indicator quiz mode.",
    color: "#3b82f6",
    bgColor: "rgba(59,130,246,0.07)",
  },
  {
    icon: "🔥",
    title: "NCERT Experiments",
    description:
      "10 step-by-step NCERT experiments with burner simulation and observations.",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.07)",
  },
  {
    icon: "📋",
    title: "Worksheet Generator",
    description:
      "Printable worksheets with balancing equations, symbols, valency, and more.",
    color: "#ef4444",
    bgColor: "rgba(239,68,68,0.07)",
  },
  {
    icon: "📡",
    title: "Offline Ready",
    description:
      "All data embedded in JavaScript — works without any internet connection.",
    color: "#0369a1",
    bgColor: "rgba(3,105,161,0.07)",
  },
];

const STATS = [
  { value: "118", label: "Elements", color: "#2563eb" },
  { value: "10+", label: "Tools", color: "#0891b2" },
  { value: "10", label: "NCERT Experiments", color: "#3b82f6" },
  { value: "100%", label: "Offline", color: "#f59e0b" },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-20 relative"
      style={{
        background: "linear-gradient(180deg, #f0f4ff 0%, #e8f0fe 100%)",
      }}
    >
      <div className="neon-blob-blue absolute top-0 left-1/2 -translate-x-1/2 opacity-15 animate-blob pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-2">
            <span
              className="text-4xl font-black tracking-tight"
              style={{ color: "#1d4ed8" }}
            >
              ZChemistry
            </span>
            <span
              className="text-4xl font-black tracking-tight ml-2"
              style={{ color: "#0891b2" }}
            >
              Lab
            </span>
          </div>
          <p
            className="text-sm font-semibold tracking-wider mb-5"
            style={{ color: "#6b9ce8" }}
          >
            by Atharv Shah
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-xs font-semibold tracking-wider uppercase"
            style={{
              background: "rgba(37,99,235,0.07)",
              border: "1px solid rgba(37,99,235,0.2)",
              color: "#2563eb",
            }}
          >
            ℹ️ About This Platform
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-blue-purple">
            Built for Chemistry Learners
          </h2>
          <p
            className="text-base leading-relaxed max-w-2xl mx-auto"
            style={{ color: "#475569" }}
          >
            A premium interactive chemistry learning platform for students,
            teachers, and chemistry enthusiasts. Designed for NCERT Class 9–10
            curriculum with a clean, modern UI and zero setup required —
            everything works offline.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5 text-center hover-glow transition-smooth"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: `1px solid ${stat.color}22`,
                backdropFilter: "blur(16px)",
                boxShadow: "0 4px 16px rgba(37,99,235,0.06)",
              }}
            >
              <div
                className="text-3xl font-black font-mono mb-1"
                style={{
                  color: stat.color,
                  textShadow: `0 0 20px ${stat.color}44`,
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "#64748b" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              data-ocid={`about.feature_${feat.title.toLowerCase().replace(/\s+/g, "_")}.card`}
              className="rounded-2xl p-5 flex gap-4 hover-glow transition-smooth group"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: `1px solid ${feat.color}20`,
                backdropFilter: "blur(12px)",
                boxShadow: "0 2px 12px rgba(37,99,235,0.05)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-smooth group-hover:scale-110"
                style={{
                  background: feat.bgColor,
                  border: `1px solid ${feat.color}25`,
                }}
              >
                {feat.icon}
              </div>
              <div>
                <h3
                  className="text-sm font-bold mb-1.5"
                  style={{ color: feat.color }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#64748b" }}
                >
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Audience note */}
        <div
          className="mt-12 rounded-2xl p-6 text-center"
          style={{
            background: "rgba(8,145,178,0.06)",
            border: "1px solid rgba(8,145,178,0.2)",
          }}
        >
          <p className="text-sm" style={{ color: "#334155" }}>
            🎓 Designed for{" "}
            <span style={{ color: "#0891b2", fontWeight: 600 }}>
              NCERT Class 9–10
            </span>{" "}
            students and teachers. All chemical data follows NCERT curriculum
            guidelines.{" "}
            <span style={{ color: "#64748b" }}>
              No login, no ads, no tracking — just pure chemistry learning.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
