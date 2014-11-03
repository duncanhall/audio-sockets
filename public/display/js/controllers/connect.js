'use strict';

angular.module('DisplayController')
    .controller('ConnectionCtrl', ['$scope', '$location', 'socketController', 'serverConfig', function ($scope, $location, socketController, serverConfig) {

        function onData(data) {

            switch (data.cmd) {

                case serverConfig.cmdHandshake:
                    $scope.id = data.id;
                    $scope.$apply();
                    break;

                case serverConfig.cmdPairing:
                    $location.path('/connected');
                    $scope.$apply();
                    break;

            }
        }

        socketController.connect(onData);

    }]);
