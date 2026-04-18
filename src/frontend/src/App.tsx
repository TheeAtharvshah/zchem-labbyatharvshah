import { useEffect, useRef } from "react";
import About from "./components/About/About";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import NCERTLab from "./components/NCERTLab/NCERTLab";
import Navbar from "./components/Navbar";
import PeriodicTable from "./components/PeriodicTable/PeriodicTable";
import Preloader from "./components/Preloader";
import Simulations from "./components/Simulations/Simulations";
import TestLab from "./components/TestLab/TestLab";
import ToolsDashboard from "./components/Tools/ToolsDashboard";
import WorksheetGenerator from "./components/Worksheet/WorksheetGenerator";
import { useAppStore } from "./store/appStore";

function ParticleBackground() {
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
      alpha: number;
    }> = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.15 + 0.04,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37,99,235,${p.alpha})`;
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
      id="particle-canvas"
      aria-label="Decorative particle animation"
    />
  );
}

export default function App() {
  const { theme, searchQuery } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div
      style={{
        background: "#f0f4ff",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <ParticleBackground />

      <Preloader />
      <Navbar />

      <main>
        <section id="home">
          <Hero />
        </section>

        <section id="periodic-table">
          <PeriodicTable searchQuery={searchQuery} />
        </section>

        <section id="tools">
          <ToolsDashboard />
        </section>

        <Simulations />

        <section id="test-lab">
          <TestLab />
        </section>

        <section id="ncert-lab">
          <NCERTLab />
        </section>

        <WorksheetGenerator />

        <About />
      </main>

      <Footer />
    </div>
  );
}
