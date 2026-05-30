import { useState } from 'react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ShoppingBag, User, MapPin, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { getProductImage } from '../utils/productImages';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

export function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState(user?.nome || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleCheckout = () => {
    if (items.length > 0) {
      setShowCheckoutForm(true);
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
          product: {
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            categoria: item.categoria || 'geral',
          },
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
        clearCart();
        setShowCheckoutForm(false);
        navigate('/home');
      } else {
        toast.error('Erro ao enviar pedido. Tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao enviar pedido.');
      console.error(error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-white/20" />
            <h2 className="text-3xl font-bold text-white mb-4">Carrinho Vazio</h2>
            <p className="text-white/60 mb-8">Adicione itens do cardápio para começar seu pedido</p>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-40">
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-8"
        >
          Seu Carrinho
        </motion.h1>

        <div className="space-y-4 mb-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 md:p-6 z-30"
        >
          <div className="max-w-4xl mx-auto">
            {!showCheckoutForm ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 text-lg">Total da Comanda:</span>
                  <span className="text-4xl font-bold" style={{ color: 'var(--primary-neon)' }}>
                    R$ {total.toFixed(2)}
                  </span>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-5 rounded-2xl font-bold text-lg text-black shadow-lg"
                  style={{ backgroundColor: 'var(--primary-neon)', boxShadow: '0 10px 30px rgba(0, 255, 255, 0.3)' }}
                >
                  FINALIZAR PEDIDO
                </motion.button>
                <button onClick={clearCart} className="w-full mt-3 py-3 text-red-400 hover:text-red-300 transition-colors text-sm">
                  Limpar Carrinho
                </button>
              </>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                <h3 className="text-white font-bold text-lg mb-2">Informações de Entrega</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nome completo *"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Telefone (opcional)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                    <textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Endereço de entrega (opcional)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                    <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Observações do pedido (opcional)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all resize-none"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-white/80">Total:</span>
                  <span className="text-2xl font-bold" style={{ color: 'var(--primary-neon)' }}>
                    R$ {total.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCheckoutForm(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Voltar
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmOrder}
                    className="flex-1 py-3 rounded-xl font-bold text-black"
                    style={{ backgroundColor: 'var(--primary-neon)', boxShadow: '0 10px 30px rgba(0, 255, 255, 0.3)' }}
                  >
                    Confirmar Pedido
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
      <UniverseToggle />
    </div>
  );
}
