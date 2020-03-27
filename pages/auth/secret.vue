<template>
  <section>
    <h1>Secret Page</h1>
    <div>こんにちは、{{ displayName }} さん</div>
  </section>
</template>

<script>
export default {
  name: 'secret',
  middleware: 'auth',
  mounted() {
    this.$store.watch(
      state => state.auth.user,
      newValue => (this.displayName = newValue.displayName)
    )
  },
  asyncData: ({ store }) => {
    const user = store.state.auth.user
    let displayName = ''

    if (user) displayName = user.displayName
    return {
      displayName,
    }
  },
}
</script>
