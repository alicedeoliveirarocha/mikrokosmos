// src/app/context/AuthContext.tsx — versão corrigida
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Profile, UserRole } from '../../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  register: (nome: string, email: string, senha: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (nome: string) => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string, retries = 3): Promise<void> => {
    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setUser(data as Profile);
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
      setUser(basicProfile);
    }
    setLoading(false);
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
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
   const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome, role } }
    });

    if (error) {
      return { 
        success: false, 
        error: 'Este email já está cadastrado. Faça login!' 
     };
    }

    if (!data.session) {
     return { 
        success: false, 
       error: 'Este email já está cadastrado. Faça login!' 
     };
    }

    return { success: true };
  };

  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome, role } }
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
};

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (nome: string) => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .update({ nome })
      .eq('id', user.id)
      .select()
      .single();
    if (data) setUser(data as Profile);
  };

  const switchRole = async (newRole: UserRole) => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', user.id)
      .select()
      .single();
    if (data) setUser(data as Profile);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      hasRole,
      login,
      register,
      logout,
      updateProfile,
      switchRole,
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
