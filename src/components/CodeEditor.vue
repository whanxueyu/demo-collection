<template>
    <vue3-code-mirror ref="codeEditor" v-model="code" :options="editorOptions"></vue3-code-mirror>
    <el-button type="primary" @click="run">RUN</el-button>
</template>
<script>
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue';
import Vue3CodeMirror from 'vue3-code-mirror'
export default defineComponent({
    components: {
        Vue3CodeMirror
    },
    name: 'text',
    props: {
        text: {
            type: String,
            default: 'TEXT'
        }
    },
    setup() {
        const data = reactive({
            code: '',
            editorOptions: {}
        });
        const codeEditor = ref('')
        const run = () => {
            console.log(data.code)
        }
        onMounted(() => {
            data.editorOptions = {
                lineNumbers: true,
                theme: 'dracula',
                mode: 'javascript'
            }
            codeEditor.value.editor.setSize(null, 'auto')
        })
        return {
            ...toRefs(data),
            codeEditor,
            run
        };
    },
});
</script>
<style lang="scss" scoped></style>