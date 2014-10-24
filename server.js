
var path = require('path');

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

        var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
        var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

        app.use("/", express.static(__dirname + '/frontend/'));

        server.listen(server_port, server_ip_address, function(){
            console.log("Listening on " + server_ip_address + ", server_port " + server_port);
            relay.init(io);
        });
    }
});




