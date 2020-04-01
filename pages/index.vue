<template>
  <section>
    <h1>Main</h1>
    <button @click="onClick(USER_STATUS.WORKING)">仕事中</button>
    <button @click="onClick(USER_STATUS.BREAK)">休憩中</button>
    <button @click="onClick(USER_STATUS.OFF)">終了</button>
    <p v-for="user in users">{{ user.displayName }} : {{ user.status }}</p>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'
import common from '@/const/common'

const db = firebase.firestore()
const usersRef = db.collection('users')
const functions = firebase.functions()

if (process.env.NODE_ENV !== 'production')
  functions.useFunctionsEmulator('http://localhost:5001')

export default {
  name: 'index',
  middleware: 'auth',
  data: () => ({
    users: [],
    USER_STATUS: common.USER_STATUS,
  }),
  mounted() {
    usersRef.onSnapshot(snapshot => {
      console.log(snapshot.docChanges())
      this.users = this.getUsers()
    })
  },
  methods: {
    getUsers: () => {
      const users = []
      usersRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          users.push({ id: doc.id, ...doc.data() })
        })
      })
      return users
    },
    onClick: status => {
      functions.httpsCallable('updateUserStatus')(status)
    },
  },
}
</script>
