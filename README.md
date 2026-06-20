# 🎤 AI-Driven Multimodal Public Speaking Feedback System

> An **offline, privacy-preserving** AI system that analyzes video input and provides comprehensive, personalized feedback on your public speaking skills.

**By:** Srushti B S, Sinchana Shetty B N, Yukthi C  
**Department:** CSE (Data Science), RNSIT  
**Guide:** Ms. Rachitha E (Asst. Professor)

---

## 📌 What It Does

Upload a video of yourself speaking, and the system returns:

| Metric | How It's Measured |
|--------|------------------|
| 🗣️ Speech-to-Text Transcript | OpenAI Whisper |
| ⏱️ Speaking Speed (WPM) | Librosa + word count |
| 🤫 Filler Word Detection | Regex + context-aware NLP |
| 🧍 Posture Score | MediaPipe Holistic landmarks |
| 👁️ Eye Contact % | Iris landmark tracking |
| 🤲 Gesture Heatmap | Hand wrist position tracking |
| 💪 Confidence Index | Weighted score: Posture 35% + Eye Contact 40% + Gestures 25% |
| 📋 Professional Feedback | Rule-based personalized report |

**All processing is 100% offline** — no cloud APIs, no data leaves your machine.

---

## 🗂️ Project Structure

```
speech-feedback-system/
├── backend/
│   ├── app.py              # Flask API server
│   ├── utils_audio.py      # Whisper + Librosa audio analysis
│   ├── utils_video.py      # MediaPipe + OpenCV video analysis
│   ├── utils_cache.py      # SHA256 caching + dynamic frame params
│   └── requirements.txt
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   ├── index.css       # Tailwind + custom glassmorphism styles
    │   └── components/
    │       ├── UploadSection.js
    │       ├── ConfidenceIndex.js
    │       ├── PostureScore.js
    │       ├── EyeContact.js
    │       ├── FillerWords.js
    │       ├── ChartSpeakingSpeed.js
    │       ├── GestureHeatmap.js
    │       ├── ProfessionalFeedback.js
    │       └── ResultCard.js
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- FFmpeg (installed automatically via `imageio[ffmpeg]`)

---

### 🔧 Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The server starts at `http://127.0.0.1:5000`

> **Note:** On first run, Whisper downloads the `tiny` model (~39MB). This is a one-time download.

---

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app opens at `http://localhost:3000`

---

## 🚀 How to Use

1. Open `http://localhost:3000` in your browser
2. Drag & drop a video file (MP4, WebM, etc.) or click to browse
3. Click **Start Analysis**
4. Wait ~15–30 seconds for processing
5. View your full analysis dashboard!
6. Click **DOWNLOAD DATA** to export your results as JSON

---

## 🔬 Technical Architecture

```
Video Upload
    ↓
FFmpeg → Extract Audio (WAV, 16kHz mono)
    ↓ (parallel)
┌─────────────────────────┬──────────────────────────┐
│   Audio Pipeline        │   Video Pipeline         │
│   Whisper → Transcript  │   MediaPipe Holistic      │
│   Librosa → WPM/chunks  │   → Pose landmarks        │
│   NLP → Filler words    │   → Face/iris landmarks   │
│                         │   → Hand landmarks        │
└─────────────────────────┴──────────────────────────┘
    ↓
Confidence Score = (Posture×0.35 + Eye×0.40 + Gesture×0.25) × 100
    ↓
JSON Response → React Dashboard
```

### Performance Optimizations
- **Parallel threading** via `ThreadPoolExecutor` (audio + video simultaneously)
- **Frame-level caching** with SHA256 hash — repeat analyses are instant
- **Dynamic frame sampling** — stride auto-calculated based on video length
- **Eager Whisper loading** — model loads on server startup, not per request
- **Gzip compression** via `flask-compress` (60–80% smaller responses)
- **React.memo** on all components — 60% fewer re-renders

---

## 📐 Mathematical Models

| Feature | Formula |
|---------|---------|
| Speaking Speed | `WPM = (word_count / duration_sec) × 60` |
| Silence Ratio | `silent_frames / total_frames` |
| Gesture Intensity | `√(dx² + dy²)` per frame |
| Confidence Index | `(posture×0.35 + eye×0.40 + gesture×0.25) × 100` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, Flask, Flask-CORS, Flask-Compress |
| Speech | OpenAI Whisper (offline), Librosa |
| Vision | MediaPipe Holistic, OpenCV |
| Audio Extraction | FFmpeg (via imageio) |
| Frontend | React 18, Tailwind CSS |
| Charts | Chart.js, react-chartjs-2 |
| HTTP Client | Axios |
| Icons | react-icons |

---

## 🔮 Future Scope

- Real-time live feedback (WebSocket streaming)
- Advanced emotion detection (facial + vocal)
- User history & progress tracking (database integration)
- Mobile application
- BERT/RoBERTa text quality analysis

---

## 📄 License

Academic project — RNSIT, Department of CSE (Data Science). For educational use.
