import { motion } from 'framer-motion';

export default function LoadingSpinner({ message = 'Finding your perfect match...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="w-20 h-20 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#D4AF37', borderRightColor: 'rgba(212,175,55,0.3)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: '#E8C94A', borderLeftColor: 'rgba(212,175,55,0.2)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner emoji */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🎬
        </div>
      </div>
      <div className="text-center">
        <p className="text-text-muted text-sm">{message}</p>
        <div className="flex gap-1 justify-center mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#D4AF37' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
