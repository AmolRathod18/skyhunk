// RosterTab.jsx — Full schedule with new clients overlaid on tomorrow's row
import { useState, useEffect } from "react";
import ShiftGrid from "../roster/ShiftGrid";
import { deleteClient } from "../../utils/apiService";
import { morning, evening, WEEK_OFF_DAYS } from "../../data/scheduleData";

// ── Slot → shift/column mapping ───────────────────────────────
// Morning cols: [Day, 6-7, 7-8, 8-9, 9-10, 10-11]  (indices 1-5)
// Evening cols: [Day, 5-6, 6-7, 7-8,  8-9,  9-10]  (indices 1-5)
const SLOT_CONFIG = {
  "6-7 AM":   { shift: "morning", col: 1 },
  "7-8 AM":   { shift: "morning", col: 2 },
  "8-9 AM":   { shift: "morning", col: 3 },
  "9-10 AM":  { shift: "morning", col: 4 },
  "10-11 AM": { shift: "morning", col: 5 },
  "5-6 PM":   { shift: "evening", col: 1 },
  "6-7 PM":   { shift: "evening", col: 2 },
  "7-8 PM":   { shift: "evening", col: 3 },
  "8-9 PM":   { shift: "evening", col: 4 },
  "9-10 PM":  { shift: "evening", col: 5 },
};

// Day name → row index in the schedule arrays (row[0] is day label)
const DAY_ROW  = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Returns 3-char day name for a JS Date
function dayName(date) {
  return DAY_NAMES[date.getDay()];
}

// Convert static string-based schedule to array-per-cell format (ShiftGrid format)
// Static clients have no prefix; new clients get ★ prefix in buildMergedGrids
function buildGridFromStatic(staticData) {
  return staticData.map(row => [
    row[0], // day label
    ...row.slice(1).map(cell => (cell ? [cell] : [])),
  ]);
}

// Merge real schedule (baseline) with newly registered clients for tomorrow's row
function buildMergedGrids(clients) {
  // Deep-clone static data to avoid mutating the import across renders
  const morningGrid = buildGridFromStatic(morning); // 5 cols: 6-7,7-8,8-9,9-10,10-11
  const eveningGrid = buildGridFromStatic(evening); // 5 cols: 5-6,6-7,7-8,8-9,9-10

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

    // Edge case 2 — Sat is WEEK OFF, block booking
    if (WEEK_OFF_DAYS.includes(tomorrowDay)) {
      errors.push({ client, reason: "Saturday is week off — slot not available" });
      return;
    }

    const grid = cfg.shift === "morning" ? morningGrid : eveningGrid;
    const cell = grid[rowIdx]?.[cfg.col];

    // Edge case 3 — slot already occupied (by static or another new client)
    const alreadyBooked = Array.isArray(cell) && cell.length > 0;
    if (alreadyBooked) {
      errors.push({ client, reason: `Slot ${slot} on ${tomorrowDay} already booked` });
      // Still add — trainer can decide; mark as overlap
      grid[rowIdx][cfg.col] = [...cell, "★" + client.clientName + " ⚠"];
      return;
    }

    // Normal — inject new client with ★ prefix so ShiftGrid styles it as new
    grid[rowIdx][cfg.col] = ["★" + client.clientName];
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

// ── Per-goal per-experience 5-step session plans ───────────────
const SESSION_PLANS = {
  "Weight Loss": {
    Beginner:     ["5-min walk warm-up + joint mobility circles", "3×12 Goblet Squat + Dumbbell Row (light load)", "3×10 Step-ups + Modified Push-up", "15-min Low-impact HIIT  (30s on / 30s off)", "Cool-down stretch + hydration check"],
    Intermediate: ["7-min dynamic warm-up (high knees + lateral shuffle)", "4×10 Barbell Squat + Romanian Deadlift", "3×12 Incline Press + Cable Rows superset", "20-min HIIT circuit (Tabata format)", "Cool-down + body composition notes"],
    Advanced:     ["CNS activation warm-up (10 min full protocol)", "5×8 Heavy Compound (Back Squat or Deadlift)", "Metabolic conditioning circuit (4 rounds, timed)", "20-min Sprint intervals (10s sprint / 20s rest)", "Foam roll + 10-min flexibility protocol"],
  },
  "Muscle Gain": {
    Beginner:     ["Light warm-up + movement pattern technique review", "3×10 Compound movements (Squat / Press / Pull)", "3×12 Machine isolation exercises (key muscles)", "Core: 3×30s Plank hold", "Post-workout protein reminder — 30g within 30 min"],
    Intermediate: ["10-min warm-up + muscle activation drills", "4×8 Primary compound (heavy, stay at RPE ≤ 8)", "3×10 Secondary compound volume work", "3×12 Isolation finisher (target muscle focus)", "Progressive overload log + recovery check"],
    Advanced:     ["Full CNS activation + pre-workout protocol", "5×5 Heavy Push/Pull (% of 1RM logged)", "4×8 Hypertrophy superset (60s rest)", "Drop sets / extended sets finisher technique", "Foam roll + stretch target muscle groups"],
  },
  "Athletic Performance": {
    Beginner:     ["Agility warm-up — cone & ladder drill (5 min)", "3×5 Box Jump (focus on landing mechanics)", "3×10 Single-leg stability exercises", "Sport-specific movement pattern drill (10 min)", "Cool-down + flexibility work (10 min)"],
    Intermediate: ["10-min dynamic full-body warm-up", "4×4 Jump Squat or Power Clean (explosive)", "3×6 Bulgarian Split Squat (single-leg power)", "SAQ drill — sprint ladder (3 sets × 10m)", "Contrast therapy or self-massage recovery"],
    Advanced:     ["Elite activation: mobility flow + CNS priming", "5×3 Olympic lift (Power Clean / Hang Snatch)", "Plyometric circuit — max intensity (6 exercises)", "SAQ: resisted sprints 10m × 8 reps", "Ice bath or 5-min contrast shower protocol"],
  },
  "Endurance": {
    Beginner:     ["5-min easy jog + dynamic leg swings", "20-min Zone 2 cardio (conversational pace)", "Bodyweight squat + reverse lunge circuit", "5-min cool-down walk + full body stretch", "Hydration + electrolyte reminder"],
    Intermediate: ["5-min jog + dynamic stretch protocol", "35-min Tempo Run (threshold pace — slightly uncomfortable)", "Core stability: bird-dog, dead bug, side plank (3 rounds)", "Cool-down + log heart rate data", "Compression + diet recovery notes"],
    Advanced:     ["10-min progressive intensity warm-up", "45–60 min Zone 2 long run or bike", "Strength-endurance leg circuit (3 rounds)", "Cool-down walk + compression stretch", "Training load review + RPE score log"],
  },
  "Rehabilitation": {
    Beginner:     ["⚠ Confirm physio clearance before every session", "Gentle mobility — full range of motion checklist", "Low-load corrective exercises only (no spinal compression)", "No impact loading — stay entirely out of pain zone", "Document pain levels start & end (0–10 scale)"],
    Intermediate: ["10-min gentle mobility warm-up (active stretching)", "Corrective exercise circuit (light load, full control)", "Supporting muscle activation (glutes, core, scapula)", "Pain-free range progressive strengthening only", "Progress notes + physio update recommendation"],
    Advanced:     ["Full functional movement screening first", "Functional movement pattern loading (pain-free only)", "Progressive resistance — incremental loading increase", "Sport-specific re-integration drill (low speed)", "Recovery score + readiness check + next milestone"],
  },
  "General Fitness": {
    Beginner:     ["5-min walk + joint circles (neck, shoulder, hip)", "3×12 Full-body bodyweight circuit", "10-min easy cardio (walk or cycle)", "Core: 3×20s Plank hold", "Cool-down stretch — 5 min full body"],
    Intermediate: ["5–7 min dynamic warm-up", "4×10 Compound lift + 3×12 accessory work", "20-min moderate cardio (jog or cycle)", "Core circuit — 3 rounds (plank, ab wheel, side plank)", "Flexibility + foam rolling routine (10 min)"],
    Advanced:     ["Full activation warm-up (10 min)", "5×8 Heavy compound movement", "25-min moderate-high intensity cardio", "Athletic core circuit (L-sit, cable core, ab wheel)", "Mobility session + foam rolling (10 min)"],
  },
};

const MEDICAL_NOTES = {
  "Hypertension":     "Keep intensity moderate (RPE ≤ 6). Avoid heavy Valsalva manoeuvres. Monitor BP before & after.",
  "Diabetes":         "Check blood sugar before and after. Keep a glucose snack nearby. Avoid fasted training.",
  "Lower Back Pain":  "Avoid loaded spinal flexion. Focus on hip hinge over squat pattern. Core stabilisation is priority.",
  "Knee Injury":      "No deep knee flexion past 90°. Avoid impact loading. Emphasise quad & glute activation.",
  "Shoulder Injury":  "No overhead pressing. Rotator cuff activation first. Keep loads light, controlled range only.",
  "Heart Condition":  "⚠ Doctor clearance required. Keep HR < 130 BPM. Stop immediately if chest pain or dizziness.",
  "Asthma":           "Inhaler on standby. Avoid cold outdoor air training. Warm-up must be 10+ min gradual increase.",
  "Pregnancy":        "⚠ No supine exercises after week 16. No contact or impact. Monitor exertion with talk test.",
};

function getSessionPlan(goal, experience) {
  return SESSION_PLANS[goal]?.[experience] || SESSION_PLANS["General Fitness"]["Intermediate"];
}

// ── Client Profile Drawer (slide-up sheet) ─────────────────────
function ClientProfileDrawer({ client, onClose, onDelete }) {
  const goalColor  = GOAL_COLOR[client.primaryGoal] || "#ffcc00";
  const cfg        = SLOT_CONFIG[client.preferredSlot];
  const shiftLabel = cfg ? (cfg.shift === "morning" ? "☀ Morning" : "🌙 Evening") : "—";
  const plan       = getSessionPlan(client.primaryGoal, client.experience);
  const medNote    = (client.medicalFlag && client.medicalFlag !== "None")
    ? (MEDICAL_NOTES[client.medicalFlag] || `Client has ${client.medicalFlag}. Adjust training accordingly.`)
    : null;
  const regDate = client.registeredAt
    ? new Date(client.registeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <>
      {/* Dark blur overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(5px)",
        }}
      />

      {/* Slide-up drawer */}
      <div
        className="client-drawer"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
          background: "#0b0d11",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px 24px 0 0",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "4px" }}>
          <div style={{ width: "44px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.1)" }} />
        </div>

        <div style={{ padding: "8px 20px 36px" }}>

          {/* ── Header: avatar + name + badges ── */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "20px" }}>
            <div style={{
              width: "58px", height: "58px", borderRadius: "18px", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px", fontWeight: 800,
              background: `${goalColor}18`, border: `2px solid ${goalColor}44`, color: goalColor,
            }}>
              {client.clientName?.[0]?.toUpperCase() || "?"}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                <h2 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "15px", fontWeight: 800, color: "#fff", margin: 0 }}>
                  {client.clientName}
                </h2>
                {medNote && (
                  <span style={{ fontSize: "9px", background: "rgba(255,77,77,0.15)", color: "#ff4d4d", border: "1px solid rgba(255,77,77,0.3)", borderRadius: "20px", padding: "2px 8px" }}>
                    ⚠ {client.medicalFlag}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", background: `${goalColor}18`, border: `1px solid ${goalColor}33`, color: goalColor }}>
                  {client.primaryGoal}
                </span>
                <span style={{ fontSize: "9px", padding: "3px 9px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}>
                  {EXP_ICON[client.experience]} {client.experience}
                </span>
                {regDate && (
                  <span style={{ fontSize: "9px", color: "#333", padding: "3px 9px", borderRadius: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    Registered {regDate}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              style={{ flexShrink: 0, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#555", borderRadius: "10px", width: "30px", height: "30px", cursor: "pointer", fontSize: "14px" }}
            >✕</button>
          </div>

          {/* ── Body stats grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(255,255,255,0.05)", borderRadius: "14px", overflow: "hidden", marginBottom: "14px" }}>
            {[
              { label: "Age",    value: client.age    ? `${client.age}y`   : "—", color: "#fff" },
              { label: "Weight", value: client.weight ? `${client.weight}kg` : "—", color: "#fff" },
              { label: "Fat%",   value: client.fat    ? `${client.fat}%`   : "—", color: client.fat > 25 ? "#ff4d4d" : "#00ffd5" },
              { label: "BMI",    value: client.bmi    ? client.bmi         : "—", color: "#ffcc00" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "#0e1014", padding: "12px 6px", textAlign: "center" }}>
                <p style={{ fontSize: "8px", color: "#444", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                <p style={{ fontSize: "13px", fontWeight: 800, color, margin: 0, fontFamily: "'Syncopate',sans-serif" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* ── Training info row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
            <div style={{ background: "rgba(255,204,0,0.04)", border: "1px solid rgba(255,204,0,0.12)", borderRadius: "12px", padding: "12px 14px" }}>
              <p style={{ fontSize: "8px", color: "#555", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Training Slot</p>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#ffcc00", margin: "0 0 2px" }}>{client.preferredSlot}</p>
              <p style={{ fontSize: "10px", color: "#444", margin: 0 }}>{shiftLabel}</p>
            </div>
            <div style={{ background: "rgba(0,255,213,0.04)", border: "1px solid rgba(0,255,213,0.12)", borderRadius: "12px", padding: "12px 14px" }}>
              <p style={{ fontSize: "8px", color: "#555", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sessions / Week</p>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#00ffd5", margin: "0 0 2px" }}>{client.sessionsPerWeek}×/week</p>
              <p style={{ fontSize: "10px", color: "#444", margin: 0 }}>{client.gender || "—"} · {client.experience}</p>
            </div>
          </div>

          {/* ── Medical alert ── */}
          {medNote && (
            <div style={{ background: "rgba(255,77,77,0.06)", border: "1px solid rgba(255,77,77,0.22)", borderRadius: "12px", padding: "12px 14px", marginBottom: "16px" }}>
              <p style={{ fontSize: "10px", fontWeight: 800, color: "#ff4d4d", margin: "0 0 5px", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.06em" }}>⚠ MEDICAL NOTE</p>
              <p style={{ fontSize: "11.5px", color: "rgba(255,120,120,0.75)", margin: 0, lineHeight: 1.6 }}>{medNote}</p>
            </div>
          )}

          {/* ── Today's session plan ── */}
          <div style={{ marginBottom: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ width: "3px", height: "18px", borderRadius: "2px", background: `linear-gradient(to bottom, ${goalColor}, transparent)` }} />
              <p style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "10px", fontWeight: 800, color: goalColor, margin: 0, letterSpacing: "0.1em" }}>
                TODAY'S SESSION PLAN
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {plan.map((step, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "10px",
                  background: step.startsWith("⚠") ? "rgba(255,77,77,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${step.startsWith("⚠") ? "rgba(255,77,77,0.18)" : "rgba(255,255,255,0.05)"}`,
                  borderRadius: "10px", padding: "10px 13px",
                }}>
                  <span style={{
                    fontSize: "9px", fontWeight: 800, fontFamily: "'Syncopate',sans-serif",
                    color: "#000", background: goalColor,
                    borderRadius: "6px", padding: "2px 6px", flexShrink: 0, marginTop: "2px",
                  }}>{String(i + 1).padStart(2, "0")}</span>
                  <p style={{ fontSize: "12px", color: step.startsWith("⚠") ? "#ff4d4d" : "#bbb", margin: 0, lineHeight: 1.55 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => { onDelete(client.id); onClose(); }}
              style={{
                flex: 1, background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.22)",
                color: "#ff4d4d", borderRadius: "12px", padding: "12px 8px",
                fontSize: "10px", fontWeight: 800, cursor: "pointer",
                fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.06em",
              }}
            >🗑 REMOVE</button>
            <button
              onClick={onClose}
              style={{
                flex: 2, background: `linear-gradient(135deg, ${goalColor}, #ff9900)`,
                border: "none", color: "#000", borderRadius: "12px", padding: "12px 8px",
                fontSize: "10px", fontWeight: 800, cursor: "pointer",
                fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.06em",
                boxShadow: `0 4px 20px ${goalColor}44`,
              }}
            >✓ GOT IT — LET'S TRAIN</button>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Pending-clients card list ─────────────────────────────────
function ClientCard({ client, onDelete, onView, tomorrowDay }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const goalColor = GOAL_COLOR[client.primaryGoal] || "#ffcc00";
  const cfg = SLOT_CONFIG[client.preferredSlot];
  const shiftLabel = cfg ? (cfg.shift === "morning" ? "Morning" : "Evening") : "Unknown";

  return (
    <div
      onClick={onView}
      className="rounded-2xl p-4 mb-3 relative client-card-hover"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${goalColor}44`;
        e.currentTarget.style.background  = `${goalColor}08`;
        e.currentTarget.style.transform   = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background  = "rgba(255,255,255,0.03)";
        e.currentTarget.style.transform   = "translateY(0)";
      }}
    >
      {/* Delete button — stopPropagation so it doesn't open profile */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(client.id); }}
        className="absolute top-3 right-3 text-gray-600 hover:text-red-400 transition-colors text-xs"
        title="Remove"
      >✕</button>

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

      {/* Tap hint */}
      <div style={{ marginTop: "10px", textAlign: "center", fontSize: "9px", color: `${goalColor}55`,
        fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.1em" }}>
        TAP TO VIEW SESSION PLAN →
      </div>
    </div>
  );
}

// ── Main RosterTab ─────────────────────────────────────────────
export default function RosterTab() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

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

  async function handleDelete(id) {
    const updated = clients.filter((c) => c.id !== id);
    setClients(updated);
    await deleteClient(id);   // removes from localStorage + MongoDB
  }

  const { morningRows, eveningRows, tomorrowDay, errors } = buildMergedGrids(clients);

  return (
    <>
      {/* ── Client Profile Drawer ─────────────────────── */}
      {selectedClient && (
        <ClientProfileDrawer
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onDelete={handleDelete}
        />
      )}

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
          {clients.map((c) => (
            <ClientCard
              key={c.id}
              client={c}
              onDelete={handleDelete}
              onView={() => setSelectedClient(c)}
              tomorrowDay={tomorrowDay}
            />
          ))}
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

      {/* ── Shift Grids — real schedule + new clients on tomorrow's row ── */}
      <ShiftGrid
        title={`Morning Shift: 6am – 11am  (tomorrow = ${tomorrowDay})`}
        headers={["6–7", "7–8", "8–9", "9–10", "10–11"]}
        rows={morningRows}
        highlightDay={tomorrowDay}
        weekOffDays={WEEK_OFF_DAYS}
      />
      <ShiftGrid
        title={`Evening Shift: 5pm – 10pm  (tomorrow = ${tomorrowDay})`}
        headers={["5–6", "6–7", "7–8", "8–9", "9–10"]}
        rows={eveningRows}
        highlightDay={tomorrowDay}
        weekOffDays={WEEK_OFF_DAYS}
      />
    </>
  );
}
