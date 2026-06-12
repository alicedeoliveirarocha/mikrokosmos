import { useState, useEffect, useRef } from 'react';
import { useUniverse } from '../context/UniverseContext';
import { getLatestTrack } from '../hooks/useSpotify';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

export function MusicPlayer() {
  const { universeActive } = useUniverse();
  const [track, setTrack] = useState<{ name: string; previewUrl: string | null; albumArt: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setLoading(true);
    setIsPlaying(false);
    setTrack(null);

    getLatestTrack(universeActive).then((t) => {
      setTrack(t);
      setLoading(false);
    });
  }, [universeActive]);

  useEffect(() => {
    if (!track?.previewUrl) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(track.previewUrl);
    audio.volume = isMuted ? 0 : 0.4;
    audio.loop = true;
    audioRef.current = audio;

    if (isPlaying) audio.play();

    return () => { audio.pause(); };
  }, [track]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play();
    else audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 0.4;
    }
  }, [isMuted]);

  if (!track && !loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 left-4 z-50"
    >
      <AnimatePresence>
        {!isMinimized ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 p-3 flex items-center gap-3 max-w-[220px]"
          >
            {/* Album art */}
            {track?.albumArt && (
              <img src={track.albumArt} alt="album" className="w-10 h-10 rounded-lg flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{loading ? 'Carregando...' : track?.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <button onClick={() => setIsPlaying(!isPlaying)} className="text-white/80 hover:text-white">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsMinimized(true)} className="text-white/40 hover:text-white ml-auto">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
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