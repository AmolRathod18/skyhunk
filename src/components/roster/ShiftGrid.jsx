// ShiftGrid.jsx — Roster grid with mobile card view + desktop table view
import { useState, useEffect } from "react";

/* ── shared client pill ──────────────────────────────────── */
// name encoding:
//   "ClientName"      → static scheduled client  (white)
//   "★ClientName"     → newly registered client  (gold)
//   "★ClientName ⚠"  → slot conflict             (red)
function ClientPill({ name, small }) {
  const isDup   = name.endsWith(" ⚠");
  const isNew   = name.startsWith("★");
  const cleanName = name.replace("★", "").replace(" ⚠", "").trim();

  const color  = isDup ? "#ff4d4d"
               : isNew ? "#ffcc00"
               :         "rgba(255,255,255,0.82)";
  const bg     = isDup ? "rgba(255,77,77,0.12)"
               : isNew ? "rgba(255,204,0,0.10)"
               :         "rgba(255,255,255,0.05)";
  const border = isDup ? "rgba(255,77,77,0.25)"
               : isNew ? "rgba(255,204,0,0.22)"
               :         "rgba(255,255,255,0.10)";
  const prefix = isDup ? "⚠ " : isNew ? "★ " : "";

  return (
    <span style={{
      display:      "inline-block",
      color,
      fontWeight:   700,
      fontSize:     small ? "0.62rem" : "0.72rem",
      borderRadius: "6px",
      padding:      small ? "2px 6px" : "3px 7px",
      background:   bg,
      border:       `1px solid ${border}`,
      whiteSpace:   "nowrap",
    }}>
      {prefix}{cleanName}
    </span>
  );
}

/* ── Mobile view — day cards with slot pills ─────────────── */
function MobileView({ title, headers, rows, highlightDay, weekOffDays = [] }) {
  return (
    <div className="card-elite">
      <span className="tag">{title}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {rows.map((row) => {
          const dayLabel   = row[0];
          const isToday    = dayLabel === highlightDay;
          const isWeekOff  = weekOffDays.includes(dayLabel);
          const slots      = row.slice(1);
          const hasAny     = !isWeekOff && slots.some(cell => Array.isArray(cell) && cell.filter(Boolean).length > 0);

          return (
            <div
              key={dayLabel}
              style={{
                borderRadius: "10px",
                padding:      "10px 12px",
                background:   isWeekOff ? "rgba(255,255,255,0.01)"
                            : isToday   ? "rgba(255,204,0,0.06)"
                            :             "rgba(255,255,255,0.02)",
                border:       `1px solid ${isToday ? "rgba(255,204,0,0.22)" : "rgba(255,255,255,0.06)"}`,
                opacity:      isWeekOff ? 0.45 : 1,
              }}
            >
              {/* Day header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: hasAny ? "8px" : 0 }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: isToday ? "#ffcc00" : "#00ffd5",
                  fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.08em" }}>{dayLabel}</span>
                {isToday && (
                  <span style={{ fontSize: "8px", color: "#ffcc00", opacity: 0.7, fontFamily: "'Syncopate',sans-serif",
                    background: "rgba(255,204,0,0.1)", border: "1px solid rgba(255,204,0,0.25)", borderRadius: "20px", padding: "2px 8px" }}>
                    TOMORROW
                  </span>
                )}
                {isWeekOff && (
                  <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", fontFamily: "'Syncopate',sans-serif",
                    letterSpacing: "0.1em", background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "2px 8px" }}>
                    WEEK OFF
                  </span>
                )}
                {!isWeekOff && !hasAny && (
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.1)" }}>No bookings</span>
                )}
              </div>

              {/* Slot pills */}
              {hasAny && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {slots.map((cell, si) => {
                    const clients = Array.isArray(cell) ? cell.filter(Boolean) : [];
                    return clients.map((name, j) => (
                      <div key={`${si}-${j}`} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontSize: "8px", color: "#555", textAlign: "center",
                          fontFamily: "'Syncopate',sans-serif" }}>{headers[si]}</span>
                        <ClientPill name={name} small />
                      </div>
                    ));
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Desktop view — full table ───────────────────────────── */
function DesktopView({ title, headers, rows, highlightDay, weekOffDays = [] }) {
  return (
    <div className="card-elite">
      <span className="tag">{title}</span>
      <div className="overflow-x-auto">
        <table className="sched-table">
          <thead>
            <tr>
              {["Days", ...headers].map((h) => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const dayLabel  = row[0];
              const isToday   = dayLabel === highlightDay;
              const isWeekOff = weekOffDays.includes(dayLabel);
              return (
                <tr key={dayLabel} style={{
                  background: isToday ? "rgba(255,204,0,0.04)" : "transparent",
                  opacity: isWeekOff ? 0.38 : 1,
                }}>
                  <td className="day-label" style={isToday ? { color: "#ffcc00", fontWeight: 800 } : {}}>
                    {dayLabel}
                    {isToday && (
                      <span style={{ fontSize: "0.5rem", display: "block", color: "#ffcc00", opacity: 0.6 }}>TOMORROW</span>
                    )}
                    {isWeekOff && (
                      <span style={{ fontSize: "0.48rem", display: "block", color: "rgba(255,255,255,0.3)",
                        fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.08em", marginTop: "2px" }}>WEEK OFF</span>
                    )}
                  </td>
                  {row.slice(1).map((cell, i) => {
                    const clients   = Array.isArray(cell) ? cell.filter(Boolean) : [];
                    const hasClients = clients.length > 0;
                    return (
                      <td key={i} style={{ verticalAlign: "top", padding: hasClients ? "6px" : "4px" }}>
                        {clients.length === 0 ? (
                          <span style={{ color: "rgba(255,255,255,0.06)", fontSize: "0.6rem" }}>—</span>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {clients.map((name, j) => <ClientPill key={j} name={name} />)}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Main export — switches view based on screen width ───── */
export default function ShiftGrid({ title, headers, rows, highlightDay, weekOffDays = [] }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return isMobile
    ? <MobileView  title={title} headers={headers} rows={rows} highlightDay={highlightDay} weekOffDays={weekOffDays} />
    : <DesktopView title={title} headers={headers} rows={rows} highlightDay={highlightDay} weekOffDays={weekOffDays} />;
}
