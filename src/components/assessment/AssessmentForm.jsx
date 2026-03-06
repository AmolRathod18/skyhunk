// AssessmentWizard.jsx — 7-step guided assessment form
// One section at a time, progress bar, Back/Next navigation
import { useState } from "react";

// ── Field Components ─────────────────────────────────────────
function Input({ label, id, values, setValues, placeholder = "0", type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="field-label">{label}</label>
      <input
        type={type}
        className="assess-input"
        placeholder={placeholder}
        value={values[id]}
        onChange={(e) => setValues((p) => ({ ...p, [id]: e.target.value }))}
      />
    </div>
  );
}

function Select({ label, id, values, setValues, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="field-label">{label}</label>
      <select
        className="assess-input"
        value={values[id]}
        onChange={(e) => setValues((p) => ({ ...p, [id]: e.target.value }))}
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  );
}

// ── Wizard Step Definitions ──────────────────────────────────
const STEPS = [
  {
    id: 1,
    title: "Client Info",
    subtitle: "Basic details about the client",
    icon: "👤",
    render: (v, sv) => {
      // ── Live slot-conflict check ──────────────────────────
      const existing      = JSON.parse(localStorage.getItem("gym_clients") || "[]");
      const conflictClient = existing.find(
        (c) => c.preferredSlot === v.preferredSlot
      );
      const isSlotTaken    = !!conflictClient;
      const isReturning    = v.clientName.trim() &&
        existing.find((c) => c.clientName.trim().toLowerCase() === v.clientName.trim().toLowerCase());

      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input label="Full Name" id="clientName" values={v} setValues={sv} placeholder="e.g. Rahul Sharma" />
          </div>
          <Input label="Age (years)" id="age" values={v} setValues={sv} placeholder="25" />
          <Select label="Gender" id="gender" values={v} setValues={sv} options={["Male", "Female", "Other"]} />
          <Input label="Height (cm)" id="height" values={v} setValues={sv} placeholder="170" />
          <Select label="Experience Level" id="experience" values={v} setValues={sv}
            options={["Beginner", "Intermediate", "Advanced"]} />
          <div className="col-span-2">
            <div className="flex flex-col gap-1">
              <label className="field-label">Assigned Trainer</label>
              <div
                className="assess-input flex items-center gap-2"
                style={{ color: "#ffcc00", fontWeight: 700 }}
              >
                <span>🏆</span> Akash Athavani <span className="ml-auto text-xs text-gray-600">Head Coach</span>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <Select label="Preferred Training Slot" id="preferredSlot" values={v} setValues={sv} options={TIME_SLOTS} />
            {/* ── Slot conflict warning ── */}
            {isSlotTaken ? (
              <div className="mt-2 text-xs rounded-lg px-3 py-2 flex items-start gap-2"
                style={{ background: "rgba(255,77,77,0.09)", color: "#ff4d4d", border: "1px solid rgba(255,77,77,0.25)" }}>
                <span>🚫</span>
                <span>
                  <strong>{v.preferredSlot}</strong> is already booked by <strong>{conflictClient.clientName}</strong>.
                  Please choose a different slot.
                </span>
              </div>
            ) : (
              <div className="mt-2 text-xs rounded-lg px-3 py-1.5 flex items-center gap-2"
                style={{ background: "rgba(0,255,213,0.05)", color: "#00ffd5", border: "1px solid rgba(0,255,213,0.15)" }}>
                <span>✅</span> Slot available
              </div>
            )}
          </div>
          <div className="col-span-2">
            <Select label="Medical Condition / Flag" id="medicalFlag" values={v} setValues={sv}
              options={["None", "Knee Pain", "Lower Back Pain", "Shoulder Injury", "Hypertension", "Diabetes", "Post Surgery"]} />
          </div>
          {/* ── Returning client notice ── */}
          {isReturning && (
            <div className="col-span-2 text-xs rounded-lg px-3 py-2 flex items-center gap-2"
              style={{ background: "rgba(255,204,0,0.06)", color: "#ffcc00", border: "1px solid rgba(255,204,0,0.2)" }}>
              <span>ℹ️</span> <strong>{v.clientName}</strong> is already registered — a new assessment will be added.
            </div>
          )}
        </div>
      );
    },
    validate: (v) => {
      if (!v.clientName.trim()) return "Please enter client name.";
      // Block booking if slot is already taken
      const existing = JSON.parse(localStorage.getItem("gym_clients") || "[]");
      const conflict  = existing.find((c) => c.preferredSlot === v.preferredSlot);
      if (conflict)
        return `Slot "${v.preferredSlot}" is already booked by ${conflict.clientName}. Please choose another slot to continue.`;
      return null;
    },
  },
  {
    id: 2,
    title: "Goal Setting",
    subtitle: "What does the client want to achieve?",
    icon: "🎯",
    render: (v, sv) => (
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Select label="Primary Goal" id="primaryGoal" values={v} setValues={sv}
            options={["Weight Loss", "Muscle Gain", "Athletic Performance", "Endurance", "Rehabilitation", "General Fitness"]} />
        </div>
        <Input label="Target Duration (weeks)" id="targetWeeks" values={v} setValues={sv} placeholder="12" />
        <Select label="Sessions per Week" id="sessionsPerWeek" values={v} setValues={sv}
          options={["2", "3", "4", "5", "6"]} />
      </div>
    ),
  },
  {
    id: 3,
    title: "Body Composition",
    subtitle: "Weight, fat %, and auto-calculated BMI",
    icon: "⚖️",
    render: (v, sv) => {
      const bmi = v.weight && v.height
        ? (parseFloat(v.weight) / Math.pow(parseFloat(v.height) / 100, 2)).toFixed(1)
        : null;
      const bmiColor = bmi < 18.5 ? "#ffcc00" : bmi < 25 ? "#00ffd5" : bmi < 30 ? "#ffcc00" : "#ff4d4d";
      const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
      return (
        <div className="grid grid-cols-2 gap-4">
          <Input label="Current Weight (kg)" id="weight" values={v} setValues={sv} placeholder="70" />
          <Input label="Body Fat %" id="fat" values={v} setValues={sv} placeholder="20" />
          <Input label="Skeletal Muscle %" id="muscle" values={v} setValues={sv} placeholder="35" />
          <div className="flex flex-col gap-1">
            <label className="field-label">BMI (auto)</label>
            <div
              className="assess-input flex items-center justify-between"
              style={{ color: bmi ? bmiColor : "#444" }}
            >
              <span>{bmi ?? "—"}</span>
              {bmi && <span style={{ fontSize: "0.6rem" }}>{bmiLabel}</span>}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: 4,
    title: "Strength Test",
    subtitle: "1-minute AMRAP for each movement",
    icon: "💪",
    render: (v, sv) => (
      <div className="grid grid-cols-1 gap-4">
        <Input label="Squats — 1 Min Max Reps" id="squats" values={v} setValues={sv} placeholder="Reps" />
        <Input label="Pushups — 1 Min Max Reps" id="pushups" values={v} setValues={sv} placeholder="Reps" />
        <Input label="Inverted Rows — 1 Min Max Reps" id="rows" values={v} setValues={sv} placeholder="Reps" />
        <div className="rounded-xl px-4 py-3 text-xs text-gray-500" style={{ background: "rgba(255,204,0,0.04)", border: "1px solid rgba(255,204,0,0.1)" }}>
          ℹ️ Perform each test with 2 min rest between. Count only full reps.
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "McGill Core Test",
    subtitle: "Hold each position for max seconds",
    icon: "🧠",
    render: (v, sv) => {
      const sbl = parseFloat(v.sbl) || 0;
      const sbr = parseFloat(v.sbr) || 0;
      const imbalanced = sbl > 0 && sbr > 0 && Math.abs(sbl - sbr) > 5;
      return (
        <div className="grid grid-cols-2 gap-4">
          <Input label="V-Hold (sec)" id="vhold" values={v} setValues={sv} placeholder="0" />
          <Input label="Plank (sec)" id="plank" values={v} setValues={sv} placeholder="0" />
          <Input label="Side Bridge Left (sec)" id="sbl" values={v} setValues={sv} placeholder="0" />
          <Input label="Side Bridge Right (sec)" id="sbr" values={v} setValues={sv} placeholder="0" />
          {imbalanced && (
            <div className="col-span-2 rounded-xl px-4 py-2 text-xs" style={{ background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.2)", color: "#ff4d4d" }}>
              ⚠ Side bridge imbalance detected ({sbl < sbr ? "Left" : "Right"} side is weaker).
            </div>
          )}
          <div className="col-span-2 rounded-xl px-4 py-3 text-xs text-gray-500" style={{ background: "rgba(255,204,0,0.04)", border: "1px solid rgba(255,204,0,0.1)" }}>
            ℹ️ McGill Big 3: V-Hold tests flexors, Plank tests extensors, Side Bridge tests lateral stability.
          </div>
        </div>
      );
    },
  },
  {
    id: 6,
    title: "Cardio Assessment",
    subtitle: "Resting heart rate and cardio test result",
    icon: "❤️",
    render: (v, sv) => {
      const hr = parseInt(v.restingHR) || 0;
      const hrLabel = hr === 0 ? null : hr < 60 ? { l: "Athlete", c: "#00ffd5" } : hr <= 72 ? { l: "Good", c: "#00ffd5" } : hr <= 85 ? { l: "Average", c: "#ffcc00" } : { l: "High", c: "#ff4d4d" };
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="field-label">Resting Heart Rate (bpm)</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                className="assess-input flex-1"
                placeholder="72"
                value={v.restingHR}
                onChange={(e) => sv((p) => ({ ...p, restingHR: e.target.value }))}
              />
              {hrLabel && (
                <span className="text-xs font-bold shrink-0" style={{ color: hrLabel.c }}>{hrLabel.l}</span>
              )}
            </div>
          </div>
          <Select label="Cardio Test Used" id="cardioTest" values={v} setValues={sv}
            options={["Step Test", "12-Min Run", "Beep Test", "Treadmill VO2"]} />
          <div className="col-span-2">
            <Input label="Test Score / Result" id="cardioScore" values={v} setValues={sv} placeholder="e.g. 42 ml/kg/min" />
          </div>
        </div>
      );
    },
  },
  {
    id: 7,
    title: "Posture Analysis",
    subtitle: "Identify the primary postural deviation",
    icon: "🦴",
    render: (v, sv) => {
      const corrections = {
        Optimal:   { c: "#00ffd5", text: "Great posture. Maintain with daily mobility work." },
        Kyphosis:  { c: "#ffcc00", text: "Strengthen upper pull chain. Stretch pectorals daily." },
        Lordosis:  { c: "#ffcc00", text: "Release hip flexors. Activate deep core (dead bug, bird dog)." },
        Scoliosis: { c: "#ff4d4d", text: "Unilateral correction exercises. Physio referral advised." },
        Flatback:  { c: "#ffcc00", text: "Hip extension mobility. Posterior chain strengthening." },
      };
      const hint = corrections[v.posture];
      return (
        <div className="grid grid-cols-1 gap-4">
          <Select label="Primary Postural Deviation" id="posture" values={v} setValues={sv}
            options={[
              { value: "Optimal",   label: "✅ Optimal Alignment" },
              { value: "Kyphosis",  label: "⚠ Kyphosis (Rounded Shoulders)" },
              { value: "Lordosis",  label: "⚠ Lordosis (Lower Back Arch)" },
              { value: "Scoliosis", label: "🔴 Scoliosis (Side Curvature)" },
              { value: "Flatback",  label: "⚠ Flatback" },
            ]}
          />
          {hint && (
            <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${hint.c}22`, color: hint.c }}>
              <span className="block text-xs font-bold mb-1">CORRECTION PROTOCOL</span>
              {hint.text}
            </div>
          )}
        </div>
      );
    },
  },
];

const TIME_SLOTS = [
  // Morning — 6 AM to 11 AM
  { value: "6-7 AM",   label: "6:00 – 7:00 AM   (Morning)" },
  { value: "7-8 AM",   label: "7:00 – 8:00 AM   (Morning)" },
  { value: "8-9 AM",   label: "8:00 – 9:00 AM   (Morning)" },
  { value: "9-10 AM",  label: "9:00 – 10:00 AM  (Morning)" },
  { value: "10-11 AM", label: "10:00 – 11:00 AM (Morning)" },
  // Evening — 5 PM to 10 PM
  { value: "5-6 PM",   label: "5:00 – 6:00 PM   (Evening)" },
  { value: "6-7 PM",   label: "6:00 – 7:00 PM   (Evening)" },
  { value: "7-8 PM",   label: "7:00 – 8:00 PM   (Evening)" },
  { value: "8-9 PM",   label: "8:00 – 9:00 PM   (Evening)" },
  { value: "9-10 PM",  label: "9:00 – 10:00 PM  (Evening)" },
];

const INITIAL_VALUES = {
  clientName: "", age: "", gender: "Male", height: "", experience: "Beginner", medicalFlag: "None",
  trainer: "Akash Athavani",
  preferredSlot: "6-7 AM",
  primaryGoal: "Weight Loss", targetWeeks: "12", sessionsPerWeek: "3",
  weight: "", fat: "", muscle: "",
  squats: "", pushups: "", rows: "",
  vhold: "", plank: "", sbl: "", sbr: "",
  restingHR: "", cardioTest: "Step Test", cardioScore: "",
  posture: "Optimal",
};

// ── Progress Bar ─────────────────────────────────────────────
function ProgressBar({ current, total }) {
  const pct = Math.round(((current) / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500">Step {current} of {total}</span>
        <span className="text-xs font-bold" style={{ color: "#ffcc00" }}>{pct}%</span>
      </div>
      <div className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-1 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #ffcc00, #00ffd5)" }}
        />
      </div>
    </div>
  );
}

// ── Step Dots ────────────────────────────────────────────────
function StepDots({ current, total, onGo }) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => i + 1 < current && onGo(i + 1)}
          className="rounded-full transition-all"
          style={{
            width:  i + 1 === current ? "24px" : "8px",
            height: "8px",
            background: i + 1 <= current ? "#ffcc00" : "rgba(255,255,255,0.1)",
            cursor: i + 1 < current ? "pointer" : "default",
          }}
        />
      ))}
    </div>
  );
}

// ── Main Wizard Component ─────────────────────────────────────
export default function AssessmentWizard({ onComplete, onBack, initialValues }) {
  const [step, setStep]     = useState(1);
  const [values, setValues] = useState(initialValues || INITIAL_VALUES);
  const [error, setError]   = useState(null);

  const current = STEPS[step - 1];
  const isLast  = step === STEPS.length;

  function handleNext() {
    if (current.validate) {
      const msg = current.validate(values);
      if (msg) { setError(msg); return; }
    }
    setError(null);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    if (step === 1) { onBack(); return; }
    setError(null);
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit() {
    setError(null);
    onComplete(values);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#05070a" }}>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={handleBack}
          className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
        >
          ← {step === 1 ? "Back to Home" : "Back"}
        </button>
        <span
          className="text-xs font-bold tracking-widest"
          style={{ fontFamily: "'Syncopate',sans-serif", color: "#ffcc00" }}
        >
          Fitness Assessment
        </span>
        <span className="text-xs text-gray-600">{step}/{STEPS.length}</span>
      </div>

      {/* ── Form Card ───────────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Progress */}
          <ProgressBar current={step} total={STEPS.length} />
          <StepDots current={step} total={STEPS.length} onGo={setStep} />

          {/* Step Card */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Step Header */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "rgba(255,204,0,0.1)", border: "1px solid rgba(255,204,0,0.2)" }}
              >
                {current.icon}
              </span>
              <div>
                <h2
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: "'Syncopate',sans-serif", letterSpacing: "1px" }}
                >
                  {current.title}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">{current.subtitle}</p>
              </div>
            </div>

            {/* Fields */}
            {current.render(values, setValues)}

            {/* Error */}
            {error && (
              <div className="mt-4 text-xs rounded-lg px-3 py-2" style={{ background: "rgba(255,77,77,0.1)", color: "#ff4d4d", border: "1px solid rgba(255,77,77,0.2)" }}>
                {error}
              </div>
            )}
          </div>

          {/* ── Navigation ──────────────────────────────────── */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-xl text-xs font-bold transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#666" }}
            >
              ← Back
            </button>
            {isLast ? (
              <button
                onClick={handleSubmit}
                className="flex-2 w-full py-3 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 orbitron"
                style={{ flex: 2, background: "linear-gradient(135deg, #ffcc00, #ff9900)" }}
              >
                ⚡ Generate Report
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="rounded-xl text-xs font-bold text-black transition-all hover:opacity-90"
                style={{ flex: 2, background: "#ffcc00", padding: "12px 0" }}
              >
                Next →
              </button>
            )}
          </div>

          {/* Names preview while filling */}
          {values.clientName && (
            <p className="text-center text-xs text-gray-600 mt-4">
              Assessing: <span style={{ color: "#ffcc00" }}>{values.clientName}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

