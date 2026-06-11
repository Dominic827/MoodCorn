import { motion } from 'framer-motion';

const moodEmoji: Record<string, string> = {
  Happy: '😊', Sad: '😢', Excited: '🤩', Relaxed: '😌',
  Romantic: '❤️', Scared: '😱', Curious: '🤔', Motivated: '💪',
  Emotional: '🥺', Adventurous: '🧭', 'Mind-Bending': '🌀', Nostalgic: '🕰️',
};

interface MoodWeightSliderProps {
  mood: string;
  weight: number;
  onChange: (mood: string, weight: number) => void;
}

export default function MoodWeightSlider({ mood, weight, onChange }: MoodWeightSliderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 w-36 flex-shrink-0">
        <span className="text-xl">{moodEmoji[mood] || '🎭'}</span>
        <span className="text-sm font-medium text-white truncate">{mood}</span>
      </div>
      <div className="flex-1 relative">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={weight}
          onChange={(e) => onChange(mood, parseInt(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${weight}%, #2A2A2A ${weight}%, #2A2A2A 100%)`
          }}
        />
      </div>
      <motion.span
        key={weight}
        initial={{ scale: 1.3, color: '#E8C94A' }}
        animate={{ scale: 1, color: '#D4AF37' }}
        transition={{ duration: 0.2 }}
        className="font-bold w-12 text-right flex-shrink-0"
        style={{ color: '#D4AF37' }}
      >
        {weight}%
      </motion.span>
    </div>
  );
}
