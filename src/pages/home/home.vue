<template>
    <div class="container">
        <div class="hd">
            <div class="title">
                <cyText :text="state.title"></cyText>
            </div>
            <div class="img">
                <cyImg :imgurl="state.imgurl">
                    <div class="tip">
                        <typing word="Pure CSS Typing animation."></typing>
                    </div>
                </cyImg>
            </div>
            <div class="btn">
                <svgBtn1 :text="state.btn1"></svgBtn1>
                <svgBtn2 :text="state.btn2"></svgBtn2>
            </div>
        </div>
        <div class="bd">
            <div class="title">
                <cyText :text="state.title1"></cyText>
            </div>
            <bigEye></bigEye>
        </div>
        <div class="ft" v-show="false">
            <div class="main">
                <div class="t"></div>
                <div class="r"></div>
                <div class="b"></div>
                <div class="l"></div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { onMounted, reactive, ref } from 'vue'
import cyText from '@/components/cyber/text.vue'
import cyImg from '@/components/cyber/img.vue'
import svgBtn1 from '@/components/cyber/svgbutton1.vue'
import svgBtn2 from '@/components/cyber/svgbutton2.vue'
import typing from '@/components/typing.vue'
import bigEye from '@/components/bigEye.vue'
export default {
    components: {
        cyImg,
        svgBtn1,
        svgBtn2,
        cyText,
        typing,
        bigEye
    },
    name: 'home',
    setup() {
        const state = reactive({
            imgurl: require('@/static/img/Cyber2.jpg'),
            title: 'Cyber 赛博风格',
            title1:'3D鼠标跟随眼睛',
            btn1: "横向按钮",
            btn2: "竖向按钮"
        })
        const url = ref('')
        onMounted(() => {

        })
        return {
            state,
            url,
        }
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
    margin: 0;
    overflow: auto;
}
.title {
        width: calc(100vw - 40px);
        background-color: #000;
        height: 60px;
        line-height: 56px;
        padding: 0 20px;
    }
.hd {
    width: 100%;
    height: 100%;
    display: block;
    .img {
        width: 100vw;
        height: 800px;

        .tip {
            background: #000;
            position: absolute;
            margin: 100px;
            // width: 600px;
            padding: 40px;
            opacity: 1;
        }
    }

    .btn {
        padding: 20px 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
}

.bd {
    height: calc(100vh - 60px);

    .floattitle {
        color: #fff;
        float: left;
    }
}

.ft {
    background: #575757;
    display: flex;
    height: calc(100vh - 60px);
    margin: 0;
    overflow: hidden;

    .main {
        /* Timing */
        --durM: 6s;
        --durD: 0.5s;
        /* Tunnel itself */
        --size: 20em;
        --depth: calc(var(--size) * 6);
        --bgPos: calc(var(--size) * 0.4);
        /* Camera movement */
        --endX1: 45%;
        --endX2: 55%;
        --endY1: 46%;
        --endY2: 54%;
        animation: po var(--durM) ease-in-out infinite;
        margin: auto;
        overflow: hidden;
        perspective: 5em;
        perspective-origin: 50% 50%;
        position: relative;
        width: 100%;
        height: calc(100vh - 60px);
        width: var(--size);
        height: var(--size);
        transform: scale(6);
    }

    .main:before,
    div {
        position: absolute;
    }

    .main:before {
        animation: end var(--durM) ease-in-out infinite;
        background: currentColor;
        box-shadow: 0 0 1em 1em;
        color: #000;
        content: "";
        display: block;
        margin: -0.5em -0.5em;
        width: 1em;
        height: 1em;
        top: 50%;
        left: 50%;
        z-index: 5;
    }

    div {
        background: conic-gradient(#000 25%, #fff 0 50%, #000 0 75%, #fff 0) 0 0 / var(--bgPos) var(--bgPos);
    }

    .t,
    .l {
        top: 0;
        left: 0;
        transform-origin: 0 0;
    }

    .r,
    .b {
        right: 0;
        bottom: 0;
        transform-origin: 100% 100%;
    }

    .t,
    .b {
        width: 100%;
        height: var(--depth);
    }

    .r,
    .l {
        filter: brightness(70%);
        width: var(--depth);
        height: 100%;
    }

    .t {
        animation: t var(--durD) linear infinite;
        background-position: 0 calc(var(--bgPos) / 2);
        filter: brightness(40%);
        transform: rotateX(-90deg);
    }

    .r {
        animation: r var(--durD) linear infinite;
        background-position: calc(var(--bgPos) / 2) 0;
        transform: rotateY(-90deg);
    }

    .b {
        animation: b var(--durD) linear infinite;
        transform: rotateX(90deg);
    }

    .l {
        animation: l var(--durD) linear infinite;
        transform: rotateY(90deg);
    }

    @keyframes po {

        from,
        to {
            perspective-origin: var(--endX1) var(--endY1)
        }

        25% {
            perspective-origin: var(--endX2) var(--endY1)
        }

        50% {
            perspective-origin: var(--endX2) var(--endY2)
        }

        75% {
            perspective-origin: var(--endX1) var(--endY2)
        }
    }

    @keyframes t {
        to {
            transform: rotateX(-90deg) translateY(calc(var(--bgPos) * -1))
        }
    }

    @keyframes r {
        to {
            transform: rotateY(-90deg) translateX(var(--bgPos))
        }
    }

    @keyframes b {
        to {
            transform: rotateX(90deg) translateY(var(--bgPos))
        }
    }

    @keyframes l {
        to {
            transform: rotateY(90deg) translateX(calc(var(--bgPos) * -1))
        }
    }

    @keyframes end {

        from,
        to {
            top: var(--endY1);
            left: var(--endX1);
        }

        25% {
            top: var(--endY1);
            left: var(--endX2);
        }

        50% {
            top: var(--endY2);
            left: var(--endX2);
        }

        75% {
            top: var(--endY2);
            left: var(--endX1);
        }
    }
}
</style>
  