<template>
  <v-app-bar max-height="64px" class="header">
    <nuxt-link to="/" class="link title">
      コロふん
    </nuxt-link>
    <div v-if="$store.state.auth.user" class="hello">
      Hello, {{ $store.state.auth.user.displayName }}
    </div>
    <div class="menu">
      <nuxt-link to="/mypage" class="link">
        マイページ
      </nuxt-link>
      <nuxt-link to="" class="link" @click.native="signOut">
        ログアウト
      </nuxt-link>
    </div>
  </v-app-bar>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  name: 'VHeader',
  methods: {
    signOut() {
      firebase.auth().signOut()
    },
  },
}
</script>

<style scoped>
.header {
  position: relative;
}

.title {
  font-size: 1.5rem;
}

.hello {
  margin: auto;
}

.link {
  text-decoration: none;
  color: black;
  padding: 0 10px;
}

.menu {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
}
</style>
