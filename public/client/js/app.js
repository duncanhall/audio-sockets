'use strict';

var app = angular.module('MobileController', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('start', {
            url: "/",
            templateUrl: "client/views/start.html",
            controller: 'StartCtrl'
        })
        .state('test', {
            url: "/test",
            templateUrl: "client/views/test.html"
        });

    $urlRouterProvider.otherwise("/");
});