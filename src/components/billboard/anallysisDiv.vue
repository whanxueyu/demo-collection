<template>
    <div :id="id" class="resultMarker">
        <div @click="handleClose" class="btn">*</div>
        <div v-html="htmlContent"></div>
    </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    htmlContent: {
        type: String,
        required: true
    }
});
const handleClose = () => {
    document.getElementById(props.id);
    console.log(document.getElementById(props.id))
};
</script>
<style lang="scss" scoped>
.resultMarker {
    text-align: start;
    padding: 5px 10px;
    padding-right: 15px;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
    background-color: #0009;
    user-select: none;
    max-width: 200px;
    white-space: break-spaces;
    transform: translateY(-60px);
    pointer-events: none;
    z-index: auto;
}
.btn{
    color: rgb(255, 0, 0);
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    text-align: end;
    position: absolute;
    right: 0;
    pointer-events:fill;
}

.resultMarker::after {
    position: absolute;
    display: block;
    content: '';
    // width: 2px;
    left: 50%;
    margin-top: 5px;
    // background-color: #0009;
    border: 2px dashed #111111c7;
    height: 60px;
    pointer-events: none;
    z-index: auto;
}
</style>