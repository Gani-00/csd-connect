/* CSD Connect v2 — Chat (Firebase Realtime) */
import { db, formatTime, initials } from "./firebase-config.js";
import {
  ref, push, onValue, set, serverTimestamp, onDisconnect
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const EMOJIS = ["❤️","😂","😮","😢","👍","🔥","🎉","💯","😍","👏"];

export function initChat(meUid, meName, meColor, room) {
  const msgsRef   = ref(db, `chats/${room}/messages`);
  const typingRef = ref(db, `chats/${room}/typing/${meUid}`);
  const onlineRef = ref(db, `online/${meUid}`);
  const msgsEl    = document.getElementById("chatMsgs");
  const typingBox = document.getElementById("typingBox");
  let typingTimer, isTyping = false;

  // ── MARK ONLINE ──
  set(onlineRef, { name: meName, color: meColor, ts: serverTimestamp() });
  onDisconnect(onlineRef).remove();

  // ── LISTEN TO MESSAGES ──
  onValue(msgsRef, snap => {
    if (!snap.exists()) return;
    const msgs = snap.val();
    const keys = Object.keys(msgs);
    const lastKey = keys[keys.length - 1];
    const msg = msgs[lastKey];
    if (!msgsEl) return;
    // Only append if it's a new message (not full re-render)
    if (document.getElementById(`msg-${lastKey}`)) return;
    appendMsg(lastKey, msg, msg.sender_id === meUid);
    scrollBottom();
  });

  // ── LISTEN TO TYPING ──
  const typRef2 = ref(db, `chats/${room}/typing`);
  onValue(typRef2, snap => {
    if (!snap.exists() || !typingBox) { if (typingBox) typingBox.innerHTML = ""; return; }
    const typers = Object.entries(snap.val())
      .filter(([uid, _]) => uid !== meUid)
      .map(([_, d]) => d.name);
    typingBox.innerHTML = typers.length
      ? `<div class="typing-ind"><span></span><span></span><span></span><span class="typing-txt">${typers.join(", ")} typing…</span></div>`
      : "";
  });

  // ── LISTEN TO ONLINE ──
  const onlineAllRef = ref(db, "online");
  onValue(onlineAllRef, snap => {
    const onlineCount = document.getElementById("onlineCount");
    if (onlineCount) onlineCount.textContent = snap.exists() ? Object.keys(snap.val()).length : 0;
    if (!snap.exists()) return;
    Object.keys(snap.val()).forEach(uid => {
      document.querySelectorAll(`[data-uid="${uid}"] .online-dot`).forEach(d => d.style.display = "block");
    });
  });

  // ── SEND MESSAGE ──
  window.sendMsg = async function () {
    const inp = document.getElementById("chatInp");
    const txt = inp?.value.trim();
    if (!txt) return;
    inp.value = ""; inp.style.height = "42px";
    stopTyping();
    await push(msgsRef, {
      sender_id: meUid, sender_name: meName,
      sender_color: meColor, content: txt,
      ts: serverTimestamp()
    });
  };

  // ── SEND DM ──
  window.sendDm = async function (otherUid) {
    const inp = document.getElementById("chatInp");
    const txt = inp?.value.trim();
    if (!txt) return;
    inp.value = ""; inp.style.height = "42px";
    const dmRoom = [meUid, otherUid].sort().join("_");
    const dmRef  = ref(db, `dms/${dmRoom}/messages`);
    const msg    = { sender_id: meUid, sender_name: meName, sender_color: meColor, content: txt, ts: serverTimestamp() };
    appendMsg(Date.now(), msg, true);
    scrollBottom();
    await push(dmRef, msg);
  };

  // ── LISTEN DM ──
  window.initDm = function (otherUid) {
    const dmRoom = [meUid, otherUid].sort().join("_");
    const dmRef  = ref(db, `dms/${dmRoom}/messages`);
    onValue(dmRef, snap => {
      if (!snap.exists() || !msgsEl) return;
      msgsEl.innerHTML = "";
      Object.entries(snap.val()).forEach(([k, m]) => appendMsg(k, m, m.sender_id === meUid));
      scrollBottom();
    });
  };

  // ── TYPING ──
  window.onTyping = function () {
    if (!isTyping) { isTyping = true; set(typingRef, { name: meName }); }
    clearTimeout(typingTimer);
    typingTimer = setTimeout(stopTyping, 2000);
  };
  function stopTyping() { isTyping = false; set(typingRef, null); }

  // ── REACT ──
  window.openReactPicker = function (msgId, btn) {
    document.querySelectorAll(".rxn-picker").forEach(p => { if (p.dataset.for !== msgId) p.classList.remove("open"); });
    let pk = document.querySelector(`.rxn-picker[data-for="${msgId}"]`);
    if (!pk) {
      pk = document.createElement("div");
      pk.className = "rxn-picker"; pk.dataset.for = msgId;
      pk.innerHTML = EMOJIS.map(e => `<span class="rxn-opt" onclick="sendReact('${msgId}','${e}')">${e}</span>`).join("");
      btn.parentElement.style.position = "relative";
      btn.parentElement.appendChild(pk);
    }
    pk.classList.toggle("open");
  };

  window.sendReact = async function (msgId, emoji) {
    const rRef = ref(db, `chats/${room}/messages/${msgId}/reactions/${meUid}`);
    await set(rRef, emoji);
    document.querySelectorAll(".rxn-picker").forEach(p => p.classList.remove("open"));
  };

  // ── SWITCH ROOM ──
  window.switchRoom = function (newRoom) {
    location.href = `/chat/${newRoom}`;
  };

  // ── AUTO-RESIZE INPUT ──
  const inp = document.getElementById("chatInp");
  if (inp) {
    inp.addEventListener("input", () => {
      window.onTyping?.();
      inp.style.height = "42px";
      inp.style.height = Math.min(inp.scrollHeight, 120) + "px";
    });
    inp.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); window.sendMsg?.(); }
    });
  }

  scrollBottom();
}

// ── APPEND MESSAGE ────────────────────────
function appendMsg(id, data, isMine) {
  const el = document.getElementById("chatMsgs");
  if (!el || document.getElementById(`msg-${id}`)) return;
  const div = document.createElement("div");
  div.className = `msg-row${isMine ? " mine" : ""}`;
  div.id = `msg-${id}`;
  const ini = initials(data.sender_name || "?");
  const rxns = data.reactions ? renderReactions(id, data.reactions) : "";
  div.innerHTML = `
    ${!isMine ? `<div class="av av-36" style="background:${data.sender_color||'#7c6bff'}">${ini}</div>` : ""}
    <div>
      ${!isMine ? `<div class="msg-name" style="color:${data.sender_color||'#7c6bff'}">${escHtml(data.sender_name)}</div>` : ""}
      <div class="bubble">${escHtml(data.content)}<span class="msg-time">${data.ts ? formatTime(data.ts) : ""}</span></div>
      <div class="rxn-row" id="rxn-${id}">
        ${rxns}
        <button class="rxn-btn" onclick="openReactPicker('${id}',this)"><i class="far fa-smile" style="font-size:.78rem"></i></button>
      </div>
    </div>
    ${isMine ? `<div class="av av-36" style="background:${data.sender_color||'#7c6bff'}">${ini}</div>` : ""}`;
  el.appendChild(div);
}

function renderReactions(msgId, reactions) {
  const counts = {};
  Object.values(reactions).forEach(e => { counts[e] = (counts[e] || 0) + 1; });
  return Object.entries(counts).map(([e, n]) => `<button class="rxn-btn">${e} ${n}</button>`).join("");
}

function scrollBottom() {
  const el = document.getElementById("chatMsgs");
  if (el) el.scrollTop = el.scrollHeight;
}

function escHtml(s) {
  const d = document.createElement("div");
  d.appendChild(document.createTextNode(s || ""));
  return d.innerHTML;
}

// Close pickers on outside click
document.addEventListener("click", e => {
  if (!e.target.closest(".rxn-btn") && !e.target.closest(".rxn-picker"))
    document.querySelectorAll(".rxn-picker").forEach(p => p.classList.remove("open"));
});
