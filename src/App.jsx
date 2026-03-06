import { useState, useEffect } from "react";
import LandingPage    from "./components/LandingPage";
import AssessmentWizard from "./components/assessment/AssessmentForm";
import ReportPage     from "./components/ReportPage";
import RosterTab           from "./components/tabs/RosterTab";
import DailyOpsTab         from "./components/tabs/DailyOpsTab";
import ClientDirectoryTab  from "./components/tabs/ClientDirectoryTab";
import NutritionPage  from "./components/NutritionPage";
import { generateReport } from "./utils/reportGenerator";
import { saveClient }     from "./utils/apiService";
import { morning, evening } from "./data/scheduleData";

// Count unique named slots in the static schedule (17 real clients)
const STATIC_CLIENT_COUNT = (function () {
  const seen = new Set();
  for (const row of [...morning, ...evening]) {
    for (const cell of row.slice(1)) {
      if (cell) seen.add(cell);
    }
  }
  return seen.size;
})();

// ── Parse raw string values from AssessmentWizard ────────────
function parseValues(v) {
  return {
    clientName:      v.clientName,
    age:             parseInt(v.age)             || 0,
    gender:          v.gender,
    height:          parseFloat(v.height)        || 0,
    experience:      v.experience,
    medicalFlag:     v.medicalFlag,
    primaryGoal:     v.primaryGoal,
    targetWeeks:     parseInt(v.targetWeeks)     || 12,
    sessionsPerWeek: parseInt(v.sessionsPerWeek) || 3,
    weight:          parseFloat(v.weight)        || 0,
    fat:             parseFloat(v.fat)           || 0,
    muscle:          parseFloat(v.muscle)        || 0,
    squats:          parseInt(v.squats)          || 0,
    pushups:         parseInt(v.pushups)         || 0,
    rows:            parseInt(v.rows)            || 0,
    vhold:           parseInt(v.vhold)           || 0,
    plank:           parseInt(v.plank)           || 0,
    sbl:             parseInt(v.sbl)             || 0,
    sbr:             parseInt(v.sbr)             || 0,
    restingHR:       parseInt(v.restingHR)       || 0,
    cardioTest:      v.cardioTest,
    cardioScore:     parseFloat(v.cardioScore)   || 0,
    posture:         v.posture,
  };
}

// ── Dashboard helpers ─────────────────────────────────────────
const DASHBOARD_TABS = [
  { id: "clients", label: "CLIENTS",  icon: "👥" },
  { id: "roster",  label: "ROSTER",   icon: "🗓" },
  { id: "daily",   label: "24H OPS",  icon: "⚡" },
];

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function getGreeting(h) {
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

// Morning 6–11, Evening 17–22
function getShiftStatus(h) {
  if (h >= 6  && h < 11) return { on: true, label: "MORNING SHIFT",  color: "#ffcc00", glow: "rgba(255,204,0,0.35)" };
  if (h >= 17 && h < 22) return { on: true, label: "EVENING SHIFT",  color: "#00ffd5", glow: "rgba(0,255,213,0.3)" };
  return { on: false, label: "OFF SHIFT", color: "#444", glow: "transparent" };
}

function useTodayStats() {
  const [stats, setStats] = useState({ totalClients: STATIC_CLIENT_COUNT, newToday: 0 });
  useEffect(() => {
    function compute() {
      const all = JSON.parse(localStorage.getItem("gym_clients") || "[]");
      const todayStr = new Date().toDateString();
      const newToday = all.filter(c => new Date(c.registeredAt).toDateString() === todayStr).length;
      // Total = real schedule clients + newly registered (assessment) clients
      setStats({ totalClients: STATIC_CLIENT_COUNT + all.length, newToday });
    }
    compute();
    const id = setInterval(compute, 5000);
    return () => clearInterval(id);
  }, []);
  return stats;
}

// ── Trainer Dashboard ────────────────────────────────────────
function TrainerDashboard({ onHome }) {
  const [tab,   setTab]   = useState("roster");
  const [photo, setPhoto] = useState(() => localStorage.getItem("trainer_photo") || "/akash.png");
  const now    = useLiveClock();
  const stats  = useTodayStats();
  const hour   = now.getHours();
  const shift  = getShiftStatus(hour);

  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const dateStr = now.toLocaleDateString("en-IN",  { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      localStorage.setItem("trainer_photo", ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhoto(null);
    localStorage.removeItem("trainer_photo");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#05070a" }}>

      {/* ════════════════════════════════════════════════════
          TOP NAV BAR
      ════════════════════════════════════════════════════ */}
      <div
        className="flex items-center justify-between px-5 py-3 sticky top-0 z-50 dash-topbar"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(5,7,10,0.92)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Left — back */}
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-xs font-bold transition-all hover:opacity-80"
          style={{ color: "#555", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.06em" }}
        >
          <span style={{ fontSize: "16px" }}>←</span> HOME
        </button>

        {/* Centre — brand */}
        <div className="flex items-center gap-2">
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: shift.color,
            boxShadow: `0 0 8px ${shift.glow}`, display: "inline-block" }}
            className={shift.on ? "dash-pulse-dot" : ""} />
          <span style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "11px", fontWeight: 800,
            color: "#ffcc00", letterSpacing: "0.12em" }}>
            SKYHUNK OS
          </span>
        </div>

        {/* Right — live clock */}
        <div className="text-right hidden sm:block">
          <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#ffcc00", fontWeight: 700, letterSpacing: "0.05em" }}>
            {timeStr}
          </p>
        </div>
        {/* mobile — just dot */}
        <div className="block sm:hidden">
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: shift.color, display: "inline-block" }}
            className={shift.on ? "dash-pulse-dot" : ""} />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PROFILE HERO BANNER
      ════════════════════════════════════════════════════ */}
      <div
        className="dash-hero-banner"
        style={{
          background: "linear-gradient(135deg, rgba(255,204,0,0.04) 0%, rgba(5,7,10,0) 60%), rgba(5,7,10,1)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "24px 24px 0",
        }}
      >
        <div className="max-w-6xl mx-auto">

          {/* ── Profile row ─────────────────────────────── */}
          <div className="flex items-start gap-4 mb-6">

            {/* Avatar */}
            <div className="relative group shrink-0">
              <div
                className="dash-avatar"
                style={{
                  width: "72px", height: "72px", borderRadius: "20px",
                  overflow: "hidden",
                  border: `2px solid ${shift.on ? shift.color : "rgba(255,204,0,0.3)"}`,
                  boxShadow: shift.on ? `0 0 20px ${shift.glow}` : "none",
                  transition: "border-color 1s, box-shadow 1s",
                  background: "rgba(255,204,0,0.06)",
                }}
              >
                {photo ? (
                  <img src={photo} alt="Akash" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "28px", color: "rgba(255,204,0,0.4)" }}>👤</div>
                )}
              </div>
              {/* Upload overlay on hover */}
              <label
                className="absolute inset-0 rounded-2xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.7)", borderRadius: "20px" }}
                title="Change photo"
              >
                <span style={{ fontSize: "18px" }}>📷</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
              {/* Shift status dot on avatar */}
              <span style={{
                position: "absolute", bottom: "4px", right: "4px",
                width: "11px", height: "11px", borderRadius: "50%",
                background: shift.color,
                border: "2px solid #05070a",
                boxShadow: `0 0 6px ${shift.glow}`,
              }} className={shift.on ? "dash-pulse-dot" : ""} />
            </div>

            {/* Name + info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "clamp(14px,3vw,20px)",
                  fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "0.04em" }}>
                  Akash
                  <span style={{ color: "#ffcc00", marginLeft: "6px" }}>Athavani</span>
                </h1>
                {/* Shift badge */}
                <span style={{
                  fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em",
                  fontFamily: "'Syncopate',sans-serif",
                  color: shift.on ? "#05070a" : "#555",
                  background: shift.on ? shift.color : "rgba(255,255,255,0.05)",
                  border: shift.on ? "none" : "1px solid #333",
                  borderRadius: "20px", padding: "3px 10px",
                }}>
                  {shift.label}
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "#555", margin: "0 0 6px", fontWeight: 500 }}>
                Head Coach · Cult Neo Gym, Bengaluru · NASM Certified
              </p>
              <p style={{ fontSize: "10px", color: "#333", margin: 0, fontFamily: "monospace" }}>
                {dateStr}
              </p>
            </div>

            {/* Remove photo button (top right) */}
            {photo && (
              <button
                onClick={removePhoto}
                style={{ background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.2)",
                  color: "#ff4d4d", borderRadius: "8px", padding: "4px 8px", fontSize: "10px",
                  cursor: "pointer", flexShrink: 0 }}
                title="Remove photo"
              >✕</button>
            )}
          </div>

          {/* ── Stats Strip ─────────────────────────────── */}
          <div
            className="dash-stats-strip"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "16px 16px 0 0",
              overflow: "hidden",
              marginBottom: 0,
            }}
          >
            {[
              { value: stats.totalClients, label: "Total Clients",    color: "#ffcc00", icon: "👥" },
              { value: stats.newToday,     label: "New Today",        color: "#00ffd5", icon: "✨" },
              { value: "MON–FRI",          label: "Active Days",      color: "#fff",    icon: "📅" },
              { value: "SAT OFF",          label: "Week Off",         color: "#555",    icon: "🛌" },
            ].map(({ value, label, color, icon }) => (
              <div
                key={label}
                style={{ background: "#05070a", padding: "14px 10px", textAlign: "center" }}
              >
                <div style={{ fontSize: "16px", marginBottom: "4px" }}>{icon}</div>
                <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "clamp(11px,2vw,16px)",
                  fontWeight: 800, color, marginBottom: "3px", letterSpacing: "0.02em" }}>
                  {value}
                </div>
                <div style={{ fontSize: "9px", color: "#444", letterSpacing: "0.08em",
                  textTransform: "uppercase", fontWeight: 600 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          TAB CONTENT
      ════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Tab Navigation */}
        <div
          style={{
            display: "flex", gap: "6px", padding: "14px 0 10px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            marginBottom: "20px",
          }}
        >
          {DASHBOARD_TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "8px 18px", borderRadius: "50px",
                  fontFamily: "'Syncopate',sans-serif", fontSize: "10px",
                  fontWeight: 800, letterSpacing: "0.1em",
                  cursor: "pointer", transition: "all 0.2s",
                  border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
                  background: active
                    ? "linear-gradient(135deg, #ffcc00, #ff9900)"
                    : "rgba(255,255,255,0.02)",
                  color: active ? "#000" : "#555",
                  boxShadow: active ? "0 4px 20px rgba(255,204,0,0.25)" : "none",
                  transform: active ? "translateY(-1px)" : "translateY(0)",
                }}
              >
                <span style={{ fontSize: "14px" }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}

          {/* Right side — greeting */}
          <div
            className="ml-auto hidden sm:flex items-center gap-2"
            style={{ fontSize: "11px", color: "#444", fontStyle: "italic" }}
          >
            <span>{getGreeting(hour)}, Akash 👊</span>
          </div>
        </div>

        {/* Tab panels */}
        <div className="dash-tab-panel">
          {tab === "clients" && <ClientDirectoryTab />}
          {tab === "roster"  && <RosterTab />}
          {tab === "daily"   && <DailyOpsTab />}
        </div>
      </div>
    </div>
  );
}

// ── Root App ─────────────────────────────────────────────────
export default function App() {
  const [page,      setPage]      = useState("landing");
  const [report,    setReport]    = useState(null);
  const [rawValues, setRawValues] = useState(null);

  async function handleAssessmentComplete(values) {
    const parsed = parseValues(values);
    const result = generateReport(parsed);
    setRawValues(values);
    setReport(result);

    // ── Persist client registration (localStorage + MongoDB if online) ──
    const bmi = values.height && values.weight
      ? (parseFloat(values.weight) / Math.pow(parseFloat(values.height) / 100, 2)).toFixed(1)
      : null;
    const entry = {
      id:            Date.now(),
      registeredAt:  new Date().toISOString(),
      clientName:    values.clientName,
      age:           values.age,
      gender:        values.gender,
      experience:    values.experience,
      primaryGoal:   values.primaryGoal,
      sessionsPerWeek: values.sessionsPerWeek,
      medicalFlag:   values.medicalFlag,
      trainer:       values.trainer,
      preferredSlot: values.preferredSlot,
      weight:        values.weight,
      fat:           values.fat,
      bmi,
    };
    try {
      await saveClient(entry);
    } catch (err) {
      // Slot conflict or network error — AssessmentForm already validates, this is a safety net
      console.warn("saveClient:", err.message);
    }

    setPage("report");
    window.scrollTo({ top: 0 });
  }

  if (page === "landing")    return <LandingPage onStart={() => setPage("assessment")} onDashboard={() => setPage("dashboard")} onNutrition={() => setPage("nutrition")} />;
  if (page === "assessment") return <AssessmentWizard onComplete={handleAssessmentComplete} onBack={() => setPage("landing")} initialValues={rawValues} />;
  if (page === "report")     return <ReportPage report={report} rawValues={rawValues} onNewAssessment={() => { setRawValues(null); setPage("landing"); }} onEdit={() => setPage("assessment")} />;
  if (page === "dashboard")  return <TrainerDashboard onHome={() => setPage("landing")} />;
  if (page === "nutrition")  return <NutritionPage onHome={() => setPage("landing")} onStart={() => setPage("assessment")} />;
  return null;
}
