import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, SlidersHorizontal, Filter, LayoutGrid, List } from 'lucide-react';
import { useSelectionStore } from '../store/selectionStore';
import { apiService } from '../services/api';
import MovieCard from '../components/ui/MovieCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { RecommendResult } from '../types';

const moodEmoji: Record<string, string> = {
  Happy: '😊', Sad: '😢', Excited: '🤩', Relaxed: '😌',
  Romantic: '❤️', Scared: '😱', Curious: '🤔', Motivated: '💪',
  Emotional: '🥺', Adventurous: '🧭', 'Mind-Bending': '🌀', Nostalgic: '🕰️',
};

type SortOption = 'match' | 'rating' | 'year_new' | 'year_old' | 'votes';

const SORT_LABELS: Record<SortOption, string> = {
  match: 'Best Match',
  rating: 'Highest Rated',
  year_new: 'Newest First',
  year_old: 'Oldest First',
  votes: 'Most Popular',
};

function sortResults(results: RecommendResult[], sort: SortOption): RecommendResult[] {
  const arr = [...results];
  switch (sort) {
    case 'match': return arr.sort((a, b) => b.match_percentage - a.match_percentage);
    case 'rating': return arr.sort((a, b) => b.rating - a.rating);
    case 'year_new': return arr.sort((a, b) => b.year - a.year);
    case 'year_old': return arr.sort((a, b) => a.year - b.year);
    case 'votes': return arr.sort((a, b) => b.votes - a.votes);
    default: return arr;
  }
}

export default function Recommendations() {
  const navigate = useNavigate();
  const {
    recommendations, isLoading, error,
    contentType, moods, moodWeights, useCustomWeights,
    selectedGenre, filters,
    setRecommendations, setLoading, setError,
  } = useSelectionStore();

  const [sort, setSort] = useState<SortOption>('match');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterMinMatch, setFilterMinMatch] = useState(0);

  // Redirect if no moods selected and no recommendations
  useEffect(() => {
    if (!isLoading && recommendations.length === 0 && moods.length === 0) {
      navigate('/');
    }
  }, [isLoading, recommendations.length, moods.length, navigate]);

  const handleRefresh = async () => {
    if (moods.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const results = await apiService.getRecommendations({
        content_type: contentType,
        moods,
        mood_weights: useCustomWeights ? moodWeights : undefined,
        genre: selectedGenre || undefined,
        min_rating: filters.minRating > 0 ? filters.minRating : undefined,
        year_min: filters.yearMin > 1970 ? filters.yearMin : undefined,
        year_max: filters.yearMax < 2025 ? filters.yearMax : undefined,
        runtime_min: filters.runtimeMin > 0 ? filters.runtimeMin : undefined,
        runtime_max: filters.runtimeMax < 300 ? filters.runtimeMax : undefined,
        language: filters.language || undefined,
        country: filters.country || undefined,
      });
      setRecommendations(results);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to refresh recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const displayedResults = sortResults(
    recommendations.filter((r) => r.match_percentage >= filterMinMatch),
    sort
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: '#111111' }}>
        <LoadingSpinner message="Analyzing your mood and finding perfect matches..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-20" style={{ background: '#111111' }}>
        <div className="text-5xl">😕</div>
        <h2 className="text-white font-bold text-2xl">Something went wrong</h2>
        <p className="text-text-muted text-center max-w-md">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="btn-gold"
          >
            ← Go Back
          </button>
          <button onClick={handleRefresh} className="btn-cta">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: '#111111' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-text-muted hover:text-gold transition-colors mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Back to selection
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-white font-black text-3xl md:text-4xl mb-2">
                Your{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, #B8960C, #D4AF37, #E8C94A, #D4AF37, #B8960C)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'metallic-shine 3s linear infinite',
                  }}
                >
                  Recommendations
                </span>
              </h1>

              {/* Active moods */}
              <div className="flex flex-wrap gap-2 mt-2">
                {moods.map((mood) => (
                  <span key={mood} className="mood-chip text-xs">
                    {moodEmoji[mood] || '🎭'} {mood}
                    {useCustomWeights && moodWeights[mood] !== undefined && (
                      <span className="ml-1 opacity-60">({moodWeights[mood]}%)</span>
                    )}
                  </span>
                ))}
                {selectedGenre && (
                  <span
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                    }}
                  >
                    📌 {selectedGenre}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Results count */}
              <span className="text-text-muted text-sm">
                {displayedResults.length} result{displayedResults.length !== 1 ? 's' : ''}
              </span>

              {/* Refresh */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/20 text-text-muted hover:border-gold/50 hover:text-gold transition-all"
              >
                <RefreshCw size={14} />
                Refresh
              </motion.button>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/20 text-text-muted hover:border-gold/50 hover:text-gold transition-all"
                >
                  <SlidersHorizontal size={14} />
                  {SORT_LABELS[sort]}
                </button>
                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-20 min-w-[170px]"
                      style={{ background: '#1A1A1A', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
                    >
                      {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => { setSort(key); setShowSortMenu(false); }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                            sort === key ? 'text-gold bg-gold/10' : 'text-text-muted hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* View mode toggle */}
              <div
                className="flex rounded-full overflow-hidden border border-white/20"
                style={{ background: '#1A1A1A' }}
              >
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-colors ${viewMode === 'grid' ? 'text-gold bg-gold/10' : 'text-text-muted hover:text-white'}`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-colors ${viewMode === 'list' ? 'text-gold bg-gold/10' : 'text-text-muted hover:text-white'}`}
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Min match filter */}
          <div className="mt-4 flex items-center gap-4">
            <Filter size={14} className="text-text-muted flex-shrink-0" />
            <span className="text-text-muted text-sm flex-shrink-0">Min match:</span>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={filterMinMatch}
              onChange={(e) => setFilterMinMatch(parseInt(e.target.value))}
              className="flex-1 max-w-xs"
              style={{
                background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${(filterMinMatch / 90) * 100}%, #2A2A2A ${(filterMinMatch / 90) * 100}%, #2A2A2A 100%)`
              }}
            />
            <span className="text-gold font-bold text-sm w-12 flex-shrink-0">{filterMinMatch}%+</span>
          </div>
        </motion.div>

        {/* Results */}
        {displayedResults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-white font-bold text-xl mb-2">No results found</h3>
            <p className="text-text-muted mb-6">
              Try adjusting your filters or lowering the minimum match percentage.
            </p>
            <button onClick={() => { setFilterMinMatch(0); }} className="btn-gold">
              Clear Match Filter
            </button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {displayedResults.map((item, i) => (
                <MovieCard key={item.imdb_id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {displayedResults.map((item, i) => (
                <ListCard key={item.imdb_id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function ListCard({ item, index }: { item: RecommendResult; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className="glass-card glass-card-hover overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Poster thumbnail */}
        <div className="w-16 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-bg-secondary">
          {item.poster ? (
            <img
              src={item.poster}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="poster-placeholder w-full h-full text-2xl">🎬</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-white font-bold truncate">{item.title}</h3>
              <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                <span>⭐ {item.rating?.toFixed(1)}</span>
                <span>{item.year}</span>
                {item.runtime && <span>⏱ {item.runtime}m</span>}
                <span className="capitalize text-gold/70">{item.type}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {item.genres?.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 text-center">
              <div
                className="text-lg font-black"
                style={{
                  color: item.match_percentage >= 80 ? '#D4AF37' :
                    item.match_percentage >= 60 ? '#6CA0DC' : '#A0A0A0'
                }}
              >
                {item.match_percentage}%
              </div>
              <div className="text-xs text-text-muted">match</div>
            </div>
          </div>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/10"
            >
              {item.description && (
                <p className="text-text-muted text-sm mb-2 line-clamp-3">{item.description}</p>
              )}
              {item.why_recommended && (
                <p className="text-xs text-gold/80 italic">"{item.why_recommended}"</p>
              )}
              {item.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${item.imdb_id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs text-gold hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  View on IMDb ↗
                </a>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
