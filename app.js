var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};

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

		socket.broadcast.emit('chat message', {
			msg: msg,
			username: socket.username
		});
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



const port = 3000;
http.listen(port, function(){
	console.log(`listening on *: ${port}`)
});