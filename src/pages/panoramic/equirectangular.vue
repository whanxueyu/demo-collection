<template>
    <VuePannellum ref="pannellumViewer" class="viewwe" :src="state.options.panorama"
        :hotSpots="state.options.hotSpots" />
</template>

<script setup>
import 'pannellum/build/pannellum.css';
import { onMounted, reactive, ref } from 'vue'
import VuePannellum from 'vue-pannellum';

const state = reactive({
    viewer: null,
    options: {
        type: 'equirectangular',
        panorama: require('../../assets/house.jpg'),
        autoLoad: true,
        showControls: false,
        hotSpots: [
            {
                pitch: 1.1,
                yaw: 1.4,
                type: 'scene',
                text: '第一个场景',
                sceneId: 'scene1',
            },
            {
                pitch: -10.8,
                yaw: -42.6,
                type: 'scene',
                text: '第二个场景',
                sceneId: 'scene2',
            },
        ],
        scenes: {
            scene1: {
                title: '第一个场景',
                panorama: require('../../assets/360.jpg'),
                hotSpots: [
                    {
                        pitch: 1.1,
                        yaw: 1.4,
                        type: 'scene',
                        text: '360的hotpot',
                        sceneId: 'scene2',
                    }
                ]
            } ,
            scene2: {
                title: '第二个场景',
                panorama: require('../../assets/house.jpg'),
                hotSpots: [
                    {
                        pitch: 1.1,
                        yaw: 1.4,
                        type: 'scene',
                        text: 'house的hotpot',
                        sceneId: 'scene1',
                    }
                ]
            }
        }
    },

})
const pannellumViewer = ref()
onMounted(() => {
    // console.log(pannellum)
    // state.viewer = pannellum.viewer(pannellumViewer.value, state.options);
})

</script>
<style scoped lang="scss">
.viewwe {
    height: calc(100vh - 60px);
}
</style>