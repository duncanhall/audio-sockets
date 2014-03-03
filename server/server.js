
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var slaveID = 0;

server.listen(8000);

app.use("/", express.static(__dirname + "/../client/"));

io.sockets.on('connection', function (socket) {
	
	socket.on('msg', function(data) {
		
		if (socket.id != slaveID)
		{
			io.sockets.socket(slaveID).emit(data);
		}
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

