<template>
    <div class="btn">
        <slot></slot>
    </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
    name: 'shadowBtn2',
    setup() {
        const data = reactive({
        });
        return {
            ...toRefs(data),
        };
    },
});
</script>
<style lang="scss" scoped>
@keyframes rotate {
    100% {
        transform: translate(-50%, -50%) rotate(1turn);
    }
}

.btn {
    position: relative;
    z-index: 0;
    width: 160px;
    height: 60px;
    line-height: 60px;
    color: #fa8039;
    font-size: 24px;
    border-radius: 10px;
    text-align: center;
    margin: auto;
    overflow: hidden;
    cursor: pointer;
    transition: .3s;
    -webkit-box-reflect: below 10px linear-gradient(transparent, rgba(0, 0, 0, .4));

    &:hover {
        color: #fff;
        box-shadow: 0 0 5px #fa8039,
            0 0 25px #fa8039;;

        &::after,
        &::before {
            transition: .3s;
            background: #fa8039;;
        }
    }

    &::before {
        content: '';
        position: absolute;
        z-index: -2;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 150%;
        height: 300%;
        background-color: #000000;
        background-repeat: no-repeat;
        background-size: 50% 50%;
        background-position: 0 0;
        background-image: conic-gradient(#fa8039, #fa8039);
        animation: rotate 2s linear infinite;
    }

    &::after {
        content: '';
        position: absolute;
        z-index: -1;
        left: 2px;
        top: 2px;
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        background: #000000;
        border-radius: 10px;
    }
}
// 滤镜色相旋转
// 角度设定图像会被调整的色环角度值。
// 值为 0deg，则图像无变化。
// 若值未设置值，默认为 0deg。
// 该值虽然没有最大值，超过 360deg 的值相当于又绕一圈。
.btn1 {
    filter: hue-rotate(180deg);
}

.btn2 {
    filter: hue-rotate(270deg);
}

.btn3 {
    filter: hue-rotate(90deg);
}
</style>