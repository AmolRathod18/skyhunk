import { useState } from "react";
import LandingPage    from "./components/LandingPage";
import AssessmentWizard from "./components/assessment/AssessmentForm";
import ReportPage     from "./components/ReportPage";
import NavTabs        from "./components/NavTabs";
import RosterTab      from "./components/tabs/RosterTab";
import DailyOpsTab    from "./components/tabs/DailyOpsTab";
import NutritionPage  from "./components/NutritionPage";
import { generateReport } from "./utils/reportGenerator";
import { saveClient }     from "./utils/apiService";

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

// ── Trainer Dashboard ────────────────────────────────────────
const DASHBOARD_TABS = [
  { id: "roster", label: "ROSTER" },
  { id: "daily",  label: "24H OPS" },
];

function TrainerDashboard({ onHome }) {
  const [tab,   setTab]   = useState("roster");
  const [photo, setPhoto] = useState(() => localStorage.getItem("trainer_photo") || "/akash.png");

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPhoto(dataUrl);
      localStorage.setItem("trainer_photo", dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhoto(null);
    localStorage.removeItem("trainer_photo");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#05070a" }}>

      {/* ── Top Bar ───────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-50"
        style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "#05070a" }}
      >
        <button onClick={onHome} className="text-xs text-gray-500 hover:text-white transition-colors">
          ← Home
        </button>

        {/* ── Trainer Profile (centre) ──────────────────── */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative group">
            <div
              className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center shrink-0"
              style={{ border: "2px solid rgba(255,204,0,0.4)", background: "rgba(255,204,0,0.08)" }}
            >
              {photo ? (
                <img src={photo} alt="Trainer" className="w-full h-full object-cover" />
              ) : (
                <img src="/akash.png" alt="Trainer" className="w-full h-full object-cover" />
              )}
            </div>

            {/* Hover overlay — upload / remove */}
            <label
              className="absolute inset-0 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.65)" }}
              title="Change photo"
            >
              <span className="text-xs">📷</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {/* Name + title */}
          <div>
            <p
              className="text-sm font-bold leading-tight"
              style={{ fontFamily: "'Syncopate',sans-serif", color: "#ffcc00" }}
            >
              Akash Athavani
            </p>
            <p className="text-xs text-gray-600 leading-tight">Head Coach · Cult Neo Gym</p>
          </div>

          {/* Remove photo (only when photo exists) */}
          {photo && (
            <button
              onClick={removePhoto}
              className="text-xs text-gray-700 hover:text-red-400 transition-colors ml-1"
              title="Remove photo"
            >
              ✕
            </button>
          )}
        </div>

        <span className="w-20" />
      </div>

      {/* Upload hint (shown once, until photo is set) */}
      {!photo && (
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <label
            className="flex items-center gap-2 w-fit cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
            style={{ background: "rgba(255,204,0,0.08)", color: "#ffcc00", border: "1px dashed rgba(255,204,0,0.3)" }}
          >
            📷 Upload your profile photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pb-16 pt-4">
        <NavTabs active={tab} onChange={setTab} tabs={DASHBOARD_TABS} />
        <div className="mt-4">
          {tab === "roster" && <RosterTab />}
          {tab === "daily"  && <DailyOpsTab />}
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
