import { useCallback, useState } from "react";
import { elementData } from "../../data/elements";
import { useAppStore } from "../../store/appStore";
import type { Element, ElementCategory } from "../../types/chemistry";
import ElementBlock, {
  getCategoryTextColor,
  getCategoryLabel,
} from "./ElementBlock";
import ElementDetailPanel from "./ElementDetailPanel";

const ALL_CATEGORIES: ElementCategory[] = [
  "alkali-metal",
  "alkaline-earth-metal",
  "transition-metal",
  "post-transition-metal",
  "metalloid",
  "nonmetal",
  "halogen",
  "noble-gas",
  "lanthanide",
  "actinide",
];

interface PeriodicTableProps {
  searchQuery: string;
}

// Build a lookup map: {period}-{group} -> element (for main table, no lanthanides/actinides with null group)
// Lanthanides: period 6, null group — display at period 8, cols 3..17
// Actinides: period 7, null group — display at period 9, cols 3..17

type GridElement =
  | { type: "element"; element: Element }
  | { type: "placeholder"; label: string }
  | { type: "empty" };

function buildGrid(): GridElement[][] {
  // 9 display rows (1..7 + lanthanide row + actinide row), 18 cols
  const grid: GridElement[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 18 }, () => ({ type: "empty" }) as GridElement),
  );

  const lanthanides: Element[] = [];
  const actinides: Element[] = [];

  for (const el of elementData) {
    if (el.category === "lanthanide") {
      lanthanides.push(el);
    } else if (el.category === "actinide") {
      actinides.push(el);
    } else if (el.group !== null) {
      const row = el.period - 1; // 0-indexed
      const col = el.group - 1; // 0-indexed
      if (row >= 0 && row < 7 && col >= 0 && col < 18) {
        grid[row][col] = { type: "element", element: el };
      }
    }
  }

  // Placeholder cells at row 5 (period 6), col 2 and row 6 (period 7), col 2
  grid[5][2] = { type: "placeholder", label: "57–71" };
  grid[6][2] = { type: "placeholder", label: "89–103" };

  // Lanthanides at row 7 (display row 8), starting at col 2
  lanthanides.sort((a, b) => a.atomicNumber - b.atomicNumber);
  lanthanides.forEach((el, i) => {
    grid[7][2 + i] = { type: "element", element: el };
  });

  // Actinides at row 8 (display row 9), starting at col 2
  actinides.sort((a, b) => a.atomicNumber - b.atomicNumber);
  actinides.forEach((el, i) => {
    grid[8][2 + i] = { type: "element", element: el };
  });

  return grid;
}

const FLAT_CELLS: { cell: GridElement; row: number; col: number }[] =
  buildGrid().flatMap((row, ri) =>
    row.map((cell, ci) => ({ cell, row: ri, col: ci })),
  );

export default function PeriodicTable({ searchQuery }: PeriodicTableProps) {
  const { favorites, recentElements, addRecentElement } = useAppStore();
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [activeFilter, setActiveFilter] = useState<ElementCategory | null>(
    null,
  );

  const handleElementClick = useCallback(
    (element: Element) => {
      setSelectedElement(element);
      addRecentElement(element.atomicNumber);
    },
    [addRecentElement],
  );

  const handleClose = useCallback(() => {
    setSelectedElement(null);
  }, []);

  const elementByNumber = new Map(elementData.map((e) => [e.atomicNumber, e]));

  const recentEls = recentElements
    .map((n) => elementByNumber.get(n))
    .filter(Boolean) as Element[];
  const favoriteEls = favorites
    .map((n) => elementByNumber.get(n))
    .filter(Boolean) as Element[];

  // Effective search: if category filter active, override search logic
  const effectiveSearch = activeFilter
    ? `__category__${activeFilter}`
    : searchQuery;

  function matchesFilter(el: Element): boolean {
    if (activeFilter) return el.category === activeFilter;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      el.name.toLowerCase().includes(q) ||
      el.symbol.toLowerCase().includes(q) ||
      el.atomicNumber.toString() === q
    );
  }

  return (
    <section
      id="periodic-table"
      className="relative py-16 section-bg-alt"
      style={{ minHeight: "60vh" }}
    >
      {/* Decorative blobs */}
      <div
        className="neon-blob-blue animate-blob absolute pointer-events-none"
        style={{ top: "-100px", left: "-200px" }}
        aria-hidden="true"
      />
      <div
        className="neon-blob-purple animate-blob absolute pointer-events-none"
        style={{ bottom: "-100px", right: "-200px", animationDelay: "3s" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <span
            className="text-xs font-mono font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4 inline-block"
            style={{
              color: "#00d4ff",
              background: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.25)",
            }}
          >
            All 118 Elements
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient-blue-purple">
              Interactive Periodic Table
            </span>
          </h2>
          <p
            className="text-sm max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Click any element to explore its properties, Bohr model, electron
            configuration, and more.
          </p>
        </div>

        {/* Category legend */}
        <div
          className="flex flex-wrap gap-2 justify-center mb-6"
          data-ocid="periodic_table.category_legend"
        >
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat;
            const c = getCategoryTextColor(cat);
            return (
              <button
                key={cat}
                type="button"
                data-ocid={`periodic_table.filter.${cat}`}
                onClick={() => setActiveFilter(isActive ? null : cat)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-smooth"
                style={{
                  background: isActive ? `${c}28` : `${c}10`,
                  border: `1px solid ${isActive ? `${c}70` : `${c}30`}`,
                  color: c,
                  boxShadow: isActive ? `0 0 8px ${c}40` : "none",
                }}
              >
                {getCategoryLabel(cat)}
              </button>
            );
          })}
          {activeFilter && (
            <button
              type="button"
              data-ocid="periodic_table.clear_filter"
              onClick={() => setActiveFilter(null)}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-smooth"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Recent + Favorites bars */}
        {recentEls.length > 0 && (
          <div
            className="mb-5 glass-card p-3"
            data-ocid="periodic_table.recent_bar"
          >
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Recently Viewed
            </p>
            <div className="flex flex-wrap gap-2">
              {recentEls.slice(0, 8).map((el) => (
                <button
                  key={el.atomicNumber}
                  type="button"
                  data-ocid={`periodic_table.recent.${el.atomicNumber}`}
                  onClick={() => handleElementClick(el)}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-bold transition-smooth"
                  style={{
                    background: `${getCategoryTextColor(el.category)}18`,
                    border: `1px solid ${getCategoryTextColor(el.category)}35`,
                    color: getCategoryTextColor(el.category),
                  }}
                >
                  {el.symbol}
                  <span
                    className="ml-1 font-normal"
                    style={{ opacity: 0.6, fontSize: "10px" }}
                  >
                    {el.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {favoriteEls.length > 0 && (
          <div
            className="mb-5 glass-card-purple p-3"
            data-ocid="periodic_table.favorites_bar"
          >
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              ★ Favorites
            </p>
            <div className="flex flex-wrap gap-2">
              {favoriteEls.map((el) => (
                <button
                  key={el.atomicNumber}
                  type="button"
                  data-ocid={`periodic_table.favorite.${el.atomicNumber}`}
                  onClick={() => handleElementClick(el)}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-bold transition-smooth"
                  style={{
                    background: "rgba(234,179,8,0.12)",
                    border: "1px solid rgba(234,179,8,0.3)",
                    color: "#eab308",
                  }}
                >
                  {el.symbol}
                  <span
                    className="ml-1 font-normal"
                    style={{ opacity: 0.6, fontSize: "10px" }}
                  >
                    {el.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Table scroll wrapper */}
        <div
          className="overflow-x-auto pb-4"
          style={{ WebkitOverflowScrolling: "touch" }}
          data-ocid="periodic_table.grid"
        >
          <div
            className="periodic-table-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(18, var(--elem-w))",
              gridTemplateRows: "repeat(9, var(--elem-h))",
              gap: "var(--elem-gap)",
              minWidth: "calc(18 * var(--elem-w) + 17 * var(--elem-gap))",
            }}
          >
            {FLAT_CELLS.map(({ cell, row, col }) => {
              if (cell.type === "empty") {
                return (
                  <div
                    key={`empty-r${row}c${col}`}
                    style={{ gridColumn: col + 1, gridRow: row + 1 }}
                  />
                );
              }

              if (cell.type === "placeholder") {
                return (
                  <div
                    key={`ph-${cell.label}`}
                    className="flex items-center justify-center rounded-lg text-center"
                    style={{
                      gridColumn: col + 1,
                      gridRow: row + 1,
                      background: "rgba(236,72,153,0.06)",
                      border: "1px dashed rgba(236,72,153,0.25)",
                      color: "rgba(236,72,153,0.6)",
                      fontSize: "clamp(7px, 1.2vw, 10px)",
                      fontFamily: "JetBrains Mono, monospace",
                      lineHeight: 1.2,
                    }}
                  >
                    {cell.label}
                  </div>
                );
              }

              // cell.type === "element"
              const el = cell.element;
              const dim =
                activeFilter !== null
                  ? el.category !== activeFilter
                  : searchQuery.trim() !== "" && !matchesFilter(el);

              return (
                <div
                  key={`el-${el.atomicNumber}`}
                  style={{ gridColumn: col + 1, gridRow: row + 1 }}
                >
                  <ElementBlock
                    element={el}
                    isFavorite={favorites.includes(el.atomicNumber)}
                    searchQuery={activeFilter ? effectiveSearch : searchQuery}
                    isSelected={
                      selectedElement?.atomicNumber === el.atomicNumber
                    }
                    onElementClick={handleElementClick}
                    key={`elblock-${el.atomicNumber}`}
                  />
                  {dim && (
                    <style>{`
                      [data-ocid="element.item.${el.atomicNumber}"] { opacity: 0.2 !important; }
                    `}</style>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Separator between main table and f-block label */}
        <p
          className="text-center text-xs mt-3 mb-1"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          * Lanthanides (57–71) & Actinides (89–103) shown in rows below
        </p>
      </div>

      {/* Detail panel */}
      <ElementDetailPanel element={selectedElement} onClose={handleClose} />
    </section>
  );
}
