<template>
    <div class="menubox">
        <div style="margin-bottom: 20px;">水柱参数</div>
        <el-form :model="form" label-width="50px">
            <el-form-item label="偏航">
                <el-input-number :min="0" :max="360" v-model="form.heading" :step="1"></el-input-number>
            </el-form-item>
            <el-form-item label="俯仰">
                <el-input-number :min="0" :max="90" v-model="form.pitch" :step="1"></el-input-number>
            </el-form-item>
            <el-form-item label="时间">
                <el-input-number :min="0.1" :max="5" v-model="form.time" :step="1"
                    @change="changeDistance"></el-input-number>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="saveEdit">修改</el-button>
    </div>
    <Map @loaded="handleMapLoaded" :duration="0" map-type="gd"></Map>
    <status-bar v-if="loaded" :viewer="viewer"></status-bar>
</template>
<script>

</script>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, onUnmounted } from "vue";
import * as Cesium from "cesium";
import Map from '@/components/cesium/map.vue'
import statusBar from '@/components/cesium/status-bar.vue'
import waterfrom from '../../assets/water.png'
import { smokeEffect } from '@/modules/particleEffect/smokeEffect.js'
import { waterEffect } from '@/modules/particleEffect/waterEffect.js'
var viewer: Cesium.Viewer;
const loaded = ref(false);
const form = reactive({
    heading: 0,
    pitch: 80,
    roll: 0,
    speed: 100,
    time: 1
})
const changeDistance = () => {
    form.pitch = 90 - (form.time * 10)
}
const handleMapLoaded = (Viewer) => {
    viewer = Viewer;
    loaded.value = true;
    nextTick(() => {
        reset()
        addFireSmoke()
        addWaterPipe()
    })
}
const saveEdit = () => {
    if (waterParticle.value) {
        viewer.scene.primitives.remove(waterParticle.value)
    }
    addWaterPipe()
}
const addFireSmoke = () => {
    new smokeEffect(viewer)
}
const waterParticle = ref()
const addWaterPipe = () => {
    waterParticle.value = new Cesium.ParticleSystem({
        image: waterfrom,//图片地址
        //颜色
        startColor: Cesium.Color.fromCssColorString('#E0EEEE').withAlpha(0.5),
        endColor: Cesium.Color.WHITE.withAlpha(0.3),
        //大小比例
        sizeInMeters: true,
        startScale: 1,
        endScale: form.time * 2,
        //设置粒子图发射之后的最小/最大速度(以米/秒为单位),值越大，尾巴飘的越高
        // speed: form.speed,
        minimumSpeed: 100,
        maximumSpeed: 120,
        imageSize: new Cesium.Cartesian2(6, 6),
        emissionRate: form.time * 100, //数量
        //粒子寿命
        //lifetime: 0.5,
        minimumParticleLife: form.time,
        maximumParticleLife: form.time * 1.2,
        emitter: new Cesium.CircleEmitter(2.0), // 圆形发射器
        modelMatrix: computeModelMatrix({ lon: 116.45, lat: 39.932, alt: 40 }),
        updateCallback: applyGravityTWO,
        emitterModelMatrix: computeEmitterModelMatrix(form.heading, form.pitch, form.roll) //发射器方向
    })
    viewer.scene.primitives.add(waterParticle.value)
}
function computeModelMatrix(position) {
    const center = Cesium.Cartesian3.fromDegrees(position.lon, position.lat, position.alt);
    const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    return matrix;
}
function applyGravityTWO(p, dt: number) {
    const gravityMagnitude = -50 // 重力大小
    const gravityDirection = new Cesium.Cartesian3(0, 0.5, 0.5)
    const gravityScratch = new Cesium.Cartesian3()
    // 计算重力影响
    Cesium.Cartesian3.multiplyByScalar(gravityDirection, gravityMagnitude * dt, gravityScratch)
    // 更新粒子的速度
    p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity)
}
function computeEmitterModelMatrix(heading: number, pich: number, roll: number) {
    let hpr = Cesium.HeadingPitchRoll.fromDegrees(heading, pich, roll) //!!!发射粒子的方向
    let trs = new Cesium.TranslationRotationScale()
    trs.translation = Cesium.Cartesian3.fromElements(-4.0, 0.0, 1.4)
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr)
    let Matrix4 = Cesium.Matrix4.fromTranslationRotationScale(trs)
    return Matrix4
}
const reset = () => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.45, 39.930204, 3000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0,
        },
        duration: 2
    });
}
onUnmounted(() => {
    viewer?.scene?.primitives.removeAll()
})
</script>

<style lang="scss" scoped>
.menubox {
    position: absolute;
    z-index: 999;
    border-bottom-right-radius: 10px;
    padding: 20px;
    border: 1px solid rgba(139, 139, 139, 0.2);
    background-color: #222222;

    .tab-body {
        width: 250px;

        .text {
            line-height: 24px;
            text-indent: 24px;
            text-align: start;
        }
    }
}

#toolbar {
    background-color: #3339;
}

.row {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}


.colorSection {
    margin-top: 10px;

    .sectiontitle {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        align-items: center;
    }
}
</style>