<template>
    <div :class="['shadow-text', props.direction]" :style="{ textShadow: makeLongShadow(props.shadowColor, props.direction) }">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'CpShadowText',
})
const props = defineProps({
    direction: {
        type: String,
        default: 'left',
    },
    shadowColor: {
        type: String,
        default: '#ae0ed68c',
    },
    long:{
        type: Number,
        default: 20,
    }
})

const makeLongShadow = (color,direction): string => {
    let val = `0px 0px ${color}`;

    for (let i = 1; i <= props.long; i++) {
        const newColor = adjustColor(color, i);
        val += `, ${direction === 'left' ? '-' : ''}${i}px ${i}px ${newColor}`;
    }
    return val;
};
const adjustColor = (color: string, step: number): string => {
    // 解析颜色字符串
    const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(color);
    const rgbMatch = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(,\s*([\d.]+))?\)$/i.exec(color);

    if (hexMatch) {
        const r = parseInt(hexMatch[1], 16);
        const g = parseInt(hexMatch[2], 16);
        const b = parseInt(hexMatch[3], 16);
        const a = hexMatch[4] ? parseInt(hexMatch[4], 16) / 255 : 1;

        // 调整透明度
        const newAlpha = Math.max(0, a - step * 0.05);

        return `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
    } else if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        const a = rgbMatch[5] ? parseFloat(rgbMatch[5]) : 1;

        // 调整透明度
        const newAlpha = Math.max(0, a - step * 0.05);

        return `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
    } else {
        throw new Error(`Unsupported color format: ${color}`);
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.shadow-text {
    text-align: center;
    display: inline-block;
}
</style>