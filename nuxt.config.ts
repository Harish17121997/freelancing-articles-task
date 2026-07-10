export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',

  devtools: { enabled: true },

  ssr: true,

  experimental: {
    appManifest: false
  },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  // Nuxt's default auto-import prefixes components in a subdirectory with
  // that directory's name (e.g. components/common/ArticleGrid.vue would
  // become <CommonArticleGrid>). We disable that per directory so templates
  // can reference components by their plain name (<ArticleGrid>, <BaseBadge>),
  // while still getting the common/ui separation the challenge spec asks for.
  components: [
    { path: '~/components/common', pathPrefix: false },
    { path: '~/components/ui', pathPrefix: false }
  ],

  typescript: {
    strict: true,
    typeCheck: true,
    shim: false
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'News Explorer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Browse the latest articles, resiliently.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
        }
      ]
    }
  },

  runtimeConfig: {
    public: {
      // Base URL for the mock articles API. Overridable via NUXT_PUBLIC_ARTICLES_API_URL.
      articlesApiUrl:
        process.env.NUXT_PUBLIC_ARTICLES_API_URL ||
        'https://mocki.io/v1/38c57ea8-5688-4a36-9629-8c9616754eb8'
    }
  }
})
