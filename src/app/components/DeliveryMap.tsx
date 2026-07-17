// src/app/components/DeliveryMap.tsx
// ═══════════════════════════════════════════════════════════════
// Tracking com MAPA REAL — Leaflet + OpenStreetMap (tiles CARTO dark)
// Grátis, sem API key, sem billing.
//
// O que mudou vs. a versão anterior: o "mapa" simulado em SVG virou
// um Leaflet de verdade centrado na Vila Mariana, com o entregador
// animado ao longo de uma rota. Os cards de overlay (chegada estimada,
// cliente, progresso) e todo o i18n (namespace deliveryMap) ficaram
// exatamente como estavam.
//
// DEMO: a rota é fixa (restaurante → cliente na Vila Mariana) e o
// progresso é simulado. Na trilha SaaS, a posição real do entregador
// viria do Supabase Realtime e só o setLatLng muda.
// ═══════════════════════════════════════════════════════════════
import { motion } from 'motion/react';
import { MapPin, Navigation, Clock, Package, User, Phone, CheckCircle } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DeliveryMapProps {
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  estimatedTime: string;
  status: 'preparing' | 'on-route' | 'arriving' | 'delivered';
}

// ── Rota demo: Mikrokosmos Vila Mariana → cliente (sentido Paraíso) ──
const RESTAURANT: [number, number] = [-23.5896, -46.6347];
const ROUTE: [number, number][] = [
  RESTAURANT,
  [-23.5878, -46.6358],
  [-23.5859, -46.6371],
  [-23.5842, -46.6389],
  [-23.5824, -46.6404],
  [-23.5806, -46.6421],
  [-23.5788, -46.6438],
  [-23.5766, -46.6459],
];
const CUSTOMER: [number, number] = ROUTE[ROUTE.length - 1];

// Ponto interpolado ao longo da rota para uma fração 0..1 do caminho total
function pointAlongRoute(route: [number, number][], fraction: number): [number, number] {
  if (fraction <= 0) return route[0];
  if (fraction >= 1) return route[route.length - 1];

  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const d = Math.hypot(route[i + 1][0] - route[i][0], route[i + 1][1] - route[i][1]);
    segLens.push(d);
    total += d;
  }

  let target = fraction * total;
  for (let i = 0; i < segLens.length; i++) {
    if (target <= segLens[i]) {
      const f = segLens[i] === 0 ? 0 : target / segLens[i];
      return [
        route[i][0] + (route[i + 1][0] - route[i][0]) * f,
        route[i][1] + (route[i + 1][1] - route[i][1]) * f,
      ];
    }
    target -= segLens[i];
  }
  return route[route.length - 1];
}

// Trecho já percorrido (pontos passados + posição atual) para a linha sólida
function traveledPath(route: [number, number][], fraction: number): [number, number][] {
  if (fraction <= 0) return [route[0]];
  if (fraction >= 1) return route;

  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const d = Math.hypot(route[i + 1][0] - route[i][0], route[i + 1][1] - route[i][1]);
    segLens.push(d);
    total += d;
  }

  const pts: [number, number][] = [route[0]];
  let target = fraction * total;
  for (let i = 0; i < segLens.length; i++) {
    if (target <= segLens[i]) {
      const f = segLens[i] === 0 ? 0 : target / segLens[i];
      pts.push([
        route[i][0] + (route[i + 1][0] - route[i][0]) * f,
        route[i][1] + (route[i + 1][1] - route[i][1]) * f,
      ]);
      return pts;
    }
    pts.push(route[i + 1]);
    target -= segLens[i];
  }
  return pts;
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
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const traveledLineRef = useRef<L.Polyline | null>(null);

  // Simulate delivery progress (igual à versão anterior)
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

  // ── Inicialização do mapa (uma vez) ──
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;

    // Atribuição obrigatória (OSM + CARTO), discreta no topo direito
    L.control
      .attribution({ position: 'topright', prefix: false })
      .addAttribution('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>')
      .addTo(map);

    // Tiles dark (grátis) — combinam com o visual neon do app
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Rota completa (tracejada, apagada)
    L.polyline(ROUTE, {
      color: primaryColor,
      weight: 3,
      opacity: 0.35,
      dashArray: '6 10',
    }).addTo(map);

    // Trecho percorrido (sólido, neon) — atualizado conforme o progresso
    traveledLineRef.current = L.polyline([ROUTE[0]], {
      color: primaryColor,
      weight: 4,
      opacity: 0.9,
    }).addTo(map);

    // Marcadores em divIcon com emoji — sem o bug clássico dos ícones
    // default do Leaflet em bundlers, e com a cara do Mikrokosmos
    const mkIcon = (emoji: string, pulse = false) =>
      L.divIcon({
        className: '',
        html: `<div class="mk-marker${pulse ? ' mk-pulse' : ''}" style="border-color:${primaryColor};box-shadow:0 0 18px ${primaryColor}90;">${emoji}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

    L.marker(RESTAURANT, { icon: mkIcon('🏪') })
      .addTo(map)
      .bindPopup('<b>MIKROKOSMOS</b><br/>Vila Mariana');

    L.marker(CUSTOMER, { icon: mkIcon('📍') })
      .addTo(map)
      .bindPopup(`<b>${customerName}</b><br/>${customerAddress}`);

    driverMarkerRef.current = L.marker(ROUTE[0], {
      icon: mkIcon('🛵', true),
      zIndexOffset: 1000,
    }).addTo(map);

    // Enquadra a rota com folga pros cards de overlay (embaixo tem 2 cards)
    map.fitBounds(L.latLngBounds(ROUTE), {
      paddingTopLeft: [60, 110],
      paddingBottomRight: [60, 280],
    });

    return () => {
      map.remove();
      mapRef.current = null;
      driverMarkerRef.current = null;
      traveledLineRef.current = null;
    };
    // primaryColor propositalmente fora das deps: o mapa é criado uma vez
    // com a cor do universo ativo no momento da abertura do tracking.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Anima o entregador e a linha percorrida conforme o progresso ──
  useEffect(() => {
    const fraction = progress / 100;
    if (driverMarkerRef.current) {
      driverMarkerRef.current.setLatLng(pointAlongRoute(ROUTE, fraction));
    }
    if (traveledLineRef.current) {
      traveledLineRef.current.setLatLngs(traveledPath(ROUTE, fraction));
    }
  }, [progress]);

  // Delivery steps — labels e tempos traduzidos (igual à versão anterior)
  const deliverySteps = [
    { icon: Package, label: t('deliveryMap.stepConfirmed'), time: t('deliveryMap.minAgo', { count: 2 }) },
    { icon: Navigation, label: t('deliveryMap.stepOutForDelivery'), time: t('deliveryMap.minAgo', { count: 5 }) },
    { icon: MapPin, label: t('deliveryMap.stepNearDestination'), time: t('deliveryMap.inProgress') },
    { icon: CheckCircle, label: t('deliveryMap.stepDelivered'), time: t('deliveryMap.pending') },
  ];

  return (
    <div className="relative w-full h-full">
      {/* Estilos dos marcadores (emoji + glow + pulso do entregador) */}
      <style>{`
        .mk-marker {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; border-radius: 9999px;
          background: rgba(0, 0, 0, 0.85);
          border: 2px solid currentColor;
        }
        .mk-pulse { animation: mkPulse 1.2s ease-in-out infinite; }
        @keyframes mkPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        .leaflet-container { background: #0a0a0f; font-family: inherit; }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: rgba(0, 0, 0, 0.9); color: #fff;
        }
        .leaflet-control-attribution {
          background: rgba(0, 0, 0, 0.6) !important;
          color: rgba(255, 255, 255, 0.5) !important;
          font-size: 10px;
        }
        .leaflet-control-attribution a { color: rgba(255, 255, 255, 0.7) !important; }
      `}</style>

      {/* Mapa real — o z-0 cria um stacking context que "prende" os
          z-indexes internos do Leaflet, então o overlay z-10 fica por cima */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* Overlay UI Elements */}
      <div className="absolute inset-0 pointer-events-none z-10">
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
                <p className="text-white/60 text-xs uppercase tracking-wider">{t('deliveryMap.estimatedArrival')}</p>
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
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{t('deliveryMap.customer')}</p>
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
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{t('deliveryMap.orderId')}</p>
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
              <p className="text-white/60 text-xs uppercase tracking-wider mb-4">{t('deliveryMap.progressTitle')}</p>

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
      </div>
    </div>
  );
}