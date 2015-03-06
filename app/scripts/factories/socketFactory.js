'use strict';

/**
 * @ngdoc function
 * @name blogApp.factory:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the blogApp
 */
angular.module('blogApp')
  .factory('socketFactory', ['$location', function ($location) {
    var socketPort = 55800;

    var address = "ws://" + $location.host() + ":" + socketPort + "/ws";

    function createSocket(){
        var socket =  new WebSocket(address);
        
        return socket;
    }


    return {
        createSocket: createSocket
    };
}]);
