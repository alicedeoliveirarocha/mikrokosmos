import { motion } from 'motion/react';

interface MapEffectsProps {
  primaryColor: string;
}

/**
 * MapEffects - Additional cyberpunk visual effects for the delivery map
 * Includes scanlines, glitches, and atmospheric elements
 */
export function MapEffects({ primaryColor }: MapEffectsProps) {
  return (
    <>
      {/* Horizontal scanlines for CRT effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />
      </div>

      {/* Vertical cyberpunk glitch lines */}
      <motion.div
        className="absolute top-0 left-0 w-px h-full opacity-10"
        style={{ backgroundColor: primaryColor }}
        animate={{
          x: ['0vw', '100vw'],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute top-0 right-0 w-px h-full opacity-10"
        style={{ backgroundColor: primaryColor }}
        animate={{
          x: ['0vw', '-100vw'],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
          delay: 2,
        }}
      />

      {/* Corner indicators */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 opacity-30" style={{ borderColor: primaryColor }} />
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 opacity-30" style={{ borderColor: primaryColor }} />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 opacity-30" style={{ borderColor: primaryColor }} />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 opacity-30" style={{ borderColor: primaryColor }} />

      {/* Animated corner accents */}
      <motion.div
        className="absolute top-6 left-6"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-1 h-8" style={{ backgroundColor: primaryColor }} />
        <div className="w-8 h-1" style={{ backgroundColor: primaryColor }} />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6"
        animate={{ opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-1 h-8 ml-auto" style={{ backgroundColor: primaryColor }} />
        <div className="w-8 h-1" style={{ backgroundColor: primaryColor }} />
      </motion.div>

      {/* Floating data points */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: primaryColor,
            left: `${20 + i * 10}%`,
            top: `${15 + (i % 3) * 30}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Radar sweep effect */}
      <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100">
        <motion.line
          x1="50"
          y1="50"
          x2="50"
          y2="0"
          stroke={primaryColor}
          strokeWidth="0.5"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50% 50%' }}
        />
      </svg>

      {/* Atmospheric noise */}
      <motion.div
        className="absolute inset-0 opacity-[0.01]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        animate={{ opacity: [0.01, 0.02, 0.01] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </>
  );
}
