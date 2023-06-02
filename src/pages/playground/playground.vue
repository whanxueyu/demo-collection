<template>
    <div class="palyground">
        <code-editor></code-editor>
    </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
import CodeEditor from '@/components/CodeEditor.vue';
export default defineComponent({
    components: {
    CodeEditor
  },
	name: 'CodeEditor',
	props: {
        text:{
            type:String,
            default:'TEXT'
        }
    },
	setup() {
		const data = reactive({
            code:''
		});
		return {
			...toRefs(data),
		};
	},
});
</script>
<style lang="scss" scoped>
.palyground{
    max-width: 1200px;
    height: 500px;
}
</style>