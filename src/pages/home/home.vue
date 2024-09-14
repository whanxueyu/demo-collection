<template>
    <div class="loading-cover" v-if="isLoading">
        <shineText style="font-size: 160px;margin: 100px auto;">CyberPunk-UI</shineText>
        <tDProgress></tDProgress>
    </div>
    <div class="outer-box" ref="fullPage" v-show="!isLoading">
        <div ref="element" :class="{ activeTranstion: isCloseTranstion }" class="inner-box" @mousewheel="mousewheel"
            @touchstart="handleTouchStart" @touchend="handleTouchEnd" @touchmove="handleTouchMove">
            <div class="section section1 scroll-element">
                <div class="title">
                    <cyberText>Cyberpunk Banner</cyberText>
                </div>
                <div class="banner">
                    <shadowBanner></shadowBanner>
                    <typed v-if="!isLoading">Pure JavaScript Typing Animation Cyberpunk Style</typed>
                    <!-- <tDText></tDText> -->
                </div>
            </div>
            <div class="section section1 scroll-element">
                <div class="title">
                    <cyberText>Cyberpunk Image</cyberText>
                </div>
                <div class="img">
                    <cyberImg :imgurl="state.imgurl">
                        <div class="tip">
                        </div>
                    </cyberImg>
                </div>
            </div>
            <div class="section section2 scroll-element">
                <div class="title">
                    <cyberText>{{ state.title1 }}</cyberText>
                </div>
                <div class="btn">
                    <errorbutton>{{ state.btn3 }}</errorbutton>
                </div>
                <div class="btn">
                    <neonButton1>{{ state.neonBtn }}</neonButton1>
                    <neonButton2>{{ state.neonBtn }}</neonButton2>
                    <neonButton3>{{ state.neonBtn }}</neonButton3>
                </div>
                <div class="btn">
                    <shadowBtn1 class="shadow">NEON</shadowBtn1>
                    <shadowBtn2 class="shadow">NEON</shadowBtn2>
                    <shadowBtn3 class="shadow">NEON</shadowBtn3>
                    <shadowBtn4 class="shadow">NEON</shadowBtn4>
                </div>
                <div class="btn">
                    <svgBtn type="1" size="small">CyberPunk-UI</svgBtn>
                    <svgBtn type="2" size="small">CyberPunk-UI</svgBtn>
                    <svgBtn type="3" size="small">CyberPunk-UI</svgBtn>
                    <svgBtn type="4" size="small">CyberPunk-UI</svgBtn>
                    <svgBtn type="5" size="small">CyberPunk-UI</svgBtn>
                    <svgBtn type="6" size="small">CyberPunk-UI</svgBtn>
                    <svgBtn type="7" size="small">CyberPunk-UI</svgBtn>
                </div>
                <div class="btn">
                    <svgBtn type="1" size="default">CyberPunk-UI</svgBtn>
                    <svgBtn type="2" size="default">CyberPunk-UI</svgBtn>
                    <svgBtn type="3" size="default">CyberPunk-UI</svgBtn>
                    <svgBtn type="4" size="default">CyberPunk-UI</svgBtn>
                    <svgBtn type="5" size="default">CyberPunk-UI</svgBtn>
                    <svgBtn type="6" size="default">CyberPunk-UI</svgBtn>
                    <svgBtn type="7" size="default">CyberPunk-UI</svgBtn>
                </div>
                <div class="btn">
                    <svgBtn type="1" size="large">CyberPunk-UI</svgBtn>
                    <svgBtn type="2" size="large">CyberPunk-UI</svgBtn>
                    <svgBtn type="3" size="large">CyberPunk-UI</svgBtn>
                    <svgBtn type="4" size="large">CyberPunk-UI</svgBtn>
                    <svgBtn type="5" size="large">CyberPunk-UI</svgBtn>
                    <svgBtn type="6" size="large">CyberPunk-UI</svgBtn>
                    <svgBtn type="7" size="large">CyberPunk-UI</svgBtn>
                </div>
            </div>
            <div class="section section3 scroll-element">
                <bigEye></bigEye>
            </div>
            <div class="section section4 scroll-element">
                <div class="title flex justify-between" style="font-size: 48px;">
                    <shadowText direction="right" shadowColor="#66cc22">shadowText right</shadowText>
                    <breakText>BREAK TEXT</breakText>
                    <shadowText direction="left" shadowColor="#2299cc">shadowText left</shadowText>
                </div>
                <div class="title flex justify-between" style="font-size: 60px;">
                    <shineText>shineText</shineText>
                    <pinkText>123abcABC文字</pinkText>
                    <waveText></waveText>
                </div>
                <div class="title flex justify-between" style="font-size: 60px;">
                    <svgText1></svgText1>
                    <svgText2></svgText2>
                </div>
                <douyin></douyin>
                <douyinText></douyinText>
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
import { nextTick, onMounted, reactive } from 'vue'
import cyberText from '@/components/text/text.vue'
import cyberImg from '@/components/img/img.vue'
import typing from '@/components/typing.vue'
import bigEye from '@/components/bigEye.vue'
import errorbutton from '@/components/button/errorbutton.vue'
import pinkText from '@/components/text/glowText.vue'
import neonButton1 from '@/components/button/button1.vue'
import neonButton2 from '@/components/button/button2.vue'
import neonButton3 from '@/components/button/button3.vue'
import shadowBtn1 from '@/components/button/shadowBtn1.vue'
import shadowBtn2 from '@/components/button/shadowBtn2.vue'
import shadowBtn3 from '@/components/button/shadowBtn3.vue'
import shadowBtn4 from '@/components/button/shadowBtn4.vue'
import shadowBanner from '@/components/img/shadowBanner.vue'
import moveText from '@/components/text/moveText.vue'
import shadowText from '@/components/text/shadowText.vue'
import breakText from '@/components/text/breakText.vue'
import moveCard from '@/components/card/moveCard.vue'
import svgBtn from '@/components/button/svgBtn.vue'
import typed from '@/components/text/typed.vue'
import svgText1 from '@/components/text/svgText1.vue'
import svgText2 from '@/components/text/svgText2.vue'
import tDText from '@/components/text/3DText.vue'
import shineText from '@/components/text/shineText.vue'
import waveText from '@/components/text/waveText.vue'
import tDProgress from '@/components/progress/3dProgress.vue'
import douyin from '@/components/text/douyin.vue'
import douyinText from '@/components/text/douyinText.vue'
const isLoading = ref(true)
const state = reactive({
    imgurl: require('@/static/img/Cyber2.jpg'),
    title: 'Cyberpunk 赛博朋克风格',
    title1: 'Cyberpunk Button',
    btn1: "横向按钮",
    btn2: "竖向按钮",
    btn3: 'AVAILABLE NOW',
    neonBtn: 'NEON BUTTON'
})
import { ref, computed, watchEffect } from 'vue'
import Douyin from '@/components/text/douyin.vue'

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
const fullPage = ref()
//HEIGHT
const height = ref(0)
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
    console.log(fullPage.value)
    setTimeout(() => {
        isLoading.value = false;
        nextTick(() => {
            height.value = fullPage.value.clientHeight + 60
        })
    }, 6000);
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import url('./style.scss');

.loading-cover {
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 999;
    height: 100vh;
    position: absolute;
    background: rgb(0 0 0);
}

.activeTranstion {
    transition: all 0ms ease 0s !important;
}

.active {
    display: inline-block;
    width: 12px !important;
    height: 12px !important;
    transition: all .2s;
}

.outer-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .inner-box {
        position: absolute;
        width: 100%;
        transition: all ease-in-out 0.3s;

        .scroll-element {
            // height: 100%;
            background-size: cover !important;
            background-position: center;
            background-repeat: no-repeat;
            transition: all ease-in-out .2s;
        }
    }

    .section {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        transition: all ease-in-out .2s;
    }

    .aside {
        list-style: none;
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        transition: all ease-in-out .2s;

        li {
            height: 14px;
            width: 14px;
            margin: 7px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            transition: all ease-in-out .2s;

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

                &::before {
                    display: inline-block;
                    content: "";
                    width: 40px;
                    height: 1px;
                    background-color: #fff;
                    margin-top: 6px;
                    margin-left: 4px;
                    transition: all ease-in-out .2s;
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
                transition: all ease-in-out .2s;
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
            font-size: 28px
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
            height: 58px;
            font-size: 48px;
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