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
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isHome && !isCinema && (
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div onClick={() => navigate('/home')} className="cursor-pointer">
              <h1 className={`text-2xl md:text-3xl font-bold tracking-[0.3em] text-white neon-text ${isCinemaMode ? 'font-serif' : ''}`}>
                MIKROKOSMOS
              </h1>
              <p className="text-xs text-white/60 tracking-wider">
                {isCinemaMode ? 'Cinematic Experience System' : 'Themed-Sync System'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Seletor de idioma */}
            <LanguageSwitcher />

            {/* Cinema / Photocards */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cinema')}
              className="w-10 h-10 md:w-auto md:px-3 md:py-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 text-white hover:bg-white/20 transition-colors"
              title={isKpopMode ? t('nav.photocards', 'Photocards') : t('nav.cinema')}
            >
              {isKpopMode
                ? <Sparkles className="w-5 h-5" />
                : <Film className="w-5 h-5" />
              }
              <span className="hidden xl:inline text-sm">
                {isKpopMode ? t('photocards.title') : t('nav.cinema')}
              </span>
            </motion.button>

            {/* Analytics — só admin */}
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/analytics')}
                className="w-10 h-10 md:w-auto md:px-3 md:py-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 text-white hover:bg-white/20 transition-colors"
                title={t('nav.analytics')}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden lg:inline text-sm">{t('nav.analytics')}</span>
              </motion.button>
            )}

            {/* Cozinha */}
            {isCozinha && (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/cozinha')}
                className="relative w-10 h-10 md:w-auto md:px-3 md:py-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 text-white hover:bg-white/20 transition-colors"
                title={t('nav.kitchen')}
              >
                <ChefHat className="w-5 h-5" />
                <span className="hidden lg:inline text-sm">{t('nav.kitchen')}</span>
                {pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-black"
                    style={{ backgroundColor: 'var(--primary-neon)' }}>
                    {pendingOrders}
                  </span>
                )}
              </motion.button>
            )}

            {/* Delivery */}
            {isDelivery && (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/delivery')}
                className="relative w-10 h-10 md:w-auto md:px-3 md:py-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 text-white hover:bg-white/20 transition-colors"
                title={t('nav.delivery')}
              >
                <Bike className="w-5 h-5" />
                <span className="hidden lg:inline text-sm">{t('nav.delivery')}</span>
                {deliveryOrders > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-black"
                    style={{ backgroundColor: 'var(--primary-neon)' }}>
                    {deliveryOrders}
                  </span>
                )}
              </motion.button>
            )}

            {/* Learning */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/learning')}
              className="w-10 h-10 md:w-auto md:px-3 md:py-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 text-white hover:bg-white/20 transition-colors"
              title={t('nav.learning')}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="hidden xl:inline text-sm">{t('nav.learning')}</span>
            </motion.button>

            {/* Sobre */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/info')}
              className="w-10 h-10 md:w-auto md:px-3 md:py-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 text-white hover:bg-white/20 transition-colors"
              title={t('nav.info')}
            >
              <Info className="w-5 h-5" />
              <span className="hidden xl:inline text-sm">{t('nav.info')}</span>
            </motion.button>

            {/* Perfil/Login */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isAuthenticated ? '/perfil' : '/auth')}
              className="w-10 h-10 md:w-auto md:px-3 md:py-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 text-white hover:bg-white/20 transition-colors"
              title={isAuthenticated ? t('nav.profile') : t('nav.login')}
            >
              <User className="w-5 h-5" />
              <span className="hidden xl:inline text-sm">
                {isAuthenticated ? t('nav.profile') : t('nav.login')}
              </span>
            </motion.button>

            {/* Carrinho */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/carrinho')}
              className="relative w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              title={t('nav.cart')}
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-black"
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