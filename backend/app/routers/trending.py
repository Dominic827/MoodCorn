from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..database import get_database
from ..models.title import TitleBase, TitleType

router = APIRouter(prefix="/api", tags=["trending"])


@router.get("/trending", response_model=list[TitleBase])
async def get_trending(
    content_type: TitleType = Query(TitleType.movie, description="Filter by content type"),
    limit: int = Query(20, ge=1, le=50, description="Number of results to return"),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> list[TitleBase]:
    """Return trending titles: high-vote-count, recent (2015+), well-rated (6.0+) content."""
    cursor = db.movies.find(
        {
            "type": content_type.value,
            "year": {"$gte": 2015},
            "rating": {"$gte": 6.0},
        },
        {"_id": 0},
    ).sort("votes", -1).limit(limit)

    docs: list[dict] = await cursor.to_list(length=limit)
    return [TitleBase(**doc) for doc in docs]


@router.get("/top-rated", response_model=list[TitleBase])
async def get_top_rated(
    content_type: TitleType = Query(TitleType.movie, description="Filter by content type"),
    limit: int = Query(20, ge=1, le=50, description="Number of results to return"),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> list[TitleBase]:
    """Return top-rated titles: sorted by IMDb rating with a minimum vote threshold."""
    cursor = db.movies.find(
        {
            "type": content_type.value,
            "votes": {"$gte": 10000},
        },
        {"_id": 0},
    ).sort("rating", -1).limit(limit)

    docs: list[dict] = await cursor.to_list(length=limit)
    return [TitleBase(**doc) for doc in docs]
