
var path = require('path');
var cs = require(path.resolve('server/io/ConnectionSettings'));
var settings = new cs();

var CMD_CLIENT = 'cmd-client';
var HAND_SHAKE = settings.CMD_HAND_SHAKE;
var PAIRING = settings.CMD_PAIRING;
var DISCONNECT = settings.CMD_DISCONNECT;

function init (io) {

    var slaveID = 0;
    var slave;
    var numClients = 0;

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

            if (data === 'display') {
                slaveID = socket.id;
                slave = socket;
                relayClientCommand(socket.id, {cmd:HAND_SHAKE});
            }

            if (data === 'client') {
                numClients++;
                socket.emit(CMD_CLIENT, {cmd:HAND_SHAKE});
            }
        });

        /*
         * Receive a client command
         */
        socket.on(PAIRING, function(roomId) {
            socket.join(roomId, function (error) {

                console.log('Joined room, err: ' + error);
                socket.to(roomId).emit(CMD_CLIENT, {cmd:PAIRING});

            });
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
    };

}

module.exports = {
    init: init
};

