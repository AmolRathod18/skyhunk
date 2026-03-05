// NutritionPage.jsx — Diet & Nutrition Guide for Clients
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const PRINCIPLES = [
  {
    icon: "🥩",
    title: "Protein First",
    body: "Aim for 1.6–2.2 g of protein per kg of bodyweight daily. Protein preserves muscle, controls hunger, and has the highest thermic effect of any macronutrient.",
    accent: "#ffcc00",
  },
  {
    icon: "💧",
    title: "Hydration",
    body: "Drink at least 35 ml per kg of bodyweight. Dehydration by even 2 % reduces strength output and impairs recovery. Start every morning with 500 ml of water.",
    accent: "#00ffd5",
  },
  {
    icon: "📅",
    title: "Meal Timing",
    body: "Eat a protein-rich meal within 60 min of training. Space meals 3–4 hours apart. Consistent timing keeps metabolism and energy stable across the day.",
    accent: "#a78bfa",
  },
  {
    icon: "🔢",
    title: "Calorie Awareness",
    body: "Track your intake for at least 2 weeks. You don't need to count forever — awareness builds intuition that guides smart choices automatically.",
    accent: "#f97316",
  },
  {
    icon: "🥦",
    title: "Micronutrients",
    body: "Include at least 400 g of vegetables and 2 pieces of fruit daily. Vitamins, minerals, and fibre support hormones, immunity, and gut health.",
    accent: "#4ade80",
  },
  {
    icon: "😴",
    title: "Sleep & Recovery",
    body: "7–9 hours of sleep is non-negotiable nutrition. Growth hormone, muscle repair, and appetite-regulating hormones (ghrelin/leptin) all depend on deep sleep.",
    accent: "#38bdf8",
  },
];

const SUPPLEMENTS = [
  { name: "Creatine Monohydrate", dose: "5 g / day", timing: "Any time — consistency matters", benefit: "Increases strength, power & muscle volume", priority: "ESSENTIAL" },
  { name: "Whey Protein",        dose: "1–2 scoops / day", timing: "Post-workout or between meals", benefit: "Hits daily protein target conveniently", priority: "HIGHLY USEFUL" },
  { name: "Vitamin D3 + K2",     dose: "2,000–5,000 IU / day", timing: "Morning with fat", benefit: "Testosterone, immunity, bone density", priority: "ESSENTIAL" },
  { name: "Omega-3 Fish Oil",    dose: "2–3 g EPA+DHA / day", timing: "With meals", benefit: "Reduces inflammation, improves recovery", priority: "HIGHLY USEFUL" },
  { name: "Magnesium Glycinate", dose: "300–400 mg / day", timing: "30 min before bed", benefit: "Better sleep, muscle relaxation, stress", priority: "USEFUL" },
  { name: "Caffeine",            dose: "100–200 mg pre-workout", timing: "30 min before training", benefit: "Focus, endurance, strength output", priority: "USEFUL" },
];

const MEAL_PLANS = {
  cut: {
    label: "FAT LOSS",
    color: "#f97316",
    description: "High protein · Moderate carbs · Low fat",
    meals: [
      { time: "7 AM — Breakfast",   foods: ["5 egg whites + 1 whole egg scramble", "1 bowl oats (40 g dry) with berries", "Black coffee / green tea"], kcal: "~480 kcal" },
      { time: "10 AM — Snack",      foods: ["Greek yoghurt (200 g)", "10 almonds"], kcal: "~220 kcal" },
      { time: "1 PM — Lunch",       foods: ["150 g grilled chicken breast", "1 cup brown rice / 2 chapatis", "Cucumber + tomato salad"], kcal: "~520 kcal" },
      { time: "4 PM — Pre-Workout", foods: ["1 banana", "1 scoop whey protein in water"], kcal: "~280 kcal" },
      { time: "7 PM — Dinner",      foods: ["150 g paneer / fish / tofu", "Mixed stir-fried vegetables (unlimited)", "1 cup dal"], kcal: "~460 kcal" },
      { time: "9 PM — Optional",    foods: ["1 cup low-fat milk or casein shake", ""], kcal: "~120 kcal" },
    ],
    totalKcal: "~2,080 kcal",
    macros: { protein: "175 g", carbs: "190 g", fat: "55 g" },
  },
  bulk: {
    label: "MUSCLE GAIN",
    color: "#4ade80",
    description: "High protein · High carbs · Moderate fat",
    meals: [
      { time: "7 AM — Breakfast",   foods: ["4 whole eggs scramble", "2 cups oats with banana & peanut butter", "250 ml full-fat milk"], kcal: "~740 kcal" },
      { time: "10 AM — Snack",      foods: ["2 whole wheat bread + 2 tbsp peanut butter", "1 apple", "1 scoop protein"], kcal: "~480 kcal" },
      { time: "1 PM — Lunch",       foods: ["200 g chicken / beef / paneer", "2 cups cooked rice", "Vegetables + 1 tbsp olive oil"], kcal: "~800 kcal" },
      { time: "4 PM — Pre-Workout", foods: ["2 rice cakes + 50 g tuna / boiled chicken", "1 banana"], kcal: "~400 kcal" },
      { time: "7 PM — Post-Workout",foods: ["1 scoop whey + 50 g dextrose in water", ""], kcal: "~280 kcal" },
      { time: "9 PM — Dinner",      foods: ["200 g salmon / eggs / cottage cheese", "1 cup sweet potato or 2 chapatis", "Salad with olive oil"], kcal: "~640 kcal" },
    ],
    totalKcal: "~3,340 kcal",
    macros: { protein: "200 g", carbs: "380 g", fat: "90 g" },
  },
  maintain: {
    label: "MAINTENANCE",
    color: "#00ffd5",
    description: "Balanced protein · Moderate carbs & fat",
    meals: [
      { time: "7 AM — Breakfast",   foods: ["3 whole eggs + 2 whites", "1 cup oats with milk", "1 fruit"], kcal: "~530 kcal" },
      { time: "10 AM — Snack",      foods: ["Greek yoghurt (150 g)", "Handful of mixed nuts"], kcal: "~270 kcal" },
      { time: "1 PM — Lunch",       foods: ["150 g chicken / dal + paneer", "1½ cup rice / 2 chapatis", "Sabzi + salad"], kcal: "~600 kcal" },
      { time: "4 PM — Pre-Workout", foods: ["1 banana + 15 g protein snack"], kcal: "~200 kcal" },
      { time: "7 PM — Dinner",      foods: ["150 g protein source", "1 cup dal or legumes", "Stir-fried veggies + rice/chapati"], kcal: "~580 kcal" },
      { time: "9 PM — Optional",    foods: ["1 cup warm milk or herbal tea", ""], kcal: "~100 kcal" },
    ],
    totalKcal: "~2,280 kcal",
    macros: { protein: "160 g", carbs: "250 g", fat: "70 g" },
  },
};

/* ─────────────────────────────────────────────────────────────
   MACRO CALCULATOR
───────────────────────────────────────────────────────────── */
function MacroCalculator() {
  const [weight,     setWeight]     = useState("");
  const [goal,       setGoal]       = useState("maintain");
  const [activityLv, setActivityLv] = useState("moderate");
  const [result,     setResult]     = useState(null);

  const activityMultipliers = {
    sedentary:  1.2,
    light:      1.375,
    moderate:   1.55,
    active:     1.725,
    very:       1.9,
  };

  function calculate() {
    const w = parseFloat(weight);
    if (!w || w < 30 || w > 250) return;

    // Rough TDEE estimate (without height/age: use simplified formula ~22 kcal/kg LBM)
    const bmr  = w * 22;
    const tdee = Math.round(bmr * activityMultipliers[activityLv]);

    let calories = tdee;
    if (goal === "cut")  calories = Math.round(tdee * 0.82);
    if (goal === "bulk") calories = Math.round(tdee * 1.12);

    const protein = Math.round(w * 2.0);
    const fat     = Math.round((calories * 0.25) / 9);
    const carbs   = Math.round((calories - protein * 4 - fat * 9) / 4);

    setResult({ calories, protein, carbs, fat });
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,204,0,0.2)",
      borderRadius: "1.5rem",
      padding: "32px",
      maxWidth: "560px",
      margin: "0 auto",
    }}>
      <p style={{ fontSize: "10px", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.18em", color: "#00ffd5", marginBottom: "6px", textTransform: "uppercase" }}>Free Tool</p>
      <h3 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "24px" }}>Daily Macro Calculator</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Weight */}
        <div>
          <label style={{ fontSize: "10px", color: "#666", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>YOUR BODYWEIGHT (KG)</label>
          <input
            type="number"
            placeholder="e.g. 72"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
              color: "#fff", fontSize: "14px", padding: "10px 14px", outline: "none",
            }}
          />
        </div>

        {/* Goal */}
        <div>
          <label style={{ fontSize: "10px", color: "#666", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>PRIMARY GOAL</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "cut",      label: "Fat Loss",    color: "#f97316" },
              { id: "maintain", label: "Maintain",    color: "#00ffd5" },
              { id: "bulk",     label: "Muscle Gain", color: "#4ade80" },
            ].map(g => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                style={{
                  flex: 1, padding: "8px 6px", borderRadius: "8px", fontSize: "10px", fontWeight: 700,
                  fontFamily: "'Syncopate',sans-serif", cursor: "pointer", transition: "all 0.2s",
                  background: goal === g.id ? g.color : "rgba(255,255,255,0.05)",
                  color:      goal === g.id ? "#000"  : "#666",
                  border:     goal === g.id ? "none"  : "1px solid #333",
                }}
              >{g.label}</button>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div>
          <label style={{ fontSize: "10px", color: "#666", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>ACTIVITY LEVEL</label>
          <select
            value={activityLv}
            onChange={e => setActivityLv(e.target.value)}
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "10px", color: "#fff", fontSize: "12px", padding: "10px 14px", outline: "none",
            }}
          >
            <option value="sedentary" style={{ background: "#111" }}>Sedentary (desk job, no exercise)</option>
            <option value="light"     style={{ background: "#111" }}>Light (1–2 days / week)</option>
            <option value="moderate"  style={{ background: "#111" }}>Moderate (3–4 days / week)</option>
            <option value="active"    style={{ background: "#111" }}>Active (5–6 days / week)</option>
            <option value="very"      style={{ background: "#111" }}>Very Active (athlete / daily training)</option>
          </select>
        </div>

        {/* Button */}
        <button
          onClick={calculate}
          style={{
            background: "#ffcc00", color: "#000", fontFamily: "'Syncopate',sans-serif",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em",
            padding: "12px 24px", borderRadius: "50px", border: "none",
            cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 20px rgba(255,204,0,0.25)",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,204,0,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";   e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,204,0,0.25)"; }}
        >
          Calculate My Macros →
        </button>

        {/* Result */}
        {result && (
          <div style={{ marginTop: "8px", padding: "20px", borderRadius: "12px", background: "rgba(255,204,0,0.06)", border: "1px solid rgba(255,204,0,0.25)" }}>
            <p style={{ fontSize: "10px", color: "#ffcc00", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.12em", marginBottom: "14px" }}>YOUR DAILY TARGETS</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", textAlign: "center" }}>
              {[
                { label: "Calories", value: result.calories, unit: "kcal", color: "#ffcc00" },
                { label: "Protein",  value: result.protein,  unit: "g",    color: "#00ffd5" },
                { label: "Carbs",    value: result.carbs,    unit: "g",    color: "#a78bfa" },
                { label: "Fat",      value: result.fat,      unit: "g",    color: "#f97316" },
              ].map(({ label, value, unit, color }) => (
                <div key={label}>
                  <p style={{ fontSize: "18px", fontWeight: 700, color, margin: 0, fontFamily: "'Syncopate',sans-serif" }}>{value}</p>
                  <p style={{ fontSize: "9px", color: "#555", margin: "2px 0 0", letterSpacing: "0.08em" }}>{unit} {label}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "10px", color: "#555", marginTop: "14px", lineHeight: 1.6 }}>
              These are starting estimates. Adjust ±200 kcal based on weekly weight trend. A registered dietitian or your trainer can fine-tune these numbers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function NutritionPage({ onHome, onStart }) {
  const [activePlan, setActivePlan] = useState("cut");

  const plan = MEAL_PLANS[activePlan];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#05070a" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#05070a" }}
      >
        <button
          onClick={onHome}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          ← Back to Home
        </button>
        <span
          style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "11px", fontWeight: 700, color: "#ffcc00", letterSpacing: "0.15em" }}
        >
          Diet & Nutrition
        </span>
        <button
          onClick={onStart}
          className="text-xs px-4 py-2 rounded-full font-bold transition-opacity hover:opacity-80"
          style={{ background: "#ffcc00", color: "#000", fontFamily: "'Syncopate',sans-serif" }}
        >
          Free Assessment
        </button>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section
        className="px-6 py-20 text-center"
        style={{
          background: "linear-gradient(180deg, rgba(255,204,0,0.06) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p style={{ fontSize: "10px", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.2em", color: "#00ffd5", textTransform: "uppercase", marginBottom: "12px" }}>
          Client Nutrition Guide · Akash Athavani
        </p>
        <h1
          style={{
            fontFamily: "'Syncopate',sans-serif",
            fontSize: "clamp(1.6rem, 5vw, 3.2rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: "16px",
          }}
        >
          Eat Smart.<br />
          <span style={{ color: "#ffcc00" }}>Train Hard.</span><br />
          Look the Part.
        </h1>
        <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto 28px" }}>
          Training without proper nutrition is like driving a Ferrari with no fuel. This guide gives you everything — a macro calculator, meal plan templates, supplementation basics, and the principles that actually work.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
          {[
            { label: "📊 Macro Calculator", href: "#calculator" },
            { label: "🍽 Meal Plans",        href: "#mealplans" },
            { label: "💊 Supplements",       href: "#supplements" },
            { label: "✅ Principles",         href: "#principles" },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: "11px", color: "#888", border: "1px solid #333", borderRadius: "50px",
                padding: "8px 18px", textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#ffcc00"; e.currentTarget.style.color = "#ffcc00"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#333";    e.currentTarget.style.color = "#888"; }}
            >{label}</a>
          ))}
        </div>
      </section>

      {/* ── MACRO CALCULATOR ─────────────────────────────────── */}
      <section id="calculator" className="px-6 py-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "10px", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.18em", color: "#00ffd5", marginBottom: "6px", textTransform: "uppercase" }}>
              Step 1 — Know Your Numbers
            </p>
            <h2 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.5rem)", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
              Personalised Macro Calculator
            </h2>
            <p style={{ fontSize: "12px", color: "#555", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7 }}>
              Enter your bodyweight and goal to get a starting daily calorie and macro target tailored to you.
            </p>
          </div>
          <MacroCalculator />
        </div>
      </section>

      {/* ── MEAL PLANS ───────────────────────────────────────── */}
      <section id="mealplans" className="px-6 py-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <p style={{ fontSize: "10px", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.18em", color: "#00ffd5", marginBottom: "6px", textTransform: "uppercase" }}>
              Step 2 — Follow a Template
            </p>
            <h2 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.5rem)", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
              Sample Meal Plans
            </h2>
            <p style={{ fontSize: "12px", color: "#555", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7 }}>
              These are structured Indian-friendly templates. Swap proteins and carb sources freely within the same calorie band.
            </p>
          </div>

          {/* Goal tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "32px", flexWrap: "wrap" }}>
            {Object.entries(MEAL_PLANS).map(([key, mp]) => (
              <button
                key={key}
                onClick={() => setActivePlan(key)}
                style={{
                  padding: "8px 22px", borderRadius: "50px", fontSize: "10px", fontWeight: 700,
                  fontFamily: "'Syncopate',sans-serif", cursor: "pointer", transition: "all 0.2s",
                  background: activePlan === key ? mp.color : "transparent",
                  color:      activePlan === key ? "#000"   : "#555",
                  border:     activePlan === key ? "none"   : "1px solid #333",
                }}
              >{mp.label}</button>
            ))}
          </div>

          {/* Plan card */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${plan.color}40`,
            borderRadius: "1.5rem",
            overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{ padding: "20px 28px", background: `${plan.color}10`, borderBottom: `1px solid ${plan.color}30`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "10px", fontFamily: "'Syncopate',sans-serif", color: plan.color, letterSpacing: "0.12em", marginBottom: "4px" }}>
                  {plan.label} PLAN
                </p>
                <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>{plan.description}</p>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "18px", fontWeight: 700, color: plan.color, margin: 0, fontFamily: "'Syncopate',sans-serif" }}>{plan.totalKcal}</p>
                  <p style={{ fontSize: "9px", color: "#555", margin: 0, letterSpacing: "0.08em" }}>DAILY CALORIES</p>
                </div>
                <div style={{ display: "flex", gap: "14px" }}>
                  {[
                    { label: "P", value: plan.macros.protein, color: "#00ffd5" },
                    { label: "C", value: plan.macros.carbs,   color: "#a78bfa" },
                    { label: "F", value: plan.macros.fat,     color: "#f97316" },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: m.color, margin: 0 }}>{m.value}</p>
                      <p style={{ fontSize: "9px", color: "#555", margin: 0, letterSpacing: "0.1em" }}>{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Meals */}
            <div>
              {plan.meals.map((meal, i) => (
                <div
                  key={i}
                  style={{
                    padding: "16px 28px",
                    borderBottom: i < plan.meals.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}
                >
                  <div style={{ minWidth: "160px" }}>
                    <p style={{ fontSize: "10px", fontFamily: "'Syncopate',sans-serif", color: plan.color, margin: 0, letterSpacing: "0.07em" }}>
                      {meal.time}
                    </p>
                    <p style={{ fontSize: "10px", color: "#444", margin: "3px 0 0" }}>{meal.kcal}</p>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
                    {meal.foods.filter(f => f).map((food, j) => (
                      <li key={j} style={{ fontSize: "12px", color: "#888", lineHeight: 1.7, display: "flex", alignItems: "flex-start", gap: "6px" }}>
                        <span style={{ color: plan.color, fontSize: "10px", marginTop: "3px", flexShrink: 0 }}>▸</span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "#444", textAlign: "center", marginTop: "14px", lineHeight: 1.7 }}>
            * Foods are interchangeable. Dal ↔ Chicken ↔ Paneer ↔ Tofu ↔ Eggs — keep protein grams constant.
          </p>
        </div>
      </section>

      {/* ── NUTRITION PRINCIPLES ─────────────────────────────── */}
      <section id="principles" className="px-6 py-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "10px", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.18em", color: "#00ffd5", marginBottom: "6px", textTransform: "uppercase" }}>
              Step 3 — The Fundamentals
            </p>
            <h2 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.5rem)", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
              6 Principles That Drive Results
            </h2>
            <p style={{ fontSize: "12px", color: "#555", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7 }}>
              No gimmicks. These are the evidence-based habits followed by every successful physique transformation.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {PRINCIPLES.map(({ icon, title, body, accent }, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${accent}25`,
                  borderRadius: "1.2rem",
                  padding: "20px 22px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${accent}15`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{icon}</div>
                <h3 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "11px", fontWeight: 700, color: accent, marginBottom: "10px", letterSpacing: "0.05em" }}>
                  {title}
                </h3>
                <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.7, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPLEMENTS ──────────────────────────────────────── */}
      <section id="supplements" className="px-6 py-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "10px", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.18em", color: "#00ffd5", marginBottom: "6px", textTransform: "uppercase" }}>
              Bonus — Optional Support
            </p>
            <h2 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.5rem)", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
              Supplement Stack Guide
            </h2>
            <p style={{ fontSize: "12px", color: "#555", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
              Supplements are the 5% — food is the 95%. These are the only ones worth spending money on, ranked by evidence and impact.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {SUPPLEMENTS.map(({ name, dose, timing, benefit, priority }, i) => {
              const priorityColors = { ESSENTIAL: "#ffcc00", "HIGHLY USEFUL": "#00ffd5", USEFUL: "#a78bfa" };
              const c = priorityColors[priority] || "#666";
              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "1rem",
                    padding: "16px 22px",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "16px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                >
                  <span style={{ fontSize: "9px", fontWeight: 700, fontFamily: "'Syncopate',sans-serif", color: c, border: `1px solid ${c}40`, background: `${c}10`, borderRadius: "20px", padding: "3px 10px", whiteSpace: "nowrap", letterSpacing: "0.06em" }}>
                    {priority}
                  </span>
                  <div style={{ flex: "2 1 160px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", margin: 0 }}>{name}</p>
                    <p style={{ fontSize: "11px", color: "#555", margin: "2px 0 0" }}>{benefit}</p>
                  </div>
                  <div style={{ flex: "1 1 120px" }}>
                    <p style={{ fontSize: "10px", color: "#666", margin: 0 }}><span style={{ color: c }}>Dose:</span> {dose}</p>
                    <p style={{ fontSize: "10px", color: "#666", margin: "3px 0 0" }}><span style={{ color: "#fff" }}>Timing:</span> {timing}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "20px", padding: "16px 22px", borderRadius: "1rem", background: "rgba(255,100,100,0.04)", border: "1px solid rgba(255,100,100,0.15)" }}>
            <p style={{ fontSize: "11px", color: "#888", margin: 0, lineHeight: 1.7 }}>
              ⚠️ <strong style={{ color: "#fff" }}>Disclaimer:</strong> Supplements are not regulated as medicines. Consult your doctor before starting any new supplement, especially if you have existing medical conditions.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p style={{ fontSize: "10px", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.2em", color: "#00ffd5", marginBottom: "12px", textTransform: "uppercase" }}>
            Want It Personalised?
          </p>
          <h2 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "clamp(1rem, 3vw, 1.8rem)", fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: "14px" }}>
            Get a Custom Nutrition Plan<br />Built Around <span style={{ color: "#ffcc00" }}>Your Body & Goals</span>
          </h2>
          <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.8, marginBottom: "28px", maxWidth: "460px", margin: "0 auto 28px" }}>
            Book the free body composition assessment and Akash will create a training + nutrition plan specifically for you — not a generic template.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={onStart}
              style={{
                background: "#ffcc00", color: "#000", fontFamily: "'Syncopate',sans-serif",
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em",
                padding: "14px 36px", borderRadius: "50px", border: "none",
                cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 24px rgba(255,204,0,0.25)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,204,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";   e.currentTarget.style.boxShadow = "0 4px 24px rgba(255,204,0,0.25)"; }}
            >
              Book Free Assessment →
            </button>
            <button
              onClick={onHome}
              style={{
                background: "transparent", color: "#666",
                fontSize: "11px", fontWeight: 700,
                padding: "14px 28px", borderRadius: "50px",
                border: "1px solid #333", cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#666"; }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px", display: "flex", justifyContent: "center" }}>
        <p style={{ fontSize: "10px", color: "#333", margin: 0, textAlign: "center" }}>
          © 2026 <span style={{ color: "rgba(255,204,0,0.4)" }}>Akash Athavani</span> · Diet & Nutrition Guide · Cult Neo Gym, Bengaluru
        </p>
      </footer>
    </div>
  );
}
