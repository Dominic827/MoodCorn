from fastapi import APIRouter

from ..engine.mood_map import ALL_MOODS, MOOD_GENRE_MAP

router = APIRouter(prefix="/api", tags=["moods"])


@router.get("/moods")
async def get_moods() -> dict:
    """Return all available mood names and their genre weight mappings."""
    return {
        "moods": ALL_MOODS,
        "mood_genre_map": MOOD_GENRE_MAP,
    }
