#!/usr/bin/env python3
"""
MoodCorn IMDb Data Ingestion Script
=====================================
Usage
-----
    python -m scripts.ingest_imdb [--limit 50000] [--dry-run]

What it does
------------
1. Downloads ``title.basics.tsv.gz`` and ``title.ratings.tsv.gz`` from IMDb
   (cached locally after the first run).
2. Merges and filters the datasets to keep only movies / TV series with
   sufficient votes and a rating ≥ 5.0.
3. Enriches every record with TMDb data (poster, backdrop, overview, cast,
   country, language).  Falls back to placeholder data if ``TMDB_API_KEY``
   is not set.
4. Upserts processed documents into MongoDB (``moodcorn.movies``).

Requirements
------------
- ``MONGODB_URI`` environment variable must be set (or present in ``.env``).
- ``TMDB_API_KEY`` is optional; without it posters/overviews will be absent.
"""

import argparse
import gzip
import logging
import math
import os
import sys
import time
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd
import requests
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne
from pymongo.errors import BulkWriteError
from tqdm import tqdm

# ---------------------------------------------------------------------------
# Bootstrap – load .env from the backend root
# ---------------------------------------------------------------------------
load_dotenv(Path(__file__).parent.parent / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("ingest")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
IMDB_BASICS_URL = "https://datasets.imdbws.com/title.basics.tsv.gz"
IMDB_RATINGS_URL = "https://datasets.imdbws.com/title.ratings.tsv.gz"

TMDB_BASE = "https://api.themoviedb.org/3"
TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500"
TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280"

DATA_DIR = Path(__file__).parent.parent / "data_cache"
DATA_DIR.mkdir(exist_ok=True)

# ISO-3166-1 alpha-2 country codes associated with anime production
ANIME_COUNTRIES = {"JP", "KR", "CN", "TW", "HK"}

# IMDb genre string → our normalised genre label (None = discard the genre)
GENRE_MAP: dict[str, Optional[str]] = {
    "Action": "Action",
    "Adventure": "Adventure",
    "Animation": "Animation",
    "Biography": "Biography",
    "Comedy": "Comedy",
    "Crime": "Crime",
    "Documentary": "Documentary",
    "Drama": "Drama",
    "Family": "Family",
    "Fantasy": "Fantasy",
    "History": "History",
    "Horror": "Horror",
    "Music": "Drama",
    "Musical": "Drama",
    "Mystery": "Mystery",
    "News": "Documentary",
    "Romance": "Romance",
    "Sci-Fi": "Sci-Fi",
    "Short": None,
    "Sport": "Sport",
    "Thriller": "Thriller",
    "War": "Action",
    "Western": "Adventure",
}


# ---------------------------------------------------------------------------
# Download helpers
# ---------------------------------------------------------------------------

def download_file(url: str, dest: Path) -> Path:
    """Download *url* to *dest*, showing a tqdm progress bar.

    Skips the download if the destination file already exists (cache).
    """
    if dest.exists():
        log.info(f"Using cached file: {dest.name}")
        return dest

    log.info(f"Downloading {url} …")
    response = requests.get(url, stream=True, timeout=120)
    response.raise_for_status()

    total_bytes = int(response.headers.get("content-length", 0))
    with open(dest, "wb") as fh, tqdm(
        total=total_bytes, unit="B", unit_scale=True, desc=dest.name
    ) as bar:
        for chunk in response.iter_content(chunk_size=1024 * 1024):
            fh.write(chunk)
            bar.update(len(chunk))

    log.info(f"Saved to {dest}")
    return dest


# ---------------------------------------------------------------------------
# IMDb dataset loaders
# ---------------------------------------------------------------------------

def load_imdb_basics(path: Path) -> pd.DataFrame:
    """Parse title.basics.tsv.gz and return a filtered DataFrame."""
    log.info("Loading title.basics …")
    cols = ["tconst", "titleType", "primaryTitle", "startYear", "runtimeMinutes", "genres"]
    with gzip.open(path, "rt", encoding="utf-8") as fh:
        df = pd.read_csv(
            fh, sep="\t", usecols=cols, na_values="\\N", low_memory=False
        )

    # Keep only feature films and (mini-)series
    valid_types = {"movie", "tvSeries", "tvMiniSeries"}
    df = df[df["titleType"].isin(valid_types)].copy()

    df["startYear"] = pd.to_numeric(df["startYear"], errors="coerce")
    df["runtimeMinutes"] = pd.to_numeric(df["runtimeMinutes"], errors="coerce")

    # Year range filter
    df = df[(df["startYear"] >= 1970) & (df["startYear"] <= 2026)].copy()

    # Drop rows with missing title or genres
    df = df.dropna(subset=["primaryTitle", "genres"]).copy()

    log.info(f"Basics loaded: {len(df):,} titles after filtering")
    return df


def load_imdb_ratings(path: Path) -> pd.DataFrame:
    """Parse title.ratings.tsv.gz and return a filtered DataFrame."""
    log.info("Loading title.ratings …")
    with gzip.open(path, "rt", encoding="utf-8") as fh:
        df = pd.read_csv(fh, sep="\t", na_values="\\N", low_memory=False)

    # Minimum quality / popularity thresholds
    df = df[df["numVotes"] >= 1000].copy()
    df = df[df["averageRating"] >= 5.0].copy()

    log.info(f"Ratings loaded: {len(df):,} titles with sufficient votes")
    return df


# ---------------------------------------------------------------------------
# Merging & classification
# ---------------------------------------------------------------------------

def merge_datasets(basics: pd.DataFrame, ratings: pd.DataFrame) -> pd.DataFrame:
    """Inner-join basics and ratings on tconst, rank by relevance."""
    log.info("Merging datasets …")
    merged = basics.merge(ratings, on="tconst", how="inner")

    # Composite relevance: higher-rated AND more popular titles come first
    merged["relevance"] = merged["averageRating"] * np.log1p(merged["numVotes"])
    merged = merged.sort_values("relevance", ascending=False).reset_index(drop=True)

    log.info(f"Merged dataset: {len(merged):,} titles")
    return merged


def classify_type(row: pd.Series, country: Optional[str] = None, genres: Optional[list[str]] = None) -> str:
    """Determine whether a row is a 'movie', 'series', or 'anime'.

    The *country* and *genres* arguments (from TMDb enrichment) are used to
    refine anime detection after the initial classification pass.
    """
    title_type: str = row["titleType"]

    if title_type == "movie":
        # Anime movie: Animation from an anime-producing country
        if country in ANIME_COUNTRIES and genres and "Animation" in genres:
            return "anime"
        return "movie"

    # tvSeries / tvMiniSeries
    if country in ANIME_COUNTRIES and genres and "Animation" in genres:
        return "anime"
    return "series"


def normalize_genres(genres_str: str) -> list[str]:
    """Convert the raw IMDb comma-separated genre string to our normalised list."""
    seen: dict[str, None] = {}
    for raw in str(genres_str).split(","):
        mapped = GENRE_MAP.get(raw.strip())
        if mapped and mapped not in seen:
            seen[mapped] = None
    return list(seen.keys())


# ---------------------------------------------------------------------------
# TMDb enrichment
# ---------------------------------------------------------------------------

def fetch_tmdb_data(
    tmdb_key: str,
    imdb_id: str,
    is_series: bool,
    session: requests.Session,
) -> Optional[dict]:
    """Fetch poster, backdrop, overview, cast, country and language from TMDb.

    Returns *None* on any network / API error so callers can fall back gracefully.
    """
    try:
        # Step 1: resolve IMDb ID → TMDb ID
        find_resp = session.get(
            f"{TMDB_BASE}/find/{imdb_id}",
            params={"api_key": tmdb_key, "external_source": "imdb_id"},
            timeout=15,
        )
        find_resp.raise_for_status()
        find_data = find_resp.json()

        primary_key = "tv_results" if is_series else "movie_results"
        fallback_key = "movie_results" if is_series else "tv_results"

        results = find_data.get(primary_key, []) or find_data.get(fallback_key, [])
        if not results:
            return None

        item = results[0]
        tmdb_id: int = item["id"]
        is_tv = "name" in item  # TV items have 'name', movies have 'title'

        # Step 2: fetch detailed info + credits in one request
        detail_url = f"{TMDB_BASE}/{'tv' if is_tv else 'movie'}/{tmdb_id}"
        detail_resp = session.get(
            detail_url,
            params={"api_key": tmdb_key, "append_to_response": "credits"},
            timeout=15,
        )
        detail_resp.raise_for_status()
        detail = detail_resp.json()

        # Poster / backdrop
        poster_path = item.get("poster_path")
        backdrop_path = item.get("backdrop_path")

        # Overview
        overview: str = detail.get("overview") or item.get("overview", "") or ""

        # Top-5 cast members
        cast: list[str] = [
            member["name"]
            for member in detail.get("credits", {}).get("cast", [])[:5]
            if member.get("name")
        ]

        # Country of origin
        origin_countries: list[str] = detail.get("origin_country", []) or []
        prod_countries: list[dict] = detail.get("production_countries", []) or []
        country: Optional[str] = None
        if origin_countries:
            country = origin_countries[0]
        elif prod_countries:
            country = prod_countries[0].get("iso_3166_1")

        language: Optional[str] = detail.get("original_language") or item.get("original_language")

        return {
            "tmdb_id": tmdb_id,
            "poster": f"{TMDB_IMG_BASE}{poster_path}" if poster_path else None,
            "backdrop": f"{TMDB_BACKDROP_BASE}{backdrop_path}" if backdrop_path else None,
            "description": overview if overview else None,
            "cast": cast or None,
            "country": country,
            "language": language,
        }

    except Exception as exc:
        log.debug(f"TMDb fetch failed for {imdb_id}: {exc}")
        return None


def mock_tmdb_data(imdb_id: str, title: str) -> dict:
    """Return placeholder enrichment when TMDb is unavailable."""
    return {
        "tmdb_id": None,
        "poster": None,
        "backdrop": None,
        "description": f"{title} is a highly rated title available in the MoodCorn database.",
        "cast": None,
        "country": None,
        "language": None,
    }


# ---------------------------------------------------------------------------
# Batch processor
# ---------------------------------------------------------------------------

def process_batch(
    batch: pd.DataFrame,
    tmdb_key: Optional[str],
    collection,
    dry_run: bool,
) -> int:
    """Process one batch of rows: enrich with TMDb and upsert to MongoDB.

    Returns the number of documents that were prepared (even in dry-run mode).
    """
    session = requests.Session()
    session.headers.update({"User-Agent": "MoodCorn-Ingest/1.0"})

    operations: list[UpdateOne] = []
    processed = 0

    for _, row in batch.iterrows():
        imdb_id: str = row["tconst"]
        title: str = row["primaryTitle"]
        raw_title_type: str = row["titleType"]
        genres_raw: str = str(row["genres"])

        # Parse year and runtime
        year_val = row.get("startYear")
        runtime_val = row.get("runtimeMinutes")
        year: Optional[int] = int(year_val) if not pd.isna(year_val) else None
        runtime: Optional[int] = int(runtime_val) if not pd.isna(runtime_val) else None

        rating: float = float(row["averageRating"])
        votes: int = int(row["numVotes"])

        # Skip rows missing critical fields
        if year is None:
            continue

        genres = normalize_genres(genres_raw)
        if not genres:
            continue

        # TMDb enrichment
        is_series_flag = raw_title_type in {"tvSeries", "tvMiniSeries"}
        if tmdb_key:
            tmdb_data = fetch_tmdb_data(tmdb_key, imdb_id, is_series_flag, session)
            if tmdb_data is None:
                tmdb_data = mock_tmdb_data(imdb_id, title)
            time.sleep(0.05)  # Respect TMDb rate limits (~40 req/s)
        else:
            tmdb_data = mock_tmdb_data(imdb_id, title)

        # Determine content type (refined with TMDb country data)
        content_type = classify_type(row, country=tmdb_data.get("country"), genres=genres)

        doc = {
            "imdb_id": imdb_id,
            "title": title,
            "type": content_type,
            "genres": genres,
            "year": year,
            "runtime": runtime,
            "rating": rating,
            "votes": votes,
            "language": tmdb_data.get("language"),
            "country": tmdb_data.get("country"),
            "description": tmdb_data.get("description"),
            "poster": tmdb_data.get("poster"),
            "backdrop": tmdb_data.get("backdrop"),
            "cast": tmdb_data.get("cast"),
            "tmdb_id": tmdb_data.get("tmdb_id"),
        }

        if dry_run:
            log.debug(f"[DRY RUN] Would upsert: {imdb_id} – {title} ({content_type})")
        else:
            operations.append(
                UpdateOne({"imdb_id": imdb_id}, {"$set": doc}, upsert=True)
            )

        processed += 1

    # Flush writes to MongoDB
    if not dry_run and operations:
        try:
            result = collection.bulk_write(operations, ordered=False)
            log.debug(
                f"Batch written – upserted: {result.upserted_count}, "
                f"modified: {result.modified_count}"
            )
        except BulkWriteError as exc:
            log.warning(
                f"Partial bulk write error – "
                f"{exc.details.get('nInserted', 0)} inserted before failure"
            )

    return processed


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="MoodCorn – IMDb → MongoDB ingestion script",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=50_000,
        help="Maximum number of titles to import (sorted by relevance)",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=500,
        help="Number of records per MongoDB bulk-write batch",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Process data without writing anything to MongoDB",
    )
    parser.add_argument(
        "--skip-download",
        action="store_true",
        help="Skip downloading files even if cache is stale",
    )
    args = parser.parse_args()

    # ------------------------------------------------------------------
    # Environment
    # ------------------------------------------------------------------
    mongodb_uri: Optional[str] = os.getenv("MONGODB_URI")
    tmdb_key: Optional[str] = os.getenv("TMDB_API_KEY", "").strip() or None

    if not mongodb_uri:
        log.error("MONGODB_URI environment variable is not set. Aborting.")
        sys.exit(1)

    if not tmdb_key:
        log.warning(
            "TMDB_API_KEY is not set. Posters, backdrops, and overviews will "
            "use placeholder data."
        )

    # ------------------------------------------------------------------
    # Download IMDb datasets (cached after first run)
    # ------------------------------------------------------------------
    basics_path = download_file(IMDB_BASICS_URL, DATA_DIR / "title.basics.tsv.gz")
    ratings_path = download_file(IMDB_RATINGS_URL, DATA_DIR / "title.ratings.tsv.gz")

    # ------------------------------------------------------------------
    # Load, merge, rank
    # ------------------------------------------------------------------
    basics_df = load_imdb_basics(basics_path)
    ratings_df = load_imdb_ratings(ratings_path)
    merged_df = merge_datasets(basics_df, ratings_df)

    # Trim to the desired limit
    merged_df = merged_df.head(args.limit)
    log.info(f"Processing top {len(merged_df):,} titles …")

    # ------------------------------------------------------------------
    # Connect to MongoDB (skip in dry-run mode)
    # ------------------------------------------------------------------
    if not args.dry_run:
        mongo_client = MongoClient(mongodb_uri)
        db = mongo_client["moodcorn"]
        collection = db["movies"]

        # Ensure all required indexes exist
        collection.create_index("imdb_id", unique=True)
        collection.create_index("type")
        collection.create_index("rating")
        collection.create_index("votes")
        collection.create_index("year")
        log.info("Connected to MongoDB and ensured indexes.")
    else:
        collection = None
        log.info("[DRY RUN] Skipping MongoDB connection.")

    # ------------------------------------------------------------------
    # Process in batches
    # ------------------------------------------------------------------
    total_processed = 0
    batch_size = args.batch_size
    num_batches = math.ceil(len(merged_df) / batch_size)

    with tqdm(total=len(merged_df), desc="Processing titles", unit="title") as pbar:
        for i in range(num_batches):
            batch = merged_df.iloc[i * batch_size : (i + 1) * batch_size]
            count = process_batch(batch, tmdb_key, collection, args.dry_run)
            total_processed += count
            pbar.update(len(batch))

    log.info(f"Ingestion complete – total processed: {total_processed:,} titles.")

    if not args.dry_run and collection is not None:
        final_count = collection.count_documents({})
        log.info(f"Documents now in MongoDB (moodcorn.movies): {final_count:,}")


if __name__ == "__main__":
    main()
