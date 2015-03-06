var ws = require('ws');
var SOCKET_PORT= 55800,
    Types = {
        Connect: "CONNECT",
        Disconnect: "DISCONNECT",
        SetServerTimer: "SET_TIMER",
        BroadcastMessage: "BROADCAST_MESSAGE",
        AsyncTimer: "ASYNC_TIMER",
        GenericResponse: "GENERIC_RESPONSE"
    };

var sockets = [];

exports.startServer = function(server, connect, options){

    // open a websocket with said server. 
    var commandSocket = new ws.Server({port:SOCKET_PORT});

    commandSocket.on("connection", function(socket){

        var _socket = socket;
        sockets.push(socket);
        console.log("Socket Connected");

        _socket.on("close", function(){
            console.log("Socket Closed");

            //remove from the list of sockets
            for(var i = 0; i < sockets.length; i++){
                if (_socket == sockets[i]){
                    sockets.splice(i, 1);
                    break;
                }
            }

            _socket = null;
        });

        _socket.on("message", function(data, flags){
            var message = JSON.parse(data);
            console.log("Socket message recieved: " + message.type);

            switch(message.type){
                case Types.Connect: 
                    handleConnectMessage(message);
                    break;
                case Types.SetServerTimer:
                    handleSetServerTimer(message);
                    break;
                case Types.BroadcastMessage:
                    handleBroadcastMessage(message);
                    break;
            }
        });

        function handleConnectMessage(message){
            sendMessage(_socket, {type: Types.GenericResponse, transactionId: message.transactionId, data: {error: false, message: "Hello from the World!"}});
        }

        function handleBroadcastMessage(message){
            sendMessage(_socket, {type: Types.GenericResponse, data: {error: false, message: "OK"}})
            for(var i = 0; i < sockets.length; i++){
                sendMessage(sockets[i], {type: Types.BroadcastMessage, data: message.data});
            }
        }

        function handleSetServerTimer(message){

            var count = 0;

            function sendAsyncMessage(){
                if (count < message.data.times){
                    count ++;
                    sendMessage(_socket, {type: Types.AsyncTimer, data: "Async Message " + count});
                    setTimeout(sendAsyncMessage, message.data.timeout);
                }
            }

            sendAsyncMessage();

            sendMessage(_socket, {type: Types.GenericResponse, transactionId: message.transactionId, data: {error: false, message: "OK"}});
        }

        function sendMessage(socket, message){
            console.log("Socket sending message: " + message.type );
            socket.send(JSON.stringify(message));
        }

    });

};