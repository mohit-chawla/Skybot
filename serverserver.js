/*
*** if you get infinite errors of "info  - unhandled socket.io url", do npm install socket.io@1.0
*/

var io = require('socket.io').listen(3013)
  , fs = require('fs');

// fs.writeFile(__dirname + '/test.txt', "", function(err) {
//       if(err) {
//           return console.log(err);
//       }
//       console.log("empty file for computation logs created!");
//   });

// bad idea to write to a txt file, THIS may block the node thread as things are paused until this happens
// writing to file starts
var stream = fs.createWriteStream(__dirname + '/test.txt');
stream.once('open', function(fd) {
  obj = {name: "kay", age: 19};
  stream.write("Line 1 out\n");
  stream.write("line 2 out\n");
  stream.write(JSON.stringify(obj, null, 2));
  stream.end();
});
// writing to file ends

io.sockets.on('connection', function (socket) {
	console.log('We have a new socket connection: ',socket.id);

  socket.on('job request', function (data) {
    // console.time('processingTime'); // console.time uses labels. labels not used because a duplicacy in labels(or their scoping) may fuck up.
    var hrstart = process.hrtime();
    console.log('request counter: ', data.counter, 'request type: ', data.reqType, 'request msg: ' , data.msg);
    // console.log(data);
    for (var i = 0; i < data.counter; i++) {
      ;
    }
    // console.log('request sent at' , data.timeSt); // comes with the data from client server
    var hrend = process.hrtime(hrstart);
    console.info("Start time: %ds %dms", hrstart[0], hrstart[1]/1000000);
    // console.info("End time: %ds %dms", hrs[0], hrs[1]/1000000); // TODO try to print end time
    console.info("Execution time: %ds %dms", hrend[0], hrend[1]/1000000);
    
    // do not delete the below code  
    // fs.writeFile(__dirname + '/test.txt', "insiide", function(err) {
    //       if(err) {
    //           return console.log(err);
    //       }
    //       console.log("Writing inside event trigger");
    //   });

  // won't work
  // stream.once('open', function(fd) {
  //   stream.write("Line 3 in\n");
  //   stream.write("line 4 in\n");
  //   stream.end();
  // });
  });
  
  socket.on('disconnect', function() {
        console.log('A client disconnected: ',socket.id);
     });
});


console.log('The main server is up.');
