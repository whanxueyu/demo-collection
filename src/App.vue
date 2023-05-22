<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style lang="scss">
@import '@/static/css/theme.scss';
@import '@/static/css/common.scss';
*{
    margin: 0;
    padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
