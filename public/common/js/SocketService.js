'use strict';

var sockets = angular.module('socketService', []);

angular.module('socketService').service('socketController', function () {

    function connect () {
        console.log('connect....');
    }

    return {
        connect: connect
    };
});