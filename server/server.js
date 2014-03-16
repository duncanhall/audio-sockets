
var PUBLIC_HTML = './public';
var PUBLIC_EXPR = '/../public';
var CLIENT_HTML = 'client';
var SLAVE_HTML = 'slave';

var fs = require('fs.extra'); 
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var slaveID = 0;
var connections = [];

/*
 * Clear the public directory
 */
fs.rmrf(PUBLIC_HTML, function (error) {
	if (error) return console.error(error);

	/*
	 * Copy the client to the public directory
	 */
	fs.copyRecursive(CLIENT_HTML, PUBLIC_HTML, function (error) { 
		if (error) return console.error(error);

		/*
		 * Copy the slave to the public directory
		 */
		fs.copyRecursive(SLAVE_HTML, PUBLIC_HTML, function (error) { 
			if (error) return console.error(error); 

			/*
			 * Filesystem ready
			 */
			listenForConnections();

		});

	});

});


function listenForConnections() {

	/*
	 * Serve the contents of the /public/ folder on port 8000
	 */
	app.use("/", express.static(__dirname + PUBLIC_EXPR));
	server.listen(8000);

	io.sockets.on('connection', function (socket) {
		
		connections[socket.id] = socket;

		/*
		 * Relay client commands to the slave
		 */
		socket.on('cmd-client', function(cmd) {
			connections[slaveID].emit('cmd-client', String(socket.id) + ":" + cmd);
		});

		/*
		 * Identify a slave 
		 */
		socket.on('id', function(data) {
			if (data == 'slave') slaveID = socket.id;
		});

		/*
		 * Inform slave when a client disconnects
		 */
		socket.on('disconnect', function() {
			connections[slaveID].emit('cmd-client', String(socket.id) + ":disconnect");
		});

	});
}

