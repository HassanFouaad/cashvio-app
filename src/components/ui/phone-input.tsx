'use client';

import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import * as React from 'react';
import { createPortal } from 'react-dom';

// ============================================================================
// Country Data
// ============================================================================

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dialCode: string;
  flag: string;
  minLength?: number; // Minimum phone number length (without dial code)
  maxLength?: number; // Maximum phone number length (without dial code)
}

// Top countries for priority display
const PRIORITY_COUNTRIES = ['EG', 'SA', 'AE', 'US', 'GB'];

// Countries that use leading 0 in local format (should be stripped)
const COUNTRIES_WITH_LEADING_ZERO = ['EG', 'SA', 'AE', 'JO', 'KW', 'QA', 'BH', 'OM', 'LB', 'IQ', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'TR', 'IN', 'JP', 'KR', 'AU', 'BR', 'MX', 'ZA', 'NG', 'KE', 'GH'];

// Complete list of countries with dial codes and validation
const COUNTRIES: Country[] = [
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', minLength: 10, maxLength: 10 },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', minLength: 9, maxLength: 9 },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', minLength: 9, maxLength: 9 },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', minLength: 10, maxLength: 10 },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', minLength: 10, maxLength: 11 },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴', minLength: 9, maxLength: 9 },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼', minLength: 8, maxLength: 8 },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', minLength: 8, maxLength: 8 },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭', minLength: 8, maxLength: 8 },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲', minLength: 8, maxLength: 8 },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧', minLength: 7, maxLength: 8 },
  { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶', minLength: 10, maxLength: 10 },
  { code: 'SY', name: 'Syria', dialCode: '+963', flag: '🇸🇾', minLength: 9, maxLength: 9 },
  { code: 'PS', name: 'Palestine', dialCode: '+970', flag: '🇵🇸', minLength: 9, maxLength: 9 },
  { code: 'YE', name: 'Yemen', dialCode: '+967', flag: '🇾🇪', minLength: 9, maxLength: 9 },
  { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾', minLength: 9, maxLength: 9 },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳', minLength: 8, maxLength: 8 },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿', minLength: 9, maxLength: 9 },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦', minLength: 9, maxLength: 9 },
  { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩', minLength: 9, maxLength: 9 },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', minLength: 10, maxLength: 11 },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', minLength: 9, maxLength: 9 },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', minLength: 9, maxLength: 10 },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', minLength: 9, maxLength: 9 },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', minLength: 9, maxLength: 9 },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', minLength: 10, maxLength: 10 },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', minLength: 10, maxLength: 10 },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', minLength: 10, maxLength: 10 },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', minLength: 11, maxLength: 11 },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', minLength: 10, maxLength: 10 },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', minLength: 9, maxLength: 10 },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', minLength: 9, maxLength: 9 },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', minLength: 10, maxLength: 10 },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', minLength: 10, maxLength: 11 },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', minLength: 10, maxLength: 10 },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', minLength: 9, maxLength: 9 },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', minLength: 10, maxLength: 10 },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', minLength: 9, maxLength: 9 },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', minLength: 9, maxLength: 9 },
].sort((a, b) => {
  // Priority countries first
  const aPriority = PRIORITY_COUNTRIES.indexOf(a.code);
  const bPriority = PRIORITY_COUNTRIES.indexOf(b.code);

  if (aPriority !== -1 && bPriority === -1) return -1;
  if (aPriority === -1 && bPriority !== -1) return 1;
  if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;

  return a.name.localeCompare(b.name);
});

// Longest dial codes first so "+212" never resolves to "+21"
const COUNTRIES_BY_DIAL_CODE_LENGTH = [...COUNTRIES].sort(
  (a, b) => b.dialCode.length - a.dialCode.length
);

function findCountryByDialCode(fullNumber: string): Country | undefined {
  return COUNTRIES_BY_DIAL_CODE_LENGTH.find((country) =>
    fullNumber.startsWith(country.dialCode)
  );
}

function clampToMaxLength(country: Country, nationalNumber: string): string {
  return country.maxLength
    ? nationalNumber.slice(0, country.maxLength)
    : nationalNumber;
}

// ============================================================================
// Dropdown Positioning
// ============================================================================

const DROPDOWN_MIN_WIDTH = 240;
const DROPDOWN_MAX_WIDTH = 340;
const DROPDOWN_MAX_HEIGHT = 300;
const DROPDOWN_GAP = 4;
/** Breathing room kept between the panel and the viewport edges */
const VIEWPORT_MARGIN = 8;

/**
 * The panel is portalled to the body so the receipt cards that wrap these
 * forms (they clip with `overflow: hidden`) can't cut it off. That means the
 * position has to be measured off the field on every open, scroll and resize.
 * The field is always LTR, so the panel anchors to its left edge.
 */
function computePanelStyle(field: HTMLElement): React.CSSProperties {
  const rect = field.getBoundingClientRect();
  const { innerWidth, innerHeight } = window;

  const width = Math.min(
    Math.max(rect.width, DROPDOWN_MIN_WIDTH),
    Math.max(DROPDOWN_MIN_WIDTH, innerWidth - VIEWPORT_MARGIN * 2),
    DROPDOWN_MAX_WIDTH
  );

  const spaceBelow = innerHeight - rect.bottom - VIEWPORT_MARGIN;
  const spaceAbove = rect.top - VIEWPORT_MARGIN;
  const openUpward = spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow;
  const maxHeight = Math.min(
    DROPDOWN_MAX_HEIGHT,
    Math.max(160, (openUpward ? spaceAbove : spaceBelow) - DROPDOWN_GAP)
  );

  const left = Math.min(
    Math.max(VIEWPORT_MARGIN, rect.left),
    Math.max(VIEWPORT_MARGIN, innerWidth - width - VIEWPORT_MARGIN)
  );

  return openUpward
    ? { left, width, maxHeight, bottom: innerHeight - rect.top + DROPDOWN_GAP }
    : { left, width, maxHeight, top: rect.bottom + DROPDOWN_GAP };
}

// ============================================================================
// Phone Input Component
// ============================================================================

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  defaultCountry?: string;
  error?: boolean;
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      value = '',
      onChange,
      defaultCountry = 'EG',
      error,
      disabled,
      ...props
    },
    ref
  ) => {
    const t = useTranslations('common.phoneInput');
    const locale = useLocale();
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [panelStyle, setPanelStyle] = React.useState<React.CSSProperties | null>(null);
    // Only remembers the dropdown pick; once a number exists the country is
    // read back out of the value so the field stays fully controlled
    const [pickedCountry, setPickedCountry] = React.useState<Country>(
      () => COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0]
    );

    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const fieldRef = React.useRef<HTMLDivElement>(null);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const { selectedCountry, phoneNumber } = React.useMemo(() => {
      if (!value) {
        return { selectedCountry: pickedCountry, phoneNumber: '' };
      }

      // Prefer the dropdown pick when it fits, so countries that share a dial
      // code (US and Canada) don't flip back on every keystroke
      const matched = value.startsWith(pickedCountry.dialCode)
        ? pickedCountry
        : findCountryByDialCode(value);

      if (!matched) {
        return { selectedCountry: pickedCountry, phoneNumber: value.replace(/\D/g, '') };
      }

      return {
        selectedCountry: matched,
        phoneNumber: value.slice(matched.dialCode.length).replace(/\D/g, ''),
      };
    }, [value, pickedCountry]);

    const countryLabels = React.useMemo(() => {
      let regionNames: Intl.DisplayNames | null = null;
      try {
        regionNames = new Intl.DisplayNames([locale], { type: 'region' });
      } catch {
        regionNames = null;
      }

      return new Map(
        COUNTRIES.map((country) => {
          let localized: string | undefined;
          try {
            localized = regionNames?.of(country.code);
          } catch {
            localized = undefined;
          }
          // Intl falls back to the raw code for regions it doesn't know
          return [
            country.code,
            localized && localized !== country.code ? localized : country.name,
          ];
        })
      );
    }, [locale]);

    const updatePanelPosition = React.useCallback(() => {
      if (fieldRef.current) {
        setPanelStyle(computePanelStyle(fieldRef.current));
      }
    }, []);

    const closeDropdown = React.useCallback(() => {
      setIsOpen(false);
      setSearchQuery('');
    }, []);

    // Measured before the panel renders so it never paints at a stale position
    const openDropdown = React.useCallback(() => {
      updatePanelPosition();
      setIsOpen(true);
    }, [updatePanelPosition]);

    React.useEffect(() => {
      if (!isOpen) return;

      const handlePointerDown = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (
          !dropdownRef.current?.contains(target) &&
          !panelRef.current?.contains(target)
        ) {
          closeDropdown();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') closeDropdown();
      };

      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('touchstart', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      // Capture phase so the panel follows scrolling in any ancestor container
      window.addEventListener('scroll', updatePanelPosition, true);
      window.addEventListener('resize', updatePanelPosition);

      // Autofocusing search on a phone raises the keyboard over the list, so
      // the shortcut is reserved for pointer devices
      const focusTimer = window.setTimeout(() => {
        if (window.matchMedia('(pointer: fine)').matches) {
          searchInputRef.current?.focus();
        }
      }, 60);

      return () => {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('touchstart', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('scroll', updatePanelPosition, true);
        window.removeEventListener('resize', updatePanelPosition);
        window.clearTimeout(focusTimer);
      };
    }, [isOpen, closeDropdown, updatePanelPosition]);

    // Filter countries based on search
    const filteredCountries = React.useMemo(() => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return COUNTRIES;

      return COUNTRIES.filter(
        (country) =>
          (countryLabels.get(country.code) ?? country.name).toLowerCase().includes(query) ||
          country.name.toLowerCase().includes(query) ||
          country.dialCode.includes(query) ||
          country.code.toLowerCase().includes(query)
      );
    }, [searchQuery, countryLabels]);

    const emitChange = (country: Country, nationalNumber: string) => {
      const clamped = clampToMaxLength(country, nationalNumber);
      onChange?.(clamped ? `${country.dialCode}${clamped}` : '');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.trim();
      const digits = raw.replace(/\D/g, '');

      // A pasted or autofilled number can carry its own country code
      const international = raw.startsWith('+')
        ? `+${digits}`
        : digits.startsWith('00') && digits.length > 2
          ? `+${digits.slice(2)}`
          : null;

      if (international) {
        const matched = findCountryByDialCode(international);
        if (matched) {
          setPickedCountry(matched);
          emitChange(matched, international.slice(matched.dialCode.length));
          return;
        }
      }

      // Local habit: numbers written with a trunk "0" the dial code replaces
      const national =
        digits.startsWith('0') && COUNTRIES_WITH_LEADING_ZERO.includes(selectedCountry.code)
          ? digits.replace(/^0+/, '')
          : digits;

      emitChange(selectedCountry, national);
    };

    const handleCountrySelect = (country: Country) => {
      setPickedCountry(country);
      closeDropdown();
      emitChange(country, phoneNumber);
      inputRef.current?.focus();
    };

    return (
      // The control stays LTR in every language: the number is always typed in
      // Latin digits, so mirroring it in Arabic only moves the dial code away
      // from where people expect it.
      <div className={cn('relative w-full', className)} ref={dropdownRef} dir="ltr">
        <div
          ref={fieldRef}
          className={cn(
            'flex h-11 w-full items-stretch border-0 border-b border-dashed bg-transparent text-sm transition-colors',
            error ? 'border-destructive' : 'border-ledger-line',
            'focus-within:border-primary',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {/* Country Selector */}
          <button
            type="button"
            onClick={() => !disabled && (isOpen ? closeDropdown() : openDropdown())}
            className={cn(
              'flex shrink-0 items-center gap-1.5 border-e border-dashed border-ledger-line ps-1 pe-2.5',
              'hover:text-foreground transition-colors',
              disabled && 'pointer-events-none'
            )}
            disabled={disabled}
            aria-label={t('selectCountry')}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span className="w-6 shrink-0 text-center text-base leading-none" aria-hidden="true">
              {selectedCountry.flag}
            </span>
            <span className="text-muted-foreground text-xs font-medium tabular-nums">
              {selectedCountry.dialCode}
            </span>
            <ChevronDownIcon
              className={cn(
                'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Phone Number Input */}
          <input
            {...props}
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            disabled={disabled}
            className={cn(
              'paper-input-bare min-w-0 flex-1 bg-transparent px-2 py-2 outline-none',
              'placeholder:text-muted-foreground/70'
            )}
          />
        </div>

        {/* Country Dropdown */}
        {isOpen &&
          panelStyle &&
          createPortal(
            <div
              ref={panelRef}
              style={panelStyle}
              dir="ltr"
              className={cn(
                'fixed z-50 flex flex-col overflow-hidden rounded-xl border border-border',
                'bg-background/95 shadow-lg backdrop-blur-xl'
              )}
            >
              {/* Search Input */}
              <div className="shrink-0 p-2 border-b border-dashed border-ledger-line">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t('searchCountries')}
                  aria-label={t('searchCountries')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 text-sm rounded-md border border-border bg-background',
                    'outline-none focus:border-primary'
                  )}
                />
              </div>

              {/* Country List */}
              <div
                role="listbox"
                aria-label={t('selectCountry')}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
              >
                {filteredCountries.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    {t('noCountriesFound')}
                  </div>
                ) : (
                  filteredCountries.map((country) => {
                    const isSelected = selectedCountry.code === country.code;

                    return (
                      <button
                        key={country.code}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleCountrySelect(country)}
                        className={cn(
                          'flex w-full items-center gap-2.5 px-3 py-2 text-sm',
                          'hover:bg-muted transition-colors',
                          isSelected && 'bg-muted'
                        )}
                      >
                        <span className="w-6 shrink-0 text-center text-base leading-none" aria-hidden="true">
                          {country.flag}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-start">
                          {countryLabels.get(country.code) ?? country.name}
                        </span>
                        <span className="shrink-0 text-muted-foreground tabular-nums">
                          {country.dialCode}
                        </span>
                        <CheckIcon
                          className={cn(
                            'h-4 w-4 shrink-0 text-primary',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </button>
                    );
                  })
                )}
              </div>
            </div>,
            document.body
          )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

/**
 * Validate phone number based on country
 * @param fullNumber - Full phone number with dial code (e.g., +201234567890)
 * @returns Object with isValid, minLength, maxLength, and currentLength
 */
export function validatePhoneNumber(fullNumber: string): {
  isValid: boolean;
  minLength: number;
  maxLength: number;
  currentLength: number;
  country: Country | null;
} {
  if (!fullNumber) {
    return { isValid: false, minLength: 0, maxLength: 0, currentLength: 0, country: null };
  }

  const matchedCountry = findCountryByDialCode(fullNumber);

  if (!matchedCountry) {
    return { isValid: false, minLength: 0, maxLength: 0, currentLength: fullNumber.length, country: null };
  }

  const numberWithoutDialCode = fullNumber.slice(matchedCountry.dialCode.length);
  const currentLength = numberWithoutDialCode.length;
  const minLength = matchedCountry.minLength || 7;
  const maxLength = matchedCountry.maxLength || 15;

  const isValid = currentLength >= minLength && currentLength <= maxLength;

  return {
    isValid,
    minLength,
    maxLength,
    currentLength,
    country: matchedCountry,
  };
}

export { COUNTRIES, COUNTRIES_WITH_LEADING_ZERO };
