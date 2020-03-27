<template>
  <section>
    <h1>Sign In</h1>
    <form action="" v-on:submit.prevent="onSubmit">
      <label for="email">e-mail</label>
      <input type="email" id="email" v-model="email" />
      <label for="password">password</label>
      <input type="password" id="password" v-model="password" />
      <button type="submit">Sing In</button>
    </form>
    <div v-if="result">
      {{ result }}
    </div>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  name: 'sign-in',
  data: () => ({
    email: '',
    password: '',
    result: '',
  }),
  methods: {
    async onSubmit() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(r => {
          this.$router.push('/auth/secret')
        })
        .catch(e => {
          const errorCode = e.code
          const errorMessage = e.message

          this.result = `code:${errorCode} message:${errorMessage}`
        })
    },
  },
}
</script>

<style scoped></style>
