import { useState, useRef } from 'react';
import { useUniverse } from '../context/UniverseContext';
import { motion, AnimatePresence } from 'motion/react';
import { Music, X, GripHorizontal, Maximize2, Minimize2 } from 'lucide-react';

const UNIVERSE_TRACKS: Record<string, string> = {
  aespa:        '59QIYdXAL9XeNtM0j8vN0k',
  bts:          '1mWdTewIgB3gtBM3TOSFhB',
  blackpink:    '0mYa3o6tlUN5HRippmKmwH',
  enhypen:      '0TKCUjfV3YGuY99MxCKM5w',
  redvelvet:    '2H7euNHOF7uADN6dfsWoZa',
  newjeans:     '5ocSQW5sIUIOFojwXEz9Ki',
  illit:        '1D5L58KLBbceOynTP4DQnY',
  starwars:     '2bw4WgXyXP90hIex7ur58y',
  marvel:       '10F9vRZJFsnB8KGesrzAPy',
  spiderman:    '2JcUB7LyS4MDI5fvSWU6se',
  meangirls:    '2QEd05Kp6sGDkc5399s6bM',
  interstellar: '1xLL0IOmaa0fqKoaDgAncG',
};

const SIZES = {
  small:  { width: 260, height: 80 },
  medium: { width: 320, height: 152 },
  large:  { width: 380, height: 152 },
};

type Size = keyof typeof SIZES;

export function MusicPlayer() {
  const { universeActive } = useUniverse();
  const [isMinimized, setIsMinimized] = useState(false);
  const [size, setSize] = useState<Size>('small');
  const constraintsRef = useRef(null);

  const trackId = UNIVERSE_TRACKS[universeActive];
  if (!trackId) return null;

  const nextSize: Record<Size, Size> = {
    small: 'medium',
    medium: 'large',
    large: 'small',
  };

  const sizeLabel: Record<Size, string> = {
    small: 'Médio',
    medium: 'Grande',
    large: 'Pequeno',
  };

  const { width, height } = SIZES[size];

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />

      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-20 left-4 z-50 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        <AnimatePresence mode="wait">
          {!isMinimized ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative select-none"
              style={{
                filter: 'drop-shadow(0 8px 24px color-mix(in srgb, var(--primary-neon) 30%, transparent))',
              }}
            >
              {/* Barra de controles */}
              <div
                className="flex items-center justify-between px-2 py-1 rounded-t-xl bg-black/90 border border-b-0"
                style={{
                  width,
                  borderColor: 'color-mix(in srgb, var(--primary-neon) 40%, transparent)',
                }}
              >
                <div className="flex items-center gap-1 text-white/40">
                  <GripHorizontal className="w-4 h-4" />
                  <span className="text-xs">Arrastar</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onPointerDown={e => e.stopPropagation()}
                    onClick={() => setSize(nextSize[size])}
                    className="w-6 h-6 rounded flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    title={`Mudar para ${sizeLabel[size]}`}
                  >
                    {size === 'large' ? (
                      <Minimize2 className="w-3 h-3" />
                    ) : (
                      <Maximize2 className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onPointerDown={e => e.stopPropagation()}
                    onClick={() => setIsMinimized(true)}
                    className="w-6 h-6 rounded flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    title="Minimizar"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Player iframe */}
              <motion.div
                animate={{ width, height }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  boxShadow: '0 8px 32px color-mix(in srgb, var(--primary-neon) 25%, transparent)',
                  borderRadius: '0 0 12px 12px',
                  border: '1px solid color-mix(in srgb, var(--primary-neon) 40%, transparent)',
                  borderTop: 'none',
                  overflow: 'hidden',
                }}
              >
                <iframe
                  key={`${trackId}-${size}`}
                  src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
                  width={width}
                  height={height}
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="block"
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.button
              key="minimized"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onPointerDown={e => e.stopPropagation()}
              onClick={() => setIsMinimized(false)}
              className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl flex items-center justify-center shadow-lg"
              style={{
                color: 'var(--primary-neon)',
                border: '1px solid color-mix(in srgb, var(--primary-neon) 40%, transparent)',
                boxShadow: '0 4px 20px color-mix(in srgb, var(--primary-neon) 30%, transparent)',
              }}
              title="Abrir player"
            >
              <Music className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}