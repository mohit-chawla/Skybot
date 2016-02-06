
// var a = 10;
// var b = 99;
// var obj = {};
// function swap(x,y){
// 	obj.xp = y;
// 	obj.yp = x;
// 	return obj;
// }

// console.log("BEFORE: a :", a, " b:", b);
// var o = {};
// o = swap(a,b);
// a = o.xp;
// b = o.yp;

// console.log("AFTER: a :", a, " b:", b);

// var arr1 = [0,1,2,4,8,3,7,6,5,9], arr2=[0,9,2,6,7,3,8,1,4,5], cyclesPar1 =[],cyclesPar2 =[];
var arr1 = [5,2,1,3,4,6], arr2=[4,1,2,3,6,5], cyclesPar1 =[],cyclesPar2 =[];
var buffPar1 = [],buffPar2=[], considered=[], num_of_cycles=0, temp=[], crossover_child=[];
function recombination_cycle_crossover(arr1,arr2){
		var placed_count =0, j=0;
		var n = arr1.length, considered=[], buffPar1=[],buffPar2=[], num_of_cycles=0, temp=[];
	// var crossover_child = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
	//Execute the cycle crossover till all are handled

	for(var j=0; j<n;j++){	
		if( considered.indexOf(j)==-1 ){
			val1 = arr1[j];
			val2 = arr2[j];
			
			
			if(val1 === val2){

				// console.log("p1 ",val1);
				considered.push(j);
				temp=[];
				temp = [[arr1[j],j]];
				cyclesPar1[num_of_cycles]=temp;
				temp=[];
				temp = [arr2[j],j];
				cyclesPar2[num_of_cycles]=temp;
				num_of_cycles++;
				// console.log("----------------");
				continue;
			}
			else{
				temp=[],buffPar1 = [],buffPar2=[];
				// console.log("p1 ",val1);
				considered.push(j);
				temp = [arr1[j],j];
				buffPar1.push(temp);

				
				while(val1 != val2){
					// console.log("p2 ",val2);

					temp=[];
					temp = [val2,arr2.indexOf(val2)];
					buffPar2.push(temp);

					var p = arr1.indexOf(val2);
					 val2 = arr2[p];

					considered.push(p);
					temp = [arr1[p],p];
					buffPar1.push(temp);
				}

				temp=[];
				temp = [val2,arr2.indexOf(val2)];
				buffPar2.push(temp);
				cyclesPar1[num_of_cycles]=buffPar1;
				cyclesPar2[num_of_cycles]=buffPar2;
				
				num_of_cycles++;

			// console.log("----------------");
			
			}
		}
	}
	console.log(cyclesPar1);
	console.log(cyclesPar2);


	baby1 = new Array(arr1.length);
	baby2 = new Array(arr1.length);

	for(var k =0; k<cyclesPar1.length;k++){
		if(k%2===0){ // use parent 1 characteristics
			for(var j=0; j<cyclesPar1[k].length;j++){
				// console.log("p1 ",cyclesPar1[k][j]);
				baby1[cyclesPar1[k][j][1]] = cyclesPar1[k][j][0];
			}
			for(var j=0; j<cyclesPar2[k].length;j++){
				// console.log("p1 ",cyclesPar1[k][j]);
				baby2[cyclesPar2[k][j][1]] = cyclesPar2[k][j][0];
			}
		}
		else{ // use parent 2 characteristics
			for(var j=0; j<cyclesPar2[k].length;j++){
				// console.log("p2 ",cyclesPar2[k][j][0]);
				baby1[cyclesPar2[k][j][1]] = cyclesPar2[k][j][0];
			}
			for(var j=0; j<cyclesPar1[k].length;j++){
				// console.log("p2 ",cyclesPar2[k][j][0]);
				baby2[cyclesPar1[k][j][1]] = cyclesPar1[k][j][0];
			}
		}
	}
	crossover_child.push(baby1);
	// console.log("recomb 1", baby1); // works fine
	// console.log("recomb 2", baby2); // not working fine

}

recombination_cycle_crossover(arr1,arr2);
console.log("baby is: ", crossover_child);


// var requestQueue= [ { req_type: 1,
//     req_id: 1,
//     msg: 'for 1000',
//     timeSt: '"2016-02-06T06:19:45.144Z"' },
//   { req_type: 2,
//     req_id: 2,
//     msg: 'for 90000',
//     timeSt: '"2016-02-06T06:19:45.144Z"' },
//   { req_type: 2,
//     req_id: 3,
//     msg: 'for 90000',
//     timeSt: '"2016-02-06T06:19:45.145Z"' },
//   { req_type: 1,
//     req_id: 4,
//     msg: 'for 1000',
//     timeSt: '"2016-02-06T06:19:45.145Z"' },
//   { req_type: 1,
//     req_id: 5,
//     msg: 'for 1000',
//     timeSt: '"2016-02-06T06:19:45.145Z"' },
//   { req_type: 2,
//     req_id: 6,
//     msg: 'for 90000',
//     timeSt: '"2016-02-06T06:19:45.145Z"' } ];

//   //   var parent1= [ { req_type: 1,
//   //   req_id: 1},
//   // { req_type: 2,
//   //   req_id: 2},
//   // { req_type: 2,
//   //   req_id: 3},
//   // { req_type: 1,
//   //   req_id: 4},
//   // { req_type: 1,
//   //   req_id: 5},
//   // { req_type: 2,
//   //   req_id: 6 } ];

//     var parent1= [   { req_type: 1,
//     req_id: 4},
//     { req_type: 1,
//     req_id: 1},
//   { req_type: 2,
//     req_id: 2},
//   { req_type: 2,
//     req_id: 3},
//   { req_type: 2,
//     req_id: 6 },
//   { req_type: 1,
//     req_id: 5} ];

//     var parent2= [ { req_type: 1,
//     req_id: 5 },
//   { req_type: 2,
//     req_id: 2 },
//     { req_type: 1,
//     req_id: 1 },
//   { req_type: 2,
//     req_id: 3 },
//   { req_type: 1,
//     req_id: 4 },
//   { req_type: 2,
//     req_id: 6 } ];

//     // console.log(parent1);
//     // console.log(parent2);
//     cyclesPar1 =[],cyclesPar2 =[];
//     function index_of_reqid_in(req_id_val, array_to_check){
//     	for(var i=0;i<array_to_check.length;i++){
//     		if(array_to_check[i].req_id === req_id_val){
//     			return i;
//     		}
//     	}
//     	return -1;
    // }
   //  function recombination_cycle_crossover(arr1,arr2){
   //  	var n = arr1.length;
   //  	for(var j=0; j<n;j++){
   //  		if( considered.indexOf(arr1[j].req_id)==-1 ){
   //  			// val1 = arr1[j].req_id;
   //  			// val2 = arr2[j].req_id;

   //  			if(arr1[j].req_id === arr2[j].req_id){
   //  				considered.push(arr1[j].req_id);
   //  				temp=[];
   //  				temp = [[arr1[j],j]];
   //  				cyclesPar1[num_of_cycles]=temp;
   //  				console.log("p1 ",temp);
   //  				temp=[];
   //  				temp = [[arr2[j],j]];
   //  				cyclesPar2[num_of_cycles]=temp;
   //  				console.log("p2 ",temp);

   //  				num_of_cycles++;
   //  				continue;
   //  			}

   //  			else{
   //  				while(buffPar1.length){
   //  					buffPar1.pop();
   //  				}
   //  				while(buffPar2.length){
   //  					buffPar2.pop();
   //  				}
   //  				// console.log('arr1: ',arr1[j]);
   //  				temp = [];
   //  				temp = [arr1[j], j];
   //  				// console.log('par 1: ', temp);
   //  				buffPar1.push(temp);
    				

   //  				// console.log('arr2: ',arr2[j]);
   //  				temp = [];
   //  				temp = [arr2[j], j];
   //  				// console.log('par 2: ', temp);
   //  				buffPar2.push(temp);
    				
   //  				considered.push(arr1[j].req_id);

   //  				var p = j;
   //  				p = index_of_reqid_in(arr2[j].req_id, arr1);
   //  				// while(arr2[p].req_id != arr1[j].req_id){
   //  				while(j!=index_of_reqid_in(arr2[p].req_id, arr1)){

	  //   				temp = [];
	  //   				temp = [arr1[p], p];
	  //   				// console.log('par 1: ', temp);
	  //   				buffPar1.push(temp);
	    				

	  //   				temp = [];
	  //   				temp = [arr2[p], p];
	  //   				// console.log('par 2: ', temp);
	  //   				buffPar2.push(temp);

	  //   				considered.push(arr1[p].req_id);

	  //   				p = index_of_reqid_in(arr2[p].req_id, arr1);

   //  				}
   //  				temp = [];
   //  				temp = [arr1[p], p];
   //  				// console.log('par 1: ', temp);
   //  				buffPar1.push(temp);
    				

   //  				temp = [];
   //  				temp = [arr2[p], p];
   //  				// console.log('par 2: ', temp);
   //  				buffPar2.push(temp);
   //  				considered.push(arr1[p].req_id);
   //  				// console.log(considered);
			// 		// console.log("-----------------------");
   //  			}
   //  			// console.log('buff1: ',buffPar1);	// fine
   //  			// console.log('buff2: ',buffPar2);	// fine

   //  			cyclesPar1[num_of_cycles]=buffPar1;
   //  			cyclesPar2[num_of_cycles]=buffPar2;
   //  			console.log("parent1: ",cyclesPar1);
   //  			console.log("parent2: ",cyclesPar2);
   //  			num_of_cycles++;
   //  		}
   //  	}
    	
   // //  	for(var j =0; j<num_of_cycles;j++){
			// // console.log("--------  i:%d ----------", j);
   // //  		console.log("cycle in par1  ", cyclesPar1[j]);
   // //  		// console.log("cycle in par2  ", cyclesPar2[j]);    		
			// // console.log("-----------------------");
   // //  	}
   //  	// console.log("cycles in par1  ", cyclesPar1);
   //  	// console.log("cycles in par2  ", cyclesPar2);


   //  	baby1 = new Array(arr1.length);
   //  	// baby2 = new Array(arr1.length);
   //  	for(var k =0; k<num_of_cycles;k++){
   //  		if(k%2===0){ // use parent 1 characteristics
   //  			// console.log('par1 len ',cyclesPar1[k].length);
   //  			for(var j=0; j<cyclesPar1[k].length;j++){
   //  				baby1[cyclesPar1[k][j][1]] = cyclesPar1[k][j][0];
   //  			}
   //  		}
   //  		else{ // use parent 2 characteristics
   //  			// console.log('par2 len ',cyclesPar2[k].length);
   //  			for(var j=0; j<cyclesPar2[k].length;j++){
   //  				baby1[cyclesPar2[k][j][1]] = cyclesPar2[k][j][0];
   //  			}
   //  		}
   //  	}
   //  	console.log("baby: ", baby1);
   //  }

    // recombination_cycle_crossover(parent1,parent2);