<template>
	<div id="chat" class="row center-xs top-xs">
		
		<div class="col-xs-12 col-sm-8" id="messaging">
			<div id="messagesContainer">
				<div v-for="msg in messages" class="messageContainer">
					<div class="messageHeader">
						<span :style="{color: getColor(msg.username), 'font-weight': 'bold'}">{{msg.username}}</span>
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
					</div>

					<i 
						class="fa fa-paper-plane" aria-hidden="true"
						style="float:right"
						@click="sendMessage()"
					></i>
				</div>

				<div id="inputContainer">
					
					<div v-if="mode=='type'">
						<textarea name="newMsg" id="newMsg" v-model="newMsg" rows="5" @keyup.enter.ctrl="sendMessage()"></textarea>
					</div>

					<div v-if="mode == 'preview'" v-html="MDtoHTML(newMsg)" id="preview">
						
					</div>

				</div>
			</div>

		</div>

		<div class="col-xs-10 col-sm-offset-1 col-sm-3" id="usersContainer">
			
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
				newMsg: ''
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
			}
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
	#chat
		// margin: 0px 0px
		padding: 20px
		

	#usersContainer
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
		padding: 5px
		background: white
		margin-bottom: 10px
		box-shadow: 0px 0px 5px black
		max-height: 70vh
		overflow-y: auto

	#editorContainer
		text-align: left
		padding: 5px
		box-shadow: 0px 0px 5px black
		background-color: white
		margin-bottom: 15px

		#optionsContainer
			display: flex
			align-items: middle
			justify-content: space-between

			div#leftOptions 
				display: flex

			i
				margin: 0px 8px
				color: blue
				font-size: 24px
				cursor: pointer
				&.active
					font-weight: bold
					font-size: 28px

			#colorButton
				cursor: pointer
				border: none
				margin: 0px 8px
				border-top-right-radius: 5px
				border-top-left-radius: 5px

		#newMsg
			box-sizing: border-box
			width: 100%
			resize: none

		#preview
			// box-shadow: 0px 0px 3px black
			// padding: 0px 5px
			max-height: 200px
			overflow-y: auto

	// Styling of actual message
	.messageContainer 
		text-align: left
		margin: 10px
		border: 1px solid gray
		border-radius: 2px

		.messageHeader
			padding: 3px
			background: rgba(230,230,230,0.95)
			margin: 0px

		.messageBody
			margin: 0px
			padding: 0px 5px


</style>