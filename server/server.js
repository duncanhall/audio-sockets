

var CLIENT_HTML = '/../client';
var SLAVE_HTML = '/../slave';
var COMMON_HTML = '/../common';

var CMD_CLIENT = 'cmd-client';
var HAND_SHAKE = 'as-cc:hs';
var DISCONNECT = 'as-cc:dc';

var express;
var app;
var server;
var io;
var slaveID = 0;
var slave;
var colors = ['FFFFFF', '6AF0E1', 'FFCC00'];
var numClients = 0;

listenForConnections();


function listenForConnections () {

	express = require('express');
	app = express();
	server = require('http').createServer(app);
	io = require('socket.io').listen(server);

	app.use("/", express.static(__dirname + CLIENT_HTML));
	app.use("/common", express.static(__dirname + COMMON_HTML));
	app.use("/slave", express.static(__dirname + SLAVE_HTML));

	server.listen(8000);

	/*
	 * Define listeners for each socket that connects
	 */
	io.sockets.on('connection', function (socket) {

		/*
		 * Receive a client command
		 */
		socket.on(CMD_CLIENT, function(cmd) {

			relayClientCommand(socket.id, cmd);
		});

		/*
		 * Socket is identifying as either client or slave 
		 */
		socket.on('id', function(data) {

			if (data == 'slave') {
				
				slaveID = socket.id;
				slave = socket;
			}

			if (data == 'client') {
				
				var c = getColor();
				socket.emit(HAND_SHAKE, c);
				relayClientCommand(socket.id, {cmd:HAND_SHAKE, color:c});	
				
				numClients++;
			}			
		});

		/*
		 * A socket has disconnected
		 */
		socket.on('disconnect', function() {

			if (socket.id == slaveID) {

				slaveID = 0;
				slave = undefined;
			}
			else {

				numClients--;
				relayClientCommand(socket.id, {cmd:DISCONNECT});	
			}
		});

	});

	/*
	 * Relay client commands to the slave
	 */
	var relayClientCommand = function (id, cmd) {

		if (slave != undefined)
		{	
			cmd.id = String(id);
			slave.emit(CMD_CLIENT, cmd);
		}
	}

	var getColor = function () {

		return colors[numClients];
	}
}
