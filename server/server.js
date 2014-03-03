
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8000);

app.use("/", express.static(__dirname + "/../client/"));

io.sockets.on('connection', function (socket) {

	socket.emit('msg', { hello: 'world' });
	socket.on('msg', function(data) {
		console.log("Received: " + data);
	});	

	console.log('Client connected');

});

