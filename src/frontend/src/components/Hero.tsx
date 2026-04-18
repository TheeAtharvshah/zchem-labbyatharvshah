import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

const SECTION_IDS = {
  periodicTable: "periodic-table",
  tools: "tools",
  ncertLab: "ncert-lab",
};

function scrollTo(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    // Blue palette for white background
    const COLORS = ["rgba(37,99,235,", "rgba(59,130,246,", "rgba(8,145,178,"];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.35 + 0.08,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw connecting lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `${p.color}${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
      style={{
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #dbeafe 100%)",
      }}
    >
      {/* Hero background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(/assets/generated/hero-chemistry.dim_1920x1080.jpg)",
          opacity: 0.08,
        }}
      />

      {/* Soft gradient blobs */}
      <div
        className="neon-blob-blue animate-blob"
        style={{ top: "-100px", left: "-100px" }}
        aria-hidden="true"
      />
      <div
        className="neon-blob-purple animate-blob"
        style={{ bottom: "-150px", right: "-100px", animationDelay: "3s" }}
        aria-hidden="true"
      />
      <div
        className="neon-blob-green animate-blob"
        style={{ top: "40%", right: "10%", animationDelay: "6s" }}
        aria-hidden="true"
      />

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Floating atom decorations */}
      <div
        className="absolute top-24 right-16 hidden xl:block"
        aria-hidden="true"
        style={{ opacity: 0.2 }}
      >
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border border-blue-400/40 animate-spin-slow" />
          <div
            className="absolute inset-4 rounded-full border border-sky-400/30"
            style={{ animation: "orbit-spin-2 4s linear infinite" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: "#2563eb",
                boxShadow: "0 0 10px rgba(37,99,235,0.6)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Brand name badge at top */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3"
        >
          <span
            className="text-sm font-semibold tracking-wide"
            style={{ color: "#6b9ce8" }}
          >
            by Atharv Shah
          </span>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 tracking-wider"
          style={{
            background: "rgba(37,99,235,0.07)",
            border: "1px solid rgba(37,99,235,0.2)",
            color: "#2563eb",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-neon" />
          PREMIUM SCIENCE LEARNING PLATFORM
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="text-gradient-blue-purple">
            Interactive Periodic Table
          </span>
          <br />
          <span style={{ color: "#0f172a" }}>& Chemistry</span>{" "}
          <span className="text-gradient-purple-green">Virtual Lab</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-base sm:text-lg mb-10 max-w-3xl mx-auto leading-relaxed"
          style={{ color: "#475569" }}
        >
          Explore all 118 elements, balance equations with Taraju, calculate
          molar mass, test acids and bases with litmus indicators, perform NCERT
          experiments with burner, and generate custom worksheets.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={() => scrollTo(SECTION_IDS.periodicTable)}
            data-ocid="hero.explore_table_button"
            className="btn-neon-blue px-8 py-3 rounded-xl text-sm font-semibold tracking-wide min-w-44"
          >
            ⚗️ Explore Table
          </button>

          <button
            type="button"
            onClick={() => scrollTo(SECTION_IDS.tools)}
            data-ocid="hero.open_tools_button"
            className="btn-neon-purple px-8 py-3 rounded-xl text-sm font-semibold tracking-wide min-w-44"
          >
            🔬 Open Tools
          </button>

          <button
            type="button"
            onClick={() => scrollTo(SECTION_IDS.ncertLab)}
            data-ocid="hero.start_ncert_lab_button"
            className="btn-neon-green px-8 py-3 rounded-xl text-sm font-semibold tracking-wide min-w-44"
          >
            🧪 Start NCERT Lab
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-14"
        >
          {[
            { value: "118", label: "Elements" },
            { value: "10+", label: "Chemistry Tools" },
            { value: "10", label: "NCERT Experiments" },
            { value: "5", label: "Lab Indicators" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#2563eb" }}>
                {stat.value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-0"
        onClick={() => scrollTo(SECTION_IDS.periodicTable)}
        aria-label="Scroll to periodic table"
      >
        <span className="text-xs tracking-widest" style={{ color: "#94a3b8" }}>
          SCROLL
        </span>
        <ChevronDown
          size={20}
          className="animate-scroll-bounce"
          style={{ color: "rgba(37,99,235,0.5)" }}
        />
      </motion.button>
    </section>
  );
}
