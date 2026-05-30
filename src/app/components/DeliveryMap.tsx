import { motion } from 'motion/react';
import { MapPin, Navigation, Clock, Package, User, Phone, CheckCircle } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import { MapEffects } from './MapEffects';
import { useState, useEffect } from 'react';

interface DeliveryMapProps {
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  estimatedTime: string;
  status: 'preparing' | 'on-route' | 'arriving' | 'delivered';
}

export function DeliveryMap({
  orderId,
  customerName,
  customerAddress,
  customerPhone,
  estimatedTime,
  status,
}: DeliveryMapProps) {
  const { primaryColor } = useUniverse();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate delivery progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 0.5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Update current step based on progress
  useEffect(() => {
    if (progress < 25) setCurrentStep(0);
    else if (progress < 50) setCurrentStep(1);
    else if (progress < 75) setCurrentStep(2);
    else setCurrentStep(3);
  }, [progress]);

  // Route waypoints for animation
  const routePath = `M 20 80 Q 30 70, 40 65 T 60 50 T 80 30`;

  // Delivery steps
  const deliverySteps = [
    { icon: Package, label: 'Order Confirmed', time: '2 min ago' },
    { icon: Navigation, label: 'Out for Delivery', time: '5 min ago' },
    { icon: MapPin, label: 'Near Destination', time: 'In progress' },
    { icon: CheckCircle, label: 'Delivered', time: 'Pending' },
  ];

  return (
    <div className="relative w-full h-full">
      {/* Dark Mode Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">

        {/* Cyberpunk Visual Effects */}
        <MapEffects primaryColor={primaryColor} />
        {/* Grid overlay for map feel */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(${primaryColor}30 1px, transparent 1px),
              linear-gradient(90deg, ${primaryColor}30 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Simulated map streets */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Street lines */}
          <line x1="10%" y1="30%" x2="90%" y2="30%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <line x1="10%" y1="60%" x2="90%" y2="60%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <line x1="30%" y1="10%" x2="30%" y2="90%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <line x1="70%" y1="10%" x2="70%" y2="90%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

          {/* Diagonal streets */}
          <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0%" y1="100%" x2="100%" y2="0%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </svg>

        {/* Neon Delivery Route */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
              <stop offset="50%" stopColor={primaryColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.3" />
            </linearGradient>

            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background route (glow) */}
          <motion.path
            d={routePath}
            fill="none"
            stroke={primaryColor}
            strokeWidth="1"
            strokeOpacity="0.3"
            filter="url(#neonGlow)"
            strokeDasharray="2 4"
          />

          {/* Main route line */}
          <motion.path
            d={routePath}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="0.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Animated route progress */}
          <motion.path
            d={routePath}
            fill="none"
            stroke={primaryColor}
            strokeWidth="0.8"
            strokeLinecap="round"
            filter="url(#neonGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 0.3 }}
          />

          {/* Start point (Restaurant) */}
          <g>
            <motion.circle
              cx="20"
              cy="80"
              r="2"
              fill={primaryColor}
              opacity="0.3"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle cx="20" cy="80" r="1.2" fill={primaryColor} />
          </g>

          {/* End point (Customer) */}
          <g>
            <motion.circle
              cx="80"
              cy="30"
              r="2"
              fill={primaryColor}
              opacity="0.3"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <circle cx="80" cy="30" r="1.2" fill={primaryColor} />
          </g>
        </svg>

        {/* Animated Motorcycle Icon */}
        <motion.div
          className="absolute"
          initial={{ offsetDistance: "0%", rotate: 45 }}
          animate={{
            offsetDistance: `${progress}%`,
            rotate: progress < 25 ? 45 : progress < 50 ? 30 : progress < 75 ? 15 : 0,
          }}
          transition={{ duration: 0.3, ease: "linear" }}
          style={{
            offsetPath: `path("${routePath}")`,
            offsetRotate: "0deg",
          }}
        >
          <motion.div
            className="relative"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-full blur-lg"
              style={{
                backgroundColor: primaryColor,
                opacity: 0.4,
                transform: 'scale(2)',
              }}
            />

            {/* Motorcycle icon */}
            <div
              className="relative w-8 h-8 rounded-full flex items-center justify-center border-2"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: primaryColor,
                boxShadow: `0 0 20px ${primaryColor}80`,
              }}
            >
              <Navigation
                className="w-4 h-4"
                style={{ color: primaryColor }}
                fill={primaryColor}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Pulsing location markers */}
        <div className="absolute" style={{ left: '20%', top: '80%' }}>
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: `2px solid ${primaryColor}`,
              boxShadow: `0 0 30px ${primaryColor}60`,
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Package className="w-6 h-6" style={{ color: primaryColor }} />
          </motion.div>
        </div>

        <div className="absolute" style={{ left: '80%', top: '30%' }}>
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: `2px solid ${primaryColor}`,
              boxShadow: `0 0 30px ${primaryColor}60`,
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <MapPin className="w-6 h-6" style={{ color: primaryColor }} />
          </motion.div>
        </div>
      </div>

      {/* Overlay UI Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Info Card - Estimated Delivery Time */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto"
        >
          <div
            className="px-8 py-4 rounded-2xl backdrop-blur-2xl border-2"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              borderColor: `${primaryColor}60`,
              boxShadow: `0 10px 40px ${primaryColor}30, inset 0 0 20px ${primaryColor}10`,
            }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-6 h-6" style={{ color: primaryColor }} />
              </motion.div>

              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Estimated Arrival</p>
                <p className="text-white text-2xl font-bold" style={{ color: primaryColor }}>
                  {estimatedTime}
                </p>
              </div>

              <div className="ml-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <p className="text-white text-xs font-bold uppercase tracking-wider">
                  {Math.round(progress)}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Info Cards */}
        <div className="absolute bottom-6 left-6 right-6 pointer-events-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Info Card */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="rounded-2xl backdrop-blur-2xl border p-6"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${primaryColor}20`,
                    border: `2px solid ${primaryColor}40`,
                  }}
                >
                  <User className="w-6 h-6" style={{ color: primaryColor }} />
                </div>

                <div className="flex-1">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Customer</p>
                  <p className="text-white font-bold text-lg mb-1">{customerName}</p>
                  <p className="text-white/70 text-sm">{customerAddress}</p>

                  {customerPhone && (
                    <div className="flex items-center gap-2 mt-3 text-white/80">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Order ID</p>
                <p className="text-white font-mono text-sm">#{orderId}</p>
              </div>
            </motion.div>

            {/* Delivery Progress Card */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="rounded-2xl backdrop-blur-2xl border p-6"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              }}
            >
              <p className="text-white/60 text-xs uppercase tracking-wider mb-4">Delivery Progress</p>

              <div className="space-y-4">
                {deliverySteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div key={index} className="flex items-center gap-4">
                      <motion.div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                        style={{
                          backgroundColor: isActive ? `${primaryColor}20` : 'rgba(255, 255, 255, 0.05)',
                          borderColor: isActive ? primaryColor : 'rgba(255, 255, 255, 0.2)',
                          boxShadow: isCurrent ? `0 0 20px ${primaryColor}60` : 'none',
                        }}
                        animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: isActive ? primaryColor : 'rgba(255, 255, 255, 0.3)' }}
                        />
                      </motion.div>

                      <div className="flex-1">
                        <p
                          className="text-sm font-medium"
                          style={{ color: isActive ? 'white' : 'rgba(255, 255, 255, 0.4)' }}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-white/50">{step.time}</p>
                      </div>

                      {isActive && index < deliverySteps.length - 1 && (
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: primaryColor }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Glowing tracking indicators */}
        <motion.div
          className="absolute top-1/4 right-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 0 20px ${primaryColor}`,
            }}
          />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 0 20px ${primaryColor}`,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
