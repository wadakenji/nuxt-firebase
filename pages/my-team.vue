<template>
  <section>
    <v-card class="mb-6">
      <v-card-title>チーム情報</v-card-title>
      <v-divider></v-divider>
      <v-simple-table>
        <template v-slot:default>
          <tbody v-if="team">
            <tr>
              <td>なまえ</td>
              <td>{{ team.name }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-card>
      <v-card-title>メンバー</v-card-title>
      <v-row class="px-4">
        <v-select
          class="col-6 col-sm-4"
          placeholder="メンバーを選択"
          :items="users"
          item-text="displayName"
          item-value="id"
          v-model="selectedUserId"
        ></v-select>
        <v-checkbox
          class="col-6 col-sm-4"
          color="primary"
          label="チーム管理権限"
          disabled
          v-if="selectedUserId"
          v-model="users.find(u => u.id === selectedUserId).teamAdmin"
        ></v-checkbox>
      </v-row>
      <Calendar :statusLogs="statusLogs" />
    </v-card>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'
import moment from 'moment'
import Calendar from '@/components/Calendar'

const db = firebase.firestore()

const usersRef = db.collection('users')
const teamsRef = db.collection('teams')
const statusLogsRef = db.collection('statusLogs')

export default {
  name: 'my-team',
  components: { Calendar },
  middleware: ['teamLeader'],
  data: () => ({
    users: [],
    team: null,
    selectedUserId: '',
    statusLogs: [],
  }),
  computed: {
    //現在のログインユーザーを返す
    currentUser() {
      return this.$store.state.auth.user
    },
  },
  watch: {
    currentUser: function(currentUser) {
      if (!currentUser) return []

      const { teamId } = currentUser
      usersRef
        .where('teamId', '==', teamId)
        .get()
        .then(snapshot => {
          this.users = []
          snapshot.forEach(doc => {
            this.users.push({ id: doc.id, ...doc.data() })
          })
        })

      teamsRef
        .doc(teamId)
        .get()
        .then(doc => (this.team = doc.data()))
    },
    selectedUserId: function(selectedUserId) {
      statusLogsRef
        .where('uid', '==', selectedUserId)
        .orderBy('createdOn', 'asc')
        .startAt(
          //現在日時を含めた最近1週間の初めの日の0時
          moment()
            .subtract(6, 'days')
            .startOf('date')
            .toDate()
        )
        .get()
        .then(snapshot => {
          this.statusLogs = []
          snapshot.forEach(doc => {
            this.statusLogs.push({ id: doc.id, ...doc.data() })
          })
        })
    },
  },
}
</script>

<style scoped></style>
