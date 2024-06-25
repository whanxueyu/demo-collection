<template>
    <div class="text-magic" :data-word="props.textStr">
        {{props.textStr}}
        <div class="white"></div>
    </div>
</template>
<script setup>
import { defineProps} from 'vue'
const props = defineProps({
	textStr: {
		type: String,
		default: 'TEXT'
	}
})
</script>
<style lang="scss" scoped>
.text-magic {
    position: relative;
    text-align: left;
    width: 100%;
    font-size: 26px;
    font-family: Raleway, Verdana, Arial;
    color: #fff;
}

.white {
    position: absolute;
    left: -10px;
    width: 100%;
    height: 3px;
    background: #000;
    z-index: 4;
    animation: whiteMove 3s ease-out infinite;
}

.text-magic::before {
    content: attr(data-word);
    position: absolute;
    top: 0;
    left: 0.5px;
    // height: 0px;
    color: rgba(255, 255, 255, 0.9);
    overflow: hidden;
    z-index: 2;
    animation: redShadow 1s ease-in infinite;
    filter: contrast(200%);
    text-shadow: 2px 0 0 rgb(255, 0, 179);
}

.text-magic::after {
    content: attr(data-word);
    position: absolute;
    top: 0;
    left: -3px;
    // height: 36px;
    color: rgba(255, 255, 255, 0.8);
    overflow: hidden;
    z-index: 3;
    background: rgba(0, 0, 0, 0.8);
    animation: redHeight 1.5s ease-out infinite;
    filter: contrast(200%);
    text-shadow: -2px 0 0 rgb(0, 195, 255);
    mix-blend-mode: darken;
}

@keyframes redShadow {
    20% {
        height: 32px;
    }

    60% {
        height: 6px;
    }

    100% {
        height: 42px;
    }
}

@keyframes redHeight {
    20% {
        height: 42px;
    }

    35% {
        height: 12px;
    }

    50% {
        height: 40px;
    }

    60% {
        height: 20px;
    }

    70% {
        height: 34px;
    }

    80% {
        height: 22px;
    }

    100% {
        height: 0px;
    }
}

@keyframes whiteMove {
    8% {
        top: 38px;
    }

    14% {
        top: 8px;
    }

    20% {
        top: 42px;
    }

    32% {
        top: 2px;
    }

    99% {
        top: 30px;
    }
}</style>