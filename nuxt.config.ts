import colors from 'tailwindcss/colors';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxthq/ui', '@nuxtjs/supabase'],
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },
  ui: {
    icons: ['mdi', 'lucide', 'heroicons'],
    safelistColors: Object.keys(colors),
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/',
      callback: '/confirm',
      exclude: [],
    }
  }
})
