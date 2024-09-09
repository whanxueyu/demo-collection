<template>
    <div id="iviewBg">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, watchEffect } from 'vue';
import * as THREE from 'three';

const amountX = ref(50);
const amountY = ref(50);
const SEPARATION = 100;
const count = ref(0);
const mouseX = ref(0);
const windowHalfX = ref(window.innerWidth / 2);
const props = defineProps({
    top: {
        type: Number,
        default: 300
    },
    color:{
        type: String,
        default: '#299bfb'
    },
})
let container: HTMLElement | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let scene: THREE.Scene | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let particles: THREE.Points | null = null;

const init = () => {
    container = document.createElement('div');
    document.getElementById('iviewBg')?.appendChild(container);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    camera.position.z = 1000;

    scene = new THREE.Scene();

    const numParticles = amountX.value * amountY.value;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0, j = 0;
    for (let ix = 0; ix < amountX.value; ix++) {
        for (let iy = 0; iy < amountY.value; iy++) {
            positions[i] = ix * SEPARATION - (amountX.value * SEPARATION) / 2;
            positions[i + 1] = 0;
            positions[i + 2] = iy * SEPARATION - (amountY.value * SEPARATION) / 2;
            scales[j] = 1;
            i += 3;
            j++;
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(props.color) },
        },
        vertexShader: `
        attribute float scale;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          gl_PointSize = scale * ( 300.0 / - mvPosition.z );
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
        fragmentShader: `
        uniform vec3 color;
        void main() {
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    particles = new THREE.Points(geometry, material);
    scene?.add(particles);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearAlpha(0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container?.appendChild(renderer.domElement);

    container?.addEventListener('pointermove', onPointerMove);


    if (container) {
        container.style.position = 'relative';
        container.style.top = `${props.top}px`;
    }

    window.addEventListener('resize', onWindowResize);
};

const render = () => {
    if (camera) {
        camera.position.x += (mouseX.value - camera?.position.x) * 0.05;
        camera.position.y = 400;
    }
    camera?.lookAt(scene?.position);

    const positions = particles?.geometry.attributes.position.array;
    const scales = particles?.geometry.attributes.scale.array;

    let i = 0, j = 0;
    for (let ix = 0; ix < amountX.value; ix++) {
        for (let iy = 0; iy < amountY.value; iy++) {
            positions![i + 1] = Math.sin((ix + count.value) * 0.3) * 50 + Math.sin((iy + count.value) * 0.5) * 50;
            scales![j] = (Math.sin((ix + count.value) * 0.3) + 1) * 10 + (Math.sin((iy + count.value) * 0.5) + 1) * 10;
            i += 3;
            j++;
        }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.scale.needsUpdate = true;

    renderer?.render(scene!, camera!);

    count.value += 0.1;
};

const onWindowResize = () => {
    windowHalfX.value = window.innerWidth / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera?.updateProjectionMatrix();
    renderer?.setSize(window.innerWidth, window.innerHeight);
};

const onPointerMove = (event: MouseEvent) => {
    // if (event.isPrimary === false) return;
    mouseX.value = event.clientX - windowHalfX.value;
};

const animate = () => {
    requestAnimationFrame(animate);
    render();
};

onMounted(() => {
    init();
    animate();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', onWindowResize);
    container?.removeEventListener('pointermove', onPointerMove);
    container?.remove();
});

watchEffect(() => {
    if (container) {
        container.style.top = `${props.top}px`;
    }
});

</script>

<style lang="scss" scoped>
#iviewBg {
    // background: url('../../assets/imgs/wavesBg.png') no-repeat;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    height: 100%;
    position: relative;
    display: flex;
}
</style>