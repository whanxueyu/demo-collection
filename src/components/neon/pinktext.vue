<template>
    <div class="pink">{{ textStr }}</div>
</template>
<script setup>
</script>
<style lang="scss" scoped>
.pink {
    display: inline;
    font-family: 'Lobster';
    text-align: center;
    font-size: 26px;
    line-height: 40px;
    color: #e91e84;
    cursor: pointer;
    
    &:hover {
        color: #fff;
        animation: pink 1.5s ease-in-out infinite alternate;
    }
}

@keyframes pink {
  to {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #e91e84, 0 0 35px #e91e84, 0 0 40px #e91e84, 0 0 50px #e91e84, 0 0 75px #e91e84;
  }
  from {
    filter: brightness(110%);
    text-shadow: 0 0 2px #fff, 0 0 5px #fff, 0 0 8px #fff, 0 0 10px #e91e84, 0 0 17px #e91e84, 0 0 20px #e91e84, 0 0 25px #e91e84, 0 0 40px #e91e84;
    
  }
}
</style>