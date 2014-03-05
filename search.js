


function distanceCalc(x1,y1,x2,y2) {
	var xs = x1 - x2;
	xs = xs * xs;
	var ys = y1 - y2;
	ys = ys * ys;
	var ret = Math.sqrt(xs + ys);
	return ret;
}


function buildStructure(firstArr,secondArr,typeArr) {

//	first = new Array();
//	second = new Array();
//	type = new Array();

	var count = 0;
	for (var i = 0; i < circles.length; i++){
		var c1 = circles[i];
		for (var j = 0; j < circles.length; j++){
			if(i == j) {
				continue;
			}
			
			var c2 = circles[j];
			
			var type = intersectionType(c1,c2);
			
			firstArr[count] = c1;
			secondArr[count] = c2;
			typeArr[count] = type;
//console.log(count+" "+c1.label+" "+c2.label+" "+type)			
			
			count++;
		}
	}

}


function intersectionType(c1,c2) {
	var type = "";
	
	var centreDistance = distanceCalc(c1.x,c1.y,c2.x,c2.y);
//console.log("distance "+centreDistance+" c1.r "+c1.r+" c2.r "+c2.r+" c1.x "+c1.x+" c1.y "+c1.y+" c2.x "+c2.x+" c2.y "+c2.y);
	var type = "";
	if(centreDistance > c1.r + c2.r) {
		type = "disconnected";
	} else if(centreDistance+c1.r < c2.r) {
		type = "containedby";
	} else if(centreDistance+c2.r < c1.r) {
		type = "contains";
	} else {
		type = "intersects";
	}

	return type;
	
}


function checkStructure(f1,s1,t1,f2,s2,t2) {
	if(t1.length != t2.length) {
console.log("DIFFERENT ARRAY LENGTHS: checkStructure");
		return false;
	}

	for (var i = 0; i < t1.length; i++){
		if(f1[i] != f2[i]) {
console.log("DIFFERENT CIRCLE IN FIRST: checkStructure");
			return false;
		}
		if(s1[i] != s2[i]) {
console.log("DIFFERENT CIRCLE IN SECOND: checkStructure");
			return false;
		}
		if(t1[i] != t2[i]) {
//console.log("Different Types: "+f1[i].label+" "+s1[i].label+" should be "+t1[i]+", is "+t2[i]);
			return false;
		}
	}
	
	return true;
	
}


function minDistance(circleIndex) {

	var min = 999999;
	for (var i = 0; i < circles.length; i++){
		if(i == circleIndex) {
			continue;
		}
		var c1 = circles[circleIndex];
		var c2 = circles[i];
		
		var centreDistance = distanceCalc(c1.x,c1.y,c2.x,c2.y);
		var type = intersectionType(c1,c2);

		var distance = 0;
		if(type == "disconnected") {
			distance = centreDistance - (c2.r + c1.r);
		}
		if(type == "contains") {
			distance = (c1.r - c2.r) - centreDistance;
		}
		if(type == "containedby") {
			distance = (c2.r - c1.r) - centreDistance;
		}
		if(type == "intersects") {
			distance = (c1.r + c2.r) - centreDistance;
			var otherGap = c2.r + (centreDistance - c1.r);
			if(otherGap < distance) {
				distance = otherGap;
			}
			otherGap = c1.r + (centreDistance - c2.r);
			if(otherGap < distance) {
				distance = otherGap;
			}
		}
		if(distance < min) {
			min = distance;
		}
	}
	return min;
}


function search() {

//console.log("closeness "+findClosenessRating());
//console.log("area "+findAreaRating(200));
	redrawRectangles();
	
	
	var structureFirst = new Array();
	var structureSecond = new Array();
	var structureType = new Array();
	buildStructure(structureFirst,structureSecond,structureType);
	
	var xMove = 0;
	var yMove = 0;
	var bestMoveX = 0;
	var bestMoveY = 0;
	var nextFitness = -1
	var testFirst = new Array();
	var testSecond = new Array();
	var testType = new Array();

	var smallestDesirableGap = 10;
	var moveFloat = 1000;
	var stop = false;
	var currentFitness = findFitnessRating();
console.log("Fitness before "+ findFitnessRating());


//moveCircle(circles[2],0,-580);
//redrawRectangles();
//stop = true;
	var showMoves = false;

	while(!stop) {
	
		var move = Math.round(moveFloat);
	
		var better = false;
		for (var i = 0; i < circles.length; i++){
			var circle = circles[i];

			var startX = circle.x
			var startY = circle.y
			
			currentMin = minDistance(i);

// down			
			xMove = 0;
			yMove = move;
			moveCircle(circle,xMove,yMove);
			testFirst = new Array();
			testSecond = new Array();
			testType = new Array();
			buildStructure(testFirst,testSecond,testType);
			var structure = checkStructure(structureFirst,structureSecond,structureType,testFirst,testSecond,testType);
			nextMin = minDistance(i);
			var minCheck = true;
			if(nextMin < smallestDesirableGap) { // either keep the min distance over 10, or don't reduce it further
				if(nextMin < currentMin) {
					minCheck = false;
				}
			}
			if(structure && minCheck) {
				redrawRectangles();
				nextFitness = findFitnessRating();
//console.log("testing "+nextFitness)		
				if(nextFitness < currentFitness) {
					if(showMoves) {
						addCircle(circle.r,circle.x-xMove,circle.y-yMove);
					}
					bestMoveX = xMove;
					bestMoveY = yMove;
					currentFitness = nextFitness;
					better = true;
					break;
				} else {
					moveCircle(circle,-xMove,-yMove); // move back
				}
			} else {
// console.log("FAIL structure: "+structure+" min: "+minCheck);
				moveCircle(circle,-xMove,-yMove); // move back
			}
		
		
// up			
			xMove = 0;
			yMove = -move;
			moveCircle(circle,xMove,yMove);
			testFirst = new Array();
			testSecond = new Array();
			testType = new Array();
			buildStructure(testFirst,testSecond,testType);
			var structure = checkStructure(structureFirst,structureSecond,structureType,testFirst,testSecond,testType);
			nextMin = minDistance(i);
			var minCheck = true;
			if(nextMin < smallestDesirableGap) { // either keep the min distance over 10, or don't reduce it further
				if(nextMin < currentMin) {
					minCheck = false;
				}
			}
			if(structure && minCheck) {
				redrawRectangles();
				nextFitness = findFitnessRating();
//console.log("testing "+nextFitness)		
				if(nextFitness < currentFitness) {
					if(showMoves) {
						addCircle(circle.r,circle.x-xMove,circle.y-yMove);
					}
					bestMoveX = xMove;
					bestMoveY = yMove;
					currentFitness = nextFitness;
					better = true;
					break;
				} else {
					moveCircle(circle,-xMove,-yMove); // move back
				}
			} else {
// console.log("FAIL structure: "+structure+" min: "+minCheck);
				moveCircle(circle,-xMove,-yMove); // move back
			}
		
		
// right			
			xMove = move;
			yMove = 0;
			moveCircle(circle,xMove,yMove);
			testFirst = new Array();
			testSecond = new Array();
			testType = new Array();
			buildStructure(testFirst,testSecond,testType);
			var structure = checkStructure(structureFirst,structureSecond,structureType,testFirst,testSecond,testType);
			nextMin = minDistance(i);
			var minCheck = true;
			if(nextMin < smallestDesirableGap) { // either keep the min distance over 10, or don't reduce it further
				if(nextMin < currentMin) {
					minCheck = false;
				}
			}
			if(structure && minCheck) {
				redrawRectangles();
				nextFitness = findFitnessRating();
//console.log("testing "+nextFitness)		
				if(nextFitness < currentFitness) {
					if(showMoves) {
						addCircle(circle.r,circle.x-xMove,circle.y-yMove);
					}
					bestMoveX = xMove;
					bestMoveY = yMove;
					currentFitness = nextFitness;
					better = true;
					break;
				} else {
					moveCircle(circle,-xMove,-yMove); // move back
				}
			} else {
// console.log("FAIL structure: "+structure+" min: "+minCheck);
				moveCircle(circle,-xMove,-yMove); // move back
			}
		
		
// left			
			xMove = -move;
			yMove = 0;
			moveCircle(circle,xMove,yMove);
			testFirst = new Array();
			testSecond = new Array();
			testType = new Array();
			buildStructure(testFirst,testSecond,testType);
			var structure = checkStructure(structureFirst,structureSecond,structureType,testFirst,testSecond,testType);
			nextMin = minDistance(i);
			var minCheck = true;
			if(nextMin < smallestDesirableGap) { // either keep the min distance over 10, or don't reduce it further
				if(nextMin < currentMin) {
					minCheck = false;
				}
			}
			if(structure && minCheck) {
				redrawRectangles();
				nextFitness = findFitnessRating();
//console.log("testing "+nextFitness)		
				if(nextFitness < currentFitness) {
					if(showMoves) {
						addCircle(circle.r,circle.x-xMove,circle.y-yMove);
					}
					bestMoveX = xMove;
					bestMoveY = yMove;
					currentFitness = nextFitness;
					better = true;
					break;
				} else {
					moveCircle(circle,-xMove,-yMove); // move back
				}
			} else {
// console.log("FAIL structure: "+structure+" min: "+minCheck);
				moveCircle(circle,-xMove,-yMove); // move back
			}
		
		
// diagonal down right			
			xMove = move;
			yMove = move;
			moveCircle(circle,xMove,yMove);
			testFirst = new Array();
			testSecond = new Array();
			testType = new Array();
			buildStructure(testFirst,testSecond,testType);
			var structure = checkStructure(structureFirst,structureSecond,structureType,testFirst,testSecond,testType);
			nextMin = minDistance(i);
			var minCheck = true;
			if(nextMin < smallestDesirableGap) { // either keep the min distance over 10, or don't reduce it further
				if(nextMin < currentMin) {
					minCheck = false;
				}
			}
			if(structure && minCheck) {
				redrawRectangles();
				nextFitness = findFitnessRating();
//console.log("testing "+nextFitness)		
				if(nextFitness < currentFitness) {
					if(showMoves) {
						addCircle(circle.r,circle.x-xMove,circle.y-yMove);
					}
					bestMoveX = xMove;
					bestMoveY = yMove;
					currentFitness = nextFitness;
					better = true;
					break;
				} else {
					moveCircle(circle,-xMove,-yMove); // move back
				}
			} else {
// console.log("FAIL structure: "+structure+" min: "+minCheck);
				moveCircle(circle,-xMove,-yMove); // move back
			}
		
		
// diagonal down left			
			xMove = -move;
			yMove = move;
			moveCircle(circle,xMove,yMove);
			testFirst = new Array();
			testSecond = new Array();
			testType = new Array();
			buildStructure(testFirst,testSecond,testType);
			var structure = checkStructure(structureFirst,structureSecond,structureType,testFirst,testSecond,testType);
			nextMin = minDistance(i);
			var minCheck = true;
			if(nextMin < smallestDesirableGap) { // either keep the min distance over 10, or don't reduce it further
				if(nextMin < currentMin) {
					minCheck = false;
				}
			}
			if(structure && minCheck) {
				redrawRectangles();
				nextFitness = findFitnessRating();
//console.log("testing "+nextFitness)		
				if(nextFitness < currentFitness) {
					if(showMoves) {
						addCircle(circle.r,circle.x-xMove,circle.y-yMove);
					}
					bestMoveX = xMove;
					bestMoveY = yMove;
					currentFitness = nextFitness;
					better = true;
					break;
				} else {
					moveCircle(circle,-xMove,-yMove); // move back
				}
			} else {
// console.log("FAIL structure: "+structure+" min: "+minCheck);
				moveCircle(circle,-xMove,-yMove); // move back
			}
		
		
// diagonal up right			
			xMove = move;
			yMove = -move;
			moveCircle(circle,xMove,yMove);
			testFirst = new Array();
			testSecond = new Array();
			testType = new Array();
			buildStructure(testFirst,testSecond,testType);
			var structure = checkStructure(structureFirst,structureSecond,structureType,testFirst,testSecond,testType);
			nextMin = minDistance(i);
			var minCheck = true;
			if(nextMin < smallestDesirableGap) { // either keep the min distance over 10, or don't reduce it further
				if(nextMin < currentMin) {
					minCheck = false;
				}
			}
			if(structure && minCheck) {
				redrawRectangles();
				nextFitness = findFitnessRating();
//console.log("testing "+nextFitness)		
				if(nextFitness < currentFitness) {
					if(showMoves) {
						addCircle(circle.r,circle.x-xMove,circle.y-yMove);
					}
					bestMoveX = xMove;
					bestMoveY = yMove;
					currentFitness = nextFitness;
					better = true;
					break;
				} else {

					moveCircle(circle,-xMove,-yMove); // move back
				}
			} else {
// console.log("FAIL structure: "+structure+" min: "+minCheck);
				moveCircle(circle,-xMove,-yMove); // move back
			}
		
		
// diagonal up left			
			xMove = -move;
			yMove = -move;
			moveCircle(circle,xMove,yMove);
			testFirst = new Array();
			testSecond = new Array();
			testType = new Array();
			buildStructure(testFirst,testSecond,testType);
			var structure = checkStructure(structureFirst,structureSecond,structureType,testFirst,testSecond,testType);
			nextMin = minDistance(i);
			var minCheck = true;
			if(nextMin < smallestDesirableGap) { // either keep the min distance over 10, or don't reduce it further
				if(nextMin < currentMin) {
					minCheck = false;
				}
			}
			if(structure && minCheck) {
				redrawRectangles();
				nextFitness = findFitnessRating();
//console.log("testing "+nextFitness)		
				if(nextFitness < currentFitness) {
					if(showMoves) {
						addCircle(circle.r,circle.x-xMove,circle.y-yMove);
					}
					bestMoveX = xMove;
					bestMoveY = yMove;
					currentFitness = nextFitness;
					better = true;
					break;
				} else {
					moveCircle(circle,-xMove,-yMove); // move back
				}
			} else {
// console.log("FAIL structure: "+structure+" min: "+minCheck);
				moveCircle(circle,-xMove,-yMove); // move back
			}
			
			
			
		} // end iterate through circles
		
		
		
console.log(move+" "+better+" "+currentFitness)		
		if(!better) {
			if(move < 1) {
				stop = true;
			} else {
				var startInt = Math.round(moveFloat);
				while(startInt == Math.round(moveFloat)) {
					moveFloat = moveFloat*0.8;
				}
			}
		}
	}

	//moves the visualization to the centre of the SVG canvas (and extends that if needed)
	console.log("Search done");
	centreVis();
	
}

function moveCircle(circle,xMove,yMove) {

	circle.x = circle.x+xMove;
	circle.y = circle.y+yMove;
	var circleSVG = circle.svg;
	var labelSVG = circle.labelSvg;

	circleSVG.attr("cx",circle.x);
	circleSVG.attr("cy",circle.y);
	
	circle.borderSvg.attr("cx",circle.x);
	circle.borderSvg.attr("cy",circle.y);

	labelSVG.attr("x",parseInt(labelSVG.attr("x"))+xMove);
	labelSVG.attr("y",parseInt(labelSVG.attr("y"))+yMove);

}

function addCircle(r,x,y) {
svg.select("g")
	.append("circle")
    .style("stroke", "black")
    .style("fill", "none")
    .attr("r", r)
    .attr("cx", x)
    .attr("cy", y);
}

