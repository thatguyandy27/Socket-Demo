'use strict';

/**
 * @ngdoc function
 * @name blogApp.controller:SocketdemoCtrl
 * @description
 * # SocketdemoCtrl
 * Controller of the blogApp
 */
angular.module('blogApp')
  .controller('SocketdemoCtrl', ['$scope', 'socketService', function ($scope, socketService) {

    $scope.messages = [];
    $scope.isConnected = socketService.isConnected();

    $scope.connect = function connect(){
        socketService.connect(function connectCallback(msg){
            pushMessage("Successfully Connected: " + msg.data.message, "connect");
        });
    };
    $scope.disconnect = function disconnect(){
        socketService.disconnect(function disconnectCallback(msg){
            pushMessage("Successfully Disconnected", "disconnect");
        });

    };

    $scope.setTimer = function setTimer(){
        socketService.setServerTimer($scope.delay * 1000, $scope.repeat, function setTimerCallback(msg){
            pushMessage("Timer successfully set", "info");
        });
    };

    $scope.sendMessage = function sendMessage(){
        socketService.sendBroadcastMessage($scope.name || "NAME DELETED!", $scope.message);
    };

    function pushMessage(text, type){
        $scope.messages.push({type: type, text: text});
    }

    $scope.$on('destroy', function(){
        $scope.disconnect();
    });

    $scope.$on(socketService.Types.AsyncTimer, function(evt, message){
        pushMessage(message.data, "timer" );
    });
    $scope.$on(socketService.Types.BroadcastMessage, function(evt, message){
        pushMessage(message.data.user + ": " + message.data.message , "broadcast" );
    });
    $scope.$on(socketService.Types.Disconnect, function(evt, message){
        pushMessage("Disconnected...", "disconnect" );
    });



  }]);
