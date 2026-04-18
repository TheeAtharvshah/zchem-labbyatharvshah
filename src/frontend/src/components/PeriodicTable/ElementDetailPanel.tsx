import { useCallback, useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store/appStore";
import type { Element } from "../../types/chemistry";
import { getCategoryLabel, getCategoryTextColor } from "./ElementBlock";

interface ElementDetailPanelProps {
  element: Element | null;
  onClose: () => void;
}

type TabId = "overview" | "properties" | "info";

function BohrModel({ element }: { element: Element }) {
  const svgSize = 180;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const nucleusR = 14;
  const firstShellR = 28;
  const shellSpacing = 22;
  const electronR = 4;

  const shells = element.shells;
  const color = getCategoryTextColor(element.category);

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      aria-label={`Bohr model of ${element.name}`}
      role="img"
      className="bohr-model-svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="nucleus-gradient" cx="40%" cy="35%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </radialGradient>
        {shells.map((_, si) => (
          <style key={`shell-anim-${element.atomicNumber}-s${si}`}>{`
            @keyframes shell-rotate-${element.atomicNumber}-${si} {
              from { transform: rotate(${si * 37}deg); }
              to { transform: rotate(${si % 2 === 0 ? 360 : -360}deg); }
            }
            .shell-group-${element.atomicNumber}-${si} {
              animation: shell-rotate-${element.atomicNumber}-${si} ${2.5 + si * 1.5}s linear infinite;
              transform-origin: ${cx}px ${cy}px;
            }
          `}</style>
        ))}
      </defs>

      {/* Shell rings */}
      {shells.map((_, si) => {
        const r = firstShellR + si * shellSpacing;
        return (
          <circle
            key={`ring-${element.atomicNumber}-s${si}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeOpacity={Math.max(0.05, 0.2 - si * 0.02)}
            strokeWidth={0.75}
            strokeDasharray={si > 1 ? "3 3" : undefined}
          />
        );
      })}

      {/* Electrons per shell */}
      {shells.map((count, si) => {
        const r = firstShellR + si * shellSpacing;
        const electrons = Array.from({ length: count }, (_, ei) => {
          const angle = (2 * Math.PI * ei) / count - Math.PI / 2;
          const ex = cx + r * Math.cos(angle);
          const ey = cy + r * Math.sin(angle);
          return { ex, ey, id: `${si}-${ei}` };
        });
        return (
          <g
            key={`electrons-${element.atomicNumber}-s${si}`}
            className={`shell-group-${element.atomicNumber}-${si}`}
          >
            {electrons.map(({ ex, ey, id }) => (
              <circle
                key={`e-${id}`}
                cx={ex}
                cy={ey}
                r={electronR}
                fill={color}
                opacity={0.85}
                style={{ filter: `drop-shadow(0 0 3px ${color})` }}
              />
            ))}
          </g>
        );
      })}

      {/* Nucleus */}
      <circle
        cx={cx}
        cy={cy}
        r={nucleusR}
        fill="url(#nucleus-gradient)"
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8"
        fill="white"
        fontWeight="bold"
        fontFamily="JetBrains Mono, monospace"
      >
        {element.atomicNumber}
      </text>
    </svg>
  );
}

function ShellDistribution({ shells }: { shells: number[] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {shells.map((count, i) => (
        <div
          key={`shell-dist-${i}-${count}`}
          className="flex items-center gap-1"
        >
          <div
            className="flex items-center justify-center rounded-full text-xs font-mono font-bold"
            style={{
              width: "28px",
              height: "28px",
              background: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.3)",
              color: "#00d4ff",
              fontSize: "11px",
            }}
          >
            {count}
          </div>
          {i < shells.length - 1 && (
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>
              ,
            </span>
          )}
        </div>
      ))}
      <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.4)" }}>
        electrons/shell
      </span>
    </div>
  );
}

function TempBar({
  value,
  min,
  max,
  label,
  color,
}: {
  value: number | null;
  min: number;
  max: number;
  label: string;
  color: string;
}) {
  if (value === null) return null;
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          {label}
        </span>
        <span className="text-xs font-mono font-bold" style={{ color }}>
          {value}°C
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 6px ${color}80`,
          }}
        />
      </div>
    </div>
  );
}

export default function ElementDetailPanel({
  element,
  onClose,
}: ElementDetailPanelProps) {
  const { favorites, toggleFavorite } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = element !== null;

  const isFavorite = element ? favorites.includes(element.atomicNumber) : false;
  const color = element ? getCategoryTextColor(element.category) : "#00d4ff";

  // Reset tab when element changes
  useEffect(() => {
    if (element) setActiveTab("overview");
  }, [element]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "properties", label: "Properties" },
    { id: "info", label: "Uses & Info" },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Enter" && onClose()}
          role="button"
          tabIndex={0}
          aria-label="Close element panel"
          data-ocid="element_detail.backdrop"
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        data-ocid="element_detail.panel"
        className="fixed top-0 right-0 h-full z-50 overflow-y-auto"
        style={{
          width: "min(380px, 100vw)",
          background: "rgba(11,15,26,0.97)",
          borderLeft: `1px solid ${color}30`,
          boxShadow: isOpen ? "-20px 0 60px rgba(0,0,0,0.6)" : "none",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
        aria-label={element ? `${element.name} details` : "Element details"}
      >
        {element && (
          <>
            {/* Header */}
            <div
              className="sticky top-0 z-10 px-5 pt-5 pb-4"
              style={{
                background: "rgba(11,15,26,0.97)",
                borderBottom: `1px solid ${color}20`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Symbol badge */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-2xl font-bold"
                    style={{
                      width: "64px",
                      height: "64px",
                      background: `${color}18`,
                      border: `2px solid ${color}50`,
                      color,
                      fontSize: "28px",
                      boxShadow: `0 0 20px ${color}30`,
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {element.symbol}
                  </div>

                  <div className="min-w-0">
                    <h2
                      className="text-xl font-bold truncate"
                      style={{ color }}
                    >
                      {element.name}
                    </h2>
                    <p
                      className="text-sm font-mono"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      #{element.atomicNumber} · {element.atomicMass} u
                    </p>
                    <span
                      className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: `${color}18`,
                        color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {getCategoryLabel(element.category)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Favorite */}
                  <button
                    type="button"
                    data-ocid="element_detail.favorite_button"
                    onClick={() => toggleFavorite(element.atomicNumber)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-smooth"
                    style={{
                      background: isFavorite
                        ? "rgba(234,179,8,0.2)"
                        : "rgba(255,255,255,0.05)",
                      border: `1px solid ${isFavorite ? "rgba(234,179,8,0.5)" : "rgba(255,255,255,0.1)"}`,
                      color: isFavorite ? "#eab308" : "rgba(255,255,255,0.4)",
                      fontSize: "16px",
                    }}
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    {isFavorite ? "★" : "☆"}
                  </button>

                  {/* Close */}
                  <button
                    type="button"
                    data-ocid="element_detail.close_button"
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-smooth"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "16px",
                    }}
                    aria-label="Close panel"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Bohr model */}
              <div className="mt-4 flex justify-center">
                <BohrModel element={element} />
              </div>

              {/* Tabs */}
              <div
                className="flex mt-4 rounded-xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    data-ocid={`element_detail.${tab.id}.tab`}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 py-2 text-xs font-semibold transition-smooth"
                    style={{
                      background:
                        activeTab === tab.id ? `${color}20` : "transparent",
                      color:
                        activeTab === tab.id ? color : "rgba(255,255,255,0.4)",
                      borderBottom:
                        activeTab === tab.id
                          ? `2px solid ${color}`
                          : "2px solid transparent",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="px-5 py-4">
              {activeTab === "overview" && (
                <div className="space-y-4 animate-fade-in-up">
                  <InfoRow
                    label="Atomic Mass"
                    value={`${element.atomicMass} u`}
                    color={color}
                  />
                  <InfoRow
                    label="State at Room Temp"
                    value={element.stateAtRT}
                    color={color}
                  />
                  <InfoRow
                    label="Electron Config"
                    value={element.electronConfig}
                    color={color}
                    mono
                  />
                  <InfoRow
                    label="Period / Group"
                    value={`Period ${element.period}${element.group ? ` · Group ${element.group}` : " · f-block"}`}
                    color={color}
                  />
                  <InfoRow
                    label="Block"
                    value={`${element.block.toUpperCase()}-block`}
                    color={color}
                  />

                  <div>
                    <span
                      className="text-xs mb-2 block"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      Shell Distribution
                    </span>
                    <ShellDistribution shells={element.shells} />
                  </div>
                </div>
              )}

              {activeTab === "properties" && (
                <div className="space-y-4 animate-fade-in-up">
                  <TempBar
                    value={element.meltingPoint}
                    min={-300}
                    max={4000}
                    label="Melting Point"
                    color="#00d4ff"
                  />
                  <TempBar
                    value={element.boilingPoint}
                    min={-300}
                    max={6000}
                    label="Boiling Point"
                    color="#a855f7"
                  />
                  <InfoRow
                    label="Melting Point"
                    value={
                      element.meltingPoint !== null
                        ? `${element.meltingPoint}°C`
                        : "N/A"
                    }
                    color={color}
                  />
                  <InfoRow
                    label="Boiling Point"
                    value={
                      element.boilingPoint !== null
                        ? `${element.boilingPoint}°C`
                        : "N/A"
                    }
                    color={color}
                  />
                </div>
              )}

              {activeTab === "info" && (
                <div className="space-y-5 animate-fade-in-up">
                  <InfoBlock
                    title="Uses"
                    icon="🔬"
                    content={element.uses}
                    color={color}
                  />
                  <InfoBlock
                    title="Fun Fact"
                    icon="⚡"
                    content={element.funFact}
                    color="#eab308"
                  />
                  <InfoBlock
                    title="Safety Info"
                    icon="⚠️"
                    content={element.safetyInfo}
                    color="#ef4444"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function InfoRow({
  label,
  value,
  color,
  mono = false,
}: {
  label: string;
  value: string;
  color: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span
        className="text-xs flex-shrink-0"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {label}
      </span>
      <span
        className={`text-xs font-semibold text-right${mono ? " font-mono" : ""}`}
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}

function InfoBlock({
  title,
  icon,
  content,
  color,
}: {
  title: string;
  icon: string;
  content: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}20`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span aria-hidden="true">{icon}</span>
        <span className="text-xs font-semibold" style={{ color }}>
          {title}
        </span>
      </div>
      <p
        className="text-xs leading-relaxed"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        {content}
      </p>
    </div>
  );
}
