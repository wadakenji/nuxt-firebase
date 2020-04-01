import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://project-id.firebaseio.com',
})

const db = admin.firestore()

export const updateUserStatus = functions.https.onCall(
  async (data: number, context) => {
    //ログインしてなければエラー
    if (!context.auth) throw new Error('Sign-in is required.')

    const { uid } = context.auth

    //firestoreをupdate
    return await db
      .collection('users')
      .doc(uid)
      .update({ status: data })
      .then(r => r)
      .catch(e => e)
  }
)
