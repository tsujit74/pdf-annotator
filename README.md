# PDF Annotator

React + Node.js application that allows users to upload PDF files, highlight text within the document, and persist these highlights for later viewing. The app supports user login, saving uploaded PDFs and their annotations to a backend, and reloading them with previously saved highlights.

---

## ✅ Features (MVP)

* User authentication (signup / login) with JWT
* Upload PDF files and store them on the backend
* Dashboard (“My Library”) showing PDFs uploaded by the user
* View a PDF with pagination + zoom
* Select text in PDF → highlight → save highlight (page, text, position)
* Restore highlights when opening a PDF again
* Delete or edit highlights
* Secure endpoints so users see only their own PDFs / highlights

---

## ⚙️ Tech Stack

| Layer                 | Technologies                               |
| --------------------- | ------------------------------------------ |
| Frontend              | React, TypeScript, Vite, Tailwind CSS      |
| Backend               | Node.js, Express, TypeScript               |
| Database              | MongoDB                                    |
| Authentication        | JWT                                        |
| File storage          | Local file system on the server            |
| Viewer & Highlighting | `react-pdf`, custom overlay for highlights |

---

## 🗂 Project Structure

```
pdf-annotator/
├─ frontend/          # React UI
│   ├─ src/
│   │   ├─ components/     # PDF viewer, overlay, highlight update etc.
│   │   ├─ pages/          # Login, Dashboard, Viewer
│   │   ├─ services/       # API wrappers for PDF, highlight, auth
│   │   ├─ types/          # Shared TypeScript types (Highlight, PDF, etc.)
│   │   └─ ...
│   ├─ public/
│   ├─ package.json
│   └─ vite.config.ts
├─ backend/           # Express + APIs
│   ├─ src/
│   │   ├─ models/        # User, PDF, Highlight
│   │   ├─ routes/        # auth, pdf upload/list, highlight CRUD
│   │   ├─ middleware/    # JWT auth, error handling
│   │   └─ server.ts
│   ├─ package.json
│   └─ .env
└─ README.md           # This file
```

---

## 🔧 Setup & Run Instructions

### Prerequisites

* Node.js (14+ or latest LTS) installed
* MongoDB installed / available (local or cloud)
* Environment variables set (see below)

---

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tsujit74/pdf-annotator.git
cd pdf-annotator
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env   # create environment file and fill in values
npm install
npm run dev            # start backend in dev mode (http://localhost:4000)
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev            # start frontend in dev mode (http://localhost:5173)
```

---

⚡ With this flow, reviewers can:

1. `git clone`
2. `cd backend && npm install && npm run dev`
3. `cd frontend && npm install && npm run dev`
   ✅ And immediately test login → upload → highlight → restore.

---

## ⚠️ Known Limitations & Assumptions

* Search within PDF or highlight texts is **not implemented** (outside MVP)
* Advanced bonus features like tagging highlights, sharing PDFs, etc., are skipped due to deadline
* Highlights’ position may slightly differ between zoom levels (simple bounding box logic)
* PDF files stored locally — no cloud storage integration

---

## 📝 Possible Improvements (Bonus)

* Allow user to rename or delete uploaded PDFs
* Draw freehand highlights or shapes, not only text selection
* Add offline mode / service worker caching
* Share PDFs with other users (permission-based)
* Support cloud storage (Dropbox / Google Drive)

---

## 📄 License

Project for academic / assignment purposes. No specific license.


