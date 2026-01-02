/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./*.html",
    "./characters/**/*.html",
    "./chronicles/**/*.html",
    "./world/**/*.html",
    "./field-notes/**/*.html",
    // Exclude node_modules and _site (build output)
    "!./node_modules/**",
    "!./_site/**",
  ],
  safelist: [
    // Core utilities used in site
    'bg-deep-space',
    'bg-abyss',
    'bg-nebula',
    'text-stardust',
    'text-glow',
    'text-gradient',
    'border-rift',
    'shadow-glow',
    'shadow-card',
    'font-display',
    'font-body',
  ],
  theme: {
    extend: {
      colors: {
        'deep-space': '#0A141B',
        'abyss': '#0F2230',
        'rift': '#143545',
        'nebula': '#1E6175',
        'glow': '#35C6E0',
        'stardust': '#CFE5EF',
        'indigo': '#4B5DFF',
        'violet': '#7C4DFF',
        'ember': '#F0B429',
        'fog': '#E9EDF2',
        'silver': '#C9D1D9',
        'parchment': '#F7F4EF',
        'aether': '#0B0F14',
        'runic': '#1A2430'
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Source Sans 3', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        glow: '0 0 0 2px rgba(53,198,224,.15), 0 10px 28px rgba(0,0,0,.25)',
        card: '0 6px 18px rgba(0,0,0,.12)'
      }
    }
  },
  plugins: [],
}