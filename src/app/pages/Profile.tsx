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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12"
        >
          {/* Avatar e Nome */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-32 h-32 rounded-full mb-6 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, var(--gradient-from), var(--gradient-to))`,
                boxShadow: '0 20px 60px rgba(0, 255, 255, 0.4)'
              }}
            >
              <User className="w-16 h-16 text-black" />
            </motion.div>

            {isEditing ? (
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white text-2xl text-center focus:outline-none focus:border-white/40"
                  placeholder={t('auth.namePlaceholder')}
                />
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={handleSave}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--primary-neon)' }}>
                  <Save className="w-5 h-5 text-black" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => { setIsEditing(false); setEditedName(user.nome); }}
                  className="w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-white">{user.nome}</h1>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                  <Edit className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            )}
            <p className="text-white/60 text-lg">{t('profile.memberTitle')}</p>
          </div>

          {/* RBAC */}
          <div className="mb-6 p-6 rounded-2xl border-2"
            style={{ backgroundColor: `${roleColor}15`, borderColor: roleColor }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${roleColor}30` }}>
                <RoleIcon className="w-8 h-8" style={{ color: roleColor }} />
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">{t('profile.rbacRole')}</p>
                <p className="text-2xl font-bold text-white">{t(`profile.roles.${user.role}`)}</p>
                <p className="text-sm text-white/50 mt-1">{t(`profile.roleAccess.${user.role}`)}</p>
              </div>
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary-neon)' }}>
                <Mail className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-white/60 text-sm">{t('auth.email')}</p>
                <p className="text-white text-lg">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary-neon)' }}>
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-white/60 text-sm">{t('profile.memberSince')}</p>
                <p className="text-white text-lg">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--primary-neon)' }}>
                {JSON.parse(localStorage.getItem('mikrokosmos_ratings') || '{}')[user.id]?.length || 0}
              </p>
              <p className="text-white/60 text-sm">{t('profile.ratings')}</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--primary-neon)' }}>
                {JSON.parse(localStorage.getItem('mikrokosmos_favorites') || '{}')[user.id]?.length || 0}
              </p>
              <p className="text-white/60 text-sm">{t('profile.favorites')}</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--primary-neon)' }}>
                {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-white/60 text-sm">{t('profile.days')}</p>
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