<template>
    <!-- <div class="demo-cube perspective percentage">
        <ul class="cube">
            <li class="top"></li>
            <li class="bottom"></li>
            <li class="front"></li>
            <li class="back"></li>
        </ul>
    </div>

    <div class="demo-cube perspective colorful">
        <ul class="cube">
            <li class="top"></li>
            <li class="bottom"></li>
            <li class="front"></li>
            <li class="back"></li>
        </ul>
    </div> -->

    <div class="demo-cube perspective pink">
        <ul class="cube">
            <li class="top"></li>
            <li class="bottom"></li>
            <li class="front"></li>
            <li class="back"></li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { defineProps, ref } from 'vue';
const props = defineProps({
    text: {
        type: String,
        default: 'TEXT'
    }
})
</script>
<style lang="scss" scoped>

.perspective {
    transform-style: preserve-3d;
    perspective: 520px;
    -webkit-transform: rotateX(15deg);
    transform: rotateX(15deg);
}

.demo-cube {
    position: relative;
    width: 100%;
    height: 200px;
    margin: auto;
    margin-top: -30px;

    .cube {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 600px;
        height: 100px;
        transform-style: preserve-3d;
        transform-origin: 50px 50px;
        transform: translate(-50%, -50%) rotateX(-33.5deg);

        li {
            position: absolute;
            display: block;
            width: 100%;
            height: 100px;
        }

        .top {
            transform: rotateX(90deg) translateZ(50px);
        }

        .bottom {
            transform: rotateX(-90deg) translateZ(50px);
        }

        .front {
            transform: translateZ(50px);
        }

        .back {
            transform: rotateX(-180deg) translateZ(50px);
        }
    }
}

.percentage .cube {

    .top,
    .front,
    .bottom,
    .back {
        background: linear-gradient(90deg, #9c27b04d, #ff226dcc 70%, #ffffff99 70%, #ffffff99);
    }
}

.colorful {
    animation: hueRotate 10s infinite linear;

    .cube {

        .top,
        .front,
        .bottom,
        .back {
            background: linear-gradient(90deg, #28657fe6, #85a5b580 85%, #ffffff99 85%, #ffffff99);
        }
    }
}

.pink .cube {

    .top,
    .front,
    .bottom,
    .back {
        animation: perChange 5s ease-in-out forwards;
    }
}

@keyframes perChange {
    0% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 0%, #ff226d1a 0%, #ff226d1a);}
    1% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 1%, #ff226d1a 1%, #ff226d1a);}
    2% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 2%, #ff226d1a 2%, #ff226d1a);}
    3% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 3%, #ff226d1a 3%, #ff226d1a);}
    4% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 4%, #ff226d1a 4%, #ff226d1a);}
    5% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 5%, #ff226d1a 5%, #ff226d1a);}
    6% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 6%, #ff226d1a 6%, #ff226d1a);}
    7% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 7%, #ff226d1a 7%, #ff226d1a);}
    8% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 8%, #ff226d1a 8%, #ff226d1a);}
    9% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 9%, #ff226d1a 9%, #ff226d1a);}
    10% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 10%, #ff226d1a 10%, #ff226d1a);}
    11% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 11%, #ff226d1a 11%, #ff226d1a);}
    12% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 12%, #ff226d1a 12%, #ff226d1a);}
    13% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 13%, #ff226d1a 13%, #ff226d1a);}
    14% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 14%, #ff226d1a 14%, #ff226d1a);}
    15% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 15%, #ff226d1a 15%, #ff226d1a);}
    16% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 16%, #ff226d1a 16%, #ff226d1a);}
    17% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 17%, #ff226d1a 17%, #ff226d1a);}
    18% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 18%, #ff226d1a 18%, #ff226d1a);}
    19% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 19%, #ff226d1a 19%, #ff226d1a);}
    20% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 20%, #ff226d1a 20%, #ff226d1a);}
    21% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 21%, #ff226d1a 21%, #ff226d1a);}
    22% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 22%, #ff226d1a 22%, #ff226d1a);}
    23% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 23%, #ff226d1a 23%, #ff226d1a);}
    24% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 24%, #ff226d1a 24%, #ff226d1a);}
    25% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 25%, #ff226d1a 25%, #ff226d1a);}
    26% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 26%, #ff226d1a 26%, #ff226d1a);}
    27% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 27%, #ff226d1a 27%, #ff226d1a);}
    28% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 28%, #ff226d1a 28%, #ff226d1a);}
    29% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 29%, #ff226d1a 29%, #ff226d1a);}
    30% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 30%, #ff226d1a 30%, #ff226d1a);}
    31% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 31%, #ff226d1a 31%, #ff226d1a);}
    32% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 32%, #ff226d1a 32%, #ff226d1a);}
    33% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 33%, #ff226d1a 33%, #ff226d1a);}
    34% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 34%, #ff226d1a 34%, #ff226d1a);}
    35% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 35%, #ff226d1a 35%, #ff226d1a);}
    36% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 36%, #ff226d1a 36%, #ff226d1a);}
    37% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 37%, #ff226d1a 37%, #ff226d1a);}
    38% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 38%, #ff226d1a 38%, #ff226d1a);}
    39% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 39%, #ff226d1a 39%, #ff226d1a);}
    40% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 40%, #ff226d1a 40%, #ff226d1a);}
    41% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 41%, #ff226d1a 41%, #ff226d1a);}
    42% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 42%, #ff226d1a 42%, #ff226d1a);}
    43% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 43%, #ff226d1a 43%, #ff226d1a);}
    44% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 44%, #ff226d1a 44%, #ff226d1a);}
    45% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 45%, #ff226d1a 45%, #ff226d1a);}
    46% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 46%, #ff226d1a 46%, #ff226d1a);}
    47% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 47%, #ff226d1a 47%, #ff226d1a);}
    48% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 48%, #ff226d1a 48%, #ff226d1a);}
    49% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 49%, #ff226d1a 49%, #ff226d1a);}
    50% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 50%, #ff226d1a 50%, #ff226d1a);}
    51% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 51%, #ff226d1a 51%, #ff226d1a);}
    52% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 52%, #ff226d1a 52%, #ff226d1a);}
    53% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 53%, #ff226d1a 53%, #ff226d1a);}
    54% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 54%, #ff226d1a 54%, #ff226d1a);}
    55% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 55%, #ff226d1a 55%, #ff226d1a);}
    56% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 56%, #ff226d1a 56%, #ff226d1a);}
    57% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 57%, #ff226d1a 57%, #ff226d1a);}
    58% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 58%, #ff226d1a 58%, #ff226d1a);}
    59% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 59%, #ff226d1a 59%, #ff226d1a);}
    60% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 60%, #ff226d1a 60%, #ff226d1a);}
    61% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 61%, #ff226d1a 61%, #ff226d1a);}
    62% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 62%, #ff226d1a 62%, #ff226d1a);}
    63% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 63%, #ff226d1a 63%, #ff226d1a);}
    64% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 64%, #ff226d1a 64%, #ff226d1a);}
    65% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 65%, #ff226d1a 65%, #ff226d1a);}
    66% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 66%, #ff226d1a 66%, #ff226d1a);}
    67% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 67%, #ff226d1a 67%, #ff226d1a);}
    68% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 68%, #ff226d1a 68%, #ff226d1a);}
    69% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 69%, #ff226d1a 69%, #ff226d1a);}
    70% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 70%, #ff226d1a 70%, #ff226d1a);}
    71% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 71%, #ff226d1a 71%, #ff226d1a);}
    72% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 72%, #ff226d1a 72%, #ff226d1a);}
    73% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 73%, #ff226d1a 73%, #ff226d1a);}
    74% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 74%, #ff226d1a 74%, #ff226d1a);}
    75% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 75%, #ff226d1a 75%, #ff226d1a);}
    76% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 76%, #ff226d1a 76%, #ff226d1a);}
    77% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 77%, #ff226d1a 77%, #ff226d1a);}
    78% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 78%, #ff226d1a 78%, #ff226d1a);}
    79% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 79%, #ff226d1a 79%, #ff226d1a);}
    80% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 80%, #ff226d1a 80%, #ff226d1a);}
    81% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 81%, #ff226d1a 81%, #ff226d1a);}
    82% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 82%, #ff226d1a 82%, #ff226d1a);}
    83% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 83%, #ff226d1a 83%, #ff226d1a);}
    84% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 84%, #ff226d1a 84%, #ff226d1a);}
    85% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 85%, #ff226d1a 85%, #ff226d1a);}
    86% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 86%, #ff226d1a 86%, #ff226d1a);}
    87% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 87%, #ff226d1a 87%, #ff226d1a);}
    88% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 88%, #ff226d1a 88%, #ff226d1a);}
    89% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 89%, #ff226d1a 89%, #ff226d1a);}
    90% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 90%, #ff226d1a 90%, #ff226d1a);}
    91% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 91%, #ff226d1a 91%, #ff226d1a);}
    92% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 92%, #ff226d1a 92%, #ff226d1a);}
    93% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 93%, #ff226d1a 93%, #ff226d1a);}
    94% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 94%, #ff226d1a 94%, #ff226d1a);}
    95% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 95%, #ff226d1a 95%, #ff226d1a);}
    96% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 96%, #ff226d1a 96%, #ff226d1a);}
    97% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 97%, #ff226d1a 97%, #ff226d1a);}
    98% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 98%, #ff226d1a 98%, #ff226d1a);}
    99% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 99%, #ff226d1a 99%, #ff226d1a);}
    100% { background: linear-gradient(90deg, #ffd92299, #ff226dcc 100%, #ff226d1a 100%, #ff226d1a);}
}    
  
@keyframes hueRotate {
    0% { filter: hue-rotate(0); }
    100% { filter: hue-rotate(360deg); }
}
</style>