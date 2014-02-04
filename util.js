
/** A labelled circle */
function Circle(id,label,r,x,y) {
	this.id = id;
	this.label = label;
	this.r = r;
	this.x = x;
	this.y = y;
	newCircle = false;
	moved = false;
	svg = null;
	labelSvg = null;
	intersections = []; //list of circles this one intersects with
}


function Rectangle(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.label = "";
}

function Point(x,y) {
	this.x = x;
	this.y = y;
}


function Node(id, label,region, regionText){
	this.id = id;
	this.label = label;
	x = 0.0;
	y = 0.0;
	this.region = region; //rectangle
	this.regionText = regionText;
	horizontal = 0;
	vertical = 0;
}

function Edge(source, target, size){
	this.source = source;
	this.target = target;
	this.size = size;
}


function Time(time){
	this.time = time;
	this.interactions = [];
}

function Interaction(start, end, size){
	this.start = start;
	this.end = end;
	this.size = size;
}


function removeDuplicates(arr) {
	var result = [];
	$.each(arr, function(i, el){
    	if($.inArray(el, result) === -1) result.push(el);
	});
	return result;
}

/*
Finds a circle given a label
 */
function findCircleLabel(label){
	for (var i = 0; i < circles.length; i++){
		if (label == circles[i].label){
			return circles[i];
		}
	}
	return null;
}

/*
Finds a circle given a id
 */
function findCircleId(id){
	for (var i = 0; i < circles.length; i++){
		if (id == circles[i].id){
			return circles[i];
		}
	}
	return null;
}

/*
Finds all circles given a id
 */
function findAllCirclesId(id){
	var output = [];
	for (var i = 0; i < circles.length; i++){
		if (id == circles[i].id){
			output.push(circles[i]);
		}
	}
	return output;
}

/*
Finds all circles given a id
 */
function findAllCirclesId(id, list){
	var output = [];
	for (var i = 0; i < list.length; i++){
		if (id == list[i].id){
			output.push(list[i]);
		}
	}
	return output;
}

/*
Finds all circles given a label
 */
function findAllCirclesLabel(label, list){
	var output = [];
	for (var i = 0; i < list.length; i++){
		if (label == list[i].label){
			output.push(list[i]);
		}
	}
	return output;
}

/*
Finds a circle with a given ID that hasn't moved
 */
function findCircleIdHaventMoved(id, list){
	for (var i = 0; i < circles.length; i++){
		if (id == circles[i].id && !circles[i].moved){
			return circles[i];
		}
	}
}


/*
Finds a rectangle given a label
*/
function findRectangleFromLabel(label, rectangles){

	for (var i = 0; i < rectangles.length; i++){
		if (label.trim() == rectangles[i].label.trim()){
			return rectangles[i];
		}
	}
}

/*
Finds all rectangles given a label
*/
function findAllRectanglesFromLabel(label, rectangles){
	var output = [];
	for (var i = 0; i < rectangles.length; i++){
		if (label.trim() == rectangles[i].label.trim()){
			output.push(rectangles[i]);
		}
	}
	return output;
}

/*
Finds a node given a label
*/
function findNode(label, nodes){
	for (var i = 0; i < nodes.length; i++){
		//console.log(nodes[i].label,label, nodes[i].label == label);
		if (nodes[i].label == label) {
			return nodes[i];
		}
	} 
	return null;
}

function stringCompare(s1, s2){
	console.log(s1.length,s2.length, s1.charAt(1));
	if (s1.length != s2.length){
		return false;
	}
	for (var i = 0; i < s1.length; i++){
		//console.log(s1.charAt(i),s2.charAt(i));
		if (s1.charAt(i) != s2.charAt(i)){
			return false;
		}
	}
	return true;

}

// Generates a hash for creating unqiue circle or node IDs
//not used
function generateHash(s){
	return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

/*
* Finds if two circles intersect
*/
function twoCirclesIntersect(c1, c2){
	var distance = Math.sqrt( Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y,2) );
	//console.log("comparing", c1, c2, c1.r, c2.r, distance, distance <= c1.r + c2.r);
	return (distance <= c1.r + c2.r);
}

/**
Removes from arr1 every element in arr2
*/
function removeAll(arr1, arr2){
	var result = [];
	for (var i = 0; i < arr1.length; i++){
		var index = arr2.indexOf(arr1[i]);

		//if this element isn't in arr2, then add it to result
		if (index == -1) {
			result.push(arr1[i]);
		}
	}
	return result;

}

function findColor(i) {

        // colorbrewer qualitative option for 12 sets, rearranged order
        var colorbrewerArray = ['rgb(31,120,180)','rgb(51,160,44)','rgb(255,127,0)','rgb(106,61,154)','rgb(177,89,40)',
        	'rgb(227,26,28)','rgb(166,206,227)','rgb(253,191,111)','rgb(178,223,138)','rgb(251,154,153)','rgb(202,178,214)','rgb(255,255,153)']

        if(i < colorbrewerArray.length) {
                return colorbrewerArray[i];
        }

        var nextColor = i-colorbrewerArray.length;
        var predefinedNameArray = ["blue", "magenta", "cyan", "orange",
			"black", "green", "gray", "yellow", "pink", "purple", "red", "brown",
			"teal", "aqua"];

        if(nextColor < predefinedNameArray.length) {
                return predefinedNameArray[nextColor];
        }

        return get_random_color();
}

function get_random_color() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}

/*
* Performs a logical exclsuive OR
*/
function XOR(a, b){
        return ( a || b ) && !( a && b );
}

/**
 * Checks that two circles intersect
 * @param  {Circle} c1 First circle
 * @param  {Circle} c2 Second circle
 * @return {boolean}    If the two circles intersect
 */
function checkCirclesIntersect(c1, c2) {
	var d = Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
	var r = c1.r + c2.r;
	var padding = 10;

	return d > r + padding;

}


function buildIntersections() {
	for (var i = 0; i < circles.length; i++) {
		circles[i].intersections = [];
		for (var j = 0; j < circles.length; j++) {
			if (i == j) {
				continue;
			}
			//if the two circles intersect
			if (checkCirclesIntersect(circles[i], circles[j])) {
				console.log(circles[i], circles[i].intersections);
				circles[i].intersections.push(circles[j]);
			}
		}
	}
}


/**
 * Returns that the structure of the Euler diagram is still valid
 * @return {boolean} True if the structure is still valid. Returns false if not, with error message
 */
function structureChecker() {

	for (var i = 0; i < circles.length; i++) {
		//for each circle
		var c1 = circles[i];
		for (var j = 0; j < circles.length; j++) {
			//for every other circle
			var c2 = circles[j];

			if (i == j) {
				continue;
			}

			var shouldIntersect = c1.intersections.indexOf(c2) != -1; //should the circles intersect?
			var doesIntersect = checkCirclesIntersect(c1, c2); //do the circles intersect?

			if (XOR(shouldIntersect, doesIntersect)) { //if there is a discrepency
				//print a message to the user
				if (!shouldIntersect) {
					console.log("Circles should intersect, but don't", c1, c2);
				} else {
					console.log("Circles shouldn't intersect, but do", c1, c2);
				}
				return false;
			}
		}
	}
	return true;
}


/**
*	Prints out the intersections for each circle
*/
function printStructures() {
	for (var i = 0; i < circles.length; i++) {
		console.log("Circle: ", circles[i].id, circles[i].label, circles[i].intersections);
	}
}
        