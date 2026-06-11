import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useSelectionStore } from '../../store/selectionStore';

const LANGUAGES = [
  { value: '', label: 'Any Language' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'hi', label: 'Hindi' },
  { value: 'zh', label: 'Chinese' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
];

export default function FilterAccordion() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters, resetFilters } = useSelectionStore();

  const hasActiveFilters =
    filters.minRating > 0 ||
    filters.yearMin > 1970 ||
    filters.yearMax < 2025 ||
    filters.runtimeMin > 0 ||
    filters.runtimeMax < 300 ||
    !!filters.language ||
    !!filters.country;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header toggle */}
      <button
        id="filter-accordion-toggle"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={20} className="text-gold" />
          <span className="font-semibold text-white">Advanced Filters</span>
          {hasActiveFilters && (
            <span className="bg-gold text-bg-primary text-xs font-bold px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={20} className="text-text-muted" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5">
              {/* Min Rating */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-3">
                  Minimum IMDb Rating
                  <span className="text-gold font-bold ml-2">
                    {filters.minRating.toFixed(1)}+
                  </span>
                </label>
                <input
                  id="filter-min-rating"
                  type="range"
                  min={0}
                  max={9}
                  step={0.5}
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters({ minRating: parseFloat(e.target.value) })
                  }
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${
                      (filters.minRating / 9) * 100
                    }%, #2A2A2A ${(filters.minRating / 9) * 100}%, #2A2A2A 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>0.0</span>
                  <span>9.0</span>
                </div>
              </div>

              {/* Release Year */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-3">
                  Release Year
                  <span className="text-gold font-bold ml-2">
                    {filters.yearMin} – {filters.yearMax}
                  </span>
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted w-8">From</span>
                    <input
                      id="filter-year-min"
                      type="range"
                      min={1970}
                      max={2025}
                      step={1}
                      value={filters.yearMin}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val <= filters.yearMax)
                          setFilters({ yearMin: val });
                      }}
                      className="flex-1"
                      style={{
                        background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${
                          ((filters.yearMin - 1970) / 55) * 100
                        }%, #2A2A2A ${
                          ((filters.yearMin - 1970) / 55) * 100
                        }%, #2A2A2A 100%)`,
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted w-8">To</span>
                    <input
                      id="filter-year-max"
                      type="range"
                      min={1970}
                      max={2025}
                      step={1}
                      value={filters.yearMax}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= filters.yearMin)
                          setFilters({ yearMax: val });
                      }}
                      className="flex-1"
                      style={{
                        background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${
                          ((filters.yearMax - 1970) / 55) * 100
                        }%, #2A2A2A ${
                          ((filters.yearMax - 1970) / 55) * 100
                        }%, #2A2A2A 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Runtime */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-3">
                  Runtime (minutes)
                  <span className="text-gold font-bold ml-2">
                    {filters.runtimeMin} –{' '}
                    {filters.runtimeMax >= 300 ? '300+' : filters.runtimeMax}
                  </span>
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted w-8">Min</span>
                    <input
                      id="filter-runtime-min"
                      type="range"
                      min={0}
                      max={300}
                      step={5}
                      value={filters.runtimeMin}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val <= filters.runtimeMax)
                          setFilters({ runtimeMin: val });
                      }}
                      className="flex-1"
                      style={{
                        background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${
                          (filters.runtimeMin / 300) * 100
                        }%, #2A2A2A ${
                          (filters.runtimeMin / 300) * 100
                        }%, #2A2A2A 100%)`,
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted w-8">Max</span>
                    <input
                      id="filter-runtime-max"
                      type="range"
                      min={0}
                      max={300}
                      step={5}
                      value={filters.runtimeMax}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= filters.runtimeMin)
                          setFilters({ runtimeMax: val });
                      }}
                      className="flex-1"
                      style={{
                        background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${
                          (filters.runtimeMax / 300) * 100
                        }%, #2A2A2A ${
                          (filters.runtimeMax / 300) * 100
                        }%, #2A2A2A 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Language */}
              <div>
                <label
                  htmlFor="filter-language"
                  className="block text-sm font-medium text-text-muted mb-3"
                >
                  Language
                </label>
                <select
                  id="filter-language"
                  value={filters.language}
                  onChange={(e) => setFilters({ language: e.target.value })}
                  className="w-full bg-bg-secondary border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option
                      key={l.value}
                      value={l.value}
                      style={{ background: '#1A1A1A' }}
                    >
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="filter-country"
                  className="block text-sm font-medium text-text-muted mb-3"
                >
                  Country Code
                </label>
                <input
                  id="filter-country"
                  type="text"
                  placeholder="e.g. US, JP, KR, GB..."
                  value={filters.country}
                  onChange={(e) => setFilters({ country: e.target.value })}
                  maxLength={5}
                  className="w-full bg-bg-secondary border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-text-muted focus:outline-none focus:border-gold transition-colors uppercase"
                />
              </div>

              {/* Reset */}
              <div className="md:col-span-2 flex justify-end pt-2 border-t border-white/5">
                {hasActiveFilters && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={resetFilters}
                    className="text-sm text-text-muted hover:text-gold transition-colors"
                  >
                    Reset all filters
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
