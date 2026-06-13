import { useState } from 'react';
import { useUniverse } from '../context/UniverseContext';
import { motion, AnimatePresence } from 'motion/react';
import { Music, X } from 'lucide-react';

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

export function MusicPlayer() {
  const { universeActive } = useUniverse();
  const [isMinimized, setIsMinimized] = useState(false);

  const trackId = UNIVERSE_TRACKS[universeActive];
  if (!trackId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 left-4 z-50"
    >
      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <motion.div
            key="player"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative"
          >
            <button
              onClick={() => setIsMinimized(true)}
              className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white/60 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
            <iframe
              key={trackId}
              src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
              width="260"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl"
            />
          </motion.div>
        ) : (
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className="w-10 h-10 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center"
            style={{ color: 'var(--primary-neon)' }}
          >
            <Music className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}