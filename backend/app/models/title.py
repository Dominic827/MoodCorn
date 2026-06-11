from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class TitleType(str, Enum):
    movie = "movie"
    series = "series"
    anime = "anime"


class TitleBase(BaseModel):
    imdb_id: str
    title: str
    type: TitleType
    genres: list[str]
    year: int
    runtime: Optional[int] = None
    rating: float
    votes: int
    language: Optional[str] = None
    country: Optional[str] = None
    description: Optional[str] = None
    poster: Optional[str] = None
    backdrop: Optional[str] = None
    cast: Optional[list[str]] = None
    tmdb_id: Optional[int] = None


class TitleInDB(TitleBase):
    id: Optional[str] = Field(None, alias="_id")
    model_config = ConfigDict(populate_by_name=True)


class RecommendRequest(BaseModel):
    content_type: TitleType
    moods: list[str]
    mood_weights: Optional[dict[str, float]] = None
    genre: Optional[str] = None
    min_rating: Optional[float] = 0.0
    year_min: Optional[int] = 1970
    year_max: Optional[int] = 2025
    runtime_min: Optional[int] = 0
    runtime_max: Optional[int] = 300
    language: Optional[str] = None
    country: Optional[str] = None


class RecommendResult(TitleBase):
    final_score: float
    mood_score: float
    genre_score: float
    rating_score: float
    popularity_score: float
    recency_score: float
    match_percentage: int
    why_recommended: str
    mood_compatibility: dict[str, float]
