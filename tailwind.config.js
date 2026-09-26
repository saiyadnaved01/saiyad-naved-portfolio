/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0e11',
        surface: '#12161b',
        surface2: '#171d24',
        border: 'rgba(34,211,238,0.16)',
        muted: '#93a1ad',
        acc1: '#22d3ee',
        acc2: '#34d399',
      },
      fontFamily: {
        head: ['Outfit', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        grad: 'linear-gradient(135deg,#22d3ee,#34d399)',
      },
    },
  },
  plugins: [],
}
