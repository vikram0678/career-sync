# 🎯 CareerSync — Intelligent Career & Application Tracker

A modern, high-performance job application tracker, drag-and-drop Kanban pipeline, and AI career studio built with **React 19**, **Vite**, **Supabase**, and **Google Gemini 2.0 Flash**.

---

## ⚡ Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js** (version 18 or higher) installed on your system.
Verify in terminal:
```bash
node -v
npm -v
```

---

### 2. Navigate to Project Directory
Open your terminal (PowerShell, Command Prompt, or Git Bash) and navigate to the project directory:
```bash
cd d:\career-sync
```

---

### 3. Install Dependencies
If running for the first time or setting up on a new machine:
```bash
npm install
```

---

### 4. Environment Configuration
Check that `.env.local` exists in the root folder with the required keys:
```env
# Supabase Authentication & Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Google Gemini API Key (Can also be added directly in the UI)
VITE_GEMINI_API_KEY=your-gemini-api-key
```
> *Tip: You can also enter and manage your Gemini API key directly inside the app under **Profile & AI** settings.*

---

### 5. Start the Development Server
Run the Vite development server:
```bash
npm run dev
```

Once started, open your browser and go to:
👉 **`http://localhost:5173`** (or the port shown in your terminal)

---

### 6. Useful Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server with instant HMR |
| `npm run build` | Builds optimized production bundle to `/dist` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ultra-fast `oxlint` code checker |

---

## 🚀 Key Features & Shortcuts

- **Pipeline Views**: Toggle between **Table View** and **Drag-and-Drop Kanban Board**.
- **Global Search**: Press `/` to focus the search bar across role, company, salary, and JD.
- **Quick New Application**: Press `N` to open the "Track Application" modal.
- **Close Modals**: Press `Esc` anytime.
- **AI Magic Paste**: Paste raw job postings to auto-extract company, role, salary, and requirements via Gemini 2.0.
- **AI Career Studio**: Role-specific interview prep questions, resume bullet generators, and outreach pitch notes.
