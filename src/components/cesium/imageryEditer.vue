<template>
    <div class="imagery-editor">
        <el-button @click="setBlackMap()">暗色地图</el-button>
        <el-color-picker v-model="filterColor" color-format="hex"></el-color-picker>
        <div class="flex">
            <div class="flex-label">Brightness</div>
            <div class="flex-content">
                <el-slider @change="setParmas('brightness')" type="range" :min="0" :max="3" :step="0.02"
                    v-model="viewModel.brightness" />
                <div class="value">{{ viewModel.brightness }}</div>
            </div>
        </div>
        <div class="flex">
            <div class="flex-label">Contrast</div>
            <div class="flex-content">
                <el-slider @change="setParmas('contrast')" type="range" :min="0" :max="3" :step="0.02"
                    v-model="viewModel.contrast" />
                <div class="value">{{ viewModel.contrast }}</div>
            </div>
        </div>
        <div class="flex">
            <div class="flex-label">Hue</div>
            <div class="flex-content">
                <el-slider @change="setParmas('hue')" type="range" :min="0" :max="3" :step="0.02"
                    v-model="viewModel.hue" />
                <div class="value">{{ viewModel.hue }}</div>
            </div>
        </div>
        <div class="flex">
            <div class="flex-label">Saturation</div>
            <div class="flex-content">
                <el-slider @change="setParmas('saturation')" type="range" :min="0" :max="3" :step="0.02"
                    v-model="viewModel.saturation" />
                <div class="value">{{ viewModel.saturation }}</div>
            </div>
        </div>
        <div class="flex">
            <div class="flex-label">Gamma</div>
            <div class="flex-content">
                <el-slider @change="setParmas('gamma')" type="range" :min="0" :max="3" :step="0.02"
                    v-model="viewModel.gamma" />
                <div class="value">{{ viewModel.gamma }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import * as Cesium from 'cesium';
const props = defineProps({
    viewer: {
        type: Cesium.Viewer,
        required: true
    }

});
const viewModel = reactive({
    brightness: 0,
    contrast: 0,
    hue: 0,
    saturation: 0,
    gamma: 0,
})
// 获取 Cesium 视图对象
let viewer: Cesium.Viewer | undefined;
const filterColor = ref('#003690')
const imageryLayers = ref()
const setBlackMap = () => {
    let { red, blue, green } = hexColorToRgba(filterColor.value)
    console.log(red, blue, green)
    modifyMap(viewer, {
        //反色?
        invertColor: true,
        brightness: 0.8,
        filterRGB: [red, green, blue],
        hue: 0.5,
        gamma: 0.2,
        contrast: 3,
        saturation: 1.5,
        // color: 'rgb('+red+','+green+','+blue+')',
    });
}


const modifyMap = (viewer, options) => {
    const baseLayer = viewer.imageryLayers.get(0)
    baseLayer.brightness = options.brightness || 0.6
    baseLayer.contrast = options.contrast || 1.8
    baseLayer.gamma = options.gamma || 0.3
    baseLayer.hue = options.hue || 1
    baseLayer.saturation = options.saturation || 0
    const baseFragShader = (viewer.scene.globe)._surfaceShaderSet
        .baseFragmentShaderSource.sources
    for (let i = 0; i < baseFragShader.length; i++) {
        const strS = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
        let strT = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
        if (options.invertColor) {
            strT += `
                color.r = 1.0 - color.r;
                color.g = 1.0 - color.g;
                color.b = 1.0 - color.b;
                `
        }
        if (options.filterRGB.length > 0) {
            strT += `
                color.r = color.r * ${options.filterRGB[0]}.0/255.0;
                color.g = color.g * ${options.filterRGB[1]}.0/255.0;
                color.b = color.b * ${options.filterRGB[2]}.0/255.0;
                `
        }
        baseFragShader[i] = baseFragShader[i].replace(strS, strT)
    }
    nextTick(() => {
        updateViewModel()
    })
}
const updateViewModel = () => {
    if (imageryLayers.value.length > 0) {
        const layer = imageryLayers.value.get(0);
        viewModel.brightness = layer.brightness;
        viewModel.contrast = layer.contrast;
        viewModel.hue = layer.hue;
        viewModel.saturation = layer.saturation;
        viewModel.gamma = layer.gamma;
    }
}

const setParmas = (name: string) => {
    const layer = imageryLayers.value.get(0);
    if (layer) {
        layer[name] = viewModel[name]
    }
}
const hexColorToRgba = (color: string) => {
    // 检查输入颜色是否以 "#" 开头
    if (!color.startsWith('#')) {
        throw new Error('Invalid hex color format. Color should start with "#".');
    }

    // 获取去掉 "#" 后的颜色值部分
    const hexValue = color.slice(1);

    // 根据颜色值长度确定是 RGB 还是 RGBA
    const isRgba = hexValue.length === 8;

    // 确保颜色值长度合法（6 或 8 位）
    if (hexValue.length !== 6 && hexValue.length !== 8) {
        throw new Error(`Invalid hex color length. Expected 6 or 8 characters, got ${hexValue.length}.`);
    }

    // 将十六进制颜色值转换为十进制整数
    const hexToInt = (hex: string) => parseInt(hex, 16);

    // 提取 RGB 分量
    const redHex = hexValue.substring(0, 2);
    const greenHex = hexValue.substring(2, 4);
    const blueHex = hexValue.substring(4, 6);

    const red = hexToInt(redHex);
    const green = hexToInt(greenHex);
    const blue = hexToInt(blueHex);

    // 如果是 RGBA，提取 Alpha 分量
    let alpha = 1;
    if (isRgba) {
        const alphaHex = hexValue.substring(6, 8);
        alpha = hexToInt(alphaHex);
    }

    return {
        red: red,
        green: green,
        blue: blue,
        alpha: alpha
    };
};
onMounted(() => {
    viewer = props.viewer
    if (viewer) {
        imageryLayers.value = viewer.imageryLayers;
        nextTick(() => {
            updateViewModel()
        })
    }
});

</script>

<style scoped lang="scss">
.imagery-editor {
    background: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color);
    position: absolute;
    z-index: 999;
    border-radius: 4px;
    bottom: 30px;
    left: 10px;
    padding: 10px;

    .flex-label {
        width: 70px;
        margin-right: 10px
    }

    .flex-content {
        width: 160px;
        display: flex;
        line-height: 32px;

        .value {
            width: 20px;
            margin-left: 10px;
        }
    }
}
</style>