# SKYHUNK OS — Akash Athavani Trainer Dashboard

A full-stack personal trainer operating system built with **React + Vite** (frontend) and **Express + MongoDB Atlas** (backend).

---

## Features

- **Live Client Dashboard** — 17 real clients loaded from MongoDB Atlas
- **Client Directory** — Visual profile cards with weekly training calendar per client
- **Roster Tab** — Morning & Evening shift grid with slot-conflict detection
- **Assessment Wizard** — Full client onboarding form (body stats, goals, medical flags)
- **Session Plans** — Auto-generated 5-step training plans per goal & experience level
- **24H Ops Tab** — Daily high-performance protocol timeline
- **Nutrition Page** — Macro & meal planning reference
- **PWA Ready** — Installable as a mobile app

---

## Tech Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, CSS-in-JS         |
| Backend   | Node.js, Express 4                |
| Database  | MongoDB Atlas (Mongoose 8)        |

---

## Project Structure

```
akash-react/
+-- src/
¦   +-- App.jsx
¦   +-- components/
¦   ¦   +-- tabs/
¦   ¦   ¦   +-- ClientDirectoryTab.jsx   # Client wall (DB-driven)
¦   ¦   ¦   +-- RosterTab.jsx            # Schedule grid
¦   ¦   ¦   +-- DailyOpsTab.jsx
¦   ¦   +-- assessment/
¦   ¦       +-- AssessmentForm.jsx
¦   +-- data/scheduleData.js
¦   +-- utils/apiService.js
+-- server/
¦   +-- server.js         # Express API + Mongoose
¦   +-- seed.js           # One-time DB seed (17 clients)
¦   +-- .env.example
+-- index.html
```

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/AmolRathod18/skyhunk.git
cd skyhunk
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
# Fill in MONGO_URI in .env
npm install
node seed.js    # first time only — seeds 17 clients
node server.js  # start API on port 4000
```

### 3. Frontend setup (new terminal)

```bash
cd ..
npm install
npm run dev     # http://localhost:5173
```

---

## API Endpoints

| Method | Route                  | Description           |
|--------|------------------------|-----------------------|
| GET    | `/api/clients`         | Fetch all clients     |
| POST   | `/api/clients`         | Register new client   |
| DELETE | `/api/clients/:id`     | Remove a client       |
| GET    | `/api/slots/available` | Booked slot map       |

---

## Environment Variables

Create `server/.env` (never commit this file):

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/akash_trainer?retryWrites=true&w=majority
PORT=4000
```

---

## License

Private — Akash Athavani Personal Training System © 2026
