<template>
  <section>
    <v-card class="mb-6">
      <v-card-title>チーム一覧</v-card-title>
      <v-divider></v-divider>
      <v-simple-table>
        <template v-slot:default>
          <tbody v-if="teams">
            <tr v-for="team in teams">
              <td>{{ team.name }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'

const db = firebase.firestore()

const teamsRef = db.collection('teams')

export default {
  name: 'admin',
  middleware: ['admin'],
  data: () => ({}),
  asyncData: () => {
    let teams = []
    teamsRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        teams.push({ id: doc.id, ...doc.data() })
      })
    })
    return {
      teams,
    }
  },
  computed: {
    //現在のログインユーザーを返す
    currentUser() {
      return this.$store.state.auth.user
    },
  },
  watch: {},
}
</script>

<style scoped></style>
