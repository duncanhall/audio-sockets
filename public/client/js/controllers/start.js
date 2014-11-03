'use strict';

angular.module('MobileController')
    .controller('StartCtrl', ['$scope', 'socketController', 'serverConfig', function ($scope, socketController, serverConfig) {

        $scope.connectionId = '';

        $scope.submit = function () {
            console.log($scope.connectionId);
            socketController.connect(onData);
        };


        function onData(data) {

            console.dir(data);

            switch (data.cmd) {

                case serverConfig.cmdHandshake:
                    $scope.id = data.id;
                    socketController.join($scope.connectionId);
                    break;

                case serverConfig.cmdDeviceConnect:

                    break;

            }

            $scope.$apply();
        }



    }]);