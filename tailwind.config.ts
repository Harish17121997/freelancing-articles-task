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
          DEFAULT: '#111827',
          soft: '#6B7280'
        },
        paper: {
          DEFAULT: '#FFFFFF',
          dim: '#EDEEF0'
        },
        // Dark teal used for article card surfaces and the detail-page hero,
        // matching the Figma mock's card/header treatment.
        night: {
          DEFAULT: '#173338',
          soft: '#1F454B'
        },
        // Blue accent for primary CTAs ("Read More"), sampled from the mock.
        brand: {
          DEFAULT: '#2B5F8A',
          soft: '#4C81AC'
        },
        line: '#E4E7EB'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
