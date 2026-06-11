from fastapi import APIRouter

from ..engine.mood_map import ALL_GENRES

router = APIRouter(prefix="/api", tags=["genres"])


@router.get("/genres")
async def get_genres() -> dict:
    """Return the list of all supported genres."""
    return {"genres": ALL_GENRES}
