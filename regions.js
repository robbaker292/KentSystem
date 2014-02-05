var circles = [];
var nodes = [];
var edges = [];
var zones = [];
var multiplier = 3;
var c = 20;
var t = 200;
var k;
var rectangles;
var currentTime = 0;
var eulerText = "";
var width = 800;
var height = 600;
var circleEnum = { TOPOLOGY: 1, ADD : 2, REMOVE : 3};
var circleType = circleEnum.TOPOLOGY;
var interval; //holds force tick


var svg;
var times = [];

var conn = new WebSocket('ws://localhost:8081');
//var conn = new WebSocket('ws://cs.kent.ac.uk/~rb440/:8081');
conn.onopen = function(e) {
    console.log("Connection established!");
};

conn.onmessage = function(e) {
	if (circleType == circleEnum.TOPOLOGY){
		parseCircles(e.data);
	} else if (circleType == circleEnum.ADD) {
		parseAddSGroupResponse(e.data);
	}
    
};


function next(){
	iterateGraph(nodes, edges);
}

function startForce(){
	interval = setInterval(
		function() {
			next();
			console.log("force tick");
		}
	,500);
}

function stopForce() {
	clearInterval(interval);
}


/*
function animate(){
	var m = 0;
	var changeValue = 100;
	$("#time").html(times[currentTime].time+" ms");
	var interval = setInterval(
		function() {
			m++;
			//console.log("m", m, "currentTime", currentTime);
			if (m % changeValue == changeValue-1) {
				currentTime++;
				$("#time").html(times[currentTime].time+" ms");
				if (currentTime == times.length){
					window.clearInterval(interval);
					console.log("done");
					return;
				}
				drawEdges(times[currentTime].interactions);
			}
			next();
		}
	,10);
}*/

function applyForceModel(){

}



function parseCircles(input){

	console.log(input);

	//error checking
	if (input == "") {
		console.log("NO TOPOLOGY RETURNED FROM iCircles");
		return;
	}

	
	var circleFile = input.split("\n");
	//use 1 as first row of input are labels
	for (var i = 1; i < circleFile.length-1; i++){
		var result = circleFile[i].split(",");
		//console.log(result);

		var c = findCircleId(result[0].trim());
		console.log(c);
		if (c.newCircle){
			c.r = parseInt(result[3]);
			c.x = parseInt(result[1]);
			c.y = parseInt(result[2]);
			c.newCircle = false;
		}
		else {
			console.log("duplicate needed");

			var c2 = new Circle(result[0].trim(), c.label, parseInt(result[3]), parseInt(result[1]), parseInt(result[2]));
			c2.intersections = [];
			c2.newCircle = false;
			circles.push(c2);

		}

		
		//var c = new Circle(result[0].trim(), , parseInt(result[1]), parseInt(result[2]));
		//circles.push(c);	
	}

	console.log(circles);

	zones = eulerText.split(" ");
	zones.pop();
	console.log(zones);
	zones = removeDuplicates(zones);
	console.log(zones);

	rectangles = findZoneRectangles(zones, circles);

	for (var i = 0; i < nodes.length; i++) {
		var n = nodes[i];
		n.region = findRectangleFromLabel(n.regionText, rectangles);
	}

	drawGraph(nodes, null, rectangles, circles);

}


/**
function parseCsvTopology(input) {

	$("#topInput").hide();
	$("#topBtn").hide();

	var dataArray = $.csv.toArrays(input);

	for (var i = 1; i < dataArray.length; i++) {
		var entry = dataArray[i];

		console.log(entry[0], entry[1]);
		var regionText = "";

		var groups = entry[2].split("|");
		for (var j = 0; j < groups.length; j++) {
			//console.log(groups[j]);

			var circle = findCircleLabel(groups[j]);
			if (circle == null) {
				var id = String.fromCharCode(circles.length + 65);
				circle = new Circle(id, groups[j], -1, -1, -1);
				circle.intersections = [];
				regionText += id;
				circles.push(circle);
			} else {
				var id = circle.id;
				regionText += id;
			}
			circle.newCircle = true;
			console.log(groups[j], circle);
			
		}

		var n = new Node(entry[0], entry[1], null, regionText);
		console.log(regionText);
		nodes.push(n);

	}
//
	console.log(nodes, circles);

	eulerText = "";
	for (var i = 0; i < nodes.length; i++){
		eulerText = eulerText + nodes[i].regionText + " ";
	}

	console.log(eulerText);

	conn.send(eulerText);

}
*/

function parseKentEdges(input) {

	$("#edgeInput").hide();
	$("#edgeBtn").hide();

	var dataArray = $.csv.toArrays(input);
	for (var i = 1; i < dataArray.length; i++) {
		var entry = dataArray[i];

		var source = findNodeId(entry[0], nodes);
		var target = findNodeId(entry[1], nodes);

		if (source == null || target == null){
			continue;
		}

		var edge = new Edge(source, target, 1);


		edges.push(edge);
	}

	drawEdges(edges);

}

function parseCsvTopology(input) {

	$("#topInput").hide();
	$("#topBtn").hide();

	var groupArray = input.split("\n");

	for (var i = 0; i < groupArray.length-1; i++) {
		var group = groupArray[i];
		console.log(group);		

		var nodeData = group.split("	");

		var id = String.fromCharCode(circles.length + 65);
		circle = new Circle(id, nodeData[0], -1, -1, -1);
		circle.newCircle = true;
		circles.push(circle);

		for (var j = 1; j < nodeData.length; j++) {
			var nodeId = nodeData[j];
			console.log(nodeId);

			var node = findNodeId(nodeId, nodes);

			if (node == null) {
				//new node
				node = new Node(nodeId, nodeId, null, id);
				nodes.push(node);
			} else {
				//update membership of node
				node.regionText += id;
			}			

		}

	}
	console.log(circles, nodes);

	eulerText = "";
	for (var i = 0; i < nodes.length; i++){
		eulerText = eulerText + nodes[i].regionText + " ";
	}

	console.log(eulerText);

	conn.send(eulerText);

}