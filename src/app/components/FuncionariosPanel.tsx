// src/app/components/FuncionariosPanel.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Pencil, Trash2, Phone, Calendar, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Funcionario, Cargo, CARGOS, AVATAR_EMOJIS, AVATAR_COLORS, funcionariosIniciais,
} from '../data/funcionarios';
import { unidades, UnidadeId } from '../data/unidades';
import { useAuth } from '../context/AuthContext';
import { supabase, Profile } from '../../lib/supabase';

const STORAGE_KEY = 'mikrokosmos_funcionarios';

function loadFuncionarios(): Funcionario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return funcionariosIniciais;
}

function saveFuncionarios(lista: Funcionario[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch {}
}

type FormState = Omit<Funcionario, 'id' | 'status'>;

const FORM_VAZIO: FormState = {
  nome: '',
  cargo: 'Garçom',
  unidade: 'vila-mariana',
  avatarEmoji: AVATAR_EMOJIS[0],
  avatarColor: AVATAR_COLORS[0],
  telefone: '',
  dataAdmissao: new Date().toISOString().slice(0, 10),
  profileId: undefined,
};

export function FuncionariosPanel() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(loadFuncionarios);
  const [filtroUnidade, setFiltroUnidade] = useState<'todas' | UnidadeId>('todas');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState<FormState>(FORM_VAZIO);

  // Vínculo opcional com contas reais do Supabase Auth (tabela `profiles`).
  // Só busca se for admin; se a RLS bloquear a leitura, degrada graciosamente
  // (o cadastro local de Funcionários continua funcionando 100% sem isso).
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [profilesError, setProfilesError] = useState<string | null>(null);

  useEffect(() => { saveFuncionarios(funcionarios); }, [funcionarios]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelado = false;
    setProfilesLoading(true);
    setProfilesError(null);
    supabase
      .from('profiles')
      .select('id, nome, email, role, created_at')
      .then(({ data, error }) => {
        if (cancelado) return;
        if (error) {
          setProfilesError(error.message);
        } else {
          setProfiles((data as Profile[]) || []);
        }
        setProfilesLoading(false);
      });
    return () => { cancelado = true; };
  }, [isAdmin]);

  const cargoLabel = (c: Cargo) => t(`funcionarios.cargo.${c}`);

  // FIX i18n: slug de role (dado do Supabase) traduzido só na exibição.
  // Reaproveita as chaves profile.roles.* já existentes nos 6 idiomas.
  const roleLabel = (r: string) => t(`profile.roles.${r}`, { defaultValue: r });

  const listaFiltrada = filtroUnidade === 'todas'
    ? funcionarios
    : funcionarios.filter(f => f.unidade === filtroUnidade);

  const ativos = funcionarios.filter(f => f.status === 'ativo').length;

  const abrirNovo = () => {
    setForm(FORM_VAZIO);
    setEditandoId(null);
    setMostrarForm(true);
  };

  const abrirEdicao = (f: Funcionario) => {
    setForm({
      nome: f.nome, cargo: f.cargo, unidade: f.unidade,
      avatarEmoji: f.avatarEmoji, avatarColor: f.avatarColor,
      telefone: f.telefone || '', dataAdmissao: f.dataAdmissao,
      profileId: f.profileId,
    });
    setEditandoId(f.id);
    setMostrarForm(true);
  };

  const salvar = () => {
    if (!form.nome.trim()) return;

    if (editandoId) {
      setFuncionarios(prev => prev.map(f => f.id === editandoId ? { ...f, ...form } : f));
    } else {
      setFuncionarios(prev => [
        ...prev,
        { ...form, id: `f_${Date.now()}`, status: 'ativo' },
      ]);
    }
    setMostrarForm(false);
    setEditandoId(null);
  };

  const toggleStatus = (id: string) => {
    setFuncionarios(prev => prev.map(f =>
      f.id === id ? { ...f, status: f.status === 'ativo' ? 'inativo' : 'ativo' } : f
    ));
  };

  const remover = (id: string) => {
    setFuncionarios(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6" style={{ color: 'var(--primary-neon)' }} />
            {t('funcionarios.title')}
          </h2>
          <p className="text-white/60 text-sm mt-1">
            {t('funcionarios.subtitle', { ativos, total: funcionarios.length })}
          </p>
        </div>
        <button
          onClick={abrirNovo}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white text-sm"
          style={{ backgroundColor: 'var(--primary-neon)' }}
        >
          <Plus className="w-4 h-4" /> {t('funcionarios.addButton')}
        </button>
      </div>

      {/* Filtro por unidade */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFiltroUnidade('todas')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filtroUnidade === 'todas' ? 'text-white' : 'text-white/50 bg-white/5 border border-white/10'}`}
          style={filtroUnidade === 'todas' ? { backgroundColor: 'var(--primary-neon)' } : {}}
        >
          {t('funcionarios.allUnits')}
        </button>
        {unidades.map(u => (
          <button
            key={u.id}
            onClick={() => setFiltroUnidade(u.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filtroUnidade === u.id ? 'text-white' : 'text-white/50 bg-white/5 border border-white/10'}`}
            style={filtroUnidade === u.id ? { backgroundColor: 'var(--primary-neon)' } : {}}
          >
            {u.bairro}
          </button>
        ))}
      </div>

      {/* Formulário (novo/editar) */}
      <AnimatePresence>
        {mostrarForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold">{editandoId ? t('funcionarios.editTitle') : t('funcionarios.newTitle')}</h3>
                <button onClick={() => setMostrarForm(false)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t('funcionarios.namePlaceholder')}
                  value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-sm placeholder:text-white/30"
                />
                <input
                  type="text"
                  placeholder={t('funcionarios.phonePlaceholder')}
                  value={form.telefone}
                  onChange={e => setForm({ ...form, telefone: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-sm placeholder:text-white/30"
                />
                <select
                  value={form.cargo}
                  onChange={e => setForm({ ...form, cargo: e.target.value as Cargo })}
                  className="px-3 py-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-sm"
                >
                  {CARGOS.map(c => <option key={c} value={c}>{cargoLabel(c)}</option>)}
                </select>
                <select
                  value={form.unidade}
                  onChange={e => setForm({ ...form, unidade: e.target.value as UnidadeId })}
                  className="px-3 py-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-sm"
                >
                  {unidades.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                </select>
                <input
                  type="date"
                  value={form.dataAdmissao}
                  onChange={e => setForm({ ...form, dataAdmissao: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-sm"
                />
              </div>

              <div>
                <p className="text-white/50 text-xs mb-2">{t('funcionarios.avatarLabel')}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATAR_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setForm({ ...form, avatarEmoji: emoji })}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all"
                      style={{
                        backgroundColor: form.avatarEmoji === emoji ? form.avatarColor + '40' : 'rgba(255,255,255,0.05)',
                        border: form.avatarEmoji === emoji ? `2px solid ${form.avatarColor}` : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {AVATAR_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setForm({ ...form, avatarColor: color })}
                      className="w-6 h-6 rounded-full transition-all"
                      style={{ backgroundColor: color, outline: form.avatarColor === color ? '2px solid white' : 'none' }}
                    />
                  ))}
                </div>
              </div>

              {/* Vínculo opcional com conta real do Supabase Auth — só pra admins */}
              {isAdmin && (
                <div>
                  <p className="text-white/50 text-xs mb-2">🔗 {t('funcionarios.linkAccount')}</p>
                  {profilesLoading ? (
                    <p className="text-white/40 text-xs">{t('funcionarios.loadingAccounts')}</p>
                  ) : profilesError ? (
                    <p className="text-yellow-400/80 text-xs">⚠️ {t('funcionarios.accountsError')}</p>
                  ) : (
                    <select
                      value={form.profileId || ''}
                      onChange={e => setForm({ ...form, profileId: e.target.value || undefined })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-sm"
                    >
                      <option value="">{t('funcionarios.noAccount')}</option>
                      {/* FIX i18n: nome e email são dados (crus); só o role traduz */}
                      {profiles.map(p => (
                        <option key={p.id} value={p.id}>{p.nome} — {p.email} ({roleLabel(p.role)})</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={salvar}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm"
                  style={{ backgroundColor: 'var(--primary-neon)' }}
                >
                  <Check className="w-4 h-4" /> {t('funcionarios.save')}
                </button>
                <button
                  onClick={() => setMostrarForm(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-white/70 text-sm bg-white/10 border border-white/20"
                >
                  {t('funcionarios.cancel')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de funcionários */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listaFiltrada.map((f, i) => {
          const unidade = unidades.find(u => u.id === f.unidade);
          const profileVinculado = f.profileId ? profiles.find(p => p.id === f.profileId) : undefined;
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-4 rounded-xl border bg-white/5 border-white/10"
              style={{ opacity: f.status === 'inativo' ? 0.5 : 1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: f.avatarColor + '30', border: `2px solid ${f.avatarColor}` }}
                  >
                    {f.avatarEmoji}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{f.nome}</p>
                    <p className="text-white/50 text-xs">{cargoLabel(f.cargo)} · {unidade?.bairro}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => abrirEdicao(f)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remover(f.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* FIX i18n: role do badge traduzido na exibição */}
              {f.profileId && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-2">
                  🔗 {t('funcionarios.linkedBadge')}{profileVinculado ? `: ${roleLabel(profileVinculado.role)}` : ''}
                </span>
              )}

              {f.telefone && (
                <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
                  <Phone className="w-3.5 h-3.5" /> {f.telefone}
                </div>
              )}
              {/* FIX i18n: data de admissão formatada no locale ativo (ko → 2023. 3. 10., en → 3/10/2023...) */}
              <div className="flex items-center gap-1.5 text-white/50 text-xs mb-3">
                <Calendar className="w-3.5 h-3.5" /> {t('funcionarios.since')} {new Date(f.dataAdmissao + 'T00:00:00').toLocaleDateString(i18n.language)}
              </div>

              <button
                onClick={() => toggleStatus(f.id)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-all"
                style={{
                  backgroundColor: f.status === 'ativo' ? 'rgba(76,175,80,0.15)' : 'rgba(150,150,150,0.15)',
                  color: f.status === 'ativo' ? '#4CAF50' : '#999',
                  border: `1px solid ${f.status === 'ativo' ? '#4CAF5060' : '#99999960'}`,
                }}
              >
                {f.status === 'ativo' ? t('funcionarios.active') : t('funcionarios.inactive')} — {t('funcionarios.toggleHint')}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}