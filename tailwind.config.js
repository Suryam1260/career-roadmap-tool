/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './experimental/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '3.5xl': ['2rem', { lineHeight: '2.5rem' }], // Custom size between 3xl and 4xl
      },
      colors: {
        // Your brand colors from DESIGN_SYSTEM.md
        primary: {
          DEFAULT: '#B30158',
          hover: '#8B0044',
          light: '#FCE4EC',
        },
        // Accent colors
        accent: {
          blue: '#2196F3',
          purple: '#667eea',
          green: '#10b981',
          yellow: '#F59E0B',
          red: '#EF4444',
        },
        // Neutral colors (aligned with slate for Fern aesthetic)
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#B30158',
        background: '#FFFFFF',
        foreground: '#1F2937',
        // Card colors
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1F2937',
        },
        // Muted colors
        muted: {
          DEFAULT: '#F9FAFB',
          foreground: '#6B7280',
        },
        // Destructive colors
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        none: '0px',      // Your default (SHARP CORNERS)
        sm: '2px',        // Slight rounding if needed
        md: '4px',        // Very subtle
        lg: '8px',        // Rarely used
        pill: '9999px',   // Only for badges/pills
      },
      spacing: {
        // Your design system spacing values
        '18': '4.5rem',   // 72px
        '20': '5rem',     // 80px (section spacing)
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
