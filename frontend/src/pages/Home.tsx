import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Zap } from 'lucide-react';
import { useSelectionStore } from '../store/selectionStore';
import { apiService } from '../services/api';
import { ALL_GENRES, ALL_MOODS } from '../types';
import ContentTypeCard from '../components/ui/ContentTypeCard';
import MoodCard from '../components/ui/MoodCard';
import GenrePill from '../components/ui/GenrePill';
import FilterAccordion from '../components/ui/FilterAccordion';
import MoodWeightSlider from '../components/ui/MoodWeightSlider';
import type { ContentType } from '../types';

const HERO_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 3,
}));

export default function Home() {
  const navigate = useNavigate();
  const {
    contentType, moods, moodWeights, useCustomWeights,
    selectedGenre, filters,
    setContentType, addMood, removeMood, updateMood,
    setMoodWeight, setUseCustomWeights, setSelectedGenre,
    setRecommendations, setLoading, setError,
  } = useSelectionStore();

  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (moods.length === 0) {
      setLocalError('Please select at least one mood.');
      return;
    }
    setLocalError(null);
    setSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      const weights = useCustomWeights ? moodWeights : undefined;
      const results = await apiService.getRecommendations({
        content_type: contentType,
        moods,
        mood_weights: weights,
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
      navigate('/recommendations');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to get recommendations. Please try again.';
      setError(msg);
      setLocalError(msg);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleAddMood = () => {
    const nextMood = ALL_MOODS.find((m) => !moods.includes(m));
    if (nextMood) addMood(nextMood);
  };

  const totalWeight = Object.values(moodWeights).reduce((a, b) => a + b, 0);
  const weightBalanced = Math.abs(totalWeight - 100) <= 2;

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top, #1a1200 0%, #111111 40%, #0a0a0a 100%)' }}>
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {HERO_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: 'rgba(212, 175, 55, 0.4)',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
            style={{
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: '#D4AF37',
            }}
          >
            <Sparkles size={14} />
            ✨ Mood-Driven Recommendations
          </motion.div>

          <h1
            className="font-black leading-none mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(90deg, #B8960C 0%, #D4AF37 30%, #F0D060 55%, #D4AF37 75%, #B8960C 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'metallic-shine 3s linear infinite',
                display: 'block',
              }}
            >
              How do you feel
            </span>
            <span className="text-white"> today?</span>
          </h1>

          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Tell us your mood and we'll find the perfect movies, series, or anime for your vibe.
          </p>
        </motion.div>

        {/* Step 1: Content Type */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <SectionLabel number={1} label="What do you want to watch?" />
          <div className="grid grid-cols-3 gap-4">
            {(['movie', 'series', 'anime'] as ContentType[]).map((type) => (
              <ContentTypeCard
                key={type}
                type={type}
                selected={contentType === type}
                onClick={() => setContentType(type)}
              />
            ))}
          </div>
        </motion.section>

        {/* Step 2: Moods */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <SectionLabel number={2} label="Select your mood(s)" sublabel="Up to 4 moods" />
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {moods.map((mood, i) => (
                <MoodCard
                  key={`${mood}-${i}`}
                  mood={mood}
                  index={i}
                  canRemove={moods.length > 1}
                  takenMoods={moods}
                  onChangeMood={updateMood}
                  onRemoveMood={removeMood}
                />
              ))}
            </AnimatePresence>
          </div>

          {moods.length < 4 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddMood}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium text-text-muted border border-dashed border-white/20 hover:border-gold/40 hover:text-gold transition-all"
            >
              <Plus size={16} />
              Add another mood
            </motion.button>
          )}

          {/* Custom weights toggle */}
          {moods.length > 1 && (
            <div className="mt-4">
              <button
                onClick={() => setUseCustomWeights(!useCustomWeights)}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors"
              >
                <div
                  className="w-10 h-5 rounded-full relative transition-colors"
                  style={{ background: useCustomWeights ? '#D4AF37' : '#2A2A2A' }}
                >
                  <motion.div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                    animate={{ left: useCustomWeights ? '1.35rem' : '0.125rem' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                </div>
                Customize mood weights
              </button>

              <AnimatePresence>
                {useCustomWeights && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="glass-card p-5 mt-3 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">Mood Influence Weights</span>
                        <span className={`text-xs font-bold ${weightBalanced ? 'text-green-400' : 'text-red-400'}`}>
                          Total: {totalWeight}% {weightBalanced ? '✓' : '(should be 100%)'}
                        </span>
                      </div>
                      {moods.map((mood) => (
                        <MoodWeightSlider
                          key={mood}
                          mood={mood}
                          weight={moodWeights[mood] ?? 0}
                          onChange={setMoodWeight}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.section>

        {/* Step 3: Genre */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-10"
        >
          <SectionLabel number={3} label="Preferred genre" sublabel="Optional" />
          <div className="flex flex-wrap gap-2">
            {ALL_GENRES.map((genre) => (
              <GenrePill
                key={genre}
                genre={genre}
                selected={selectedGenre === genre}
                onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
              />
            ))}
          </div>
        </motion.section>

        {/* Step 4: Advanced Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <SectionLabel number={4} label="Advanced filters" sublabel="Optional" />
          <FilterAccordion />
        </motion.section>

        {/* Error */}
        <AnimatePresence>
          {localError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl text-sm font-medium text-center"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
            >
              {localError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(212,175,55,0.7)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-3 px-12 py-5 rounded-full font-bold text-lg"
            style={{
              background: submitting
                ? 'rgba(212,175,55,0.4)'
                : 'linear-gradient(135deg, #D4AF37, #E8C94A)',
              color: '#111111',
              boxShadow: '0 4px 30px rgba(212,175,55,0.4)',
              cursor: submitting ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
          >
            {submitting ? (
              <>
                <motion.div
                  className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Finding matches...
              </>
            ) : (
              <>
                <Zap size={20} />
                Find My Perfect Watch
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

function SectionLabel({ number, label, sublabel }: { number: number; label: string; sublabel?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C94A)', color: '#111111' }}
      >
        {number}
      </div>
      <div>
        <span className="font-semibold text-white">{label}</span>
        {sublabel && <span className="text-text-muted text-sm ml-2">({sublabel})</span>}
      </div>
    </div>
  );
}
