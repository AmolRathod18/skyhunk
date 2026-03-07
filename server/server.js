// server.js — Akash Trainer OS · Express + MongoDB API
require("dotenv").config();

const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");

const app  = express();
const PORT = process.env.PORT || 4000;

/* ─────────────────────────────────────────────────────────────
   Middleware
───────────────────────────────────────────────────────────── */
app.use(cors({ origin: "*" }));   // allow Vite dev server (localhost:5173)
app.use(express.json());

/* ─────────────────────────────────────────────────────────────
   MongoDB Connection
───────────────────────────────────────────────────────────── */
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌  MONGO_URI not set. Copy server/.env.example → server/.env and fill it in.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅  MongoDB connected"))
  .catch((err) => { console.error("❌  MongoDB connection error:", err.message); process.exit(1); });

/* ─────────────────────────────────────────────────────────────
   Client Schema
───────────────────────────────────────────────────────────── */
const clientSchema = new mongoose.Schema(
  {
    clientName:      { type: String, required: true, trim: true },
    age:             Number,
    gender:          String,
    height:          Number,
    experience:      String,
    medicalFlag:     String,
    primaryGoal:     String,
    sessionsPerWeek: Number,
    weight:          Number,
    fat:             Number,
    bmi:             String,
    trainer:         String,
    preferredSlot:   String,
    selectedDays:    [String],
    weeklyPlan:      String,
    shift:           String,   // "morning" | "evening"
    couples:         Boolean,
    color:           String,   // hex accent colour for UI
    startDate:       { type: Date, default: Date.now },
    registeredAt:    { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);

/* ─────────────────────────────────────────────────────────────
   Routes
───────────────────────────────────────────────────────────── */

// Health check
app.get("/", (_req, res) => res.json({ status: "ok", message: "Akash Trainer API running" }));

// ── GET all clients (newest first) ───────────────────────────
app.get("/api/clients", async (_req, res) => {
  try {
    const clients = await Client.find().sort({ registeredAt: -1 }).lean();
    // Map _id → id so the frontend doesn't need changes
    res.json(clients.map((c) => ({ ...c, id: c._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST new client ───────────────────────────────────────────
app.post("/api/clients", async (req, res) => {
  try {
    const data = req.body;

    // Conflict check — same slot AND at least one overlapping day
    const incomingDays = Array.isArray(data.selectedDays) ? data.selectedDays : [];
    const conflict = incomingDays.length > 0
      ? await Client.findOne({ preferredSlot: data.preferredSlot, selectedDays: { $in: incomingDays } })
      : await Client.findOne({ preferredSlot: data.preferredSlot });
    if (conflict) {
      const conflictDays = Array.isArray(conflict.selectedDays)
        ? conflict.selectedDays.filter((d) => incomingDays.includes(d))
        : [];
      const dayStr = conflictDays.length ? ` on ${conflictDays.join(", ")}` : "";
      return res.status(409).json({
        error: `Slot "${data.preferredSlot}"${dayStr} is already booked by ${conflict.clientName}.`,
      });
    }

    const client = new Client(data);
    const saved  = await client.save();
    res.status(201).json({ ...saved.toObject(), id: saved._id.toString() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── DELETE client by id ───────────────────────────────────────
app.delete("/api/clients/:id", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── GET slot availability (returns which slots are taken) ─────
app.get("/api/slots/available", async (_req, res) => {
  try {
    const booked = await Client.find({}, "preferredSlot clientName").lean();
    const map = {};
    booked.forEach((c) => {
      map[c.preferredSlot] = c.clientName;
    });
    res.json({ bookedSlots: map });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────────────────────────
   Start
───────────────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`🚀  API running at http://localhost:${PORT}`);
});
