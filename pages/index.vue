<template>
  <section>
    <h1 v-if="currentUser">{{ currentUser.teamName }}</h1>
    <v-layout class="flex-column flex-md-row">
      <v-col class="px-6" cols="12" md="4">
        <v-card-title>なう</v-card-title>
        <v-row>
          <v-card
            outlined
            class="mb-8 flex-column col-12"
            style="border-color: pink"
          >
            <div class="col-12 mb-2">
              <v-card-title>ステータスを更新</v-card-title>
              <v-row justify="center">
                <v-btn
                  @click="changeStatus(USER_STATUS.WORKING)"
                  class="mr-3 mb-3"
                  >仕事中
                </v-btn>
                <v-btn
                  @click="changeStatus(USER_STATUS.BREAK)"
                  class="mr-3 mb-3"
                  >休憩中
                </v-btn>
                <v-btn @click="changeStatus(USER_STATUS.OFF)" class="mr-3 mb-3"
                  >終了
                </v-btn>
              </v-row>
            </div>
            <v-divider></v-divider>
            <div class="col-12">
              <v-card-title>タスクを更新</v-card-title>
              <v-row class="px-3" align="center">
                <v-text-field
                  type="text"
                  v-model="task"
                  placeholder="現在のタスク"
                />
                <v-btn @click="updateTask">更新</v-btn>
              </v-row>
            </div>
          </v-card>
        </v-row>
        <v-row class="flex-column flex-sm-row flex-md-column" justify="center">
          <v-card
            v-for="user in users"
            v-bind:key="user.uid"
            class="col-12 col-sm-3 col-md-12 mb-3 py-3 mr-3"
          >
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
      </v-col>
      <v-divider class="my-6"></v-divider>
      <v-divider vertical></v-divider>
      <v-col class="px-6" cols="12" md="4">
        <v-card-title>困った</v-card-title>
        <v-row>
          <v-card
            outlined
            class="mb-8 flex-column col-12"
            style="border-color: pink"
          >
            <v-row class="px-3" align="center">
              <v-text-field
                type="text"
                v-model="problem"
                placeholder="困ったこと"
              />
              <v-btn @click="addProblem">助けて</v-btn>
            </v-row>
          </v-card>
        </v-row>
        <v-row class="flex-column">
          <v-card
            v-for="(problem, index) in problems"
            :key="problem.id"
            class="px-4 mb-4"
          >
            <div class="py-4">
              <p style="font-size: 1.3rem; font-weight: bold">
                {{ problem.displayName }}
              </p>
              <p>{{ problem.message }}</p>
              <p style="font-size: 0.8rem; color: gray">
                {{ problem.createdOn.toDate().toLocaleString() }}
              </p>
            </div>
            <v-divider></v-divider>
            <div v-if="problem.answerIsOpen" class="mb-4">
              <div
                v-for="answer in answers.filter(
                  a => a.parentProblemId === problem.id
                )"
                class="py-4"
              >
                <p style="font-size: 1.3rem; font-weight: bold">
                  {{ answer.displayName }}
                </p>
                <p>{{ answer.message }}</p>
                <p style="font-size: 0.8rem; color: gray">
                  {{ answer.createdOn.toDate().toLocaleString() }}
                </p>
                <v-divider></v-divider>
              </div>
              <v-row class="px-3" align="center">
                <v-text-field
                  type="text"
                  v-model="responses[index]"
                  placeholder="助けてあげる"
                />
                <v-btn @click="addAnswer(index, problem.id)">返信する</v-btn>
              </v-row>
            </div>
            <v-btn @click="toggleAnswerIsOpen(problem.id)" class="mb-4"
              >{{ problem.answerIsOpen ? '閉じる' : '開く' }}
            </v-btn>
          </v-card>
        </v-row>
      </v-col>
      <v-divider class="my-6"></v-divider>
      <v-divider vertical></v-divider>
      <v-col class="px-6" cols="12" md="4">
        <v-row>
          <v-card-title>独り言</v-card-title>
          <v-card
            outlined
            class="mb-8 flex-column col-12"
            style="border-color: pink"
          >
            <v-row class="px-3" align="center">
              <v-text-field type="text" v-model="tweet" placeholder="独り言" />
              <v-btn @click="addTweet">投稿</v-btn>
            </v-row>
          </v-card>
          <div>
            <div v-for="tweet in tweets" class="py-3">
              <p style="font-size: 1.3rem; font-weight: bold">
                {{ tweet.displayName }}
              </p>
              <p>{{ tweet.message }}</p>
              <p style="font-size: 0.8rem; color: gray">
                {{ tweet.createdOn.toDate().toLocaleString() }}
              </p>
              <v-divider></v-divider>
            </div>
          </div>
        </v-row>
      </v-col>
    </v-layout>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'
import common from '@/const/common'

const db = firebase.firestore()
const usersRef = db.collection('users')
const statusLogsRef = db.collection('statusLogs')
const tweetsRef = db.collection('tweets')
const problemsRef = db.collection('problems')
const answersRef = db.collection('answers')

export default {
  name: 'index',
  middleware: 'auth',
  data: () => ({
    users: [],
    USER_STATUS: common.USER_STATUS,
    task: '',
    tweet: '',
    tweets: [],
    problem: '',
    problems: [],
    responses: [],
    answers: [],
  }),
  computed: {
    //現在のログインユーザーを返す
    currentUser() {
      return this.$store.state.auth.user
    },
  },
  watch: {
    currentUser: function(currentUser) {
      if (!currentUser) return []

      const { teamId } = currentUser
      usersRef.where('teamId', '==', teamId).onSnapshot(snapshot => {
        this.users = []
        snapshot.forEach(doc => {
          this.users.push({ id: doc.id, ...doc.data() })
        })
      })

      tweetsRef
        .where('teamId', '==', teamId)
        .orderBy('createdOn', 'desc')
        .onSnapshot(snapshot => {
          this.tweets = []
          snapshot.forEach(doc => {
            this.tweets.push({ id: doc.id, ...doc.data() })
          })
        })

      problemsRef
        .where('teamId', '==', teamId)
        .orderBy('createdOn', 'desc')
        .onSnapshot(snapshot => {
          this.problems = []
          snapshot.forEach(doc => {
            this.problems.push({
              id: doc.id,
              ...doc.data(),
              answerIsOpen: false,
            })
          })
        })

      answersRef
        .where('teamId', '==', teamId)
        .orderBy('createdOn', 'asc')
        .onSnapshot(snapshot => {
          this.answers = []
          snapshot.forEach(doc => {
            this.answers.push({ id: doc.id, ...doc.data() })
          })
        })
    },
  },
  methods: {
    changeStatus(status) {
      this.updateUser({ status: status })

      const { uid } = this.currentUser
      this.addStatusLog({
        uid: uid,
        status: status,
        createdOn: firebase.firestore.Timestamp.now(),
      })
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
    addStatusLog(data) {
      statusLogsRef.add(data)
    },
    addTweet() {
      tweetsRef.add({
        message: this.tweet,
        createdOn: firebase.firestore.Timestamp.now(),
        uid: this.currentUser.uid,
        displayName: this.currentUser.displayName,
        teamId: this.currentUser.teamId,
      })
      this.tweet = ''
    },
    addProblem() {
      problemsRef.add({
        message: this.problem,
        createdOn: firebase.firestore.Timestamp.now(),
        uid: this.currentUser.uid,
        displayName: this.currentUser.displayName,
        teamId: this.currentUser.teamId,
      })
      this.problem = ''
    },
    addAnswer(problemIndex, problemId) {
      answersRef.add({
        message: this.responses[problemIndex],
        createdOn: firebase.firestore.Timestamp.now(),
        uid: this.currentUser.uid,
        displayName: this.currentUser.displayName,
        teamId: this.currentUser.teamId,
        parentProblemId: problemId,
      })
      this.responses[problemIndex] = ''
    },
    toggleAnswerIsOpen(problemId) {
      this.problems.find(
        p => p.id === problemId
      ).answerIsOpen = !this.problems.find(p => p.id === problemId).answerIsOpen
    },
  },
}
</script>
