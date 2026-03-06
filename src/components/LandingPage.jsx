// LandingPage.jsx — Trainer hero landing page
import { useRef, useEffect } from "react";

const STATS = [
  { value: "3",     label: "Months Experience" },
  { value: "12",    label: "Clients Trained" },
  { value: "NASM", label: "Certified Trainer" },
  { value: "BLR",  label: "Bengaluru" },
];

const SERVICES = [
  {
    num: "01",
    title: "Strength Training",
    tag: "In-Gym · 1-on-1",
    bullets: [
      "Compound lifts: squat, deadlift, bench, row",
      "Progressive overload tracked weekly",
      "Form correction every session",
    ],
  },
  {
    num: "02",
    title: "Body Composition Assessment",
    tag: "Free · 3 mins",
    bullets: [
      "BMI, body fat %, muscle mass check",
      "Posture & movement screen",
      "Instant personalised report",
    ],
  },
  {
    num: "03",
    title: "Transformation Coaching",
    tag: "Cut · Bulk · Recomp",
    bullets: [
      "Goal set in first session, reviewed weekly",
      "Diet + training plan combined",
      "Before/after photo tracking",
    ],
  },
  {
    num: "04",
    title: "Cardio & Fat Loss",
    tag: "HIIT · LISS · Circuits",
    bullets: [
      "Custom cardio protocol by goal & fitness level",
      "Heart rate zone training",
      "Fits around your schedule",
    ],
  },
  {
    num: "05",
    title: "Posture & Mobility Fix",
    tag: "Corrective · Pain-Free",
    bullets: [
      "Identifies muscle imbalances",
      "Targeted corrective exercise plan",
      "Desk worker & athlete specific",
    ],
  },
  {
    num: "06",
    title: "Weekly Training Programs",
    tag: "Updated Every Week",
    bullets: [
      "Full day-by-day workout plan",
      "Sets, reps, tempo — all specified",
      "Adjusted based on last week's performance",
    ],
  },
];

export default function LandingPage({ onStart, onDashboard, onNutrition }) {
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.volume = 0;
    const tryPlay = () => v.play().catch(console.error);
    tryPlay();
    // Also try on any user interaction
    document.addEventListener("click", tryPlay, { once: true });
    return () => document.removeEventListener("click", tryPlay);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#05070a" }}>

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'Syncopate',sans-serif", color: "#ffcc00" }}>
            Akash Athavani
          </span>
          <span className="text-xs text-gray-600 ml-2">· Elite Trainer OS</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDashboard}
            className="text-xs px-3 py-2 rounded-full font-bold transition-opacity hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.05)", color: "#888", border: "1px solid #222" }}
          >
            Dashboard
          </button>
          <button
            onClick={onNutrition}
            className="text-xs px-3 py-2 rounded-full font-bold transition-opacity hover:opacity-80"
            style={{ background: "rgba(0,255,213,0.08)", color: "#00ffd5", border: "1px solid rgba(0,255,213,0.25)" }}
          >
            Nutrition
          </button>
          <button
            onClick={onStart}
            className="text-xs px-4 py-2 rounded-full font-bold transition-opacity hover:opacity-80"
            style={{ background: "#ffcc00", color: "#000", fontFamily: "'Syncopate',sans-serif" }}
          >
            Start Assessment
          </button>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="flex-1 flex items-center px-6 md:px-16 py-16" style={{ minHeight: "85vh", position: "relative", overflow: "hidden" }}>

        {/* ── Background Video ── */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            opacity: 1,
            zIndex: 0,
            filter: "brightness(1.5) contrast(1.1) saturate(1.2)",
          }}
        >
          <source src="/gym_background_video.mp4" type="video/mp4" />
        </video>
        {/* ── Dark gradient overlay on top of video ── */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1,
          background: "rgba(5,7,10,0.15)",
          pointerEvents: "none",
        }} />

        {/* ── Content above video ── */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center" style={{ position: "relative", zIndex: 2 }}>

          {/* ── LEFT: Big Photo ─── */}
          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div
              className="hero-photo-wrap"
              style={{
                width: "420px",
                maxWidth: "90vw",
                height: "560px",
                borderRadius: "2rem",
                overflow: "hidden",
                border: "2px solid rgba(255,204,0,0.35)",
                position: "relative",
                background: "linear-gradient(160deg, #1a1400 0%, #05070a 100%)",
              }}
            >
              <img
                src="/akash.png"
                alt="Akash Athavani"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.querySelector(".photo-placeholder").style.display = "flex";
                }}
              />
              {/* Fallback placeholder shown only when image missing */}
              <div
                className="photo-placeholder"
                style={{
                  display: "none",
                  position: "absolute", inset: 0,
                  flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(160deg, #1a1200, #05070a)",
                  color: "rgba(255,204,0,0.3)",
                  fontSize: "6rem",
                  gap: "1rem",
                }}
              >
                <span>👤</span>
                <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,204,0,0.25)", fontFamily: "'Syncopate',sans-serif" }}>
                  ADD PHOTO TO public/akash.jpg
                </span>
              </div>
              {/* Gold gradient overlay at bottom */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "140px",
                background: "linear-gradient(to top, rgba(5,7,10,0.95) 0%, transparent 100%)",
                pointerEvents: "none",
              }} />
              {/* Name overlay at photo bottom */}
              <div style={{ position: "absolute", bottom: "1.2rem", left: "1.4rem" }}>
                <p style={{ color: "rgba(255,204,0,0.7)", fontSize: "0.58rem", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.2em", marginBottom: "4px" }}>
                  FITNESS COACH · CULT NEO GYM
                </p>
                <p style={{ color: "#fff", fontSize: "1.1rem", fontFamily: "'Syncopate',sans-serif", fontWeight: 800, letterSpacing: "0.05em" }}>
                  Akash Athavani
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Text content ─── */}
          <div className="hero-text-col order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left">
            {/* Badge */}
            <div
              className="hero-badge inline-block text-xs px-4 py-1 rounded-full mb-6 font-bold tracking-widest"
              style={{ border: "1px solid #ffcc00", color: "#ffcc00", fontSize: "0.6rem", fontFamily: "'Syncopate',sans-serif" }}
            >
              CULT NEO GYM · v18.0
            </div>

            {/* Name */}
            <h1
              className="font-bold mb-3"
              style={{ fontFamily: "'Syncopate',sans-serif", letterSpacing: "5px", fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 1.2 }}
            >
              <span className="hero-name">AKASH</span>
              <span className="hero-name-gold">ATHAVANI</span>
            </h1>

            <p className="text-gray-400 text-base mb-2 font-light mt-4">Fitness Coach · Cult Neo Gym, Bengaluru</p>
            <p
              className="text-xs mb-10 tracking-widest uppercase"
              style={{ color: "#00ffd5", fontFamily: "'Syncopate',sans-serif" }}
            >
              Transform · Perform · Dominate
            </p>

            {/* CTA */}
            <button
              onClick={onStart}
              className="px-10 py-4 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #ffcc00, #ff9900)",
                color: "#000",
                fontFamily: "'Syncopate',sans-serif",
                boxShadow: "0 0 30px rgba(255,204,0,0.3)",
              }}
            >
              ⚡ Book Free Assessment
            </button>

            <p className="text-xs text-gray-600 mt-4">Takes 3 minutes · Get a full performance report</p>
          </div>

        </div>
        {/* closes z-index content wrapper */}
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-px border-t border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.04)" }}>
        {STATS.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center justify-center py-8" style={{ background: "#05070a" }}>
            <span className="text-2xl font-bold mb-1" style={{ color: "#ffcc00", fontFamily: "'Syncopate',sans-serif" }}>
              {value}
            </span>
            <span className="text-xs text-gray-500 tracking-widest uppercase" style={{ fontSize: "0.6rem" }}>
              {label}
            </span>
          </div>
        ))}
      </section>

      {/* ── SERVICES ──────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#00ffd5", fontFamily: "'Syncopate',sans-serif" }}>What I Offer</p>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syncopate',sans-serif" }}>Services</h2>
          <div className="mx-auto mt-3" style={{ width: "48px", height: "3px", background: "linear-gradient(90deg,#ffcc00,#ff9900)", borderRadius: "2px" }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ num, title, tag, bullets }) => (
            <div
              key={title}
              className="rounded-2xl flex flex-col"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "border-color 0.3s, background 0.3s, transform 0.25s, box-shadow 0.3s",
                cursor: "default",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(255,204,0,0.5)";
                e.currentTarget.style.background = "rgba(255,204,0,0.04)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,204,0,0.12)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Card top bar */}
              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "11px", fontWeight: 700, color: "#ffcc00", letterSpacing: "0.12em" }}>{num}</span>
                <span style={{ fontSize: "10px", color: "#00ffd5", background: "rgba(0,255,213,0.08)", border: "1px solid rgba(0,255,213,0.2)", borderRadius: "20px", padding: "2px 10px", letterSpacing: "0.05em", fontWeight: 600 }}>{tag}</span>
              </div>
              {/* Card body */}
              <div style={{ padding: "16px 18px 20px" }}>
                <h3 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "12px", fontWeight: 700, color: "#fff", marginBottom: "14px", lineHeight: 1.4, letterSpacing: "0.04em" }}>{title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {bullets.map((b, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "11.5px", color: "#888", lineHeight: 1.5 }}>
                      <span style={{ color: "#ffcc00", marginTop: "2px", fontSize: "10px", flexShrink: 0 }}>▸</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT + CTA side by side ────────────────────────── */}
      <section className="px-6 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

          {/* LEFT — Connect With Me */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,204,0,0.2)",
            borderRadius: "1.5rem",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "20px 28px" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#00ffd5", fontFamily: "'Syncopate',sans-serif", textTransform: "uppercase", marginBottom: "4px" }}>Get In Touch</p>
              <h2 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "15px", fontWeight: 700, color: "#fff", margin: 0 }}>Connect With Me</h2>
            </div>
            <div style={{ padding: "8px 0", flex: 1 }}>
              <a href="https://www.instagram.com/sky_physique._?igsh=MTlzb2F0ZmpiYW9wZg==" target="_blank" rel="noopener noreferrer"
                className="no-underline flex items-center gap-4"
                style={{ padding: "16px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(225,48,108,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><defs><radialGradient id="ig1" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="5%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/></radialGradient></defs><rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig1)"/><circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/><circle cx="17.2" cy="6.8" r="1.1" fill="white"/></svg>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "10px", color: "#555", margin: 0, fontWeight: 600, letterSpacing: "0.06em" }}>INSTAGRAM</p>
                  <p style={{ fontSize: "14px", color: "#e1306c", margin: 0, fontWeight: 700 }}>@sky_physique._</p>
                </div>
                <span style={{ color: "#444", fontSize: "12px" }}>↗</span>
              </a>
              <a href="tel:+918296186405"
                className="no-underline flex items-center gap-4"
                style={{ padding: "16px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,213,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><rect width="24" height="24" rx="6" fill="#25D366"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white"/></svg>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "10px", color: "#555", margin: 0, fontWeight: 600, letterSpacing: "0.06em" }}>CALL / WHATSAPP</p>
                  <p style={{ fontSize: "14px", color: "#00ffd5", margin: 0, fontWeight: 700 }}>+91 82961 86405</p>
                </div>
                <span style={{ color: "#444", fontSize: "12px" }}>↗</span>
              </a>
              <a href="https://www.cult.fit/cult/cult-pass/bangalore/cult-neo-gym-Kudlu-main-road/2706" target="_blank" rel="noopener noreferrer"
                className="no-underline flex items-center gap-4"
                style={{ padding: "16px 28px", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,204,0,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><rect width="24" height="24" rx="6" fill="#ffcc00"/><path d="M12 4C9.24 4 7 6.24 7 9c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5zm0 6.5c-.83 0-1.5-.67-1.5-1.5S11.17 7.5 12 7.5s1.5.67 1.5 1.5S12.83 10.5 12 10.5z" fill="#000"/></svg>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "10px", color: "#555", margin: 0, fontWeight: 600, letterSpacing: "0.06em" }}>LOCATION</p>
                  <p style={{ fontSize: "14px", color: "#ffcc00", margin: 0, fontWeight: 700 }}>Cult Neo Gym · Kudlu Main Road, Bengaluru</p>
                </div>
                <span style={{ color: "#444", fontSize: "12px" }}>↗</span>
              </a>
            </div>
          </div>

          {/* RIGHT — CTA Box */}
          <div style={{
            background: "rgba(255,204,0,0.04)",
            border: "1px solid rgba(255,204,0,0.2)",
            borderRadius: "1.5rem",
            padding: "36px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "10px", fontFamily: "'Syncopate',sans-serif", letterSpacing: "0.2em", color: "#00ffd5", marginBottom: "16px", textTransform: "uppercase" }}>
              Free · Takes 3 Minutes
            </p>
            <h2 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "clamp(1rem,2.5vw,1.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: "14px" }}>
              Know Exactly Where<br />You Stand Today
            </h2>
            <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.7, marginBottom: "28px", maxWidth: "320px" }}>
              Fill the assessment. Get a full report — body composition, strength, cardio, posture & a weekly training plan — instantly.
            </p>
            <button
              onClick={onStart}
              style={{
                background: "#ffcc00", color: "#000",
                fontFamily: "'Syncopate',sans-serif", fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.15em", padding: "14px 36px",
                borderRadius: "50px", border: "none", cursor: "pointer",
                textTransform: "uppercase", transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 24px rgba(255,204,0,0.25)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,204,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(255,204,0,0.25)"; }}
            >
              Book Free Assessment →
            </button>
            <p style={{ fontSize: "11px", color: "#444", marginTop: "14px" }}>
              No cost · No commitment · Results in under 3 min
            </p>
          </div>

        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}>
        {/* Main footer content */}
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand col */}
          <div>
            <p style={{ fontFamily: "'Syncopate',sans-serif", fontSize: "13px", fontWeight: 700, color: "#ffcc00", marginBottom: "8px" }}>AKASH ATHAVANI</p>
            <p style={{ fontSize: "11px", color: "#555", lineHeight: 1.7 }}>
              Fitness Coach at Cult Neo Gym,<br />Kudlu Main Road, Bengaluru.
            </p>
            <p style={{ fontSize: "11px", color: "#444", marginTop: "10px" }}>NASM Certified · Est. 2025</p>
          </div>
          {/* Quick links col */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "#555", textTransform: "uppercase", marginBottom: "12px" }}>Quick Links</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Book Free Assessment", action: onStart },
                { label: "Diet & Nutrition Guide", action: onNutrition },
              ].map(({ label, action }) => (
                <button key={label} onClick={action} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "12px", color: "#666", padding: 0, transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#ffcc00"}
                  onMouseLeave={e => e.currentTarget.style.color = "#666"}>
                  → {label}
                </button>
              ))}
              <a href="https://www.instagram.com/sky_physique._?igsh=MTlzb2F0ZmpiYW9wZg==" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: "12px", color: "#666", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#e1306c"}
                onMouseLeave={e => e.currentTarget.style.color = "#666"}>→ Instagram</a>
              <a href="https://www.cult.fit/cult/cult-pass/bangalore/cult-neo-gym-Kudlu-main-road/2706" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: "12px", color: "#666", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#ffcc00"}
                onMouseLeave={e => e.currentTarget.style.color = "#666"}>→ Cult Neo Gym</a>
            </div>
          </div>
          {/* Contact col */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "#555", textTransform: "uppercase", marginBottom: "12px" }}>Contact</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="tel:+918296186405" style={{ fontSize: "12px", color: "#00ffd5", textDecoration: "none" }}>📞 +91 82961 86405</a>
              <a href="https://www.instagram.com/sky_physique._" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#e1306c", textDecoration: "none" }}>📸 @sky_physique._</a>
              <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>📍 Kudlu Main Road, Bengaluru</p>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "14px 24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p style={{ fontSize: "10px", color: "#333", margin: 0, textAlign: "center" }}>
            © 2026 <span style={{ color: "rgba(255,204,0,0.4)" }}>Akash Athavani</span> · All rights reserved · Cult Neo Gym, Bengaluru
          </p>
        </div>
      </footer>
    </div>
  );
}
