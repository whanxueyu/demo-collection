<template>
    <div>
    </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
	name: 'component',
	props: {
        prop:{
            type:String,
            default:'TEXT'
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
</style>