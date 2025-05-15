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
                sceneId: 'first',
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
    show: false,
    scenes: {
        'first': {
            type: "cubemap", // 全景图类型
            cubeMap: [
                //立方体全景图六张图
                "https://img.alicdn.com/imgextra/i4/O1CN014TNffn1nlaTfA98Fg_!!6000000005130-0-tps-1500-1500.jpg",
                "https://img.alicdn.com/imgextra/i3/O1CN01LsO1Bk20QbKpFTUQr_!!6000000006844-0-tps-1500-1500.jpg",
                "https://img.alicdn.com/imgextra/i1/O1CN01sS5m781ya6JgLSaVk_!!6000000006594-0-tps-1500-1500.jpg",
                "https://img.alicdn.com/imgextra/i3/O1CN01uTWCLc1XOCOuA92H0_!!6000000002913-0-tps-1500-1500.jpg",
                "https://img.alicdn.com/imgextra/i4/O1CN016lU3YJ1JdrJuFTcWt_!!6000000001052-0-tps-1500-1500.jpg",
                "https://img.alicdn.com/imgextra/i2/O1CN01nYe2Mn1ohkmBVyKpp_!!6000000005257-0-tps-1500-1500.jpg",
            ],
            hotSpots: [
                {
                    yaw: -185,
                    pitch: -4,
                    type: "scene",
                    cssClass: "path",
                    sceneId: "second",
                    // id: "one",
                    text: "卧室",
                    // image: require("../../assets/logo.png"),
                    // scale: true,
                },
                {
                    yaw: -28,
                    pitch: -2,
                    cssClass: "hole",
                    // clickHandlerFunc: '',
                    text: '大广场',
                    scale: true,
                    type: "scene",
                    sceneId: "third",
                    // image: "./images/hot.png",
                },
                {
                    yaw: 10,
                    pitch: 15,
                    roll: -10,
                    // cssClass: "xiaochengxu",
                    clickHandlerFunc: '',
                    scale: true,
                    // image: "./images/hot.png",
                },
            ],
        },
        'scene2': {
            type: "cubemap",
            cubeMap: [
                "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_f.jpg?x-oss-process=style/nocut_compress",
                "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_r.jpg?x-oss-process=style/nocut_compress",
                "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_b.jpg?x-oss-process=style/nocut_compress",
                "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_l.jpg?x-oss-process=style/nocut_compress",
                "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_u.jpg?x-oss-process=style/nocut_compress",
                "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_d.jpg?x-oss-process=style/nocut_compress",
            ],
            hotSpots: [
                {
                    pitch: 0,
                    yaw: 20,
                    type: "info",
                    id: "one",
                    text: "123",
                    // image: "./images/hot.png",
                },
                {
                    pitch: -5,
                    yaw: 80,
                    type: "scene",
                    cssClass: "path",
                    sceneId: "first",
                    // id: "two",
                    text: "小客厅",
                    // image: "./images/hot.png",
                },
            ],
        },
        third: {
            type: 'equirectangular',
            panorama: require("../../assets/360.jpg"),
            autoLoad: true,
            showControls: true,
            roll: 0, // z轴 横着的
            hfov: 120, // 摄像机视角（纵深远近关系，数值越大越远越多）
            hotSpots: [
                {
                    pitch: 1.1,
                    yaw: 1.4,
                    type: 'scene',
                    text: '小客厅',
                    cssClass: "hole",
                    sceneId: 'first',
                },
                {
                    pitch: -10.8,
                    yaw: -42.6,
                    type: 'scene',
                    cssClass: "hole",
                    text: '大客厅',
                    sceneId: 'four',
                },
            ],
        },
        four: {
            type: 'equirectangular',
            panorama: require("../../assets/house.jpg"),
            autoLoad: true,
            showControls: false,
            hotSpots: [
                {
                    pitch: 1.1,
                    yaw: 1.4,
                    type: 'scene',
                    text: '客厅',
                    cssClass: "path",
                    sceneId: 'first',
                },
                {
                    pitch: -10.8,
                    yaw: -42.6,
                    type: 'scene',
                    text: '卧室',
                    cssClass: "path",
                    sceneId: 'second',
                },
            ],
        },
    },
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