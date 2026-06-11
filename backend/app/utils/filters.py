from typing import Optional


def build_mongo_filter(
    content_type: str,
    min_rating: float = 0.0,
    year_min: int = 1970,
    year_max: int = 2025,
    runtime_min: int = 0,
    runtime_max: int = 300,
    language: Optional[str] = None,
    country: Optional[str] = None,
) -> dict:
    """Build a MongoDB filter dict for the movies collection.

    Args:
        content_type: One of "movie", "series", "anime".
        min_rating:   Minimum IMDb average rating (inclusive).
        year_min:     Earliest release year (inclusive).
        year_max:     Latest release year (inclusive).
        runtime_min:  Minimum runtime in minutes (inclusive).
        runtime_max:  Maximum runtime in minutes (inclusive). Ignored unless
                      it meaningfully restricts the default range.
        language:     ISO 639-1 language code (e.g. "en", "ja").
        country:      Country name or ISO code (case-insensitive regex match).

    Returns:
        A dict suitable for passing to Motor/PyMongo ``find()`` or
        ``count_documents()``.
    """
    query: dict = {"type": content_type}

    query["rating"] = {"$gte": min_rating}
    query["year"] = {"$gte": year_min, "$lte": year_max}

    # Only add runtime filter when it actually restricts results
    if runtime_min > 0 or runtime_max < 300:
        query["runtime"] = {"$gte": runtime_min, "$lte": runtime_max}

    if language:
        query["language"] = language.lower()

    if country:
        query["country"] = {"$regex": country, "$options": "i"}

    return query
