'use strict';

var app = angular.module('DisplayController', ['ui.router', 'socketService']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('connection', {
            url: "/",
            templateUrl: "display/views/connect.html",
            controller: 'ConnectionCtrl'
        })
        .state('home', {
            url: "/connected",
            templateUrl: "display/views/home.html",
            controller: 'HomeCtrl'
        });

    $urlRouterProvider.otherwise("/");
});