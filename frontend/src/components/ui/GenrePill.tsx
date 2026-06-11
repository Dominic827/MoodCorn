import { motion } from 'framer-motion';

const genreEmoji: Record<string, string> = {
  Action: '💥', Adventure: '🗺️', Comedy: '😂', Drama: '🎭', Fantasy: '🧙',
  Horror: '👻', Mystery: '🔍', Romance: '💕', 'Sci-Fi': '🚀', Thriller: '😰',
  Crime: '🔫', Family: '👨‍👩‍👧', Animation: '✏️', Biography: '📖',
  History: '🏛️', Sport: '⚽',
};

interface GenrePillProps {
  genre: string;
  selected: boolean;
  onClick: () => void;
}

export default function GenrePill({ genre, selected, onClick }: GenrePillProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
        selected
          ? 'bg-gold/20 border-gold text-gold'
          : 'bg-transparent border-white/20 text-text-muted hover:border-gold/50 hover:text-white'
      }`}
      style={{
        boxShadow: selected ? '0 0 15px rgba(212, 175, 55, 0.3)' : undefined,
      }}
    >
      <span className="text-base">{genreEmoji[genre] || '🎬'}</span>
      {genre}
    </motion.button>
  );
}
