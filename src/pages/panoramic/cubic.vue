<template>
    <VuePannellum ref="pannellumViewer" class="viewwe" :src="{
        pz: require('../../assets/house/pz.png'),
        px: require('../../assets/house/px.png'),
        nz: require('../../assets/house/nz.png'),
        nx: require('../../assets/house/nx.png'),
        py: require('../../assets/house/py.png'),
        ny: require('../../assets/house/ny.png'),
    }" :hotSpots="state.options.hotSpots" />
</template>

<script setup>
import 'pannellum/build/pannellum.css';
import { onMounted, reactive, ref } from 'vue'
import VuePannellum from 'vue-pannellum';

const state = reactive({
    viewer: null,
    options: {
        type: 'equirectangular',
        panorama: '../assets/360.jpg',
        autoLoad: true,
        showControls: false,
        hotSpots: [
            {
                pitch: 14.1,
                yaw: -11.4,
                type: 'scene',
                text: '第一个场景',
                sceneId: 'scene2',
            },
            {
                pitch: -10.8,
                yaw: -42.6,
                type: 'scene',
                text: '第二个场景',
                sceneId: 'scene3',
            },
        ],
    },
    imgobj: {
        pz: require('../../assets/house/pz.png'),
        px: require('../../assets/house/px.png'),
        nz: require('../../assets/house/nz.png'),
        nx: require('../../assets/house/nx.png'),
        py: require('../../assets/house/py.png'),
        ny: require('../../assets/house/ny.png'),
    },
    show: false
})
const pannellumViewer = ref()
onMounted(() => {
})

</script>
<style scoped lang="scss">
.viewwe {
    height: calc(100vh - 60px);
}
</style>