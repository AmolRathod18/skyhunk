// seed.js — One-time script to insert the 17 schedule clients into MongoDB
// Run: node seed.js
require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌  MONGO_URI not set in .env");
  process.exit(1);
}

const clientSchema = new mongoose.Schema(
  {
    clientName:    { type: String, required: true, trim: true },
    shift:         String,   // "morning" | "evening"
    preferredSlot: String,
    selectedDays:  [String],
    couples:       Boolean,
    color:         String,
    registeredAt:  { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);

/* ─────────────────────────────────────────────────────────────
   Seed data  (matches the 17 clients in the React UI)
───────────────────────────────────────────────────────────── */
const SEED_CLIENTS = [
  // ── Morning Shift · Pattern A (Sun · Tue · Thu) ────────────
  { clientName: "Sreelekshmi",        shift: "morning", preferredSlot: "6–7 AM",   selectedDays: ["Sun","Tue","Thu"], couples: false, color: "#ff6b9d" },
  { clientName: "Guphtak",            shift: "morning", preferredSlot: "7–8 AM",   selectedDays: ["Sun","Tue","Thu"], couples: false, color: "#c77dff" },
  { clientName: "Indra",              shift: "morning", preferredSlot: "8–9 AM",   selectedDays: ["Sun","Tue","Thu"], couples: false, color: "#4cc9f0" },
  { clientName: "Aswathy",            shift: "morning", preferredSlot: "9–10 AM",  selectedDays: ["Sun","Tue","Thu"], couples: false, color: "#f77f00" },

  // ── Morning Shift · Pattern B (Mon · Wed · Fri) ────────────
  { clientName: "Darshan",            shift: "morning", preferredSlot: "6–7 AM",   selectedDays: ["Mon","Wed","Fri"], couples: false, color: "#06d6a0" },
  { clientName: "Shri Raksha & Aman", shift: "morning", preferredSlot: "7–8 AM",   selectedDays: ["Mon","Wed","Fri"], couples: true,  color: "#ff4d6d" },
  { clientName: "Nitin",              shift: "morning", preferredSlot: "8–9 AM",   selectedDays: ["Mon","Wed","Fri"], couples: false, color: "#ffd60a" },
  { clientName: "Bhargav",            shift: "morning", preferredSlot: "9–10 AM",  selectedDays: ["Mon","Wed","Fri"], couples: false, color: "#80b918" },
  { clientName: "Homesh & Pavitra",   shift: "morning", preferredSlot: "10–11 AM", selectedDays: ["Mon","Wed","Fri"], couples: true,  color: "#ff9500" },

  // ── Evening Shift · Pattern A (Sun · Tue · Thu) ────────────
  { clientName: "Bishnu",             shift: "evening", preferredSlot: "5–6 PM",   selectedDays: ["Sun","Tue","Thu"], couples: false, color: "#00b4d8" },
  { clientName: "Shweta",             shift: "evening", preferredSlot: "6–7 PM",   selectedDays: ["Sun","Tue","Thu"], couples: false, color: "#e040fb" },
  { clientName: "Ishan",              shift: "evening", preferredSlot: "7–8 PM",   selectedDays: ["Sun","Tue","Thu"], couples: false, color: "#26c6da" },
  { clientName: "Kalyani",            shift: "evening", preferredSlot: "8–9 PM",   selectedDays: ["Sun","Tue","Thu"], couples: false, color: "#ff7043" },

  // ── Evening Shift · Pattern B (Mon · Wed · Fri) ────────────
  { clientName: "Pallavi",            shift: "evening", preferredSlot: "6–7 PM",   selectedDays: ["Mon","Wed","Fri"], couples: false, color: "#ab47bc" },
  { clientName: "Balaji & Anupriya",  shift: "evening", preferredSlot: "7–8 PM",   selectedDays: ["Mon","Wed","Fri"], couples: true,  color: "#ef5350" },
  { clientName: "Jatin",              shift: "evening", preferredSlot: "8–9 PM",   selectedDays: ["Mon","Wed","Fri"], couples: false, color: "#29b6f6" },
  { clientName: "Ashesh",             shift: "evening", preferredSlot: "9–10 PM",  selectedDays: ["Mon","Wed","Fri"], couples: false, color: "#66bb6a" },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅  MongoDB connected");

  const existing = await Client.countDocuments();
  if (existing > 0) {
    console.log(`ℹ️   Collection already has ${existing} client(s). Skipping seed to avoid duplicates.`);
    console.log("    To re-seed, drop the 'clients' collection in Atlas first, then run again.");
  } else {
    await Client.insertMany(SEED_CLIENTS);
    console.log(`✅  Seeded ${SEED_CLIENTS.length} clients into MongoDB.`);
  }

  await mongoose.disconnect();
  console.log("🔌  Disconnected.");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
