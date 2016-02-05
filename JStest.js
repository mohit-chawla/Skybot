
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

var arr1 = [0,1,2,4,8,3,7,6,5,9], arr2=[0,9,2,6,7,3,8,1,4,5], cyclesPar1 =[],cyclesPar2 =[];
function recombination_cycle_crossover(arr1,arr2){
		var placed_count =0, j=0;
		var n = arr1.length, considered=[], buffPar1=[],buffPar2=[], num_of_cycles=0, temp=[];
	var crossover_child = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
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

	console.log("recomb 1", baby1);
	console.log("recomb 2", baby2);

}

recombination_cycle_crossover(arr1,arr2);
