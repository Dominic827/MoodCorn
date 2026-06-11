import { motion } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { ALL_MOODS } from '../../types';

const moodEmoji: Record<string, string> = {
  Happy: '😊', Sad: '😢', Excited: '🤩', Relaxed: '😌',
  Romantic: '❤️', Scared: '😱', Curious: '🤔', Motivated: '💪',
  Emotional: '🥺', Adventurous: '🧭', 'Mind-Bending': '🌀', Nostalgic: '🕰️',
};

interface MoodCardProps {
  mood: string;
  index: number;
  canRemove: boolean;
  takenMoods: string[];
  onChangeMood: (index: number, mood: string) => void;
  onRemoveMood: (mood: string) => void;
}

export default function MoodCard({ mood, index, canRemove, takenMoods, onChangeMood, onRemoveMood }: MoodCardProps) {
  const availableMoods = ALL_MOODS.filter((m) => !takenMoods.includes(m) || m === mood);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
      className="glass-card p-4 flex items-center gap-4"
      style={{ perspective: 800 }}
    >
      {/* Emoji */}
      <div className="text-3xl w-10 text-center flex-shrink-0">
        {moodEmoji[mood] || '🎭'}
      </div>

      {/* Dropdown */}
      <div className="relative flex-1">
        <select
          value={mood}
          onChange={(e) => onChangeMood(index, e.target.value)}
          className="w-full bg-transparent text-white font-medium appearance-none cursor-pointer pr-8 py-1 border-b border-gold/30 focus:outline-none focus:border-gold transition-colors"
        >
          {availableMoods.map((m) => (
            <option key={m} value={m} style={{ background: '#1A1A1A', color: '#fff' }}>
              {moodEmoji[m]} {m}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-1 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
      </div>

      {/* Remove */}
      {canRemove && (
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemoveMood(mood)}
          className="text-text-muted hover:text-red-400 transition-colors flex-shrink-0"
          aria-label={`Remove ${mood} mood`}
        >
          <X size={18} />
        </motion.button>
      )}
    </motion.div>
  );
}
