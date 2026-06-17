// src/app/components/MesasPanel.tsx
import { useState, useEffect, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Armchair, Users, Clock, RotateCcw, Pencil, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

// Ciclo ao clicar: livre -> ocupada -> reservada -> livre
const NEXT_STATUS: Record<StatusMesa, StatusMesa> = {
  livre: 'ocupada',
  ocupada: 'reservada',
  reservada: 'livre',
};

const STATUS_COLOR: Record<StatusMesa, { color: string; bg: string }> = {
  livre:     { color: '#4CAF50', bg: 'rgba(76,175,80,0.12)' },
  ocupada:   { color: '#FF5722', bg: 'rgba(255,87,34,0.12)' },
  reservada: { color: '#FF9800', bg: 'rgba(255,152,0,0.12)' },
};

export function MesasPanel() {
  const { t } = useTranslation();
  const [mesas, setMesas] = useState<Mesa[]>(loadMesas);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editCapacidade, setEditCapacidade] = useState('');
  const [editHorario, setEditHorario] = useState('');

  useEffect(() => { saveMesas(mesas); }, [mesas]);

  const statusLabel = (s: StatusMesa) => t(`mesas.status.${s}`);

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

  const abrirEdicao = (mesa: Mesa, e: MouseEvent) => {
    e.stopPropagation();
    setEditandoId(mesa.id);
    setEditCapacidade(String(mesa.capacidade));
    setEditHorario(mesa.ocupadaDesde || '');
  };

  const salvarEdicao = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const novaCapacidade = parseInt(editCapacidade, 10);
    setMesas(prev => prev.map(m => {
      if (m.id !== id) return m;
      return {
        ...m,
        capacidade: isNaN(novaCapacidade) || novaCapacidade <= 0 ? m.capacidade : novaCapacidade,
        ocupadaDesde: m.status === 'ocupada' ? (editHorario || m.ocupadaDesde) : m.ocupadaDesde,
      };
    }));
    setEditandoId(null);
  };

  const cancelarEdicao = (e: MouseEvent) => {
    e.stopPropagation();
    setEditandoId(null);
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
            {t('mesas.title')}
          </h2>
          <p className="text-white/60 text-sm mt-1">
            {t('mesas.subtitle', { livres, ocupadas, reservadas })}
          </p>
        </div>
        <button
          onClick={resetMesas}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" /> {t('mesas.resetButton')}
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-3">
        {(['livre', 'ocupada', 'reservada'] as StatusMesa[]).map(s => (
          <div key={s} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold" style={{ color: STATUS_COLOR[s].color }}>
              {mesas.filter(m => m.status === s).length}
            </p>
            <p className="text-white/60 text-xs mt-1">{statusLabel(s)}</p>
          </div>
        ))}
      </div>

      {/* Grid de mesas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mesas.map((mesa, i) => {
          const cfg = STATUS_COLOR[mesa.status];
          const emEdicao = editandoId === mesa.id;
          return (
            <motion.div
              key={mesa.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={emEdicao ? {} : { scale: 1.03 }}
              whileTap={emEdicao ? {} : { scale: 0.97 }}
              onClick={() => !emEdicao && cycleStatus(mesa.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (!emEdicao && (e.key === 'Enter' || e.key === ' ')) cycleStatus(mesa.id); }}
              className="p-4 rounded-xl border text-left transition-all cursor-pointer"
              style={{ backgroundColor: cfg.bg, borderColor: cfg.color + '60' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-lg">{mesa.numero}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: cfg.color + '25', color: cfg.color, border: `1px solid ${cfg.color}60` }}
                  >
                    {statusLabel(mesa.status)}
                  </span>
                  {!emEdicao && (
                    <button
                      onClick={(e) => abrirEdicao(mesa, e)}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/60"
                      title={t('mesas.editTooltip')}
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {emEdicao ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <label className="flex items-center gap-1.5 text-white/60 text-xs">
                    <Users className="w-3.5 h-3.5" />
                    <input
                      type="number"
                      min="1"
                      value={editCapacidade}
                      onChange={(e) => setEditCapacidade(e.target.value)}
                      className="w-16 px-2 py-1 rounded-lg bg-black/30 border border-white/20 text-white text-xs"
                    />
                    {t('mesas.seats')}
                  </label>
                  {mesa.status === 'ocupada' && (
                    <label className="flex items-center gap-1.5 text-white/60 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <input
                        type="text"
                        placeholder="HH:MM"
                        value={editHorario}
                        onChange={(e) => setEditHorario(e.target.value)}
                        className="w-16 px-2 py-1 rounded-lg bg-black/30 border border-white/20 text-white text-xs"
                      />
                    </label>
                  )}
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={(e) => salvarEdicao(mesa.id, e)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-white"
                      style={{ backgroundColor: 'var(--primary-neon)' }}
                    >
                      <Check className="w-3 h-3" /> {t('mesas.save')}
                    </button>
                    <button
                      onClick={cancelarEdicao}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-white/60 bg-white/10"
                    >
                      <X className="w-3 h-3" /> {t('mesas.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{mesa.capacidade} {t('mesas.seats')}</span>
                  </div>
                  {mesa.status === 'ocupada' && mesa.ocupadaDesde && (
                    <div className="flex items-center gap-1.5 text-white/40 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t('mesas.since')} {mesa.ocupadaDesde}</span>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}