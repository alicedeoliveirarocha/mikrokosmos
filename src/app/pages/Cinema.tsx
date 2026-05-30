import { motion, useMotionValue, useTransform } from 'motion/react';
import { useNavigate } from 'react-router';
import { Film, Popcorn, Ticket, Star, Play, ArrowRight, Home, Sparkles, Clock } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import { useCart } from '../context/CartContext';
import { CinemaBackground } from '../components/CinemaBackground';
import { DepthLayers } from '../components/DepthLayers';
import { useState } from 'react';

export function Cinema() {
  const navigate = useNavigate();
  const { universeName, primaryColor, categoria } = useUniverse();
  const { items } = useCart();
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  // Dynamic sessions based on universe
  const kpopSessions = [
    {
      id: 'whiplash',
      title: 'Whiplash',
      subtitle: 'The Movie',
      group: 'AESPA',
      time: '19:00',
      sala: 'SALA IMAX 1',
      price: 'R$ 45,00',
      image: 'figma:asset/d647babbb3a88ed8edc9f17c6150061b234756c9.png',
      rating: '9.2',
      genre: 'Drama Musical',
      duration: '2h 15min',
    },
    {
      id: 'mansion',
      title: 'Dark Moon',
      subtitle: 'Lunar Eclipse',
      group: 'ENHYPEN',
      time: '20:30',
      sala: 'SALA VIP 2',
      price: 'R$ 50,00',
      image: 'figma:asset/7910e1dc6625245b4c61e6f9969147067f273dce.png',
      rating: '8.9',
      genre: 'Fantasy Horror',
      duration: '2h 05min',
    },
    {
      id: 'velvet',
      title: 'The ReVe Festival',
      subtitle: 'Cinema Edition',
      group: 'RED VELVET',
      time: '18:00',
      sala: 'SALA PREMIUM 3',
      price: 'R$ 48,00',
      image: 'figma:asset/20e9f3bfb7f90d5ecdbfe007b2a25d7b7b8e15a4.png',
      rating: '9.0',
      genre: 'Fantasy Adventure',
      duration: '1h 58min',
    },
  ];

  const cinemaSessions = [
    {
      id: 'spiderman',
      title: 'Spider-Man',
      subtitle: 'No Way Home',
      group: 'MARVEL STUDIOS',
      time: '19:30',
      sala: 'SALA IMAX 1',
      price: 'R$ 55,00',
      image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop',
      rating: '8.7',
      genre: 'Action Adventure',
      duration: '2h 28min',
    },
    {
      id: 'interstellar',
      title: 'Interstellar',
      subtitle: 'A Journey Beyond',
      group: 'CHRISTOPHER NOLAN',
      time: '21:00',
      sala: 'SALA PREMIUM 2',
      price: 'R$ 60,00',
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop',
      rating: '9.3',
      genre: 'Sci-Fi Drama',
      duration: '2h 49min',
    },
    {
      id: 'meangirls',
      title: 'Mean Girls',
      subtitle: 'The Musical',
      group: 'PARAMOUNT PICTURES',
      time: '18:15',
      sala: 'SALA VIP 3',
      price: 'R$ 48,00',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
      rating: '8.5',
      genre: 'Comedy Musical',
      duration: '1h 52min',
    },
  ];

  // Use sessions based on category
  const sessions = categoria === 'Cinema' ? cinemaSessions : kpopSessions;

  const combos = [
    {
      name: 'Combo K-pop Lover',
      desc: 'Pipoca G + Refri G + Photocard',
      price: 'R$ 35,00',
      emoji: '🍿',
    },
    {
      name: 'Combo Luxury Box',
      desc: 'Pipoca XL + 2 Refris + Nachos + Light Stick',
      price: 'R$ 65,00',
      emoji: '✨',
    },
    {
      name: 'Combo Snack Time',
      desc: 'Hot Dog + Suco + Chocolate',
      price: 'R$ 28,00',
      emoji: '🌭',
    },
  ];

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Enhanced Futuristic Background */}
      <CinemaBackground />

      {/* Immersive Depth Layers */}
      <DepthLayers />

      {/* Header Cinema */}
      <div className="relative z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between max-w-[1400px] mx-auto"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/home')}
              className="p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all"
            >
              <Home className="w-5 h-5 text-white" />
            </motion.button>
            <div>
              <motion.h1
                className="text-3xl md:text-4xl font-bold text-white tracking-wider flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Film className="w-8 h-8" style={{ color: primaryColor }} />
                MIKROKOSMOS CINEMA
              </motion.h1>
              <p className="text-white/50 text-sm mt-1 tracking-wide">
                {categoria === 'Cinema'
                  ? 'AN IMMERSIVE CINEMATIC EXPERIENCE'
                  : 'K-POP CONCEPTUAL FILMS EXPERIENCE'
                }
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/80 text-sm">
              Now Playing: <span className="font-bold" style={{ color: primaryColor }}>{universeName}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Section - Immersive */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 mb-16"
      >
        <div className="relative rounded-3xl overflow-hidden">
          {/* Spotlight effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, ${primaryColor}20 0%, transparent 60%)`,
            }}
          />

          <div className="relative bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border border-white/10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-red-500/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3" style={{ color: primaryColor }} />
                  NOW SHOWING
                </motion.div>

                <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  {categoria === 'Cinema' ? 'Premium' : 'Special'}<br />
                  <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                    {categoria === 'Cinema' ? 'Cinema Sessions' : 'K-pop Sessions'}
                  </span>
                </h2>

                <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-xl">
                  {categoria === 'Cinema'
                    ? 'Experience Hollywood blockbusters and cinematic masterpieces with premium sound, immersive visuals, and gourmet concessions.'
                    : 'Immerse yourself in a complete experience: conceptual films from your favorite groups, themed menu, and immersive atmosphere.'
                  }
                </p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-bold text-xl">4.9</span>
                    <span className="text-white/40 text-sm">/5.0</span>
                  </div>
                  <div className="h-8 w-px bg-white/20" />
                  <div className="text-white/60 text-sm">
                    2.8k reviews
                  </div>
                </div>
              </div>

              <motion.div
                className="flex items-center gap-4 bg-black/40 backdrop-blur-xl rounded-2xl px-8 py-6 border border-white/10"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.3)' }}
              >
                <Popcorn className="w-16 h-16" style={{ color: primaryColor }} />
                <div className="text-white">
                  <p className="text-sm text-white/50 uppercase tracking-wider">Tickets</p>
                  <p className="text-4xl font-bold">{items.length || '0'}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Movie Posters - Vertical Netflix/IMAX Style */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 mb-16">
        <div className="flex items-center justify-between mb-8">
          <motion.h3
            className="text-3xl font-bold text-white flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Play className="w-7 h-7" style={{ color: primaryColor }} />
            NOW PLAYING
          </motion.h3>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/60 text-sm">
            <Film className="w-4 h-4" />
            {sessions.length} Films Available
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.15, type: "spring", stiffness: 100 }}
              onMouseEnter={() => setHoveredSession(session.id)}
              onMouseLeave={() => setHoveredSession(null)}
              className="group cursor-pointer"
              onClick={() => navigate('/home')}
            >
              {/* Movie Poster - Vertical 2:3 ratio */}
              <motion.div
                className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Spotlight glow effect on hover */}
                <motion.div
                  className="absolute inset-0 z-10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredSession === session.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${primaryColor}40 0%, transparent 70%)`,
                    mixBlendMode: 'screen',
                  }}
                />

                {/* Neon border glow on hover */}
                <motion.div
                  className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
                  animate={{
                    boxShadow: hoveredSession === session.id
                      ? `0 0 40px ${primaryColor}60, inset 0 0 40px ${primaryColor}20`
                      : '0 0 0px transparent',
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Poster Image */}
                <motion.img
                  src={session.image}
                  alt={session.title}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: hoveredSession === session.id ? 1.1 : 1,
                    filter: hoveredSession === session.id ? 'brightness(1.2) saturate(1.3)' : 'brightness(0.9)',
                  }}
                  transition={{ duration: 0.4 }}
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-20">
                  <motion.div
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-xl border"
                    style={{
                      backgroundColor: `${primaryColor}20`,
                      borderColor: `${primaryColor}60`,
                      color: primaryColor,
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {session.sala}
                  </motion.div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-xl border border-white/20">
                    <Clock className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-bold">{session.time}</span>
                  </div>
                </div>

                {/* Bottom info - appears on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 z-20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: hoveredSession === session.id ? 0 : 20,
                    opacity: hoveredSession === session.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/40">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-yellow-500 text-xs font-bold">{session.rating}</span>
                    </div>
                    <span className="text-white/60 text-xs uppercase tracking-wider">{session.genre}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <Clock className="w-3 h-3" />
                      {session.duration}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all"
                    >
                      GET TICKETS
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Movie Title & Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-bold text-xl group-hover:text-white/80 transition-colors">
                    {session.title}
                  </h4>
                  <motion.div
                    className="text-right"
                    animate={{
                      scale: hoveredSession === session.id ? 1.1 : 1,
                      color: hoveredSession === session.id ? primaryColor : '#ffffff',
                    }}
                  >
                    <span className="text-2xl font-bold">{session.price}</span>
                  </motion.div>
                </div>

                <p className="text-white/50 text-sm">{session.subtitle}</p>

                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded bg-white/5 border border-white/10">
                    <span className="text-white/60 text-xs uppercase tracking-wider">{session.group}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Combos & Snacks - Futuristic Cards */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-white flex items-center gap-3">
            <Popcorn className="w-7 h-7" style={{ color: primaryColor }} />
            CINEMA COMBOS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {combos.map((combo, index) => (
            <motion.div
              key={combo.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border border-white/10 p-6 cursor-pointer"
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${primaryColor}10 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                <div className="text-6xl mb-4">{combo.emoji}</div>
                <h4 className="text-white font-bold text-xl mb-2 group-hover:text-white/90 transition-colors">
                  {combo.name}
                </h4>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">{combo.desc}</p>

                <div className="flex items-center justify-between">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: primaryColor }}
                  >
                    {combo.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white text-sm font-bold transition-all"
                  >
                    ADD
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action - Cinematic */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  `radial-gradient(circle at 20% 50%, ${primaryColor}15 0%, transparent 50%)`,
                  `radial-gradient(circle at 80% 50%, ${primaryColor}15 0%, transparent 50%)`,
                  `radial-gradient(circle at 20% 50%, ${primaryColor}15 0%, transparent 50%)`,
                ],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border border-white/10 p-12 md:p-16 text-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Ticket
                className="w-20 h-20 mx-auto mb-6"
                style={{ color: primaryColor }}
              />
            </motion.div>

            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready for the Show?
            </h3>

            <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Combine cinema, music, and gastronomy in a unique experience.
              Choose your favorite film and enjoy our themed menu.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/home')}
                className="group px-10 py-5 rounded-full font-bold text-lg text-black flex items-center gap-3 justify-center backdrop-blur-xl shadow-2xl relative overflow-hidden"
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    boxShadow: [
                      `0 0 20px ${primaryColor}40`,
                      `0 0 60px ${primaryColor}80`,
                      `0 0 20px ${primaryColor}40`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Ticket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                BUY TICKETS
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/carrinho')}
                className="px-10 py-5 rounded-full font-bold text-lg text-white flex items-center gap-3 justify-center border-2 hover:bg-white/5 backdrop-blur-xl transition-all"
                style={{
                  borderColor: primaryColor,
                }}
              >
                View Cart ({items.length})
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
