<template>
	<div>
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
<style lang="scss" scoped></style>