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
    // === RESPONSIVE NAVIGATION CLASSES ===
    'hidden',
    'block',
    'flex',
    'lg:flex',
    'lg:hidden',
    'lg:block',
    'md:flex',
    'md:hidden',
    'sm:flex',
    'sm:hidden',
    'items-center',
    'justify-between',
    'gap-4',
    
    // === BACKGROUND COLORS ===
    'bg-deep-space',
    'bg-abyss',
    'bg-abyss/30',
    'bg-abyss/40',
    'bg-abyss/50',
    'bg-abyss/70',
    'bg-abyss/80',
    'bg-abyss/90',
    'bg-rift',
    'bg-rift/40',
    'bg-nebula',
    'bg-nebula/20',
    'bg-glow',
    'bg-glow/10',
    'bg-glow/20',
    'bg-deep-space/60',
    
    // === TEXT COLORS ===
    'text-stardust',
    'text-stardust/60',
    'text-stardust/70',
    'text-stardust/80',
    'text-stardust/85',
    'text-stardust/90',
    'text-stardust/95',
    'text-glow',
    'text-glow/80',
    'text-deep-space',
    'text-abyss',
    
    // === BORDER COLORS ===
    'border-rift',
    'border-rift/60',
    'border-rift/65',
    'border-glow',
    'border-glow/30',
    'border-glow/40',
    'border-glow/60',
    
    // === FONTS ===
    'font-display',
    'font-body',
    
    // === SHADOWS ===
    'shadow-glow',
    'shadow-card',
    
    // === RING (for focus states) ===
    'ring-1',
    'ring-glow/30',
    'ring-glow/60',
    
    // === HOVER STATES ===
    'hover:text-glow',
    'hover:text-stardust',
    'hover:bg-rift/40',
    'hover:ring-glow/60',
    'hover:underline',
    'hover:brightness-110',
    
    // === SELECTION ===
    'selection:bg-glow/20',
    'selection:text-stardust',
    
    // === PLACEHOLDER ===
    'placeholder:text-stardust/60',
    
    // === OTHER STATES ===
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'group-hover:text-stardust',
    'group-hover:block',
    'group-focus-within:block',
    'min-h-screen',
    
    // === BACKDROP ===
    'backdrop-blur-md',
    'backdrop-blur',

     // === WIDTH CLASSES (ADD THESE) ===
    'min-w-[220px]',
    'min-w-max',
    'w-56',
    'w-full',
    'max-w-6xl',
    'max-w-2xl',
    'max-w-xl',
    
    // === OTHER LAYOUT CLASSES YOU MIGHT NEED ===
    'mx-auto',
    'px-6',
    'pt-10',
    'mt-2',
    'mt-4',
    'p-2',
    'gap-1',
    'z-50',
    'z-10',
    'z-1',
    'relative',
    'absolute',
    'pointer-events-auto',
    'left-0',
    'top-full',
    'rounded-lg',
    'rounded-md',
    'rounded-xl',
    'px-3',
    'py-2',
    'underline-offset-4',
    'scroll-smooth',
    '-z-10',
    'inset-0',
    'object-cover',
    'from-deep-space/78',
    'via-abyss/86',
    'to-abyss/95',
    'min-h-[calc(100vh-5rem)]',
    'space-y-6',
    'space-y-3',
    'space-y-4',
    'space-y-8',
    'space-y-2',
    'tracking-[.18em]',
    'tracking-[.22em]',
    'leading-tight',
    'leading-relaxed',
    'list-disc',
    'list-inside',
    'italic',
    'backdrop-blur-sm',
    'text-ember',
    'text-silver',
    'bg-glow',
    'text-abyss',
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