'use strict';

/**
 * @ngdoc overview
 * @name blogApp
 * @description
 * # blogApp
 *
 * Main module of the application.
 */
angular
  .module('blogApp', ['ngRoute']).config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
    }).when('/socket', {
        templateUrl: 'views/socketdemo.html',
        controller: 'SocketdemoCtrl'
    });

  }]);
