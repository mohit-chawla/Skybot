// console.log('1');
// // Connect to server
// var io = require('socket.io-client');
// var socket = io.connect('http://localhost:8080', {reconnect: true});

// console.log('2');

// // Add a connect listener
// socket.on('connect', function(socket) { 
//   console.log('Connected!');
// });

// console.log('3');


const net = require("net");

// Create a socket (client) that connects to the server
var socket = new net.Socket();
socket.connect(8001, "localhost", function () {
    console.log("Client: Connected to server");
    // socket.emit('message', function(data){
    // 	data = "apple";
    // 	console.log("sending message "+data);
    //     socket.write(JSON.stringify({ message: data }));
    // });


    // socket.emit('message', 'kela');
    console.log('CLIENT INSIDE');


});

// Let's handle the data we get from the server
socket.on("data", function (data) {
    data = JSON.parse(data);
    console.log("Response from server: %s", data.response);
    // Respond back
    socket.write(JSON.stringify({ response: "hello server" }));

    // console.log("sending apple");
    // socket.write(JSON.stringify({ response: "Apple" }));

    // console.log("Sending mango");
    // socket.write(JSON.stringify({ response: "mango" }));
    // Close the connection
    // socket.end();
});



console.log('CLIENT OUTSIDE');