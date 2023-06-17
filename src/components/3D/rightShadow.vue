<template>
    <div class="rightShadow">{{shadowtext}}</div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
	name: 'rightShadow',
	props: {
        shadowtext:{
            type:String,
            default:'Right Txt Shadow'
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
@function makelongrightshadow($color) {
    $val: 0px 0px $color;
    @for $i from 1 through 10 {
        $color: fade-out(desaturate($color, 1%), .1);
        $val: #{$val}, #{$i}px #{$i}px #{$color};
    }
    @return $val;
}
.rightShadow {
    text-align: center;
    font-size: 40px;
    line-height: 60px;
    text-shadow: makelongrightshadow(hsla(182, 100%, 30%, 1));
    color: hsl(182, 100%, 60%);
}
</style>