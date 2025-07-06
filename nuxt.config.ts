// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  pages: true,
  imports: {
    autoImport: true
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  nitro: {
    preset: 'static' // importante para gerar os arquivos no `dist`
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui'
  ],
  css: [
    'leaflet/dist/leaflet.css',
    '~/assets/css/global.css'
  ]
})