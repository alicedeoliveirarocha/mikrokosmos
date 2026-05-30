import { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { UserCircle, ChefHat, Bike, Shield, X } from 'lucide-react';
import { toast } from 'sonner';
import { getCustomResponse } from '../utils/customResponses';

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || user.role !== 'admin') return null;

  const roles: { value: UserRole; label: string; icon: any; color: string }[] = [
    { 
      value: 'cliente', 
      label: 'Cliente', 
      icon: UserCircle, 
      color: '#00FFFF' 
    },
    { 
      value: 'cozinha', 
      label: 'Cozinha', 
      icon: ChefHat, 
      color: '#FF6B35' 
    },
    { 
      value: 'delivery', 
      label: 'Delivery', 
      icon: Bike, 
      color: '#FFD700' 
    },
    { 
      value: 'admin', 
      label: 'Admin', 
      icon: Shield, 
      color: '#9C27B0' 
    },
  ];

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    const response = getCustomResponse(newRole, 'welcome');
    toast.success(response.title, {
      description: response.message,
    });
    setIsOpen(false);
  };

  const currentRole = roles.find(r => r.value === user.role);

  return (
    <>
      {/* Botão flutuante */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center gap-2 text-white hover:bg-white/20 transition-all shadow-lg"
        style={{
          boxShadow: `0 0 20px ${currentRole?.color}40`,
        }}
      >
        {currentRole && <currentRole.icon className="w-5 h-5" style={{ color: currentRole.color }} />}
        <span className="font-bold text-sm">{currentRole?.label}</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mx-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Trocar Papel</h3>
                    <p className="text-sm text-white/60 mt-1">
                      Sistema de Demonstração RBAC
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isActive = user.role === role.value;

                    return (
                      <motion.button
                        key={role.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoleChange(role.value)}
                        className={`
                          w-full p-4 rounded-xl border transition-all
                          ${isActive
                            ? 'bg-white/10 border-white/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }
                        `}
                        style={{
                          boxShadow: isActive ? `0 0 20px ${role.color}30` : 'none',
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: `${role.color}20`,
                            }}
                          >
                            <Icon className="w-6 h-6" style={{ color: role.color }} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-bold text-white">{role.label}</p>
                            <p className="text-xs text-white/60 mt-1">
                              {role.value === 'cliente' && 'Fazer pedidos e explorar o cardápio'}
                              {role.value === 'cozinha' && 'Gerenciar preparo de pedidos'}
                              {role.value === 'delivery' && 'Controlar entregas'}
                              {role.value === 'admin' && 'Acesso total ao sistema'}
                            </p>
                          </div>
                          {isActive && (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: role.color }}
                            />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-blue-300">
                    💡 <strong>Modo Demo:</strong> Este switcher permite testar diferentes níveis de acesso.
                    Em produção, os papéis são atribuídos automaticamente.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
