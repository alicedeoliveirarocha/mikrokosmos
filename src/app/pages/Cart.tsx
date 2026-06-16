import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { useUniverse } from '../context/UniverseContext';
import { useNavigate } from 'react-router';
import {
  Minus, Plus, Trash2, ShoppingBag, User, MapPin, Phone,
  MessageSquare, Sparkles, Check, CreditCard, ChevronDown,
  ChevronUp, Plus as PlusIcon, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductImage } from '../utils/productImages';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { photocards, Photocard, GROUP_CONFIG } from '../data/photocards';

const CARDS_PER_ORDER = 3;

interface SavedAddress {
  id: string;
  label: string;
  value: string;
}

interface SavedCard {
  id: string;
  number: string;
  name: string;
  expiry: string;
  label: string;
}

interface CustomerData {
  name: string;
  phone: string;
  addresses: SavedAddress[];
  savedCards: SavedCard[];
}

const STORAGE_KEY = 'mikrokosmos_customer';

function loadCustomerData(userId?: string): CustomerData {
  try {
    const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { name: '', phone: '', addresses: [], savedCards: [] };
}

function saveCustomerData(data: CustomerData, userId?: string) {
  try {
    const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const { categoria } = useUniverse();

  const [step, setStep] = useState<'cart' | 'photocards' | 'checkout'>('cart');
  const [wantPhotocards, setWantPhotocards] = useState(true);
  const [selectedCards, setSelectedCards] = useState<Photocard[]>([]);
  const [rarityFilter, setRarityFilter] = useState<'all' | 'common' | 'rare' | 'ultra-rare'>('all');
  const [orderDone, setOrderDone] = useState(false);

  // Customer data
  const [customerData, setCustomerData] = useState<CustomerData>({ name: '', phone: '', addresses: [], savedCards: [] });
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [showAddresses, setShowAddresses] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'dinheiro' | 'cartao'>('pix');
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [saveCard, setSaveCard] = useState(false);

  const isKpop = categoria === 'Kpop';

  // Load saved data on mount
  useEffect(() => {
    const data = loadCustomerData(user?.id);
    setCustomerData(data);
    setCustomerName(data.name || user?.nome || '');
    setCustomerPhone(data.phone || '');
  }, [user]);

  const handleSaveAddress = () => {
    if (!customerAddress.trim()) return;
    const label = newAddressLabel.trim() || `Endereço ${customerData.addresses.length + 1}`;
    const newAddr: SavedAddress = {
      id: Date.now().toString(),
      label,
      value: customerAddress.trim(),
    };
    const updated = { ...customerData, addresses: [...customerData.addresses, newAddr] };
    setCustomerData(updated);
    saveCustomerData(updated, user?.id);
    setNewAddressLabel('');
    toast.success(`Endereço "${label}" salvo!`);
  };

  const handleRemoveAddress = (id: string) => {
    const updated = { ...customerData, addresses: customerData.addresses.filter(a => a.id !== id) };
    setCustomerData(updated);
    saveCustomerData(updated, user?.id);
  };

  const handleSaveCard = () => {
    if (!cardNumber || !cardName || !cardExpiry) return;
    const last4 = cardNumber.replace(/\s/g, '').slice(-4);
    const newCard: SavedCard = {
      id: Date.now().toString(),
      number: cardNumber,
      name: cardName,
      expiry: cardExpiry,
      label: `••••${last4}`,
    };
    const updated = { ...customerData, savedCards: [...customerData.savedCards, newCard] };
    setCustomerData(updated);
    saveCustomerData(updated, user?.id);
    toast.success('Cartão salvo!');
    setSaveCard(false);
  };

  const handleRemoveCard = (id: string) => {
    const updated = { ...customerData, savedCards: customerData.savedCards.filter(c => c.id !== id) };
    setCustomerData(updated);
    saveCustomerData(updated, user?.id);
    if (selectedCardId === id) setSelectedCardId(null);
  };

  const handleSelectSavedCard = (card: SavedCard) => {
    setSelectedCardId(card.id);
    setCardNumber(card.number);
    setCardName(card.name);
    setCardExpiry(card.expiry);
    setShowCardForm(true);
  };

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val: string) =>
    val.replace(/\D/g, '').slice(0, 4).replace(/^(.{2})(.+)/, '$1/$2');

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
    if (paymentMethod === 'cartao' && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      toast.error('Preencha todos os dados do cartão');
      return;
    }

    // Save customer info
    const updated: CustomerData = {
      ...customerData,
      name: customerName.trim(),
      phone: customerPhone.trim(),
    };
    saveCustomerData(updated, user?.id);
    setCustomerData(updated);

    // Save card if requested
    if (paymentMethod === 'cartao' && saveCard && cardNumber) {
      handleSaveCard();
    }

    try {
      const paymentInfo = paymentMethod === 'cartao'
        ? ` | Cartão: ••••${cardNumber.replace(/\s/g, '').slice(-4)}`
        : ` | Pagamento: ${paymentMethod.toUpperCase()}`;

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
        observacoes: (observacoes.trim() || '') + paymentInfo,
      });

      if (orderId) {
        toast.success('Pedido enviado para a cozinha! 🍜');
        setOrderDone(true);
      } else {
        toast.error('Erro ao enviar pedido. Tente novamente.');
      }
    } catch {
      toast.error('Erro ao enviar pedido.');
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
                : 'Sua comanda foi para a cozinha!'}
            </p>

            {isKpop && selectedCards.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {selectedCards.map((card) => {
                  const cfg = GROUP_CONFIG[card.group];
                  const isUR = card.rarity === 'ultra-rare';
                  const isRare = card.rarity === 'rare';
                  return (
                    <motion.div key={card.id}
                      initial={{ opacity: 0, y: 20, rotate: -5 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className={`relative overflow-hidden rounded-xl ${isUR ? 'card-ultra-rare' : ''}`}
                      style={{
                        width: 140, height: 210,
                        backgroundImage: card.imageUrl ? `url(${card.imageUrl})` : undefined,
                        background: !card.imageUrl ? cfg.gradient : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                        border: isUR ? '2px solid rgba(255,255,255,0.4)' : isRare ? `1.5px solid ${cfg.accentColor}` : '1px solid rgba(255,255,255,0.2)',
                        boxShadow: isUR ? '0 0 30px rgba(255,0,128,0.5)' : isRare ? `0 0 20px ${cfg.accentColor}60` : 'none',
                      }}
                    >
                      {card.imageUrl && <img src={card.imageUrl} alt={card.member} className="absolute inset-0 w-full h-full object-cover object-top" style={{ zIndex: 0 }} />}
                      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.8) 100%)', zIndex: 1 }} />
                      {isUR && <div className="shimmer" style={{ zIndex: 2 }} />}
                      <div className="absolute inset-0 flex flex-col justify-between p-2" style={{ zIndex: 5 }}>
                        <div className="text-[9px] font-black px-1.5 py-0.5 rounded-full w-fit"
                          style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: isUR ? '#FFD700' : cfg.accentColor, border: isUR ? '1px solid #FFD700' : `1px solid ${cfg.accentColor}` }}>
                          {isUR ? '⭐ UR' : isRare ? '🟦 R' : '🟫 C'}
                        </div>
                        <div className="rounded-md p-1.5" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
                          <p className="font-black text-[10px] truncate" style={{ color: isUR ? '#FFD700' : cfg.accentColor }}>{card.member}</p>
                          <p className="text-white/70 text-[9px] truncate">{card.groupName}</p>
                          <p className="text-white/40 text-[8px] truncate">{card.era}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <p className="text-white/40 text-sm mb-6">Salve os seus cards com print ou download 📸</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
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
              Grátis com seu pedido! {' '}
              <span style={{ color: 'var(--primary-neon)' }}>{selectedCards.length}/{CARDS_PER_ORDER} selecionadas</span>
            </p>
          </motion.div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {(['all', 'common', 'rare', 'ultra-rare'] as const).map(r => (
              <button key={r} onClick={() => setRarityFilter(r)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${rarityFilter === r ? 'text-black border-transparent' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
                style={rarityFilter === r ? { backgroundColor: 'var(--primary-neon)' } : {}}
              >
                {r === 'all' ? 'Todos' : r === 'common' ? '🟫 Common' : r === 'rare' ? '🟦 Rare' : '⭐ Ultra Rare'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-6">
            {filteredCards.map((card) => {
              const cfg = GROUP_CONFIG[card.group];
              const isUR = card.rarity === 'ultra-rare';
              const isRare = card.rarity === 'rare';
              const isSelected = !!selectedCards.find(c => c.id === card.id);
              return (
                <motion.div key={card.id} whileHover={{ scale: 1.06 }}
                  onClick={() => toggleCard(card)}
                  className="cursor-pointer relative overflow-hidden rounded-xl"
                  style={{
                    aspectRatio: '2/3',
                    background: !card.imageUrl ? (isUR ? undefined : cfg.gradient) : undefined,
                    border: isSelected ? '2.5px solid white' : isUR ? '2px solid rgba(255,255,255,0.4)' : isRare ? `1.5px solid ${cfg.accentColor}80` : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: isSelected ? '0 0 20px rgba(255,255,255,0.5)' : isUR ? '0 0 20px rgba(255,0,128,0.4)' : 'none',
                    opacity: (!isSelected && selectedCards.length >= CARDS_PER_ORDER) ? 0.4 : 1,
                  }}
                >
                  {card.imageUrl && <img src={card.imageUrl} alt={card.member} className="absolute inset-0 w-full h-full object-cover object-top" style={{ zIndex: 0 }} />}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,0.8) 100%)', zIndex: 1 }} />
                  {isUR && <div className="shimmer" style={{ zIndex: 2 }} />}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40" style={{ zIndex: 10 }}>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <Check className="w-6 h-6 text-black" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-between p-2" style={{ zIndex: 5 }}>
                    <div className="text-[9px] font-black px-1.5 py-0.5 rounded-full w-fit"
                      style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: isUR ? '#FFD700' : cfg.accentColor, border: isUR ? '1px solid #FFD700' : `1px solid ${cfg.accentColor}` }}>
                      {isUR ? '⭐' : isRare ? '🟦' : '🟫'}
                    </div>
                    {!card.imageUrl && (
                      <div className="flex items-center justify-center flex-1">
                        <div className="flex items-center justify-center rounded-full font-black text-xl"
                          style={{ width: 48, height: 48, backgroundColor: 'rgba(0,0,0,0.4)', border: isUR ? '2px solid rgba(255,255,255,0.5)' : `2px solid ${cfg.accentColor}60`, color: isUR ? '#FFD700' : cfg.accentColor }}>
                          {card.isGroupPhoto ? '♛' : card.member.charAt(0)}
                        </div>
                      </div>
                    )}
                    <div className="rounded-md p-1.5" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
                      <p className="font-black text-[10px] truncate" style={{ color: isUR ? '#FFD700' : cfg.accentColor }}>{card.member}</p>
                      <p className="text-white/50 text-[9px] truncate">{card.groupName}</p>
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
                  style={{ backgroundColor: i < selectedCards.length ? 'var(--primary-neon)' : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setStep('cart')}
                className="px-5 py-3 rounded-xl font-bold text-white bg-white/10 border border-white/20">
                Voltar
              </motion.button>
              <motion.button whileTap={{ scale: 0.98 }}
                onClick={() => selectedCards.length === CARDS_PER_ORDER && setStep('checkout')}
                className="px-6 py-3 rounded-xl font-bold text-black transition-opacity"
                style={{ backgroundColor: 'var(--primary-neon)', opacity: selectedCards.length === CARDS_PER_ORDER ? 1 : 0.4, cursor: selectedCards.length === CARDS_PER_ORDER ? 'pointer' : 'not-allowed' }}>
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
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <h2 className="text-2xl font-bold text-white">Informações de Entrega</h2>

          {/* Dados pessoais */}
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
                placeholder="Nome completo *"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                placeholder="Telefone (opcional)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
            </div>
          </div>

          {/* Endereços salvos */}
          <div className="space-y-2">
            <button onClick={() => setShowAddresses(!showAddresses)}
              className="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors">
              <MapPin className="w-4 h-4" />
              {customerData.addresses.length > 0 ? `Endereços salvos (${customerData.addresses.length})` : 'Endereço de entrega'}
              {showAddresses ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <AnimatePresence>
              {showAddresses && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  {customerData.addresses.map(addr => (
                    <div key={addr.id} className="flex items-center gap-2">
                      <button onClick={() => setCustomerAddress(addr.value)}
                        className={`flex-1 text-left p-3 rounded-xl border text-sm transition-all ${customerAddress === addr.value ? 'border-[var(--primary-neon)] bg-white/10 text-white' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'}`}>
                        <span className="font-bold text-xs" style={{ color: 'var(--primary-neon)' }}>{addr.label}</span>
                        <br />{addr.value}
                      </button>
                      <button onClick={() => handleRemoveAddress(addr.id)} className="p-2 text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/40" />
              <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)}
                placeholder="Digite um endereço (opcional)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
                rows={2} />
            </div>

            {customerAddress.trim() && (
              <div className="flex gap-2">
                <input value={newAddressLabel} onChange={e => setNewAddressLabel(e.target.value)}
                  placeholder="Nome deste endereço (ex: Casa, Trabalho)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                <button onClick={handleSaveAddress}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold text-black"
                  style={{ backgroundColor: 'var(--primary-neon)' }}>
                  <PlusIcon className="w-4 h-4" /> Salvar
                </button>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-white/40" />
            <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)}
              placeholder="Observações (opcional)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
              rows={2} />
          </div>

          {/* Forma de pagamento */}
          <div>
            <p className="text-white font-bold mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" style={{ color: 'var(--primary-neon)' }} />
              Forma de Pagamento
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(['pix', 'dinheiro', 'cartao'] as const).map(method => (
                <button key={method} onClick={() => { setPaymentMethod(method); if (method === 'cartao') setShowCardForm(true); }}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border ${paymentMethod === method ? 'text-black border-transparent' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
                  style={paymentMethod === method ? { backgroundColor: 'var(--primary-neon)' } : {}}>
                  {method === 'pix' ? '🏦 PIX' : method === 'dinheiro' ? '💵 Dinheiro' : '💳 Cartão'}
                </button>
              ))}
            </div>

            {paymentMethod === 'cartao' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                {/* Cartões salvos */}
                {customerData.savedCards.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-white/60 text-sm">Cartões salvos:</p>
                    {customerData.savedCards.map(card => (
                      <div key={card.id} className="flex items-center gap-2">
                        <button onClick={() => handleSelectSavedCard(card)}
                          className={`flex-1 text-left p-3 rounded-xl border text-sm transition-all ${selectedCardId === card.id ? 'border-[var(--primary-neon)] bg-white/10 text-white' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'}`}>
                          <CreditCard className="w-4 h-4 inline mr-2" style={{ color: 'var(--primary-neon)' }} />
                          {card.label} — {card.name} — {card.expiry}
                        </button>
                        <button onClick={() => handleRemoveCard(card.id)} className="p-2 text-red-400 hover:text-red-300">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => { setSelectedCardId(null); setCardNumber(''); setCardName(''); setCardExpiry(''); setCardCvv(''); setShowCardForm(true); }}
                      className="text-sm text-white/60 hover:text-white flex items-center gap-1 transition-colors">
                      <PlusIcon className="w-3 h-3" /> Usar outro cartão
                    </button>
                  </div>
                )}

                {(showCardForm || customerData.savedCards.length === 0) && (
                  <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <input
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="Número do cartão"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 tracking-widest"
                    />
                    <input
                      value={cardName}
                      onChange={e => setCardName(e.target.value.toUpperCase())}
                      placeholder="Nome no cartão"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={cardExpiry}
                        onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/AA"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                      />
                      <input
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="CVV"
                        type="password"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)}
                        className="w-4 h-4 rounded" />
                      <span className="text-white/60 text-sm">Salvar cartão para próximos pedidos</span>
                    </label>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Photocards selecionados */}
          {isKpop && selectedCards.length > 0 && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/60 text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: 'var(--primary-neon)' }} />
                Suas photocards grátis:
              </p>
              <div className="flex gap-3 flex-wrap">
                {selectedCards.map(card => {
                  const cfg = GROUP_CONFIG[card.group];
                  const isUR = card.rarity === 'ultra-rare';
                  return (
                    <div key={card.id} className="relative overflow-hidden rounded-xl"
                      style={{ width: 70, height: 105, backgroundImage: card.imageUrl ? `url(${card.imageUrl})` : undefined, background: !card.imageUrl ? cfg.gradient : undefined, backgroundSize: 'cover', backgroundPosition: 'center top', border: isUR ? '1.5px solid rgba(255,255,255,0.4)' : `1px solid ${cfg.accentColor}` }}>
                      {card.imageUrl && <img src={card.imageUrl} alt={card.member} className="absolute inset-0 w-full h-full object-cover object-top" style={{ zIndex: 0 }} />}
                      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.8) 100%)', zIndex: 1 }} />
                      <div className="absolute bottom-1 left-1 right-1" style={{ zIndex: 2 }}>
                        <p className="text-[8px] font-black truncate" style={{ color: isUR ? '#FFD700' : cfg.accentColor }}>{card.member}</p>
                      </div>
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
              <span className="text-2xl font-bold" style={{ color: 'var(--primary-neon)' }}>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setStep(isKpop && wantPhotocards ? 'photocards' : 'cart')}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-white/10 border border-white/20">
                Voltar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleConfirmOrder}
                className="flex-1 py-3 rounded-xl font-bold text-black"
                style={{ backgroundColor: 'var(--primary-neon)' }}>
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
          className="text-3xl font-bold text-white mb-8">
          Seu Carrinho
        </motion.h1>

        <div className="space-y-4 mb-8">
          {items.map((item, index) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 hover:border-[var(--primary-neon)]/50 transition-all">
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
                        style={{ borderColor: 'var(--primary-neon)' }}>
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="text-white font-bold w-8 text-center">{item.quantidade}</span>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                        className="w-8 h-8 rounded-full border flex items-center justify-center text-white"
                        style={{ borderColor: 'var(--primary-neon)' }}>
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold" style={{ color: 'var(--primary-neon)' }}>
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </span>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Photocards — opcional */}
        {isKpop && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl border"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: wantPhotocards ? 'var(--primary-neon)' : 'rgba(255,255,255,0.1)' }}>
            <label className="flex items-center gap-4 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={wantPhotocards} onChange={e => setWantPhotocards(e.target.checked)} className="sr-only" />
                <div className="w-12 h-6 rounded-full transition-all" style={{ backgroundColor: wantPhotocards ? 'var(--primary-neon)' : 'rgba(255,255,255,0.2)' }}>
                  <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all" style={{ left: wantPhotocards ? '26px' : '2px' }} />
                </div>
              </div>
              <div>
                <p className="text-white font-bold">🎁 Ganhe {CARDS_PER_ORDER} Photocards Grátis!</p>
                <p className="text-white/50 text-sm">
                  {wantPhotocards ? 'Você vai escolher seus cards favoritos' : 'Desativado — finalizar sem photocards'}
                </p>
              </div>
              <Sparkles className="w-6 h-6 ml-auto flex-shrink-0" style={{ color: wantPhotocards ? 'var(--primary-neon)' : 'rgba(255,255,255,0.2)' }} />
            </label>
          </motion.div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 text-lg">Total da Comanda:</span>
            <span className="text-4xl font-bold" style={{ color: 'var(--primary-neon)' }}>R$ {total.toFixed(2)}</span>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setStep(isKpop && wantPhotocards ? 'photocards' : 'checkout')}
            className="w-full py-5 rounded-2xl font-bold text-lg text-black shadow-lg"
            style={{ backgroundColor: 'var(--primary-neon)' }}>
            {isKpop && wantPhotocards ? '✨ ESCOLHER PHOTOCARDS' : 'FINALIZAR PEDIDO'}
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