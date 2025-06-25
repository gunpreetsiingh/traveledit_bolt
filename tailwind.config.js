/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Desert Olive Color Palette
      colors: {
        // Custom Desert Olive theme
        primary: {
          DEFAULT: '#5F6E4E', // Olive - for buttons, links, interactive highlights
          foreground: '#FAFAF8', // Soft white text on primary
        },
        secondary: {
          DEFAULT: '#D7C3AE', // Warm Sand - for subtle accents, backgrounds, tags
          foreground: '#2E2E2E', // Dark text on secondary
        },
        accent: {
          DEFAULT: '#C27C6C', // Clay Rose - for callouts, sliders, hover states
          foreground: '#FAFAF8', // Light text on accent
        },
        background: '#FAFAF8', // Soft White
        foreground: '#2E2E2E', // Main body text
        
        // Surface colors
        card: {
          DEFAULT: '#FFFFFF', // Cards, panels
          foreground: '#2E2E2E',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#2E2E2E',
        },
        
        // Muted colors
        muted: {
          DEFAULT: '#F5F5F3', // Slightly darker than background for subtle sections
          foreground: '#A0A0A0', // Labels, placeholders
        },
        
        // Utility colors (keeping some neutrals for borders, etc.)
        border: '#E8E6E3',
        input: '#E8E6E3',
        ring: '#5F6E4E',
        
        // Destructive (using a muted red that fits the palette)
        destructive: {
          DEFAULT: '#B85450',
          foreground: '#FAFAF8',
        },
        
        // Chart colors (variations of the main palette)
        chart: {
          1: '#5F6E4E', // Primary olive
          2: '#C27C6C', // Clay rose
          3: '#D7C3AE', // Warm sand
          4: '#8B9A7A', // Lighter olive
          5: '#A67C52', // Deeper sand
        },
      },
      
      // Custom font families
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'], // Default sans-serif
        serif: ['Playfair Display', 'serif'], // Default serif
      },
      
      // Extended spacing for generous padding (16-40px scale)
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
      },
      
      // Border radius for pill-shaped buttons and soft components
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'pill': '9999px', // For pill-shaped buttons
      },
      
      // Box shadows for minimal shadow effects
      boxShadow: {
        'soft': '0 2px 8px rgba(95, 110, 78, 0.08)',
        'soft-lg': '0 4px 16px rgba(95, 110, 78, 0.12)',
        'floating': '0 8px 32px rgba(95, 110, 78, 0.15)',
      },
      
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};