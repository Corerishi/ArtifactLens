# ArtifactLens — AI-Powered Deepfake Detection

## Project Structure
```
ARTIFACTLENS_WEB/
├── backend/        ← FastAPI server
├── frontend/       ← React + Vite app
└── README.md
```

## Requirements
- Python 3.10+
- Node.js 18+
- MongoDB (running locally on port 27017)
- artifact_lens_final.h5 (share separately — too large for GitHub)

## Backend Setup
```bash
cd backend
python -m venv .venv

# Windows:
.venv\Scripts\activate

# Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

Place `artifact_lens_final.h5` inside `backend/models/`

Then run:
```bash
uvicorn main:app --reload
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
```

---

