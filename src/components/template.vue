<template>
    <div>
    </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
	name: 'text',
	props: {
        text:{
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