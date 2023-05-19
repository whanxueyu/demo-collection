<template>
    <VuePannellum ref="pannellumViewer" class="viewwe" :panorama="'../assets/360.jpg'" :options="state.options" />
</template>

<script>
import 'pannellum/build/pannellum.css';
import { onMounted, reactive, ref } from 'vue'
import VuePannellum from 'vue-pannellum';
export default {
    components: {
        VuePannellum,
    },
    name: 'pannellumVue',
    setup() {
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
                        yaw: 222.6,
                        type: 'scene',
                        text: '第二个场景',
                        sceneId: 'scene3',
                    },
                ],
            },

        })
        const pannellumViewer = ref()
        onMounted(() => {
            // console.log(pannellum)
            // state.viewer = pannellum.viewer(pannellumViewer.value, state.options);
        })
        return {
            state,
            pannellumViewer
        }
    }
}
</script>
<style>
.viewwe{
height: calc(100vh - 60px);
}
</style>