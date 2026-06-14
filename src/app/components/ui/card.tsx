import { useState } from 'react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { useUniverse } from '../context/UniverseContext';
import { useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ShoppingBag, User, MapPin, Phone, MessageSquare, Sparkles, Download, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { getProductImage } from '../utils/productImages';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { photocards, Photocard, GROUP_CONFIG } from '../data/photocards';

const CARDS_PER_ORDER = 3;

export function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const { categoria } = useUniverse();

  const [step, setStep] = useState<'cart' | 'photocards' | 'checkout'>('cart');
  const [selectedCards, setSelectedCards] = useState<Photocard[]>([]);
  const [rarityFilter, setRarityFilter] = useState<'all' | 'common' | 'rare' | 'ultra-rare'>('all');
  const [customerName, setCustomerName] = useState(user?.nome || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [orderDone, setOrderDone] = useState(false);

  const isKpop = categoria === 'Kpop';

  const filteredCards = photocards.filter(c =>
    rarityFilter === 'all' || c.rarity === rarityFilter
  );

  const toggleCard = (card: Photocard) => {
    if (selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(prev => prev.filter(c => c.id !== card.id));
    } else if (selectedCards.length < CARDS_PER_ORDER) {
      setSelectedCards(prev => [...prev, card]);
    } else {
      toast.error(`Você já escolheu ${CARDS_PER_ORDER} photocards!`);
    }
  };

  const handleConfirmOrder = async () => {
    if (!customerName.trim()) {
      toast.error('Por favor, preencha seu nome');
      return;
    }
    try {
      const orderId = await addOrder({
        items: items.map(item => ({
          product: { id: item.id, nome: item.nome, preco: item.preco, categoria: item.categoria || 'geral' },
          quantidade: item.quantidade,
        })),
        total,
        status: 'pendente',
        user_id: user?.id,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim() || undefined,
        customer_address: customerAddress.trim() || undefined,
        observacoes: observacoes.trim() || undefined,
      });

      if (orderId) {
        toast.success('Pedido enviado para a cozinha! 🍜');
        setOrderDone(true);
      } else {
        toast.error('Erro ao enviar pedido. Tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao enviar pedido.');
    }
  };

  const handleDownloadCard = async (card: Photocard, index: number) => {
    const el = document.getElementById(`photocard-${index}`);
    if (!el) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, { backgroundColor: null, scale: 3 });
      const url = canvas.toDataURL('image/png');

      if (navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(url)).blob();
          const file = new File([blob], `${card.member}-${card.groupName}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: `Photocard ${card.member}` });
            return;
          }
        } catch {}
      }

      const a = document.createElement('a');
      a.href = url;
      a.download = `${card.member}-${card.groupName}-${card.era}.png`;
      a.click();
    } catch {
      toast.error('Erro ao baixar. Tente tirar um print!');
    }
  };

  // ── Tela de sucesso ──────────────────────────────────────────────
  if (orderDone) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">Pedido Confirmado!</h2>
            <p className="text-white/60 mb-8">
              {isKpop && selectedCards.length > 0
                ? 'Sua comanda foi para a cozinha. Aqui estão suas photocards:'
                : 'Sua comanda foi para a cozinha!'
              }
            </p>

            {isKpop && selectedCards.length > 0 && (
              <>
                <div className="flex flex-wrap justify-center gap-6 mb-6">
                  {selectedCards.map((card, index) => {
                    const cfg = GROUP_CONFIG[card.group];
                    const isUR = card.rarity === 'ultra-rare';
                    const isRare = card.rarity === 'rare';
                    return (
                      <div key={card.id} className="flex flex-col items-center gap-2">
                        <motion.div
                          id={`photocard-${index}`}
                          initial={{ opacity: 0, y: 20, rotate: -5 }}
                          animate={{ opacity: 1, y: 0, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 }}
                          className={`relative overflow-hidden rounded-xl ${isUR ? 'card-ultra-rare' : ''}`}
                          style={{
                            width: 150, height: 225,
                            background: isUR
                              ? 'linear-gradient(-45deg,#ff0080,#ff8c00,#40e0d0,#9400d3,#ff69b4,#00ff88)'
                              : cfg.gradient,
                            border: isUR
                              ? '2px solid rgba(255,255,255,0.4)'
                              : isRare ? `1.5px solid ${cfg.accentColor}` : '1px solid rgba(255,255,255,0.2)',
                            boxShadow: isUR
                              ? '0 0 30px rgba(255,0,128,0.5)'
                              : isRare ? `0 0 20px ${cfg.accentColor}60` : 'none',
                          }}
                        >
                          {isUR && <div className="shimmer" />}
                          <div className="absolute inset-0 flex flex-col justify-between p-3">
                            <div className="flex items-start justify-between">
                              <div className="px-2 py-0.5 rounded-full text-[10px] font-black"
                                style={{
                                  backgroundColor: isUR ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
                                  color: isUR ? '#FFD700' : cfg.accentColor,
                                  border: isUR ? '1px solid #FFD700' : `1px solid ${cfg.accentColor}`,
                                }}
                              >
                                {isUR ? '⭐ UR' : isRare ? '🟦 R' : '🟫 C'}
                              </div>
                              {card.isPreDebut && (
                                <div className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[9px] font-bold">PRÉ</div>
                              )}
                            </div>
                            <div className="flex items-center justify-center flex-1">
                              <div className="flex items-center justify-center rounded-full font-black text-2xl"
                                style={{
                                  width: 64, height: 64,
                                  backgroundColor: 'rgba(0,0,0,0.45)',
                                  border: isUR ? '2px solid rgba(255,255,255,0.5)' : `2px solid ${cfg.accentColor}60`,
                                  color: isUR ? '#FFD700' : cfg.accentColor,
                                  textShadow: isUR ? '0 0 20px #FFD700' : `0 0 15px ${cfg.accentColor}`,
                                }}
                              >
                                {card.isGroupPhoto ? '♛' : card.member.charAt(0)}
                              </div>
                            </div>
                            <div className="rounded-lg p-2" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
                              <p className="font-black text-xs" style={{ color: isUR ? '#FFD700' : cfg.accentColor }}>{card.member}</p>
                              <p className="text-white/70 text-[10px]">{card.groupName}</p>
                              <p className="text-white/40 text-[9px]">{card.era}</p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleDownloadCard(card, index)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-black"
                          style={{ backgroundColor: isUR ? '#FFD700' : cfg.accentColor }}
                        >
                          <Download className="w-3 h-3" />
                          Baixar
                        </motion.button>
                      </div>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => selectedCards.forEach((card, i) => handleDownloadCard(card, i))}
                  className="flex items-center gap-2 mx-auto mb-6 px-6 py-3 rounded-full font-bold text-sm border border-white/20 text-white bg-white/10 hover:bg-white/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Baixar Todos os Cards
                </motion.button>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { clearCart(); navigate('/home'); }}
              className="px-10 py-4 rounded-full font-bold text-black text-lg"
              style={{ backgroundColor: 'var(--primary-neon)' }}
            >
              VOLTAR AO INÍCIO
            </motion.button>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── Carrinho vazio ───────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-white/20" />
            <h2 className="text-3xl font-bold text-white mb-4">Carrinho Vazio</h2>
            <p className="text-white/60 mb-8">Adicione itens do cardápio para começar seu pedido</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
              className="px-8 py-4 rounded-full font-bold text-black"
              style={{ backgroundColor: 'var(--primary-neon)' }}
            >
              VER CARDÁPIO
            </motion.button>
          </motion.div>
        </div>
        <UniverseToggle />
      </div>
    );
  }

  // ── Step: Photocards ─────────────────────────────────────────────
  if (step === 'photocards') {
    return (
      <div className="min-h-screen pb-40">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6" style={{ color: 'var(--primary-neon)' }} />
              <h2 className="text-2xl font-bold text-white">Escolha suas {CARDS_PER_ORDER} Photocards</h2>
            </div>
            <p className="text-white/50 text-sm">
              Grátis com seu pedido! Selecione {CARDS_PER_ORDER} cards para ganhar.{' '}
              <span style={{ color: 'var(--primary-neon)' }}>{selectedCards.length}/{CARDS_PER_ORDER} selecionadas</span>
            </p>
          </motion.div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {(['all', 'common', 'rare', 'ultra-rare'] as const).map(r => (
              <button key={r} onClick={() => setRarityFilter(r)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                  rarityFilter === r ? 'text-black border-transparent' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                }`}
                style={rarityFilter === r ? { backgroundColor: 'var(--primary-neon)' } : {}}
              >
                {r === 'all' ? 'Todos' : r === 'common' ? '🟫 Common' : r === 'rare' ? '🟦 Rare' : '⭐ Ultra Rare'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-6">
            {filteredCards.map((card, index) => {
              const cfg = GROUP_CONFIG[card.group];
              const isUR = card.rarity === 'ultra-rare';
              const isRare = card.rarity === 'rare';
              const isSelected = !!selectedCards.find(c => c.id === card.id);

              return (
                <motion.div key={card.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={{ scale: 1.06 }}
                  onClick={() => toggleCard(card)}
                  className="cursor-pointer relative"
                >
                  <div
                    className={`relative overflow-hidden rounded-xl ${isUR ? 'card-ultra-rare' : ''}`}
                    style={{
                      aspectRatio: '2/3',
                      background: isUR ? undefined : cfg.gradient,
                      border: isSelected
                        ? '2.5px solid white'
                        : isUR ? '2px solid rgba(255,255,255,0.4)'
                        : isRare ? `1.5px solid ${cfg.accentColor}80`
                        : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: isSelected
                        ? '0 0 20px rgba(255,255,255,0.5)'
                        : isUR ? '0 0 20px rgba(255,0,128,0.4)' : 'none',
                      opacity: (!isSelected && selectedCards.length >= CARDS_PER_ORDER) ? 0.4 : 1,
                    }}
                  >
                    {isUR && <div className="shimmer" />}

                    {isSelected && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <Check className="w-6 h-6 text-black" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 flex flex-col justify-between p-2">
                      <div className="text-[9px] font-black px-1.5 py-0.5 rounded-full w-fit"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: isUR ? '#FFD700' : cfg.accentColor,
                          border: isUR ? '1px solid #FFD700' : `1px solid ${cfg.accentColor}`,
                        }}
                      >
                        {isUR ? '⭐' : isRare ? '🟦' : '🟫'}
                      </div>
                      <div className="flex items-center justify-center flex-1">
                        <div className="flex items-center justify-center rounded-full font-black text-xl"
                          style={{
                            width: 48, height: 48,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            border: isUR ? '2px solid rgba(255,255,255,0.5)' : `2px solid ${cfg.accentColor}60`,
                            color: isUR ? '#FFD700' : cfg.accentColor,
                          }}
                        >
                          {card.isGroupPhoto ? '♛' : card.member.charAt(0)}
                        </div>
                      </div>
                      <div className="rounded-md p-1.5" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                        <p className="font-black text-[10px] truncate" style={{ color: isUR ? '#FFD700' : cfg.accentColor }}>{card.member}</p>
                        <p className="text-white/50 text-[9px] truncate">{card.groupName}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 z-30">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <div className="flex gap-2 flex-1">
              {Array.from({ length: CARDS_PER_ORDER }).map((_, i) => (
                <div key={i} className="flex-1 h-2 rounded-full transition-all"
                  style={{ backgroundColor: i < selectedCards.length ? 'var(--primary-neon)' : 'rgba(255,255,255,0.1)' }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setStep('cart')}
                className="px-5 py-3 rounded-xl font-bold text-white bg-white/10 border border-white/20"
              >
                Voltar
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => selectedCards.length === CARDS_PER_ORDER && setStep('checkout')}
                className="px-6 py-3 rounded-xl font-bold text-black transition-opacity"
                style={{
                  backgroundColor: 'var(--primary-neon)',
                  opacity: selectedCards.length === CARDS_PER_ORDER ? 1 : 0.4,
                  cursor: selectedCards.length === CARDS_PER_ORDER ? 'pointer' : 'not-allowed',
                }}
              >
                Continuar ({selectedCards.length}/{CARDS_PER_ORDER})
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Checkout ───────────────────────────────────────────────
  if (step === 'checkout') {
    return (
      <div className="min-h-screen pb-40">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-white mb-6">Informações de Entrega</h2>
          <div className="space-y-4 mb-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
                placeholder="Nome completo *"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                placeholder="Telefone (opcional)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/40" />
              <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)}
                placeholder="Endereço de entrega (opcional)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
                rows={2}
              />
            </div>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-white/40" />
              <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)}
                placeholder="Observações (opcional)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
                rows={2}
              />
            </div>
          </div>

          {isKpop && selectedCards.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/60 text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: 'var(--primary-neon)' }} />
                Suas photocards grátis:
              </p>
              <div className="flex gap-3 flex-wrap">
                {selectedCards.map(card => {
                  const cfg = GROUP_CONFIG[card.group];
                  const isUR = card.rarity === 'ultra-rare';
                  return (
                    <div key={card.id} className="text-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-black mb-1"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          color: isUR ? '#FFD700' : cfg.accentColor,
                          border: `2px solid ${isUR ? '#FFD700' : cfg.accentColor}`,
                        }}
                      >
                        {card.isGroupPhoto ? '♛' : card.member.charAt(0)}
                      </div>
                      <p className="text-white/60 text-[10px]">{card.member}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 z-30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/80">Total:</span>
              <span className="text-2xl font-bold" style={{ color: 'var(--primary-neon)' }}>
                R$ {total.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setStep(isKpop ? 'photocards' : 'cart')}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-white/10 border border-white/20"
              >
                Voltar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleConfirmOrder}
                className="flex-1 py-3 rounded-xl font-bold text-black"
                style={{ backgroundColor: 'var(--primary-neon)' }}
              >
                Confirmar Pedido
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Cart ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-40">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-8"
        >
          Seu Carrinho
        </motion.h1>

        <div className="space-y-4 mb-8">
          {items.map((item, index) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 hover:border-[var(--primary-neon)]/50 transition-all"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={getProductImage(item.imageUrl)}
                    alt={item.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1 truncate">{item.nome}</h3>
                  <p className="text-sm text-white/60 mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                        className="w-8 h-8 rounded-full border flex items-center justify-center text-white"
                        style={{ borderColor: 'var(--primary-neon)' }}
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="text-white font-bold w-8 text-center">{item.quantidade}</span>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                        className="w-8 h-8 rounded-full border flex items-center justify-center text-white"
                        style={{ borderColor: 'var(--primary-neon)' }}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold" style={{ color: 'var(--primary-neon)' }}>
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </span>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {isKpop && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl border flex items-center gap-4"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderColor: 'color-mix(in srgb, var(--primary-neon) 30%, transparent)',
            }}
          >
            <Sparkles className="w-8 h-8 flex-shrink-0" style={{ color: 'var(--primary-neon)' }} />
            <div>
              <p className="text-white font-bold">🎁 Ganhe {CARDS_PER_ORDER} Photocards Grátis!</p>
              <p className="text-white/50 text-sm">
                Escolha seus cards favoritos — Common, Rare ou Ultra Rare!
              </p>
            </div>
          </motion.div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 text-lg">Total da Comanda:</span>
            <span className="text-4xl font-bold" style={{ color: 'var(--primary-neon)' }}>
              R$ {total.toFixed(2)}
            </span>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setStep(isKpop ? 'photocards' : 'checkout')}
            className="w-full py-5 rounded-2xl font-bold text-lg text-black shadow-lg"
            style={{ backgroundColor: 'var(--primary-neon)' }}
          >
            {isKpop ? '✨ ESCOLHER PHOTOCARDS' : 'FINALIZAR PEDIDO'}
          </motion.button>
          <button onClick={clearCart}
            className="w-full mt-3 py-3 text-red-400 hover:text-red-300 transition-colors text-sm"
          >
            Limpar Carrinho
          </button>
        </div>
      </div>
      <UniverseToggle />
    </div>
  );
}