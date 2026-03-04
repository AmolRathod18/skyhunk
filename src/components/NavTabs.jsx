// NavTabs.jsx — Sticky top tab navigation
export default function NavTabs({ active, onChange, tabs }) {
  return (
    <div
      className="sticky top-0 z-50 flex justify-center gap-2 py-3"
      style={{ backgroundColor: "#05070a" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="px-4 py-2 rounded-full text-xs font-bold transition-all"
          style={{
            fontFamily: "'Syncopate', sans-serif",
            backgroundColor: active === tab.id ? "#ffcc00" : "transparent",
            color:           active === tab.id ? "#000"    : "#666",
            border:          active === tab.id ? "none"    : "1px solid #333",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
