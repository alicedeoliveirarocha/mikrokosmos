import { UserRole } from '../context/AuthContext';

// Sistema de Custom Responses - Mensagens personalizadas por papel do usuário
export interface CustomResponse {
  title: string;
  message: string;
  icon?: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
}

// Mensagens customizadas por role
export const customResponses = {
  // Respostas para CLIENTE
  cliente: {
    welcome: {
      title: '✨ Bem-vindo ao Mikrokosmos!',
      message: 'Explore nosso cardápio temático e faça seu pedido.',
      variant: 'info' as const,
    },
    orderPlaced: {
      title: '🎉 Pedido Realizado!',
      message: 'Seu pedido foi confirmado e já está sendo preparado com carinho.',
      variant: 'success' as const,
    },
    orderCanceled: {
      title: '❌ Pedido Cancelado',
      message: 'Seu pedido foi cancelado. Esperamos vê-lo novamente em breve!',
      variant: 'warning' as const,
    },
    cartEmpty: {
      title: '🛒 Carrinho Vazio',
      message: 'Adicione produtos incríveis ao seu carrinho para começar.',
      variant: 'info' as const,
    },
    noAccess: {
      title: '🚫 Acesso Negado',
      message: 'Você não tem permissão para acessar esta área.',
      variant: 'error' as const,
    },
  },

  // Respostas para COZINHA
  cozinha: {
    welcome: {
      title: '👨‍🍳 Bem-vindo à Cozinha!',
      message: 'Gerencie os pedidos e mantenha a qualidade Mikrokosmos.',
      variant: 'info' as const,
    },
    orderReceived: {
      title: '🔔 Novo Pedido!',
      message: 'Um novo pedido chegou! Prepare com excelência.',
      variant: 'info' as const,
    },
    orderReady: {
      title: '✅ Pedido Pronto!',
      message: 'Pedido finalizado e pronto para entrega.',
      variant: 'success' as const,
    },
    orderStarted: {
      title: '🔥 Pedido em Preparo',
      message: 'Pedido marcado como "preparando". Vamos lá, chef!',
      variant: 'info' as const,
    },
    noOrders: {
      title: '😌 Tudo Tranquilo',
      message: 'Nenhum pedido pendente no momento.',
      variant: 'info' as const,
    },
  },

  // Respostas para DELIVERY
  delivery: {
    welcome: {
      title: '🚴 Central de Delivery!',
      message: 'Gerencie entregas e mantenha os clientes felizes.',
      variant: 'info' as const,
    },
    orderPicked: {
      title: '📦 Pedido Coletado!',
      message: 'Pedido retirado e a caminho do cliente.',
      variant: 'success' as const,
    },
    orderDelivered: {
      title: '🎊 Entrega Concluída!',
      message: 'Pedido entregue com sucesso. Ótimo trabalho!',
      variant: 'success' as const,
    },
    noDeliveries: {
      title: '✌️ Sem Entregas',
      message: 'Nenhuma entrega pendente no momento.',
      variant: 'info' as const,
    },
  },

  // Respostas para ADMIN
  admin: {
    welcome: {
      title: '👑 Painel Administrativo',
      message: 'Acesso total ao sistema Mikrokosmos.',
      variant: 'info' as const,
    },
    systemUpdate: {
      title: '🔄 Sistema Atualizado',
      message: 'As configurações do sistema foram atualizadas com sucesso.',
      variant: 'success' as const,
    },
    userCreated: {
      title: '👤 Usuário Criado',
      message: 'Novo usuário adicionado ao sistema.',
      variant: 'success' as const,
    },
    dataExported: {
      title: '📊 Exportação Completa',
      message: 'Dados exportados com sucesso.',
      variant: 'success' as const,
    },
  },

  // Respostas universais (qualquer role)
  universal: {
    error: {
      title: '⚠️ Erro',
      message: 'Algo deu errado. Tente novamente.',
      variant: 'error' as const,
    },
    success: {
      title: '✅ Sucesso!',
      message: 'Operação realizada com sucesso.',
      variant: 'success' as const,
    },
    loading: {
      title: '⏳ Carregando...',
      message: 'Processando sua solicitação.',
      variant: 'info' as const,
    },
    saved: {
      title: '💾 Salvo!',
      message: 'Suas alterações foram salvas.',
      variant: 'success' as const,
    },
  },
};

// Função helper para obter mensagens personalizadas
export function getCustomResponse(
  role: UserRole,
  responseKey: string
): CustomResponse {
  // Tenta buscar response específica do role
  if (role in customResponses) {
    const roleResponses = customResponses[role as keyof typeof customResponses];
    if (responseKey in roleResponses) {
      return roleResponses[responseKey as keyof typeof roleResponses];
    }
  }

  // Fallback para respostas universais
  if (responseKey in customResponses.universal) {
    return customResponses.universal[responseKey as keyof typeof customResponses.universal];
  }

  // Fallback final
  return {
    title: 'Notificação',
    message: 'Ação realizada.',
    variant: 'info',
  };
}

// Sistema de mensagens de boas-vindas baseado em horário + role
export function getWelcomeMessage(role: UserRole, userName?: string): CustomResponse {
  const hour = new Date().getHours();
  let greeting = '';

  if (hour >= 5 && hour < 12) greeting = 'Bom dia';
  else if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
  else greeting = 'Boa noite';

  const name = userName || 'usuário';

  const roleMessages = {
    cliente: `${greeting}, ${name}! 🌟 Explore nosso universo gastronômico K-pop.`,
    cozinha: `${greeting}, Chef ${name}! 👨‍🍳 Pronto para criar pratos incríveis?`,
    delivery: `${greeting}, ${name}! 🚴 Vamos entregar felicidade hoje!`,
    admin: `${greeting}, ${name}! 👑 Sistema Mikrokosmos ao seu comando.`,
  };

  return {
    title: `${greeting}!`,
    message: roleMessages[role] || `${greeting}, ${name}!`,
    variant: 'info',
  };
}

// Armazenar preferências de notificação no localStorage
export function saveNotificationPreference(userId: string, enabled: boolean) {
  try {
    const prefs = JSON.parse(localStorage.getItem('mikrokosmos_notification_prefs') || '{}');
    prefs[userId] = enabled;
    localStorage.setItem('mikrokosmos_notification_prefs', JSON.stringify(prefs));
  } catch (error) {
    console.error('Erro ao salvar preferência de notificação:', error);
  }
}

export function getNotificationPreference(userId: string): boolean {
  try {
    const prefs = JSON.parse(localStorage.getItem('mikrokosmos_notification_prefs') || '{}');
    return prefs[userId] !== false; // Default: habilitado
  } catch (error) {
    return true;
  }
}
