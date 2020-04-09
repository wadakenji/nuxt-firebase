<template>
  <section>
    <v-card class="mb-6">
      <v-card-title>プロフィール</v-card-title>
      <v-divider></v-divider>
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr v-if="currentUser">
              <td>なまえ</td>
              <td>{{ currentUser.displayName }}</td>
            </tr>
            <tr v-if="currentUser">
              <td>チーム</td>
              <td>{{ currentUser.teamName }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-card>
      <v-card-title>最近1週間</v-card-title>
      <Calender :events="calenderEvents" />
    </v-card>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'
import moment from 'moment'
import Calender from '@/components/Calender'
import common from '../const/common'

const db = firebase.firestore()
const statusLogsRef = db.collection('statusLogs')

export default {
  name: 'mypage',
  middleware: 'auth',
  components: {
    Calender,
  },
  data: () => ({
    statusLogs: [],
  }),
  computed: {
    //現在のログインユーザーを返す
    currentUser() {
      return this.$store.state.auth.user
    },
    calenderEvents() {
      return this.statusLogs.map((l, i, a) => {
        const startDate = l.createdOn.toDate()
        const endDate = a[i + 1] ? a[i + 1].createdOn.toDate() : new Date()
        const start = moment(startDate).format('YYYY-MM-DD HH:mm')
        const end = moment(endDate).format('YYYY-MM-DD HH:mm')
        let color
        let name
        switch (l.status) {
          case common.USER_STATUS.WORKING:
            name = '仕事中'
            color = 'orange'
            break
          case common.USER_STATUS.BREAK:
            name = '休憩中'
            color = 'green'
            break
          case common.USER_STATUS.OFF:
            name = '終了'
            color = 'indigo lighten-4'
            break
        }
        return {
          name,
          start,
          end,
          color,
        }
      })
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
            this.statusLogs.push(doc.data())
          })
        })
    },
  },
}
</script>

<style scoped></style>
