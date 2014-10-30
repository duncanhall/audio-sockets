'use strict';

var app = angular.module('DisplayController', ['ui.router', 'socketService']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "display/views/home.html",
            controller: 'HomeCtrl'
        });

    $urlRouterProvider.otherwise("/");
});