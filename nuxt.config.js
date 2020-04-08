export default {
  mode: 'spa',
  plugins: ['@/plugins/firebase'],
  modules: ['@nuxtjs/dotenv', ['@nuxtjs/moment', ['ja']]],
  buildModules: ['@nuxtjs/vuetify'],
}
