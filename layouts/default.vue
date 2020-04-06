<template>
  <v-app>
    <VHeader />
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer>
      フッター
    </v-footer>
  </v-app>
</template>

<script>
import VHeader from '../components/VHeader'

export default {
  components: {
    VHeader,
  },
}
</script>
