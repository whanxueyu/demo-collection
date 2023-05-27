<!-- aframehouse -->
<template>
    <div>
        <el-button class="aframeBtn" type="danger" plain @click="state.viewer = false" v-if="state.viewer">退出</el-button>
        <el-button class="aframeBtn" type="primary" @click="state.viewer = true" v-if="!state.viewer">进入</el-button>
        <a-scene class="viewwe" v-if="state.viewer">
            <a-sky :src="require('../../assets/house.jpg')"></a-sky>
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