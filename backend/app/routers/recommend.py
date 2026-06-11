from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..database import get_database
from ..engine.scorer import score_title
from ..models.title import RecommendRequest, RecommendResult
from ..utils.filters import build_mongo_filter

router = APIRouter(prefix="/api", tags=["recommend"])


@router.post("/recommend", response_model=list[RecommendResult])
async def recommend(
    req: RecommendRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> list[RecommendResult]:
    """Score and return the top 20 titles matching the user's moods and filters.

    Raises:
        400: If no moods are provided or more than 4 moods are requested.
    """
    if not req.moods:
        raise HTTPException(status_code=400, detail="At least one mood is required.")
    if len(req.moods) > 4:
        raise HTTPException(status_code=400, detail="Maximum 4 moods allowed.")

    mongo_filter = build_mongo_filter(
        content_type=req.content_type.value,
        min_rating=req.min_rating or 0.0,
        year_min=req.year_min or 1970,
        year_max=req.year_max or 2025,
        runtime_min=req.runtime_min or 0,
        runtime_max=req.runtime_max or 300,
        language=req.language,
        country=req.country,
    )

    # Fetch a pre-filtered candidate pool sorted by rating (fast pre-rank)
    cursor = db.movies.find(mongo_filter, {"_id": 0}).sort("rating", -1).limit(3000)
    docs: list[dict] = await cursor.to_list(length=3000)

    if not docs:
        return []

    scored: list[dict] = [
        score_title(doc, req.moods, req.mood_weights, req.genre) for doc in docs
    ]
    scored.sort(key=lambda x: x["final_score"], reverse=True)
    top20 = scored[:20]

    return [RecommendResult(**item) for item in top20]
