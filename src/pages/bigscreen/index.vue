<template>
    <div class="side"></div>
    <iframe></iframe>
</template>
  
<script>
import { onMounted, reactive, ref } from 'vue'
export default {
    name: 'bigScreen',
    setup() {
        const list = ref([])
        const state = reactive({
            url: ''
        })
        onMounted(() => {

        })
    }
}
</script>
  
<style lang="scss"></style>
  