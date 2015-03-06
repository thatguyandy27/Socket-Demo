'use strict';

/**
 * @ngdoc service
 * @name blogApp.socketService
 * @description
 * # socketService
 * Factory in the blogApp.
 */
angular.module('blogApp')
    .factory('socketService', ['socketFactory', '$rootScope', function (socketFactory, $rootScope) {

    var _socket = null,
        _transactionCounter = 0,
        _messageHandlers = {},
        Types = {
            Connect: "CONNECT",
            Disconnect: "DISCONNECT",
            SetServerTimer: "SET_TIMER",
            BroadcastMessage: "BROADCAST_MESSAGE",
            AsyncTimer: "ASYNC_TIMER",
            GenericResponse: "GENERIC_RESPONSE"
        };

    function isConnected(){
      return _socket !== null && _socket.readyState === WebSocket.OPEN;
    }

    function disconnect(callback){
        if (isConnected()){
            _socket.close();
            if (callback){
                callback();
            }
        }
    }

    function setServerTimer(timeout, times, callback){
        sendMessage({type: Types.SetServerTimer, data: {timeout: timeout, times: times} });
    }

    function sendBroadcastMessage(user, message){
        sendMessage({type: Types.BroadcastMessage, data: {user: user, message: message}});
    }

    function connect(callback){
        if (!isConnected()){
            _socket = socketFactory.createSocket();

            _socket.onopen = function onOpen(){
                if (isConnected()){
                    sendMessage({type: Types.Connect, data: "Hello World"}, callback);
                }
            };

            _socket.onerror = function onError(){
                console.log("Error");
            };

            _socket.onmessage = onMessageRecieved;

            _socket.onclose = function onClose(){
                //goodnight socket
                _socket = null;
                $rootScope.$broadcast(Types.Disconnect);
            };
        }
    }

    function sendMessage(message, callback){
        if (!isConnected()){
            return false;
        }

        message.transactionId = _transactionCounter++;
        if (callback != null){
            _messageHandlers[message.transactionId] = callback;
        }

        _socket.send(angular.toJson(message));

        return message.transactionId;
    }

    function onMessageRecieved(evt){
        var message =  angular.fromJson(evt.data);

        $rootScope.$apply(function(){
            if (message.transactionId != null && _messageHandlers[message.transactionId] != null){
                _messageHandlers[message.transactionId](message);
                _messageHandlers[message.transactionId] = null;
            }

            $rootScope.$broadcast(message.type, message);
        });
        
    }

    // Public API here
    return {
      isConnected: isConnected,
      disconnect: disconnect,
      connect: connect,
      setServerTimer: setServerTimer,
      sendBroadcastMessage: sendBroadcastMessage,
      Types: Types
    };
}]);
