<template>
  <section>
    <v-calendar
      class="calender"
      type="week"
      :weekdays="weekdays"
      :events="events"
      :event-color="getEventColor"
      event-overlap-threshold="10"
    ></v-calendar>
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
.calender {
  height: 70vh;
}
</style>
