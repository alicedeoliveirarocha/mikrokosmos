// src/app/utils/customResponses.ts
// FIX i18n: as mensagens agora vêm dos arquivos de locale (namespace "customResponses")
// em vez de texto fixo em PT. Como usamos o singleton do i18next, as funções
// getCustomResponse() e getWelcomeMessage() mantêm EXATAMENTE a mesma assinatura —
// nenhum componente que as usa precisa mudar.
import i18next from 'i18next';
import { UserRole } from '../context/AuthContext';

export interface CustomResponse {
  title: string;
  message: string;
  icon?: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
}

// Os variants (cor/estilo do toast) não são texto, então ficam no código.
// As chaves aqui também servem de "índice" do que existe em cada role.
const VARIANTS: Record<string, Record<string, CustomResponse['variant']>> = {
  cliente: {
    welcome: 'info',
    orderPlaced: 'success',
    orderCanceled: 'warning',
    cartEmpty: 'info',
    noAccess: 'error',
  },
  cozinha: {
    welcome: 'info',
    orderReceived: 'info',
    orderReady: 'success',
    orderStarted: 'info',
    noOrders: 'info',
  },
  delivery: {
    welcome: 'info',
    orderPicked: 'success',
    orderDelivered: 'success',
    noDeliveries: 'info',
  },
  admin: {
    welcome: 'info',
    systemUpdate: 'success',
    userCreated: 'success',
    dataExported: 'success',
  },
  universal: {
    error: 'error',
    success: 'success',
    loading: 'info',
    saved: 'success',
  },
};

// Função helper para obter mensagens personalizadas — agora traduzidas
export function getCustomResponse(
  role: UserRole,
  responseKey: string
): CustomResponse {
  const t = i18next.t.bind(i18next);

  // Tenta buscar response específica do role
  const roleVariants = VARIANTS[role];
  if (roleVariants && responseKey in roleVariants) {
    return {
      title: t(`customResponses.${role}.${responseKey}.title`),
      message: t(`customResponses.${role}.${responseKey}.message`),
      variant: roleVariants[responseKey],
    };
  }

  // Fallback para respostas universais
  if (responseKey in VARIANTS.universal) {
    return {
      title: t(`customResponses.universal.${responseKey}.title`),
      message: t(`customResponses.universal.${responseKey}.message`),
      variant: VARIANTS.universal[responseKey],
    };
  }

  // Fallback final
  return {
    title: t('customResponses.fallback.title'),
    message: t('customResponses.fallback.message'),
    variant: 'info',
  };
}

// Sistema de mensagens de boas-vindas baseado em horário + role — agora traduzido.
// A ordem de "{{greeting}}" e "{{name}}" é definida NO locale de cada idioma,
// porque em coreano/japonês a saudação vem depois do nome ("Alice님, 좋은 저녁입니다!").
export function getWelcomeMessage(role: UserRole, userName?: string): CustomResponse {
  const t = i18next.t.bind(i18next);
  const hour = new Date().getHours();

  let period: 'morning' | 'afternoon' | 'evening';
  if (hour >= 5 && hour < 12) period = 'morning';
  else if (hour >= 12 && hour < 18) period = 'afternoon';
  else period = 'evening';

  const greeting = t(`customResponses.greetings.${period}`);
  const name = userName || t('customResponses.defaultName');

  const message = t(`customResponses.welcomeByRole.${role}`, {
    greeting,
    name,
    defaultValue: t('customResponses.welcomeByRole.generic', { greeting, name }),
  });

  return {
    title: `${greeting}!`,
    message,
    variant: 'info',
  };
}

// Armazenar preferências de notificação no localStorage (sem mudanças)
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