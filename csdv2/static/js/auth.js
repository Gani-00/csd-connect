/* CSD Connect v2 — Firebase Auth */
import { auth, db, randomColor, initials } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ── REGISTER ─────────────────────────────────────────────────────────────────
export async function registerUser(fullName, username, rollNo, password, birthday) {
  const email = `${username.toLowerCase()}@csd.connect`;
  const cred  = await createUserWithEmailAndPassword(auth, email, password);
  const uid   = cred.user.uid;
  const color = randomColor(username);
  const profile = {
    uid, username: username.toLowerCase(),
    full_name: fullName, roll_no: rollNo,
    email, birthday: birthday || "",
    bio: "", mood: "😊",
    avatar_color: color,
    is_admin: false,
    created_at: Date.now()
  };
  await set(ref(db, `users/${uid}`), profile);
  // Index username → uid for lookups
  await set(ref(db, `usernames/${username.toLowerCase()}`), uid);
  // Set Flask session
  await setFlaskSession({ uid, username: username.toLowerCase(), full_name: fullName, avatar_color: color });
  return profile;
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export async function loginUser(username, password) {
  const email = `${username.toLowerCase()}@csd.connect`;
  const cred  = await signInWithEmailAndPassword(auth, email, password);
  const uid   = cred.user.uid;
  const snap  = await get(ref(db, `users/${uid}`));
  if (!snap.exists()) throw new Error("Profile not found");
  const profile = snap.val();
  await setFlaskSession({ uid, username: profile.username, full_name: profile.full_name, avatar_color: profile.avatar_color });
  return profile;
}

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export async function logoutUser() {
  await signOut(auth);
  await fetch("/session/clear", { method: "POST" });
  location.href = "/login";
}

// ── FLASK SESSION SYNC ────────────────────────────────────────────────────────
async function setFlaskSession(data) {
  await fetch("/session/set", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// ── GET USER BY USERNAME ──────────────────────────────────────────────────────
export async function getUserByUsername(username) {
  const uidSnap = await get(ref(db, `usernames/${username.toLowerCase()}`));
  if (!uidSnap.exists()) return null;
  const uid = uidSnap.val();
  const snap = await get(ref(db, `users/${uid}`));
  return snap.exists() ? { uid, ...snap.val() } : null;
}

// ── GET USER BY UID ───────────────────────────────────────────────────────────
export async function getUserByUid(uid) {
  const snap = await get(ref(db, `users/${uid}`));
  return snap.exists() ? { uid, ...snap.val() } : null;
}

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
export async function updateProfile(uid, updates) {
  await set(ref(db, `users/${uid}`), updates);
}

export { onAuthStateChanged, auth };
