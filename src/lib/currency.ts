// src/lib/currency.ts
// ═══════════════════════════════════════════════════════════════
// Moeda por idioma — MIKROKOSMOS
//
// Filosofia (a mesma dos roles/status): o DADO nunca muda.
// Todo preço no products.ts, carrinho, pedidos e analytics é BRL.
// A conversão acontece só na EXIBIÇÃO, seguindo o idioma ativo.
//
// DEMO: taxas fixas neste arquivo (sem chamada de API, sem billing).
// Na trilha SaaS, este é o único arquivo que muda: as taxas passam
// a vir de uma API de câmbio ou de config por tenant.
// ═══════════════════════════════════════════════════════════════

import { useTranslation } from 'react-i18next';

export type CurrencyCode = 'BRL' | 'USD' | 'EUR' | 'KRW' | 'JPY' | 'CNY';

/** Moeda exibida para cada idioma do app */
const CURRENCY_BY_LANG: Record<string, CurrencyCode> = {
  'pt-BR': 'BRL',
  en: 'USD',
  es: 'EUR',
  ko: 'KRW',
  ja: 'JPY',
  zh: 'CNY',
};

/**
 * Taxas de câmbio FIXAS para o demo: 1 BRL = X da moeda alvo.
 * Valores aproximados — edite à vontade; só afetam a exibição.
 */
const RATES_FROM_BRL: Record<CurrencyCode, number> = {
  BRL: 1,
  USD: 0.19,
  EUR: 0.17,
  KRW: 255,
  JPY: 28,
  CNY: 1.32,
};

/** Resolve a moeda do idioma ('ko' → KRW). Fallback: BRL. */
export function currencyForLang(lang: string): CurrencyCode {
  // cobre variantes tipo 'en-US', 'es-MX', 'zh-CN'
  const exact = CURRENCY_BY_LANG[lang];
  if (exact) return exact;
  const base = lang.split('-')[0];
  return CURRENCY_BY_LANG[base] ?? 'BRL';
}

/** Converte um valor em BRL para a moeda alvo (número cru, sem formatação). */
export function convertFromBRL(valueBRL: number, currency: CurrencyCode): number {
  return valueBRL * RATES_FROM_BRL[currency];
}

/**
 * Formata um valor BRL na moeda e convenções do idioma ativo.
 *
 *   formatCurrency(46, 'pt-BR') → "R$ 46,00"
 *   formatCurrency(46, 'en')    → "$8.74"
 *   formatCurrency(46, 'ko')    → "₩11,730"   (KRW não usa centavos)
 *   formatCurrency(46, 'ja')    → "￥1,288"    (JPY também não)
 *
 * O Intl.NumberFormat cuida sozinho do símbolo, separadores
 * e casas decimais corretas de cada moeda — zero if/else nosso.
 */
export function formatCurrency(valueBRL: number, lang: string): string {
  const currency = currencyForLang(lang);
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency,
  }).format(convertFromBRL(valueBRL, currency));
}

/**
 * Hook para componentes: já amarrado no i18n.language.
 *
 *   const { format } = useCurrency();
 *   <span>{format(product.preco)}</span>
 *
 * Trocou o idioma no seletor → todos os preços re-renderizam
 * na moeda nova, sem tocar em estado nenhum.
 */
export function useCurrency() {
  const { i18n } = useTranslation();
  const format = (valueBRL: number) => formatCurrency(valueBRL, i18n.language);
  const currency = currencyForLang(i18n.language);
  return { format, currency };
}