import { motion } from 'motion/react';
import { UserRole } from '../context/AuthContext';
import { ChefHat, Bike, LineChart, User } from 'lucide-react';

interface RoleBannerProps {
  role: UserRole;
  title: string;
  description: string;
}

const roleConfig = {
  cliente: {
    icon: User,
    color: '#00FFFF',
    gradient: 'linear-gradient(135deg, #00FFFF 0%, #00FF88 100%)',
    bgPattern: 'opacity-10',
  },
  cozinha: {
    icon: ChefHat,
    color: '#FF9800',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #FFD700 100%)',
    bgPattern: 'opacity-10',
  },
  delivery: {
    icon: Bike,
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
    bgPattern: 'opacity-10',
  },
  admin: {
    icon: LineChart,
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
    bgPattern: 'opacity-10',
  },
};

export function RoleBanner({ role, title, description }: RoleBannerProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-8 p-6 rounded-3xl overflow-hidden border-2"
      style={{
        background: `linear-gradient(135deg, ${config.color}10 0%, ${config.color}05 100%)`,
        borderColor: `${config.color}40`,
        boxShadow: `0 10px 40px ${config.color}30`,
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${config.color}20 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: config.gradient,
            boxShadow: `0 8px 32px ${config.color}60`,
          }}
        >
          <Icon className="w-8 h-8 text-black" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${config.color}20`,
                color: config.color,
                border: `1px solid ${config.color}40`,
              }}
            >
              {role}
            </span>
          </div>
          <p className="text-white/70">{description}</p>
        </div>
      </div>

      {/* Access Indicator */}
      <div className="absolute top-4 right-4">
        <div
          className="w-3 h-3 rounded-full animate-pulse"
          style={{
            backgroundColor: config.color,
            boxShadow: `0 0 20px ${config.color}`,
          }}
        />
      </div>
    </motion.div>
  );
}
