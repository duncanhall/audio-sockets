'use strict';

var ConnectionSettings = function (port, ip) {

    this.connectionURL = 'http://' + ip + ':' + port;

    this.CMD_HAND_SHAKE = 'chs';
    this.CMD_START = 'csr';
    this.CMD_STOP = 'csp';
    this.CMD_CHANGE = 'ccn';
    this.CMD_DISCONNECT = 'cdc';
};


module.exports = ConnectionSettings;
