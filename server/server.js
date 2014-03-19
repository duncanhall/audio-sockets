
var PUBLIC_HTML = './public';
var PUBLIC_EXPR = '/../public';
var CLIENT_HTML = 'client';
var SLAVE_HTML = 'slave';
var CMD_CLIENT = 'cmd-client';

var fs = require('fs.extra'); 
var express;
var app;
var server;
var io;
var slaveID = 0;
var slave;
var watch = process.argv[2] == "watch"; //Check for a 'watch' argument


/*
 * Clear the public directory
 */
fs.rmrf(PUBLIC_HTML, function (error) {
	if (error) return console.error('rmrf: ' + error);

	/*
	 * Copy the client to the public directory
	 */
	fs.copyRecursive(CLIENT_HTML, PUBLIC_HTML, function (error) { 
		if (error) return console.error('Copy client: ' + error);

		/*
		 * Copy the slave to the public directory
		 */
		fs.copyRecursive(SLAVE_HTML, PUBLIC_HTML, function (error) { 
			if (error) return console.error('Copy slave: ' + error); 

			/*
			 * Filesystem ready
			 */
			listenForConnections();

			/*
			 * Watch for changes
			 */
			if (watch) watchFiles();

		});

	});

});


function listenForConnections () {

	express = require('express');
	app = express();
	server = require('http').createServer(app);
	io = require('socket.io').listen(server);

	/*
	 * Serve the contents of the /public/ folder on port 8000
	 */
	app.use("/", express.static(__dirname + PUBLIC_EXPR));
	server.listen(8000);

	/*
	 * Define listeners for each socket that connects
	 */
	io.sockets.on('connection', function (socket) {

		/*
		 * Relay client commands to the slave
		 */
		socket.on(CMD_CLIENT, function(cmd) {

			relayClientCommand(socket.id, cmd);
		});

		/*
		 * Identify a slave 
		 */
		socket.on('id', function(data) {

			if (data == 'slave') {
				
				slaveID = socket.id;
				slave = socket;
			}
		});

		/*
		 * Inform slave when a client disconnects
		 */
		socket.on('disconnect', function() {

			if (socket.id == slaveID) {

				slaveID = 0;
				slave = undefined;
			}
			else {

				relayClientCommand(socket.id, 'disconnect');	
			}
		});

	});


	var relayClientCommand = function (id, cmd) {

		if (slave != undefined)
			slave.emit(CMD_CLIENT, String(id) + ':' + cmd);
	}
}


/*
 * Automatically watch client and server files for changes
 */
function watchFiles () {

	var watchr = require('watchr');
	watchr.watch({

		paths: ['./' + CLIENT_HTML, './' + SLAVE_HTML],
		listeners: {

			change: function (type, path, stat1, stat2) {
				
				var subpath = path.substr(path.indexOf('\\') + 1);

				/*
				 * Remove the public version of the file that's changed and
				 * replace it with the updated version.
				 */
				fs.remove(PUBLIC_HTML + '\\' + subpath);
				fs.copy(path, PUBLIC_HTML + '\\' + subpath, function (error) { if (error) return console.error(error); 

					console.log('Updated ' + path);
				});
			}
		}
	});	

}
