/*                                                                                                      *           *           * * * *
// Program name: clientserver.js                                                                        * *       * *         *
// Program description: Server script to evaluate computation times for various scheduling aproaches    *   *   *   *        *
// Authors: Mohit Chawla <www.mohitchawla.in>, Kriti Singh <kriti96.singh@gmail.com>                 *************************************
*                                                                                                       *           *      *****
/                                                                                                       *           *         *
/                                                                                                       *           *           * * * *
DEVELOPERS NOTE
*** if you get error: Error: listen EADDRINUSE      do---> killall -9 node
*/  
//Program Usage: 
//node clientserver.js NUMBER_OF_REQUEST_TO_BE_SENT

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

//Function to generate a random number within an assigned limit

const NUM_OF_REQUEST_PROFILES = 2;

function generate_random_number(size) {
    return Math.floor(Math.random() * size) + 1; //NOTE: Added 1 to base it on [1 ... size]
}

//USAGE: node filename.js arg[0] arg[1] ...
var terminalArgs = process.argv.slice(2); //Taking input from terminal
var num_of_requests = terminalArgs[0]; //derive number of requests to be sent from terminal input

console.log('The client server is up and will send '+num_of_requests + 'requests with randomly generated types and increasing IDs');

for(var rq = 1 ; rq  <= num_of_requests; rq++){
  var this_req_type = "t"+generate_random_number(NUM_OF_REQUEST_PROFILES); //Generate the request-type randomly out of the number of request profiles
  console.log("this request ID:"+rq+" TYPE: "+this_req_type);
  client.emit('job request', { req_type: this_req_type, req_id: rq, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });
}

// todo use a function returning this object here, didnt work initially so long coded it
// client.emit('job request', { req_type: "t1", req_id: 1, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });
// client.emit('job request', { req_type: "t2", req_id: 2, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });
// client.emit('job request', { req_type: "t2", req_id: 3, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });
// client.emit('job request', { req_type: "t1", req_id: 4, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });
// client.emit('job request', { req_type: "t1", req_id: 5, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });
// client.emit('job request', { req_type: "t2", req_id: 6, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });

// client.emit('job request', { req_type: "t2", req_id: 7, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });
// client.emit('job request', { req_type: "t1", req_id: 8, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });
// client.emit('job request', { req_type: "t2", req_id: 9, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });


client.emit('sending done');

client.emit('adminMessage', "glee");

  client.on('display results', function (data) {
          // console.log('msg from ', client.id);
          console.log('RESULTS DISPLAYED for! ', data.msg);
          console.log('Start index ', data.indexStart);
          console.log('End index ', data.indexEnd);
          app.get('/', function (req, res) {
            res.sendfile(__dirname + '/index.html');
          });
          app.use('/', express.static(__dirname + '/'));
          app.locals.title = "kittu";
  });

