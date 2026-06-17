// src/app/components/MesasPanel.tsx
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Armchair, Users, Clock, RotateCcw } from 'lucide-react';

type StatusMesa = 'livre' | 'ocupada' | 'reservada';

interface Mesa {
  id: string;
  numero: string;
  capacidade: number;
  status: StatusMesa;
  ocupadaDesde?: string; // horário em que ficou ocupada
}

const STORAGE_KEY = 'mikrokosmos_mesas';

const mesasIniciais: Mesa[] = [
  { id: 'mk01', numero: 'MK-01', capacidade: 2, status: 'ocupada', ocupadaDesde: '19:30' },
  { id: 'mk02', numero: 'MK-02', capacidade: 4, status: 'livre' },
  { id: 'mk03', numero: 'MK-03', capacidade: 4, status: 'ocupada', ocupadaDesde: '20:05' },
  { id: 'mk04', numero: 'MK-04', capacidade: 2, status: 'livre' },
  { id: 'mk05', numero: 'MK-05', capacidade: 6, status: 'reservada' },
  { id: 'mk06', numero: 'MK-06', capacidade: 4, status: 'livre' },
  { id: 'mk07', numero: 'MK-07', capacidade: 2, status: 'ocupada', ocupadaDesde: '20:40' },
  { id: 'mk08', numero: 'MK-08', capacidade: 8, status: 'livre' },
];

function loadMesas(): Mesa[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return mesasIniciais;
}

function saveMesas(mesas: Mesa[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mesas));
  } catch {}
}

const STATUS_CONFIG: Record<StatusMesa, { label: string; color: string; bg: string }> = {
  livre:     { label: 'Livre',     color: '#4CAF50', bg: 'rgba(76,175,80,0.12)' },
  ocupada:   { label: 'Ocupada',   color: '#FF5722', bg: 'rgba(255,87,34,0.12)' },
  reservada: { label: 'Reservada', color: '#FF9800', bg: 'rgba(255,152,0,0.12)' },
};

// Ciclo ao clicar: livre -> ocupada -> reservada -> livre
const NEXT_STATUS: Record<StatusMesa, StatusMesa> = {
  livre: 'ocupada',
  ocupada: 'reservada',
  reservada: 'livre',
};

export function MesasPanel() {
  const [mesas, setMesas] = useState<Mesa[]>(loadMesas);

  useEffect(() => { saveMesas(mesas); }, [mesas]);

  const cycleStatus = (id: string) => {
    setMesas(prev => prev.map(m => {
      if (m.id !== id) return m;
      const novoStatus = NEXT_STATUS[m.status];
      return {
        ...m,
        status: novoStatus,
        ocupadaDesde: novoStatus === 'ocupada'
          ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          : undefined,
      };
    }));
  };

  const resetMesas = () => setMesas(mesasIniciais);

  const livres = mesas.filter(m => m.status === 'livre').length;
  const ocupadas = mesas.filter(m => m.status === 'ocupada').length;
  const reservadas = mesas.filter(m => m.status === 'reservada').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Armchair className="w-6 h-6" style={{ color: 'var(--primary-neon)' }} />
            Mesas Disponíveis
          </h2>
          <p className="text-white/60 text-sm mt-1">
            {livres} livres · {ocupadas} ocupadas · {reservadas} reservadas — clique numa mesa para mudar o status
          </p>
        </div>
        <button
          onClick={resetMesas}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" /> Resetar
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-3">
        {(['livre', 'ocupada', 'reservada'] as StatusMesa[]).map(s => (
          <div key={s} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold" style={{ color: STATUS_CONFIG[s].color }}>
              {mesas.filter(m => m.status === s).length}
            </p>
            <p className="text-white/60 text-xs mt-1">{STATUS_CONFIG[s].label}</p>
          </div>
        ))}
      </div>

      {/* Grid de mesas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mesas.map((mesa, i) => {
          const cfg = STATUS_CONFIG[mesa.status];
          return (
            <motion.button
              key={mesa.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => cycleStatus(mesa.id)}
              className="p-4 rounded-xl border text-left transition-all"
              style={{ backgroundColor: cfg.bg, borderColor: cfg.color + '60' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-lg">{mesa.numero}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: cfg.color + '25', color: cfg.color, border: `1px solid ${cfg.color}60` }}
                >
                  {cfg.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>{mesa.capacidade} lugares</span>
              </div>
              {mesa.status === 'ocupada' && mesa.ocupadaDesde && (
                <div className="flex items-center gap-1.5 text-white/40 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>desde {mesa.ocupadaDesde}</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}