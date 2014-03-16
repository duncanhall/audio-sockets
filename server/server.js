
var PUBLIC_HTML = './public';
var PUBLIC_EXPR = '/../public';
var CLIENT_HTML = 'client';
var SLAVE_HTML = 'slave';

var fs = require('fs.extra'); 
var express = require('express');
var app;
var server;
var io;
var slaveID = 0;
var connections = [];

//Check for the existence of a 'watch' argument
var watch = process.argv[2] == "watch";


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

			/*
			 * Watch for changes
			 */
			if (watch) watchFiles();

		});

	});

});


function listenForConnections () {

	app = express();
	server = require('http').createServer(app);
	io = require('socket.io').listen(server);

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
