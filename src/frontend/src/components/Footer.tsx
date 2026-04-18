const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const QUICK_LINKS = [
  { label: "Home", section: "home" },
  { label: "Periodic Table", section: "periodic-table" },
  { label: "Tools", section: "tools" },
  { label: "Simulations", section: "simulations" },
  { label: "Virtual Lab", section: "test-lab" },
  { label: "NCERT Lab", section: "ncert-lab" },
  { label: "Worksheet", section: "worksheet" },
];

const TOOLS_LINKS = [
  "Equation Balancer",
  "Molar Mass Calculator",
  "pH Calculator",
  "Unit Converter",
  "Reaction Type Identifier",
  "Formula Maker",
];

const SOCIAL_ICONS = [
  { name: "Twitter / X", href: "#", icon: "𝕏" },
  { name: "GitHub", href: "#", icon: "⌥" },
  { name: "YouTube", href: "#", icon: "▶" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      style={{
        background:
          "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0369a1 100%)",
        borderTop: "1px solid rgba(37,99,235,0.3)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Col 1 – Brand */}
          <div>
            <div className="mb-1">
              <span
                className="text-2xl font-black"
                style={{ color: "#ffffff" }}
              >
                ZChemistry
              </span>
              <span
                className="text-2xl font-black ml-1"
                style={{ color: "#93c5fd" }}
              >
                Lab
              </span>
            </div>
            <p
              className="text-sm font-semibold mb-3 tracking-wide"
              style={{ color: "#93c5fd" }}
            >
              by Atharv Shah
            </p>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              A premium chemistry learning platform for NCERT students and
              teachers. Explore elements, run virtual experiments, and master
              chemical concepts.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  data-ocid={`footer.${s.name.toLowerCase().replace(/[^a-z]/g, "_")}_link`}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-smooth hover-glow"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 – Quick Links */}
          <div>
            <h4
              className="text-xs font-semibold mb-4 tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.section}>
                  <button
                    type="button"
                    data-ocid={`footer.${link.section}_link`}
                    onClick={() => scrollTo(link.section)}
                    className="text-sm transition-smooth text-left"
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "#93c5fd";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(255,255,255,0.55)";
                    }}
                  >
                    → {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 – Chemistry Tools */}
          <div>
            <h4
              className="text-xs font-semibold mb-4 tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Chemistry Tools
            </h4>
            <ul className="space-y-2">
              {TOOLS_LINKS.map((tool) => (
                <li key={tool}>
                  <button
                    type="button"
                    data-ocid={`footer.tool_${tool.toLowerCase().replace(/\s+/g, "_")}_link`}
                    onClick={() => scrollTo("tools")}
                    className="text-sm transition-smooth text-left"
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "#bae6fd";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(255,255,255,0.55)";
                    }}
                  >
                    → {tool}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 – About + Credits */}
          <div>
            <h4
              className="text-xs font-semibold mb-4 tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              About & Credits
            </h4>
            <ul className="space-y-2.5">
              {[
                { icon: "⚛️", text: "Built with React + TypeScript" },
                { icon: "📚", text: "Data from NCERT curriculum" },
                { icon: "🎓", text: "Open for students & teachers" },
                { icon: "🌐", text: "Works fully offline" },
                { icon: "🔒", text: "No tracking, no ads" },
              ].map((item) => (
                <li
                  key={item.text}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            © {year} ZChemistry Lab by Atharv Shah. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-smooth"
              style={{ color: "rgba(147,197,253,0.75)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#93c5fd";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(147,197,253,0.75)";
              }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
