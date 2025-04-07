/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './src/main.css'
  ],
  theme: {
    extend: {
      colors: {
        'background-primary': 'var(--background-primary)',
        'background-secondary': 'var(--background-secondary)',
        'background-modifier-border': 'var(--background-modifier-border)',
        'background-modifier-hover': 'var(--background-modifier-hover)',
        'background-modifier-error': 'var(--background-modifier-error)',
        'background-modifier-error-hover': 'var(--background-modifier-error-hover)',
        'text-normal': 'var(--text-normal)',
        'text-muted': 'var(--text-muted)',
        'text-error': 'var(--text-error)',
        'text-warning': 'var(--text-warning)',
      },
      fontFamily: {
        mono: 'var(--font-monospace)',
      },
    },
  },
  plugins: [],
}