/*                                                                                                      *           *           * * * *
// Program name: server.js                                                                        * *       * *         *
// Program description: Server script to display the results from db                                         *   *   *   *        *
// Authors: Mohit Chawla <www.mohitchawla.in>, Kriti Singh <kriti96.singh@gmail.com>                 *************************************
*                                                                                                       *           *      *****
/                                                                                                       *           *         *
/                                                                                                       *           *           * * * *
DEVELOPERS NOTE
*** the variables bruteForceTime, bruteForceUtility, ecApproachTime, ecApproachUtility are STRINGS, please compute accordingly.
*/  
//Program Usage: 
//node server.js

//Express initializes app to be a funciton handler that is to be supplied to the http server later
var express = require('express');
var app = express();
//
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose  = require('mongoose');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
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

//APP CONFIGURATION AND VIEW ENGINE
app.set('port', server_port || 3000);
app.set('ipaddr', server_ip_address || "127.0.0.1");

app.use(express.static(__dirname+'/public'));
//APP CONFIGURATION END HERE


/////////////////////////// DATABASE SCHEMA/MODEL STARTS HERE //////////////////////////

var dbSchema = mongoose.Schema({
  runResult: {
    runID: {type: String, default: null}, //unique id to determine the "run" of algorithm {run: one loop of server processing}
    numOfRequests:{type:String, default:null},     //
    bruteForceTime:{type:String, default:null},     //Time taken by brute force
    bruteForceUtility:{type:String, default:null},  //Best answer by brute force 
    ecApproachTime:{type: String, default: null},   //Time taken by ec approach
    ecApproachUtility:{type: String, default: null},//Best answer by ec approach
    timeStamp: {type: Date, default:null}
  }
});

var researchModel = mongoose.model('researchModel', dbSchema, 'researchCollection');

// var testSample = new researchModel({ runResult:{runID : '111225'}});

// testSample.save(function(err){
//   if(err){
//     console.log("unable to save to database"+err);
//   }
//   else{
//     console.log("Database insertion successful");
//   }
// })
/////////////////////////// DATABASE SCHEMA/MODEL ENDS HERE //////////////////////////

// Defining a route handler '/' that gets called whenever we hit index.html
//sendFile is used as refractor to separate all the html code from this file
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket){

  var get_data_from_db = researchModel.find({}, function(err,foundData){
    if(err){
      console.log("Error retrieving data from db"); 
      throw err;
    }
    else{
      //Send data to front end here
      console.log(JSON.stringify(foundData));
      socket.emit("data_from_db_ready", foundData);

    }
  });
});


//server listening
server.listen(server_port, server_ip_address, function(){
  console.log('listening on *:'+server_port);
});


