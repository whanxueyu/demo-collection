<!-- aframehouse -->
<template>
    <div>
        <a-scene class="viewwe">
            <a-sky :src="require('../../assets/house.jpg')"></a-sky>
        </a-scene>
    </div>
</template>

<script setup>

</script>
<style scoped>
.viewwe {
    height: calc(100vh - 60px);
    overflow: hidden;
}

.aframeBtn {
    z-index: 999;
    position: fixed;
    margin-top: 15px;
    left: 20px;
}

:deep(.viewwe .a-canvas) {
    position: absolute !important;
    height: 100%;
    width: 100%;
}
</style>