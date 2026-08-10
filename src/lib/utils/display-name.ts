/**
 * Normalize + validate pipeline for tenant/business display names.
 * Keep in sync with backend `src/shared/utils/display-name.utils.ts`.
 */

export const DISPLAY_NAME_MIN_LENGTH = 2;
export const DISPLAY_NAME_MAX_LENGTH = 100;

const ZERO_WIDTH_OR_BOM = /[\u200B-\u200D\uFEFF]/g;
const HAS_LETTER = /\p{L}/u;
/** Letters, numbers, spaces, and & ' . , - ( ) / + ! */
const ALLOWED_CHARS = /^[\p{L}\p{N} &'.,\-()/+!]+$/u;

/**
 * Display-name validation failure codes (after normalize).
 * Values match backend DisplayNameValidationError.
 */
export enum DisplayNameValidationError {
  REQUIRED = 'REQUIRED',
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  MUST_CONTAIN_LETTER = 'MUST_CONTAIN_LETTER',
  INVALID_CHARS = 'INVALID_CHARS',
}

export type DisplayNameParseResult =
  | { ok: true; value: string }
  | { ok: false; error: DisplayNameValidationError };

/**
 * Shared display-name helpers (registration business name, etc.).
 */
export class DisplayNameUtils {
  /**
   * NFKC → strip zero-width/BOM → trim ends → collapse internal whitespace.
   */
  static normalize(value: string): string {
    return value
      .normalize('NFKC')
      .replace(ZERO_WIDTH_OR_BOM, '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  /**
   * Validate an already-normalized display name.
   * Returns an error code, or null when valid.
   */
  static getValidationError(
    normalized: string,
  ): DisplayNameValidationError | null {
    if (!normalized) {
      return DisplayNameValidationError.REQUIRED;
    }

    if (normalized.length < DISPLAY_NAME_MIN_LENGTH) {
      return DisplayNameValidationError.TOO_SHORT;
    }

    if (normalized.length > DISPLAY_NAME_MAX_LENGTH) {
      return DisplayNameValidationError.TOO_LONG;
    }

    if (!HAS_LETTER.test(normalized)) {
      return DisplayNameValidationError.MUST_CONTAIN_LETTER;
    }

    if (!ALLOWED_CHARS.test(normalized)) {
      return DisplayNameValidationError.INVALID_CHARS;
    }

    return null;
  }

  /**
   * Normalize then validate. Returns the normalized value, or an error code.
   */
  static parse(value: string): DisplayNameParseResult {
    const normalized = DisplayNameUtils.normalize(value);
    const error = DisplayNameUtils.getValidationError(normalized);

    if (error) {
      return { ok: false, error };
    }

    return { ok: true, value: normalized };
  }
}
