// src/app/components/ProtectedRoute.tsx
// RBAC REAL — bloqueia rotas baseado no role do Supabase
// Agora com i18n: a tela de Acesso Negado fala os 6 idiomas,
// e os roles aparecem traduzidos via profile.roles.* (관리자, 配送员...)

import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth, UserRole } from '../context/AuthContext';
import { motion } from 'motion/react';
import { ShieldAlert, Lock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
  redirectTo = '/auth',
}: ProtectedRouteProps) {
  const { isAuthenticated, user, hasRole, loading } = useAuth();
  const { t } = useTranslation();

  // Roles são slugs de dados — tradução SÓ na exibição
  const roleLabel = (r?: string) =>
    r ? t(`profile.roles.${r}`, { defaultValue: r }) : '';

  // Enquanto carrega a sessão do Supabase, mostra loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12" style={{ color: 'var(--primary-neon)' }} />
        </motion.div>
      </div>
    );
  }

  // Não autenticado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Autenticado mas sem permissão
  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{t('protectedRoute.title')}</h2>
            <p className="text-white/60 mb-6 text-sm">
              {t('protectedRoute.message')}
            </p>

            <div className="bg-black/40 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-xs text-white/40">{t('protectedRoute.currentRole')}</p>
                  <p className="font-bold uppercase" style={{ color: 'var(--primary-neon)' }}>
                    {roleLabel(user?.role)}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/40 mb-6">
              {t('protectedRoute.requires')}{' '}
              <span className="text-white/60 font-bold">
                {allowedRoles?.map(r => roleLabel(r)).join(', ')}
              </span>
            </p>

            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 rounded-full font-bold text-black transition-all hover:opacity-90"
              style={{ background: 'var(--primary-neon)' }}
            >
              {t('protectedRoute.back')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

export function useRoleAccess(allowedRoles: UserRole[]): boolean {
  const { hasRole } = useAuth();
  return hasRole(allowedRoles);
}