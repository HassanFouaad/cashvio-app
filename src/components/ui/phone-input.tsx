'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

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

// ============================================================================
// Phone Input Component
// ============================================================================

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  defaultCountry?: string;
  error?: boolean;
  dir?: 'ltr' | 'rtl';
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      value = '',
      onChange,
      defaultCountry = 'EG',
      error,
      dir = 'ltr',
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCountry, setSelectedCountry] = React.useState<Country>(
      () => COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0]
    );
    const [phoneNumber, setPhoneNumber] = React.useState('');

    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Parse initial value
    React.useEffect(() => {
      if (value) {
        // Try to extract country code from value
        const matchedCountry = COUNTRIES.find((country) =>
          value.startsWith(country.dialCode)
        );
        if (matchedCountry) {
          setSelectedCountry(matchedCountry);
          setPhoneNumber(value.slice(matchedCountry.dialCode.length).trim());
        } else {
          setPhoneNumber(value);
        }
      }
    }, []);

    // Close dropdown on outside click
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchQuery('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter countries based on search
    const filteredCountries = React.useMemo(() => {
      if (!searchQuery) return COUNTRIES;

      const query = searchQuery.toLowerCase();
      return COUNTRIES.filter(
        (country) =>
          country.name.toLowerCase().includes(query) ||
          country.dialCode.includes(query) ||
          country.code.toLowerCase().includes(query)
      );
    }, [searchQuery]);

    // Handle phone number change - strips leading 0 for countries that use it locally
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newNumber = e.target.value.replace(/[^\d]/g, '');
      
      // Strip leading 0 for countries that use it locally (e.g., Egypt 01234567890 -> 1234567890)
      if (newNumber.startsWith('0') && COUNTRIES_WITH_LEADING_ZERO.includes(selectedCountry.code)) {
        newNumber = newNumber.slice(1);
      }
      
      // Limit to maxLength if defined
      if (selectedCountry.maxLength && newNumber.length > selectedCountry.maxLength) {
        newNumber = newNumber.slice(0, selectedCountry.maxLength);
      }
      
      setPhoneNumber(newNumber);
      onChange?.(`${selectedCountry.dialCode}${newNumber}`);
    };

    // Handle country selection
    const handleCountrySelect = (country: Country) => {
      setSelectedCountry(country);
      setIsOpen(false);
      setSearchQuery('');
      onChange?.(`${country.dialCode}${phoneNumber}`);
      inputRef.current?.focus();
    };

    return (
      <div className={cn('relative', className)} dir={dir} ref={dropdownRef}>
        <div
          className={cn(
            'flex h-11 w-full rounded-lg border bg-background text-sm transition-colors',
            error
              ? 'border-destructive focus-within:ring-destructive/30'
              : 'border-input focus-within:ring-ring/30',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {/* Country Selector */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'flex items-center gap-1.5 px-3 border-r border-input bg-muted/50 rounded-l-lg',
              'hover:bg-muted transition-colors',
              disabled && 'pointer-events-none',
              dir === 'rtl' && 'order-last rounded-l-none rounded-r-lg border-r-0 border-l border-input'
            )}
            disabled={disabled}
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-muted-foreground text-xs font-medium">
              {selectedCountry.dialCode}
            </span>
            <svg
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                isOpen && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Phone Number Input */}
          <input
            ref={(node) => {
              // Handle both refs
              inputRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="tel"
            inputMode="numeric"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={cn(
              'flex-1 px-3 py-2 bg-transparent outline-none',
              'placeholder:text-muted-foreground',
              dir === 'rtl' && 'text-right'
            )}
            disabled={disabled}
            {...props}
          />
        </div>

        {/* Country Dropdown */}
        {isOpen && (
          <div
            className={cn(
              'absolute z-50 mt-1 w-full rounded-lg border border-input bg-background shadow-lg',
              'max-h-64 overflow-hidden'
            )}
          >
            {/* Search Input */}
            <div className="p-2 border-b border-input">
              <input
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-full px-3 py-2 text-sm rounded-md border border-input bg-background',
                  'outline-none focus:ring-2 focus:ring-ring/30'
                )}
                autoFocus
              />
            </div>

            {/* Country List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredCountries.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No countries found
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={cn(
                      'flex w-full items-center gap-3 px-3 py-2 text-sm',
                      'hover:bg-muted transition-colors',
                      selectedCountry.code === country.code && 'bg-muted'
                    )}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-start">{country.name}</span>
                    <span className="text-muted-foreground">
                      {country.dialCode}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
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

  // Find matching country by dial code
  const matchedCountry = COUNTRIES.find((country) =>
    fullNumber.startsWith(country.dialCode)
  );

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

