// ClientDirectoryTab.jsx — Visual client wall with profiles, notes & weekly calendar
import { useState, useEffect } from "react";

// ── All 17 real schedule clients ──────────────────────────────
// Training pattern A = Sun · Tue · Thu
// Training pattern B = Mon · Wed · Fri
const PATTERN_A = { days: ["Sun", "Tue", "Thu"], label: "SUN · TUE · THU" };
const PATTERN_B = { days: ["Mon", "Wed", "Fri"], label: "MON · WED · FRI" };

const ALL_CLIENTS = [
  // ── Morning Shift ──────────────────────────────────────────
  { id: "m1",  name: "Sreelekshmi",       slot: "6–7 AM",   shift: "morning", pattern: PATTERN_A, couples: false, color: "#ff6b9d" },
  { id: "m2",  name: "Guphtak",           slot: "7–8 AM",   shift: "morning", pattern: PATTERN_A, couples: false, color: "#c77dff" },
  { id: "m3",  name: "Indra",             slot: "8–9 AM",   shift: "morning", pattern: PATTERN_A, couples: false, color: "#4cc9f0" },
  { id: "m4",  name: "Aswathy",           slot: "9–10 AM",  shift: "morning", pattern: PATTERN_A, couples: false, color: "#f77f00" },
  { id: "m5",  name: "Darshan",           slot: "6–7 AM",   shift: "morning", pattern: PATTERN_B, couples: false, color: "#06d6a0" },
  { id: "m6",  name: "Shri Raksha & Aman", slot: "7–8 AM",  shift: "morning", pattern: PATTERN_B, couples: true,  color: "#ff4d6d" },
  { id: "m7",  name: "Nitin",             slot: "8–9 AM",   shift: "morning", pattern: PATTERN_B, couples: false, color: "#ffd60a" },
  { id: "m8",  name: "Bhargav",           slot: "9–10 AM",  shift: "morning", pattern: PATTERN_B, couples: false, color: "#80b918" },
  { id: "m9",  name: "Homesh & Pavitra",  slot: "10–11 AM", shift: "morning", pattern: PATTERN_B, couples: true,  color: "#ff9500" },
  // ── Evening Shift ──────────────────────────────────────────
  { id: "e1",  name: "Bishnu",            slot: "5–6 PM",   shift: "evening", pattern: PATTERN_A, couples: false, color: "#00b4d8" },
  { id: "e2",  name: "Shweta",            slot: "6–7 PM",   shift: "evening", pattern: PATTERN_A, couples: false, color: "#e040fb" },
  { id: "e3",  name: "Ishan",             slot: "7–8 PM",   shift: "evening", pattern: PATTERN_A, couples: false, color: "#26c6da" },
  { id: "e4",  name: "Kalyani",           slot: "8–9 PM",   shift: "evening", pattern: PATTERN_A, couples: false, color: "#ff7043" },
  { id: "e5",  name: "Pallavi",           slot: "6–7 PM",   shift: "evening", pattern: PATTERN_B, couples: false, color: "#ab47bc" },
  { id: "e6",  name: "Balaji & Anupriya", slot: "7–8 PM",   shift: "evening", pattern: PATTERN_B, couples: true,  color: "#ef5350" },
  { id: "e7",  name: "Jatin",             slot: "8–9 PM",   shift: "evening", pattern: PATTERN_B, couples: false, color: "#29b6f6" },
  { id: "e8",  name: "Ashesh",            slot: "9–10 PM",  shift: "evening", pattern: PATTERN_B, couples: false, color: "#66bb6a" },
];

const ALL_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Load / save trainer notes from localStorage
const NOTES_KEY = "trainer_client_notes";
function loadNotes()        { return JSON.parse(localStorage.getItem(NOTES_KEY) || "{}"); }
function saveNote(id, text) {
  const notes = loadNotes();
  notes[id] = text;
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// ── Mini week-day bar ─────────────────────────────────────────
function WeekBar({ pattern, color }) {
  return (
    <div style={{ display: "flex", gap: "3px", marginTop: "8px" }}>
      {ALL_DAYS.map((d) => {
        const active = pattern.days.includes(d);
        const isSat  = d === "Sat";
        return (
          <div
            key={d}
            style={{
              flex: 1,
              height: "28px",
              borderRadius: "6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              background: isSat
                ? "rgba(255,255,255,0.03)"
                : active
                  ? `${color}22`
                  : "rgba(255,255,255,0.03)",
              border: `1px solid ${isSat ? "rgba(255,255,255,0.04)" : active ? `${color}55` : "rgba(255,255,255,0.04)"}`,
              transition: "all 0.2s",
            }}
          >
            <span style={{
              fontSize: "7px",
              fontWeight: 800,
              fontFamily: "'Syncopate',sans-serif",
              letterSpacing: "0em",
              color: isSat ? "#2a2a2a" : active ? color : "#333",
            }}>
              {d[0]}
            </span>
            {active && !isSat && (
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: color }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Client Wall Card ──────────────────────────────────────────
function ClientCard({ client, notes, onSelect }) {
  const initials = client.name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div
      onClick={onSelect}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid rgba(255,255,255,0.07)`,
        borderRadius: "18px",
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${client.color}55`;
        e.currentTarget.style.background  = `${client.color}09`;
        e.currentTarget.style.transform   = "translateY(-3px)";
        e.currentTarget.style.boxShadow   = `0 8px 30px ${client.color}1a`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.background  = "rgba(255,255,255,0.02)";
        e.currentTarget.style.transform   = "translateY(0)";
        e.currentTarget.style.boxShadow   = "none";
      }}
    >
      {/* Coloured top-left accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, ${client.color}, transparent)`,
        borderRadius: "18px 18px 0 0",
      }} />

      {/* Avatar + name row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <div style={{
          width: "46px", height: "46px", borderRadius: "14px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Syncopate',sans-serif", fontSize: "13px", fontWeight: 800,
          color: client.color,
          background: `${client.color}18`,
          border: `2px solid ${client.color}33`,
          letterSpacing: "0.02em",
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#fff", margin: 0,
              fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.02em",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {client.name}
            </p>
            {client.couples && (
              <span style={{ fontSize: "7px", background: "rgba(255,107,154,0.15)", color: "#ff6b9d",
                border: "1px solid rgba(255,107,154,0.3)", borderRadius: "20px", padding: "1px 6px",
                fontWeight: 700, letterSpacing: "0.06em", flexShrink: 0 }}>
                💑 COUPLE
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "5px", marginTop: "4px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: client.shift === "morning" ? "#ffcc00" : "#00ffd5",
              background: client.shift === "morning" ? "rgba(255,204,0,0.08)" : "rgba(0,255,213,0.08)",
              border: `1px solid ${client.shift === "morning" ? "rgba(255,204,0,0.2)" : "rgba(0,255,213,0.2)"}`,
              borderRadius: "20px", padding: "2px 7px" }}>
              {client.shift === "morning" ? "☀ MORNING" : "🌙 EVENING"}
            </span>
            <span style={{ fontSize: "9px", color: "#555", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "2px 7px" }}>
              {client.slot}
            </span>
          </div>
        </div>
      </div>

      {/* Week bar */}
      <WeekBar pattern={client.pattern} color={client.color} />

      {/* Note preview */}
      {notes[client.id] && (
        <p style={{ marginTop: "10px", fontSize: "10px", color: "#444", fontStyle: "italic",
          lineHeight: 1.5, borderLeft: `2px solid ${client.color}44`, paddingLeft: "8px" }}>
          {notes[client.id].slice(0, 60)}{notes[client.id].length > 60 ? "…" : ""}
        </p>
      )}

      {/* Tap hint */}
      <p style={{ marginTop: "10px", fontSize: "8px", textAlign: "right",
        color: `${client.color}44`, fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.08em" }}>
        TAP FOR PROFILE →
      </p>
    </div>
  );
}

// ── Full Profile Drawer ───────────────────────────────────────
function ProfileDrawer({ client, notes, onClose, onSaveNote }) {
  const [note, setNote] = useState(notes[client.id] || "");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSaveNote(client.id, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const initials = client.name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const shiftColor = client.shift === "morning" ? "#ffcc00" : "#00ffd5";
  const shiftLabel = client.shift === "morning" ? "☀ Morning Shift" : "🌙 Evening Shift";

  // Stats derived from schedule
  const sessionsPerWeek = 3; // 3 days on, pattern A or B
  const totalDays       = client.pattern.label;

  // "Training neighbours" — who else trains in the same days
  const samePattern = ALL_CLIENTS.filter(
    (c) => c.id !== client.id && c.pattern === client.pattern && c.shift === client.shift
  );

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      />

      {/* Drawer */}
      <div
        className="client-drawer"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
          background: "#0b0d11",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: `3px solid ${client.color}`,
          borderRadius: "24px 24px 0 0",
          maxHeight: "92vh", overflowY: "auto",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "2px" }}>
          <div style={{ width: "44px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.1)" }} />
        </div>

        <div style={{ padding: "12px 20px 40px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "22px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "20px", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Syncopate',sans-serif", fontSize: "18px", fontWeight: 800,
              color: client.color, background: `${client.color}18`, border: `2px solid ${client.color}44`,
            }}>{initials}</div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                <h2 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "16px", fontWeight: 800,
                  color: "#fff", margin: 0, letterSpacing: "0.02em" }}>
                  {client.name}
                </h2>
                {client.couples && (
                  <span style={{ fontSize: "8px", background: "rgba(255,107,154,0.15)", color: "#ff6b9d",
                    border: "1px solid rgba(255,107,154,0.3)", borderRadius: "20px", padding: "2px 8px", fontWeight: 700 }}>
                    💑 COUPLE SESSION
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "9px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700,
                  color: shiftColor, background: `${shiftColor}12`, border: `1px solid ${shiftColor}33` }}>
                  {shiftLabel}
                </span>
                <span style={{ fontSize: "9px", padding: "3px 10px", borderRadius: "20px",
                  color: "#888", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  Cult Neo Gym, Bengaluru
                </span>
              </div>
            </div>

            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#555", borderRadius: "10px", width: "32px", height: "32px",
              cursor: "pointer", fontSize: "15px", flexShrink: 0,
            }}>✕</button>
          </div>

          {/* ── Stats row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px",
            background: "rgba(255,255,255,0.05)", borderRadius: "14px", overflow: "hidden", marginBottom: "14px" }}>
            {[
              { label: "Slot",     value: client.slot,       color: client.color },
              { label: "Sessions", value: `${sessionsPerWeek}×/week`, color: "#fff" },
              { label: "Pattern",  value: client.pattern.days.join("·"), color: shiftColor },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "#0e1014", padding: "14px 8px", textAlign: "center" }}>
                <p style={{ fontSize: "8px", color: "#444", margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                <p style={{ fontSize: "11px", fontWeight: 800, color, margin: 0, fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.02em" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* ── Weekly calendar ── */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{ width: "3px", height: "16px", borderRadius: "2px", background: client.color }} />
              <p style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "9px", fontWeight: 800,
                color: client.color, margin: 0, letterSpacing: "0.1em" }}>WEEKLY TRAINING CALENDAR</p>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {ALL_DAYS.map((d) => {
                const active = client.pattern.days.includes(d);
                const isSat  = d === "Sat";
                return (
                  <div key={d} style={{
                    flex: 1, borderRadius: "10px", padding: "10px 4px", textAlign: "center",
                    background: isSat ? "rgba(255,255,255,0.02)"
                              : active ? `${client.color}20` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isSat ? "rgba(255,255,255,0.03)"
                              : active ? `${client.color}55` : "rgba(255,255,255,0.05)"}`,
                  }}>
                    <p style={{ fontSize: "8px", fontWeight: 800, margin: "0 0 5px",
                      fontFamily: "'Syncopate',sans-serif",
                      color: isSat ? "#222" : active ? client.color : "#2a2a2a" }}>{d}</p>
                    <div style={{
                      width: "6px", height: "6px", borderRadius: "50%", margin: "0 auto",
                      background: isSat ? "#1a1a1a" : active ? client.color : "#1a1a1a",
                      boxShadow: active && !isSat ? `0 0 8px ${client.color}` : "none",
                    }} />
                    <p style={{ fontSize: "7px", margin: "4px 0 0",
                      color: isSat ? "#1e1e1e" : active ? `${client.color}99` : "#1e1e1e" }}>
                      {isSat ? "OFF" : active ? client.slot : "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Same-time gym-mates ── */}
          {samePattern.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <div style={{ width: "3px", height: "16px", borderRadius: "2px", background: "#555" }} />
                <p style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "9px", fontWeight: 800,
                  color: "#555", margin: 0, letterSpacing: "0.1em" }}>TRAINS SAME DAYS AS</p>
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {samePattern.map((c) => (
                  <span key={c.id} style={{
                    fontSize: "10px", padding: "4px 10px", borderRadius: "20px",
                    color: c.color, background: `${c.color}12`, border: `1px solid ${c.color}30`,
                    fontWeight: 600,
                  }}>
                    {c.name}
                    <span style={{ fontSize: "8px", color: "#444", marginLeft: "4px" }}>{c.slot}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Trainer notes ── */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{ width: "3px", height: "16px", borderRadius: "2px", background: client.color }} />
              <p style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "9px", fontWeight: 800,
                color: client.color, margin: 0, letterSpacing: "0.1em" }}>TRAINER NOTES</p>
              <span style={{ fontSize: "8px", color: "#333", marginLeft: "auto" }}>saved to device</span>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`Add notes for ${client.name}… (goal, medical, progress, diet tips…)`}
              rows={4}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${note ? `${client.color}44` : "rgba(255,255,255,0.08)"}`,
                borderRadius: "12px", padding: "12px 14px",
                color: "#ccc", fontSize: "12px", lineHeight: 1.6,
                resize: "vertical", outline: "none", fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = `${client.color}88`}
              onBlur={(e)  => e.target.style.borderColor = note ? `${client.color}44` : "rgba(255,255,255,0.08)"}
            />
          </div>

          {/* ── Buttons ── */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleSave}
              style={{
                flex: 2,
                background: saved
                  ? "rgba(0,255,213,0.15)"
                  : `linear-gradient(135deg, ${client.color}, ${client.shift === "morning" ? "#ff9900" : "#0096c7"})`,
                border: saved ? "1px solid rgba(0,255,213,0.4)" : "none",
                color: saved ? "#00ffd5" : "#000",
                borderRadius: "12px", padding: "13px 8px",
                fontSize: "10px", fontWeight: 800, cursor: "pointer",
                fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.08em",
                transition: "all 0.3s",
                boxShadow: saved ? "none" : `0 4px 20px ${client.color}44`,
              }}
            >
              {saved ? "✓ SAVED" : "💾 SAVE NOTES"}
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#555", borderRadius: "12px", padding: "13px 8px",
                fontSize: "10px", fontWeight: 800, cursor: "pointer",
                fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.06em",
              }}
            >CLOSE</button>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function ClientDirectoryTab() {
  const [notes,          setNotes]          = useState(loadNotes);
  const [selectedClient, setSelectedClient] = useState(null);
  const [shiftFilter,    setShiftFilter]    = useState("all"); // "all" | "morning" | "evening"
  const [search,         setSearch]         = useState("");

  function handleSaveNote(id, text) {
    saveNote(id, text);
    setNotes((prev) => ({ ...prev, [id]: text }));
  }

  const filtered = ALL_CLIENTS.filter((c) => {
    const matchShift  = shiftFilter === "all" || c.shift === shiftFilter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchShift && matchSearch;
  });

  const morningClients = filtered.filter((c) => c.shift === "morning");
  const eveningClients = filtered.filter((c) => c.shift === "evening");

  return (
    <>
      {/* Profile drawer */}
      {selectedClient && (
        <ProfileDrawer
          client={selectedClient}
          notes={notes}
          onClose={() => setSelectedClient(null)}
          onSaveNote={handleSaveNote}
        />
      )}

      {/* ── Header search + filter ── */}
      <div style={{ marginBottom: "20px" }}>
        {/* Search bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px", padding: "10px 14px", marginBottom: "12px",
        }}>
          <span style={{ color: "#444", fontSize: "14px" }}>🔍</span>
          <input
            type="text"
            placeholder="Search client by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: "#ccc", fontSize: "13px", fontFamily: "inherit",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none",
              color: "#444", cursor: "pointer", fontSize: "14px" }}>✕</button>
          )}
        </div>

        {/* Shift filter pills */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            { id: "all",     label: "All 17",  count: ALL_CLIENTS.length },
            { id: "morning", label: "☀ Morning", count: ALL_CLIENTS.filter(c => c.shift === "morning").length },
            { id: "evening", label: "🌙 Evening", count: ALL_CLIENTS.filter(c => c.shift === "evening").length },
          ].map(({ id, label, count }) => {
            const active = shiftFilter === id;
            return (
              <button
                key={id}
                onClick={() => setShiftFilter(id)}
                style={{
                  padding: "6px 14px", borderRadius: "50px",
                  fontFamily: "'Syncopate',sans-serif", fontSize: "9px", fontWeight: 800,
                  letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s",
                  background: active ? "linear-gradient(135deg, #ffcc00, #ff9900)" : "rgba(255,255,255,0.03)",
                  color: active ? "#000" : "#555",
                  border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: active ? "0 4px 16px rgba(255,204,0,0.25)" : "none",
                }}
              >
                {label} <span style={{ opacity: 0.6, marginLeft: "3px" }}>({count})</span>
              </button>
            );
          })}
          {/* Stats — notes count */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "9px", color: "#333",
              fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.06em" }}>
              {Object.values(notes).filter(Boolean).length} notes saved
            </span>
          </div>
        </div>
      </div>

      {/* ── Morning section ── */}
      {morningClients.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ width: "3px", height: "20px", borderRadius: "2px",
              background: "linear-gradient(to bottom, #ffcc00, transparent)" }} />
            <p style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "10px", fontWeight: 800,
              color: "#ffcc00", margin: 0, letterSpacing: "0.12em" }}>
              ☀ MORNING SHIFT  ·  6 AM – 11 AM
            </p>
            <span style={{ fontSize: "9px", color: "#333", background: "rgba(255,204,0,0.06)",
              border: "1px solid rgba(255,204,0,0.15)", borderRadius: "20px", padding: "2px 8px" }}>
              {morningClients.length} clients
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
            {morningClients.map((c) => (
              <ClientCard key={c.id} client={c} notes={notes} onSelect={() => setSelectedClient(c)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Evening section ── */}
      {eveningClients.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ width: "3px", height: "20px", borderRadius: "2px",
              background: "linear-gradient(to bottom, #00ffd5, transparent)" }} />
            <p style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "10px", fontWeight: 800,
              color: "#00ffd5", margin: 0, letterSpacing: "0.12em" }}>
              🌙 EVENING SHIFT  ·  5 PM – 10 PM
            </p>
            <span style={{ fontSize: "9px", color: "#333", background: "rgba(0,255,213,0.06)",
              border: "1px solid rgba(0,255,213,0.15)", borderRadius: "20px", padding: "2px 8px" }}>
              {eveningClients.length} clients
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
            {eveningClients.map((c) => (
              <ClientCard key={c.id} client={c} notes={notes} onSelect={() => setSelectedClient(c)} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</p>
          <p style={{ color: "#555", fontSize: "13px" }}>No clients match "{search}"</p>
        </div>
      )}
    </>
  );
}
