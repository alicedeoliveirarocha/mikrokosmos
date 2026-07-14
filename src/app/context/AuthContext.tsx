// src/app/context/AuthContext.tsx
// FIX: switchRole agora é só VISUALIZAÇÃO (local) — nunca altera o role real no Supabase.
// - realUser = quem a pessoa É (vem do banco, nunca muda ao trocar de visão)
// - viewRole = o que a pessoa está VISUALIZANDO (só em memória + sessionStorage)
// - user exposto = realUser com o role efetivo aplicado → todos os componentes
//   existentes (Kitchen, Delivery, RoleBanner...) continuam funcionando sem mudança.
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Profile, UserRole } from '../../lib/supabase';

const VIEW_ROLE_KEY = 'mk-view-role';

interface AuthContextType {
  user: Profile | null;            // perfil com o role EFETIVO (real ou visualização)
  realRole: UserRole | null;       // o papel verdadeiro, vindo do banco
  isViewingAs: boolean;            // true quando admin está "vestindo" outro papel
  isAuthenticated: boolean;
  loading: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  register: (nome: string, email: string, senha: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (nome: string) => Promise<void>;
  switchRole: (newRole: UserRole) => void;   // agora é síncrono e 100% local
  resetViewRole: () => void;                 // volta ao papel real
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [realUser, setRealUser] = useState<Profile | null>(null);
  const [viewRole, setViewRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string, retries = 3): Promise<void> => {
    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setRealUser(data as Profile);
        restoreViewRole(data as Profile);
        setLoading(false);
        return;
      }

      // Espera 500ms antes de tentar novamente (o trigger pode estar criando o perfil)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    // Se não encontrou perfil após retries, cria um básico
    const { data: authUser } = await supabase.auth.getUser();
    if (authUser.user) {
      const basicProfile: Profile = {
        id: authUser.user.id,
        nome: authUser.user.user_metadata?.nome || authUser.user.email?.split('@')[0] || 'Usuário',
        email: authUser.user.email || '',
        role: (authUser.user.user_metadata?.role as UserRole) || 'cliente',
        created_at: new Date().toISOString(),
      };
      // Tenta inserir o perfil se não existir
      await supabase.from('profiles').upsert(basicProfile);
      setRealUser(basicProfile);
      restoreViewRole(basicProfile);
    }
    setLoading(false);
  };

  // Restaura a visualização salva — mas SÓ se o papel real for admin.
  // Isso impede que um viewRole "fantasma" fique preso para contas comuns.
  const restoreViewRole = (profile: Profile) => {
    if (profile.role !== 'admin') {
      sessionStorage.removeItem(VIEW_ROLE_KEY);
      setViewRole(null);
      return;
    }
    const saved = sessionStorage.getItem(VIEW_ROLE_KEY) as UserRole | null;
    if (saved && saved !== profile.role) {
      setViewRole(saved);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setRealUser(null);
        setViewRole(null);
        sessionStorage.removeItem(VIEW_ROLE_KEY);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Papel efetivo: o que o resto do app "enxerga" ──────────────────────────
  const effectiveRole: UserRole | null = realUser ? (viewRole ?? realUser.role) : null;
  const user: Profile | null = realUser ? { ...realUser, role: effectiveRole as UserRole } : null;
  const isViewingAs = !!realUser && !!viewRole && viewRole !== realUser.role;

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const login = async (email: string, senha: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) return { success: false, error: 'Email ou senha incorretos' };
    return { success: true };
  };

  const register = async (nome: string, email: string, senha: string, role: UserRole = 'cliente') => {
    // Tenta fazer login primeiro para ver se email já existe
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'check_only_fake_password_xyz123'
    });

    // Se o erro for "Invalid login credentials", email existe mas senha errada = já cadastrado
    if (!signInError || signInError.message.includes('Invalid login credentials')) {
      if (!signInError) {
        // Conseguiu logar com senha falsa?? Não deveria, mas faz logout
        await supabase.auth.signOut();
      }
      return { success: false, error: 'Este email já está cadastrado. Faça login!' };
    }

    // Email não existe, pode registrar
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome, role } }
    });

    if (error || !data.session) {
      return { success: false, error: 'Este email já está cadastrado. Faça login!' };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setRealUser(null);
    setViewRole(null);
    sessionStorage.removeItem(VIEW_ROLE_KEY);
  };

  const updateProfile = async (nome: string) => {
    if (!realUser) return;
    const { data } = await supabase
      .from('profiles')
      .update({ nome })
      .eq('id', realUser.id)
      .select()
      .single();
    if (data) setRealUser(data as Profile);
  };

  // ── AQUI ESTAVA O BUG ───────────────────────────────────────────────────────
  // Antes: UPDATE profiles SET role = newRole → o admin VIRAVA delivery no banco.
  // Agora: só troca a visualização local. O Supabase nunca é tocado.
  const switchRole = (newRole: UserRole) => {
    if (!realUser) return;
    if (newRole === realUser.role) {
      // Selecionou o próprio papel real → sai do modo visualização
      setViewRole(null);
      sessionStorage.removeItem(VIEW_ROLE_KEY);
      return;
    }
    setViewRole(newRole);
    sessionStorage.setItem(VIEW_ROLE_KEY, newRole);
  };

  const resetViewRole = () => {
    setViewRole(null);
    sessionStorage.removeItem(VIEW_ROLE_KEY);
  };

  return (
    <AuthContext.Provider value={{
      user,
      realRole: realUser?.role ?? null,
      isViewingAs,
      isAuthenticated: !!user,
      loading,
      hasRole,
      login,
      register,
      logout,
      updateProfile,
      switchRole,
      resetViewRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export type { UserRole };