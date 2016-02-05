//REIVEW: Always write program desc and author and date(optional)
//REVIEW_RESPONSE:
// Program name: serverserver.js
// Program description: Server script to evaluate computation times for various scheduling aproaches
// Author: Kriti Singh
// Date last modified: 4 February 2016
/*
 DEVELOPERS' NOTE:
 *** if you get infinite errors of "info  - unhandled socket.io url", do npm install socket.io@1.0
 */
 // fs was included for writing into file
var io = require('socket.io').listen(3013),
    fs = require('fs');


var requestQueue = [],
    final_queue_processing_order = [],
    utility_results = [];

//REVIEW: what does each of them store?, use self descriptive naming or comment about it!
//REVIEW_RESPONSE: declare some global OBJECTS to be passed to functions so that variables are modified (in js they are passed by copy, objects are not) 
// eg. as in swap, and permute functions
var o = {x:0,y:0},
    obj = {},
    obj1 = {},
    obj2 = {},
    obj3 = {};

//Defining number of generations
const NUMBER_OF_GENERATIONS = 4;
//Define number of offsprings per generation
const NUMBER_OF_OFFSPRINGS = 3;
// Number of request profiles
const NUM_REQ_TYPES = 2;
// Request queue size
const MAX_REQUESTS = 10;
//
const TERMINATION_CONDITION_COUNT = 20;
//
const MINUS_INFINITY = -99999;

// Variables used for random number generater
const ERR_NO_NUM = -1
const ERR_NO_MEM = -2

var brute_force_best_soln = MINUS_INFINITY;
var queue__init_permutation;
/* ******kay constants and functions for ec approach. Definition starts here****** */


//REVIEW: we are fixing it to be 5 seconds currently, MUST CHANGE IT LATER, different for each type of requests
//REVIEW_RESPONSE: commented sample codebelow
var processingTimeOfRequests = 5;
// var processingTimeOfRequests = {
//   "t1":10,
//   "t2":5
// };

/*
function recombination_cycle_crossover(requestQueueObj, other_offspring_arrObj, recombination_offspringObj) { // int *parent1, int *parent2,int *crossover_child:::: arr_index,other_offspring_arr,recombination_offspring
    // int parent1[] = {0,1,2,3,4};
    // int parent2[] = {2,3,1,0,4};
    // int crossover_child[5]={-1,-1,-1,-1,-1};
    console.log("Parent 1(for recombination):\n");
    for (var i = 0; i < requestQueueObj.item.length; ++i) {
        console.log("  %d", requestQueueObj.item[i].req_id);
    }
    console.log("\nParent 2(for recombination):\n");
    for (var i = 0; i < other_offspring_arrObj.item.length; ++i) {
        console.log("%d\t", other_offspring_arrObj.item[i]);
    }
    // int sd;
    // scanf("%d",&sd);
    var placed_count = 0,
        j = 0;
    //Execute the cycle crossover till all are handled

    // This code not working, goes into infinite loop
    
    // while (placed_count < MAX_REQUESTS) {
    //     console.log('haha');
    //     var flag = 0;
    //     for (i = 0; i < MAX_REQUESTS; i++) {
    //         if (other_offspring_arrObj.item[requestQueueObj.item[j]] === recombination_offspringObj.item[i])
    //             flag = 1;
    //     }
    //     if (flag == 0) {
    //         recombination_offspringObj.item[j] = other_offspring_arrObj.item[requestQueueObj.item[j].req_id];
    //         placed_count++;
    //         j = other_offspring_arrObj.item[j];
    //     } else {
    //         //This means a cycle is completed
    //         for (i = 0; i < MAX_REQUESTS; i++) {
    //             //Find a new cycle
    //             if (recombination_offspringObj.item[i] === -1)
    //                 j = i;
    //         }
    //     }
    //     // printf("j is %d, pc %d\n",j,placed_count );
    // }
    

    console.log('printing recombination offspring');
    console.log(recombination_offspringObj.item);
    
    // for (i = 0; i < recombination_offspringObj.item.length; i++)
    //     console.log("%d\t", recombination_offspringObj.item[i]);
    }
*/

function recombination_cycle_crossover(parent1Obj, parent2Obj, recombination_offspringObj) { // int *parent1, int *parent2,int *crossover_child:::: arr_index,other_offspring_arr,recombination_offspring
    console.log(parent1Obj.item);
    // console.log(parent2Obj.item);
    var cycles = [], placed_count=0, k = parent1Obj.item.length;
    var buff = {p1:[], p2:[]};
    console.log(cycles);


    // for(i=0;i<requestQueueObj.item.length;i++){
    //     if(i%2===0){
    //         buff.p1.push(requestQueueObj.item[i]);
    //     }
    //     else{
    //         buff.p2.push(requestQueueObj.item[i]);
    //     }
    // }
    
    console.log(buff);
    }


//Function to simulate swap mutation
function mutate_swap(requestQueueObj) {
    console.log("Applying swap mutation\n");
    var n = requestQueueObj.item.length;
    var pos1 = generate_random_number(n);
    var pos2 = generate_random_number(n);
    while (pos2 === pos1) { // to ensure unique num generation
        pos2 = generate_random_number(n);
    }

    // swap items at pos1 and pos2
    o.x = requestQueueObj.item[pos1];
    o.y = requestQueueObj.item[pos2];
    swap(o);
    requestQueueObj.item[pos1] = o.x;
    requestQueueObj.item[pos2] = o.y;
    console.log("after swapping index %d %d:\n", pos1, pos2);
}

//REVIEW: Give a sample request queue obj here in comments
//REVIEW_RESPONSE: sample request object format (for reference)
// { 
//     req_type: "t1",  // request type: string
//     req_id: 1,       // request id: unique, integer currently
//     msg: 'for 1000', // optional message atttached with request, string
//     timeSt: JSON.stringify(new Date()) // timeStamp at which request was sent from client end (take off timestamp): string
// }

// Function to simulate inverse mutation

// backup
// function mutate_inverse(requestQueueObj) {

//     console.log("Applying inverse mutation\n");
//     var n = requestQueueObj.item.length;
//     var pos1 = generate_random_number(n);
//     // var pos2 = generate_random_number(n);
//     // std::vector<int> vector;
//     // std::vector<int> vector_index;
//     // for(int i = 0; i < n;i++)
//     // {
//     //     vector_index.push_back(arr_index[i]);
//     //     vector.push_back(arr[i]);
//     // }
//     // std::reverse(vector.begin(), vector.end());
//     // std::reverse(vector_index.begin()+pos1, vector_index.end()-pos1);
//     // int x=0;
//     // for (std::vector<int>::iterator itv=vector.begin(); itv != vector.end(); ++itv){
//     //   arr[x++] = *itv;
//     // }
//     // x=0;
//     // for (std::vector<int>::iterator itvv=vector_index.begin(); itvv != vector_index.end(); ++itvv){
//     //   arr_index[x++] = *itvv;
//     // }
//     requestQueueObj.item.reverse();
// }

function mutate_inverse(requestQueueObj) {

    //REVIEW: approach: generate two random numbers and reverse the "sub-array" bw the two positions, i don't think you are doing that
    //REVIEW_RESPONSE: did so, hadnt understood the purpose the last time

    var n = requestQueueObj.item.length;
    var pos1 = generate_random_number(n);
    var pos2 = generate_random_number(n);
    while (pos2 === pos1) { // to ensure unique num generation
        pos2 = generate_random_number(n);
    }
    console.log("Applying inverse mutation bw %d %d index\n",pos1,pos2);
    for (var l = pos1, r = pos2; l < r; l += 1, r -= 1)
        {
            var temporary = requestQueueObj.item[l];
            requestQueueObj.item[l] = requestQueueObj.item[r];
            requestQueueObj.item[r] = temporary;
        }
    // requestQueueObj.item.reverse();
}


// //Function to simulate scramble mutation
// abckup
// function mutate_scramble(requestQueueObj) { // int *arr->, int *arr_index->id
//     console.log("Applying scramble mutation:\n");
//     var n = requestQueueObj.item.length;
//     for (i = 0; i < n; ++i) {
//         //Pick two positions randomly
//         var pos1 = generate_random_number(n);
//         var pos2 = generate_random_number(n);
//         // var req_pos1 = arr[pos1];
//         // var req_pos2 = arr[pos2];
//         // var temp_index_swap = arr_index[pos1]; //
//         // arr[pos2] =  req_pos1;
//         // arr[pos1] = req_pos2;
//         // arr_index[pos1] = arr_index[pos2]; //
//         // arr_index[pos2] =  temp_index_swap; //
//         // arr[pos1] = req_pos2;

//         o.x = requestQueueObj.item[pos1];
//         o.y = requestQueueObj.item[pos2];
//         swap(o);
//         requestQueueObj.item[pos1] = o.x;
//         requestQueueObj.item[pos2] = o.y;

//     }
// }

// randomise shuffle an array Object from index l to r inclusive
function shuffleArray(array, l, r) {
    for (var i = r; i >=l ; i--) {
        var j = Math.floor(Math.random() * (r-l+1)) + l;
        var temp = array.item[i];
        array.item[i] = array.item[j];
        array.item[j] = temp;
    }
    // console.log(array);
    // return array;
}

//Function to simulate scramble mutation
function mutate_scramble(requestQueueObj) { // int *arr->, int *arr_index->id
    var n = requestQueueObj.item.length;
    //REVIEW: your approach takes O(n) while it should be done in O(1)
    //REVIEW: you are doing this random swapping n times , it should be : select 2 positions randomly, and shuffle the subarray bw those two positions
    //REVIEW: Shuffle function-> http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    //REVIEW_RESPONSE: resolved
    // for (i = 0; i < n; ++i) {
        //Pick two positions randomly
        var pos1 = generate_random_number(n);
        var pos2 = generate_random_number(n);
        while (pos2 === pos1) { // to ensure unique num generation
            pos2 = generate_random_number(n);
        }
    console.log("Applying scramble mutation bw %d %d index\n",pos1,pos2);
        // var req_pos1 = arr[pos1];
        // var req_pos2 = arr[pos2];
        // var temp_index_swap = arr_index[pos1]; //
        // arr[pos2] =  req_pos1;
        // arr[pos1] = req_pos2;
        // arr_index[pos1] = arr_index[pos2]; //
        // arr_index[pos2] =  temp_index_swap; //
        // arr[pos1] = req_pos2;

        // o.x = requestQueueObj.item[pos1];
        // o.y = requestQueueObj.item[pos2];
        // swap(o);
        // requestQueueObj.item[pos1] = o.x;
        // requestQueueObj.item[pos2] = o.y;
        shuffleArray(requestQueueObj, pos1, pos2);

    // }
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
function fitness_value_fn(queue, printflag) { // expects a queue of objects
    //Define the initial variables


    var j, time_spent = 0,
        fitness_val = 0;
    for (j = 0; j < queue.length; j++) { // was MAX_REQUESTS
        //Request has been processed 
        //Now lets calculate the utility(fitness/happiness value of the waiting user)
        // if( queue[j].req_type === "t1"){
        //   time_spent += processingTimeOfRequests.t1;
        // }else{
        //   time_spent += processingTimeOfRequests.t2;
        // }
        time_spent += processingTimeOfRequests;
        // if request is of type 1
        if (queue[j].req_type === "t1") {
            if (time_spent <= 50) {
                fitness_val += (-(90) / 50) * time_spent;
            } else {
                fitness_val += (-90);
            }
        }
        //else if request is of type 2
        else {
            if (time_spent <= 60) {
                fitness_val += 0;

            } else if ((time_spent > 60 && time_spent <= 80)) {
                fitness_val += ((-9) / 2) * time_spent + 270;
            } else {
                fitness_val += (-90);
            }
        }
        //printf("Completion time:%d milliseconds \n",time_spent);

    }
    if (printflag===1){
    console.log("Fitness value for this individual : %d", fitness_val);
    }
    utility_results.push(fitness_val);
    // console.log('queue :\n',queue);
    // console.log('fitness val ',fitness_val);
    return fitness_val;
}
//Function to generate a random number within an assigned limit
function generate_random_number(size) {
    return Math.floor(Math.random() * size);
}

// the object used to swap
/*
  for items a, b; to swap(a,b) use as:

  o.x = a;
  o.y = b;
  swap(o);
  a = o.x;
  b = o.y

*/


function swap(obj) {
    var tmp = obj.x;
    obj.x = obj.y;
    obj.y = tmp;
}

var permArr = [],
    usedChars = [];

function permute(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {       //   loop over all elements 
        ch = input.splice(i, 1)[0];            //1. pull out each element in turn
        usedChars.push(ch);                    //   push this element
        if (input.length == 0) {               //2. if input is empty, we pushed every element
            permArr.push(usedChars.slice());   //   so add it as a permutation
        }
        permute(input);                        //3. compute the permutation of the smaller array
        input.splice(i, 0, ch);                //4. add the original element to the beginning 
                                               //   making input the same size as when we started
                                               //   but in a different order
        usedChars.pop();                       //5. remove the element we pushed
    }
    return permArr;                             //return, but this only matters in the last call
};

// console.log(permute([1,2,3,4]));
/* ******kay constants and functions for ec approach. Definition ends here****** */

io.sockets.on('connection', function(socket) {
    console.log('We have a new socket connection: ', socket.id);
    
    socket.on('job request', function(data) {
        // store all the requests from client with this socket id
        requestQueue.push(data);
    });

    // after all requests have been evaluated and queed, generate the results
    socket.on('sending done', function() {
        console.log('All queued');

        console.log('*****INITIAL POPULATION START*****');
        for (var i = 0; i < requestQueue.length; i++) {
            console.log('ID: ', requestQueue[i].req_id, ' Type: ', requestQueue[i].req_type);
            final_queue_processing_order.push(requestQueue[i]);
        }
        console.log('*****INITIAL POPULATION END*****\n');


        //Define array to be used in the generations
        var arr = [];
        for (i = 0; i < requestQueue.length; i++) {
            arr.push(requestQueue[i]);
        }

        //Brute force starts here
        var bruteForceStart = process.hrtime();
        console.log('*****BRUTE FORCE START*****');
        //2-D ARRAY THAT STORES ALL POSSIBLE PERMUATIONS OF REQUESTS QUEUE OBJECTS
        queue__init_permutation = permute(arr);
        //queue__init_permutation.reverse();
        for (var i = 0; i < queue__init_permutation.length; i++) {
            var temp_val_brute = fitness_value_fn(queue__init_permutation[i], 0);
            // console.log('temp_val_brute ',temp_val_brute);
            if (temp_val_brute > brute_force_best_soln)
                brute_force_best_soln = temp_val_brute;
        }
        console.log("Best solution via brute force: ", brute_force_best_soln);
        console.log('*****BRUTE FORCE END*****');
        var bruteForceEnd = process.hrtime(bruteForceStart);
        console.log('brute forcing took: %d ms', (1000 * bruteForceEnd[0]) + (bruteForceEnd[1] / 1000000));
        ///Brute force ends here

        // ec approach starts here
        var ecStart = process.hrtime();

        var maximum_utility = MINUS_INFINITY;
        //Clear the initial values in the utility
        utility_results = [];
        var termination_count = 0,
            termination_comparator = maximum_utility; // termination_comparator never used
        // console.log(arr);

        for (var gen = 0; gen < NUMBER_OF_GENERATIONS; ++gen) {
            var flag = 0; //For useless generation criteria
            var temp_mutation_iterator = 0;
            console.log("\n------------------------- GENERATION NUMBER %d------------------------ \n", gen);
            //To save the population of this generation
            var offsprings = new Array(NUMBER_OF_OFFSPRINGS);
            for (i = 0; i < offsprings.length; i++)
                offsprings[i] = new Array(arr.length);
            // int offsprings[NUMBER_OF_OFFSPRINGS][MAX_REQUESTS];

            //Swap mutation for this generation
            obj = {};
            obj.item = arr;
            mutate_swap(obj);
            arr = obj.item;

            //Printing the parent after the swap mutation
            for (i = 0; i < arr.length; ++i) {
                //REVIEW: i think there should be one more %d
                //REVIEW_RESPONSE: request type is string, so nope.
                console.log("%d ", arr[i].req_id, '   ', arr[i].req_type);

            }
            console.log("\n");
            //Saving the new mutated offspring
            // console.log('logging reqQueue: ',requestQueue);

            for (var col_iterator = 0; col_iterator < offsprings[0].length; col_iterator++) {
                // offsprings[temp_mutation_iterator][col_iterator] = arr_index[col_iterator];
                offsprings[temp_mutation_iterator][col_iterator] = arr[col_iterator].req_id;
            }
            temp_mutation_iterator++;
            //Scramble mutation for this generation
            obj = {};
            obj.item = arr;
            mutate_scramble(obj);
            arr = obj.item;
            //REVIEW: i think the comment below should be "scramble"
            //REVIEW_RESPONSE: resolved
            //Printing the mutant after the scramble mutation
            for (i = 0; i < arr.length; ++i) {

                //REVIEW: i think there should be one more %d
                //REVIEW_REPLY: i kept req_type attribute of a request object is STRING
                console.log("%d  ", arr[i].req_id, "  ", arr[i].req_type);
            }
            console.log("\n");
            //Saving the new mutated offspring
            for (var col_iterator = 0; col_iterator < offsprings[0].length; col_iterator++) {
                // offsprings[temp_mutation_iterator][col_iterator] = arr_index[col_iterator];
                offsprings[temp_mutation_iterator][col_iterator] = arr[col_iterator].req_id;
            }
            temp_mutation_iterator++;

            //Swap mutation for this generation
            obj = {};
            obj.item = arr;
            mutate_inverse(obj);
            arr = obj.item;

            //REVIEW: i think the comment below should be "inverse"
            //REVIEW_REPLY: resolved
            //Printing the mutant after the inverse mutation
            for (i = 0; i < arr.length; ++i) {
                console.log("%d ", arr[i].req_id, "  ", arr[i].req_type);
            }
            console.log("\n");


            //Saving the new mutated offspring
            for (col_iterator = 0; col_iterator < offsprings[0].length; col_iterator++)
                offsprings[temp_mutation_iterator][col_iterator] = arr[col_iterator].req_id;
            temp_mutation_iterator++;

            var best_offspring, other_offspring;
            //SURVIVOR SELECTION
            for (var k = 0; k < NUMBER_OF_OFFSPRINGS; k++) {

                //Selecting the best out of mutants
                //Set initial utlity as the utility of parent
                var this_offspring_arr_temp = new Array(offsprings[0].length);
                for (i = 0; i < offsprings[0].length; ++i) {
                    this_offspring_arr_temp[i] = offsprings[k][i];
                }
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////works fine till here

                var this_generation_utility = fitness_value_fn(this_offspring_arr_temp, 1);
                // console.log('this gen ',this_generation_utility,' max ',maximum_utility);

                if (this_generation_utility > maximum_utility) {
                    flag = 1;
                    best_offspring = k;
                    maximum_utility = this_generation_utility;
                    final_queue_processing_order = [];
                    for (i = 0; i < offsprings[0].length; ++i) {
                        final_queue_processing_order.push(offsprings[k][i]);
                    }
                }

            }
            //Select the second survivor(parent)
            other_offspring = best_offspring;
            do {
                other_offspring = generate_random_number(NUMBER_OF_OFFSPRINGS - 1);

            } while (other_offspring == best_offspring);

            console.log("First parent selected %d ,second parent selected = %d\n", best_offspring, other_offspring);
            console.log("recombi stuff below:");

            obj1.item= requestQueue;
            obj2.item= requestQueue;
            obj3.item = {};
            // obj1: parent 1, obj2 :parent 2, obj3: possible request sequences of offspring
            recombination_cycle_crossover(obj1,obj2, obj3);
            // mohit recombination issue see starts
            
            /*
              //Do recombination here;
              var recombination_offspring = new Array(offsprings[0].length);
              for (i = 0; i < offsprings[0].length; ++i) {
                  recombination_offspring[i] = -1;
              }
              var other_offspring_arr = new Array(offsprings[0].length);
              for (var i = 0; i < offsprings[0].length; ++i) {
                  other_offspring_arr[i] = offsprings[other_offspring][i];
              }

              // recombination_cycle_crossover(arr_index,other_offspring_arr,recombination_offspring);
              obj = {};
              obj.item = arr, obj1.item = other_offspring_arr, obj2.item = recombination_offspring;
              recombination_cycle_crossover(obj, obj1, obj2); // obj.item.req_id to be used, arr_index,other_offspring_arr,recombination_offspring
              arr = obj.item, other_offspring_arr = obj1.item, recombination_offspring = obj2.item;
              var recombination_offspring_utility = fitness_value_fn(recombination_offspring, 1);
              // console.log("Fitness value from recombination offspring: %d\n", recombination_offspring_utility);
              //whether the results due to recombinations are better than the current best result
              if (recombination_offspring_utility > maximum_utility) {
                  maximum_utility = recombination_offspring_utility;
                  final_queue_processing_order = [];
                  for (i = 0; i < MAX_REQUESTS; ++i) {
                      final_queue_processing_order[i] = recombination_offspring[i];
                  }
              }

            */
            // mohit recombination issue see ends

            //Print the fitness values for this generation


            console.log("List of fitness values for this generation: \n");
            console.log("utility results: ", utility_results);

            // for (std::list<int>::iterator it=utility_results.begin(); it != utility_results.end(); ++it){
            //   std::cout << ' ' << *it;
            //   if(*it > maximum_utility){
            //     maximum_utility = *it;
            //     flag = 1;

            //   }
            for (i = 0; i < utility_results.length; ++i) {
                process.stdout.write('  ', utility_results[i]);
                if (utility_results[i] > maximum_utility) {
                    maximum_utility = utility_results[i];
                    flag = 1;
                }
            }

            //Break from loop if no positive reward  in fitness value for past x generations
            if (flag == 0)
                termination_count++;
            if (termination_count == TERMINATION_CONDITION_COUNT)
                break;
            utility_results = [];

        }

        //FINAL RESULTS
        console.log("\n---------------------FINAL RESULT:----------------------- \n");
        console.log("Maximum fitness value : %d\n", maximum_utility);
        console.log("Final permutation:");
        for (i = 0; i < final_queue_processing_order.length; ++i) {
            console.log(' ', final_queue_processing_order[i]);
            // std::cout << "type:" << requestQueue[orig_parent[*it]].type;

        }

        var ecEnd = process.hrtime(ecStart);
        console.log('ec approach took: %d ms', (1000 * ecEnd[0]) + (ecEnd[1] / 1000000));
        // ec approach ends here        

    });

    socket.on('disconnect', function() {
        console.log('A client disconnected: ', socket.id);
    });
});


console.log('The main server is up.');