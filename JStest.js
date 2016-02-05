
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

	// while(placed_count < n){
	for(var j=0; j<n;j++){	
		// console.log("USING ",j);
		if( considered.indexOf(j)==-1 ){
			val1 = arr1[j];
			val2 = arr2[j];
			
			
			if(val1 === val2){

				console.log("p1 ",val1);
				considered.push(j);
				temp=[];
				temp = [arr1[j],j];
				// cyclesPar1.push(temp);
				cyclesPar1[num_of_cycles]=temp;
				temp=[];
				temp = [arr2[j],j];
				cyclesPar2[num_of_cycles]=temp;
				num_of_cycles++;
				console.log("----------------");
				continue;
			}
			else{
				temp=[],buffPar1 = [],buffPar2=[];
				console.log("p1 ",val1);
				considered.push(j);
				temp = [arr1[j],j];
				buffPar1.push(temp);

				
				while(val1 != val2){
					console.log("p2 ",val2);

					temp=[];
					temp = [val2,arr2.indexOf(val2)];
					buffPar2.push(temp);

					// cyclesPar2[num_of_cycles]=buff;
					var p = arr1.indexOf(val2);
					 val2 = arr2[p];

					considered.push(p);
					temp = [arr1[p],p];
					buffPar1.push(temp);
				}
				// cycles.push(buffPar1);

				temp=[];
				temp = [val2,arr2.indexOf(val2)];
				buffPar2.push(temp);
				cyclesPar1[num_of_cycles]=buffPar1;
				cyclesPar2[num_of_cycles]=buffPar2;
				
				num_of_cycles++;

			console.log("----------------");
			
			}
		}
	}
			// console.log(cyclesPar1);
			// console.log(cyclesPar2);
}

recombination_cycle_crossover(arr1,arr2);
console.log(cyclesPar1[1][1][1]);
console.log(cyclesPar2);


baby = new Array(arr1.length);

for(var k =0; k<arr1.length;k++){
	if(k%2===0){ // use parent 1 characters
		for(j=0; j<cyclesPar1[k].length;j++){
			baby[cyclesPar1[k][j][1]] = cyclesPar1[k][j][0];
		}
	}
	else{ // use parent 2 characters
		console.log("par 2 k: ", k);
		for(j=0; j<cyclesPar2[k].length;j++){
			baby[cyclesPar2[k][j][1]] = cyclesPar2[k][j][0];
		}
	}
}

console.log(baby);
	// c=0;
	 
	// 	for(i=1;i<=n;i++){
	 
	// 		if(hashe[i]!=-1){
	// 			c++;
	//             j=a[i];
	// 			while(i!=j){
	// 				hashe[j]=-1;
	// 				j=a[j];
	// 			}
	//            hashe[i]=-1;
	           
	// 		}


	// while(placed_count < n)
	// {
	// 	var flag=0;
	// 	for(var i=0;i<n;i++){
	// 		if(arr2[arr1[j]]==crossover_child[i])
	// 			flag=1;
	// 	}
	// 	if(flag==0){
	// 		crossover_child[j]=arr2[arr1[j]];
	// 		placed_count++;
	// 		j = arr2[j];
				
	// 	}
	// 	else{
	// 		//This means a cycle is completed
	// 		for(var i=0;i<n;i++)
	// 			//Find a new cycle
	// 			if(crossover_child[i]==-1)
	// 				j = i;	
	// 	}
	// 	// printf("j is %d, pc %d\n",j,placed_count );
	// }