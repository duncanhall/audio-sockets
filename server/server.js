
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var slaveID = 0;

server.listen(8000);

app.use("/", express.static(__dirname + "/../client/"));

io.sockets.on('connection', function (socket) {
	
	socket.on('msg', function(data) {
		//
	});	

	socket.on('cmd-client', function(cmd) {
	
		io.sockets.socket(slaveID).emit('cmd-client', cmd);
		
	});

	socket.on('id', function(data) {
		if (data == 'slave')
		{
			console.log('Slave detected');
			slaveID = socket.id;
		}
	});

	console.log('Client connected');

});

