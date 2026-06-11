import math
from typing import Optional

from ..engine.mood_map import MOOD_GENRE_MAP

MIN_YEAR = 1970
MAX_YEAR = 2026
MAX_VOTES_LOG = math.log(2_000_000 + 1)


def compute_mood_score(
    genres: list[str],
    moods: list[str],
    mood_weights: Optional[dict[str, float]] = None,
) -> tuple[float, dict[str, float]]:
    """Compute mood score for a title given its genres and selected moods.

    Returns:
        (aggregate_mood_score_0_to_1, per_mood_compatibility_dict)
    """
    if not moods:
        return 0.0, {}

    # Build normalized weight map
    if mood_weights:
        weights = {m: mood_weights.get(m, 0) / 100.0 for m in moods}
    else:
        equal = 1.0 / len(moods)
        weights = {m: equal for m in moods}

    per_mood_scores: dict[str, float] = {}
    for mood in moods:
        genre_map = MOOD_GENRE_MAP.get(mood, {})
        if not genre_map:
            per_mood_scores[mood] = 0.0
            continue
        max_possible = max(genre_map.values())
        title_score = sum(genre_map.get(g, 0) for g in genres)
        # Normalize: divide by (max_possible * 2) to scale sensibly across multi-genre titles
        normalized = min(title_score / (max_possible * 2), 1.0)
        per_mood_scores[mood] = round(normalized * 100, 1)

    aggregate = sum(weights[m] * per_mood_scores[m] / 100.0 for m in moods)
    return aggregate, per_mood_scores


def compute_genre_score(genres: list[str], selected_genre: Optional[str]) -> float:
    """Return 1.0 if the genre filter matches, 0.5 if no filter, 0.0 if no match."""
    if not selected_genre:
        return 0.5
    return 1.0 if selected_genre in genres else 0.0


def compute_rating_score(rating: float) -> float:
    """Normalize IMDb rating (1–10) to 0–1 range."""
    return max(0.0, min(1.0, (rating - 1.0) / 9.0))


def compute_popularity_score(votes: int) -> float:
    """Log-scale popularity score based on vote count, capped at 2 million."""
    if votes <= 0:
        return 0.0
    return min(1.0, math.log(votes + 1) / MAX_VOTES_LOG)


def compute_recency_score(year: int) -> float:
    """Linear recency score: older titles score lower."""
    return max(0.0, min(1.0, (year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)))


def build_why_recommended(
    moods: list[str],
    genres: list[str],
    selected_genre: Optional[str],
    rating: float,
    match_pct: int,
) -> str:
    """Build a human-readable explanation for why a title was recommended."""
    mood_str = " & ".join(moods[:2])
    parts: list[str] = []

    if mood_str:
        parts.append(f"Matches your {mood_str} mood")
    if selected_genre and selected_genre in genres:
        parts.append(f"includes {selected_genre}")
    if rating >= 8.0:
        parts.append("critically acclaimed")
    elif rating >= 7.0:
        parts.append("highly rated")

    parts.append(f"{match_pct}% match")
    sentence = "; ".join(parts).capitalize() + "."
    return sentence


def score_title(
    doc: dict,
    moods: list[str],
    mood_weights: Optional[dict[str, float]],
    selected_genre: Optional[str],
) -> dict:
    """Score a single MongoDB document and return an enriched dict with all score fields."""
    genres: list[str] = doc.get("genres", [])
    rating: float = doc.get("rating", 5.0)
    votes: int = doc.get("votes", 0)
    year: int = doc.get("year", MIN_YEAR)

    mood_s, mood_compat = compute_mood_score(genres, moods, mood_weights)
    genre_s = compute_genre_score(genres, selected_genre)
    rating_s = compute_rating_score(rating)
    pop_s = compute_popularity_score(votes)
    recency_s = compute_recency_score(year)

    # Weighted final score
    final = (
        (mood_s * 0.45)
        + (genre_s * 0.25)
        + (rating_s * 0.15)
        + (pop_s * 0.10)
        + (recency_s * 0.05)
    )

    match_pct = min(99, max(1, int(final * 100)))
    why = build_why_recommended(moods, genres, selected_genre, rating, match_pct)

    return {
        **doc,
        "final_score": round(final, 6),
        "mood_score": round(mood_s, 4),
        "genre_score": round(genre_s, 4),
        "rating_score": round(rating_s, 4),
        "popularity_score": round(pop_s, 4),
        "recency_score": round(recency_s, 4),
        "match_percentage": match_pct,
        "why_recommended": why,
        "mood_compatibility": mood_compat,
    }
