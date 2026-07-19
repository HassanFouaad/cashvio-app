/**
 * WhatsApp "click to chat" link helpers.
 *
 * Egypt-first market reality: most merchants prefer WhatsApp over email or
 * contact forms. Every surface that renders a WhatsApp CTA must hide itself
 * when no number is configured (NEXT_PUBLIC_WHATSAPP_NUMBER / contact phone).
 */

import { env } from '@/config/env';

/**
 * The configured WhatsApp number normalized to wa.me digits, or null.
 */
export function getWhatsAppNumber(): string | null {
  const digits = env.contact.whatsapp.replace(/\D/g, '');
  return digits.length > 0 ? digits : null;
}

/**
 * Build a wa.me deep link with an optional prefilled message.
 * Returns null when no WhatsApp number is configured.
 */
export function getWhatsAppLink(message?: string): string | null {
  const number = getWhatsAppNumber();
  if (!number) return null;

  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${number}${query}`;
}
