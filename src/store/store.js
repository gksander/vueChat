import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


export const store = new Vuex.Store({

	state: {
		username: '',
		users: {},
		messages: []
	},


	mutations: {

		changeUsername(state, username) {
			state.username = username;
		},

		changeUsers(state, users) {
			state.users = users;
		},

		addMessage(state, msg) {
			state.messages.push(msg);
		},

		fetchMessages(state, msgs) {
			state.messages = msgs;
		}

	},


	actions: {

		registerUsername({commit}, inp) {
			socket.emit('registerUsername', inp, function(confirmation) {
				if (!confirmation) {
					console.log('Username taken');
				}
				else {
					commit('changeUsername', inp.username);
				}
			})
		},

		sendMessage({commit, state}, msg) {
			var msgo = {msg: msg, username: state.username}
			socket.emit('chat message', msg);
			commit('addMessage', msgo);
		},

		changeColor({commit, state}, color) {
			socket.emit('changeColor', {
				username: state.username,
				color: color
			});
		},

		fetchMessages({commit, state}) {
			console.log('action called');
			socket.emit('fetchMessages');
		}

	}

});


// HANDLE SOCKETS
import io from 'socket.io-client';
var socket = io('http://localhost:3000');

// When users object is changed
socket.on('usersChanged', function(users) {
	store.commit('changeUsers', users);
});

socket.on('chat message', function(msg) {
	store.commit('addMessage', msg);
});

socket.on('fetchMessages', function(msgs) {
	store.commit('fetchMessages', msgs);
});