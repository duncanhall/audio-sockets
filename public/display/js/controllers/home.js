'use strict';

angular.module('DisplayController')
    .controller('HomeCtrl', ['$scope', 'socketController', 'serverConfig', function ($scope, socketController, serverConfig) {

        function onData(data) {

            switch (data.cmd) {

                case serverConfig.cmdHandshake:
                    $scope.id = data.id;
                    break;

            }

            $scope.$apply();
        }

        socketController.connect(onData);

    }]);