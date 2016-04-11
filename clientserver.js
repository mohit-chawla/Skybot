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
//node clientserver.js NUMBER_OF_REQUEST_TO_BE_SENT PROGRAM_RUN_ID

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

var mongoose = require('mongoose');


var dbName = "/scheduling_server";

var link_to_db;
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    link_to_db = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}
else{
  link_to_db = 'mongodb://localhost';
}


// Connection to Mongo DB
mongoose.connect(link_to_db+dbName, function(err){
  if(err){
    console.log('Unable to connect to db'+err);
  }
  else{
    console.log('Database connection successful');
  }
});

/////////////////////////// DATABASE SCHEMA/MODEL STARTS HERE //////////////////////////

var runLogSchema = mongoose.Schema({
  runDetails:{
    runID:{type:String, default:'111'},
    requestsLog : []
  }
});

var researchLogModel = mongoose.model('researchLogModel', runLogSchema, 'researchLog');





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
var this_run_id = terminalArgs[1] //check the program run id


console.log('The client server is up and will send '+num_of_requests + 'requests with randomly generated types and increasing IDs');

//check for existance of run-id in db if exists, send the same to client
researchLogModel.findOne({'runDetails.runID' : this_run_id}, function(err, progs){
  if(!err && progs === null ){
    var this_run_generated_requests = [];

    console.log("Run id does not exist in db, generating new requests");
    for(var rq = 1 ; rq  <= num_of_requests; rq++){
      var this_req_type = "t"+generate_random_number(NUM_OF_REQUEST_PROFILES); //Generate the request-type randomly out of the number of request profiles
      console.log("this request ID:"+rq+" TYPE: "+this_req_type);
      this_run_generated_requests.push(this_req_type);
      client.emit('job request', { req_type: this_req_type, req_id: rq, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });
    }


    client.emit('sending done');

    var this_run_log = new researchLogModel({
      runDetails:{
        runID:this_run_id,
        requestsLog : this_run_generated_requests
      }
    });
    //Logging request-sequence for this run
    this_run_log.save(function(err){
      if(err){
        console.log("unable to save this run log"); 
      }
      else{
        console.log("Run details logged successfully for RunID:"+this_run_id);
      }
    });
  }
  else{
    //Case when run-id exists in db, fetch and send
    console.log("Run-ID found in DB, fetching and sending");
    console.log(JSON.stringify(progs));
    var len = progs.runDetails.requestsLog.length;
    for( rq=1; rq<=len ; rq++){
      var this_req_type = progs.runDetails.requestsLog[rq-1]; //db has base0 indexing and loop has base1
      console.log("this request ID:"+rq+" TYPE: "+this_req_type);
      client.emit('job request', { req_type: this_req_type, req_id: rq, msg: 'for 1000', timeSt: JSON.stringify(new Date()) });

      if(rq == len){
        client.emit('sending done');
      }
    }
  }
});


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

