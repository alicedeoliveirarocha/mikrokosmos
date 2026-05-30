import { motion } from 'motion/react';
import { useUniverse } from '../context/UniverseContext';

/**
 * DepthLayers - Adds immersive depth to the UI with parallax-style layers
 * Creates a sense of 3D space with floating elements
 */
export function DepthLayers() {
  const { primaryColor } = useUniverse();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Far depth layer - slowest movement */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${primaryColor} 0%, transparent 50%)`,
          filter: 'blur(120px)',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mid depth layer - medium movement */}
      <motion.div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          background: `radial-gradient(circle at 70% 60%, ${primaryColor} 0%, transparent 40%)`,
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 25, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Near depth layer - fastest movement */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          background: `radial-gradient(circle at 50% 80%, ${primaryColor} 0%, transparent 35%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 15, 0],
          y: [0, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating ambient orbs for spatial depth */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: '15%',
          top: '25%',
          width: '250px',
          height: '250px',
          background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 70%)`,
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          right: '20%',
          bottom: '20%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 70%)`,
          filter: 'blur(70px)',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          left: '60%',
          top: '50%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 25, 0],
          y: [0, -25, 0],
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle light sweep effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${primaryColor}05 50%, transparent 100%)`,
          transform: 'skewX(-10deg)',
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
