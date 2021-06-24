<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},
  data() {
    return {
      message: 'Hello world'
    }
  }
}
</script>

<style lang="scss">
@import "./src/assets/styles";
</style>
