import { motion } from 'framer-motion';
import { Film, Tv, Star } from 'lucide-react';
import type { ContentType } from '../../types';

interface ContentTypeCardProps {
  type: ContentType;
  selected: boolean;
  onClick: () => void;
}

const config: Record<ContentType, { icon: React.ReactNode; label: string; description: string; emoji: string }> = {
  movie: {
    icon: <Film size={32} />,
    label: 'Movies',
    description: 'Cinematic experiences',
    emoji: '🎬',
  },
  series: {
    icon: <Tv size={32} />,
    label: 'TV Series',
    description: 'Binge-worthy shows',
    emoji: '📺',
  },
  anime: {
    icon: <Star size={32} />,
    label: 'Anime',
    description: 'Japanese animation',
    emoji: '⛩️',
  },
};

export default function ContentTypeCard({ type, selected, onClick }: ContentTypeCardProps) {
  const { label, description, emoji } = config[type];

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative glass-card p-6 cursor-pointer w-full text-left transition-all duration-300 ${
        selected
          ? 'border-gold shadow-gold'
          : 'hover:border-gold/40'
      }`}
      style={{
        boxShadow: selected
          ? '0 0 30px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(212, 175, 55, 0.05)'
          : undefined,
      }}
    >
      {selected && (
        <motion.div
          layoutId="content-type-indicator"
          className="absolute inset-0 rounded-2xl"
          style={{ background: 'rgba(212, 175, 55, 0.08)' }}
          initial={false}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      )}
      <div className="relative z-10">
        <div className="text-4xl mb-3">{emoji}</div>
        <div className={`font-semibold text-lg mb-1 transition-colors ${selected ? 'text-gold' : 'text-white'}`}>
          {label}
        </div>
        <div className="text-text-muted text-sm">{description}</div>
      </div>
    </motion.button>
  );
}
