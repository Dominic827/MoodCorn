# MoodCorn

> **"Find the perfect watch for your mood."**

MoodCorn is a mood-based recommendation platform for **Movies**, **TV Series**, and **Anime**. Discover content tailored to how you feel — powered by a transparent, rule-based scoring engine using real IMDb ratings and TMDb metadata.

No accounts. No AI black-box. Just honest, explainable recommendations.

---

## 🎬 Live Demo

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Database**: MongoDB Atlas

---

## ✨ Features

- 🎭 **Mood-Based Selection** — Choose up to 4 moods that describe how you feel
- 🎬 **Content Types** — Movies, TV Series, Anime
- 🎯 **Genre Filtering** — 16 genre options
- ⚙️ **Advanced Filters** — IMDb rating, release year, runtime, language, country
- ⚖️ **Custom Mood Weights** — Control how much each mood influences your recommendations
- 📊 **Transparent Scoring** — Every recommendation includes a match %, why it was recommended, and mood compatibility breakdown
- 🃏 **Flip Card UI** — Hover to reveal details, click to expand
- 🎞️ **Logo Intro Animation** — Cinematic coin-flip intro on first visit
- 📱 **Fully Responsive** — Mobile-first design

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS v3 | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Router v6 | Routing |
| Axios | HTTP client |
| Zustand | State management |

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI | Web framework |
| Motor | Async MongoDB driver |
| Pandas / NumPy | Data processing |
| Pydantic v2 | Validation |
| Uvicorn | ASGI server |

### Infrastructure
| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Cloud database |
| Vercel | Frontend hosting |
| Render | Backend hosting |
| TMDb API | Posters, backdrops, overviews |
| IMDb Datasets | Ratings & title metadata |

---

## 📁 Project Structure

```
MoodCorn/
├── frontend/                  # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── animations/   # LogoIntro
│   │   │   ├── layout/       # Navbar, Footer
│   │   │   └── ui/           # Cards, Pills, Sliders
│   │   ├── pages/            # Home, Recommendations, About
│   │   ├── services/         # Axios API client
│   │   ├── store/            # Zustand state
│   │   └── types/            # TypeScript types
│   └── vercel.json
│
├── backend/                   # FastAPI + Python
│   ├── app/
│   │   ├── engine/           # Scoring logic, mood map
│   │   ├── models/           # Pydantic schemas
│   │   ├── routers/          # API route handlers
│   │   └── utils/            # Filter builder
│   ├── scripts/
│   │   └── ingest_imdb.py    # One-time data ingestion
│   ├── Dockerfile
│   └── render.yaml
│
└── docker-compose.yml
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB Atlas account (free tier works)
- TMDb API key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/moodcorn.git
cd moodcorn
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Copy the env file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moodcorn
TMDB_API_KEY=your_tmdb_api_key_here
FRONTEND_URL=http://localhost:5173
GITHUB_URL=https://github.com/yourusername/moodcorn
```

Start the backend:
```bash
uvicorn app.main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

---

### 3. Data Ingestion (One-Time)

> **Run this once** to populate your MongoDB database with IMDb data.

```bash
cd backend

# With TMDb enrichment (recommended):
python -m scripts.ingest_imdb --limit 50000

# Dry run (no DB writes):
python -m scripts.ingest_imdb --limit 1000 --dry-run

# Skip download if cached:
python -m scripts.ingest_imdb --skip-download --limit 50000
```

**What it does:**
1. Downloads `title.basics.tsv.gz` and `title.ratings.tsv.gz` from IMDb
2. Filters to top 50,000 most relevant titles
3. Enriches each title with TMDb data (poster, overview, cast)
4. Stores everything in MongoDB Atlas

> ⚠️ This may take 30–60 minutes depending on your internet speed and TMDb rate limits.
> Cached IMDb files are stored in `backend/data_cache/` to avoid re-downloading.

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Copy the env file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_GITHUB_URL=https://github.com/yourusername/moodcorn
```

Start the frontend:
```bash
npm run dev
```

Open: `http://localhost:5173`

---

### 5. Docker (Backend Only)

```bash
# Copy env file
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Start backend
docker-compose up -d backend

# Run ingestion as one-off job
docker-compose run --rm ingest --limit 50000
```

---

## 📡 API Reference

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/moods` | List all moods + genre map |
| `GET` | `/api/genres` | List all genres |
| `POST` | `/api/recommend` | Get top 20 recommendations |
| `GET` | `/api/title/{imdb_id}` | Get single title |
| `GET` | `/api/trending` | Get trending titles |
| `GET` | `/api/top-rated` | Get top-rated titles |

Full interactive docs: `http://localhost:8000/docs`

### POST /api/recommend

```json
{
  "content_type": "movie",
  "moods": ["Happy", "Excited"],
  "mood_weights": { "Happy": 60, "Excited": 40 },
  "genre": "Action",
  "min_rating": 7.0,
  "year_min": 2000,
  "year_max": 2024,
  "runtime_min": 80,
  "runtime_max": 180,
  "language": "en"
}
```

---

## 🔢 Recommendation Engine

MoodCorn uses a **deterministic, rule-based scoring formula** — no machine learning, no AI.

```
FinalScore = (MoodScore × 0.45)
           + (GenreScore × 0.25)
           + (RatingScore × 0.15)
           + (PopularityScore × 0.10)
           + (RecencyScore × 0.05)
```

| Factor | Weight | Source |
|--------|--------|--------|
| Mood Score | 45% | Predefined mood → genre weight map |
| Genre Score | 25% | Direct genre match |
| Rating Score | 15% | IMDb average rating (normalized) |
| Popularity Score | 10% | IMDb vote count (log-normalized) |
| Recency Score | 5% | Release year (1970–2025) |

---

## 🚀 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set build settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: `frontend`
4. Add environment variables:
   - `VITE_API_URL` = your Render backend URL
   - `VITE_GITHUB_URL` = your GitHub repo URL

### Backend → Render

1. Push to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - `MONGODB_URI`
   - `TMDB_API_KEY`
   - `FRONTEND_URL` (your Vercel URL)

Alternatively, use the included `render.yaml` by connecting your repo to Render with Blueprint support.

---

## 📄 Data Attribution

- **IMDb Non-Commercial Datasets** — Used under [IMDb terms](https://www.imdb.com/interfaces/) for non-commercial purposes
- **The Movie Database (TMDb)** — Poster images, backdrops, and overviews courtesy of [TMDb](https://www.themoviedb.org). MoodCorn is not endorsed or certified by TMDb.

---

## 📜 License

MIT License. See `LICENSE` for details.

---

Built with ❤️ by [Your Name](https://github.com/yourusername)
