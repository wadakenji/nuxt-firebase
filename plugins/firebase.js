import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyA_O1esF3x7mA1HeDZFtGgW9EwvBkgmzJg",
  authDomain: "nuxt-firebase-c523f.firebaseapp.com",
  databaseURL: "https://nuxt-firebase-c523f.firebaseio.com",
  projectId: "nuxt-firebase-c523f",
  storageBucket: "nuxt-firebase-c523f.appspot.com",
  messagingSenderId: "121299951650",
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase