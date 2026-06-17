// src/app/components/Header.tsx
import { ShoppingCart, ArrowLeft, Info, GraduationCap, User, ChefHat, Bike, BarChart3, Film, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useUniverse } from '../context/UniverseContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { orders } = useOrders();
  const { categoria } = useUniverse();
  const { t } = useTranslation();

  const isHome = location.pathname === '/home';
  const isCinema = location.pathname === '/cinema';
  const isCinemaMode = categoria === 'Cinema';
  const isKpopMode = categoria === 'Kpop';

  const isAdmin = user?.role === 'admin';
  const isCozinha = user?.role === 'cozinha' || isAdmin;
  const isDelivery = user?.role === 'delivery' || isAdmin;

  const pendingOrders = orders.filter(o => ['pendente', 'preparando'].includes(o.status)).length;
  const deliveryOrders = orders.filter(o => ['pronto', 'saiu-para-entrega'].includes(o.status)).length;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/20">
      <div className="max-w-6xl mx-auto px-3 py-3">
        <div className="flex items-center justify-between gap-2">

          {/* Esquerda: botão voltar + logo */}
          <div className="flex items-center gap-2 min-w-0">
            {!isHome && !isCinema && (
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 flex-shrink-0 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div onClick={() => navigate('/home')} className="cursor-pointer min-w-0">
              <h1 className={`text-lg sm:text-2xl md:text-3xl font-bold tracking-[0.2em] sm:tracking-[0.3em] text-white neon-text truncate ${isCinemaMode ? 'font-serif' : ''}`}>
                MIKROKOSMOS
              </h1>
              <p className="text-[10px] sm:text-xs text-white/60 tracking-wider hidden sm:block">
                {isCinemaMode ? 'Cinematic Experience System' : 'Themed-Sync System'}
              </p>
            </div>
          </div>

          {/* Direita: ações */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Idioma — sempre visível */}
            <LanguageSwitcher />

            {/* Cinema/Photocards — sempre visível */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cinema')}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              title={isKpopMode ? t('photocards.title') : t('nav.cinema')}
            >
              {isKpopMode ? <Sparkles className="w-4 h-4" /> : <Film className="w-4 h-4" />}
            </motion.button>

            {/* Analytics — só admin, só md+ */}
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/analytics')}
                className="hidden md:flex w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center text-white hover:bg-white/20 transition-colors"
                title={t('nav.analytics')}
              >
                <BarChart3 className="w-4 h-4" />
              </motion.button>
            )}

            {/* Cozinha — só md+ */}
            {isCozinha && (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/cozinha')}
                className="hidden md:flex relative w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center text-white hover:bg-white/20 transition-colors"
                title={t('nav.kitchen')}
              >
                <ChefHat className="w-4 h-4" />
                {pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-black"
                    style={{ backgroundColor: 'var(--primary-neon)' }}>
                    {pendingOrders}
                  </span>
                )}
              </motion.button>
            )}

            {/* Delivery — só md+ */}
            {isDelivery && (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/delivery')}
                className="hidden md:flex relative w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center text-white hover:bg-white/20 transition-colors"
                title={t('nav.delivery')}
              >
                <Bike className="w-4 h-4" />
                {deliveryOrders > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-black"
                    style={{ backgroundColor: 'var(--primary-neon)' }}>
                    {deliveryOrders}
                  </span>
                )}
              </motion.button>
            )}

            {/* Learning — só lg+ */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/learning')}
              className="hidden lg:flex w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center text-white hover:bg-white/20 transition-colors"
              title={t('nav.learning')}
            >
              <GraduationCap className="w-4 h-4" />
            </motion.button>

            {/* Info — só lg+ */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/info')}
              className="hidden lg:flex w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center text-white hover:bg-white/20 transition-colors"
              title={t('nav.info')}
            >
              <Info className="w-4 h-4" />
            </motion.button>

            {/* Perfil/Login — sempre visível */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isAuthenticated ? '/perfil' : '/auth')}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              title={isAuthenticated ? t('nav.profile') : t('nav.login')}
            >
              <User className="w-4 h-4" />
            </motion.button>

            {/* Carrinho — sempre visível */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/carrinho')}
              className="relative w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              title={t('nav.cart')}
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-black"
                  style={{ backgroundColor: 'var(--primary-neon)' }}>
                  {itemCount}
                </span>
              )}
            </motion.button>

          </div>
        </div>
      </div>
    </header>
  );
}