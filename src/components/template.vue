<template>
	<div>
	</div>
</template>
<script setup>
import { defineProps, ref } from 'vue';
const props = defineProps({
	text: {
		type: String,
		default: 'TEXT'
	}
})
const data = ref({
});
</script>
<style lang="scss" scoped></style>