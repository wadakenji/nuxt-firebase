<template>
  <section>
    <div>チーム: {{ currentUser.teamName }}</div>
    <div>
      <p v-for="statusLog in statusLogs">
        {{ statusLog.createdOn.toDate().toLocaleString('ja-JP') }}
        <v-chip color="indigo lighten-4" v-show="statusLog.status === 0"
          >終了
        </v-chip>
        <v-chip color="orange lighten-3" v-show="statusLog.status === 1"
          >仕事中
        </v-chip>
        <v-chip color="green lighten-3" v-show="statusLog.status === 2"
          >休憩中
        </v-chip>
      </p>
    </div>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'
import moment from 'moment'

const db = firebase.firestore()
const teamsRef = db.collection('teams')
const statusLogsRef = db.collection('statusLogs')

export default {
  name: 'mypage',
  middleware: 'auth',
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
        .orderBy('createdOn', 'desc')
        .endAt(
          //現在日時を含めた最近1週間の初めの日の0時
          moment()
            .subtract(6, 'days')
            .startOf('date')
            .toDate()
        )
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            this.statusLogs.push(doc.data())
          })
        })
    },
  },
}
</script>

<style scoped></style>
