<template>
  <section>
    マイページ実装中
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'

const db = firebase.firestore()
const teamsRef = db.collection('teams')

export default {
  name: 'mypage',
  middleware: 'auth',
  // asyncData: ({ store }) => {
  //   const { team } = store.state.auth.user
  //   teamsRef
  //     .doc(team)
  //     .get()
  //     .then(doc => {})
  // },
}
</script>

<style scoped></style>
