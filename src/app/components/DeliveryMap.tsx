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
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DeliveryMapMatrix } from './DeliveryMapMatrix';
import { toast } from 'sonner';

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

// ── Geocoding do endereço real do cliente ──
// LIÇÃO APRENDIDA: buscar CEP direto no Nominatim falha no Brasil
// (cobertura de CEPs no OSM é fraca — devolvia bairro errado).
// Agora o ViaCEP (o mesmo do checkout) traduz CEP → nome da rua,
// e o Nominatim geocodifica a RUA pelo nome, que ele acha certinho.
// Cadeia: CEP→ViaCEP→rua estruturada → rua+bairro texto → endereço
// limpo → ponto fixo. Nada quebra se algum serviço falhar.
async function resolveCustomerLatLng(address: string): Promise<[number, number]> {
  const cep = address.match(/\d{5}-?\d{3}/)?.[0]?.replace('-', '');
  const numero = address.match(/n[ºo°]?\s*(\d+)/i)?.[1];

  const nominatim = async (params: Record<string, string>): Promise<[number, number] | null> => {
    const qs = new URLSearchParams({ format: 'json', limit: '1', countrycodes: 'br', ...params });
    const r = await fetch(`https://nominatim.openstreetmap.org/search?${qs}`);
    const d = await r.json();
    return d?.[0] ? [parseFloat(d[0].lat), parseFloat(d[0].lon)] : null;
  };

  try {
    if (cep) {
      const v = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(r => r.json());
      if (v && !v.erro && v.logradouro) {
        // 1º: busca estruturada — rua (com número, se tiver) + cidade + UF
        const street = numero ? `${numero} ${v.logradouro}` : v.logradouro;
        const hit = await nominatim({ street, city: v.localidade || 'São Paulo', state: v.uf || 'SP', country: 'Brazil' });
        if (hit) return hit;

        // 2º: texto livre com rua + bairro + cidade
        const q = [v.logradouro, v.bairro, v.localidade, v.uf].filter(Boolean).join(', ');
        const hit2 = await nominatim({ q });
        if (hit2) return hit2;
      }
    }

    // 3º: endereço digitado, limpo de apto/bloco/CEP (Nominatim engasga com eles)
    const clean = address
      .replace(/CEP:?\s*\d{5}-?\d{3}/gi, '')
      .replace(/\b(apt\.?|apto\.?|apartamento|bloco|bl\.?)\s*\S+/gi, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/(,\s*)+/g, ', ')
      .trim();
    const hit3 = await nominatim({ q: clean });
    if (hit3) return hit3;
  } catch {}
  return FALLBACK_CUSTOMER;
}

// ── Rotas pelas RUAS de verdade (OSRM, servidor público, grátis) ──
// alternatives=3 pede até 3 caminhos diferentes; cada um vem com
// distância e duração. O entregador/admin escolhe; o cliente só vê
// a rota selecionada.
export interface RouteOption {
  coords: [number, number][];
  distanceKm: number;
  durationMin: number;
}

async function fetchStreetRoutes(
  from: [number, number],
  to: [number, number]
): Promise<RouteOption[]> {
  try {
    const r = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson&alternatives=3`
    );
    const d = await r.json();
    if (d?.routes?.length) {
      return d.routes.map((rt: any) => ({
        coords: rt.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]),
        distanceKm: rt.distance / 1000,
        durationMin: Math.max(1, Math.round(rt.duration / 60)),
      }));
    }
  } catch {}
  return [{ coords: [from, to], distanceKm: 0, durationMin: 0 }]; // fallback: linha reta
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

// ── GPS REAL DO ENTREGADOR ──
// Distância aproximada em metros entre dois pontos lat/lng — suficiente
// pra decidir "andou o bastante pra valer um update no banco?".
function distMeters(a: [number, number], b: [number, number]): number {
  const dLat = (b[0] - a[0]) * 111320;
  const dLng = (b[1] - a[1]) * 111320 * Math.cos((a[0] * Math.PI) / 180);
  return Math.hypot(dLat, dLng);
}

// Projeta um ponto GPS na rota e devolve a fração 0..1 já percorrida.
// É o truque que faz TUDO continuar funcionando com posição real:
// barra de progresso, passos da entrega e ETA seguem alimentados por
// "progress" — só que agora ele vem do GPS em vez da simulação.
function nearestFractionOnRoute(route: [number, number][], p: [number, number]): number {
  if (route.length < 2) return 0;
  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const d = Math.hypot(route[i + 1][0] - route[i][0], route[i + 1][1] - route[i][1]);
    segLens.push(d);
    total += d;
  }
  if (total === 0) return 0;

  let best = Infinity;
  let bestAlong = 0;
  let acc = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const [ax, ay] = route[i];
    const [bx, by] = route[i + 1];
    const vx = bx - ax, vy = by - ay;
    const len2 = vx * vx + vy * vy;
    const tt = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - ax) * vx + (p[1] - ay) * vy) / len2));
    const px = ax + vx * tt, py = ay + vy * tt;
    const d = Math.hypot(p[0] - px, p[1] - py);
    if (d < best) {
      best = d;
      bestAlong = acc + segLens[i] * tt;
    }
    acc += segLens[i];
  }
  return Math.min(1, bestAlong / total);
}

export function DeliveryMap(props: DeliveryMapProps) {
  const { orderId, customerName, customerAddress, customerPhone, estimatedTime } = props;
  const { primaryColor } = useUniverse();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { orders, updateOrderRoute, updateCourierPosition } = useOrders();

  // O pedido vivo, vindo do Supabase — o Realtime mantém ele fresco,
  // então a rota escolhida pelo entregador chega aqui sozinha.
  const order = orders.find(o => o.id === orderId);
  const remoteRoute = order?.selected_route ?? 0;

  // Só quem entrega (ou o admin) vê e escolhe rotas alternativas.
  // O cliente enxerga apenas a rota selecionada.
  const canChooseRoute = user?.role === 'delivery' || user?.role === 'admin';

  // ── GPS REAL: a posição vive no pedido; o Realtime a traz até aqui ──
  const courierPos: [number, number] | null =
    order?.courier_lat != null && order?.courier_lng != null
      ? [order.courier_lat, order.courier_lng]
      : null;

  // Relógio de 15s só pra reavaliar o frescor (GPS parado expira sozinho)
  const [, setGpsTick] = useState(0);
  useEffect(() => {
    if (!courierPos) return;
    const iv = setInterval(() => setGpsTick(v => v + 1), 15000);
    return () => clearInterval(iv);
  }, [courierPos !== null]);

  // "Ao vivo" = última posição tem menos de 2 minutos.
  // Sem GPS fresco, o mapa cai de volta na simulação — a demo nunca quebra.
  const liveGps = !!(
    courierPos &&
    order?.courier_updated_at &&
    Date.now() - new Date(order.courier_updated_at).getTime() < 120000
  );

  // Badge do transmissor (só no aparelho do entregador)
  const [gpsSending, setGpsSending] = useState(false);

  // O cliente decide: cards de detalhes OU mapa em tela cheia.
  // No celular começa recolhido — o mapa aparece primeiro.
  const [showInfo, setShowInfo] = useState(() =>
    typeof window === 'undefined' ? true : window.innerWidth >= 768
  );

  // 🗺️ real ↔ 💊 matrix
  const [viewMode, setViewMode] = useState<'real' | 'matrix'>('real');

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [routes, setRoutes] = useState<RouteOption[] | null>(null);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const route = routes ? routes[selectedRoute]?.coords ?? null : null;

  // ── SYNC: a escolha de rota vive no pedido (coluna selected_route).
  // Quando o entregador troca, o Realtime atualiza orders → este efeito
  // roda → o mapa do cliente redesenha sozinho. ──
  useEffect(() => {
    if (!routes) return;
    setSelectedRoute(Math.min(remoteRoute, routes.length - 1));
  }, [remoteRoute, routes]);

  // Escolher rota: atualiza a tela na hora (otimista) e persiste no
  // pedido — o banco espalha pra todos os dispositivos via Realtime.
  const chooseRoute = (idx: number) => {
    setSelectedRoute(idx);
    if (order) updateOrderRoute(order.id, idx);
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const traveledLineRef = useRef<L.Polyline | null>(null);
  const routeLayersRef = useRef<L.LayerGroup | null>(null);

  // Simulação de progresso — SÓ enquanto não há GPS real.
  // Quando o entregador começa a transmitir, este efeito se desliga
  // (cleanup limpa o interval) e o progresso passa a vir do GPS.
  useEffect(() => {
    if (liveGps) return;
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
  }, [liveGps]);

  // ── GPS real → progresso: projeta a posição do entregador na rota
  // escolhida. Barra, passos e ETA seguem funcionando sem mudar nada. ──
  useEffect(() => {
    if (!liveGps || !courierPos || !route) return;
    setProgress(nearestFractionOnRoute(route, courierPos) * 100);
  }, [liveGps, order?.courier_lat, order?.courier_lng, route]);

  // ── TRANSMISSOR: o celular do ENTREGADOR envia o GPS ──
  // Só o papel 'delivery' transmite (admin vê o mapa, mas não sobrescreve
  // a posição de quem está na rua). Throttle: ≥4s entre envios E ≥8m de
  // deslocamento — poupa o banco e a bateria. Permissão negada? Sem drama:
  // o badge apaga e a simulação continua.
  useEffect(() => {
    if (user?.role !== 'delivery' || !order || !('geolocation' in navigator)) return;
    let lastSent = 0;
    let lastPos: [number, number] | null = null;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const here: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        const now = Date.now();
        const moved = !lastPos || distMeters(here, lastPos) >= 8;
        if (now - lastSent >= 4000 && moved) {
          lastSent = now;
          lastPos = here;
          setGpsSending(true);
          updateCourierPosition(order.id, here[0], here[1]);
        }
      },
      () => setGpsSending(false),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, order?.id]);

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
      const opts = await fetchStreetRoutes(RESTAURANT, customer);
      if (!cancelado) {
        setRoutes(opts);
        setSelectedRoute(0);
      }
    })();
    return () => { cancelado = true; };
  }, [customerAddress]);

  // ── Inicialização do mapa real (só no modo real, após as rotas chegarem) ──
  useEffect(() => {
    if (viewMode !== 'real' || !routes || !mapContainerRef.current || mapRef.current) return;

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

    const dest = routes[0].coords[routes[0].coords.length - 1];
    L.marker(dest, { icon: mkIcon('📍') })
      .addTo(map)
      .bindPopup(`<b>${customerName}</b><br/>${customerAddress}`);

    driverMarkerRef.current = L.marker(routes[0].coords[0], {
      icon: mkIcon('🛵', true),
      zIndexOffset: 1000,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      driverMarkerRef.current = null;
      traveledLineRef.current = null;
      routeLayersRef.current = null;
    };
    // primaryColor fora das deps de propósito: mapa criado com a cor
    // do universo ativo no momento da abertura/troca de modo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, routes]);

  // ── Desenha/redesenha as rotas quando a seleção muda ──
  useEffect(() => {
    const map = mapRef.current;
    if (viewMode !== 'real' || !map || !routes) return;

    // limpa as camadas de rota anteriores (marcadores ficam)
    routeLayersRef.current?.remove();
    const group = L.layerGroup().addTo(map);
    routeLayersRef.current = group;

    // Alternativas apagadas — só pra quem pode escolher; clicáveis
    if (canChooseRoute) {
      routes.forEach((opt, idx) => {
        if (idx === selectedRoute) return;
        L.polyline(opt.coords, {
          color: primaryColor,
          weight: 3,
          opacity: 0.18,
          dashArray: '2 8',
        })
          .on('click', () => chooseRoute(idx))
          .addTo(group);
      });
    }

    const sel = routes[selectedRoute];

    // Rota selecionada (tracejada, apagada)
    L.polyline(sel.coords, {
      color: primaryColor,
      weight: 3,
      opacity: 0.35,
      dashArray: '6 10',
    }).addTo(group);

    // Trecho percorrido (sólido, neon)
    traveledLineRef.current = L.polyline(traveledPath(sel.coords, progress / 100), {
      color: primaryColor,
      weight: 4,
      opacity: 0.9,
    }).addTo(group);

    map.fitBounds(L.latLngBounds(sel.coords), {
      paddingTopLeft: [60, 110],
      paddingBottomRight: [60, 280],
    });
    // progress fora das deps de propósito (o efeito abaixo cuida da animação)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, routes, selectedRoute, canChooseRoute]);

  // ── Anima o entregador e a linha percorrida ──
  // Com GPS ao vivo, o marcador fica na posição REAL (mesmo fora da rota);
  // a linha percorrida usa a projeção na rota (via progress).
  useEffect(() => {
    if (viewMode !== 'real' || !route) return;
    const fraction = progress / 100;
    if (driverMarkerRef.current) {
      driverMarkerRef.current.setLatLng(
        liveGps && courierPos ? courierPos : pointAlongRoute(route, fraction)
      );
    }
    if (traveledLineRef.current) {
      traveledLineRef.current.setLatLngs(traveledPath(route, fraction));
    }
  }, [progress, viewMode, route, selectedRoute, liveGps, order?.courier_lat, order?.courier_lng]);

  // ── ETA real: duração da rota selecionada (OSRM), decrescendo com o
  // progresso. Fallback: a prop estimatedTime (quando a rota ainda não
  // chegou ou o OSRM caiu no fallback de linha reta, sem duração).
  const selectedOption = routes?.[selectedRoute];
  const remainingMin = selectedOption && selectedOption.durationMin > 0
    ? Math.max(1, Math.round(selectedOption.durationMin * (1 - progress / 100)))
    : null;
  const etaLabel = remainingMin !== null
    ? t('deliveryMap.minutes', { count: remainingMin })
    : estimatedTime;

  // ── 🎉 CHEGADA: progresso ≥ 99% OU GPS real a menos de 60 m do
  // destino. Vira banner no lugar do ETA + toast (avisado uma vez só)
  // — o cliente nunca mais olha o mapa sem saber que o entregador
  // já está na porta. ──
  const destino = route ? route[route.length - 1] : null;
  const arrived =
    progress >= 99 ||
    !!(liveGps && courierPos && destino && distMeters(courierPos, destino) < 60);
  const arrivedNotifiedRef = useRef(false);
  useEffect(() => {
    if (arrived && !arrivedNotifiedRef.current) {
      arrivedNotifiedRef.current = true;
      toast.success(t('deliveryMap.arrived'), { duration: 6000 });
    }
  }, [arrived, t]);
  const etaDisplay = arrived ? t('deliveryMap.arrived') : etaLabel;

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
        <DeliveryMapMatrix {...props} estimatedTime={etaDisplay} externalProgress={progress} />
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

        {/* Seletor de rotas alternativas — SÓ pra delivery/admin.
            O cliente nunca vê este painel, só a rota escolhida. */}
        {canChooseRoute && routes && routes.length > 1 && (
          <div className="absolute top-20 left-6 pointer-events-auto rounded-xl border overflow-hidden"
            style={{ borderColor: `${primaryColor}50`, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
            <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider text-white/50">
              {t('deliveryMap.routesTitle')}
            </p>
            {routes.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => chooseRoute(idx)}
                className="flex items-center gap-3 w-full px-3 py-2 text-left text-xs transition-all"
                style={selectedRoute === idx
                  ? { backgroundColor: `${primaryColor}25`, color: '#fff' }
                  : { color: 'rgba(255,255,255,0.55)' }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedRoute === idx ? primaryColor : 'rgba(255,255,255,0.25)' }} />
                <span className="font-bold">{t('deliveryMap.routeLabel', { n: idx + 1 })}</span>
                {opt.distanceKm > 0 && (
                  <span className="ml-auto font-mono text-[11px] text-white/60">
                    {opt.distanceKm.toFixed(1)} km · {opt.durationMin} min
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

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
                  {etaDisplay}
                </p>
              </div>

              <div className="ml-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <p className="text-white text-xs font-bold uppercase tracking-wider">
                  {Math.round(progress)}%
                </p>
              </div>

              {/* 📡 GPS ao vivo — todo mundo vê quando o entregador transmite */}
              {liveGps && (
                <div className="px-3 py-1 rounded-full border"
                  style={{ backgroundColor: 'rgba(74,222,128,0.15)', borderColor: 'rgba(74,222,128,0.5)' }}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#4ade80' }}>
                    📡 {t('deliveryMap.liveGps')}
                  </p>
                </div>
              )}

              {/* Transmitindo — só no aparelho do próprio entregador */}
              {gpsSending && !liveGps && (
                <div className="px-3 py-1 rounded-full bg-white/10">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider">
                    📡 {t('deliveryMap.gpsSending')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bottom Info Cards — o cliente escolhe: detalhes ou mapa livre */}
        <div className="absolute bottom-6 left-6 right-6 pointer-events-auto">
          <div className="flex justify-center mb-3">
            <button
              onClick={() => setShowInfo(v => !v)}
              className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-xl transition-all hover:scale-105"
              style={{ backgroundColor: 'rgba(0,0,0,0.75)', borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}
            >
              {showInfo ? `▾ ${t('deliveryMap.hideInfo')}` : `▴ ${t('deliveryMap.showInfo')}`}
            </button>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${showInfo ? '' : 'hidden'}`}>
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