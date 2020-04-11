<template>
  <v-app-bar max-height="64px" class="header">
    <nuxt-link to="/" class="link title mr-4">
      コロふん
    </nuxt-link>
    <div v-if="$store.state.auth.user" class="hello">
      Hello, {{ $store.state.auth.user.displayName }}
    </div>
    <!--    <v-spacer></v-spacer>-->
    <v-menu right absolute top>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" absolute right>
          <span class="d-none d-sm-block headline" style="margin-right: 100px"
            >MENU</span
          >
          <v-icon class="d-block d-sm-none">mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-title>
            <nuxt-link to="/" class="link">トップページ</nuxt-link>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <nuxt-link to="/mypage" class="link">マイページ</nuxt-link>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <nuxt-link to="" class="link" @click.native="signOut">
              ログアウト
            </nuxt-link>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <!--    <div class="menu">-->
    <!--      <nuxt-link to="/mypage" class="link">-->
    <!--        マイページ-->
    <!--      </nuxt-link>-->
    <!--      <nuxt-link to="" class="link" @click.native="signOut">-->
    <!--        ログアウト-->
    <!--      </nuxt-link>-->
    <!--    </div>-->
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
  color: gray;
}

.link {
  text-decoration: none;
  color: black;
}

.menu {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
}
</style>
