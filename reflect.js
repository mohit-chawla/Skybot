
function myfun(arr){
	arr[1] = 6;
	// return arr
}

function myfun2(){
	var a = [1,2,3,4,5];
	b = myfun(a);
	console.log(b);
}

myfun2();