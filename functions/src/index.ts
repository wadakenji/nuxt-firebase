import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://nuxt-firebase-c523f.firebaseio.com',
})

const db = admin.firestore()

export const updateUser = functions.https.onCall(async (data, context) => {
  //ログインしてなければエラー
  if (!context.auth)
    throw new functions.https.HttpsError('failed-precondition', 'errorrr.')

  const { uid } = context.auth

  //firestoreをupdate
  return await db
    .collection('users')
    .doc(uid)
    .update(data)
    .then(r => r)
    .catch(e => e)
})
