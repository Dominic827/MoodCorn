from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..database import get_database
from ..models.title import TitleBase

router = APIRouter(prefix="/api", tags=["titles"])


@router.get("/title/{imdb_id}", response_model=TitleBase)
async def get_title(
    imdb_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> TitleBase:
    """Fetch a single title by its IMDb ID.

    Raises:
        404: If no title with the given IMDb ID exists in the database.
    """
    doc = await db.movies.find_one({"imdb_id": imdb_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail=f"Title '{imdb_id}' not found.")
    return TitleBase(**doc)
