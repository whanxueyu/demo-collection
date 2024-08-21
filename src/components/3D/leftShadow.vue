<template>
    <div class="leftShadow">{{props.shadowtext}}</div>
</template>
<script setup>
import { defineProps} from 'vue'
const props = defineProps({
	shadowtext: {
		type: String,
		default: 'TEXT'
	}
})
</script>
<style lang="scss" scoped>
@function makelongleftshadow($color) {
    $val: 0px 0px $color;
    @for $i from 1 through 25 {
        $color: fade-out(desaturate($color, 1%), .06);
        $val: #{$val}, -#{$i}px #{$i}px #{$color};
    }
    @return $val;
}
.leftShadow{
	text-align: center;
    font-size: 40px;
    line-height: 60px;
	text-shadow: makelongleftshadow(#ae0ed68c);
    color: #f542d7;
}
</style>