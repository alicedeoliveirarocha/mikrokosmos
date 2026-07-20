// src/app/pages/Profile.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { User, Mail, Calendar, LogOut, Edit, Save, X, Shield, UserCircle, ChefHat, Bike } from 'lucide-react';
import { toast } from 'sonner';
import { getWelcomeMessage } from '../utils/customResponses';

export function Profile() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.nome || '');

  if (!isAuthenticated || !user) {
    navigate('/auth');
    return null;
  }

  const handleSave = () => {
    if (editedName.trim()) {
      updateProfile(editedName.trim());
      setIsEditing(false);
      toast.success(t('profile.profileUpdated'));
    } else {
      toast.error(t('profile.nameEmpty'));
    }
  };

  const handleLogout = () => {
    logout();
    toast.success(t('auth.logoutSuccess'));
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return t('profile.dateUnavailable');
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) return t('profile.dateUnavailable');
    const locale = i18n.language === 'pt-BR' ? 'pt-BR'
      : i18n.language === 'ko' ? 'ko-KR'
      : i18n.language === 'ja' ? 'ja-JP'
      : i18n.language === 'zh' ? 'zh-CN'
      : i18n.language === 'es' ? 'es-ES'
      : 'en-US';
    return date.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'admin': return Shield;
      case 'cozinha': return ChefHat;
      case 'delivery': return Bike;
      default: return UserCircle;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'admin': return '#9C27B0';
      case 'cozinha': return '#FF6B35';
      case 'delivery': return '#FFD700';
      default: return 'var(--primary-neon)';
    }
  };

  const RoleIcon = getRoleIcon();
  const roleColor = getRoleColor();
  const welcomeMsg = getWelcomeMessage(user.role, user.nome);

  // ── Estatísticas — lidas do MESMO storage que o ProductDetail grava.
  // BUG antigo resolvido: o contador de avaliações lia a chave inexistente
  // 'mikrokosmos_ratings' e vivia congelado em 0. O formato real é
  // mikrokosmos_product_ratings: { [productId]: [{ userId, rating }] }.
  // (Futuro: migrar avaliações/favoritos pras tabelas ratings/favorites
  // do Supabase, que já existem com RLS prontas.) ──
  const allRatings: Record<string, { userId: string }[]> = JSON.parse(
    localStorage.getItem('mikrokosmos_product_ratings') || '{}'
  );
  const myRatingsCount = Object.values(allRatings).reduce(
    (n, arr) => n + (Array.isArray(arr) ? arr.filter(r => r.userId === user.id).length : 0),
    0
  );
  const myFavoritesCount =
    (JSON.parse(localStorage.getItem('mikrokosmos_favorites') || '{}')[user.id] || []).length;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
        >
          <p className="text-white/80">{welcomeMsg.message}</p>
        </motion.div>

        {/* FIX responsividade: padding progressivo (p-5 no celular → p-12 no
            desktop) pra tela estreita não espremer o conteúdo pra fora */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-5 sm:p-8 md:p-12"
        >
          {/* Avatar e Nome */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mb-6 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, var(--gradient-from), var(--gradient-to))`,
                boxShadow: '0 20px 60px rgba(0, 255, 255, 0.4)'
              }}
            >
              <User className="w-14 h-14 sm:w-16 sm:h-16 text-black" />
            </motion.div>

            {isEditing ? (
              /* FIX mobile: o input tinha largura intrínseca fixa e estourava
                 a tela no retrato (o campo vazava pela esquerda e o salvar
                 sumia pela direita). Agora a linha ocupa no máximo a largura
                 do card (w-full max-w-md), o input encolhe (flex-1 min-w-0)
                 e os botões nunca são amassados (flex-shrink-0). */
              <div className="flex w-full max-w-md items-center gap-2 sm:gap-3 mb-4">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1 min-w-0 bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 text-white text-xl sm:text-2xl text-center focus:outline-none focus:border-white/40"
                  placeholder={t('auth.namePlaceholder')}
                />
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={handleSave}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--primary-neon)' }}>
                  <Save className="w-5 h-5 text-black" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => { setIsEditing(false); setEditedName(user.nome); }}
                  className="w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center flex-shrink-0">
                  <X className="w-5 h-5 text-red-500" />
                </motion.button>
              </div>
            ) : (
              /* FIX mobile: nome longo quebra linha (break-words) em vez de
                 vazar; flex-wrap deixa o lápis descer se faltar espaço */
              <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-3 mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center break-words max-w-full">{user.nome}</h1>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all flex-shrink-0">
                  <Edit className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            )}
            <p className="text-white/60 text-lg text-center">{t('profile.memberTitle')}</p>
          </div>

          {/* RBAC — min-w-0 no texto pra descrições longas (ja/ko/zh)
              quebrarem dentro do card em vez de vazar */}
          <div className="mb-6 p-4 sm:p-6 rounded-2xl border-2"
            style={{ backgroundColor: `${roleColor}15`, borderColor: roleColor }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${roleColor}30` }}>
                <RoleIcon className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: roleColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-sm mb-1">{t('profile.rbacRole')}</p>
                <p className="text-xl sm:text-2xl font-bold text-white break-words">{t(`profile.roles.${user.role}`)}</p>
                <p className="text-sm text-white/50 mt-1 break-words">{t(`profile.roleAccess.${user.role}`)}</p>
              </div>
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-4 mb-8">
            {/* FIX overflow: min-w-0 deixa o texto encolher dentro do flex
                (sem ele, filho de flex não encolhe e o e-mail vaza do card);
                break-all quebra e-mails longos; flex-shrink-0 protege o ícone */}
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--primary-neon)' }}>
                <Mail className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-sm">{t('auth.email')}</p>
                <p className="text-white text-base sm:text-lg break-all">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--primary-neon)' }}>
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-sm">{t('profile.memberSince')}</p>
                <p className="text-white text-base sm:text-lg break-words">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Estatísticas — gap e padding menores no celular pros 3 cards
              caberem lado a lado sem espremer os números */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
            <div className="text-center p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--primary-neon)' }}>
                {myRatingsCount}
              </p>
              <p className="text-white/60 text-xs sm:text-sm">{t('profile.ratings')}</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--primary-neon)' }}>
                {myFavoritesCount}
              </p>
              <p className="text-white/60 text-xs sm:text-sm">{t('profile.favorites')}</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--primary-neon)' }}>
                {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-white/60 text-xs sm:text-sm">{t('profile.days')}</p>
            </div>
          </div>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full py-4 rounded-xl font-bold text-white bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            {t('profile.logoutBtn')}
          </motion.button>
        </motion.div>
      </main>
      <UniverseToggle />
    </div>
  );
}