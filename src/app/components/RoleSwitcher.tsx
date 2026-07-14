// src/app/components/RoleSwitcher.tsx
// FIX: visibilidade baseada no realRole (papel verdadeiro), não no papel efetivo.
// Assim o admin continua vendo o switcher mesmo "vestido" de delivery/cozinha/cliente.
// Novo: badge de "modo visualização" + botão para voltar ao papel real.
import { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { UserCircle, ChefHat, Bike, Shield, X, Eye, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import { getCustomResponse } from '../utils/customResponses';

const ADMIN_EMAILS = ['admin@mikrokosmos.com'];

export function RoleSwitcher() {
  const { user, realRole, isViewingAs, switchRole, resetViewRole } = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // ⚠️ Antes checava user.role — que muda ao trocar de visão e escondia o switcher.
  // Agora checa o papel REAL: só a conta admin de verdade vê este componente.
  const isAdminAccount = !!user && (realRole === 'admin' || ADMIN_EMAILS.includes(user.email));
  if (!isAdminAccount) return null;

  const roles: { value: UserRole; icon: any; color: string }[] = [
    { value: 'cliente',  icon: UserCircle, color: '#00FFFF' },
    { value: 'cozinha',  icon: ChefHat,    color: '#FF6B35' },
    { value: 'delivery', icon: Bike,       color: '#FFD700' },
    { value: 'admin',    icon: Shield,     color: '#9C27B0' },
  ];

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    const response = getCustomResponse(newRole, 'welcome');
    toast.success(response.title, { description: response.message });
    setIsOpen(false);
  };

  const handleReset = () => {
    resetViewRole();
    toast.success(t('roleSwitcher.backToRealToast'));
    setIsOpen(false);
  };

  // user.role aqui é o papel EFETIVO (visualização aplicada) — perfeito para exibição
  const currentRole = roles.find(r => r.value === user!.role) || roles[3];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center gap-2 text-white hover:bg-white/20 transition-all shadow-lg"
        style={{ boxShadow: `0 0 20px ${currentRole.color}40` }}
      >
        <currentRole.icon className="w-5 h-5" style={{ color: currentRole.color }} />
        <span className="font-bold text-sm">{t(`roleSwitcher.roles.${currentRole.value}.label`)}</span>
        {isViewingAs && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Eye className="w-3 h-3" />
            {t('roleSwitcher.viewingBadge')}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mx-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{t('roleSwitcher.title')}</h3>
                    <p className="text-sm text-white/60 mt-1">{t('roleSwitcher.subtitle')}</p>
                  </div>
                  <button onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {isViewingAs && (
                  <motion.button
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="w-full mb-4 p-3 rounded-xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 transition-all flex items-center justify-center gap-2 text-amber-300 font-bold text-sm"
                  >
                    <Undo2 className="w-4 h-4" />
                    {t('roleSwitcher.backToReal')}
                  </motion.button>
                )}

                <div className="space-y-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isActive = user!.role === role.value;
                    const isRealRole = realRole === role.value;
                    return (
                      <motion.button key={role.value}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoleChange(role.value)}
                        className={`w-full p-4 rounded-xl border transition-all ${
                          isActive ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                        style={{ boxShadow: isActive ? `0 0 20px ${role.color}30` : 'none' }}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${role.color}20` }}>
                            <Icon className="w-6 h-6" style={{ color: role.color }} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-white">{t(`roleSwitcher.roles.${role.value}.label`)}</p>
                              {isRealRole && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                  style={{ backgroundColor: `${role.color}20`, color: role.color, border: `1px solid ${role.color}40` }}>
                                  {t('roleSwitcher.realRoleBadge')}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/60 mt-1">{t(`roleSwitcher.roles.${role.value}.desc`)}</p>
                          </div>
                          {isActive && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-blue-300">{t('roleSwitcher.demoNote')}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}