<template>
    <div class="homePage">
        <div class="section1">
            <div class="title">
                <cyber-text textStr="Cyberpunk Banner"></cyber-text>
            </div>
            <div class="banner">
                <shadow-banner></shadow-banner>
            </div>
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
        <div class="section2">
            <div class="title">
                <cyber-text :textStr="state.title1"></cyber-text>
            </div>
            <div class="btn">
                <svg-btn1>{{ state.btn1 }}</svg-btn1>
                <svg-btn2>{{ state.btn2 }}</svg-btn2>
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
        <div class="section3">
            <div class="title no">
                <pink-text :textStr="state.title2"></pink-text>
            </div>
            <big-eye></big-eye>
        </div>
        <div class="section4">
            <div class="title flex justify-between">
                <right-shadow></right-shadow>
                <left-shadow></left-shadow>
            </div>
            <div class="movetext">
                <move-text></move-text>
            </div>
            <move-card></move-card>
        </div>
        <div class="section5">
            <div class="stages">
                <div class="container">
                    <div class="tabbar tab-style1">
                        <ul class="flex-center">
                            <li class="home active" data-where="home"><span class="material-icons-outlined">home </span>
                            </li>
                            <li class="products" data-where="products"><span
                                    class="material-icons-outlined">shopping_bag
                                </span></li>
                            <li class="services" data-where="services"><span class="material-icons-outlined">plumbing
                                </span></li>
                            <li class="about" data-where="about"><span class="material-icons-outlined">business </span>
                            </li>
                            <li class="help" data-where="help"><span class="material-icons-outlined">help_outline
                                </span>
                            </li>
                            <li class="follow">&nbsp;</li>
                        </ul>
                    </div>
                </div>
                <div class="container">
                    <div class="tabbar tab-style2">
                        <ul class="flex-center">
                            <li class="home active" data-where="home"><span class="material-icons-outlined">home </span>
                            </li>
                            <li class="products" data-where="products"><span
                                    class="material-icons-outlined">shopping_bag
                                </span></li>
                            <li class="services" data-where="services"><span class="material-icons-outlined">plumbing
                                </span></li>
                            <li class="about" data-where="about"><span class="material-icons-outlined">business </span>
                            </li>
                            <li class="help" data-where="help"><span class="material-icons-outlined">help_outline
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="container">
                    <div class="tabbar tab-style3">
                        <ul class="flex-center">
                            <li class="home active" data-where="home"><span class="material-icons-outlined">home </span>
                            </li>
                            <li class="products" data-where="products"><span
                                    class="material-icons-outlined">shopping_bag
                                </span></li>
                            <li class="services" data-where="services"><span class="material-icons-outlined">plumbing
                                </span></li>
                            <li class="about" data-where="about"><span class="material-icons-outlined">business </span>
                            </li>
                            <li class="help" data-where="help"><span class="material-icons-outlined">help_outline
                                </span>
                            </li>
                            <li class="follow">&nbsp;</li>
                        </ul>
                    </div>
                </div>
                <div class="container">
                    <div class="tabbar tab-style4">
                        <ul class="flex-center">
                            <li class="home active" data-where="home"><span class="material-icons-outlined">home </span>
                            </li>
                            <li class="products" data-where="products"><span
                                    class="material-icons-outlined">shopping_bag
                                </span></li>
                            <li class="services" data-where="services"><span class="material-icons-outlined">plumbing
                                </span></li>
                            <li class="about" data-where="about"><span class="material-icons-outlined">business </span>
                            </li>
                            <li class="help" data-where="help"><span class="material-icons-outlined">help_outline
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="container">
                    <div class="tabbar tab-style5">
                        <ul class="flex-center">
                            <li class="home active" data-where="home"><span class="material-icons-outlined">home </span>
                            </li>
                            <li class="products" data-where="products"><span
                                    class="material-icons-outlined">shopping_bag
                                </span></li>
                            <li class="services" data-where="services"><span class="material-icons-outlined">plumbing
                                </span></li>
                            <li class="about" data-where="about"><span class="material-icons-outlined">business </span>
                            </li>
                            <li class="help" data-where="help"><span class="material-icons-outlined">help_outline
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
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
    title2: '3D眼睛鼠标跟随',
    btn1: "横向按钮",
    btn2: "竖向按钮",
    btn3: 'AVAILABLE NOW',
    neonBtn: 'NEON BUTTON'
})
onMounted(() => {
    const uls = document.querySelectorAll("ul");
    uls.forEach((ul) => {
        const resetClass = ul.parentNode.getAttribute("class");
        const lis = ul.querySelectorAll("li");
        lis.forEach((li) => {
            li.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const target = e.currentTarget;
                if (
                    target.classList.contains("active") ||
                    target.classList.contains("follow")
                ) {
                    return;
                }
                ul.parentNode.setAttribute(
                    "class",
                    `${resetClass} ${target.getAttribute("data-where")}-style`
                );

                lis.forEach((item) => clearClass(item, "active"));

                setClass(target, "active");
            });
        });
    });
    function clearClass(node, className) {
        node.classList.remove(className);
    }
    function setClass(node, className) {
        node.classList.add(className);
    }

})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import url('./style.scss');

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
            height: 800px;

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
        height: 100%;
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