import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary, #06402b)',
          light: 'var(--primary-light, #0a5f40)',
          dark: 'var(--primary-dark, #032318)',
        },
        secondary: {
          DEFAULT: 'var(--secondary, #d69317)',
          light: 'var(--secondary-light, #f0ac2d)',
          dark: 'var(--secondary-dark, #a36f0e)',
        },
        accent: {
          DEFAULT: 'var(--accent, #f3f4f6)',
          dark: 'var(--accent-dark, #e5e7eb)',
        },
        text: {
          primary: 'var(--text-primary, #111827)',
          secondary: 'var(--text-secondary, #4b5563)',
          muted: 'var(--text-muted, #9ca3af)',
        },
        bg: {
          primary: 'var(--bg-primary, #ffffff)',
          secondary: 'var(--bg-secondary, #f9fafb)',
          card: 'var(--bg-card, #ffffff)',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'Raleway', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.15em',
        mega: '0.25em',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'premium-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.05)',
        'admin-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
export default config
