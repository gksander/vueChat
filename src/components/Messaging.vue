<template>
	<div id="chat" class="row center-xs top-xs">
		
		<div id="messagesContainer" ref="messagesContainer">
			<div v-for="msg in messages" class="messageContainer">
				<div class="messageHeader" :style="{'background-color': getColor(msg.username), 'font-weight': 'bold', color:'white'}">
					<span>{{msg.username == username ? 'Me' : msg.username}}</span>
				</div>
				<div class="messageBody" v-html="MDtoHTML(msg.msg)"></div>
			</div>
		</div>
			

		<div id="editorContainer">
			<div id="optionsContainer">
				<div id="leftOptions">
						<i 
						class="fa fa-pencil-square-o" aria-hidden="true"
						:class="{active: mode=='type'}"
						@click="mode='type'"
					></i>
					<i 
						class="fa fa-eye" aria-hidden="true"
						:class="{active: mode=='preview'}"
						@click="mode='preview'"
					></i>
					<input type="hidden" id="color_value" :value="color" @change="changeColor($event.target.value)">
					<button class="jscolor {valueElement: 'color_value'}" id="colorButton">
						Color
					</button>

					<i 
						class="fa fa-users" aria-hidden="true"
						id="toggleUsers"
						:class="{active: showUsers}"
						@click="showUsers = !showUsers"
					></i>

					<!-- <i 
						class="fa fa-refresh" aria-hidden="true"
						@click="fetchMessages()"
					></i> -->

				</div>

				<!-- <i 
					class="fa fa-paper-plane" aria-hidden="true"
					style="float:right"
					@click="sendMessage()"
				></i> -->
				<button id="sendButton" @click="sendMessage()">
					Send
					<i class="fa fa-paper-plane" aria-hidden="true"></i>
				</button>
			</div>

			<div id="inputContainer">
				
				<div v-if="mode=='type'">
					<textarea name="newMsg" id="newMsg" v-model="newMsg" @keyup.enter.ctrl="sendMessage()"></textarea>
				</div>

				<div v-if="mode == 'preview'" v-html="MDtoHTML(newMsg)" id="preview">
					
				</div>

			</div>
		</div>

		
		<div id="usersContainer" :class="{'shown': showUsers}">
			<h1>Online</h1>
			<ul id="usersList">
				<li v-for="(user, name) in users" :style='{color: "#"+user.color}'>
					{{name}}
				</li>
			</ul>
		</div>

	</div>
</template>

<script>
	var showdown = require('showdown'),
		converter = new showdown.Converter();

	import katex from 'katex';

	export default {
		data () {
			return {
				mode: 'type',
				newMsg: '',
				showUsers: false
			}
		},

		mounted () {
			jscolor.installByClassName("jscolor");
		},

		computed: {
			color() {
				return this.$store.state.color;
			},
			users() {
				return this.$store.state.users;
			},

			messages(){
				return this.$store.state.messages;
			},

			scrollTop() {
				// console.log(this.$refs.messagescontainer)
				// return this.$refs.messagescontainer.scrollTop;
				return 300;
				// return this.$refs.messagesContainer.scrollTop;
			},

			username() {
				return this.$store.state.username;
			}
		},

		watch: {
			// When messages change, scroll to bottom
			messages() {
				var that = this
				// For some reason, I have to timeout this.
				setTimeout(function(){
					var cont = that.$el.querySelector("#messagesContainer");
					cont.scrollTop = cont.scrollHeight;
				}, 1)
			}
		},

		created() {
 			this.$store.dispatch('fetchMessages');
		},


		methods: {
			logUsers() {
				console.log(this.users);
			},

			sendMessage() {
				if (this.newMsg === '') return false;
				this.$store.dispatch('sendMessage', this.newMsg);
				this.newMsg = '';
			},

			getColor(username) {
				try {
					return "#"+this.users[username].color;
				}
				catch (err) {
					return '#000000';
				}
			},

			scrollToEnd() {
				var container = this.$el.querySelector("#messagesContainer");
		      	container.scrollTop = container.scrollHeight;
			},

			fetchMessages(){
				console.log('component method called');
				this.$store.dispatch('fetchMessages');
			},

			MDtoHTML(md) {
				try {
					// Convert to markdown
					var os = converter.makeHtml(md);
					// Then handle display math
					os = os.replace(/\$\$(.+?)\$\$/g, function(x) {
						try {
							return katex.renderToString(x.substring(2, x.length-2), {
								displayMode: true
							});
						}
						catch (err){
							return x;
						}
					});
					// Then handle inline math
					os = os.replace(/\$(.+?)\$/g, function(x) {
						try {
							return katex.renderToString(x.substring(1, x.length-1), {
								displayMode: false
							});
						}
						catch (err){
							return x;
						}
					});
					// Then handle escapes
					os = os.replace(/\\\$/g, "$");

					return os;
				} catch(err){
					return md;
				}
			},

			changeColor(color) {
				this.$store.dispatch('changeColor', color);
			}

		}
	}
</script>

<style scoped lang="sass">
	@import "../assets/scss/variables.sass" 

	#chat
		// margin: 0px 0px
		padding: 20px
		
	#toggleUsers
		display: none

	#usersContainer
		// Fixed users list on right-hand side of screen
		position: fixed
		top: $pad
		// bottom: $inputHeight + $pad
		right: 0
		width: $usersWidth
		transition: all 300ms
		max-height: 70vh
		overflow-y: auto

		background: white
		box-shadow: 0px 0px 5px black
		padding: 0px

		h1
			margin: 0
			padding: 4px
			border-bottom: 2px solid gray
			text-align: center
			font-size: 24px

		#usersList
			list-style-type: none
			margin: 0px
			padding: 0px 0px
			overflow-y: auto
			overflow-x: auto
			max-height: 80%
			width: 100%
			li
				padding: 5px
				&:nth-child(2n+1) 
					background: #DFDBDB

	// Style messaging
	#messaging
		// margin-bottom: 15px
		// // background: white
		
		// padding: 0px

	#messagesContainer
		position: fixed
		top: $pad
		left: $pad
		right: $usersWidth + $pad
		bottom: $inputHeight + $pad
		background: white
		box-shadow: 0px 0px 5px black
		overflow-y: auto


	#editorContainer
		position: fixed
		bottom: 0
		// height: $inputHeight
		left: 0
		right: 0
		// display: flex
		// flex-direction: column


		#optionsContainer
			display: flex
			align-items: middle
			justify-content: space-between

			div#leftOptions 
				display: flex

			i
				margin: 0px 8px
				color: black
				font-size: 24px
				cursor: pointer
				&.active
					color: blue
					&:not(.fa-users)
						font-weight: bold

				&.fa-users.active
					animation-name: blinkUsersIcon
					animation-duration: 2s
					animation-iteration-count: infinite
					animation-direction: alternate

					@keyframes blinkUsersIcon
						0%
							color: black
						100%
							color: blue

			#colorButton
				cursor: pointer
				border: none
				margin: 0px 8px
				border-top-right-radius: 5px
				border-top-left-radius: 5px

			#sendButton
				cursor: pointer
				border: none
				margin: 0px 8px
				border-top-right-radius: 5px
				border-top-left-radius: 5px
				// font-size: 20px
				background-color: #3346D7
				color: white
				i
					font-size: inherit
					color: white
					margin: 0px 3px

		#inputContainer
			// position: absolute
			height: $inputHeight - 30px
			bottom: 0
			background: white
			// display: flex
			// flex-direction: column

		#newMsg
			box-sizing: border-box
			width: 100%
			height: $inputHeight - 30px
			resize: none
			// flex-basis: 100%
			// flex-shrink: 1

		#preview
			// box-shadow: 0px 0px 3px black
			padding: 0px 5px
			max-height: 200px
			overflow-y: auto

	// Styling of actual message
	.messageContainer 
		text-align: left
		margin: 10px
		border: 1px solid gray
		border-radius: 2px
		background: white

		.messageHeader
			padding: 3px
			background: rgba(230,230,230,0.95)
			margin: 0px

		.messageBody
			margin: 0px
			padding: 0px 5px



	// HANDLE SMALL SCREENS
	@media screen and (max-width: $breakpoint)
		#messagesContainer
			left: 0
			right: 0px !important
			top: 0
			background: transparent
			box-shadow: none

		#usersContainer
			right: -$usersWidth
			&:not(.shown)
				box-shadow: none
			&.shown
				right: 0
				h1
					// animation-name: userBlink
					// animation-duration: 2s
					// animation-iteration-count: infinite
					// animation-direction: alternate
					@keyframes userBlink
						0%
							background-color: white
							color: black
						100%
							background-color: blue
							color: white

		#toggleUsers
			display: inline

		#messagesContainer
			right: $pad

</style>