// ============================================================
// reportGenerator.js — Professional NASM-style report engine
// Pure logic, no React. Takes form values → { text, scores }
// ============================================================

// ── Scoring Helpers ───────────────────────────────────────────
function score(value, { poor, average, good }) {
  if (value >= good)    return { label: "GOOD",    color: "#00ffd5" };
  if (value >= average) return { label: "AVERAGE", color: "#ffcc00" };
  return                       { label: "NEEDS WORK", color: "#ff4d4d" };
}

function scoreFat(fat, gender) {
  if (gender === "Female") {
    if (fat <= 24)       return { label: "GOOD",       color: "#00ffd5" };
    if (fat <= 31)       return { label: "AVERAGE",    color: "#ffcc00" };
    return                      { label: "NEEDS WORK", color: "#ff4d4d" };
  }
  if (fat <= 17)         return { label: "GOOD",       color: "#00ffd5" };
  if (fat <= 24)         return { label: "AVERAGE",    color: "#ffcc00" };
  return                        { label: "NEEDS WORK", color: "#ff4d4d" };
}

function scoreBMI(bmi) {
  if (bmi < 18.5) return { label: "UNDERWEIGHT", color: "#ffcc00" };
  if (bmi < 25)   return { label: "NORMAL",      color: "#00ffd5" };
  if (bmi < 30)   return { label: "OVERWEIGHT",  color: "#ffcc00" };
  return                  { label: "OBESE",       color: "#ff4d4d" };
}

function scoreHR(hr) {
  if (hr < 60)        return { label: "ATHLETE",  color: "#00ffd5" };
  if (hr <= 72)       return { label: "GOOD",     color: "#00ffd5" };
  if (hr <= 85)       return { label: "AVERAGE",  color: "#ffcc00" };
  return                     { label: "HIGH",     color: "#ff4d4d" };
}

// ── Posture Corrections ───────────────────────────────────────
const postureMap = {
  Kyphosis:  "Strengthen upper pull chain (rows, face pulls). Stretch pectorals daily.",
  Lordosis:  "Release hip flexors (couch stretch). Activate deep core (dead bug, bird dog).",
  Scoliosis: "Unilateral correction exercises. Physio referral strongly advised.",
  Flatback:  "Hip extension mobility work. Posterior chain strengthening (RDL, hip thrust).",
  Optimal:   "Maintain alignment. Continue mobility & stability work.",
};

// ── Weekly Program Builder ────────────────────────────────────
function buildProgram({ primaryGoal, sessionsPerWeek, experience, medicalFlag }) {
  const days = sessionsPerWeek;
  const modifier = medicalFlag !== "None" ? ` [NOTE: Modify for ${medicalFlag}]` : "";

  const templates = {
    "Weight Loss": [
      `Day 1: Full Body Circuit — Compound lifts + 20 min HIIT${modifier}`,
      `Day 2: Active Recovery — Walk / Mobility (30 min)`,
      `Day 3: Upper Body + Core — Push/Pull supersets`,
      `Day 4: Lower Body — Squat pattern + Hip Hinge${modifier}`,
      `Day 5: Cardio Endurance — Steady State 40–45 min`,
      `Day 6: Full Body Strength — Progressive Overload focus`,
    ],
    "Muscle Gain": [
      `Day 1: Push — Chest, Shoulders, Triceps (Hypertrophy 8–12 reps)`,
      `Day 2: Pull — Back, Biceps (Hypertrophy 8–12 reps)`,
      `Day 3: Legs — Squat, Leg Press, Romanian DL${modifier}`,
      `Day 4: Push (Heavy) — Compound focus 4–6 reps`,
      `Day 5: Pull (Heavy) — Deadlift, Rows${modifier}`,
      `Day 6: Arms + Shoulders — Isolation volume`,
    ],
    "Athletic Performance": [
      `Day 1: Power & Explosiveness — Plyometrics, Olympic lifts`,
      `Day 2: Speed & Agility — Sprint intervals, ladder drills`,
      `Day 3: Strength — Compound lifts 3–5 reps${modifier}`,
      `Day 4: Active Recovery — Yoga / Foam roll`,
      `Day 5: Conditioning — Sport-specific circuits`,
      `Day 6: Testing & Benchmarking`,
    ],
    "Endurance": [
      `Day 1: Long Run / Cardio — Zone 2 (45–60 min)`,
      `Day 2: Strength Support — Leg endurance, core`,
      `Day 3: Tempo Run — 20–30 min at threshold pace`,
      `Day 4: Rest / Active Recovery`,
      `Day 5: Interval Training — HIIT (30 sec on / 90 sec off)`,
      `Day 6: Cross Training — Swim / Bike / Row`,
    ],
    "Rehabilitation": [
      `Day 1: Mobility & Flexibility — Full body (30 min)${modifier}`,
      `Day 2: Light Strength — Bodyweight & resistance bands`,
      `Day 3: Core Stability — McGill exercises, planks`,
      `Day 4: Active Recovery — Walk, breathing drills`,
      `Day 5: Functional Movement — Pattern retraining`,
      `Day 6: Physio-guided session`,
    ],
    "General Fitness": [
      `Day 1: Full Body Strength — Compound movements`,
      `Day 2: Cardio + Core — 30 min steady + ab work`,
      `Day 3: Upper Body Push & Pull`,
      `Day 4: Lower Body + Glutes${modifier}`,
      `Day 5: Conditioning Circuit — Functional fitness`,
      `Day 6: Flexibility & Recovery`,
    ],
  };

  const plan = (templates[primaryGoal] || templates["General Fitness"]).slice(0, days);
  return plan.map((d, i) => `   Week ${i + 1 <= days ? i + 1 : ""} ${d}`).join("\n");
}

// ── Main Export ───────────────────────────────────────────────
/**
 * @param {Object} values  - All parsed assessment values
 * @returns {{ text: string, scores: Object }} Report text + score badges
 */
export function generateReport(values) {
  const {
    clientName = "CLIENT", age = 0, gender = "Male",
    height = 0, experience = "Beginner", medicalFlag = "None",
    primaryGoal = "General Fitness", targetWeeks = 12, sessionsPerWeek = 3,
    weight = 0, fat = 0, muscle = 0,
    squats = 0, pushups = 0, rows = 0,
    vhold = 0, plank = 0, sbl = 0, sbr = 0,
    restingHR = 0, cardioTest = "Step Test", cardioScore = 0,
    posture = "Optimal",
  } = values;

  // ── Calculations ────────────────────────────────────────────
  const bmi = height > 0 ? parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1)) : 0;
  const mcgillRatio = vhold > 0 ? (Math.min(sbl, sbr) / vhold).toFixed(2) : "N/A";
  const lbm = weight > 0 && fat > 0 ? (weight * (1 - fat / 100)).toFixed(1) : "N/A";

  // ── Scores ──────────────────────────────────────────────────
  const scores = {
    bmi:     bmi     > 0 ? scoreBMI(bmi)                                     : null,
    fat:     fat     > 0 ? scoreFat(fat, gender)                              : null,
    squats:  squats  > 0 ? score(squats,  { poor: 0,  average: 20, good: 35 }) : null,
    pushups: pushups > 0 ? score(pushups, { poor: 0,  average: 15, good: 25 }) : null,
    rows:    rows    > 0 ? score(rows,    { poor: 0,  average: 12, good: 20 }) : null,
    plank:   plank   > 0 ? score(plank,   { poor: 0,  average: 45, good: 90 }) : null,
    hr:      restingHR > 0 ? scoreHR(restingHR)                               : null,
  };

  // ── Priority Actions ────────────────────────────────────────
  const actions = [];
  if (fat > (gender === "Female" ? 31 : 24)) actions.push("Priority: Metabolic conditioning — reduce body fat %.");
  if (bmi >= 30)                              actions.push("BMI in obese range — caloric deficit + daily activity increase.");
  if (squats  < 20 && squats  > 0)           actions.push("Strength: Lower body power lagging — goblet squats, leg press progression.");
  if (pushups < 15 && pushups > 0)           actions.push("Strength: Push chain weak — incline pushups → flat → weighted.");
  if (rows    < 12 && rows    > 0)           actions.push("Strength: Upper pull deficit — lat pulldown, seated row 3×12.");
  if (plank   < 45 && plank   > 0)           actions.push("Core: Plank endurance low — dead bug, RKC plank progression.");
  if (sbl > 0 && sbr > 0 && Math.abs(sbl - sbr) > 5) actions.push(`Core: ${sbl < sbr ? "Left" : "Right"} side bridge weaker — address imbalance first.`);
  if (restingHR > 85 && restingHR > 0)       actions.push("Cardio: Elevated resting HR — add 2× Zone 2 sessions per week.");
  if (postureMap[posture] && posture !== "Optimal") actions.push(`Posture (${posture}): ${postureMap[posture]}`);
  if (medicalFlag !== "None")                 actions.push(`Medical: Client reports ${medicalFlag} — adjust load & ROM accordingly.`);

  const prioritySection = actions.length
    ? actions.map((a, i) => `   ${i + 1}. ${a}`).join("\n")
    : "   All metrics within acceptable range. Maintain current protocol.";

  // ── Weekly Program ──────────────────────────────────────────
  const program = buildProgram({ primaryGoal, sessionsPerWeek, experience, medicalFlag });

  // ── Date ────────────────────────────────────────────────────
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  // ── Report Text ─────────────────────────────────────────────
  const text =
`╔══════════════════════════════════════════════╗
  PROFESSIONAL FITNESS ASSESSMENT REPORT
  TRAINER: AKASH ATHAVANI  |  OS v18.0
  DATE   : ${date}
╚══════════════════════════════════════════════╝

CLIENT : ${clientName.toUpperCase()}
AGE    : ${age} yrs   GENDER: ${gender}   LEVEL: ${experience}
GOAL   : ${primaryGoal} — ${targetWeeks} weeks / ${sessionsPerWeek}×/week
MEDICAL: ${medicalFlag}

─────────────────────────────────────────────────
1. BODY COMPOSITION
─────────────────────────────────────────────────
   Height          : ${height} cm
   Weight          : ${weight} kg
   BMI             : ${bmi}  [${bmi > 0 ? scoreBMI(bmi).label : "N/A"}]
   Body Fat %      : ${fat}%  [${fat > 0 ? scoreFat(fat, gender).label : "N/A"}]
   Lean Body Mass  : ${lbm} kg
   Skeletal Muscle : ${muscle}%

─────────────────────────────────────────────────
2. STRENGTH  (1-Min AMRAP)
─────────────────────────────────────────────────
   Squats          : ${squats} reps  [${scores.squats?.label ?? "N/A"}]
   Pushups         : ${pushups} reps  [${scores.pushups?.label ?? "N/A"}]
   Inverted Rows   : ${rows} reps  [${scores.rows?.label ?? "N/A"}]

─────────────────────────────────────────────────
3. McGILL CORE TEST  (seconds)
─────────────────────────────────────────────────
   V-Hold          : ${vhold}s
   Plank           : ${plank}s  [${scores.plank?.label ?? "N/A"}]
   Side Bridge L   : ${sbl}s
   Side Bridge R   : ${sbr}s
   Asymmetry Ratio : ${mcgillRatio}  ${Math.abs(sbl - sbr) > 5 ? "⚠ IMBALANCE" : "✓ BALANCED"}

─────────────────────────────────────────────────
4. CARDIO ASSESSMENT
─────────────────────────────────────────────────
   Resting HR      : ${restingHR} bpm  [${scores.hr?.label ?? "N/A"}]
   Test            : ${cardioTest}
   Score / Result  : ${cardioScore}

─────────────────────────────────────────────────
5. POSTURE
─────────────────────────────────────────────────
   Status          : ${posture}
   Correction      : ${postureMap[posture]}

─────────────────────────────────────────────────
6. PRIORITY ACTIONS
─────────────────────────────────────────────────
${prioritySection}

─────────────────────────────────────────────────
7. RECOMMENDED WEEKLY PROGRAM  (${sessionsPerWeek} days)
─────────────────────────────────────────────────
${program}

══════════════════════════════════════════════════
STATUS: ASSESSMENT COMPLETED ✅
NEXT CHECK-IN: ${targetWeeks} weeks from today
══════════════════════════════════════════════════`;

  return { text, scores };
}
