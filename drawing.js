var svg;
var duration = 1000;

function drawGraph(nodes, edges, rectangles, circles){
	$("#highLevel").show();

	console.log(nodes, edges, rectangles, circles);

	svg = d3.select("#highLevel").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("version", 1.1)
	    .attr("id","highLevelSvg")
	    .attr("xmlns", "http://www.w3.org/2000/svg");

	svg.append("text")
		.attr("id", "time")
		.attr("x", 10)
		.attr("y", 20)
		.attr("width", 50)
		.attr("height", 20);



	svg.append("g");
	for (var i = 0; i < circles.length; i++) {
		circle = circles[i];
		console.log(circle.id, circle.label, circle);

		svg.select("g")
			.append("circle")
			.attr("r", function(){
				circle.r = circle.r * multiplier;
				return circle.r
			})
			.attr("cx",function(){
				circle.x = circle.x * multiplier;
				return circle.x
			})
			.attr("cy",function(){
				circle.y = circle.y * multiplier;
				return circle.y
			})
			.attr("class","euler")
			.attr("id", function(d){
				circle.svg = d3.select(this);
				return "circle"+circle.id;
			})
			.attr("style", function(d) {
				var color = findColor(circle.id.charCodeAt(0)-65);
				var output = "fill: " + color + ";";
				//console.log(output);
				return output;
			})
			.style("fill-opacity", "0.3");

		//console.log(circle.svg.attr("cx"));
	}
	for (var i = 0; i < circles.length; i++) {

		circle = circles[i];
		//draw circles again to show borders on top
		svg.select("g")
			.append("circle")
			.attr("r", function(){
				//circle.borderSvg = d3.select(this);

				//circle.r = circle.r;
				return circle.r
			})
			.attr("cx",function(){
				//circle.x = circle.x;
				return circle.x
			})
			.attr("cy",function(){
				//circle.y = circle.y;
				return circle.y
			})
			.attr("class","euler")
			.attr("class","border")
			.attr("id", function(d){
				circle.borderSvg = d3.select(this);
				return "circleBorder"+circle.id;
			})
			.attr("style", function(d) {
				var color = findColor(circle.id.charCodeAt(0)-65);
				var output = "fill: none; stroke: " + color + ";";
				console.log(output);
				return output; 
			})
			.style("stroke-width", "5px");

		svg.select("g")
			.append("text")
			.text(function(){
				circle.labelSvg = d3.select(this);
				return circle.label;
			})
			.attr("x", function(){
				return circle.x;
			})
			.attr("y", function(){
				return (circle.y - circle.r)+25 ;
			})
			.attr("width", 20)
			.attr("height", 20)
			.attr("style", "font-weight:bold; font-size:1.5em; font-family:sans-serif;")
			.attr("id","label"+circle.id);

	}

	drawRectangles(rectangles, true);

	k = c * Math.sqrt(800 / nodes.length);
	//console.log(k,c, nodes.length);

   for (var i = 0; i < nodes.length; i++) {
   		var node = nodes[i];

		d3.select("svg")
		.append("circle")
		.attr("r",5)
		.attr("cx",function (d,i){
			return findNodeStartX(node, i, true);
		})
		.attr("cy",function (d, i){
			return findNodeStartY(node, i, true);
		})
		.attr("id", function(d){
			return "node" + node.id;
		})
		.attr("class","node")
		.style("fill", "blue")
		.append("svg:title")
        .text(function(d) {
                return node.label;
        });

/*
   		d3.select("svg")
   			.append("text")
			.text(function(){
				node.labelSvg = d3.select(this);
				return node.label;
			})
			.attr("x", function(){
				return node.x+5;
			})
			.attr("y", function(){
				return node.y-5;
			})
			.attr("width", 20)
			.attr("height", 20)
			.attr("class","nodeLabel")
			.attr("style", "font-weight:bold; font-size:0.6em; font-family:sans-serif;")
			.attr("id","nodelabel"+node.id);
*/
   }

	
}

function drawRectangles(rectangles, multiplierSet){

	d3.selectAll("rect").remove();
	console.log(rectangles);
	for (var i = 0; i < rectangles.length; i++) {
		//context.fillRect(rectangles[i].x * multiplier, rectangles[i].y * multiplier, rectangles[i].width * multiplier, rectangles[i].height * multiplier);
		//console.log(svg);
		d3.select("svg").select("g")
			.append("rect")
			.attr("x", multiplierSet ? rectangles[i].x * multiplier : rectangles[i].x)
		    .attr("y", multiplierSet ? rectangles[i].y * multiplier : rectangles[i].y)
		    .attr("width", multiplierSet ? rectangles[i].width * multiplier : rectangles[i].width)
		    .attr("height", multiplierSet ? rectangles[i].height * multiplier : rectangles[i].height)
		    .attr("class","startingRect")
		    .attr("style", "fill: rgba(0, 255, 0, 0.5)");
	}
}

function findNodeStartX(d, i, multiplierSet){
	var cols = Math.round(Math.sqrt(nodesInRegion(d.region).length));

	//console.log(cols, d.label);
	//console.log((i % cols)+1, i, cols, nodes.length, d.region.width, (d.region.width / (cols + 1)));
	var cx = ( ((i % cols)+1) * (d.region.width / (cols + 1)) ) + d.region.x;
	 //var cx = (Math.random() * d.region.width) + d.region.x;
	if (multiplierSet){
		d.x = cx* multiplier;
	} else {
		d.x = cx;
	}
	
	//console.log("x", d);
	return parseInt(d.x) ;
}


function findNodeStartY(d, i, multiplierSet){

	var cols = Math.round(Math.sqrt(nodesInRegion(d.region).length));

	var i = nodesInRegion(d.region).indexOf(d);

	var cy = ((Math.floor(i / cols)+1) * (d.region.height / (cols + 1))) + d.region.y

	if (multiplierSet){
		d.y = cy* multiplier;
	} else {
		d.y = cy;
	}
	return parseInt(d.y);
}

function drawEdges(edges){

	var svg = d3.select("svg");
	svg.selectAll("line").remove();

	svg.selectAll("line")
		.data(edges)
		.enter()
		.append("line")
		.attr("x1", function(d){
			//console.log(d);
			return d3.select("#node"+d.source.id).attr("cx");
		})
		.attr("y1", function(d){
			return d3.select("#node"+d.source.id).attr("cy");
		})
		.attr("x2", function(d){
			return d3.select("#node"+d.target.id).attr("cx");
		})
		.attr("y2", function(d){
			return d3.select("#node"+d.target.id).attr("cy");
		})
		.style("stroke", "rgb(100, 100, 100)")
		.style("stroke-width", 1.5)
		.attr("id", function(d){
			return "edge" + d.source.id + "-" + d.target.id;
		});
}

function moveCircle(circleObj, newX, newY, newR) {

	//var circleObj = findCircleId(id);
	var id = circleObj.id;
	var circleSvg = circleObj.svg;//d3.select("#circle"+id);

	var origX = circleSvg.attr("cx");
	var origY = circleSvg.attr("cy");
	var origR = circleSvg.attr("r");

	//move circle
	circleSvg.transition()
		.attr("cx", newX)
		.attr("cy", newY)
		.attr("r", newR)
		.duration(duration);

	circleObj.x = newX;
	circleObj.y = newY;
	circleObj.r = newR;

//move circle label
	circleObj.labelSvg.transition()
		.attr("x", function(){
			return circleObj.x;
		})
		.attr("y", function(){
			return (circleObj.y - circleObj.r)+25 ;
		})
		.duration(duration);

//redraw rectangles
	//rectangles = [];
	//rectangles = findZoneRectangles(zones, circles);
	console.log(rectangles);

	for (var i = 0; i < nodes.length; i++) {
		var n = nodes[i];
		n.region = findRectangleFromLabel(n.regionText, rectangles);
	}

	drawRectangles(false);

//move nodes
	for (var i = 0; i < nodes.length; i++){
		var node = nodes[i];
		//console.log(node.regionText, id, )
		if (node.regionText.indexOf(id) != -1){
			//move node
			node.x = findNodeStartX(node, i, false);
			node.y = findNodeStartY(node, i, false);

			d3.select("#"+node.label)
				.transition()
				.attr("cx", node.x)
				.attr("cy", node.y)
				.duration(duration);

			for (var j = 0; j < edges.length; j++){
				var edge = edges[j];

				if (edge.source == node){
					d3.select("#edge"+edge.source.label+edge.target.label)
						.transition()
						.attr("x1", node.x)
						.attr("y1", node.y)
						.duration(duration);

					//alter source
				}

				if (edge.target == node) {
					d3.select("#edge"+edge.source.label+edge.target.label)
						.transition()
						.attr("x2", node.x)
						.attr("y2", node.y)
						.duration(duration);

					//alter target
				}

			}
		}
	}

	//console.log(edges);
	//drawEdges(edges);

}

//adds an sgroup to the drawing based on the circle id;
function addSGroup(circleObj) {
	var circle = circleObj //findCircleId(id);
	console.log(circle);

	var svg = d3.select("svg");
	
	svg.select("g")
		.append("circle")
		.attr("r", function(){
			circle.r = circle.r;
			return circle.r
		})
		.attr("cx",function(){
			circle.x = circle.x ;
			return circle.x
		})
		.attr("cy",function(){
			circle.y = circle.y;
			return circle.y
		})
		.attr("class","euler")
		.attr("id", function(d){
			circle.svg = d3.select(this);
			return "circle"+circle.id;
		})
		.attr("style","fill: none; stroke:blue;")
		.style("opacity", 0)
		.transition()
		.style("opacity", 100)
		.duration(duration);

	svg.select("g")
		.append("text")
		.text(function(){
			circle.labelSvg = d3.select(this);
			return circle.label;
		})
		.attr("x", function(){
			return circle.x;
		})
		.attr("y", function(){
			return (circle.y - circle.r)+25 ;
		})
		.attr("width", 20)
		.attr("height", 20)
		.attr("style", "font-weight:bold; font-size:1.5em; font-family:sans-serif;")
		.attr("id","label"+circle.id)
		.style("opacity", 0)
		.transition()
		.style("opacity", 100)
		.duration(duration);;

	for (var i = 0; i < nodes.length; i++){
		var node = nodes[i];
		//console.log(node.regionText, id, )
		if (node.regionText.indexOf(circle.id) != -1){
			//move node
			node.x = findNodeStartX(node, i, false);
			node.y = findNodeStartY(node, i, false);

			//var nodeSvg = d3.select("#"+node.label);
			//console.log(node.label, nodeSvg);

			//add new node

			if ($("#"+node.label).length == 0){
				addNode(node);
			}
		}
	}
}

function deleteSGroup(circle) {
	console.log("deleting s group", circle.id);

	//var circlesRemove = findAllCirclesId(id, circles);
	//console.log(circlesRemove, id, circles);
	//console.log(circlesRemove[0].svg, circlesRemove[0].labelSvg);
	//for (var i = 0; i < circlesRemove.length; i++){
		circle.svg
			.transition()
			.style("opacity", 0)
			.duration(duration)
			.remove();

		circle.labelSvg
			.transition()
			.style("opacity", 0)
			.duration(duration)
			.remove();

	//}
	

	//redraw all rectangles
	drawRectangles(false);

}

function addNode(node) {
	d3.select("svg").append("circle")
		.attr("r",0)
		.attr("cx",node.x * multiplier)
		.attr("cy",node.y * multiplier)
		.attr("id", node.label)
		.attr("class","node")
		.style("fill", "green")
		.transition()
		.attr("r", 5 * 4)
		.duration(3*duration/4)
		.transition()
		.delay(3*duration/4)
		.attr("r", 5)
		.duration(duration/4)
		.style("fill", "blue");
		//.append("svg:title")
        //.text(node.label);

}

function removeNode(node) {
	console.log("removing node", node);

	var nodeSvg = d3.select("svg").select("#"+node.label);

	nodeSvg.style("fill", "red")
		.transition()
		.attr("r", parseInt(nodeSvg.attr("r")) * 4)
		.duration(3*duration/4);

	nodeSvg.transition()
		.delay(3*duration/4)
		.attr("r", 0)
		.duration(duration/4)
		.remove();

	//remove edges
	for (var i = 0; i < edges.length; i++){
		var edge = edges[i];
		//if edge is connected to this node, remove edge
		if (edge.source == node || edge.target == node) {
			edges.splice(i, 1);
			i--;
			d3.select("#edge"+edge.source.label+edge.target.label)
				.remove();
		}
	}

	
}


/**
*	Redraws the nodes & labels so that they appear "on top" of the vis and not behind the edges
*/
function redrawNodes() {
	d3.selectAll(".node").remove();
	d3.selectAll(".nodeLabel").remove();

	d3.select("svg").selectAll("circle")
		.data(nodes, function(d){
			return d;
		})
		.enter()
		.append("circle")
		.attr("r",5)
		.attr("cx",function (d,i){
			return d.x
		})
		.attr("cy",function (d, i){
			return d.y;
		})
		.attr("id", function(d){
			return "node" + d.id;
		})
		.attr("class","node")

		.style("fill", "blue")
		.append("svg:title")
	    .text(function(d) {
	            return d.label;
	    });
/*
	for (var i = 0; i < nodes.length; i++) {
   		var node = nodes[i];

   		d3.select("svg")
   			.append("text")
			.text(function(){
				node.labelSvg = d3.select(this);
				return node.label;
			})
			.attr("x", function(){
				return node.x+5;
			})
			.attr("y", function(){
				return node.y-5;
			})
			.attr("width", 20)
			.attr("height", 20)
			.attr("class","nodeLabel")
			.attr("style", "font-weight:bold; font-size:0.6em; font-family:sans-serif;")
			.attr("id","nodelabel"+node.id);

   }	*/
}