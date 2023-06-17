<template>
	<div class="cardbox">
		<div class="card">
			<div class="card-content">
				<h1>Just hover around</h1>
				<p>translateZ 3D</p>
				<p class="related">3D视差</p>
			</div>
		</div>
	</div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
	name: 'moveCard',
	props: {
		movetext: {
			type: String,
			default: 'TEXT'
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
cardbox {
	perspective: 1000px;
	transform-style: preserve-3d;
	display: flex;
	height: 100vh;
}

.card {
	pointer-events: none;
	transform: translateZ(0);
	padding: 30px;
	background: rgba(131, 209, 255, 0.4);
	border-radius: 5px;
	width: 400px;
	height: 200px;
	margin: auto;
	font-size: 20px;
	transform-style: preserve-3d;
	backface-visibility: hidden;
	display: flex;
	box-shadow: 0 0 5px rgba(0, 0, 0, .1);
	position: relative;
	animation: move 10s infinite alternate;
	color: #fff;
	font-weight: bold;

	&:after {
		content: " ";
		position: absolute;
		width: 100%;
		height: 10px;
		border-radius: 50%;
		left: 0;
		bottom: -50px;
		box-shadow: 0 30px 20px rgba(0, 0, 0, .3);

	}

	.card-content {
		margin: auto;
		text-align: center;
		transform-style: preserve-3d;
		line-height: 40px;
	}

	h1 {
		transform: translateZ(100px);
	}

	p {
		transform: translateZ(50px);
		display: block;

		&.related {
			transform: translateZ(80px);
		}
	}

	a {
		color: #69c6b8;
		pointer-events: auto;
	}
}

@keyframes move {
	0% {
		transform: rotateY(20deg) rotateZ(10deg);
	}

	100% {
		transform: rotateY(-60deg) rotateZ(-10deg);
	}
}</style>