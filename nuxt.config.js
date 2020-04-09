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
  modules: ['@nuxtjs/dotenv', ['@nuxtjs/moment', ['ja']]],
  buildModules: ['@nuxtjs/vuetify'],
}
