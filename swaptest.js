var a = 10;
var b = 99;

function swap(x,y){
	return [y,x];
}

console.log("BEFORE: a :", a, " b:", b);

var after_swap_a_b = swap(a,b);
a = after_swap_a_b[0];
b = after_swap_a_b[1];

console.log("AFTER: a :", a, " b:", b);