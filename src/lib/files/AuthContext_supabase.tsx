// src/app/context/AuthContext.tsx
// SUBSTITUI o arquivo atual — agora usa Supabase de verdade

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

  // Carrega o usuário ao iniciar e escuta mudanças de sessão
  useEffect(() => {
    // Pega sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escuta login/logout em tempo real
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

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      setUser(data as Profile);
    }
    setLoading(false);
  };

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
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome, role }
      }
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

  // Troca de role para demonstração ao professor
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
