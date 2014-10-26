#!/bin/env node

var path = require('path');

require('dns').lookup(require('os').hostname(), function (err, add, fam) {

    if (err !== null || add === null) {
        console.error('Could not detect IP: ' + err);
    }
    else {

        var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
        var IP_ADDR = process.env.OPENSHIFT_NODEJS_IP || add;

        var express = require('express');
        var app = express();
        var server = require('http').createServer(app);
        var io = require('socket.io').listen(server);
        var relay = require(path.resolve('backend/io/SocketRelay'));

        app.use("/", express.static(__dirname + '/public/'));

        app.get('/', function (req, res) {
            var ua = req.headers['user-agent'];
            var isMobile = (/mobile/i.test(ua));
            var options = {};
            options.root = isMobile ? __dirname + '/public/client' : __dirname + '/public/slave';

            res.sendFile('index.html', options);
        });

        server.listen(PORT, IP_ADDR, function () {
            console.log("Listening on " + IP_ADDR + ", server_port " + PORT);
            relay.init(io);
        });

        /*
         var SERVER_ADDRESS = add;

         var express = require('express');
         var app = express();
         var server = require('http').createServer(app);
         var io = require('socket.io').listen(server);
         var relay = require(path.resolve('backend/io/SocketRelay'));

         var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
         var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || SERVER_ADDRESS;

         app.use("/", express.static(__dirname + '/frontend/'));

         for (var r in self.routes) {
         app.get(r, self.routes[r]);
         }

         server.listen(server_port, server_ip_address, function(){
         console.log("Listening on " + server_ip_address + ", server_port " + server_port);
         relay.init(io);
         });
         */
    }
});



function exit(sig){
    if (typeof sig === "string") {
        console.log('%s: Received %s - terminating sample app ...', Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
}

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT','SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM']
.forEach(function(element, index, array) {
    process.on(element, function() { exit(element); });
});


process.on('exit', function() { exit(); });
