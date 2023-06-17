<template>
    <div class="leftShadow">{{shadowtext}}</div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
	name: 'leftShadow',
	props: {
        shadowtext:{
            type:String,
            default:'left Txt Shadow'
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
	text-shadow: makelongleftshadow(rgba(174, 14, 214, 0.548));
    color: hsl(310, 90%, 61%);
}
</style>