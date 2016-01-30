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
var requestQueue = [], fitnessValue=0, timeSpent = 0;
/* ******kay constants and functions for ec approach. Definition starts here****** */

//Defining number of generations
const NUMBER_OF_GENERATIONS=20;
//Define number of offsprings per generation
const NUMBER_OF_OFFSPRINGS=3;

// Number of request profiles
const NUM_REQ_TYPES=2;

// Request queue size
const MAX_REQUESTS=10;

const TERMINATION_CONDITION_COUNT=20;
const MINUS_INFINITY=-99999;

// Variables for random number generater
const ERR_NO_NUM=-1
const ERR_NO_MEM=-2

var brute_force_best_soln  = MINUS_INFINITY;
  
//Storing the possible "types" of requests
var typeOfRequests = [1,2];
//
var utilityDropPoint = [0,100];  
//Storing the processing time taken by the server to process the types of requests (in milliseconds)
//int processingTimeOfRequests[2] =  {10,10};
var processingTimeOfRequests = 5;

var utility_results=[], final_queue_processing_order=[];

//Function to generate a random number within an assigned limit
function generate_random_number(size){
  return Math.floor(Math.random()*size);
}

// function swap(x, y){
//     var temp;
//     temp = x;
//     x = y;
//     y = temp;
//     // y = [x, x = y][0];
// }

// the object used to swap
var o = {
  x: 0,
  y: 0
};
function swap(obj) {
  var tmp = obj.x;
  obj.x = obj.y;
  obj.y = tmp;
}
/*
  for items a, b; to swap(a,b) use as:

  o.x = a;
  o.y = b;
  swap(o);
  a = o.x;
  b = o.y

*/

/* Function to print permutations of string
   This function takes three parameters:
   1. String
   2. Starting index of the string
   3. Ending index of the string. */
function permute(a,l,r){
  // a is array,l is start index, r is ending index
   var i;
   if (l === r){
      var temp_val_brute = fitness_value_fn(a,0);
      if(temp_val_brute>brute_force_best_soln )
        brute_force_best_soln = temp_val_brute;

   }
   else
   {
       for (i = l; i <= r; i++)
       {
          // swap((a+l), (a+i));
          o.x = a[l];
          o.y = a[i];
          swap(o);
          a[l] = o.x;
          a[i] = o.y;

          permute(a, l+1, r);
          
          // swap((a+l), (a+i)); //backtrack
          o.x = a[l];
          o.y = a[i];
          swap(o);
          a[l] = o.x;
          a[i] = o.y;

       }
   }
}

/*
Fitness Function mathematical

FOR REQ TYPE ONE:

f(x) = -(9/5)*x    ; 0=<x=<50
   = -90*x     ; x>50

FOR REQ TYPE TWO:

f(x) = 0        ; 0<=x<=60
   = -(9/2)*x + 270 ; 60<x<=80
   = -90*x      ; x>80


Fitness Function mathematical ends here
*/


//Function to calculate fitness value
function fitness_value_fn(queue, printflag){
  //Define the initial variables
  var j,time_spent = 0, fitness_val = 0;
  for( j=0 ; j < queue.length ;  j++){ // was MAX_REQUESTS
    //Request has been processed 
    //Now lets calculate the utility(fitness/happiness value of the waiting user)
    time_spent += processingTimeOfRequests;
    // if request is of type 1
    if( requestQueue[queue[j]].reqType === 1){
      if(time_spent <= 50){
        fitness_val += (-(90)/50)*time_spent;
      }
      else{
        fitness_val += (-90);
      }
    }
    //else if request is of type 2
    else{
      if( time_spent <= 60 ){
        fitness_val += 0;

      }
      else if (( time_spent > 60 && time_spent<=80 )){
        fitness_val += ((-9)/2)*time_spent + 270 ;
      }
      else{
        fitness_val += (-90);
      }
    }
    //printf("Completion time:%d milliseconds \n",time_spent);

  }
  if(printflag)
    console.log("Fitness value for this individual : %d",fitness_val);
  utility_results.push(fitness_val);
  return fitness_val;
}


function recombination_cycle_crossover(parent1, parent2, crossover_child){
  // int parent1[] = {0,1,2,3,4};
  // int parent2[] = {2,3,1,0,4};
  // int crossover_child[5]={-1,-1,-1,-1,-1};
  console.log("Parent 1(for recombination):");
  for (var i = 0; i < MAX_REQUESTS; ++i)
  {
    console.log("%d    ",parent1[i]);
  }
  console.log("Parent 2(for recombination):");
  for (var i = 0; i < MAX_REQUESTS; ++i)
  {
    console.log("%d    ",parent2[i]);
  }
  // int sd;
  // scanf("%d",&sd);
  var placed_count =0 ,j=0;
  //Execute the cycle crossover till all are handled
  while(placed_count < MAX_REQUESTS)
  {

    var flag=0;
    for(var i=0;i<MAX_REQUESTS;i++)
      if(parent2[parent1[j]]===crossover_child[i])
        flag=1;
    if(flag===0){
      crossover_child[j]=parent2[parent1[j]], placed_count++;
      j = parent2[j];
        
    }
    else{
      //This means a cycle is completed
      for(var i=0;i<MAX_REQUESTS;i++)
        //Find a new cycle
        if(crossover_child[i]===-1)
          j = i;  
    }
    // printf("j is %d, pc %d\n",j,placed_count );
  }

    for(var i=0;i<5;i++)
      console.log("%d    ",crossover_child[i] );
}


//Function to simulate swap mutation
function mutate_swap(arr,arr_index){
  var pos1 = generate_random_number(MAX_REQUESTS);
  var pos2 = generate_random_number(MAX_REQUESTS);
  var req_pos1 = arr[pos1];
  var req_pos2 = arr[pos2];
  var temp_index_swap = arr_index[pos1];
  arr[pos2] =  req_pos1;
  arr[pos1] = req_pos2;
  arr_index[pos1] = arr_index[pos2];
  arr_index[pos2] =  temp_index_swap;
  arr[pos1] = req_pos2;
  console.log("after swapping %d %d:", pos1, pos2);
}

// Function to simulate inverse mutation
function mutate_inverse(arr, arr_index){
  console.log("Applying inverse mutation");
  var pos1 = generate_random_number(MAX_REQUESTS);
  // var pos2 = generate_random_number(MAX_REQUESTS);
  var vector=[];
  var vector_index=[];
  for(var i = 0; i < MAX_REQUESTS;i++)
  {
      vector_index.push(arr_index[i]);
      vector.push(arr[i]);
  }
  // std::reverse(vector.begin(), vector.end());
  vector.reverse();
  // std::reverse(vector_index.begin()+pos1, vector_index.end()-pos1);
  var anotherArr = vector_index.slice(pos1, vector_index.length-pos1).reverse();
  Array.prototype.splice.apply(vector_index, [pos1, pos1+anotherArr.length].concat(anotherArr));
  var x=0;
  for (var i=0; i< vector.length; ++i){
    arr[x++] = vector[i];
  }
  x=0;
  for (var i=0; i< vector_index.length; ++i){
    arr_index[x++] = vector_index[i];
  }
}

//Function to simulate scramble mutation
function mutate_scramble(arr, arr_index){
  console.log("Applying scramble mutation: ");
  for (var i = 0; i < MAX_REQUESTS; ++i)
  {
    //Pick two positions randomly
    var pos1 = generate_random_number(MAX_REQUESTS);
    var pos2 = generate_random_number(MAX_REQUESTS);
    var req_pos1 = arr[pos1];
    var req_pos2 = arr[pos2];
    var temp_index_swap = arr_index[pos1];
    arr[pos2] =  req_pos1;
    arr[pos1] = req_pos2;
    arr_index[pos1] = arr_index[pos2];
    arr_index[pos2] =  temp_index_swap;
    arr[pos1] = req_pos2;
  }
}


/* ******kay constants and functions for ec approach. Definition ends here****** */

io.sockets.on('connection', function (socket) {
  console.log('We have a new socket connection: ',socket.id);
  // create an array to store all the requests from client with this socket id

  // to process each job request, compute its execution time, and add this data to the request queue IN THE ORDER THEY COME
  socket.on('job request', function (data) {
    // console.time uses labels. labels not used because any duplicacy in labels(or their scoping) may fuck up.
    // console.time('processingTime');
    var hrstart = process.hrtime(), n;
    if(data.reqType === 1){
      n = 1000;
      fitnessValue+=1;
    }else{
      n = 90000;
      fitnessValue-=1;
    }
    // , 'request msg: ' , data.msg
    // reqType: 
    // req_id: 1
    // msg: 
    // timeSt: JSON.stringify(new Date())
    console.log('for request id: ', data.req_id, 'request type: ', data.reqType);

    for (var i = 0; i < n; i++) {
      ;
    }
    // console.log('request sent at' , data.timeSt); // comes with the data from client server
    var hrend = process.hrtime(hrstart);
    var hrendMilli = (1000 * hrend[0]) + (hrend[1]/1000000);
    timeSpent += hrendMilli;
    /*
      // console.info("Start time: %ds %dms", hrstart[0], hrstart[1]/1000000);
      // console.info("End time: %ds %dms", hrs[0], hrs[1]/1000000); // TODO try to print end time
      // console.info("Execution time: %ds %dms", hrend[0], hrend[1]/1000000);
    */
    data.timeSpent = hrendMilli;
    requestQueue.push(data);
    console.info("execution time: %dms", hrendMilli);
  });
  
  // after all requests have been evaluated and queed, generate the results
  socket.on('sending done', function() {
        // console.log('Finished sending requests');
        // console.log('Data after requests queuing');
        // console.log('Request queue size: ',requestQueue.length);
        // console.log('Fitness value: ',fitnessValue);
        // console.log('Total time taken(ms): ',timeSpent);


        // var arr[] = {1,2,1,2,1};
        //Reference array to assign a "type" to each queued request 
        var arr_input_type_reference = [1,2,2,1,1,2];
        console.log('queue to be evaluated: ',requestQueue);
        // for (var i = 0; i < MAX_REQUESTS; ++i)
        // {
        //   requestQueue[i].req_id=i;
        //   //Generate a random number to be picked
        //   var x = generate_random_number(6);
        //   requestQueue[i].reqType = arr_input_type_reference[x];
        // }
        for (var i = 0; i < requestQueue.length; ++i)
        {
          requestQueue[i].req_id=i;
          //Generate a random number to be picked
          var x = generate_random_number(6);
          requestQueue[i].reqType = arr_input_type_reference[x];
        }
          // requestQueue[0].reqType=1;
          // requestQueue[1].reqType=2;
          // requestQueue[2].reqType=1;
          // requestQueue[3].reqType=2;
          // requestQueue[4].reqType=1;   
          // requestQueue[0].reqType=1;
          // requestQueue[1].reqType=2;
          // requestQueue[2].reqType=1;
          // requestQueue[3].reqType=2;
          // requestQueue[4].reqType=1;
        //Seeding for random function
        // srand (time (NULL));
        //console.log("%d\n",generate_random_number(10) );
        //Select two random positions and swap them
        
        //Swap them 
        console.log("-------------------INITIAL POPULATION----------------- :");
        // for (var i = 0; i < MAX_REQUESTS; ++i)
        // {
        //   console.log("%d    ",requestQueue[i].req_id);
        //   final_queue_processing_order.push(requestQueue[i].req_id);
        // }
        for (var i = 0; i < requestQueue.length; ++i)
        {
          console.log("%d    ",requestQueue[i].req_id);
          final_queue_processing_order.push(requestQueue[i].req_id);
        }
        //Define array to be used in the generations
        // var arr[MAX_REQUESTS],arr_index[MAX_REQUESTS],orig_parent[MAX_REQUESTS];
        var arr=[],arr_index=[],orig_parent=[];
        // for (var i = 0; i < MAX_REQUESTS; ++i)
        // {
        //   arr[i] = requestQueue[i].reqType;
        //   arr_index[i] = requestQueue[i].req_id;
        //   orig_parent[i] = requestQueue[i].req_id;
        // }
        for (var i = 0; i < requestQueue.length; ++i)
        {
          arr[i] = requestQueue[i].reqType;
          arr_index[i] = requestQueue[i].req_id;
          orig_parent[i] = requestQueue[i].req_id;
        }

        //Brute force starts here
        console.log("\n------------BRUTE FORCE-------------\n");
        //2-D ARRAY THAT STORES ALL POSSIBLE PERMUATIONS OF REQUESTS QUEUE
          // var all_permuatations_req[MAX_REQUESTS][MAX_REQUESTS];
          var all_permuatations_req=[];
          
          var queue__init_permutation=[];
          // for(var i=0; i< MAX_REQUESTS ;i++){
          //   queue__init_permutation[i] = requestQueue[i].req_id;
          // }
          for(var i=0; i< requestQueue.length ;i++){
            queue__init_permutation[i] = requestQueue[i].req_id;
          }
          
          //FINDING ALL POSSIBLE PERMUATATIONS OF REQUESTS CURRENTLY STORED IN THE QUEUE
          
          // permute(queue__init_permutation,0,MAX_REQUESTS-1);
          permute(queue__init_permutation,0,queue__init_permutation.length-1);
          console.log("Best solution via brute force:%d ",brute_force_best_soln);

        console.log("------------BRUTE FORCE ENDS HERE-------------");
        console.log("------------BRUTE FORCE ENDS HERE-------------");

        ///Brute force ends here



        var maximum_utility = MINUS_INFINITY;
        //Clear the initial values in the utility
        // utility_results.clear();
        utility_results = utility_results.splice(0,utility_results.length)
           
        var termination_count =0, termination_comparator = maximum_utility;
        for (var i = 0; i < NUMBER_OF_GENERATIONS; ++i)
        {
          var flag=0;//For useless generation criteria
          var temp_mutation_iterator=0;
          console.log("\n------------------------- GENERATION NUMBER %d------------------------ \n",i );
          //To save the population of this generation
          // var offsprings[NUMBER_OF_OFFSPRINGS][MAX_REQUESTS];
          var offsprings=[[]];
          

          //Swap mutation for this generation
          mutate_swap(arr,arr_index);
          //Printing the parent after the swap mutation
          console.log("\nMutant after swap mutation");
          for (var i = 0; i < MAX_REQUESTS; ++i)
          {
            console.log("%d %d \t",arr_index[i],arr[i]);

          }
          console.log("\n");
          //Saving the new mutated offspring
          for(var col_iterator = 0 ; col_iterator < MAX_REQUESTS; col_iterator++)
            offsprings[temp_mutation_iterator].col_iterator = arr_index[col_iterator];
          temp_mutation_iterator++;

          //Swap mutation for this generation
          mutate_scramble(arr,arr_index);
          //Printing the mutant after the swap mutation
          console.log("\nMutant after scramble mutation");
          for (var i = 0; i < arr.length; ++i){ // was MAX_REQUESTS
            console.log("%d %d \t",arr_index[i],arr[i]);
          }
          console.log("\n");
          //Saving the new mutated offspring
          for(var col_iterator = 0 ; col_iterator < MAX_REQUESTS; col_iterator++)
            offsprings[temp_mutation_iterator][col_iterator] = arr_index[col_iterator];
          temp_mutation_iterator++;

          //Swap mutation for this generation
          mutate_inverse(arr,arr_index);
          //Printing the mutant after the swap mutation
          for (var i = 0; i < MAX_REQUESTS; ++i)
          {
            console.log("%d %d \t",arr_index[i],arr[i]);
          }
          console.log("\n");
          //Saving the new mutated offspring
          for(var col_iterator = 0 ; col_iterator < MAX_REQUESTS; col_iterator++)
            offsprings[temp_mutation_iterator][col_iterator] = arr_index[col_iterator];
          temp_mutation_iterator++;
          var best_offspring,other_offspring;
          //SURVIVOR SELECTION
          for(var k=0 ; k< NUMBER_OF_OFFSPRINGS; k++){

            //Selecting the best out of mutants
            //Set initial utlity as the utility of parent
            var this_offspring_arr_temp=[];
            for (var i = 0; i < MAX_REQUESTS; ++i)
            {
              this_offspring_arr_temp[i] = offsprings[k][i];
            }
            var this_generation_utility= fitness_value_fn(this_offspring_arr_temp,1);
            if(this_generation_utility > maximum_utility){
              flag=1,best_offspring = k;
              maximum_utility = this_generation_utility;
              final_queue_processing_order.clear();
              for (var i = 0; i < MAX_REQUESTS; ++i)
              {
                final_queue_processing_order.push_back(offsprings[k][i]);
              }
            }
        
          }
          //Select the second survivor(parent)
          other_offspring = best_offspring;
          do{
            other_offspring = generate_random_number(NUMBER_OF_OFFSPRINGS-1);

          }while(other_offspring==best_offspring);

            console.log("First parent selected %d ,second parent selected = %d\n",best_offspring,other_offspring );
          //Do recombination here;
          var recombination_offspring=[];
          for (var i = 0; i < MAX_REQUESTS; ++i)
          {
            recombination_offspring[i] = -1;
          }
          var other_offspring_arr=[];
          for (var i = 0; i < MAX_REQUESTS; ++i)
          {
            other_offspring_arr[i] = offsprings[other_offspring][i];
          }
          recombination_cycle_crossover(arr_index,other_offspring_arr,recombination_offspring);
          var recombination_offspring_utility = fitness_value_fn(recombination_offspring,1);
          console.log("Fitness value from recombination offspring: %d\n",recombination_offspring_utility);
          //whether the results due to recombinations are better than the current best result
          if(recombination_offspring_utility>maximum_utility){
            maximum_utility = recombination_offspring_utility;
              final_queue_processing_order.clear();
              for (var i = 0; i < MAX_REQUESTS; ++i)
              {
                final_queue_processing_order.push_back(recombination_offspring[i]);
              }
          }

          //Print the fitness values for this generation
          console.log("List of fitness values for this generation: \n");
          for (var i=0;i< utility_results.length; ++i){
            console.log('  ', utility_results[i]);
            if(utility_results[i] > maximum_utility){
              maximum_utility = utility_results[i];
              flag = 1;

            }
          }

          //Break from loop if no positive reward  in fitness value for past x generations
          if(flag==0)
            termination_count++;
          if(termination_count == TERMINATION_CONDITION_COUNT )
            break;
          utility_results.clear();

        }


        //FINAL RESULTS
        console.log("---------------------FINAL RESULT:-----------------------");
        console.log("Maximum fitness value : %d ",maximum_utility);
        console.log(" ");
        console.log("Final permutation:");
        for (var i=0;i<final_queue_processing_order.length; ++i){
          console.log('  ',final_queue_processing_order[i]);
          // std::cout << "type:" << requestQueue[orig_parent[*it]].reqType;

        }
        console.log(" ");

     });

  socket.on('disconnect', function() {
        console.log('A client disconnected: ',socket.id);
     });
});


console.log('The main server is up.');
