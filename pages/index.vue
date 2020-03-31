<template>
  <section>
    <h1>hello</h1>
    <nuxt-link to="/about">To About</nuxt-link>
    <nuxt-link to="/auth">To Authentication Demo</nuxt-link>
  </section>
</template>

<script>
export default {
  name: 'index',
  middleware: 'auth',
}
</script>
