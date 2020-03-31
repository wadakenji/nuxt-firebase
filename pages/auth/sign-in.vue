<template>
  <section>
    <v-row align="center" class="flex-column">
      <h1>ログイン</h1>
      <v-form class="mb-6">
        <v-text-field v-model="email" type="email" label="e-mail" required />
        <v-text-field
          v-model="password"
          type="password"
          label="password"
          required
        />
        <v-btn @click="onSubmit">ログイン</v-btn>
      </v-form>
      <v-alert
        v-if="error"
        type="error"
        style="white-space: pre-line"
        class="mb-6"
        >{{ error }}
      </v-alert>
      <v-btn to="/auth/sign-up" outlined color="#000080"
        >新規登録はこちら
      </v-btn>
    </v-row>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  name: 'sign-in',
  data: () => ({
    email: '',
    password: '',
    error: '',
  }),
  methods: {
    async onSubmit() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(r => {
          this.$router.push('/')
        })
        .catch(e => {
          const { code, message } = e

          this.error = `${code}\n${message}`
        })
    },
  },
}
</script>
