<template>
	<div id="login" class="row center-xs middle-xs around-xs">

		<div class="col-xs-12 col-sm-6">
			<h1>Choose a Nickname</h1>
			<p>
				<input
					type="text" id="username" v-model="username"
					:class="{blink: username === '' }"
					@keyup.enter="registerUsername()"
				>
			</p>
		</div>

		<div class="col-xs-12 col-sm-6">
			<h1>Choose Your Color:</h1>
			<p>
				<input class="jscolor {position:'top'}" :value="color" id="colorPicker" @change="colorChange($event.target.value)">
			</p>
		</div>

		<div class="col-xs-12">
			<i
				class="fa fa-arrow-circle-o-right" id="goButton"
				aria-hidden="true"
				v-if="username !== ''"
				@click = "registerUsername()"
			></i>
		</div>

	</div>
</template>

<script>
	export default {

		data() {
			return {
				username: '',
				color: '000000'
			}
		}, 


		computed: {
			// username() {
			// 	return this.$store.state.username;
			// }
		},

		// Methods
		methods: {
			registerUsername() {
				if (this.username === '') return false;
				this.$store.dispatch('registerUsername', {
					username: this.username,
					color: this.color
				});
			},

			colorChange(color) {
				this.color = color;
			}
		}

	}
</script>

<style scoped lang="sass">
	$blinkTime: 1s
	#login
		// Position login block
		position: fixed
		top: 0
		bottom: 0
		left: 0
		right: 0
		// colors
		background: linear-gradient(to top left, gray, black)
		color: white
		// font-size: 42px

		input#username 
			color: white
			background: transparent
			border: none
			outline: none
			border-bottom: 4px solid white
			text-align: center
			font-size: 26px
			
			&.blink
				&:not(:focus) 
					animation-name: inputBlink
					animation-duration: $blinkTime
					animation-iteration-count: infinite
					animation-direction: alternate

			@keyframes inputBlink
				0% 
					border-bottom-color: white
				100%
					border-bottom-color: red


	#colorPicker
		// width: 100%
		text-align: center
		font-size: 26px
		outline: none
		border: none

	#goButton
		font-size: 80px
		cursor: pointer
		
		animation-name: goButtonBlink
		animation-duration: $blinkTime
		animation-iteration-count: infinite
		animation-direction: alternate
		@keyframes goButtonBlink
			0%
				color: white
			100%
				color: red
		
</style>