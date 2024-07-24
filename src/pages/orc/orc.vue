<template>
        <iframe class="frame" id="iframe"  src="./pearORC/index.html"></iframe>
</template>

<script setup>
import { onMounted} from 'vue';

onMounted(() => {
})

</script>

<style lang="scss" scoped>
@media (min-width:800px) {
    

        .frame {
            background-color: #000;
            width: calc(100vw);
            height: calc(100vh - 65px);
            border: medium none;
            overflow: auto;
        }
    
}

@media (max-width:800px) {

    .frame {
        background-color: #000;
        width: calc(100vw);
        height: calc(100vh - 65px);
        border: medium none;
        overflow: auto;
    }
}
</style>