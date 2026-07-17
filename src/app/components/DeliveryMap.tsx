// src/app/components/DeliveryMap.tsx
// ═══════════════════════════════════════════════════════════════
// Tracking com DOIS MODOS de visualização:
//   🗺️  Mapa real  — Leaflet + OpenStreetMap (tiles CARTO dark),
//                    endereço do cliente geocodificado de verdade
//                    (Nominatim) e rota pelas RUAS reais (OSRM).
//   💊  Modo Matrix — a visualização cyberpunk original
//                    (DeliveryMapMatrix.tsx), preservada intacta.
//
// Tudo grátis, sem API key, sem billing:
//   - Tiles: CARTO dark_all (© OpenStreetMap © CARTO)
//   - Geocoding: nominatim.openstreetmap.org (1 req por tracking)
//   - Rota: router.project-osrm.org (servidor público de demo)
//
// Cadeia de fallback (nada quebra sem internet/serviço fora):
//   geocode por CEP → geocode por endereço → ponto fixo demo
//   rota OSRM pelas ruas → linha reta entre os dois pontos
// ═══════════════════════════════════════════════════════════════
import { motion } from 'motion/react';
import { MapPin, Navigation, Clock, Package, User, Phone, CheckCircle, Map as MapIcon, Sparkles } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DeliveryMapMatrix } from './DeliveryMapMatrix';

interface DeliveryMapProps {
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  estimatedTime: string;
  status: 'preparing' | 'on-route' | 'arriving' | 'delivered';
}

// Mikrokosmos — unidade Vila Mariana (origem de toda entrega)
const RESTAURANT: [number, number] = [-23.5896, -46.6347];
// Destino de emergência caso o geocoding falhe (perto da unidade)
const FALLBACK_CUSTOMER: [number, number] = [-23.5766, -46.6459];

// ── Geocoding do endereço real do cliente (Nominatim/OSM, grátis) ──
// Tenta primeiro pelo CEP (mais preciso no Brasil), depois pelo texto.
async function resolveCustomerLatLng(address: string): Promise<[number, number]> {
  const cep = address.match(/\d{5}-?\d{3}/)?.[0]?.replace('-', '');
  try {
    if (cep) {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${cep}&country=Brazil&format=json&limit=1`
      );
      const d = await r.json();
      if (d?.[0]) return [parseFloat(d[0].lat), parseFloat(d[0].lon)];
    }
    const r2 = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ', Brasil')}&format=json&limit=1`
    );
    const d2 = await r2.json();
    if (d2?.[0]) return [parseFloat(d2[0].lat), parseFloat(d2[0].lon)];
  } catch {}
  return FALLBACK_CUSTOMER;
}

// ── Rota pelas RUAS de verdade (OSRM, servidor público, grátis) ──
async function fetchStreetRoute(
  from: [number, number],
  to: [number, number]
): Promise<[number, number][]> {
  try {
    const r = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`
    );
    const d = await r.json();
    const coords: [number, number][] | undefined = d?.routes?.[0]?.geometry?.coordinates;
    if (coords?.length) return coords.map((c) => [c[1], c[0]] as [number, number]);
  } catch {}
  return [from, to]; // fallback: linha reta
}

// Ponto interpolado ao longo da rota para uma fração 0..1 do caminho total
function pointAlongRoute(route: [number, number][], fraction: number): [number, number] {
  if (fraction <= 0 || route.length < 2) return route[0];
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
  if (fraction <= 0 || route.length < 2) return [route[0]];
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

export function DeliveryMap(props: DeliveryMapProps) {
  const { orderId, customerName, customerAddress, customerPhone, estimatedTime } = props;
  const { primaryColor } = useUniverse();
  const { t } = useTranslation();

  // 🗺️ real ↔ 💊 matrix
  const [viewMode, setViewMode] = useState<'real' | 'matrix'>('real');

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [route, setRoute] = useState<[number, number][] | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const traveledLineRef = useRef<L.Polyline | null>(null);

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

  // ── Resolve endereço real → rota real (uma vez) ──
  useEffect(() => {
    let cancelado = false;
    (async () => {
      const customer = await resolveCustomerLatLng(customerAddress);
      const streets = await fetchStreetRoute(RESTAURANT, customer);
      if (!cancelado) setRoute(streets);
    })();
    return () => { cancelado = true; };
  }, [customerAddress]);

  // ── Inicialização do mapa real (só no modo real, após a rota chegar) ──
  useEffect(() => {
    if (viewMode !== 'real' || !route || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;

    L.control
      .attribution({ position: 'topright', prefix: false })
      .addAttribution('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>')
      .addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Rota completa (tracejada, apagada)
    L.polyline(route, {
      color: primaryColor,
      weight: 3,
      opacity: 0.35,
      dashArray: '6 10',
    }).addTo(map);

    // Trecho percorrido (sólido, neon)
    traveledLineRef.current = L.polyline([route[0]], {
      color: primaryColor,
      weight: 4,
      opacity: 0.9,
    }).addTo(map);

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

    L.marker(route[route.length - 1], { icon: mkIcon('📍') })
      .addTo(map)
      .bindPopup(`<b>${customerName}</b><br/>${customerAddress}`);

    driverMarkerRef.current = L.marker(pointAlongRoute(route, progress / 100), {
      icon: mkIcon('🛵', true),
      zIndexOffset: 1000,
    }).addTo(map);

    map.fitBounds(L.latLngBounds(route), {
      paddingTopLeft: [60, 110],
      paddingBottomRight: [60, 280],
    });

    return () => {
      map.remove();
      mapRef.current = null;
      driverMarkerRef.current = null;
      traveledLineRef.current = null;
    };
    // primaryColor fora das deps de propósito: mapa criado com a cor
    // do universo ativo no momento da abertura/troca de modo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, route]);

  // ── Anima o entregador e a linha percorrida ──
  useEffect(() => {
    if (viewMode !== 'real' || !route) return;
    const fraction = progress / 100;
    if (driverMarkerRef.current) {
      driverMarkerRef.current.setLatLng(pointAlongRoute(route, fraction));
    }
    if (traveledLineRef.current) {
      traveledLineRef.current.setLatLngs(traveledPath(route, fraction));
    }
  }, [progress, viewMode, route]);

  const deliverySteps = [
    { icon: Package, label: t('deliveryMap.stepConfirmed'), time: t('deliveryMap.minAgo', { count: 2 }) },
    { icon: Navigation, label: t('deliveryMap.stepOutForDelivery'), time: t('deliveryMap.minAgo', { count: 5 }) },
    { icon: MapPin, label: t('deliveryMap.stepNearDestination'), time: t('deliveryMap.inProgress') },
    { icon: CheckCircle, label: t('deliveryMap.stepDelivered'), time: t('deliveryMap.pending') },
  ];

  // Toggle 🗺️ ↔ 💊, visível nos dois modos
  const ModeToggle = () => (
    <div className="absolute top-6 left-6 z-20 pointer-events-auto flex rounded-xl overflow-hidden border"
      style={{ borderColor: `${primaryColor}50`, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
      <button
        onClick={() => setViewMode('real')}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all"
        style={viewMode === 'real'
          ? { backgroundColor: primaryColor, color: '#000' }
          : { color: 'rgba(255,255,255,0.6)' }}
      >
        <MapIcon className="w-3.5 h-3.5" /> {t('deliveryMap.viewReal')}
      </button>
      <button
        onClick={() => setViewMode('matrix')}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all"
        style={viewMode === 'matrix'
          ? { backgroundColor: primaryColor, color: '#000' }
          : { color: 'rgba(255,255,255,0.6)' }}
      >
        <Sparkles className="w-3.5 h-3.5" /> {t('deliveryMap.viewMatrix')}
      </button>
    </div>
  );

  // ── MODO MATRIX 💊 — a visualização cyberpunk original ──
  if (viewMode === 'matrix') {
    return (
      <div className="relative w-full h-full">
        <DeliveryMapMatrix {...props} />
        <ModeToggle />
      </div>
    );
  }

  // ── MODO MAPA REAL 🗺️ ──
  return (
    <div className="relative w-full h-full">
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

      {/* Loading enquanto geocodifica o endereço e busca a rota */}
      {!route && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-2 border-transparent"
            style={{ borderTopColor: primaryColor, borderRightColor: primaryColor }}
          />
        </div>
      )}

      {/* Overlay UI Elements */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <ModeToggle />

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