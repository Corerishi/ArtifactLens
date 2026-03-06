# 🔍 ArtifactLens — AI-Powered Deepfake Detection System

> Deep Learning + Full Stack Web Application

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20-orange?logo=tensorflow)
![FastAPI](https://img.shields.io/badge/FastAPI-0.131-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Local-brightgreen?logo=mongodb)
![Accuracy](https://img.shields.io/badge/Model%20Accuracy-82.99%25-success)

---

## 🧠 What is ArtifactLens?

ArtifactLens is a full-stack web application that detects AI-generated (deepfake) face images using deep learning. A user uploads a photograph — the system detects the face, aligns it, runs it through a fine-tuned ResNet50 model, and returns whether the image is **Real or Fake** with a confidence score.

---

## ✨ Features

- 🎯 **82.99% Model Accuracy** — fine-tuned ResNet50 with class-weighted loss
- 🧬 **Face Alignment Pipeline** — MTCNN-based detection with rotation correction
- 🔐 **JWT Authentication** — secure register/login with bcrypt password hashing
- 📜 **Analysis History** — every result saved to MongoDB per user
- ⚡ **Async Backend** — FastAPI + Motor for non-blocking performance
- 🌑 **Dark UI** — React 18 + TailwindCSS with cybersecurity aesthetic

---

## 🏗️ System Architecture
```
User Upload (React)
      ↓
FastAPI /api/predict
      ↓
MTCNN Face Detection
      ↓
FaceProcessor (align + crop + normalize)
      ↓
ResNet50 Model (.h5) → Real / Fake + Confidence
      ↓
MongoDB (save to history)
      ↓
Result displayed on frontend
```

---

## 🤖 Model Details

| Property | Details |
|---|---|
| Base Architecture | ResNet50 (pretrained on ImageNet) |
| Training Dataset | 138,638 images (Fake + Real) |
| Training Hardware | NVIDIA RTX A6000 (48GB VRAM) |
| Technique | Transfer Learning + Fine-tuning (last 30 layers) |
| Bias Fix | Class-weighted loss — Real images penalized 2.5× |

### Version Comparison

| Version | Overall Accuracy | Fake Detection | Real Detection |
|---|---|---|---|
| v1 (Baseline) | 73.95% | ~90% | ~55% |
| **v2 (Final)** | **82.99%** | **78.74%** | **87.25%** |

---

## 🛠️ Tech Stack

**Backend**
- FastAPI + Uvicorn
- TensorFlow 2.20 + tf-keras
- MTCNN + OpenCV (face detection & alignment)
- Motor (async MongoDB driver)
- passlib + python-jose (auth & JWT)

**Frontend**
- React 18 + Vite
- TailwindCSS
- Axios + React Router DOM

**Database**
- MongoDB (local) — users + history collections

---

## 📁 Project Structure
```
ArtifactLens/
├── backend/
│   ├── main.py          ← FastAPI server, all API routes
│   ├── inference.py     ← FaceProcessor + ResNet50 model prediction
│   ├── database.py      ← MongoDB async connection
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.jsx      ← Upload + result display
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── History.jsx   ← Past analysis results
        └── components/
            ├── Navbar.jsx
            └── ProtectedRoute.jsx
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB running on `localhost:27017`
- `artifact_lens_final.h5` model file (contact for access — too large for GitHub)

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Place artifact_lens_final.h5 inside backend/models/

uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access
| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/predict` | Upload image → returns Real/Fake + confidence |
| POST | `/api/auth/register` | Create user account |
| POST | `/api/auth/login` | Login → returns JWT token |
| GET | `/api/history` | Get user's analysis history |
| DELETE | `/api/history` | Clear history |

---

## 👤 Author

**Rishi Raj** 