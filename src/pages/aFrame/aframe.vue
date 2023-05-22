<template>
    <a-scene class="viewwe">
        <a-sky :src="require('../../assets/house.jpg')"></a-sky>
    </a-scene>
</template>

<script>
import { onMounted, reactive} from 'vue'
export default {
    name: 'aframe',
    setup() {
        const state = reactive({
            viewer: null,
        })
        onMounted(() => {
        })
        return {
            state
        }
    }
}
</script>
<style>
.viewwe {
    height: calc(100vh - 100px);
    overflow: hidden;
}
</style>