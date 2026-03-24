// ═══════════════════════════════════════════
//  CSD Connect v2 — Firebase Configuration
//  Replace the values below with your own
//  from Firebase Console → Project Settings
// ═══════════════════════════════════════════

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCGlQp_S7dAqtUMRcM9xm2uT4ZLyr6HdCk",
  authDomain:        "csd-connect-425cd.firebaseapp.com",
  databaseURL:       "https://csd-connect-425cd-default-rtdb.firebaseio.com",
  projectId:         "csd-connect-425cd",
  storageBucket:     "csd-connect-425cd.firebasestorage.app",
  messagingSenderId: "495741365821",
  appId:             "1:495741365821:web:c22a7a6591a85af8264454"
};

// ── INITIALIZE FIREBASE ──────────────────────────────────────────────────────
import { initializeApp }           from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth }                  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase }              from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage }               from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore }             from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseApp = initializeApp(FIREBASE_CONFIG);

export const auth    = getAuth(firebaseApp);
export const db      = getDatabase(firebaseApp);       // Realtime DB
export const store   = getFirestore(firebaseApp);      // Firestore
export const storage = getStorage(firebaseApp);        // File Storage

// ── AVATAR COLORS ─────────────────────────────────────────────────────────────
export const AVATAR_COLORS = [
  "#6c63ff","#ff6b9d","#ff6b6b","#ffd93d",
  "#4ade80","#00d4ff","#ffb347","#cc5de8",
  "#2dd4bf","#20c997","#f97316","#3b82f6"
];

export function randomColor(seed = "") {
  const idx = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

export function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
}
