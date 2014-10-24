
var path = require('path');

/*
require('dns').lookup(require('os').hostname(), function (err, add, fam) {

    if (err !== null || add === null) {
        console.error('Could not detect IP: ' + err);
    }
    else {
        var SERVER_ADDRESS = add;

        var express = require('express');
        var app = express();
        var server = require('http').createServer(app);
        var io = require('socket.io').listen(server);
        var relay = require(path.resolve('backend/io/SocketRelay'));

        var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
        var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || SERVER_ADDRESS;

        app.use("/", express.static(__dirname + '/frontend/'));

        server.listen(server_port, server_ip_address, function(){
            console.log("Listening on " + server_ip_address + ", server_port " + server_port);
            relay.init(io);
        });
    }
});
*/


//var SERVER_ADDRESS = add;
var express = require('express');
var app = express();
var server = require('http').createServer(app);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '22.155.0.6';

app.use("/", express.static(__dirname + '/frontend/'));

console.log('App is using: ' + __dirname + '/frontend/');

server.listen(server_port, server_ip_address, function(){
    console.log("Listening on " + server_ip_address + ", server_port " + server_port);
});


function terminate (sig) {
    if (typeof sig === "string") {
        console.log('%s: Received %s - terminating sample app ...',
            new Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Node server stopped.', new Date(Date.now()) );
}

process.on('exit', terminate);

// Removed 'SIGPIPE' from the list - bugz 852598.
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
    'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'].forEach(function(element, index, array) {
    process.on(element, function() { terminate(element); });
});


