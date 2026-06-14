import { useState } from 'react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { useUniverse } from '../context/UniverseContext';
import { useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ShoppingBag, User, MapPin, Phone, MessageSquare, Sparkles, Download, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

  // ── helper: renderiza um card com foto real ──────────────────────
  const renderPhotocard = (
    card: Photocard,
    opts: { width?: number; height?: number; showCheck?: boolean; isSelected?: boolean; onClick?: () => void; dimmed?: boolean }
  ) => {
    const cfg = GROUP_CONFIG[card.group];
    const isUR = card.rarity === 'ultra-rare';
    const isRare = card.rarity === 'rare';
    const { width = 140, height = 210, showCheck = false, isSelected = false, onClick, dimmed = false } = opts;

    return (
      <motion.div
        key={card.id}
        onClick={onClick}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: onClick ? 1.06 : 1 }}
        className={`relative overflow-hidden rounded-xl ${isUR ? 'card-ultra-rare' : ''} ${onClick ? 'cursor-pointer' : ''}`}
        style={{
          width, height,
          backgroundImage: card.imageUrl ? `url(${card.imageUrl})` : undefined,
          background: card.imageUrl ? undefined : (isUR ? undefined : cfg.gradient),
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          border: isSelected
            ? '2.5px solid white'
            : isUR ? '2px solid rgba(255,255,255,0.4)'
            : isRare ? `1.5px solid ${cfg.accentColor}`
            : '1px solid rgba(255,255,255,0.2)',
          boxShadow: isSelected
            ? '0 0 20px rgba(255,255,255,0.5)'
            : isUR ? '0 0 30px rgba(255,0,128,0.5)'
            : isRare ? `0 0 20px ${cfg.accentColor}60` : 'none',
          opacity: dimmed ? 0.4 : 1,
        }}
      >
        {/* overlay legibilidade */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.8) 100%)',
            zIndex: 1,
          }}
        />

        {isUR && <div className="shimmer" style={{ zIndex: 2 }} />}

        {/* check overlay */}
        {showCheck && isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40" style={{ zIndex: 10 }}>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Check className="w-6 h-6 text-black" />
            </div>
          </div>
        )}

        {/* conteúdo */}
        <div className="absolute inset-0 flex flex-col justify-between p-2" style={{ zIndex: 5 }}>
          <div className="text-[9px] font-black px-1.5 py-0.5 rounded-full w-fit"
            style={{
              backgroundColor: 'rgba(0,0,0,0.65)',
              color: isUR ? '#FFD700' : cfg.accentColor,
              border: isUR ? '1px solid #FFD700' : `1px solid ${cfg.accentColor}`,
            }}
          >
            {isUR ? '⭐ UR' : isRare ? '🟦 R' : '🟫 C'}
          </div>

          {/* círculo com letra só se não tiver foto */}
          {!card.imageUrl && (
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
          )}

          <div className="rounded-md p-1.5" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
            <p className="font-black text-[10px] truncate" style={{ color: isUR ? '#FFD700' : cfg.accentColor }}>{card.member}</p>
            <p className="text-white/70 text-[9px] truncate">{card.groupName}</p>
            <p className="text-white/40 text-[8px] truncate">{card.era}</p>
          </div>
        </div>
      </motion.div>
    );
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
                : 'Sua comanda foi para a cozinha!'}
            </p>

            {isKpop && selectedCards.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {selectedCards.map((card, i) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: i * 0.1 }}
                  >
                    {renderPhotocard(card, { width: 140, height: 210 })}
                  </motion.div>
                ))}
              </div>
            )}

            <p className="text-white/40 text-sm mb-6">Salve os seus cards com print ou download 📸</p>

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
            {filteredCards.map((card) => {
              const isSelected = !!selectedCards.find(c => c.id === card.id);
              return renderPhotocard(card, {
                width: undefined,
                height: undefined,
                showCheck: true,
                isSelected,
                dimmed: !isSelected && selectedCards.length >= CARDS_PER_ORDER,
                onClick: () => toggleCard(card),
              });
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
                {selectedCards.map(card => renderPhotocard(card, { width: 70, height: 105 }))}
              </div>
            </div>
          )}
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 z-30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/80">Total:</span>
              <span className="text-2xl font-bold" style={{ color: 'var(--primary-neon)' }}>R$ {total.toFixed(2)}</span>
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
                  <ImageWithFallback src={getProductImage(item.imageUrl)} alt={item.nome} className="w-full h-full object-cover" />
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
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'color-mix(in srgb, var(--primary-neon) 30%, transparent)' }}
          >
            <Sparkles className="w-8 h-8 flex-shrink-0" style={{ color: 'var(--primary-neon)' }} />
            <div>
              <p className="text-white font-bold">🎁 Ganhe {CARDS_PER_ORDER} Photocards Grátis!</p>
              <p className="text-white/50 text-sm">Escolha seus cards favoritos — Common, Rare ou Ultra Rare!</p>
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
          <button onClick={clearCart} className="w-full mt-3 py-3 text-red-400 hover:text-red-300 transition-colors text-sm">
            Limpar Carrinho
          </button>
        </div>
      </div>
      <UniverseToggle />
    </div>
  );
}