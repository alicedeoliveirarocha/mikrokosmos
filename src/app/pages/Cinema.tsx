// src/app/pages/Cinema.tsx
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Film, Popcorn, Ticket, Star, Play, ArrowRight, Home, Sparkles, Clock, ShoppingCart } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { CinemaBackground } from '../components/CinemaBackground';
import { DepthLayers } from '../components/DepthLayers';
import { useState } from 'react';
import { photocards, Rarity, GroupId, GROUP_CONFIG } from '../data/photocards';
import { toast } from 'sonner';

export function Cinema() {
  const navigate = useNavigate();
  const { universeName, primaryColor, categoria } = useUniverse();
  const { items, addToCart, itemCount } = useCart();
  const { t } = useTranslation();
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');
  const [groupFilter, setGroupFilter] = useState<GroupId | 'all'>('all');

  const isKpop = categoria === 'Kpop';

  // Títulos de filmes, nomes de estúdios e nomes de combos são identidade de marca — não traduzem.
  // "sala" guarda só o tipo (IMAX 1, PREMIUM 2...); a palavra "Sala" vem de t('cinema.room').
  // Gêneros usam chave de tradução (genreKey).
  const cinemaSessions = [
    { id: 'spiderman',    title: 'Spider-Man',   subtitle: 'No Way Home',      group: 'MARVEL STUDIOS',      time: '19:30', sala: 'IMAX 1',    price: 55.00, priceLabel: 'R$ 55,00', image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop', rating: '8.7', genreKey: 'cinema.genreActionAdventure', duration: '2h 28min' },
    { id: 'interstellar', title: 'Interstellar',  subtitle: 'A Journey Beyond', group: 'CHRISTOPHER NOLAN',   time: '21:00', sala: 'PREMIUM 2', price: 60.00, priceLabel: 'R$ 60,00', image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop', rating: '9.3', genreKey: 'cinema.genreSciFiDrama',      duration: '2h 49min' },
    { id: 'meangirls',    title: 'Mean Girls',    subtitle: 'The Musical',      group: 'PARAMOUNT PICTURES',  time: '18:15', sala: 'VIP 3',     price: 48.00, priceLabel: 'R$ 48,00', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop', rating: '8.5', genreKey: 'cinema.genreComedyMusical',    duration: '1h 52min' },
  ];

  const kpopCombos = [
    { id: 'kc1', nome: 'Combo Photocard Lover',  desc: 'Pipoca G + Refri G + 1 Photocard Grátis',         preco: 35.00, emoji: '🍿', categoria: 'Combos', imageUrl: 'x-burguer-katsu' },
    { id: 'kc2', nome: 'Combo Stan Pack',         desc: 'Pipoca XL + 2 Refris + Nachos + Lightstick',      preco: 65.00, emoji: '✨', categoria: 'Combos', imageUrl: 'x-burguer-katsu' },
    { id: 'kc3', nome: 'Combo Bias Snack',        desc: 'Hot Dog + Suco + Chocolate + Sticker do grupo',   preco: 28.00, emoji: '💜', categoria: 'Combos', imageUrl: 'x-burguer-katsu' },
  ];

  const cinemaCombos = [
    { id: 'cc1', nome: 'Combo Classic',    desc: 'Pipoca G + Refri G',                        preco: 32.00, emoji: '🍿', categoria: 'Combos', imageUrl: 'x-burguer-katsu' },
    { id: 'cc2', nome: 'Combo Premium',    desc: 'Pipoca XL + 2 Refris + Nachos + Chocolate', preco: 62.00, emoji: '🎬', categoria: 'Combos', imageUrl: 'x-burguer-katsu' },
    { id: 'cc3', nome: 'Combo Snack Time', desc: 'Hot Dog + Suco + Batata Palha',             preco: 28.00, emoji: '🌭', categoria: 'Combos', imageUrl: 'x-burguer-katsu' },
  ];

  const combos = isKpop ? kpopCombos : cinemaCombos;

  const filteredCards = photocards.filter(c =>
    (rarityFilter === 'all' || c.rarity === rarityFilter) &&
    (groupFilter  === 'all' || c.group  === groupFilter)
  );

  const handleAddCombo = (combo: typeof combos[0]) => {
    addToCart(combo);
    toast.success(`${combo.nome} ${t('cinema.addedToCart')}`);
  };

  const handleAddTicket = (session: typeof cinemaSessions[0]) => {
    addToCart({
      id: `ticket-${session.id}`,
      nome: `${t('cinema.ticket')} — ${session.title}`,
      desc: `${t('cinema.room')} ${session.sala} · ${session.time}`,
      preco: session.price,
      categoria: 'Ingressos',
      imageUrl: 'x-burguer-katsu',
    });
    toast.success(`${t('cinema.ticketAdded')} ${session.title}! 🎟️`);
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      <CinemaBackground />
      <DepthLayers />

      {/* Header interno */}
      <div className="relative z-10 p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between max-w-[1400px] mx-auto"
        >
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/home')}
              className="p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all"
            >
              <Home className="w-5 h-5 text-white" />
            </motion.button>
            <div>
              <motion.h1 className="text-3xl md:text-4xl font-bold text-white tracking-wider flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              >
                {isKpop
                  ? <Sparkles className="w-8 h-8" style={{ color: primaryColor }} />
                  : <Film className="w-8 h-8" style={{ color: primaryColor }} />
                }
                {isKpop ? t('cinema.photocardsTitle') : 'MIKROKOSMOS CINEMA'}
              </motion.h1>
              <p className="text-white/50 text-sm mt-1 tracking-wide">
                {isKpop ? t('cinema.kpopSubtitle') : t('cinema.cinemaSubtitle')}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/80 text-sm">
              {isKpop ? t('cinema.eraLabel') : t('cinema.nowPlayingLabel')} <span className="font-bold" style={{ color: primaryColor }}>{universeName}</span>
            </div>
            {itemCount > 0 && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/carrinho')}
                className="relative p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-black"
                  style={{ backgroundColor: primaryColor }}>
                  {itemCount}
                </span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 mb-16"
      >
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 30%, ${primaryColor}20 0%, transparent 60%)` }}
          />
          <div className="relative bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border border-white/10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-red-500/30"
                  animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3" style={{ color: primaryColor }} />
                  {isKpop ? t('cinema.collectThemAll') : t('cinema.nowShowingBadge')}
                </motion.div>
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  {isKpop ? t('cinema.exclusive') : t('cinema.premium')}<br />
                  <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                    {isKpop ? t('cinema.photocardsWord') : t('cinema.cinemaSessions')}
                  </span>
                </h2>
                <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-xl">
                  {isKpop ? t('cinema.kpopHeroDesc') : t('cinema.cinemaHeroDesc')}
                </p>
                <div className="flex items-center gap-6">
                  {isKpop ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
                        <span className="text-white font-bold text-xl">{photocards.length}</span>
                        <span className="text-white/40 text-sm">{t('cinema.cards')}</span>
                      </div>
                      <div className="h-8 w-px bg-white/20" />
                      <div className="text-white/60 text-sm">{t('cinema.groupsAvailable')}</div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-white font-bold text-xl">4.9</span>
                        <span className="text-white/40 text-sm">/5.0</span>
                      </div>
                      <div className="h-8 w-px bg-white/20" />
                      <div className="text-white/60 text-sm">2.8k {t('cinema.reviews')}</div>
                    </>
                  )}
                </div>
              </div>
              <motion.div
                className="flex items-center gap-4 bg-black/40 backdrop-blur-xl rounded-2xl px-8 py-6 border border-white/10 cursor-pointer"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => navigate('/carrinho')}
              >
                {isKpop
                  ? <Sparkles className="w-16 h-16" style={{ color: primaryColor }} />
                  : <Popcorn className="w-16 h-16" style={{ color: primaryColor }} />
                }
                <div className="text-white">
                  <p className="text-sm text-white/50 uppercase tracking-wider">
                    {isKpop ? t('cinema.cards') : t('cinema.items')}
                  </p>
                  <p className="text-4xl font-bold">{itemCount}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ PHOTOCARDS (K-pop) ═══ */}
      {isKpop ? (
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 mb-16">
          <div className="flex items-center justify-between mb-6">
            <motion.h3 className="text-3xl font-bold text-white flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            >
              <Sparkles className="w-7 h-7" style={{ color: primaryColor }} />
              {t('cinema.photocardCollection')}
            </motion.h3>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/60 text-sm">
              {filteredCards.length} {t('cinema.cards')}
            </div>
          </div>

          {/* Rarity filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {(['all', 'common', 'rare', 'ultra-rare'] as const).map(r => (
              <button key={r} onClick={() => setRarityFilter(r)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${rarityFilter === r ? 'text-black border-transparent' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
                style={rarityFilter === r ? { backgroundColor: primaryColor } : {}}>
                {r === 'all' ? t('home.all') : r === 'common' ? `🟫 ${t('photocards.rarity.common')}` : r === 'rare' ? `🟦 ${t('photocards.rarity.rare')}` : `⭐ ${t('photocards.rarity.ultraRare')}`}
              </button>
            ))}
          </div>

          {/* Group filters */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {(['all', 'bts', 'blackpink', 'aespa', 'enhypen', 'redvelvet', 'newjeans', 'illit'] as const).map(g => (
              <button key={g} onClick={() => setGroupFilter(g)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${groupFilter === g ? 'text-black border-transparent' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
                style={groupFilter === g ? { backgroundColor: primaryColor } : {}}>
                {g === 'all' ? t('cinema.allGroups') : g.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredCards.map((card, index) => {
              const cfg = GROUP_CONFIG[card.group];
              const isUR = card.rarity === 'ultra-rare';
              const isRare = card.rarity === 'rare';
              return (
                <motion.div key={card.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: 1.08, y: -6 }}
                  className="cursor-pointer group"
                >
                  <div className={`relative overflow-hidden rounded-xl ${isUR ? 'card-ultra-rare' : ''}`}
                    style={{
                      aspectRatio: '2/3',
                      background: !card.imageUrl ? (isUR ? undefined : cfg.gradient) : undefined,
                      boxShadow: isUR ? '0 0 30px rgba(255,0,128,0.5), 0 0 60px rgba(64,224,208,0.3)' : isRare ? `0 0 20px ${cfg.accentColor}60` : '0 4px 15px rgba(0,0,0,0.5)',
                      border: isUR ? '2px solid rgba(255,255,255,0.4)' : isRare ? `1.5px solid ${cfg.accentColor}80` : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {card.imageUrl && <img src={card.imageUrl} alt={card.member} className="absolute inset-0 w-full h-full object-cover object-top" style={{ zIndex: 0 }} />}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.75) 100%)', zIndex: 1 }} />
                    {isUR && <div className="shimmer" style={{ zIndex: 2 }} />}
                    {isUR && ['10%','80%','50%','20%','70%'].map((left, i) => (
                      <div key={i} className="sparkle absolute text-xs text-yellow-300"
                        style={{ left, top: `${15 + i * 15}%`, '--delay': `${0.3 + i * 0.4}s`, zIndex: 3 } as React.CSSProperties}>✦</div>
                    ))}
                    <div className="absolute inset-0 flex flex-col justify-between p-3" style={{ zIndex: 4 }}>
                      <div className="flex items-start justify-between">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider"
                          style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: isUR ? '#FFD700' : isRare ? cfg.accentColor : 'rgba(255,255,255,0.9)', border: isUR ? '1px solid #FFD700' : isRare ? `1px solid ${cfg.accentColor}` : '1px solid rgba(255,255,255,0.3)' }}>
                          {isUR ? '⭐ UR' : isRare ? '🟦 R' : '🟫 C'}
                        </div>
                        {card.isPreDebut && (
                          <div className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[9px] font-bold">{t('cinema.preDebut')}</div>
                        )}
                      </div>
                      {!card.imageUrl && (
                        <div className="flex items-center justify-center flex-1">
                          <div className="flex items-center justify-center rounded-full font-black text-3xl"
                            style={{ width: 72, height: 72, backgroundColor: isUR ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.4)', border: isUR ? '2px solid rgba(255,255,255,0.5)' : `2px solid ${cfg.accentColor}60`, color: isUR ? '#FFD700' : cfg.accentColor, textShadow: isUR ? '0 0 20px #FFD700' : `0 0 15px ${cfg.accentColor}`, boxShadow: isUR ? '0 0 30px rgba(255,215,0,0.4)' : `0 0 20px ${cfg.accentColor}30` }}>
                            {card.isGroupPhoto ? '♛' : card.member.charAt(0)}
                          </div>
                        </div>
                      )}
                      <div className="rounded-lg p-2" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
                        <p className="font-black text-sm leading-tight truncate" style={{ color: isUR ? '#FFD700' : cfg.accentColor }}>{card.member}</p>
                        <p className="text-white/80 text-[10px] truncate">{card.groupName}</p>
                        <p className="text-white/50 text-[9px] truncate">{card.era}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 60%)', zIndex: 5 }}>
                      <div className="w-full">
                        <span className="text-[10px] font-bold" style={{ color: isUR ? '#FFD700' : cfg.accentColor }}>
                          🎁 {t('cinema.freeWithOrder')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      ) : (
        /* ═══ FILMES (Cinema) ═══ */
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 mb-16">
          <div className="flex items-center justify-between mb-8">
            <motion.h3 className="text-3xl font-bold text-white flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Play className="w-7 h-7" style={{ color: primaryColor }} />
              {t('cinema.nowPlaying')}
            </motion.h3>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/60 text-sm">
              <Film className="w-4 h-4" />
              {cinemaSessions.length} {t('cinema.filmsAvailable')}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cinemaSessions.map((session, index) => (
              <motion.div key={session.id}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.15, type: 'spring', stiffness: 100 }}
                onMouseEnter={() => setHoveredSession(session.id)}
                onMouseLeave={() => setHoveredSession(null)}
                className="group cursor-pointer"
              >
                <motion.div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4"
                  whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <motion.div className="absolute inset-0 z-10 pointer-events-none"
                    animate={{ opacity: hoveredSession === session.id ? 1 : 0 }}
                    style={{ background: `radial-gradient(circle at 50% 50%, ${primaryColor}40 0%, transparent 70%)`, mixBlendMode: 'screen' }} />
                  <motion.div className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
                    animate={{ boxShadow: hoveredSession === session.id ? `0 0 40px ${primaryColor}60, inset 0 0 40px ${primaryColor}20` : '0 0 0px transparent' }} />
                  <motion.img src={session.image} alt={session.title} className="w-full h-full object-cover"
                    animate={{ scale: hoveredSession === session.id ? 1.1 : 1, filter: hoveredSession === session.id ? 'brightness(1.2) saturate(1.3)' : 'brightness(0.9)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80" />
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-20">
                    <div className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-xl border"
                      style={{ backgroundColor: `${primaryColor}20`, borderColor: `${primaryColor}60`, color: primaryColor }}>
                      {t('cinema.room')} {session.sala}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-xl border border-white/20">
                      <Clock className="w-3 h-3 text-white" />
                      <span className="text-white text-xs font-bold">{session.time}</span>
                    </div>
                  </div>
                  <motion.div className="absolute bottom-0 left-0 right-0 p-6 z-20"
                    animate={{ y: hoveredSession === session.id ? 0 : 20, opacity: hoveredSession === session.id ? 1 : 0 }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/40">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-yellow-500 text-xs font-bold">{session.rating}</span>
                      </div>
                      <span className="text-white/60 text-xs uppercase tracking-wider">{t(session.genreKey)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/80 text-xs">
                        <Clock className="w-3 h-3" />{session.duration}
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={e => { e.stopPropagation(); handleAddTicket(session); }}
                        className="px-4 py-2 rounded-lg text-xs font-bold transition-all text-black"
                        style={{ backgroundColor: primaryColor }}>
                        {t('cinema.getTickets')}
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-bold text-xl group-hover:text-white/80 transition-colors">{session.title}</h4>
                    <motion.span className="text-2xl font-bold"
                      animate={{ color: hoveredSession === session.id ? primaryColor : '#ffffff' }}>
                      {session.priceLabel}
                    </motion.span>
                  </div>
                  <p className="text-white/50 text-sm">{session.subtitle}</p>
                  <div className="px-2 py-1 rounded bg-white/5 border border-white/10 w-fit">
                    <span className="text-white/60 text-xs uppercase tracking-wider">{session.group}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ COMBOS ═══ */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-white flex items-center gap-3">
            <Popcorn className="w-7 h-7" style={{ color: primaryColor }} />
            {isKpop ? t('cinema.photocardCombos') : t('cinema.cinemaCombos')}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {combos.map((combo, index) => (
            <motion.div key={combo.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border border-white/10 p-6"
            >
              <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                style={{ background: `radial-gradient(circle at 50% 50%, ${primaryColor}10 0%, transparent 70%)` }} />
              <div className="relative z-10">
                <div className="text-6xl mb-4">{combo.emoji}</div>
                <h4 className="text-white font-bold text-xl mb-2">{combo.nome}</h4>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">{t(`products.${combo.id}`, { defaultValue: combo.desc })}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold" style={{ color: primaryColor }}>R$ {combo.preco.toFixed(2)}</span>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddCombo(combo)}
                    className="px-5 py-2.5 rounded-full font-bold text-sm text-black transition-all"
                    style={{ backgroundColor: primaryColor }}>
                    {t('common.add')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0">
            <motion.div className="absolute inset-0"
              animate={{ background: [`radial-gradient(circle at 20% 50%, ${primaryColor}15 0%, transparent 50%)`, `radial-gradient(circle at 80% 50%, ${primaryColor}15 0%, transparent 50%)`, `radial-gradient(circle at 20% 50%, ${primaryColor}15 0%, transparent 50%)`] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
          </div>
          <div className="relative bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border border-white/10 p-12 md:p-16 text-center">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              {isKpop
                ? <Sparkles className="w-20 h-20 mx-auto mb-6" style={{ color: primaryColor }} />
                : <Ticket className="w-20 h-20 mx-auto mb-6" style={{ color: primaryColor }} />
              }
            </motion.div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {isKpop ? t('cinema.readyToCollect') : t('cinema.readyForShow')}
            </h3>
            <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              {isKpop ? t('cinema.readyToCollectDesc') : t('cinema.readyForShowDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/home')}
                className="group px-10 py-5 rounded-full font-bold text-lg text-black flex items-center gap-3 justify-center relative overflow-hidden"
                style={{ backgroundColor: primaryColor }}>
                {isKpop ? <Sparkles className="w-6 h-6" /> : <Ticket className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
                {isKpop ? t('cinema.seeMenu') : t('cinema.buyTickets')}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/carrinho')}
                className="px-10 py-5 rounded-full font-bold text-lg text-white flex items-center gap-3 justify-center border-2 hover:bg-white/5 backdrop-blur-xl transition-all"
                style={{ borderColor: primaryColor }}>
                {t('cinema.viewCart', { count: itemCount })}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}