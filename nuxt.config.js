export default {
  mode: 'spa',
  head: {
    title: 'コロふん',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'コロナによって分報をすることになった俺たち',
      },
    ],
  },
  plugins: ['@/plugins/firebase'],
  modules: [
    '@nuxtjs/dotenv',
    ['@nuxtjs/moment', ['ja']],
    '@nuxtjs/pwa',
    '@nuxtjs/onesignal',
  ],
  pwa: {
    meta: {
      name: 'コロふん',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      description: 'コロナによって分報をすることになった俺たち',
      lang: 'ja',
    },
    manifest: {
      name: 'コロふん',
      short_name: 'コロふん',
      title: 'コロふん',
      'og:title': 'コロふん',
      description: 'コロナによって分報をすることになった俺たち',
      'og:description': 'コロナによって分報をすることになった俺たち',
      lang: 'ja',
      theme_color: '#529b58',
      background_color: '#bde0c0',
      display: 'standalone',
      scope: '/',
      start_url: '/',
    },
  },
  oneSignal: {
    init: {
      appId: 'e8bd7120-2ae3-4c1e-a946-8a0a6f022f7e',
      allowLocalhostAsSecureOrigin: true,
    },
  },
  buildModules: ['@nuxtjs/vuetify'],
}
