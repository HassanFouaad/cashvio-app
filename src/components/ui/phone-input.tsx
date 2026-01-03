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
}

// Top countries for priority display
const PRIORITY_COUNTRIES = ['EG', 'SA', 'AE', 'US', 'GB'];

// Complete list of countries with dial codes
const COUNTRIES: Country[] = [
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
  { code: 'SY', name: 'Syria', dialCode: '+963', flag: '🇸🇾' },
  { code: 'PS', name: 'Palestine', dialCode: '+970', flag: '🇵🇸' },
  { code: 'YE', name: 'Yemen', dialCode: '+967', flag: '🇾🇪' },
  { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
  { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
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

    // Handle phone number change
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newNumber = e.target.value.replace(/[^\d]/g, '');
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

export { COUNTRIES };

