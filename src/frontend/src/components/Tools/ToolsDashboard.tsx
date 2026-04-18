import { useState } from "react";
import EquationBalancer from "./EquationBalancer";
import MolarMassCalc from "./MolarMassCalc";
import PHCalculator from "./PHCalculator";
import UnitConverter from "./UnitConverter";

const TABS = [
  { id: "balancer", label: "Equation Balancer", icon: "⚖️", color: "#a855f7" },
  { id: "molar", label: "Molar Mass", icon: "⚗️", color: "#00d4ff" },
  { id: "ph", label: "pH Calculator", icon: "🧪", color: "#22c55e" },
  { id: "units", label: "Unit Converter", icon: "🔬", color: "#f59e0b" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ToolsDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("balancer");

  const activeTabInfo = TABS.find((t) => t.id === activeTab)!;

  return (
    <section
      id="tools"
      style={{ background: "rgba(17,24,39,0.5)" }}
      className="py-20 relative"
    >
      {/* Section Header */}
      <div className="max-w-screen-xl mx-auto px-6 mb-12 text-center">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
          style={{
            background: "rgba(168,85,247,0.12)",
            border: "1px solid rgba(168,85,247,0.3)",
            color: "#a855f7",
          }}
        >
          <span>⚗️</span> Chemistry Toolkit
        </div>
        <h2
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: "#ffffff" }}
        >
          Interactive{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #a855f7, #00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Chemistry Tools
          </span>
        </h2>
        <p
          className="text-base max-w-xl mx-auto"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Balance equations, calculate molar mass, test pH levels, and convert
          units — all in a premium science dashboard.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="max-w-screen-xl mx-auto px-6 mb-8">
        <div
          className="flex flex-wrap gap-2 p-2 rounded-2xl"
          style={{
            background: "rgba(15,23,42,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-ocid={`tools.${tab.id}.tab`}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{
                  background: isActive ? `${tab.color}22` : "transparent",
                  border: isActive
                    ? `1px solid ${tab.color}55`
                    : "1px solid transparent",
                  color: isActive ? tab.color : "rgba(255,255,255,0.45)",
                  boxShadow: isActive ? `0 0 16px ${tab.color}22` : "none",
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full ml-auto"
                    style={{ background: tab.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool Panel */}
      <div className="max-w-screen-xl mx-auto px-6">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(15,23,42,0.95)",
            border: `1px solid ${activeTabInfo.color}28`,
            boxShadow: `0 0 40px ${activeTabInfo.color}10`,
          }}
        >
          {/* Panel top bar */}
          <div
            className="flex items-center gap-3 px-6 py-4 border-b"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{
                background: `${activeTabInfo.color}18`,
                border: `1px solid ${activeTabInfo.color}33`,
              }}
            >
              {activeTabInfo.icon}
            </div>
            <h3
              className="font-semibold text-sm"
              style={{ color: activeTabInfo.color }}
            >
              {activeTabInfo.label}
            </h3>
            <div className="ml-auto flex gap-1.5">
              {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                <div
                  key={c}
                  className="w-3 h-3 rounded-full"
                  style={{ background: c, opacity: 0.7 }}
                />
              ))}
            </div>
          </div>

          {/* Tool content */}
          <div className="p-6">
            {activeTab === "balancer" && <EquationBalancer />}
            {activeTab === "molar" && <MolarMassCalc />}
            {activeTab === "ph" && <PHCalculator />}
            {activeTab === "units" && <UnitConverter />}
          </div>
        </div>
      </div>
    </section>
  );
}
