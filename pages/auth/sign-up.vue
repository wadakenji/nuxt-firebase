<template>
  <section>
    <v-row align="center" class="flex-column">
      <h1>新規登録</h1>
      <v-form class="mb-6">
        <v-text-field v-model="email" type="email" label="e-mail" required />
        <v-text-field
          v-model="password"
          type="password"
          label="password"
          required
        />
        <v-text-field v-model="name" label="表示名" required />
        <v-btn @click="onSubmit">新規登録</v-btn>
      </v-form>
      <v-alert
        v-if="error"
        type="error"
        style="white-space: pre-line"
        class="mb-6"
        >{{ error }}
      </v-alert>
      <v-btn to="/auth/sign-in" outlined color="#000080"
        >既に登録している方はこちら
      </v-btn>
    </v-row>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'

const usersRef = firebase.firestore().collection('users')

export default {
  name: 'sign-up',
  data: () => ({
    email: '',
    password: '',
    name: '',
    error: '',
  }),
  methods: {
    async onSubmit() {
      //ユーザーの新規作成
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(r => {
          const { uid, email } = r.user
          //成功していたら、ユーザーのdisplayNameを更新する
          firebase
            .auth()
            .currentUser.updateProfile({ displayName: this.name })
            .catch(e => console.log(e))

          //成功していたら、firestoreにユーザーデータを作成する
          usersRef.doc(uid).set({
            displayName: this.name,
            email: email,
          })

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
