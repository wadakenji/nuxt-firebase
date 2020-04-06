<template>
  <section>
    <h1>Main</h1>
    <v-layout class="flex-column">
      <v-row class="mb-8">
        <v-card class="col-6">
          <v-card-title>ステータスを更新</v-card-title>
          <v-row justify="center">
            <v-btn @click="updateStatus(USER_STATUS.WORKING)" class="mr-3"
              >仕事中
            </v-btn>
            <v-btn @click="updateStatus(USER_STATUS.BREAK)" class="mr-3"
              >休憩中
            </v-btn>
            <v-btn @click="updateStatus(USER_STATUS.OFF)" class="mr-3"
              >終了
            </v-btn>
          </v-row>
        </v-card>
        <v-card class="col-6">
          <v-card-title>タスクを更新</v-card-title>
          <v-row class="px-3" align="center">
            <v-text-field
              type="text"
              v-model="task"
              placeholder="現在のタスク"
            />
            <v-btn @click="updateTask">更新</v-btn>
          </v-row>
        </v-card>
      </v-row>
      <v-row class="flex-column">
        <v-card v-for="user in users" v-bind:key="user.uid" class="mb-3 py-3">
          <v-card-title class="py-2">{{ user.displayName }}</v-card-title>
          <v-list-item>
            <v-chip color="indigo lighten-4" v-show="user.status === 0"
              >終了
            </v-chip>
            <v-chip color="orange lighten-3" v-show="user.status === 1"
              >仕事中
            </v-chip>
            <v-chip color="green lighten-3" v-show="user.status === 2"
              >休憩中
            </v-chip>
          </v-list-item>
          <v-list-item two-line v-if="user.task">
            <div>
              <span style="font-weight: bold; font-size: 1.2rem">{{
                user.task
              }}</span>
              なう
            </div>
          </v-list-item>
        </v-card>
      </v-row>
    </v-layout>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'
import common from '@/const/common'

const db = firebase.firestore()
const usersRef = db.collection('users')

export default {
  name: 'index',
  middleware: 'auth',
  data: () => ({
    users: [],
    USER_STATUS: common.USER_STATUS,
    task: '',
  }),
  computed: {
    //現在のログインユーザーを返す
    currentUser() {
      return this.$store.state.auth.user
    },
  },
  watch: {
    currentUser: function(newVal, oldVal) {
      if (!newVal) return []

      const { team } = newVal
      usersRef.where('team', '==', team).onSnapshot(snapshot => {
        this.users = []
        snapshot.forEach(doc => {
          this.users.push({ id: doc.id, ...doc.data() })
        })
      })
    },
  },
  methods: {
    updateStatus(status) {
      this.updateUser({ status: status })
    },
    updateTask() {
      this.updateUser({ task: this.task })
      this.task = ''
    },
    updateUser(data) {
      const { uid } = this.currentUser
      usersRef
        .doc(uid)
        .update(data)
        .catch(e => console.log(e))
    },
  },
}
</script>
