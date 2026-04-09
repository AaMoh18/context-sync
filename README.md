# 🔄 Context-Sync

**AI-powered status updates for tired developers. Turn chaotic brain dumps into structured, audience-specific syncs in real-time.**

[![Live Demo](https://img.shields.io/badge/Demo-Live_Site-success?style=for-the-badge)]((https://context-sync.netlify.app))

## 🚀 The Problem

Daily standups and status updates carry high psychological friction. Developers experience "status update fatigue" trying to translate their technical work into structured formats for different stakeholders. 

**Context-Sync** solves this by allowing developers to write a raw "brain dump" of their day. Our AI engine instantly categorizes the text into a structured sync object and translates it into audience-specific summaries (e.g., Manager View vs. Tech Lead View).

## ✨ Key Features

- 🧠 **AI Categorization Engine:** Instantly parses raw text into `Done`, `In Progress`, and `Blockers`.
- 🗣️ **Semantic Translation:** Automatically generates tailored summaries based on the viewing audience.
- 🎨 **Frictionless UX:** Features a custom, hand-drawn aesthetic to lower cognitive load and reduce the formality/stress of updates. 
- ⚡ **Real-Time Sync:** Powered by Firebase Firestore, updates appear instantly across all team members' screens without refreshing.
- 📱 **Fully Responsive:** CSS Grid architecture ensures a flawless experience from desktop to mobile.

## 🛠️ Tech Stack

Our stack was chosen for maximum development velocity, reliability, and real-time performance.

### Frontend
* **Framework:** React 18 & Vite
* **Styling:** Custom CSS (Hand-drawn aesthetic, CSS Grid)
* **Animations:** Framer Motion
* **Deployment:** Vercel

### Backend
* **Runtime:** Node.js & Express.js
* **Logic:** Custom pattern-matching AI / Categorization rules engine (ensures 10ms latency and 100% reliability for demos)
* **Deployment:** Render

### Database
* **Database:** Firebase Firestore (NoSQL)
* **Architecture:** Real-time `onSnapshot()` listeners and consistent queries mapped directly to the problem domain.

## 🗄️ Data Architecture

Our Firestore schema directly reflects the domain model:
```json
{
  "id": "sync_1775731385147",
  "rawText": "Fixed the website CORS bug, still working on the auth token expiry...",
  "processedData": {
    "done": ["Fixed CORS bug"], 
    "inProgress": ["Auth token expiry"], 
    "blockers": []
  },
  "translations": {
    "managerSummary": "Resolved backend connection issues; investigating login stability.",
    "leadSummary": "CORS headers patched. Investigating JWT TTL refresh logic."
  },
  "timestamp": "April 9, 2026 at 4:13:08 PM",
  "author": "dev_01"
}
