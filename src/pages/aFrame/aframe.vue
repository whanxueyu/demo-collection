<template>
    <div>
        <el-button class="aframeBtn" type="danger" plain @click="state.viewer = false" v-if="state.viewer">退出</el-button>
        <el-button class="aframeBtn" type="primary" @click="state.viewer = true" v-if="!state.viewer">进入</el-button>
        <a-scene class="viewwe" v-if="state.viewer">
            <a-assets>
                <img id="skyNight" src="https://cdn.aframe.io/360-image-gallery-boilerplate/img/sechelt.jpg">
                <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg">
                <!-- <a-asset-item id="cityModel" :src="'../../assets/VC.gltf'"></a-asset-item> -->
                <!-- <a-asset-item id="crate-obj" :src="require('../../assets/stone.obj')"></a-asset-item>
                <a-asset-item id="crate-mtl" :src="require('../../assets/decor4.mtl')"></a-asset-item> -->
            </a-assets>
            <!-- 纹理可直接引入图片地址，或使用上方图片 -->
            <!-- <a-sky :src="require('../../assets/house.jpg')"></a-sky> -->
            <a-sky src="#skyNight"></a-sky>
            <a-box color="#4CC3D9" position="0 2 -5" rotation="0 45 45" scale="1 1 1"
                animation="property: position; to: 0 2.2 -5; dur: 2000; easing: linear; loop: true">
            </a-box>
            <!-- 地面，repeat接受2个数字，分别是x和y方向的重复次数（通常称为纹理的U和V） -->
            <a-plane src="#groundTexture" rotation="-90 0 0" width="30" height="30"></a-plane>
            <!-- 环境光 -->
            <a-light type="ambient" color="#446471"></a-light>
            <!-- 点光源 -->
            <a-light type="point" intensity="2" position="2 4 4"></a-light>
            <!-- <a-obj-model position="1 2 -2" src="#crate-obj" mtl="#crate-mtl"></a-obj-model> -->
            <!-- <a-entity position="1 1 -2" gltf-model="#cityModel" scale="0.01 0.01 0.01"></a-entity> -->
            <!-- <a-obj-model position="1 1 -2" src="../../assets/stone.obj" :mtl="require('../../assets/decor4.mtl')"></a-obj-model> -->

        </a-scene>
    </div>
</template>

<script>
import { onMounted, reactive } from 'vue'
export default {
    name: 'aframe',
    setup() {
        const state = reactive({
            viewer: true,
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

.aframeBtn {
    z-index: 999;
    position: fixed;
    margin-top: 15px;
    left: 20px;
}
</style>