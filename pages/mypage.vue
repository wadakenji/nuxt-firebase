<template>
  <section>
    <v-card class="mb-6">
      <v-card-title>プロフィール</v-card-title>
      <v-divider></v-divider>
      <v-simple-table>
        <template v-slot:default>
          <tbody v-if="currentUser">
            <tr>
              <td>なまえ</td>
              <td>{{ currentUser.displayName }}</td>
            </tr>
            <tr>
              <td>チーム</td>
              <td>{{ currentUser.teamName }}</td>
            </tr>
            <tr>
              <td>権限</td>
              <td>
                <span v-if="currentUser.systemAdmin">システム管理者</span>
                <span v-if="currentUser.teamAdmin">チーム管理者</span>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-card>
      <v-card-title>最近1週間</v-card-title>
      <Calendar :statusLogs="statusLogs" />
    </v-card>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'
import moment from 'moment'
import Calendar from '@/components/Calendar'

const db = firebase.firestore()
const statusLogsRef = db.collection('statusLogs')

export default {
  name: 'mypage',
  middleware: 'auth',
  components: {
    Calendar,
  },
  data: () => ({
    statusLogs: [],
  }),
  computed: {
    //現在のログインユーザーを返す
    currentUser() {
      return this.$store.state.auth.user
    },
  },
  watch: {
    currentUser: async function(currentUser) {
      if (!currentUser) return []

      const { uid } = currentUser
      statusLogsRef
        .where('uid', '==', uid)
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
          snapshot.forEach(doc => {
            this.statusLogs.push({ id: doc.id, ...doc.data() })
          })
        })
    },
  },
}
</script>

<style scoped></style>
