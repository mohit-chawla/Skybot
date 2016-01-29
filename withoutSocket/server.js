// // Load requirements
// var http = require('http'),
// io = require('socket.io');

// // Create server & socket
// var server = http.createServer(function(req, res)
// {
//   // Send HTML headers and message
//   res.writeHead(404, {'Content-Type': 'text/html'});
//   res.end('<h1>Aw, snap! 404</h1>');
// });
// server.listen(8080);
// io = io.listen(server);

// // Add a connect listener
// io.sockets.on('connection', function(socket)
// {
//   console.log('Client connected.');

//   // Disconnect listener
//   socket.on('disconnect', function() {
//   console.log('Client disconnected.');
//   });
// });

const net = require("net");

// Create a simple server
var server = net.createServer(function (conn) {
    console.log("Server: Client connected");

    // If connection is closed
    conn.on("end", function() {
        console.log('Server: Client disconnected');
        // Close the server
        // server.close();
        // End the process
        // process.exit(0);
    });

    // Handle data from client
    conn.on("data", function(data) {
        data = JSON.parse(data);
        console.log("Response from client server: %s", data.response);
    });

    // conn.on("message", function(data) {
    //     data = JSON.parse(data);
    //     console.log("message from client server: %s", data.message);
    // });
    

    // Let's response with a hello message
    conn.write(
        JSON.stringify(
            { response: "msg1: Hey there client!" }
        )
    );
    console.log('SERVER OUTSIDE');

});

// Listen for connections
server.listen(8001, "localhost", function () {
    console.log("Server: Listening");
});

console.log('SERVER OUTSIDE');