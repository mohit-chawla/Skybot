// Program name: serverserver.js
// Program description: Server script to evaluate computation times for various scheduling aproaches
// Author: Kriti Singh
// Date last modified: 4 February 2016
/*
DEVELOPERS' NOTE:

*** if you get infinite errors of "info  - unhandled socket.io url", do npm install socket.io@1.0
***if arr is a array/object that you continuously modify and push arr somewhere, the arr/object is pushed BY REFERENCE

DEVELOPERS' NOTE ENDS*/
var io = require('socket.io').listen(3013),
    fs = require('fs'); // fs was included for writing into file


var requestQueue = [], //stores the original object
    requestQueueReferenceOrder = [], //stores the request-id : REVIEW: write storage format here
    final_queue_processing_order = [], // REVIEW : What does this store
    // REVIEW: 
    utility_results = []; // global array used by fitness function to push fitness values of 



const NUMBER_OF_GENERATIONS = 4; //Define number of generations
//REVIEW: verify this shit

const NUMBER_OF_OFFSPRINGS = 3; //Define number of offsprings per generation


const NUM_REQ_TYPES = 2; // Number of request profiles

const MAX_REQUESTS = 10; // Request queue size
//REVIEW: this vs num_of_gen
const TERMINATION_CONDITION_COUNT = 20;

const MINUS_INFINITY = -99999;

// Variables used for random number generater
const ERR_NO_NUM = -1
const ERR_NO_MEM = -2

var brute_force_best_soln = MINUS_INFINITY,
    queue__init_permutation;

//REVIEW: we are fixing it to be 5 seconds currently, MUST CHANGE IT LATER, different for each type of requests
var processingTimeOfRequests = 5;
// var processingTimeOfRequests = {
//   "t1":10,
//   "t2":5
// };




var recombination_offspring = []; //REVIEW: change name apt.

function recombination_cycle_crossover(arr1, arr2) {
    var placed_count = 0,
        j = 0;
    var n = arr1.length,
        cyclesPar1 = [],
        cyclesPar2 = [], //Cycle crossover parents
        buffPar1 = [],
        buffPar2 = [], //Temp-buffer array for Cycle crossover
        //REVIEW :change the name
        considered = [], //used for storing indices cycles taken care of
        num_of_cycles = 0,
        temp = [];

    while (recombination_offspring.length) {
        recombination_offspring.pop();
    }

    //Execute the cycle crossover till all are handled
    for (var j = 0; j < n; j++) {
        if (considered.indexOf(j) == -1) {
            val1 = arr1[j];
            val2 = arr2[j];


            if (val1 === val2) {

                // console.log("p1 ",val1);
                considered.push(j);
                temp = [];
                temp = [
                    [arr1[j], j]
                ];
                cyclesPar1[num_of_cycles] = temp;
                temp = [];
                temp = [
                    [arr2[j], j]
                ];
                cyclesPar2[num_of_cycles] = temp;
                num_of_cycles++;
                // console.log("----------------");
                continue;
            } else {
                temp = [], buffPar1 = [], buffPar2 = [];
                // console.log("p1 ",val1);
                considered.push(j);
                temp = [arr1[j], j];
                buffPar1.push(temp);


                while (val1 != val2) {
                    temp = [];
                    temp = [val2, arr2.indexOf(val2)];
                    buffPar2.push(temp);

                    var p = arr1.indexOf(val2);
                    val2 = arr2[p];

                    considered.push(p);
                    temp = [arr1[p], p];
                    buffPar1.push(temp);
                }
                temp = [];
                temp = [val2, arr2.indexOf(val2)];
                buffPar2.push(temp);
                cyclesPar1[num_of_cycles] = buffPar1;
                cyclesPar2[num_of_cycles] = buffPar2;

                num_of_cycles++;

                // console.log("----------------");

            }
        }
    }
    // console.log("cyclesPar1");
    // console.log(cyclesPar1);
    // console.log("cyclesPar2");
    // console.log(cyclesPar2);


    baby1 = new Array(arr1.length);
    baby2 = new Array(arr1.length);

    for (var k = 0; k < cyclesPar1.length; k++) {
        if (k % 2 === 0) { // use parent 1 characteristics
            for (var j = 0; j < cyclesPar1[k].length; j++) {
                // console.log("p1 ",cyclesPar1[k][j]);
                baby1[cyclesPar1[k][j][1]] = cyclesPar1[k][j][0];
            }
            // for(var j=0; j<cyclesPar2[k].length;j++){
            //     // console.log("p1 ",cyclesPar1[k][j]);
            //     baby2[cyclesPar2[k][j][1]] = cyclesPar2[k][j][0];
            // }
        } else { // use parent 2 characteristics
            for (var j = 0; j < cyclesPar2[k].length; j++) {
                // console.log("p2 ",cyclesPar2[k][j][0]);
                baby1[cyclesPar2[k][j][1]] = cyclesPar2[k][j][0];
            }
            // for(var j=0; j<cyclesPar1[k].length;j++){
            //     // console.log("p2 ",cyclesPar2[k][j][0]);
            //     baby2[cyclesPar1[k][j][1]] = cyclesPar1[k][j][0];
            // }
        }
    }
    recombination_offspring.push(baby1);
    // console.log("recomb 1", baby1); // works fine
    // console.log("recomb 2", baby2); // not working fine

}

//Generates requests-object-array from request-id-array
function request_array_from_order(reference_order_array, original_request_queue) {
    var n = reference_order_array.length;
    var m = original_request_queue.length;
    var tempRequestArray = new Array(n);

    //REVIEW: not sure but complexity can be less than O(m*n)
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
            if (original_request_queue[j].req_id === reference_order_array[i]) {
                tempRequestArray[i] = original_request_queue[j];
                break;
            }
        }
    }
    return tempRequestArray; //return array-of-objects (constructed from original req Q)
}



//Function to simulate swap mutation
function mutate_swap(parent_requestId_array) {
    console.log("Applying swap mutation\n");
    
    var n = parent_requestId_array.length;
    var pos1 = generate_random_number(n);
    var pos2 = generate_random_number(n);
    //REVIEW: check whether seeding is needed, else it might go in a random loop
    while (pos2 === pos1) { // to ensure unique num generation
        pos2 = generate_random_number(n);
    }

    // swap items at pos1 and pos2
    var temp_swap_var = swap(parent_requestId_array[pos1], parent_requestId_array[pos2]);
    parent_requestId_array[pos1] = temp_swap_var[0];
    parent_requestId_array[pos2] = temp_swap_var[1];
    console.log("after swapping index %d %d:\n", pos1, pos2);
    return parent_requestId_array;
}

//REVIEW: Give a sample request queue obj here in comments
// sample request object format (for reference)
// { 
//     req_type: "t1",  // request type: string
//     req_id: 1,       // request id: unique, integer currently
//     msg: 'for 1000', // optional message atttached with request, string
//     timeSt: JSON.stringify(new Date()) // timeStamp at which request was sent from client end (take off timestamp): string
// }

// Function to simulate inverse mutation
function mutate_inverse(parent_requestId_array) {

    //REVIEW: approach: generate two random numbers and reverse the "sub-array" bw the two positions, i don't think you are doing that
    //REVIEW_RESPONSE: did so, hadnt understood the purpose the last time

    var n = parent_requestId_array.length;
    var pos1 = generate_random_number(n);
    var pos2 = generate_random_number(n);
    while (pos2 === pos1) { // to ensure unique num generation
        pos2 = generate_random_number(n);
    }
    var l, r;
    if (pos1 > pos2) {
        l = pos2;
        r = pos1;
    } else {
        l = pos1;
        r = pos2;
    }
    console.log("Applying inverse mutation bw %d %d index\n", pos1, pos2);
    for (; l < r; l += 1, r -= 1) {
        var temporary = parent_requestId_array[l];
        parent_requestId_array[l] = parent_requestId_array[r];
        parent_requestId_array[r] = temporary;
    }

    return parent_requestId_array;
}

// randomise shuffle an array Object from index l to r inclusive
function shuffleArray(array, l, r) {
    for (var i = r; i >= l; i--) {
        var j = Math.floor(Math.random() * (r - l + 1)) + l;
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    // console.log(array);
    return array;
}
// test array for shuffle function
// var kay = [0,1,2,3,4,5,6];
// kay = shuffleArray(kay,2,4);
// console.log("kay: ",kay);

//Function to simulate scramble mutation
function mutate_scramble(parent_requestId_array) {
    var n = parent_requestId_array.length;

    //REVIEW: your approach takes O(n) while it should be done in O(1)
    //REVIEW: you are doing this random swapping n times , it should be : select 2 positions randomly, and shuffle the subarray bw those two positions
    //REVIEW: Shuffle function-> http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    //REVIEW_RESPONSE: resolved
    
    //Pick two positions randomly
    var pos1 = generate_random_number(n),
        pos2 = generate_random_number(n);
    while (pos2 === pos1) { // to ensure unique num generation
        pos2 = generate_random_number(n);
    }
    console.log("Applying scramble mutation bw %d %d index\n", pos1, pos2);
    if (pos1 < pos2) {
        parent_requestId_array = shuffleArray(parent_requestId_array, pos1, pos2);
    } else {
        parent_requestId_array = shuffleArray(parent_requestId_array, pos2, pos1);
    }

    return parent_requestId_array;
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
function fitness_value_fn(queue, printflag) { // expects an array of request-objects

    var time_spent = 0,
        fitness_val = 0;    // variable to store fitness value of the queue passed
    for (var j = 0; j < queue.length; j++) {
        // Request has been processed , now lets calculate the utility(fitness/happiness value of the waiting user)

        time_spent += processingTimeOfRequests;
        // in future, for different request processing times
        // if( queue[j].req_type === "t1"){
        //   time_spent += processingTimeOfRequests.t1;
        // } else{
        //   time_spent += processingTimeOfRequests.t2;
        // }
        
        if (queue[j].req_type === "t1") {   // if request is of type 1
            if (time_spent <= 50) {
                fitness_val += (-(90) / 50) * time_spent;
            } else {
                fitness_val += (-90);
            }
        }
        
        else {  //else if request is of type 2
            if (time_spent <= 60) {
                fitness_val += 0;

            } else if ((time_spent > 60 && time_spent <= 80)) {
                fitness_val += ((-9) / 2) * time_spent + 270;
            } else {
                fitness_val += (-90);
            }
        }
    }

    if (printflag === 1) {
        console.log("Fitness value for this individual : %d", fitness_val);
    }

    utility_results.push(fitness_val);
    return fitness_val;
}

//Function to generate a random number within an assigned limit
function generate_random_number(size) {
    return Math.floor(Math.random() * size);
}
// function to swap two variables
// to use:
// 1. var some_variable = swap(x,y);
// 2. update as x = some_variable[0], y = some_variable[1];
function swap(a, b) {
    return [b, a];
}

// variables declared for permute function, declared GLOBALLY as permute function is recursive.
var permArr = [], usedChars = [];
// function to find all possible permutations of an array, returns 2D array
function permute(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) { //   loop over all elements 
        ch = input.splice(i, 1)[0];      //1. pull out each element in turn
        usedChars.push(ch);              // push this element
        if (input.length == 0) {          //2. if input is empty, we pushed every element
            permArr.push(usedChars.slice()); // so add it as a permutation
        }
        permute(input);                   //3. compute the permutation of the smaller array
        input.splice(i, 0, ch);           //4. add the original element to the beginning 
                                          //   making input the same size as when we started
                                          //   but in a different order
        usedChars.pop();                 //5. remove the element we pushed
    }
    return permArr; //return, but this only matters in the last call
};
// REVIEW K: find a better permute function, that is not recursive (so no global var) and returns only unique permutaions
// REVIEW K: not a problem as of now since used only once (in brute force)

// test script for permute
// console.log(permute([1,2,3,4]));


io.sockets.on('connection', function(socket) {
    
    console.log('We have a new socket connection: ', socket.id);

    socket.on('job request', function(data) { // store all the requests from client with this socket id        
        requestQueue.push(data);    // requestQueue is array of request objects IN THE ORDER SERVER RECEIVED THEM
    });

    
    socket.on('sending done', function() { // after all requests have been queued by the client server (no more incoming), this event is fired to start the computations
        console.log('All queued');

        for (var i = 0; i < requestQueue.length; i++) {
            requestQueueReferenceOrder.push(requestQueue[i].req_id);
        }

        console.log('--------------------INITIAL POPULATION START--------------------');
        for (var i = 0; i < requestQueue.length; i++) {
            console.log('ID: ', requestQueue[i].req_id, ' Type: ', requestQueue[i].req_type);
            final_queue_processing_order.push(requestQueue[i]);
        }
        console.log('--------------------INITIAL POPULATION END--------------------\n');


        
        var arr = []; //Define array to be used in the generations
        for (i = 0; i < requestQueueReferenceOrder.length; i++) {
            arr.push(requestQueueReferenceOrder[i]);
        }

        ////////////////////////////////////////////// Brute force starts here //////////////////////////////////////////////
        console.log('--------------------BRUTE FORCE START--------------------');
        var bruteForceStart = process.hrtime(); // save the start time in a label
        queue__init_permutation = permute(arr); //2-D ARRAY THAT STORES ALL POSSIBLE PERMUATIONS OF REQUESTS QUEUE OBJECTS

        for (var i = 0; i < queue__init_permutation.length; i++) {
            // generate an array of corresponding request-objects to calculate fitness value
            var tempRequestArray = request_array_from_order(queue__init_permutation[i], requestQueue);
            // console.log("temp req arr: ",tempRequestArray);
            var temp_val_brute = fitness_value_fn(tempRequestArray, 0);
            if (temp_val_brute > brute_force_best_soln)
                brute_force_best_soln = temp_val_brute;
        }
        console.log("Best solution via brute force: ", brute_force_best_soln);
        var bruteForceEnd = process.hrtime(bruteForceStart);    // save the DIFFERENCE FROM THE START LABEL time in a label

        console.log('brute forcing took: %d ms', (1000 * bruteForceEnd[0]) + (bruteForceEnd[1] / 1000000));
        console.log('--------------------BRUTE FORCE END--------------------\n\n');
        ////////////////////////////////////////////// Brute force ends here //////////////////////////////////////////////



        ////////////////////////////////////////////// ec approach starts here //////////////////////////////////////////////
        var ecStart = process.hrtime();

        var maximum_utility = MINUS_INFINITY; // global comparator for all offsprings in ec approach

        //Clear the initial values in the utility
        // REVIEW K: sort out the scope of currently global utilitty_results variable to save space and TIME ON DOIN THE POPS BELOW
        while (utility_results.length) {
            utility_results.pop();
        }
        var termination_count = 0,
            termination_comparator = maximum_utility; // termination_comparator never used

        for (var gen = 0; gen < NUMBER_OF_GENERATIONS; ++gen) {
            var flag = 0; //For useless generation criteria
            var temp_mutation_iterator = 0;

            console.log("------------------------- GENERATION NUMBER %d------------------------", gen);

            var offsprings = []; // temp array to store offsprings of each Generation, created locally to avoid emptying it every time
            
            console.log("arr: ", arr);
            console.log("offsprings at gen start: ", offsprings);
            
            //////// Swap mutation for this generation starts ////////
            arr = mutate_swap(arr);

            //Printing the parent after the swap mutation
            for (i = 0; i < arr.length; ++i) {
                //REVIEW: i think there should be one more %d
                //REVIEW_RESPONSE: request type is string, so nope.
                console.log("%d ", arr[i]);

            }
            console.log("----------------\n");
            //Saving the new mutated offspring
            // console.log('logging reqQueue: ',requestQueue);

            // console.log("before: ",offsprings);
            offsprings.push(arr.slice(0)); // didnt work
            // console.log("after: ",offsprings);
            temp_mutation_iterator++;
            //////// Swap mutation for this generation ends ////////

            //////// Scramble mutation for this generation starts ////////
            arr = mutate_scramble(arr);
            //REVIEW: i think the comment below should be "scramble"
            //REVIEW_RESPONSE: resolved
            //Printing the mutant after the scramble mutation
            for (i = 0; i < arr.length; ++i) {
                //REVIEW: i think there should be one more %d
                //REVIEW_REPLY: i kept req_type attribute of a request object is STRING
                console.log("%d  ", arr[i]);
            }
            console.log("\n");
            //Saving the new mutated offspring
            // console.log("before: ",offsprings);
            offsprings.push(arr.slice(0));
            // console.log("after: ",offsprings);

            temp_mutation_iterator++;
            //////// Scramble mutation for this generation ends ////////

            //////// Inverse mutation for this generation starts ////////
            arr = mutate_inverse(arr);

            //REVIEW: i think the comment below should be "inverse"
            //REVIEW_REPLY: resolved
            //Printing the mutant after the inverse mutation
            for (i = 0; i < arr.length; ++i) {
                console.log("%d ", arr[i]);
            }
            console.log("\n");


            //Saving the new mutated offspring
            // console.log("before: ",offsprings);
            offsprings.push(arr.slice(0));
            // console.log("after: ",offsprings);

            temp_mutation_iterator++;

            //////// Inverse mutation for this generation ends ////////
            console.log("offsprings at gen end: ", offsprings);

            var best_offspring, other_offspring; // store index no. in offsprings[] for this generation
            //SURVIVOR SELECTION
            for (var k = 0; k < offsprings.length; k++) {

                //Selecting the best out of mutants
                //Set initial utlity as the utility of parent
               
                var this_offspring_req_queue = request_array_from_order(offsprings[k], requestQueue);
                var this_generation_utility = fitness_value_fn(this_offspring_req_queue, 1);
                console.log('this gen ', this_generation_utility, ' max ', maximum_utility);

                if (this_generation_utility > maximum_utility) {
                    flag = 1;
                    best_offspring = k;
                    maximum_utility = this_generation_utility;
                    // empty final_queue_processing_order
                    while (final_queue_processing_order.length) {
                        final_queue_processing_order.pop();
                    }
                    
                    final_queue_processing_order.push(offsprings[k].slice(0));
                    
                }

            }
            //Select the second survivor(parent)
            //ss REVIEW K: why random, why not second best?
            other_offspring = best_offspring;
            do {
                other_offspring = generate_random_number(offsprings.length - 1);

            } while (other_offspring == best_offspring);

            console.log("First parent selected %d ,second parent selected = %d\n", best_offspring, other_offspring);
            //Do recombination here
            recombination_cycle_crossover(offsprings[best_offspring], offsprings[other_offspring]);
            console.log("baby is: ", recombination_offspring);
            

            var recombination_offspring_req_object_queue = request_array_from_order(recombination_offspring[0], requestQueue);
            var recombination_offspring_utility = fitness_value_fn(recombination_offspring_req_object_queue, 1);

            console.log("Fitness value from recombination offspring: %d\n", recombination_offspring_utility);
            // whether the results due to recombinations are better than the current best result
            if (recombination_offspring_utility > maximum_utility) {
                maximum_utility = recombination_offspring_utility;

                while (final_queue_processing_order.length) {
                    final_queue_processing_order.pop();
                }
                final_queue_processing_order.push(recombination_offspring[0]);
            }

            //Print the fitness values for this generation
            console.log("List of fitness values for this generation: \n");
            console.log("utility results: ", utility_results);


            for (var i = 0; i < utility_results.length; ++i) {
                // process.stdout.write used to print in a single line, couldn't find another fn
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
            // empty utility_results
            while (utility_results.length) {
                utility_results.pop();
            }
        }

        //FINAL RESULTS
        console.log("\n---------------------FINAL RESULT:----------------------- \n");
        console.log("Maximum fitness value : %d\n", maximum_utility);
        console.log("Final permutation:");
        for (i = 0; i < final_queue_processing_order.length; ++i) {
            console.log(' ', final_queue_processing_order[i]);
        }

        var ecEnd = process.hrtime(ecStart);
        console.log('ec approach took: %d ms', (1000 * ecEnd[0]) + (ecEnd[1] / 1000000));
        ////////////////////////////////////////////// ec approach ends here  //////////////////////////////////////////////

        // trigger event to tell client server to display the visualisation
        socket.emit('display results', 'hehehe zola');
    });

    socket.on('disconnect', function() {
        console.log('A client disconnected: ', socket.id);
    });



});

console.log('The main server is up.');