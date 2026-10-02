/**
 * Google Identity Services (GIS) typings
 *
 * Minimal declarations for `window.google.accounts.id`, covering only what
 * the register page uses. Reference:
 * https://developers.google.com/identity/gsi/web/reference/js-reference
 */

/** GIS answer after the account chooser. */
export interface GoogleCredentialResponse {
  /** The Google ID token (JWT). Never log it or send it to analytics. */
  credential?: string;
  select_by?: string;
}

/**
 * `google.accounts.id.initialize` options. `ux_mode` is pinned to popup:
 * redirect mode POSTs from accounts.google.com, which the API rejects.
 */
export interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  ux_mode: 'popup';
  auto_select: boolean;
  cancel_on_tap_outside: boolean;
}

export type GoogleButtonTheme = 'outline' | 'filled_blue' | 'filled_black';

/** `google.accounts.id.renderButton` options. */
export interface GoogleButtonConfiguration {
  type: 'standard' | 'icon';
  theme: GoogleButtonTheme;
  size: 'large' | 'medium' | 'small';
  text: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment: 'left' | 'center';
  /** Button language, e.g. `en` or `ar`. */
  locale: string;
  /** Button width in pixels (Google accepts 200 to 400). */
  width: number;
}

export interface GoogleAccountsId {
  initialize: (configuration: GoogleIdConfiguration) => void;
  renderButton: (
    parent: HTMLElement,
    options: GoogleButtonConfiguration
  ) => void;
}

export interface GoogleIdentityServices {
  accounts: {
    id: GoogleAccountsId;
  };
}

declare global {
  interface Window {
    /** Set by https://accounts.google.com/gsi/client once it loads. */
    google?: GoogleIdentityServices;
  }
}
