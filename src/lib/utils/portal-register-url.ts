/**
 * Where sign-up happens.
 *
 * The portal owns the one sign-up form (email and password, or Google), so
 * this site's /register only forwards there. Every query parameter is kept
 * (pricing `plan`, UTM tags) and `lang` opens the form in the visitor's
 * language.
 */

import { env } from '@/config/env';

/** Portal query parameter that picks the interface language. */
const PORTAL_LANGUAGE_PARAM = 'lang';

export type RegisterQuery = Record<string, string | string[] | undefined>;

export function getPortalRegisterUrl(locale: string, query: RegisterQuery): string {
  const target = new URL(env.portal.registerUrl);

  for (const [key, value] of Object.entries(query)) {
    const values = Array.isArray(value) ? value : value === undefined ? [] : [value];
    for (const item of values) {
      target.searchParams.append(key, item);
    }
  }
  target.searchParams.set(PORTAL_LANGUAGE_PARAM, locale);

  return target.toString();
}
