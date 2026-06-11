export type ContentType = 'movie' | 'series' | 'anime';

export type Mood =
  | 'Happy' | 'Sad' | 'Excited' | 'Relaxed' | 'Romantic'
  | 'Scared' | 'Curious' | 'Motivated' | 'Emotional'
  | 'Adventurous' | 'Mind-Bending' | 'Nostalgic';

export const ALL_MOODS: Mood[] = [
  'Happy', 'Sad', 'Excited', 'Relaxed', 'Romantic',
  'Scared', 'Curious', 'Motivated', 'Emotional',
  'Adventurous', 'Mind-Bending', 'Nostalgic'
];

export const ALL_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
  'Crime', 'Family', 'Animation', 'Biography', 'History', 'Sport'
] as const;

export type Genre = typeof ALL_GENRES[number];

export interface Title {
  imdb_id: string;
  title: string;
  type: ContentType;
  genres: string[];
  year: number;
  runtime?: number;
  rating: number;
  votes: number;
  language?: string;
  country?: string;
  description?: string;
  poster?: string;
  backdrop?: string;
  cast?: string[];
  tmdb_id?: number;
}

export interface RecommendResult extends Title {
  final_score: number;
  mood_score: number;
  genre_score: number;
  rating_score: number;
  popularity_score: number;
  recency_score: number;
  match_percentage: number;
  why_recommended: string;
  mood_compatibility: Record<string, number>;
}

export interface RecommendRequest {
  content_type: ContentType;
  moods: string[];
  mood_weights?: Record<string, number>;
  genre?: string;
  min_rating?: number;
  year_min?: number;
  year_max?: number;
  runtime_min?: number;
  runtime_max?: number;
  language?: string;
  country?: string;
}

export interface Filters {
  minRating: number;
  yearMin: number;
  yearMax: number;
  runtimeMin: number;
  runtimeMax: number;
  language: string;
  country: string;
}
