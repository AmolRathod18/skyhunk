// ReportPage.jsx — Styled sections + Confirmation
import { useState } from "react";
import BodyDiagram from "./BodyDiagram";

const GOAL_COLOR = {
  "Weight Loss":          "#ff4d4d",
  "Muscle Gain":          "#00ffd5",
  "Athletic Performance": "#ffcc00",
  "Endurance":            "#00bfff",
  "Rehabilitation":       "#ff9900",
  "General Fitness":      "#aaa",
};

const SCORE_COLOR = { GOOD: "#00ffd5", AVERAGE: "#ffcc00", "NEEDS WORK": "#ff4d4d", NORMAL: "#00ffd5", OVERWEIGHT: "#ffcc00", OBESE: "#ff4d4d", UNDERWEIGHT: "#ffcc00", ATHLETE: "#00ffd5", HIGH: "#ff4d4d" };
const BADGE_META  = { bmi: { label:"BMI", icon:"⚖️" }, fat: { label:"Body Fat", icon:"📊" }, squats: { label:"Squats", icon:"🦵" }, pushups: { label:"Pushups", icon:"💪" }, rows: { label:"Rows", icon:"🏋️" }, plank: { label:"Plank", icon:"🧠" }, hr: { label:"Resting HR", icon:"❤️" } };

function InfoRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor:"rgba(255,255,255,0.05)" }}>
      <span style={{ color:"#555", fontSize:"0.8rem" }}>{label}</span>
      <span className="font-bold" style={{ color: color || "#e0e0e0", fontSize:"0.85rem" }}>{value}</span>
    </div>
  );
}

function SectionCard({ icon, title, children, accentColor }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${accentColor || "rgba(255,255,255,0.08)"}22` }}>
      <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor:"rgba(255,255,255,0.05)", background:"rgba(255,255,255,0.015)" }}>
        <span style={{ fontSize:"1.1rem" }}>{icon}</span>
        <h3 className="font-bold tracking-widest" style={{ fontFamily:"'Syncopate',sans-serif", color: accentColor || "#ffcc00", fontSize:"0.7rem" }}>{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function ScorePill({ label }) {
  const c = SCORE_COLOR[label] || "#888";
  return <span className="px-2 py-0.5 rounded-full font-bold" style={{ background:`${c}18`, color:c, border:`1px solid ${c}33`, fontSize:"0.72rem" }}>{label}</span>;
}

// Parse weekly program lines from report text
function parseProgramLines(text) {
  const lines = text.split("\n");
  const start = lines.findIndex(l => l.includes("RECOMMENDED WEEKLY PROGRAM"));
  const end   = lines.findIndex((l, i) => i > start && l.includes("══"));
  if (start === -1) return [];
  return lines.slice(start + 2, end === -1 ? undefined : end)
    .filter(l => l.trim().startsWith("Week") || l.trim().match(/^Day/))
    .map(l => l.trim());
}

function parsePriorityLines(text) {
  const lines = text.split("\n");
  const start = lines.findIndex(l => l.includes("PRIORITY ACTIONS"));
  const end   = lines.findIndex((l, i) => i > start + 2 && l.includes("─────"));
  if (start === -1) return [];
  return lines.slice(start + 2, end === -1 ? start + 12 : end)
    .filter(l => l.trim().length > 3 && !l.includes("─"))
    .map(l => l.trim().replace(/^\d+\.\s*/, ""));
}

export default function ReportPage({ report, rawValues, onNewAssessment, onEdit }) {
  const [copied, setCopied]       = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { text = "", scores = {} } = report || {};

  const goalColor = GOAL_COLOR[rawValues?.primaryGoal] ?? "#ffcc00";
  const bmi = rawValues?.weight && rawValues?.height
    ? (parseFloat(rawValues.weight) / Math.pow(parseFloat(rawValues.height) / 100, 2)).toFixed(1)
    : "—";
  const lbm = rawValues?.weight && rawValues?.fat
    ? (parseFloat(rawValues.weight) * (1 - parseFloat(rawValues.fat) / 100)).toFixed(1)
    : "—";
  const programLines = parseProgramLines(text);
  const priorityLines = parsePriorityLines(text);

  function handleCopy() {
    navigator.clipboard.writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); })
      .catch(() => alert("Copy failed"));
  }

  const postureMap = {
    Kyphosis: "Strengthen upper pull chain (rows, face pulls). Stretch pectorals daily.",
    Lordosis:  "Release hip flexors. Activate deep core (dead bug, bird dog).",
    Scoliosis: "Unilateral correction exercises. Physio referral strongly advised.",
    Flatback:  "Hip extension mobility. Posterior chain strengthening (RDL, hip thrust).",
    Optimal:   "Maintain alignment. Continue mobility & stability work.",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor:"#05070a" }}>

      {/* ── Top Bar ─── */}
      <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-50 no-print"
        style={{ borderColor:"rgba(255,255,255,0.06)", backgroundColor:"#05070a" }}>
        <button onClick={onEdit}
          className="flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition-all hover:opacity-80"
          style={{ background:"rgba(255,77,77,0.1)", color:"#ff4d4d", border:"1px solid rgba(255,77,77,0.25)", fontSize:"0.82rem" }}>
          ✏️ Edit
        </button>
        <span className="font-bold tracking-widest" style={{ fontFamily:"'Syncopate',sans-serif", color:"#ffcc00", fontSize:"0.82rem" }}>
          Assessment Report
        </span>
        <button onClick={onNewAssessment}
          className="font-bold px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
          style={{ background:"rgba(255,204,0,0.1)", color:"#ffcc00", border:"1px solid rgba(255,204,0,0.2)", fontSize:"0.82rem" }}>
          + New
        </button>
      </div>

      {/* ── Confirmation Banner ─── */}
      {!confirmed && (
        <div className="max-w-3xl mx-auto px-4 pt-8 no-print">
          <div className="rounded-2xl p-6" style={{ background:"rgba(255,204,0,0.04)", border:"2px solid rgba(255,204,0,0.25)" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color:"#ffcc00", fontFamily:"'Syncopate',sans-serif" }}>CONFIRM ASSESSMENT</p>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily:"'Syncopate',sans-serif" }}>{rawValues?.clientName || "Client"}</h2>
            <p style={{ color:"#555", fontSize:"0.82rem" }}>{rawValues?.primaryGoal} · {rawValues?.sessionsPerWeek}×/week · {rawValues?.targetWeeks} weeks</p>
            <div className="flex flex-wrap gap-3 mt-4 mb-5">
              {[
                { l:"Age",       v:`${rawValues?.age} yrs` },
                { l:"Gender",    v: rawValues?.gender },
                { l:"Level",     v: rawValues?.experience },
                { l:"Weight",    v:`${rawValues?.weight} kg` },
                { l:"Height",    v:`${rawValues?.height} cm` },
                { l:"Body Fat",  v:`${rawValues?.fat}%` },
                { l:"Slot",      v: rawValues?.preferredSlot },
                { l:"Medical",   v: rawValues?.medicalFlag },
              ].filter(x => x.v && x.v !== "undefined").map(({ l, v }) => (
                <div key={l} className="px-3 py-1.5 rounded-xl" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ color:"#444", fontSize:"0.68rem" }}>{l} </span>
                  <span className="font-bold text-white" style={{ fontSize:"0.82rem" }}>{v}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setConfirmed(true)}
              className="w-full py-4 rounded-2xl font-bold tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background:"linear-gradient(135deg,#ffcc00,#ff9900)", color:"#000", fontFamily:"'Syncopate',sans-serif", fontSize:"0.9rem", boxShadow:"0 0 30px rgba(255,204,0,0.3)" }}>
              ✅ Confirm &amp; View Full Report
            </button>
            <p className="text-center mt-3" style={{ color:"#333", fontSize:"0.72rem" }}>Client is saved to dashboard roster once confirmed</p>
          </div>
        </div>
      )}

      {/* ── Full Report (shown after confirm) ─── */}
      {confirmed && (
        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto px-4 py-8 pb-20 print-page">

          {/* ═══ LEFT ═══ */}
          <div className="lg:w-72 shrink-0 flex flex-col gap-4">

            {/* Client card */}
            <div className="rounded-2xl p-5" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background:`${goalColor}18`, border:`1px solid ${goalColor}33` }}>
                  {rawValues?.gender === "Female" ? "👩" : "👨"}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white" style={{ fontFamily:"'Syncopate',sans-serif" }}>{rawValues?.clientName || "Client"}</h2>
                  <div className="inline-block mt-1 px-2 py-0.5 rounded-full font-bold"
                    style={{ background:`${goalColor}18`, color:goalColor, border:`1px solid ${goalColor}33`, fontSize:"0.72rem" }}>
                    {rawValues?.primaryGoal}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[rawValues?.age && `${rawValues.age} yrs`, rawValues?.gender, rawValues?.experience, rawValues?.height && `${rawValues.height} cm`].filter(Boolean).map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full" style={{ background:"rgba(255,255,255,0.05)", color:"#666", fontSize:"0.75rem" }}>{t}</span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
                <div className="text-center"><div className="text-lg font-bold" style={{ color:"#ffcc00" }}>{rawValues?.weight}kg</div><div style={{ color:"#444", fontSize:"0.65rem" }}>WEIGHT</div></div>
                <div className="text-center"><div className="text-lg font-bold" style={{ color:"#00ffd5" }}>{rawValues?.fat}%</div><div style={{ color:"#444", fontSize:"0.65rem" }}>BODY FAT</div></div>
                <div className="text-center"><div className="text-lg font-bold text-white">{bmi}</div><div style={{ color:"#444", fontSize:"0.65rem" }}>BMI</div></div>
              </div>
              {rawValues?.medicalFlag && rawValues.medicalFlag !== "None" && (
                <div className="mt-3 px-3 py-2 rounded-xl flex items-center gap-2" style={{ background:"rgba(255,77,77,0.08)", color:"#ff4d4d", border:"1px solid rgba(255,77,77,0.15)", fontSize:"0.8rem" }}>
                  ⚠ {rawValues.medicalFlag}
                </div>
              )}
            </div>

            {/* Trainer */}
            <div className="rounded-2xl px-4 py-3 flex items-center justify-between" style={{ background:"rgba(255,204,0,0.04)", border:"1px solid rgba(255,204,0,0.15)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ border:"2px solid rgba(255,204,0,0.4)" }}>
                  <img src="/akash.png" alt="Akash" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p style={{ color:"#444", fontSize:"0.62rem" }}>TRAINER</p>
                  <p className="font-bold" style={{ color:"#ffcc00", fontFamily:"'Syncopate',sans-serif", fontSize:"0.82rem" }}>Akash Athavani</p>
                </div>
              </div>
              {rawValues?.preferredSlot && (
                <div className="text-right">
                  <p style={{ color:"#444", fontSize:"0.62rem" }}>SLOT</p>
                  <p className="font-bold text-white" style={{ fontSize:"0.88rem" }}>{rawValues.preferredSlot}</p>
                </div>
              )}
            </div>

            {/* Program info */}
            <SectionCard icon="📅" title="PROGRAM" accentColor="#00ffd5">
              <InfoRow label="Duration"  value={`${rawValues?.targetWeeks || 12} weeks`}        color="#00ffd5" />
              <InfoRow label="Sessions"  value={`${rawValues?.sessionsPerWeek || 3}× per week`} color="#ffcc00" />
              <InfoRow label="Posture"   value={rawValues?.posture || "—"}                      color={rawValues?.posture === "Optimal" ? "#00ffd5" : "#ff9900"} />
              <InfoRow label="Cardio"    value={rawValues?.cardioTest || "—"}                   color="#888" />
            </SectionCard>

            {/* Performance badges */}
            {Object.values(scores).some(Boolean) && (
              <SectionCard icon="🏅" title="PERFORMANCE" accentColor="#ffcc00">
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(scores).map(([key, score]) =>
                    score && BADGE_META[key] ? (
                      <div key={key} className="rounded-xl p-2 text-center" style={{ background:`${score.color}10`, border:`1px solid ${score.color}25` }}>
                        <div style={{ fontSize:"1.1rem" }}>{BADGE_META[key].icon}</div>
                        <div className="font-bold mt-0.5" style={{ color:score.color, fontSize:"0.6rem" }}>{score.label}</div>
                        <div style={{ color:"#444", fontSize:"0.58rem" }}>{BADGE_META[key].label}</div>
                      </div>
                    ) : null
                  )}
                </div>
              </SectionCard>
            )}

            <BodyDiagram goal={rawValues?.primaryGoal} posture={rawValues?.posture} medicalFlag={rawValues?.medicalFlag} />
          </div>

          {/* ═══ RIGHT: Styled Report Sections ═══ */}
          <div className="flex-1 flex flex-col gap-4">

            {/* Body Composition */}
            <SectionCard icon="⚖️" title="BODY COMPOSITION" accentColor="#00ffd5">
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { l:"Height",          v:`${rawValues?.height} cm`,  c:"#e0e0e0" },
                  { l:"Weight",          v:`${rawValues?.weight} kg`,  c:"#e0e0e0" },
                  { l:"BMI",             v: bmi,                        c: scores.bmi ? SCORE_COLOR[scores.bmi.label] : "#e0e0e0" },
                  { l:"Body Fat",        v:`${rawValues?.fat}%`,        c: scores.fat ? SCORE_COLOR[scores.fat.label] : "#e0e0e0" },
                  { l:"Lean Body Mass",  v:`${lbm} kg`,                 c:"#00ffd5" },
                  { l:"Skeletal Muscle", v:`${rawValues?.muscle || "—"}%`, c:"#888" },
                ].map(({ l, v, c }) => (
                  <div key={l} className="rounded-xl px-3 py-2.5" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ color:"#444", fontSize:"0.68rem" }}>{l}</div>
                    <div className="font-bold mt-0.5" style={{ color:c, fontSize:"0.95rem" }}>{v}</div>
                    {l === "BMI" && scores.bmi && <ScorePill label={scores.bmi.label} />}
                    {l === "Body Fat" && scores.fat && <div className="mt-1"><ScorePill label={scores.fat.label} /></div>}
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Strength */}
            <SectionCard icon="💪" title="STRENGTH  (1-Min AMRAP)" accentColor="#ffcc00">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l:"Squats",        v:rawValues?.squats,  s:scores.squats  },
                  { l:"Pushups",       v:rawValues?.pushups, s:scores.pushups },
                  { l:"Inverted Rows", v:rawValues?.rows,    s:scores.rows    },
                ].map(({ l, v, s }) => (
                  <div key={l} className="rounded-xl p-3 text-center" style={{ background:"rgba(255,204,0,0.04)", border:"1px solid rgba(255,204,0,0.12)" }}>
                    <div className="text-2xl font-bold" style={{ color:"#ffcc00", fontFamily:"'Syncopate',sans-serif" }}>{v || "—"}</div>
                    <div style={{ color:"#555", fontSize:"0.7rem" }}>reps</div>
                    <div style={{ color:"#888", fontSize:"0.72rem", marginTop:"4px" }}>{l}</div>
                    {s && <div className="mt-1.5"><ScorePill label={s.label} /></div>}
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Core */}
            <SectionCard icon="🧠" title="McGILL CORE TEST  (seconds)" accentColor="#00bfff">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { l:"V-Hold",         v:rawValues?.vhold,  s:null },
                  { l:"Plank",          v:rawValues?.plank,  s:scores.plank },
                  { l:"Side Bridge L",  v:rawValues?.sbl,    s:null },
                  { l:"Side Bridge R",  v:rawValues?.sbr,    s:null },
                ].map(({ l, v, s }) => (
                  <div key={l} className="rounded-xl p-3 text-center" style={{ background:"rgba(0,191,255,0.04)", border:"1px solid rgba(0,191,255,0.12)" }}>
                    <div className="text-xl font-bold" style={{ color:"#00bfff", fontFamily:"'Syncopate',sans-serif" }}>{v || "—"}s</div>
                    <div style={{ color:"#555", fontSize:"0.68rem", marginTop:"4px" }}>{l}</div>
                    {s && <div className="mt-1"><ScorePill label={s.label} /></div>}
                  </div>
                ))}
              </div>
              {rawValues?.sbl && rawValues?.sbr && (
                <div className="mt-3 px-3 py-2 rounded-xl flex items-center justify-between" style={{ background:"rgba(255,255,255,0.03)" }}>
                  <span style={{ color:"#444", fontSize:"0.78rem" }}>Asymmetry</span>
                  <span className="font-bold" style={{ color: Math.abs(rawValues.sbl - rawValues.sbr) > 5 ? "#ff4d4d" : "#00ffd5", fontSize:"0.82rem" }}>
                    {Math.abs(rawValues.sbl - rawValues.sbr) > 5 ? "⚠ IMBALANCE" : "✓ BALANCED"}
                  </span>
                </div>
              )}
            </SectionCard>

            {/* Cardio */}
            <SectionCard icon="❤️" title="CARDIO ASSESSMENT" accentColor="#ff4d4d">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l:"Resting HR", v:`${rawValues?.restingHR || "—"} bpm`, s:scores.hr },
                  { l:"Test",       v: rawValues?.cardioTest || "—",         s:null },
                  { l:"Score",      v: rawValues?.cardioScore || "—",        s:null },
                ].map(({ l, v, s }) => (
                  <div key={l} className="rounded-xl p-3 text-center" style={{ background:"rgba(255,77,77,0.04)", border:"1px solid rgba(255,77,77,0.1)" }}>
                    <div className="text-lg font-bold" style={{ color:"#ff4d4d", fontFamily:"'Syncopate',sans-serif" }}>{v}</div>
                    <div style={{ color:"#555", fontSize:"0.72rem", marginTop:"4px" }}>{l}</div>
                    {s && <div className="mt-1"><ScorePill label={s.label} /></div>}
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Posture */}
            <SectionCard icon="🧍" title="POSTURE" accentColor="#ff9900">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1.5 rounded-xl font-bold" style={{ background:"rgba(255,153,0,0.1)", color:"#ff9900", border:"1px solid rgba(255,153,0,0.25)", fontSize:"0.85rem" }}>
                  {rawValues?.posture || "—"}
                </span>
              </div>
              <p style={{ color:"#888", fontSize:"0.82rem", lineHeight:1.6 }}>
                {postureMap[rawValues?.posture] || "—"}
              </p>
            </SectionCard>

            {/* Priority Actions */}
            {priorityLines.length > 0 && (
              <SectionCard icon="🎯" title="PRIORITY ACTIONS" accentColor="#ff4d4d">
                <div className="flex flex-col gap-2">
                  {priorityLines.map((line, i) => (
                    <div key={i} className="flex gap-3 items-start px-3 py-2.5 rounded-xl" style={{ background:"rgba(255,77,77,0.04)", border:"1px solid rgba(255,77,77,0.1)" }}>
                      <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background:"rgba(255,77,77,0.2)", color:"#ff4d4d" }}>{i + 1}</span>
                      <p style={{ color:"#ccc", fontSize:"0.81rem", lineHeight:1.5 }}>{line}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Weekly Program */}
            {programLines.length > 0 && (
              <SectionCard icon="📅" title={`WEEKLY PROGRAM  (${rawValues?.sessionsPerWeek}×/week)`} accentColor="#00ffd5">
                <div className="flex flex-col gap-2">
                  {programLines.map((line, i) => {
                    const dayMatch = line.match(/Day\s*\d+[:\s]+(.*)/);
                    const label = dayMatch ? `Day ${i + 1}` : `Day ${i + 1}`;
                    const content = dayMatch ? line.replace(/^.*?:\s*/, "") : line.replace(/^Week\s*\d+\s*/, "");
                    const noteMatch = content.match(/\[NOTE:(.+?)\]/);
                    const cleanContent = content.replace(/\[NOTE:.+?\]/, "").trim();
                    return (
                      <div key={i} className="px-4 py-3 rounded-xl" style={{ background:"rgba(0,255,213,0.03)", border:"1px solid rgba(0,255,213,0.1)" }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-lg font-bold" style={{ background:"rgba(0,255,213,0.12)", color:"#00ffd5", fontFamily:"'Syncopate',sans-serif", fontSize:"0.62rem" }}>DAY {i + 1}</span>
                          {noteMatch && <span className="px-2 py-0.5 rounded-lg" style={{ background:"rgba(255,77,77,0.1)", color:"#ff4d4d", fontSize:"0.62rem" }}>⚠ MODIFIED</span>}
                        </div>
                        <p style={{ color:"#d4f5ef", fontSize:"0.82rem", lineHeight:1.5 }}>{cleanContent}</p>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 no-print pt-2">
              <button onClick={onEdit}
                className="flex-1 py-3 rounded-xl font-bold transition-all hover:opacity-80"
                style={{ background:"rgba(255,77,77,0.08)", color:"#ff4d4d", border:"1px solid rgba(255,77,77,0.2)", fontSize:"0.85rem" }}>
                ✏️ Edit
              </button>
              <button onClick={handleCopy}
                className="flex-1 py-3 rounded-xl font-bold transition-all"
                style={{ border: copied ? "1px solid #00ffd5" : "1px solid #2a2a2a", color: copied ? "#00ffd5" : "#555", background: copied ? "rgba(0,255,213,0.05)" : "transparent", fontSize:"0.85rem" }}>
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
              <button onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl font-bold transition-all hover:opacity-80"
                style={{ background:"rgba(255,255,255,0.04)", color:"#888", border:"1px solid #222", fontSize:"0.85rem" }}>
                📄 PDF
              </button>
              <button onClick={onNewAssessment}
                className="flex-1 py-3 rounded-xl font-bold text-black transition-all hover:opacity-90"
                style={{ background:"#ffcc00", fontSize:"0.85rem" }}>
                + New
              </button>
            </div>

            <p className="text-center" style={{ color:"#2a2a2a", fontSize:"0.7rem" }}>
              Report by Akash Athavani · Fitness Coach · Cult Neo Gym
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
