<template>
  <section>
    <div class="d-none d-sm-flex flex-column">
      <v-calendar
        class="calendar"
        type="week"
        :weekdays="weekdays"
        :events="events"
        :event-color="getEventColor"
        event-overlap-threshold="10"
      ></v-calendar>
    </div>
    <div class="d-flex d-sm-none flex-column" style="position: relative">
      <v-btn
        fab
        absolute
        left
        top
        small
        color="primary"
        v-if="date !== weekAgo"
        @click="$refs.calendar.prev()"
      >
        <v-icon dark>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        fab
        absolute
        right
        top
        small
        color="primary"
        v-if="date !== today"
        @click="$refs.calendar.next()"
      >
        <v-icon dark>mdi-chevron-right</v-icon>
      </v-btn>
      <v-calendar
        ref="calendar"
        class="calendar"
        v-model="date"
        type="day"
        :events="events"
        :event-color="getEventColor"
        event-overlap-threshold="10"
      ></v-calendar>
    </div>
  </section>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Calender',
  props: {
    events: Array,
  },
  data: () => ({
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    date: moment().format('YYYY-MM-DD'),
    today: moment().format('YYYY-MM-DD'),
    weekAgo: moment()
      .subtract(6, 'day')
      .format('YYYY-MM-DD'),
  }),
  mounted() {
    const defaultWeekdays = [1, 2, 3, 4, 5, 6, 0]
    const todayOfWeek = moment().day()
    this.weekdays = this.rotateArray(defaultWeekdays, todayOfWeek)
  },
  methods: {
    rotateArray(array, number) {
      for (let i = 0; i < number; i++) {
        array.push(array[i])
      }
      array.splice(0, number)
      return array
    },
    getEventColor(event) {
      return event.color
    },
  },
}
</script>

<style scoped>
.calendar {
  height: 70vh;
}
</style>
