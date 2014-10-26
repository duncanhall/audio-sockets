#!/bin/env node

var path = require('path');
var ConnectionSettings = require(path.resolve('server/io/ConnectionSettings'));

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
        var relay = require(path.resolve('server/io/SocketRelay'));

        app.use("/", express.static(__dirname + '/public/'));
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');
        app.set('views', 'public');

        app.get('/', function (req, res) {
            var ua = req.headers['user-agent'];
            var isMobile = (/mobile/i.test(ua));
            var options = {};
            options.root = isMobile ? __dirname + '/public/client' : __dirname + '/public/slave';

            var settings = new ConnectionSettings(PORT, IP_ADDR);
            res.render(options.root + '/index', {settings:settings});
        });

        server.listen(PORT, IP_ADDR, function () {
            console.log("Listening on " + IP_ADDR + ", server_port " + PORT);
            relay.init(io);
        });
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
