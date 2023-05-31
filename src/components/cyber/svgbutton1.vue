<template>
    <div class="btn fe1">{{text}}</div>
    <svg>
        <defs>
            <filter id="fe1">
                <feTurbulence id="animation" type="fractalNoise" baseFrequency="0.00001 9.9999999" numOctaves="1"
                    result="warp">
                    <animate attributeName="baseFrequency" from="0.00001 9.9999" to="0.00001 0.001" dur="2s"
                        repeatCount="indefinite" />
                </feTurbulence>
                <feOffset dx="-90" dy="-90" result="warpOffset"></feOffset>
                <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warpOffset">
                </feDisplacementMap>
            </filter>
        </defs>
    </svg>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
	name: 'text',
	props: {
        text:{
            type:String,
            default:''
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
.btn {
    width: 200px;
    height: 64px;
    margin: 10px;
    line-height: 64px;
    font-size: 18px;
    color: #fff;
    text-align: center;
    background: rgb(0, 195, 255);
    cursor: pointer;
    transform: translateZ(0);
    outline: 200px solid transparent;
}

.fe1:hover {
    filter: url(#fe1);
}

svg {
    position: absolute;
}
</style>