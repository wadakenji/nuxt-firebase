<template>
  <v-app-bar max-height="64px" class="header">
    <nuxt-link to="/" class="link title mr-4">
      コロふん
    </nuxt-link>
    <div v-if="currentUser" class="hello">
      Hello, {{ currentUser.displayName }}
    </div>
    <v-menu right absolute top>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" absolute right class="menu-btn">
          <span class="d-none d-sm-block headline">MENU</span>
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
        <v-list-item v-if="currentUser && currentUser.teamAdmin">
          <v-list-item-title>
            <nuxt-link to="/my-team" class="link">
              マイチーム
            </nuxt-link>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="currentUser && currentUser.systemAdmin">
          <v-list-item-title>
            <nuxt-link to="/admin" class="link">
              システム管理
            </nuxt-link>
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
  computed: {
    //現在のログインユーザーを返す
    currentUser() {
      return this.$store.state.auth.user
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

@media screen and (min-width: 600px) {
  .menu-btn {
    margin-right: 50px !important;
  }
}

.menu {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
}
</style>