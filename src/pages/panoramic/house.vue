<template>
    <div id="panorama" class="viewwe"></div>
</template>

<script>
import 'pannellum/build/pannellum.css';
import 'pannellum'
import { onMounted, reactive, ref } from 'vue'
export default {
    name: 'pannellumVue',
    setup() {
        const state = reactive({
            viewer: null,
            options: {
                type: 'equirectangular',
                panorama: '../assets/360.jpg',
                autoLoad: true,
                showControls: false,
                hotSpots: [
                    {
                        pitch: 1.1,
                        yaw: 1.4,
                        type: 'scene',
                        text: '第一个场景',
                        sceneId: 'scene2',
                    },
                    {
                        pitch: -10.8,
                        yaw: -42.6,
                        type: 'scene',
                        text: '第二个场景',
                        sceneId: 'scene3',
                    },
                ],
            },
        })
        const viewer = ref()
        onMounted(() => {
            window.pannellum.viewer("panorama", {
                default: {
                    firstScene: "first",
                    orientationOnByDefault: false, // 是否开启vr效果
                    autoLoad: true, // 自动加载
                    autoRotate: false, // 自动旋转
                    autoRotateInactivityDelay: 5000, // 用户操作页面5s后，自动旋转延迟
                    friction: 0.15, // 控制摩擦器 0.1 到 1 值越大停的越快 默认值0.15
                    showZoomCtrl: true, // 是否显示缩放控件
                    showFullscreenCtrl: true, // 是否显示全屏控件
                    touchPanSpeedCoeffFactor: 1, // 触摸时平移速度 默认1
                    yaw: 20, // 垂直方向左右旋转角度 正值向右 负值向左
                    pitch: -10, // 水平方向左右旋转角度 正值向上 负值向下 仰视太大 导致图片拉伸
                    // minPitch: -60, // 最小pitch 默认-180
                    // maxPitch: 60, // 最大pitch 默认180
                    roll: 0, // z轴 横着的
                    hfov: 60, // 摄像机视角（纵深远近关系，数值越大越远越多）
                    // minHfov: 10, // 摄像机最小视角
                    // maxHfov: 60, // 摄像机最大视角
                    escapeHTML: true, // HTML 将从配置字符串中转义，以帮助缓解可能的 DOM XSS 攻击。
                    crossOrigin: "anonymous", // 使用的 CORS 请求类型，可以设置为 anonymous或use-credentials。默认为anonymous.
                    sceneFadeDuration: 1000, // 切换场景时动画持续时间
                    // compass: true, // 指南针
                    // northOffset: 90, // 指南针角度
                    // horizonRoll: 10, // 指定图像水平的俯仰/滚动
                    // hotSpotDebug: true, // 打印移动时的yaw pitch roll
                    preview:
                        "https://img.alicdn.com/imgextra/i4/O1CN014TNffn1nlaTfA98Fg_!!6000000005130-0-tps-1500-1500.jpg",
                },
                scenes: {
                    first: {
                        type: "cubemap", // 全景图类型
                        cubeMap: [
                            //立方体全景图六张图
                            "https://img.alicdn.com/imgextra/i4/O1CN014TNffn1nlaTfA98Fg_!!6000000005130-0-tps-1500-1500.jpg",
                            "https://img.alicdn.com/imgextra/i3/O1CN01LsO1Bk20QbKpFTUQr_!!6000000006844-0-tps-1500-1500.jpg",
                            "https://img.alicdn.com/imgextra/i1/O1CN01sS5m781ya6JgLSaVk_!!6000000006594-0-tps-1500-1500.jpg",
                            "https://img.alicdn.com/imgextra/i3/O1CN01uTWCLc1XOCOuA92H0_!!6000000002913-0-tps-1500-1500.jpg",
                            "https://img.alicdn.com/imgextra/i4/O1CN016lU3YJ1JdrJuFTcWt_!!6000000001052-0-tps-1500-1500.jpg",
                            "https://img.alicdn.com/imgextra/i2/O1CN01nYe2Mn1ohkmBVyKpp_!!6000000005257-0-tps-1500-1500.jpg",
                        ],
                        hotSpots: [
                            {
                                yaw: -185,
                                pitch: -4,
                                type: "scene",
                                cssClass: "path",
                                sceneId: "second",
                                // id: "one",
                                text: "卧室",
                                // image: require("../../assets/logo.png"),
                                // scale: true,
                            },
                            {
                                yaw: -28,
                                pitch: -2,
                                cssClass: "hole",
                                // clickHandlerFunc: '',
                                text: '大广场',
                                scale: true,
                                type: "scene",
                                sceneId: "third",
                                // image: "./images/hot.png",
                            },
                            {
                                yaw: 10,
                                pitch: 15,
                                roll: -10,
                                // cssClass: "xiaochengxu",
                                clickHandlerFunc: '',
                                scale: true,
                                // image: "./images/hot.png",
                            },
                        ],
                    },
                    second: {
                        type: "cubemap",
                        cubeMap: [
                            "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_f.jpg?x-oss-process=style/nocut_compress",
                            "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_r.jpg?x-oss-process=style/nocut_compress",
                            "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_b.jpg?x-oss-process=style/nocut_compress",
                            "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_l.jpg?x-oss-process=style/nocut_compress",
                            "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_u.jpg?x-oss-process=style/nocut_compress",
                            "https://krpano-pro.oss-accelerate.aliyuncs.com/static/resource/publish/krpano/1481085216446902274/quanjing/2205/40419783638860705/pano_d.jpg?x-oss-process=style/nocut_compress",
                        ],
                        hotSpots: [
                            {
                                pitch: 0,
                                yaw: 20,
                                type: "info",
                                id: "one",
                                text: "123",
                                // image: "./images/hot.png",
                            },
                            {
                                pitch: -5,
                                yaw: 80,
                                type: "scene",
                                cssClass: "path",
                                sceneId: "first",
                                // id: "two",
                                text: "小客厅",
                                // image: "./images/hot.png",
                            },
                        ],
                    },
                    third: {
                        type: 'equirectangular',
                        panorama: require("../../assets/360.jpg"),
                        autoLoad: true,
                        showControls: false,
                        hotSpots: [
                            {
                                pitch: 1.1,
                                yaw: 1.4,
                                type: 'scene',
                                text: '小客厅',
                                cssClass: "hole",
                                sceneId: 'first',
                            },
                            {
                                pitch: -10.8,
                                yaw: -42.6,
                                type: 'scene',
                                cssClass: "hole",
                                text: '大客厅',
                                sceneId: 'four',
                            },
                        ],
                    },
                    four: {
                        type: 'equirectangular',
                        panorama: require("../../assets/house.jpg"),
                        autoLoad: true,
                        showControls: false,
                        hotSpots: [
                            {
                                pitch: 1.1,
                                yaw: 1.4,
                                type: 'scene',
                                text: '客厅',
                                cssClass: "path",
                                sceneId: 'first',
                            },
                            {
                                pitch: -10.8,
                                yaw: -42.6,
                                type: 'scene',
                                text: '卧室',
                                cssClass: "path",
                                sceneId: 'second',
                            },
                        ],
                    },
                },
            });
        })
        // console.log(state.viewer)
        // state.viewer.load('firstScene')
        return {
            state,
            viewer
        }
    }
}
</script>
<style>
.viewwe {
    height: calc(100vh - 60px);
}

@keyframes move {
    0% {
        border: 3px solid transparent;
        background-size: 100% 100%;
    }

    50% {
        border: 3px solid rgb(121, 29, 173);
        background-size: 110% 110%;
    }

    100% {
        border: 3px solid transparent;
        background-size: 100% 100%;
    }
}

.hole {
    background-image: url('https://img95.699pic.com/xsj/2m/xt/d1.jpg!/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast');
    background-size: 100% 100%;
    background-position: center;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    animation: move 3s infinite linear;
    box-shadow: 0 0 20px 0px rgb(121, 29, 173);
    opacity: 0.9;

}

.path {
    background-image: url('@/static/img/up.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 50px;
    width: 50px;
    opacity: 0.9;
    animation: shake 1s infinite linear;
}

@keyframes shake {
    0% {
        background-size: 100% 80%;
        background-position: center;

    }

    50% {
        background-size: 100% 60%;
        background-position: bottom;

    }

    100% {
        background-size: 100% 80%;
        background-position: top;

    }
}

@keyframes lay {
    0% {
        background-size: 100% 100%;
        background-position: bottom;

    }

    50% {
        background-size: 100% 48%;
        background-repeat: repeat;
        background-position: bottom;

    }

    100% {
        background-size: 100% 100%;
        background-position: bottom;

    }
}
</style>