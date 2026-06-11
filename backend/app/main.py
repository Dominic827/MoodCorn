from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import close_mongo_connection, connect_to_mongo
from .routers import genres, moods, recommend, titles, trending


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Manage application startup and shutdown lifecycle."""
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="MoodCorn API",
    description=(
        "Mood-based recommendation engine for Movies, TV Series, and Anime. "
        "Select your mood, apply filters, and discover perfectly matched titles."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

settings = get_settings()

# ---------------------------------------------------------------------------
# CORS – allow the Vite dev server, any Vercel preview, and configurable origin
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(moods.router)
app.include_router(genres.router)
app.include_router(recommend.router)
app.include_router(titles.router)
app.include_router(trending.router)


# ---------------------------------------------------------------------------
# Root & health endpoints
# ---------------------------------------------------------------------------
@app.get("/api/health", tags=["system"])
async def health() -> dict:
    """Liveness probe – returns 200 when the API is up."""
    return {"status": "ok", "service": "MoodCorn API", "version": "1.0.0"}


@app.get("/", tags=["system"])
async def root() -> dict:
    """Root endpoint – points visitors to interactive docs."""
    return {
        "message": "MoodCorn API is running. See /docs for API documentation.",
        "docs": "/docs",
        "health": "/api/health",
    }
