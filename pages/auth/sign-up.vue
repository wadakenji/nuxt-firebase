<template>
  <section>
    <v-row align="center" class="flex-column">
      <h1>新規登録</h1>
      <v-form class="mb-6 col-4 d-flex flex-column align-center">
        <v-text-field
          v-model="email"
          type="email"
          label="e-mail"
          required
          class="col-12"
        />
        <v-text-field
          v-model="password"
          type="password"
          label="password"
          required
          class="col-12"
        />
        <v-text-field v-model="name" label="表示名" class="col-12" required />
        <v-select
          :items="teams"
          item-text="name"
          item-value="id"
          label="所属チーム"
          v-model="teamId"
          class="col-12"
        ></v-select>
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
const teamsRef = firebase.firestore().collection('teams')

export default {
  name: 'sign-up',
  data: () => ({
    email: '',
    password: '',
    name: '',
    teamId: '',
    error: '',
  }),
  asyncData: () => {
    const teams = []
    teamsRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        teams.push({ id: doc.id, ...doc.data() })
      })
    })
    return { teams: teams }
  },
  methods: {
    async onSubmit() {
      if (!this.email || !this.password || !this.name || !this.teamId) {
        this.error = 'INPUT ALL VALUE!'
        return
      }
      //ユーザーの新規作成
      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(async r => {
          const { uid, email } = r.user
          //成功していたら、ユーザーのdisplayNameを更新する
          await firebase
            .auth()
            .currentUser.updateProfile({ displayName: this.name })
            .catch(e => console.log(e))

          //成功していたら、firestoreにユーザーデータを作成する
          await usersRef.doc(uid).set({
            displayName: this.name,
            email: email,
            teamId: this.teamId,
            teamName: this.teams.find(t => t.id === this.teamId).name,
          })

          await this.$router.push('/')
        })
        .catch(e => {
          const { code, message } = e
          this.error = `${code}\n${message}`
        })
    },
  },
}
</script>
