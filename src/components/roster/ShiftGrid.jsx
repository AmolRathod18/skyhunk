// ShiftGrid.jsx — Renders shift roster with only newly registered clients
export default function ShiftGrid({ title, headers, rows, highlightDay }) {
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
              const dayLabel = row[0];
              const isToday  = dayLabel === highlightDay;
              return (
                <tr key={dayLabel} style={isToday ? { background: "rgba(255,204,0,0.04)" } : {}}>

                  {/* Day column */}
                  <td className="day-label" style={isToday ? { color: "#ffcc00", fontWeight: 800 } : {}}>
                    {dayLabel}
                    {isToday && (
                      <span style={{ fontSize: "0.5rem", display: "block", color: "#ffcc00", opacity: 0.6 }}>
                        TOMORROW
                      </span>
                    )}
                  </td>

                  {/* Slot columns */}
                  {row.slice(1).map((cell, i) => {
                    const clients = Array.isArray(cell) ? cell.filter(Boolean) : [];
                    const hasClients = clients.length > 0;

                    return (
                      <td key={i} style={{ verticalAlign: "top", padding: hasClients ? "6px" : "4px" }}>
                        {clients.length === 0 ? (
                          <span style={{ color: "rgba(255,255,255,0.06)", fontSize: "0.6rem" }}>—</span>
                        ) : (
                          clients.map((name, j) => {
                            const isDup = name.endsWith(" ⚠");
                            const cleanName = name.replace("★", "").replace(" ⚠", "").trim();
                            return (
                              <span
                                key={j}
                                style={{
                                  display:      "block",
                                  marginBottom: j < clients.length - 1 ? "4px" : 0,
                                  color:        isDup ? "#ff4d4d" : "#ffcc00",
                                  fontWeight:   700,
                                  fontSize:     "0.72rem",
                                  borderRadius: "6px",
                                  padding:      "3px 7px",
                                  background:   isDup ? "rgba(255,77,77,0.12)" : "rgba(255,204,0,0.1)",
                                  border:       isDup ? "1px solid rgba(255,77,77,0.25)" : "1px solid rgba(255,204,0,0.2)",
                                  whiteSpace:   "nowrap",
                                }}
                              >
                                {isDup ? "⚠ " : "★ "}{cleanName}
                              </span>
                            );
                          })
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
