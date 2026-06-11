MOOD_GENRE_MAP: dict[str, dict[str, int]] = {
    "Happy": {"Comedy": 10, "Adventure": 8, "Family": 8, "Animation": 8, "Fantasy": 7},
    "Sad": {"Drama": 10, "Romance": 9, "Biography": 7, "Family": 6},
    "Excited": {"Action": 10, "Thriller": 9, "Adventure": 9, "Sci-Fi": 8, "Crime": 7},
    "Relaxed": {"Family": 10, "Comedy": 9, "Animation": 8, "Documentary": 7},
    "Romantic": {"Romance": 10, "Drama": 8, "Comedy": 6},
    "Scared": {"Horror": 10, "Thriller": 9, "Mystery": 9, "Crime": 7},
    "Curious": {"Mystery": 10, "Documentary": 9, "Sci-Fi": 8, "History": 7},
    "Motivated": {"Biography": 10, "Sport": 10, "History": 8, "Drama": 8},
    "Emotional": {"Drama": 10, "Romance": 9, "Family": 8, "Biography": 8},
    "Adventurous": {"Adventure": 10, "Fantasy": 9, "Action": 8, "Sci-Fi": 8},
    "Mind-Bending": {"Sci-Fi": 10, "Mystery": 9, "Thriller": 8, "Fantasy": 7},
    "Nostalgic": {"Family": 10, "Drama": 8, "Comedy": 7, "Animation": 7},
}

ALL_MOODS: list[str] = list(MOOD_GENRE_MAP.keys())

ALL_GENRES: list[str] = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Sport",
    "Thriller",
]
