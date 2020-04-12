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
          @change="setWillCreateTeam"
          item-text="name"
          item-value="id"
          label="所属チーム"
          v-model="teamId"
          class="col-12"
        ></v-select>
        <v-text-field
          v-if="willCreateTeam"
          v-model="newTeamName"
          type="text"
          label="チーム名"
          required
          class="col-12"
        />
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
    willCreateTeam: false,
    newTeamName: '',
    error: '',
  }),
  asyncData: () => {
    const teams = [{ id: null, name: '新しいチームを作成する' }]
    teamsRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        teams.push({ id: doc.id, ...doc.data() })
      })
    })
    return { teams: teams }
  },
  methods: {
    async onSubmit() {
      if (
        !this.email ||
        !this.password ||
        !this.name ||
        (!this.willCreateTeam && !this.teamId) ||
        (this.willCreateTeam && !this.newTeamName)
      ) {
        this.error = 'INPUT ALL VALUE!'
        return
      }

      //新しいチームをつくるならばfirestoreに追加する
      if (this.willCreateTeam) {
        await this.createTeam()
      }

      //ユーザーの新規作成
      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(async r => {
          //成功していたら、ユーザーのdisplayNameを更新する
          await this.updateUserDisplayName()

          //成功していたら、firestoreにユーザーデータを作成する
          await this.createUserOnData(r.user)

          await this.$router.push('/')
        })
        .catch(e => {
          const { code, message } = e
          this.error = `${code}\n${message}`
        })
    },
    async updateUserDisplayName() {
      await firebase
        .auth()
        .currentUser.updateProfile({ displayName: this.name })
        .catch(e => console.log(e))
    },
    async createUserOnData({ uid, email }) {
      await usersRef.doc(uid).set({
        displayName: this.name,
        email: email,
        teamId: this.teamId,
        teamName: this.willCreateTeam
          ? this.newTeamName
          : this.teams.find(t => t.id === this.teamId).name,
        teamAdmin: this.willCreateTeam,
      })
    },
    async createTeam() {
      await teamsRef
        .add({ name: this.newTeamName })
        .then(r => (this.teamId = r.id))
    },
    setWillCreateTeam() {
      this.willCreateTeam = !this.teamId
    },
  },
}
</script>
