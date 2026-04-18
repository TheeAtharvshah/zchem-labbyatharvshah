import type { Element, ElementCategory } from "../../types/chemistry";

interface ElementBlockProps {
  element: Element;
  isFavorite: boolean;
  searchQuery: string;
  isSelected: boolean;
  onElementClick: (element: Element) => void;
}

export function getCategoryClass(category: ElementCategory): string {
  const map: Record<ElementCategory, string> = {
    "alkali-metal": "elem-alkali",
    "alkaline-earth-metal": "elem-alkaline",
    "transition-metal": "elem-transition",
    "post-transition-metal": "elem-post-transition",
    metalloid: "elem-metalloid",
    nonmetal: "elem-nonmetal",
    halogen: "elem-halogen",
    "noble-gas": "elem-noble",
    lanthanide: "elem-lanthanide",
    actinide: "elem-actinide",
  };
  return map[category] ?? "elem-unknown";
}

export function getCategoryGlowColor(category: ElementCategory): string {
  const map: Record<ElementCategory, string> = {
    "alkali-metal": "rgba(239,68,68,0.6)",
    "alkaline-earth-metal": "rgba(249,115,22,0.6)",
    "transition-metal": "rgba(234,179,8,0.5)",
    "post-transition-metal": "rgba(34,197,94,0.5)",
    metalloid: "rgba(20,184,166,0.5)",
    nonmetal: "rgba(0,212,255,0.5)",
    halogen: "rgba(59,130,246,0.6)",
    "noble-gas": "rgba(168,85,247,0.6)",
    lanthanide: "rgba(236,72,153,0.5)",
    actinide: "rgba(239,68,68,0.4)",
  };
  return map[category] ?? "rgba(100,116,139,0.4)";
}

export function getCategoryTextColor(category: ElementCategory): string {
  const map: Record<ElementCategory, string> = {
    "alkali-metal": "#ef4444",
    "alkaline-earth-metal": "#f97316",
    "transition-metal": "#eab308",
    "post-transition-metal": "#22c55e",
    metalloid: "#14b8a6",
    nonmetal: "#00d4ff",
    halogen: "#3b82f6",
    "noble-gas": "#a855f7",
    lanthanide: "#ec4899",
    actinide: "#8b5cf6",
  };
  return map[category] ?? "#64748b";
}

export function getCategoryLabel(category: ElementCategory): string {
  const map: Record<ElementCategory, string> = {
    "alkali-metal": "Alkali Metal",
    "alkaline-earth-metal": "Alkaline Earth",
    "transition-metal": "Transition Metal",
    "post-transition-metal": "Post-Transition",
    metalloid: "Metalloid",
    nonmetal: "Nonmetal",
    halogen: "Halogen",
    "noble-gas": "Noble Gas",
    lanthanide: "Lanthanide",
    actinide: "Actinide",
  };
  return map[category] ?? "Unknown";
}

function matchesSearch(element: Element, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    element.name.toLowerCase().includes(q) ||
    element.symbol.toLowerCase().includes(q) ||
    element.atomicNumber.toString() === q
  );
}

export default function ElementBlock({
  element,
  isFavorite,
  searchQuery,
  isSelected,
  onElementClick,
}: ElementBlockProps) {
  const categoryClass = getCategoryClass(element.category);
  const glowColor = getCategoryGlowColor(element.category);
  const textColor = getCategoryTextColor(element.category);
  const matches = matchesSearch(element, searchQuery);
  const dimmed = searchQuery.trim() !== "" && !matches;

  return (
    <button
      type="button"
      data-ocid={`element.item.${element.atomicNumber}`}
      onClick={() => onElementClick(element)}
      title={`${element.symbol} — ${element.name} (${element.atomicMass})`}
      className={`element-block ${categoryClass} relative flex flex-col items-center justify-between cursor-pointer select-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-cyan-400`}
      style={{
        opacity: dimmed ? 0.2 : 1,
        transform: isSelected ? "scale(1.12)" : undefined,
        boxShadow: isSelected
          ? `0 0 0 2px ${textColor}, 0 0 16px ${glowColor}`
          : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            `0 0 12px ${glowColor}, 0 0 24px ${glowColor.replace("0.6", "0.3")}`;
          (e.currentTarget as HTMLElement).style.zIndex = "10";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLElement).style.transform = "";
          (e.currentTarget as HTMLElement).style.boxShadow = "";
          (e.currentTarget as HTMLElement).style.zIndex = "";
        }
      }}
    >
      {/* Atomic number */}
      <span
        className="element-atomic-number font-mono leading-none"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {element.atomicNumber}
      </span>

      {/* Symbol */}
      <span
        className="element-symbol font-bold leading-none"
        style={{ color: textColor }}
      >
        {element.symbol}
      </span>

      {/* Name */}
      <span
        className="element-name leading-none truncate w-full text-center"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {element.name}
      </span>

      {/* Favorite star */}
      {isFavorite && (
        <span
          className="absolute top-0.5 right-0.5 text-yellow-400 leading-none"
          style={{ fontSize: "7px" }}
          aria-label="Favorite"
        >
          ★
        </span>
      )}
    </button>
  );
}
