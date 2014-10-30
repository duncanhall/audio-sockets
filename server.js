#!/bin/env node
'use strict';

/**
 * Set production mode according to environment variable
 */
var IS_DEBUG = process.env.NODE_JS_ENV !== 'production';
process.env.NODE_ENV = IS_DEBUG ? 'development' : 'production';

var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var IP_ADDR = process.env.OPENSHIFT_NODEJS_IP;

/**
 * Configure Express and Socket.io
 */
var path = require('path');
var ConnectionSettings = require(path.resolve('server/io/ConnectionSettings'));
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var relay = require(path.resolve('server/io/SocketRelay'));

/**
 * Running locally requires explicit IP address (not just 127.0.0.1)
 */
if (IP_ADDR === undefined) {
    require('dns').lookup(require('os').hostname(), function (err, address, fam) {
        IP_ADDR = address || '127.0.0.1';
        start();
    });
}
else {
    start();
}

/**
 * Configure Express, start server and initialize socket relay.
 */
function start() {

    app.use("/", express.static(__dirname + '/public/'));
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.set('views', 'public');

    app.get('/', function (req, res) {
        var ua = req.headers['user-agent'];
        var isMobile = (/mobile/i.test(ua));
        var parent = isMobile ? __dirname + '/public/client' : __dirname + '/public/slave';
        var settings = new ConnectionSettings(PORT, IP_ADDR, IS_DEBUG);

        res.render(parent + '/index', {settings:settings});
    });

    server.listen(PORT, IP_ADDR, function () {
        console.log("Listening on " + IP_ADDR + ", server_port " + PORT);
        relay.init(io);
    });
}

/**
 * Exit handler.
 */
function exit(sig){
    if (typeof sig === "string") {
        console.log('%s: Received %s - terminating sample app ...', Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
}

/**
 * Exit signal handlers
 */
['SIGHUP','SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP',
    'SIGABRT','SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM']
.forEach(function(element, index, array) {
    process.on(element, function() { exit(element); });
});


process.on('exit', function() { exit(); });
