<template>
    <div class="container">
        <!-- 舞台层 -->
        <div class="stage">
            <!-- 控制层 -->
            <div class="control">
                <!-- 图片层 -->
                <div class="imgWrap">
                    <div class="img img1">
                        <img src="@/static/img/Cyber.jpeg">
                    </div>
                    <div class="img img2"><img
                            src="@/static/img/Cyber2.jpg"></div>
                    <div class="img img3"><img
                            src="@/static/img/Cyber3.jpeg">
                    </div>
                    <div class="img img4"><img
                            src="@/static/img/Cyber4.jpeg">
                    </div>
                    <div class="img img5"><img
                            src="@/static/img/Cyber5.jpeg">
                    </div>
                    <div class="img img6"><img
                            src="@/static/img/Cyber6.jpg">
                    </div>
                    <div class="img img7"><img
                            src="@/static/img/Cyber7.jpeg"></div>
                    <div class="img img8"><img
                            src="@/static/img/Cyber8.jpeg">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
    name: 'shadowBanner',
    props: {
        text: {
            type: String,
            default: 'TEXT'
        }
    },
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
$imgCount : 8;


.container {
    position: relative;
}

.stage {
    position: relative;
    width: 800px;
    height: 240px;
    margin: 20px auto;
    perspective: 2000px;
    transform-style: preserve-3d;
    -webkit-box-reflect: below 10px linear-gradient(transparent, rgba(0, 0, 0, .5));

    .control {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transform: translateZ(-2000px) rotateY(50deg) rotateZ(0deg);
        animation: rotate 30s linear infinite;

        .imgWrap {
            position: absolute;
            width: 400px;
            height: 400px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transform-style: preserve-3d;

            .img {
                position: absolute;
                width: 500px;
                height: 400px;
                line-height: 400px;
                text-align: center;
                font-size: 120px;
                top: 0;
                left: 0;
                transform-style: preserve-3d;
                transform-origin: 50% 50% 0px;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            @for $i from 1 through $imgCount {
                .img#{$i} {
                    // transform: rotateY(35 + ($i * 45deg)) translateZ(482.84px) ;
                    transform: rotateY(35 + ($i * 45deg)) translateZ(650px);
                }
            }
        }
    }
}

@keyframes rotate {
    0% {
        transform: translateZ(-2000px) rotateY(0deg);
    }

    50% {
        transform: translateZ(-2000px) rotateY(-360deg);
    }

    100% {
        transform: translateZ(-2000px) rotateY(-720deg);
    }
}</style>