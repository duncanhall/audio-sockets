'use strict';

var path = require('path');
var cs = require(path.resolve('server/io/ConnectionSettings'));
var settings = new cs();

var CMD_CLIENT = 'cmd-client';
var HAND_SHAKE = settings.CMD_HAND_SHAKE;
var PAIRING = settings.CMD_PAIRING;
var DISCONNECT = settings.CMD_DISCONNECT;
var DEVICE_CONNECTED = settings.CMD_DEVICE_CONNECT;

function init (io) {

    var numHosts = 0;
    var hosts = [];


    /*
     * Define listeners for each socket that connects
     */
    io.sockets.on('connection', function (socket) {


        /*
         * Socket is identifying as either client or slave
         */
        socket.on('id', function(data) {

            var handshake = {cmd:HAND_SHAKE};

            if (data === 'display') {
                var connectionId = createConnectionId(numHosts);

                socket.connectionId = connectionId;
                socket.isHost = true;

                hosts[connectionId] = socket;
                numHosts++;
                handshake.id = socket.connectionId;
            }

            socket.emit(CMD_CLIENT, handshake);
        });

        /*
         * Receive a client command
         */
        socket.on(PAIRING, function(connectionId) {

            var roomId = getSocketIdByConnectionId(connectionId);

            socket.join(roomId, function (error) {
                if (error == null) {
                    socket.roomId = roomId;
                    socket.to(roomId).emit(CMD_CLIENT, {cmd:PAIRING});
                    socket.emit(CMD_CLIENT, {cmd:DEVICE_CONNECTED});
                }
                else {
                    console.error('Could not join room: ' + error);
                }
            });
        });

        /*
         * A socket has disconnected
         */
        socket.on('disconnect', function() {

            if (socket.isHost) {
                hosts[socket.connectionId] = null;
                delete hosts[socket.connectionId];
                numHosts--;
            }
            else {
                console.log('Client disconnected');
            }
        });

    });

    /**
     *
     * @param socketId
     * @returns {string}
     */
    function createConnectionId (socketId) {
        return new Buffer(String(socketId)).toString('base64');
    }

    /**
     *
     * @param connectionId
     * @returns {*}
     */
    function getSocketIdByConnectionId (connectionId) {

        var hostSocket = hosts[connectionId];

        if (hostSocket !== undefined) {
            return hostSocket.id;
        }
        else {
            console.error('Could not find host with connection ID = ' + connectionId);
        }
    }

}

module.exports = {
    init: init
};

