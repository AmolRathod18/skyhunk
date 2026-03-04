// RosterTab.jsx — Shows only newly registered clients in the correct roster slot
import { useState, useEffect } from "react";
import ShiftGrid from "../roster/ShiftGrid";

// ── Slot → shift/column mapping ───────────────────────────────
// Morning cols: [Day, 7-8, 8-9, 9-10, 10-11, 11-12]  (indices 1-5)
// Evening cols: [Day, 6-7, 7-8,  8-9,  9-10]          (indices 1-4)
const SLOT_CONFIG = {
  "7-8 AM":   { shift: "morning", col: 1 },
  "8-9 AM":   { shift: "morning", col: 2 },
  "9-10 AM":  { shift: "morning", col: 3 },
  "10-11 AM": { shift: "morning", col: 4 },
  "11-12 PM": { shift: "morning", col: 5 },
  "6-7 PM":   { shift: "evening", col: 1 },
  "7-8 PM":   { shift: "evening", col: 2 },
  "8-9 PM":   { shift: "evening", col: 3 },
  "9-10 PM":  { shift: "evening", col: 4 },
};

// Day name → row index in the schedule arrays (row[0] is day label)
const DAY_ROW = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Returns 3-char day name for a JS Date
function dayName(date) {
  return DAY_NAMES[date.getDay()];
}

// Build completely empty grids — no old static names, only new clients
function buildEmptyGrid(colCount) {
  return DAY_NAMES.map((day) => [day, ...Array(colCount).fill([])]);
}

// Populate empty grids with new clients in correct slot
function buildMergedGrids(clients) {
  const morningGrid = buildEmptyGrid(5); // 5 cols: 7-8,8-9,9-10,10-11,11-12
  const eveningGrid = buildEmptyGrid(4); // 4 cols: 6-7,7-8,8-9,9-10

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDay = dayName(tomorrow);
  const rowIdx = DAY_ROW[tomorrowDay];

  const errors = []; // track edge-case issues

  clients.forEach((client) => {
    const slot = client.preferredSlot;
    const cfg  = SLOT_CONFIG[slot];

    // Edge case 1 — invalid or missing slot
    if (!cfg) {
      errors.push({ client, reason: "Invalid time slot: " + slot });
      return;
    }

    const grid = cfg.shift === "morning" ? morningGrid : eveningGrid;

    // Edge case 2 — Sat is WEEK OFF, block booking
    if (tomorrowDay === "Sat") {
      errors.push({ client, reason: "Saturday is week off — slot not available" });
      return;
    }

    const cell = grid[rowIdx]?.[cfg.col];

    // Edge case 3 — duplicate booking (same slot already has NEW client)
    const alreadyBooked = Array.isArray(cell) && cell.some((v) => v.startsWith("★"));
    if (alreadyBooked) {
      errors.push({ client, reason: `Slot ${slot} on ${tomorrowDay} already booked` });
      // Still add — trainer can decide; mark as overlap
      grid[rowIdx][cfg.col].push("★" + client.clientName + " ⚠");
      return;
    }

    // Normal — inject new client with ★ prefix so ShiftGrid can style it
    grid[rowIdx][cfg.col].push("★" + client.clientName);
  });

  return {
    morningRows: morningGrid,
    eveningRows: eveningGrid,
    tomorrowDay,
    errors,
  };
}

// ── Goal colour ───────────────────────────────────────────────
const GOAL_COLOR = {
  "Weight Loss":          "#ff4d4d",
  "Muscle Gain":          "#00ffd5",
  "Athletic Performance": "#ffcc00",
  "Endurance":            "#00bfff",
  "Rehabilitation":       "#ff9900",
  "General Fitness":      "#aaa",
};
const EXP_ICON = { Beginner: "🌱", Intermediate: "⚡", Advanced: "🔥" };

// ── Pending-clients card list ─────────────────────────────────
function ClientCard({ client, onDelete, tomorrowDay }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const goalColor = GOAL_COLOR[client.primaryGoal] || "#ffcc00";
  const cfg = SLOT_CONFIG[client.preferredSlot];
  const shiftLabel = cfg ? (cfg.shift === "morning" ? "Morning" : "Evening") : "Unknown";

  return (
    <div className="rounded-2xl p-4 mb-3 relative" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <button onClick={() => onDelete(client.id)} className="absolute top-3 right-3 text-gray-600 hover:text-red-400 transition-colors text-xs" title="Remove">✕</button>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 font-bold"
          style={{ background: `${goalColor}18`, border: `1px solid ${goalColor}33`, color: goalColor }}>
          {client.clientName?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-tight">{client.clientName}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {EXP_ICON[client.experience] || ""} {client.experience}
            {client.medicalFlag && client.medicalFlag !== "None" && (
              <span className="ml-2" style={{ color: "#ff4d4d" }}>⚠ {client.medicalFlag}</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="text-center">
          <p className="text-xs text-gray-600">Goal</p>
          <p className="text-xs font-bold mt-0.5" style={{ color: goalColor }}>{client.primaryGoal}</p>
        </div>
        <div className="text-center border-x" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs text-gray-600">Shift</p>
          <p className="text-xs font-bold text-white mt-0.5">{shiftLabel}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Sessions</p>
          <p className="text-xs font-bold text-white mt-0.5">{client.sessionsPerWeek}×/wk</p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between rounded-xl px-3 py-2"
        style={{ background: "rgba(0,255,213,0.05)", border: "1px solid rgba(0,255,213,0.12)" }}>
        <div>
          <p className="text-xs text-gray-600">Trainer</p>
          <p className="text-xs font-bold" style={{ color: "#00ffd5" }}>{client.trainer}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600">Slot — {dateStr}</p>
          <p className="text-xs font-bold text-white">{client.preferredSlot}</p>
        </div>
      </div>

      {!cfg && (
        <div className="mt-2 text-xs rounded-lg px-3 py-1.5" style={{ background: "rgba(255,77,77,0.08)", color: "#ff4d4d", border: "1px solid rgba(255,77,77,0.2)" }}>
          ⚠ Slot "{client.preferredSlot}" could not be mapped to roster
        </div>
      )}
    </div>
  );
}

// ── Main RosterTab ─────────────────────────────────────────────
export default function RosterTab() {
  const [clients, setClients] = useState([]);

  // Poll localStorage every 5 seconds so new assessments appear without refresh
  useEffect(() => {
    function load() {
      const raw = JSON.parse(localStorage.getItem("gym_clients") || "[]");
      setClients(raw.slice().reverse());
    }
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  function handleDelete(id) {
    const updated = clients.filter((c) => c.id !== id);
    setClients(updated);
    localStorage.setItem("gym_clients", JSON.stringify([...updated].reverse()));
  }

  const { morningRows, eveningRows, tomorrowDay, errors } = buildMergedGrids(clients);

  return (
    <>
      {/* ── New Clients Queue ───────────────────────────── */}
      {clients.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-xs font-bold tracking-widest mb-3 flex items-center gap-2"
            style={{ fontFamily: "'Syncopate',sans-serif", color: "#ffcc00" }}>
            <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ background: "rgba(255,204,0,0.15)", border: "1px solid rgba(255,204,0,0.3)" }}>
              {clients.length}
            </span>
            NEW CLIENTS — appearing in {tomorrowDay} roster
          </h3>
          {clients.map((c) => <ClientCard key={c.id} client={c} onDelete={handleDelete} tomorrowDay={tomorrowDay} />)}
        </div>
      ) : (
        <div className="rounded-2xl p-6 text-center mb-6"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-2xl mb-2">🏋️</p>
          <p className="text-sm text-gray-500">No new clients yet.</p>
          <p className="text-xs text-gray-700 mt-1">Clients who complete the assessment will appear here.</p>
        </div>
      )}

      {/* ── Edge-case errors ────────────────────────────── */}
      {errors.length > 0 && (
        <div className="mb-4 rounded-xl p-3" style={{ background: "rgba(255,77,77,0.07)", border: "1px solid rgba(255,77,77,0.2)" }}>
          <p className="text-xs font-bold mb-1" style={{ color: "#ff4d4d" }}>⚠ Slot Conflicts</p>
          {errors.map((e, i) => (
            <p key={i} className="text-xs text-gray-500">{e.client.clientName}: {e.reason}</p>
          ))}
        </div>
      )}

      {/* ── Shift Grids — new clients injected into correct cell ── */}
      <ShiftGrid
        title={`Morning Shift: 7am – 12pm  (tomorrow = ${tomorrowDay})`}
        headers={["7-8", "8-9", "9-10", "10-11", "11-12"]}
        rows={morningRows}
        highlightDay={tomorrowDay}
      />
      <ShiftGrid
        title={`Evening Shift: 6pm – 10pm  (tomorrow = ${tomorrowDay})`}
        headers={["6-7", "7-8", "8-9", "9-10"]}
        rows={eveningRows}
        highlightDay={tomorrowDay}
      />
    </>
  );
}
