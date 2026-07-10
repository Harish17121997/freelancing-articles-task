import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.vue',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1C1B19',
          soft: '#4A4844'
        },
        paper: {
          DEFAULT: '#FBFAF7',
          dim: '#F1EFE9'
        },
        wire: {
          // "wire service" amber — the signature accent, used sparingly
          DEFAULT: '#B4790F',
          soft: '#E8C88B'
        },
        line: '#DEDBD2'
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
