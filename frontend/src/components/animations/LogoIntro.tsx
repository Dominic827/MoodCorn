import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LogoIntroProps {
  onComplete: () => void;
}

export default function LogoIntro({ onComplete }: LogoIntroProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at center, #1a1200 0%, #111111 60%, #0a0a0a 100%)',
      }}
    >
      {/* Phase 1: Gold card coin-flip (0 → 1.6s) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotateY: 0 }}
        animate={{
          opacity: [0, 1, 1, 1, 0],
          scale: [0.7, 1, 1, 1, 0.5],
          rotateY: [0, 0, 360, 360, 360],
        }}
        transition={{
          duration: 2.2,
          times: [0, 0.18, 0.6, 0.8, 1],
          ease: 'easeInOut',
        }}
        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
        className="mb-8"
      >
        <div
          style={{
            width: 120,
            height: 160,
            borderRadius: 16,
            background:
              'linear-gradient(135deg, #D4AF37 0%, #E8C94A 40%, #B8960C 100%)',
            boxShadow: '0 0 60px rgba(212, 175, 55, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <div style={{ fontSize: 48 }}>🎬</div>
          <div
            style={{
              color: '#111',
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: 2,
            }}
          >
            MOODCORN
          </div>
        </div>
      </motion.div>

      {/* Phase 2: MoodCorn metallic text (appears at 1.8s) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.8, ease: [0.2, 0, 0.1, 1] }}
        className="text-center absolute"
      >
        <h1
          className="font-black tracking-tight"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            background:
              'linear-gradient(90deg, #B8960C 0%, #D4AF37 25%, #F0D060 50%, #D4AF37 75%, #B8960C 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'metallic-shine 2s linear infinite',
            lineHeight: 1,
          }}
        >
          MoodCorn
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.6 }}
          style={{
            color: '#A0A0A0',
            marginTop: 16,
            fontSize: '1.1rem',
            letterSpacing: 1,
          }}
        >
          Find the perfect watch for your mood.
        </motion.p>
      </motion.div>

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2 }}
        onClick={onComplete}
        className="absolute bottom-8 text-text-muted text-sm hover:text-gold transition-colors cursor-pointer"
        style={{ background: 'none', border: 'none' }}
        aria-label="Skip intro"
      >
        Skip intro →
      </motion.button>
    </motion.div>
  );
}
