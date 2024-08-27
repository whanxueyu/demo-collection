<template>
    <div class="outer-box" ref="fullPage">
        <div ref="element" :class="{ activeTranstion: isCloseTranstion }" class="inner-box" @mousewheel="mousewheel"
            @touchstart="handleTouchStart" @touchend="handleTouchEnd" @touchmove="handleTouchMove">
            <div class="section section1 scroll-element">
                <div class="title">
                    <cyber-text textStr="Cyberpunk Banner"></cyber-text>
                </div>
                <div class="banner">
                    <shadow-banner></shadow-banner>
                </div>
            </div>
            <div class="section section1 scroll-element">
                <div class="title">
                    <cyber-text textStr="Cyberpunk Image"></cyber-text>
                </div>
                <div class="img">
                    <cyber-img :imgurl="state.imgurl">
                        <div class="tip">
                            <typing word="Pure CSS Typing Animation Cyberpunk Style."></typing>
                        </div>
                    </cyber-img>
                </div>
            </div>
            <div class="section section2 scroll-element">
                <div class="title">
                    <cyber-text :textStr="state.title1"></cyber-text>
                </div>
                <div class="btn">
                    <errorbutton>{{ state.btn3 }}</errorbutton>
                </div>
                <div class="btn">
                    <neon-button1>{{ state.neonBtn }}</neon-button1>
                    <neon-button2>{{ state.neonBtn }}</neon-button2>
                    <neon-button3>{{ state.neonBtn }}</neon-button3>
                </div>
                <div class="btn">
                    <shadow-btn1 class="shadow">NEON</shadow-btn1>
                    <shadow-btn2 class="shadow">NEON</shadow-btn2>
                    <shadow-btn3 class="shadow">NEON</shadow-btn3>
                    <shadow-btn4 class="shadow">NEON</shadow-btn4>
                </div>
            </div>
            <div class="section section3 scroll-element">
                <big-eye></big-eye>
            </div>
            <div class="section section4 scroll-element">
                <div class="title flex justify-between">
                    <right-shadow></right-shadow>
                    <left-shadow></left-shadow>
                </div>
                <div class="movetext">
                    <move-text text="CyberPunk"></move-text>
                </div>
                <move-card></move-card>
            </div>
        </div>
        <ul class="aside">
            <li v-for="(item, index) in asideData" @click="changeBac(index)">
                <span :class="{ active: index === $index }"></span>
                <div v-show="index === $index" class="show-dec">{{ item.title }}</div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import cyberText from '@/components/cyber/text.vue'
import cyberImg from '@/components/cyber/img.vue'
import svgBtn1 from '@/components/cyber/svgbutton1.vue'
import svgBtn2 from '@/components/cyber/svgbutton2.vue'
import typing from '@/components/typing.vue'
import bigEye from '@/components/bigEye.vue'
import errorbutton from '@/components/cyber/errorbutton.vue'
import pinkText from '@/components/neon/pinktext.vue'
import neonButton1 from '@/components/neon/button1.vue'
import neonButton2 from '@/components/neon/button2.vue'
import neonButton3 from '@/components/neon/button3.vue'
import shadowBtn1 from '@/components/neon/shadowBtn1.vue'
import shadowBtn2 from '@/components/neon/shadowBtn2.vue'
import shadowBtn3 from '@/components/neon/shadowBtn3.vue'
import shadowBtn4 from '@/components/neon/shadowBtn4.vue'
import shadowBanner from '@/components/shadowBanner.vue'
import moveText from '@/components/3D/moveText.vue'
import moveCard from '@/components/3D/moveCard.vue'
import leftShadow from '@/components/3D/leftShadow.vue'
import rightShadow from '@/components/3D/rightShadow.vue'

const state = reactive({
    imgurl: require('@/static/img/Cyber2.jpg'),
    title: 'Cyberpunk 赛博朋克风格',
    title1: 'Cyberpunk Button',
    btn1: "横向按钮",
    btn2: "竖向按钮",
    btn3: 'AVAILABLE NOW',
    neonBtn: 'NEON BUTTON'
})
import { useWindowSize } from '@vueuse/core'
import { ref, computed, watchEffect } from 'vue'

const asideData = ref([
    {
        title: '轮播图',
    },
    {
        title: '故障图片',
    },
    {
        title: '按钮',
    },
    {
        title: '大眼睛',
    },
    {
        title: '3D文字',
    }
])
// ELEMENT
const element = ref('element')
watchEffect(() => {
    if (element.value.style) {
        // element.value.style.transform = transformScroll.value
        element.value.style.top = transformScroll.value
    }
})

//HEIGHT
const { height } = useWindowSize()
const windowHeight = computed(() => {
    // 高度变化时需要关闭动画
    isCloseTranstion.value = true
    return height.value
})
const transformScroll = computed(() => {
    // return `translateY(-${$index.value * windowHeight.value}px)`
    return `-${$index.value * windowHeight.value}px`
})

const isCloseTranstion = ref(false) //控制是否显示动画效果
const canRun = ref(true) //节流控制器

function mousewheel(e) {
    isCloseTranstion.value = false
    if (canRun.value) {
        canRun.value = false
        goScroll(e)
        setTimeout(() => {
            canRun.value = true
        }, 500)
    }
}

//#region 移动端
const startY = ref(0) //记录开始位置
const endY = ref(0) //记录结束位置
const moveDistance = ref(0) //滑动距离

// 触摸开始
function handleTouchStart(e) {
    startY.value = e.touches[0].pageY || e.changedTouches[0].pageY
}

// 触摸抬起
function handleTouchEnd(e) {
    e.preventDefault()
    // 抬起时开启动画
    isCloseTranstion.value = false
    // 计算结束距离
    endY.value = e.changedTouches[0].pageY || e.touches[0].pageY
    // 计算移动距离，判断应该上一页还是下一页，直接更改index即可在原先基础上整页移动
    moveDistance.value = endY.value - startY.value
    // 这里我做了一个最小值 大于50才翻页
    if (Math.abs(moveDistance.value) >= 60) {
        if ($index.value < asideData.value.length - 1 && moveDistance.value < 0) {
            $index.value++
        }
        if ($index.value > 0 && moveDistance.value > 0) {
            $index.value--
        }
    } else {
        // 当临界值小于60意味着不需要翻页 就恢复原来的位置即可
        // element.value.style.transform = `translateY(-${$index.value * windowHeight.value}px)`
        element.value.style.top = `-${$index.value * windowHeight.value}px`
    }
}

// 触摸移动
function handleTouchMove(e) {
    isCloseTranstion.value = true // 开始移动 关闭动画
    // e.stopPropagation()
    e.preventDefault()
    // if (isIOS()) {
    //   return
    // }
    moveDistance.value = (e.changedTouches[0].pageY || e.touches[0].pageY) - startY.value // 计算移动距离\
    //判断临界点
    const isCriticalPoint =
        ($index.value === asideData.value.length - 1 && moveDistance.value < 0) ||
        ($index.value === 0 && moveDistance.value > 0)
    // 如果是临界点就直接返回
    if (isCriticalPoint) {
        return
    }
    // 否则直接对内层容器应用 随之移动
    // element.value.style.transform = `translateY(-${$index.value * windowHeight.value + moveDistance.value * -1}px)`
    element.value.style.top = `-${$index.value * windowHeight.value + moveDistance.value * -1}px`
}
//#endregion

//ANOTHER writting about full-page
// const { y } = useScroll(document)
// watchThrottled(
//   y,
//   (newValue, oldValue) => {
//     if (newValue > oldValue && newValue > 120) {
//       next()
//     } else {
//       last()
//     }
//   },
//   { throttle: 300 },
// )

function goScroll(e) {
    //e.wheelDelta 用来判断上一个下一个 <0 下一个 >0上一个
    if (e.wheelDelta < 0) {
        next()
    } else {
        last()
    }
}

//$INDEX
const $index = ref(0) //索引控制第几个显示
// 下一个
function next() {
    if ($index.value < asideData.value.length - 1) {
        $index.value++
    }
}
// 上一个
function last() {
    if ($index.value > 1 || $index.value === 1) {
        $index.value--
    }
}

// 点击切换
function changeBac(index) {
    // 点击切换时需要开启动画
    isCloseTranstion.value = false
    $index.value = index
}
onMounted(() => {

})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import url('./style.scss');

.activeTranstion {
    transition: all 0ms ease 0s !important;
}

.active {
    display: inline-block;
    width: 12px !important;
    height: 12px !important;
}

.outer-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .inner-box {
        position: absolute;
        width: 100%;
        transition: all ease-in-out 0.5s;

        .scroll-element {
            // height: 100%;
            background-size: cover !important;
            background-position: center;
            background-repeat: no-repeat;
        }
    }

    .section {
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .aside {
        list-style: none;
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);

        li {
            height: 14px;
            width: 14px;
            margin: 7px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            .show-dec {
                text-align: right;
                position: absolute;
                width: 100px;
                right: 20px;
                padding: 1px;
                display: flex;
                flex-direction: row-reverse;
                color: #fff;
                transition: all linear 0.1s;
                font-size: 12px;

                // background-color: #fff;
                &::before {
                    display: inline-block;
                    content: "";
                    width: 40px;
                    height: 1px;
                    background-color: #fff;
                    margin-top: 6px;
                    margin-left: 4px;
                }
            }

            span {
                border-radius: 100%;
                border: #fff solid 1px;
                width: 4px;
                height: 4px;
                display: inline-block;
                background-color: #fff;
                transition: all ease-in-out 0.2s;
            }

            &:hover span {
                width: 10px;
                height: 10px;
                background-color: #fff;
                cursor: pointer;
            }
        }
    }
}

.homePage {
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
}

.title {
    width: calc(100vw - 40px);
    background-color: #000;
    line-height: 50px;
    padding: 0 20px;
    text-align: left;

    &.no {
        background-color: transparent;
    }
}

@media (min-width:800px) {
    .section1 {
        width: 100%;
        height: 100%;
        display: block;

        .banner {
            height: 560px;
        }

        .img {
            width: 100vw;
            height: 100vh;

            .tip {
                background: #000;
                position: absolute;
                margin: 100px;
                font-size: 24px;
                padding: 40px;
                opacity: 1;
            }
        }
    }

    .section2 {
        width: 100%;
        height: 100%;
        display: block;

        .btn {
            padding: 20px 0;
            display: flex;
            justify-content: space-around;
            align-items: center;

            .shadow {
                margin-bottom: 110px;
            }
        }
    }

    .section3 {
        width: 100%;
        height: 100%;

        .floattitle {
            color: #fff;
            float: left;
        }
    }

    .section4 {
        height: calc(100vh - 60px);
        margin: 0;

        .movetext {
            height: 320px;
        }
    }

    .section5 {
        .stages {
            max-width: 400px;
            width: 400px;
            margin: 0 auto;

            .container {
                padding: 1rem 1rem 1.5rem
            }
        }
    }
}

@media (max-width:800px) {
    .section1 {
        width: 100%;
        // height: 100%;
        display: block;

        .banner {
            height: 70vw;
            ;
        }

        .img {
            width: 100vw;
            height: 50vw;

            .tip {
                background: #000;
                position: absolute;
                margin: 10px;
                font-size: 14px;
                padding: 10px;
                opacity: 1;
            }
        }
    }

    .section2 {
        width: 100%;
        height: 100%;
        display: block;

        .btn {
            padding: 20px 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;

            .shadow {
                margin-bottom: 110px;
            }
        }
    }

    .section3 {
        width: 100%;
        height: 100%;

        .floattitle {
            color: #fff;
            float: left;
        }
    }

    .section4 {
        height: calc(100vh - 60px);
        margin: 0;

        .movetext {
            height: 320px;
        }
    }
}
</style>