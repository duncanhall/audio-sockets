
var CMD_CLIENT = 'cmd-client';
var HAND_SHAKE = 'as-cc:hs';
var DISCONNECT = 'as-cc:dc';


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

            if (data == 'slave') {
                slaveID = socket.id;
                slave = socket;
            }

            if (data == 'client') {
                socket.emit(HAND_SHAKE);
                relayClientCommand(socket.id, {cmd:HAND_SHAKE});
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
    };

}

module.exports = {
    init: init
};

