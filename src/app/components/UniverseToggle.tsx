import { Sparkles, TrendingUp, Volume2 } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import { useAccessTracking } from '../context/AccessTrackingContext';
import { useSounds } from '../hooks/useSounds';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';

export function UniverseToggle() {
  const { universeActive, setUniverse, universeName, categoria } = useUniverse();
  const { getSortedUniverses, getAccessCount } = useAccessTracking();
  const { playSound, soundDescriptions } = useSounds();
  const [isOpen, setIsOpen] = useState(false);

  // Definição completa de todos os universos
  const universeInfo = {
    aespa: { name: 'AESPA', desc: 'Cyberpunk Era', categoria: 'Kpop' },
    enhypen: { name: 'ENHYPEN', desc: 'Dark Fantasy', categoria: 'Kpop' },
    bts: { name: 'BTS', desc: 'Purple Era', categoria: 'Kpop' },
    blackpink: { name: 'BLACKPINK', desc: 'Pink Venom', categoria: 'Kpop' },
    redvelvet: { name: 'RED VELVET', desc: 'ReVe Festival', categoria: 'Kpop' },
    newjeans: { name: 'NEWJEANS', desc: 'Fresh Y2K', categoria: 'Kpop' },
    illit: { name: 'ILLIT', desc: 'Magnetic Era', categoria: 'Kpop' },
    starwars: { name: 'STAR WARS', desc: 'Galactic Empire', categoria: 'Cinema' },
    marvel: { name: 'MARVEL', desc: 'Stark Industries', categoria: 'Cinema' },
    spiderman: { name: 'SPIDER-MAN', desc: 'Web Slinger', categoria: 'Cinema' },
    meangirls: { name: 'MEAN GIRLS', desc: 'Fetch Wednesdays', categoria: 'Cinema' },
    interstellar: { name: 'INTERSTELLAR', desc: 'Space Odyssey', categoria: 'Cinema' },
  } as const;

  // Ordenar universos por número de acessos
  const sortedData = useMemo(() => getSortedUniverses(), [getSortedUniverses]);

  const kpopUniverses = sortedData
    .filter(d => universeInfo[d.universe]?.categoria === 'Kpop')
    .map(d => ({
      id: d.universe,
      ...universeInfo[d.universe],
      accessCount: d.accessCount,
    }));

  const cinemaSagas = sortedData
    .filter(d => universeInfo[d.universe]?.categoria === 'Cinema')
    .map(d => ({
      id: d.universe,
      ...universeInfo[d.universe],
      accessCount: d.accessCount,
    }));

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full right-0 mb-3 w-64 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 p-3 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            {/* Eras K-pop */}
            <p className="text-white/60 text-xs uppercase tracking-wider mb-3 px-2">
              🎤 Eras K-pop
            </p>
            <div className="space-y-2 mb-4">
              {kpopUniverses.map((universe, index) => (
                <div key={universe.id} className="relative group/item">
                  <button
                    onClick={() => {
                      setUniverse(universe.id as any);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 pr-12 rounded-xl transition-all ${
                      universeActive === universe.id
                        ? 'bg-white/20 border-2'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                    style={
                      universeActive === universe.id
                        ? { borderColor: 'var(--primary-neon)' }
                        : {}
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          {universe.name}
                          {index === 0 && universe.accessCount > 0 && (
                            <TrendingUp className="w-3 h-3 text-yellow-400" />
                          )}
                        </div>
                        <div className="text-xs text-white/60">{universe.desc}</div>
                      </div>
                      {universe.accessCount > 0 && (
                        <div className="text-xs text-white/40 font-mono">
                          {universe.accessCount}x
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound(universe.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/20 opacity-0 group-hover/item:opacity-100 transition-all"
                    title={soundDescriptions[universe.id]}
                  >
                    <Volume2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>

            {/* Sagas Cinema */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-3 px-2">
                🎬 Sagas Cinema
              </p>
              <div className="space-y-2">
                {cinemaSagas.map((saga, index) => (
                  <div key={saga.id} className="relative group/item">
                    <button
                      onClick={() => {
                        setUniverse(saga.id as any);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 pr-12 rounded-xl transition-all ${
                        universeActive === saga.id
                          ? 'bg-white/20 border-2'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                      style={
                        universeActive === saga.id
                          ? { borderColor: 'var(--primary-neon)' }
                          : {}
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {saga.name}
                            {index === 0 && saga.accessCount > 0 && (
                              <TrendingUp className="w-3 h-3 text-yellow-400" />
                            )}
                          </div>
                          <div className="text-xs text-white/60">{saga.desc}</div>
                        </div>
                        {saga.accessCount > 0 && (
                          <div className="text-xs text-white/40 font-mono">
                            {saga.accessCount}x
                          </div>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound(saga.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/20 opacity-0 group-hover/item:opacity-100 transition-all"
                      title={soundDescriptions[saga.id]}
                    >
                      <Volume2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-3 rounded-full backdrop-blur-lg bg-white/5 border text-white flex items-center gap-2 transition-all hover:bg-white/10 shadow-lg"
        style={{
          borderColor: 'var(--primary-neon)',
          boxShadow: `0 0 20px ${
            universeActive === 'aespa' ? 'rgba(0, 255, 255, 0.3)' :
            universeActive === 'enhypen' ? 'rgba(255, 23, 68, 0.3)' :
            universeActive === 'bts' ? 'rgba(156, 39, 176, 0.3)' :
            universeActive === 'blackpink' ? 'rgba(255, 20, 147, 0.3)' :
            universeActive === 'redvelvet' ? 'rgba(255, 0, 0, 0.3)' :
            universeActive === 'starwars' ? 'rgba(255, 232, 31, 0.3)' :
            universeActive === 'marvel' ? 'rgba(237, 29, 36, 0.3)' :
            'rgba(255, 0, 0, 0.3)'
          }`,
        }}
      >
        <Sparkles className="w-5 h-5" style={{ color: 'var(--primary-neon)' }} />
        <span className="font-semibold">
          {categoria === 'Cinema' ? '🎬 Saga' : '🎤 Era'}: {universeName}
        </span>
      </motion.button>
    </div>
  );
}