<template>
        <div class="btn fe2">
            <slot></slot>    
        </div>
    <svg>
        <defs>
            <filter id="fe2">
                <feTurbulence id="animation" type="fractalNoise" baseFrequency="9.9999999 0.00001" numOctaves="1"
                    result="warp">
                    <animate attributeName="baseFrequency" from="9.9999999 0.00001" to="0.009 0.00001" dur="2s"
                        repeatCount="indefinite" />
                </feTurbulence>
                <feOffset dx="-90" dy="-90" result="warpOffset"></feOffset>
                <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warpOffset">
                </feDisplacementMap>
            </filter>
        </defs>
    </svg>
</template>
<script setup>
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
    background: rgb(255, 0, 179);
    cursor: pointer;
    transform: translateZ(0);
    outline: 200px solid transparent;
    z-index: 1;
}
.fe2 {
    border-radius: 64px;
}

.fe2:hover {
    filter: url(#fe2);
}
svg {
    position: absolute;
}
</style>