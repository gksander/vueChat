var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var fs = require('fs');


app.use('/static', express.static('dist/static'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'))
});

var users = {};
var messages = [];
var NumMessagesToKeep = 30;

io.on('connection', function(socket) {
	// Keep track as to whether the user has been added
	var addedUser = false;

	// Function to Broadcast usersChanged event
	var usersChanged = function() {
		// Broadcast users
		socket.emit('usersChanged', users);
		socket.broadcast.emit('usersChanged', users);
	}


	// ADDING USER
	socket.on('registerUsername', function(inp, fn) {
		// Pull username and color
		let username = inp.username,
			color = inp.color;


		if (addedUser) return;
		// If username taken, call CBF with false
		if (users[username] !== undefined) {
			fn(false);
			return;
		}
		// Need to validate color...

		// If all is good, we add the user
		socket.username = username;
		socket.color = color;
		users[username] = {
			color: color
		}
		addedUser = true;

		usersChanged();
		fn(true);
	});


	// INCOMING CHAT MESSAGE
	socket.on('chat message', function(msg) {
		if (!addedUser) return;

		var msgo = {
			msg: msg,
			username: socket.username
		};

		socket.broadcast.emit('chat message', msgo);
		messages.push(msgo);
		// We only keep N messages in memory
		messages = messages.slice(messages.length - NumMessagesToKeep, messages.length);
	});

	// Request for messages
	socket.on('fetchMessages', function(){
		socket.emit('fetchMessages', messages);
		return;
	});

	// Color changed
	socket.on('changeColor', function(inp) {
		try {
			users[inp.username].color = inp.color;
			usersChanged();
			return;
		}
		catch (err){
			return;
		}
	})



	// ON SOCKET DISCONNECT
	socket.on('disconnect', function(){
		// Pull user from users array
		delete users[socket.username];
		usersChanged();
	});



});



const port = process.env.PORT || 8080;
http.listen(port, function(){
	console.log(`listening on *: ${port}`)
});