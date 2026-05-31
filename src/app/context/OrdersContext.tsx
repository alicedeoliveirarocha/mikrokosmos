// src/app/context/OrdersContext.tsx
// SUBSTITUI o arquivo atual — pedidos agora salvos no Supabase com realtime

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Order, OrderItem } from '../../lib/supabase';
import { useAuth } from './AuthContext';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getOrdersByStatus: (status: Order['status']) => Order[];
  cancelOrder: (orderId: string) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Carrega pedidos e ativa realtime
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadOrders();

    // Realtime: cozinha vê novos pedidos instantaneamente
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const loadOrders = async () => {
    // RLS do Supabase já garante: cliente vê só os próprios, staff vê todos
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        user_id: user?.id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar pedido:', error);
      return null;
    }
    return data.id;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    // Realtime vai atualizar automaticamente
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(o => o.status === status);
  };

  const cancelOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, 'cancelado');
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      loading,
      addOrder,
      updateOrderStatus,
      getOrdersByStatus,
      cancelOrder,
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) throw new Error('useOrders must be used within OrdersProvider');
  return context;
}

export type { Order, OrderItem };
