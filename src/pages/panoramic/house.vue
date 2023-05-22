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
                    autoRotateInactivityDelay: 1000, // 用户操作页面后，自动旋转延迟
                    friction: 0.15, // 控制摩擦器 0.1 到 1 值越大停的越快 默认值0.15
                    showZoomCtrl: true, // 是否显示缩放控件
                    showFullscreenCtrl: true, // 是否显示全屏控件
                    touchPanSpeedCoeffFactor: 1, // 触摸时平移速度 默认1
                    yaw: 20, // 垂直方向左右旋转角度 正值向右 负值向左
                    pitch: -10, // 水平方向左右旋转角度 正值向上 负值向下 仰视太大 导致图片拉伸
                    minPitch: -60, // 最小pitch 默认-180
                    maxPitch: 60, // 最大pitch 默认180
                    roll: 0, // z轴 横着的
                    hfov: 60, // 摄像机视角
                    minHfov: 10, // 摄像机最小视角
                    maxHfov: 60, // 摄像机最大视角
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
                                sceneId: "second",
                                // id: "one",
                                text: "卧室里面",
                                // image: require("../../assets/logo.png"),
                                // scale: true,
                            },
                            {
                                yaw: -6,
                                pitch: -26,
                                // cssClass: "test",
                                clickHandlerFunc: '',
                                scale: true,
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
                                sceneId: "first",
                                // id: "two",
                                text: "客厅",
                                // image: "./images/hot.png",
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
</style>