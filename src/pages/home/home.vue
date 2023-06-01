<template>
    <div class="container">
        <div class="hd">
            <div class="title">
                <cyberText :text="state.title"></cyberText>
            </div>
            <div class="img">
                <cyberImg :imgurl="state.imgurl">
                    <div class="tip">
                        <typing word="Pure CSS Typing animation, cyberpunk style."></typing>
                    </div>
                </cyberImg>
            </div>
            <div class="btn">
                <svgBtn1 :text="state.btn1"></svgBtn1>
                <svgBtn2 :text="state.btn2"></svgBtn2>
                <errorbutton :text="state.btn3"></errorbutton>
            </div>
            <div class="btn">
                <neonbutton1 :text="state.neonBtn"></neonbutton1>
                <neonbutton2 :text="state.neonBtn"></neonbutton2>
                <neonbutton3 :text="state.neonBtn"></neonbutton3>
            </div>
            <div class="btn">
                <shadowBtn1></shadowBtn1>
                <shadowBtn2></shadowBtn2>
                <shadowBtn3></shadowBtn3>
                <shadowBtn4></shadowBtn4>
            </div>
        </div>
        <div class="bd">
            <div class="title no">
                <pinkText :text="state.title1"></pinkText>
            </div>
            <bigEye></bigEye>
        </div>
        <div class="ft">
            
        </div>
    </div>
</template>
  
<script>
import { onMounted, reactive, ref } from 'vue'
import cyberText from '@/components/cyber/text.vue'
import cyberImg from '@/components/cyber/img.vue'
import svgBtn1 from '@/components/cyber/svgbutton1.vue'
import svgBtn2 from '@/components/cyber/svgbutton2.vue'
import typing from '@/components/typing.vue'
import bigEye from '@/components/bigEye.vue'
import errorbutton from '@/components/cyber/errorbutton.vue'
import pinkText from '@/components/neon/pinktext.vue'
import neonbutton1 from '@/components/neon/button1.vue'
import neonbutton2 from '@/components/neon/button2.vue'
import neonbutton3 from '@/components/neon/button3.vue'
import shadowBtn1 from '@/components/neon/shadowBtn1.vue'
import shadowBtn2 from '@/components/neon/shadowBtn2.vue'
import shadowBtn3 from '@/components/neon/shadowBtn3.vue'
import shadowBtn4 from '@/components/neon/shadowBtn4.vue'
export default {
    components: {
        cyberImg,
        svgBtn1,
        svgBtn2,
        cyberText,
        typing,
        bigEye,
        errorbutton,
        pinkText,
        neonbutton1,
        neonbutton2,
        neonbutton3,
        shadowBtn1,
        shadowBtn2,
        shadowBtn3,
        shadowBtn4,
    },
    name: 'home',
    setup() {
        const state = reactive({
            imgurl: require('@/static/img/Cyber2.jpg'),
            title: 'Cyberpunk 赛博朋克风格',
            title1: '3D眼睛鼠标跟随',
            btn1: "横向按钮",
            btn2: "竖向按钮",
            btn3: 'AVAILABLE NOW',
            neonBtn :'NEON BUTTON'
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
    overflow-x: hidden;
    overflow-y: auto;
}

.title {
    width: calc(100vw - 40px);
    background-color: #000;
    line-height: 50px;
    padding: 0 20px;
    text-align: left;
    &.no{
        background-color: transparent;
    }
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
    width: 100%;
    height: 100%;
    padding-top: 160px;

    .floattitle {
        color: #fff;
        float: left;
    }
}

.ft {
    display: flex;
    height: calc(100vh - 60px);
    margin: 0;
    overflow: hidden;
}
</style>
  