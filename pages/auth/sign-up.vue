<template>
  <section>
    <h1>Sign Up</h1>
    <form action="" v-on:submit.prevent="onSubmit">
      <label for="email">e-mail</label>
      <input type="email" id="email" v-model="email" />
      <label for="password">password</label>
      <input type="password" id="password" v-model="password" />
      <label for="name">表示名</label>
      <input type="text" id="name" v-model="name" />
      <button type="submit">Sing Up</button>
    </form>
    <div v-if="result">
      {{ result }}
    </div>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  name: 'sign-up',
  data: () => ({
    email: '',
    password: '',
    name: '',
    result: '',
  }),
  methods: {
    async onSubmit() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(r => {
          firebase
            .auth()
            .currentUser.updateProfile({ displayName: this.name })
            .catch(e => console.log(e))
          this.$router.push('/auth/secret')
        })
        .catch(e => {
          // Handle Errors here.
          const errorCode = e.code
          const errorMessage = e.message
          // ...
          this.result = `code:${errorCode} message:${errorMessage}`
        })
    },
  },
}
</script>
