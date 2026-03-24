# ⚡ CSD Connect v2 — Firebase Powered Class Platform

Full-stack private class platform for 63 CSD members.
**Firebase Realtime Database + Storage + Auth + Flask + PWA**

---

## 🔥 What's New in v2

| Feature | v1 (SQLite) | v2 (Firebase) |
|---|---|---|
| Database | Local file (deleted on restart) | ☁️ Firebase — never deleted |
| Real-time | SocketIO (complex) | Firebase onValue (instant) |
| File storage | Local folder | Firebase Storage (CDN) |
| Auth | Manual hash | Firebase Auth |
| Stories | ❌ | ✅ 24-hour disappearing |
| Likes | ❌ | ✅ On every photo |
| Mood status | ❌ | ✅ On every profile |
| Event RSVP | ❌ | ✅ Yes / No / Maybe |
| PWA | ❌ | ✅ Installable on phone |
| Offline mode | ❌ | ✅ Service Worker |
| Deployment | Complex | Simple — any host |

---

## 🚀 Setup in 3 Steps

### Step 1 — Create Firebase Project

1. Go to **[firebase.google.com](https://firebase.google.com)**
2. Click **"Get Started"** → **"Add project"**
3. Name it `csd-connect` → Continue → Create

Enable these services:
- **Authentication** → Sign-in method → Email/Password → Enable
- **Realtime Database** → Create database → Start in **test mode**
- **Storage** → Get started → Start in **test mode**

4. Go to **Project Settings** → **Your apps** → **Web app** → Register
5. Copy your config and paste into `static/js/firebase-config.js`

### Step 2 — Install & Run

```bash
pip install flask
cd csdv2
python app.py
```

Open: **http://localhost:5000**

### Step 3 — Deploy to Railway (live for all 63 members)

```bash
# Push to GitHub first
git init && git add . && git commit -m "CSD Connect v2"
git remote add origin https://github.com/YOURNAME/csd-connect-v2.git
git push -u origin main
```

1. Go to **[railway.app](https://railway.app)** → New Project
2. Deploy from GitHub → Select your repo
3. Add environment variable: `SECRET_KEY=csd2024secret`
4. Done! Share the link with 63 members 🎉

---

## 🔑 Firebase Config (replace in `static/js/firebase-config.js`)

```js
const FIREBASE_CONFIG = {
  apiKey:            "AIza...",           // ← from Firebase Console
  authDomain:        "csd-connect.firebaseapp.com",
  databaseURL:       "https://csd-connect-default-rtdb.firebaseio.com",
  projectId:         "csd-connect",
  storageBucket:     "csd-connect.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123..."
};
```

---

## 📁 Project Structure

```
csdv2/
├── app.py                        ← Flask routes only (Firebase handles data)
├── requirements.txt              ← Just Flask
├── Procfile                      ← For Railway/Render
│
├── static/
│   ├── css/main.css              ← Full design system (dark+light)
│   ├── manifest.json             ← PWA manifest
│   └── js/
│       ├── firebase-config.js    ← 🔑 PUT YOUR FIREBASE KEYS HERE
│       ├── auth.js               ← Firebase Auth (register/login)
│       ├── chat.js               ← Firebase Realtime chat
│       ├── main.js               ← Particles, confetti, theme, PWA
│       └── sw.js                 ← Service Worker (offline support)
│
└── templates/
    ├── layout.html               ← Base (sidebar + topnav)
    ├── login.html                ← Firebase Auth login
    ├── register.html             ← Firebase Auth register
    ├── index.html                ← Dashboard (live Firebase data)
    ├── chat.html                 ← Real-time group chat (5 channels)
    ├── dm.html                   ← Private direct messages
    ├── stories.html              ← 24hr disappearing stories
    ├── gallery.html              ← Firebase Storage photos/videos + likes
    ├── timeline.html             ← Class milestones
    ├── members.html              ← All members + live online status
    ├── profile.html              ← Profile + mood + edit
    ├── capsule.html              ← Time capsule with countdown
    ├── polls.html                ← Polls & voting
    ├── events.html               ← Events + RSVP (Yes/No/Maybe)
    └── notifications.html        ← All notifications
```

---

## 📱 Install as Phone App (PWA)

After deployment:
1. Open the website on Chrome (Android) or Safari (iPhone)
2. Android: tap **⋮ menu → Add to Home Screen**
3. iPhone: tap **Share → Add to Home Screen**
4. App icon appears on home screen — works like a real app!

---

## ✨ All Features

| Feature | Description |
|---|---|
| 🔐 Auth | Firebase Email/Password auth |
| 💬 Group Chat | 5 channels — Realtime DB |
| 📩 Direct Messages | Private 1-on-1 |
| 😀 Emoji Reactions | React to messages |
| ⌨️ Typing Indicator | Live "typing…" |
| 🟢 Online Status | Who's live right now |
| 📸 Stories | 24hr disappearing photos/videos |
| ❤️ Likes | Heart any photo |
| 🖼️ Gallery | Firebase Storage CDN |
| 🗓️ Timeline | Class milestones |
| 👥 Members | All profiles + search |
| 😊 Mood Status | Emoji on profile |
| ⏳ Time Capsule | Sealed + countdown |
| 📊 Polls | Create + vote live |
| 📅 Events | RSVP Yes/No/Maybe |
| 🔔 Notifications | Firebase push |
| 🎉 Confetti | Birthday celebrations |
| 🌙 Dark/Light | Saves to localStorage |
| 🎆 Particles | Animated background |
| 📱 PWA | Install on phone |
| 🔌 Offline | Service Worker |

---

## 🎓 Interview Line

> "I built CSD Connect v2 — a Firebase-powered private social platform for 63 classmates. It features real-time chat with emoji reactions, 24-hour stories, a shared gallery with likes stored in Firebase Storage, class timeline, time capsule with unlock countdowns, live polls, event RSVP, mood status profiles, and birthday confetti. The app is a PWA — installable directly on any phone from the browser. Deployed on Railway."

---

## ⚠️ Firebase Security Rules

Before going live, update Firebase Realtime Database rules:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

And Storage rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
