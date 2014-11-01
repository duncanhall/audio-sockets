'use strict';

var sockets = angular.module('socketService', []);

angular.module('socketService').factory('socketController', ['serverConfig', function (serverConfig) {

    var socket = null;
    var listeners = [];
    var isConnected = false;

    function connect (listener) {

        listeners.push(listener);
        if (isConnected) return;

        socket = io.connect(serverConfig.connectionUrl);

        socket.on("connect", function() {
            isConnected = true;
            socket.emit("id", serverConfig.connectionType);
        });

        socket.on("cmd-client", function(data) {
            _.forEach(listeners, function (listener) { listener(data); });
        });
    }

    return {
        connect: connect
    }

}])
.provider('serverConfig', function() {
    var values = {};
    return {
        set: function(constants) {
            angular.extend(values, constants);
            values = Object.freeze(values);
        },
        $get: function() {
            return values;
        }
    };
});