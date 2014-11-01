'use strict';

angular.module('DisplayController')
    .controller('HomeCtrl', ['$scope', 'socketController', 'serverConfig', function ($scope, socketController, serverConfig) {

        function onData(data) {

            console.dir(data);

            switch (data.cmd) {

                case serverConfig.cmdHandshake:
                    $scope.id = data.id;
                    break;

                case serverConfig.cmdPairing:
                    $scope.id = 'Connected';
                    break;

            }

            $scope.$apply();
        }

        socketController.connect(onData);

    }]);