// ============================================================
// scheduleData.js — Trainer Akash (SkyHunk) real client roster
// Edit client names / slots here — no component changes needed
// ============================================================

// Trainer: Akash (SkyHunk)
// Morning Shift: 6 AM – 11 AM  |  Evening Shift: 5 PM – 10 PM
// Saturday: Week Off

// ── Morning Schedule ─────────────────────────────────────────
// Columns: [Day, 6-7, 7-8, 8-9, 9-10, 10-11]
// Sun / Tue / Thu pattern
const morningA = ["Sreelekshmi", "Guphtak",            "Indra",  "Aswathy", ""];
// Mon / Wed / Fri pattern
const morningB = ["Darshan",     "Shri Raksha & Aman", "Nitin",  "Bhargav", "Homesh & Pavitra"];

export const morning = [
  ["Sun", ...morningA],
  ["Mon", ...morningB],
  ["Tue", ...morningA],
  ["Wed", ...morningB],
  ["Thu", ...morningA],
  ["Fri", ...morningB],
  ["Sat", "",  "", "", "", ""],   // Week Off
];

// ── Evening Schedule ──────────────────────────────────────────
// Columns: [Day, 5-6, 6-7, 7-8, 8-9, 9-10]
// Sun / Tue / Thu pattern
const eveningA = ["Bishnu",  "Shweta",  "Ishan",              "Kalyani", ""];
// Mon / Wed / Fri pattern
const eveningB = ["",        "Pallavi", "Balaji & Anupriya",  "Jatin",   "Ashesh"];

export const evening = [
  ["Sun", ...eveningA],
  ["Mon", ...eveningB],
  ["Tue", ...eveningA],
  ["Wed", ...eveningB],
  ["Thu", ...eveningA],
  ["Fri", ...eveningB],
  ["Sat", "", "", "", "", ""],    // Week Off
];

// Days that have no sessions (used by ShiftGrid for "WEEK OFF" badge)
export const WEEK_OFF_DAYS = ["Sat"];

// Daily High-Performance Protocol
// Columns: [Time, Activity, Purpose]
export const dailyProtocol = [
  ["04:40 AM", "Wake Up + Hydrate", "Hormonal Reset"],
  ["05:00 AM", "Personal Training", "ICN Prep Strength"],
  ["06:00 AM", "Morning Shift",     "Client Coaching"],
  ["01:00 PM", "Power Nap",         "CNS Recovery"],
  ["05:00 PM", "Evening Shift",     "Client Coaching"],
  ["11:00 PM", "Deep Sleep",        "Full Recovery"],
];
