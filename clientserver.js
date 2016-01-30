var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3012);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var clientio  = require('socket.io-client');

// connect to the main server
var client    = clientio.connect('http://localhost:3013');



io.sockets.on('connection', function (socket) {
  console.log('CLIENT IS CONNECTED IN');

  socket.on('client', function(data) {
    console.log('serverserver data', data);
    client.emit('my event', data);
  });

    
    // not working
	socket.on('end', function () {
	        console.log('oops! server disconnected');
	    });

  

});

console.log('The client server is up.');

// todo use a function returning this object here, didnt work initially so long coded it
client.emit('job request', { reqType: 1, req_id: 1, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });
client.emit('job request', { reqType: 2, req_id: 2, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });
client.emit('job request', { reqType: 2, req_id: 3, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });
client.emit('job request', { reqType: 1, req_id: 4, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });
client.emit('job request', { reqType: 1, req_id: 5, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });
client.emit('job request', { reqType: 2, req_id: 6, msg: 'for 90000', timeSt: JSON.stringify(new Date()) });


client.emit('sending done');