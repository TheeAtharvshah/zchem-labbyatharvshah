import { FlaskConical, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store/appStore";

const NAV_LINKS = [
  { label: "Home", section: "home" },
  { label: "Periodic Table", section: "periodic-table" },
  { label: "Tools", section: "tools" },
  { label: "Simulations", section: "simulations" },
  { label: "Virtual Test Lab", section: "test-lab" },
  { label: "NCERT Lab", section: "ncert-lab" },
  { label: "Worksheet", section: "worksheet" },
  { label: "About", section: "about" },
];

interface NavbarProps {
  onSearchChange?: (query: string) => void;
}

export default function Navbar({ onSearchChange }: NavbarProps) {
  const {
    theme,
    setTheme,
    activeSection,
    setActiveSection,
    searchQuery,
    setSearchQuery,
  } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    setMobileOpen(false);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearchChange?.(val);
    if (val.trim()) {
      scrollToSection("periodic-table");
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(255, 255, 255, 0.97)"
            : "rgba(240, 244, 255, 0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? "1px solid rgba(37, 99, 235, 0.12)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 20px rgba(37,99,235,0.08)" : "none",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2 flex-shrink-0 transition-smooth"
            onClick={() => scrollToSection("home")}
            aria-label="Go to home"
            data-ocid="navbar.logo"
          >
            <div className="relative">
              <FlaskConical
                size={24}
                style={{
                  color: "#2563eb",
                  filter: "drop-shadow(0 0 6px rgba(37,99,235,0.4))",
                }}
              />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span
                className="text-lg font-bold tracking-wide"
                style={{ color: "#1d4ed8" }}
              >
                ZChemistry<span style={{ color: "#0891b2" }}> Lab</span>
              </span>
              <span
                className="text-[10px] font-medium tracking-wider"
                style={{ color: "#6b9ce8" }}
              >
                by Atharv Shah
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 ml-4 flex-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.section}
                onClick={() => scrollToSection(link.section)}
                data-ocid={`navbar.${link.section.replace("-", "_")}.link`}
                className={`px-3 py-1.5 text-sm rounded-lg transition-smooth whitespace-nowrap relative ${
                  activeSection === link.section
                    ? "nav-link-active"
                    : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex-1 lg:flex-none" />

          {/* Search */}
          <div className="relative hidden md:block">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "rgba(37,99,235,0.45)" }}
            />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search elements..."
              data-ocid="navbar.search_input"
              className="pl-8 pr-4 py-1.5 text-sm rounded-lg bg-blue-50 border border-blue-200 text-slate-700 placeholder-slate-400 outline-none w-44 transition-smooth focus:border-blue-400 focus:bg-white"
            />
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-ocid="navbar.theme_toggle"
            className="p-2 rounded-lg text-slate-500 hover:text-blue-700 transition-smooth hover:bg-blue-50"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="navbar.mobile_menu_toggle"
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-blue-700 transition-smooth hover:bg-blue-50"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{
            background: "rgba(15,30,80,0.35)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setMobileOpen(false)}
          onKeyUp={(e) => e.key === "Escape" && setMobileOpen(false)}
          role="presentation"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 lg:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          borderRight: "1px solid rgba(37, 99, 235, 0.15)",
          boxShadow: "4px 0 24px rgba(37,99,235,0.1)",
        }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <span className="text-lg font-bold" style={{ color: "#1d4ed8" }}>
                ZChemistry<span style={{ color: "#0891b2" }}> Lab</span>
              </span>
              <span className="text-xs" style={{ color: "#6b9ce8" }}>
                by Atharv Shah
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-1.5 text-slate-500 hover:text-blue-700"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="relative mb-6">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search elements..."
              data-ocid="navbar.mobile_search_input"
              className="w-full pl-8 pr-4 py-2 text-sm rounded-lg bg-blue-50 border border-blue-200 text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.section}
                onClick={() => scrollToSection(link.section)}
                data-ocid={`navbar.mobile.${link.section.replace("-", "_")}.link`}
                className={`px-4 py-3 text-sm rounded-lg text-left transition-smooth ${
                  activeSection === link.section
                    ? "text-blue-700 bg-blue-50 font-semibold"
                    : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
