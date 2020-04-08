import firebase from '@/plugins/firebase'

export default ({ redirect, store }) => {
  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      const { uid, email, displayName } = user

      const { teamId, teamName } = await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then(doc => doc.data())

      store.commit('auth/setUser', {
        uid: uid,
        email: email,
        displayName: displayName,
        teamId: teamId,
        teamName: teamName,
      })
    } else {
      store.commit('auth/setUser', null)
      redirect('/auth/sign-in')
    }
  })
}
