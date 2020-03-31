import firebase from '@/plugins/firebase'

export default ({ redirect, store }) => {
  firebase.auth().onAuthStateChanged(user => {
    // console.log(user)
    if (user)
      store.commit('auth/setUser', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      })
    else redirect('/auth/sign-in')
  })
}
