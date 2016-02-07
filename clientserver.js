// Program name: serverserver.js
// Program description: Client Server script to emulate sending requests to main server
// Author: Kriti Singh
// Date last modified: 7 February 2016
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3012);

// app.get('/', function (req, res) {
//   res.sendfile(__dirname + '/index.html');
// });
// app.use('/', express.static(__dirname + '/'));

var clientio  = require('socket.io-client');

// connect to the main server
var client    = clientio.connect('http://localhost:3013');


// did not work
// io.sockets.on('connection', function (socket) {
//   console.log('CLIENT IS CONNECTED IN');

//   socket.on('client', function(data) {
//     console.log('serverserver data', data);
//     client.emit('my event', data);
//   });

  
//     // not working
// 	socket.on('end', function () {
//           console.log('oops! server disconnected');
//       });

  

  

//   socket.on('server ready', function(data){ console.log('server ready!'); }) ;
  

// });

console.log('The client server is up.');

// todo use a function returning this object here, didnt work initially so long coded it
client.emit('job request', { req_type: "t1", req_id: 1, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });
client.emit('job request', { req_type: "t2", req_id: 2, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });
client.emit('job request', { req_type: "t2", req_id: 3, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });
client.emit('job request', { req_type: "t1", req_id: 4, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });
client.emit('job request', { req_type: "t1", req_id: 5, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });
client.emit('job request', { req_type: "t2", req_id: 6, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });


client.emit('sending done');

client.emit('adminMessage', "glee");

  client.on('display results', function (data) {
          // console.log('msg from ', client.id);
          console.log('RESULTS DISPLAYED! ', data);
          app.get('/', function (req, res) {
            res.sendfile(__dirname + '/index.html');
          });
          app.use('/', express.static(__dirname + '/'));
          app.locals.title = "kittu";
  });

