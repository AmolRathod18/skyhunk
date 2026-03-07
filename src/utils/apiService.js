// apiService.js — Frontend API layer for Akash Trainer OS
// Tries the Express/MongoDB backend first; falls back to localStorage if offline.

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const LS_KEY   = "gym_clients";

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
function lsRead()         { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
function lsWrite(clients) { localStorage.setItem(LS_KEY, JSON.stringify(clients)); }

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ─────────────────────────────────────────────────────────────
   Public API
───────────────────────────────────────────────────────────── */

/**
 * Fetch all clients.
 * Returns array from MongoDB if server is up, otherwise from localStorage.
 */
export async function getClients() {
  try {
    const clients = await apiFetch("/api/clients");
    // Keep localStorage in sync so RosterTab polling always works
    lsWrite([...clients].reverse());
    return clients;
  } catch {
    // Server offline — use localStorage
    return lsRead().slice().reverse();
  }
}

/**
 * Save a new client.
 * Tries MongoDB first; mirrors to localStorage in both cases.
 * Throws if slot conflict is returned by the server (409).
 */
export async function saveClient(entry) {
  // ── localStorage first (so RosterTab stays real-time) ──
  const existing = lsRead();

  // Local conflict check (fast, works offline) — per slot + day combination
  const localConflict = existing.find(
    (c) =>
      c.preferredSlot === entry.preferredSlot &&
      (c.selectedDays || []).some((d) => (entry.selectedDays || []).includes(d))
  );
  if (localConflict) {
    const conflictDays = (localConflict.selectedDays || []).filter((d) =>
      (entry.selectedDays || []).includes(d)
    );
    throw new Error(
      `Slot "${entry.preferredSlot}" on ${conflictDays.join(", ")} is already booked by ${localConflict.clientName}. Please adjust your booking.`
    );
  }

  const entryWithId = { ...entry, id: entry.id ?? Date.now() };
  lsWrite([...existing, entryWithId]);

  // ── Then try MongoDB ──
  try {
    const saved = await apiFetch("/api/clients", {
      method:  "POST",
      body:    JSON.stringify(entryWithId),
    });
    // Update localStorage with the server-assigned _id
    const updated = lsRead().map((c) =>
      (c.id === entryWithId.id || c.id === saved.id) ? { ...c, id: saved.id } : c
    );
    lsWrite(updated);
    return saved;
  } catch (err) {
    // If server returned a 409 conflict, undo the localStorage write and re-throw
    if (err.message.includes("already booked")) {
      lsWrite(existing);
      throw err;
    }
    // Server offline — localStorage already saved; return local entry
    console.warn("API offline — saved to localStorage only:", err.message);
    return entryWithId;
  }
}

/**
 * Delete a client by id.
 */
export async function deleteClient(id) {
  // Always remove from localStorage immediately
  const updated = lsRead().filter((c) => String(c.id) !== String(id));
  lsWrite(updated);

  // Try server delete
  try {
    await apiFetch(`/api/clients/${id}`, { method: "DELETE" });
  } catch {
    // Server offline — localStorage is already updated
  }
}
