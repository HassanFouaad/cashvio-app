export const themeConfig = {
  colors: {
    primary: {
      light: '168 84% 39%',    // Teal/Green - represents money/growth
      dark: '168 84% 45%',
    },
    secondary: {
      light: '221 83% 53%',    // Blue - trust/professionalism  
      dark: '221 83% 60%',
    },
    accent: {
      light: '45 93% 47%',     // Gold/Yellow - premium/value
      dark: '45 93% 55%',
    },
  },

  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  fonts: {
    sans: 'Inter',
    mono: 'JetBrains Mono',
    arabic: 'IBM Plex Sans Arabic',
  },

  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type ThemeConfig = typeof themeConfig;

