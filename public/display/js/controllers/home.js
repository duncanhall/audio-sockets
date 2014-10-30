'use strict';

angular.module('DisplayController')
    .controller('HomeCtrl', ['socketController', function (socketController) {

        socketController.connect();

    }]);