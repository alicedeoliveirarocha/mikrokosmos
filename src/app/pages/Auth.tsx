import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Sparkles, Mail, Lock, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, senha);
        if (success) {
          toast.success('Login realizado com sucesso!');
          navigate('/home');
        } else {
          toast.error('Email ou senha incorretos');
        }
      } else {
        if (!nome.trim()) {
          toast.error('Por favor, preencha seu nome');
          setLoading(false);
          return;
        }
        const success = await register(nome, email, senha);
        if (success) {
          toast.success('Conta criada com sucesso!');
          navigate('/home');
        } else {
          toast.error('Email já cadastrado');
        }
      }
    } catch (error) {
      toast.error('Erro ao processar requisição');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    toast.success('Navegando como visitante');
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{ 
              background: `linear-gradient(135deg, var(--gradient-from), var(--gradient-to))`,
              boxShadow: '0 10px 40px rgba(0, 255, 255, 0.3)'
            }}
          >
            <Sparkles className="w-10 h-10 text-black" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white neon-text tracking-[0.3em] mb-2">
            MIKROKOSMOS
          </h1>
          <p className="text-white/60 text-sm">Themed-Sync K-pop Digital Menu</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                isLogin
                  ? 'text-black'
                  : 'text-white/60 bg-white/5'
              }`}
              style={isLogin ? { backgroundColor: 'var(--primary-neon)' } : {}}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                !isLogin
                  ? 'text-black'
                  : 'text-white/60 bg-white/5'
              }`}
              style={!isLogin ? { backgroundColor: 'var(--primary-neon)' } : {}}
            >
              Registrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-white/80 text-sm mb-2">Nome</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
                    placeholder="Seu nome"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white/80 text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-black transition-all disabled:opacity-50"
              style={{ 
                backgroundColor: 'var(--primary-neon)',
                boxShadow: '0 10px 30px rgba(0, 255, 255, 0.3)'
              }}
            >
              {loading ? 'Processando...' : isLogin ? (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Entrar
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Criar Conta
                </span>
              )}
            </motion.button>
          </form>

          {/* Divisor */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-sm">OU</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Botão Visitante */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGuestAccess}
            className="w-full py-4 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            Continuar como Visitante
          </motion.button>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Sistema educacional • Projeto acadêmico
        </p>
      </motion.div>
    </div>
  );
}
