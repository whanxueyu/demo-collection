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
html,
body {
    // max-height: 100vh;
    // overflow: hidden;
}
body {
    padding: 0;
    margin: 0;
    background: #000000;
    font-size: 14px;
    line-height: 1;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;

input {
    border: 0;
    outline: 0;
    font-size: 100%;
    vertical-align: baseline;
    background: transparent;
    color: #9c9c9c;
}
}
</style>
