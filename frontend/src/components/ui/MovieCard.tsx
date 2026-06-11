import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Calendar, X, Globe, Users } from 'lucide-react';
import type { RecommendResult } from '../../types';

interface MovieCardProps {
  item: RecommendResult;
  index: number;
}

export default function MovieCard({ item, index }: MovieCardProps) {
  const [expanded, setExpanded] = useState(false);

  const posterUrl = item.poster || null;
  const matchColor =
    item.match_percentage >= 80
      ? '#D4AF37'
      : item.match_percentage >= 60
      ? '#A0C4FF'
      : '#A0A0A0';

  return (
    <>
      {/* Flip Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.8) }}
        className="flip-card cursor-pointer"
        style={{ height: 380 }}
        onClick={() => setExpanded(true)}
        role="button"
        aria-label={`View details for ${item.title}`}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(true)}
      >
        <div className="flip-card-inner w-full h-full rounded-2xl overflow-hidden">
          {/* Front */}
          <div className="flip-card-front w-full h-full rounded-2xl overflow-hidden relative bg-bg-secondary">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="poster-placeholder w-full h-full flex flex-col items-center justify-center gap-3">
                <span className="text-5xl">🎬</span>
                <span className="text-text-muted text-sm text-center px-4 leading-snug">
                  {item.title}
                </span>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-2">
                {item.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-gold fill-gold" />
                  <span className="text-gold text-xs font-semibold">
                    {item.rating.toFixed(1)}
                  </span>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    color: matchColor,
                    border: `1px solid ${matchColor}40`,
                  }}
                >
                  {item.match_percentage}% match
                </span>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className="flip-card-back w-full rounded-2xl p-5 flex flex-col justify-between"
            style={{
              background:
                'linear-gradient(135deg, #D4AF37 0%, #E8C94A 50%, #B8960C 100%)',
            }}
          >
            <div>
              <h3 className="text-black font-bold text-base leading-tight mb-3 line-clamp-2">
                {item.title}
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.genres.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.15)', color: '#111' }}
                  >
                    {g}
                  </span>
                ))}
              </div>
              {item.description && (
                <p className="text-black/80 text-xs line-clamp-4 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-black text-black" />
                  <span className="text-black font-bold text-sm">
                    {item.rating.toFixed(1)}/10
                  </span>
                </div>
                <span className="text-black font-black text-lg">
                  {item.match_percentage}%
                </span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-black/60"
                  style={{ width: `${item.match_percentage}%` }}
                />
              </div>
              <p className="text-black/70 text-xs italic line-clamp-2">
                {item.why_recommended}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 250, damping: 30 }}
              className="relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl"
              style={{
                background: '#1A1A1A',
                border: '1px solid rgba(212,175,55,0.3)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Backdrop */}
              {item.backdrop && (
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={item.backdrop}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1A1A]" />
                </div>
              )}

              <div className="p-6 md:p-8">
                <div className="flex gap-6">
                  {/* Poster */}
                  <div className="flex-shrink-0 w-28 md:w-36">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={item.title}
                        className="w-full rounded-xl object-cover shadow-lg"
                        style={{ border: '2px solid #D4AF37' }}
                      />
                    ) : (
                      <div
                        className="w-full rounded-xl poster-placeholder flex items-center justify-center"
                        style={{ aspectRatio: '2/3' }}
                      >
                        <span className="text-4xl">🎬</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
                        {item.title}
                      </h2>
                      <button
                        id={`close-modal-${item.imdb_id}`}
                        onClick={() => setExpanded(false)}
                        className="flex-shrink-0 p-2 rounded-full hover:bg-white/10 transition-colors text-text-muted hover:text-white"
                        aria-label="Close"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-text-muted">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-gold fill-gold" />
                        <span className="text-gold font-semibold">
                          {item.rating.toFixed(1)}
                        </span>
                        <span className="text-text-muted">
                          ({item.votes.toLocaleString()} votes)
                        </span>
                      </div>
                      {item.year && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{item.year}</span>
                        </div>
                      )}
                      {item.runtime && (
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{item.runtime} min</span>
                        </div>
                      )}
                      {item.language && (
                        <div className="flex items-center gap-1">
                          <Globe size={14} />
                          <span className="uppercase">{item.language}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.genres.map((g) => (
                        <span
                          key={g}
                          className="text-xs px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold"
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    {item.description && (
                      <p className="text-text-muted text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                    )}

                    {item.cast && item.cast.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Users size={12} className="text-text-muted" />
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                            Cast
                          </p>
                        </div>
                        <p className="text-sm text-white">
                          {item.cast.slice(0, 5).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Match & Recommendation */}
                <div
                  className="mt-6 p-4 rounded-2xl"
                  style={{
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.2)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gold">
                      Match Score
                    </span>
                    <span className="text-2xl font-black text-gold">
                      {item.match_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2 mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.match_percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-2 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #B8960C, #D4AF37)',
                      }}
                    />
                  </div>
                  <p className="text-sm text-text-muted italic mb-4">
                    {item.why_recommended}
                  </p>

                  {/* Mood compatibility */}
                  {Object.keys(item.mood_compatibility).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                        Mood Compatibility
                      </p>
                      <div className="space-y-2">
                        {Object.entries(item.mood_compatibility).map(
                          ([mood, score]) => (
                            <div key={mood} className="flex items-center gap-3">
                              <span className="text-xs text-text-muted w-28 truncate">
                                {mood}
                              </span>
                              <div className="flex-1 bg-black/30 rounded-full h-1.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${score}%` }}
                                  transition={{ duration: 0.6 }}
                                  className="h-1.5 rounded-full"
                                  style={{ background: '#D4AF37' }}
                                />
                              </div>
                              <span className="text-xs text-gold font-semibold w-10 text-right">
                                {score}%
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* IMDb link */}
                <div className="mt-4 flex justify-end">
                  <a
                    href={`https://www.imdb.com/title/${item.imdb_id}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-muted hover:text-gold transition-colors flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View on IMDb ↗
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
