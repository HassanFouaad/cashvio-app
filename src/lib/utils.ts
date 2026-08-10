/**
 * Utility functions
 * Re-exports from utils folder for convenient imports
 */

// Re-export cn utility
export { cn } from './utils/cn';

// Re-export display-name normalize/validate pipeline
export {
  DISPLAY_NAME_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
  DisplayNameUtils,
  DisplayNameValidationError,
  type DisplayNameParseResult,
} from './utils/display-name';

// Re-export WhatsApp link helpers
export { getWhatsAppLink, getWhatsAppNumber } from './utils/whatsapp';

