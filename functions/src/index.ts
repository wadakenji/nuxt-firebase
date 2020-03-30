import * as functions from 'firebase-functions'
import * as express from 'express'

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!')
})

export const helloOnCall = functions.https.onCall((data, context) => {
  console.log(data)
  console.log('test')
  return data
})

const app = express()

app.get('/', (req, res) => {
  res.send('GET OK!')
})

app.post('/', (req, res) => {
  res.send('POST OK!')
})

export const helloExpress = functions.https.onRequest(app)
