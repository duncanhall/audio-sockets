'use strict';

var ConnectionSettings = function (port, ip, debug) {

    if (debug) {
        this.connectionURL = 'http://' + ip + ':' + port;
    }
    else {
        this.connectionURL = 'http://lab-duncanhall.rhcloud.com:8000';
    }

    this.CMD_HAND_SHAKE = 'chs';
    this.CMD_START = 'csr';
    this.CMD_STOP = 'csp';
    this.CMD_CHANGE = 'ccn';
    this.CMD_DISCONNECT = 'cdc';
    this.CMD_PAIRING = 'cpr';
};


module.exports = ConnectionSettings;
