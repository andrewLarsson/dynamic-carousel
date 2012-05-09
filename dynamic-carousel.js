function Carousel(name) {
	/*Contains all the variables and methods required to construct a carousel and animate it.*/
	
	//Strict mode is enabled to ensure 'this' is used properly throughout.
	"use strict";
	
	/*Private Variables*/
	var id = name || "carousel";
	var boxesWhere = 0;
	var boxesType = "";
	var boxesCount = 0;
	var boxesSize = 0;
	var boxesDistance = 0;
	var boxesSpeed = 0;
	var boxesColorful = false;
	var repeat = 0;
	var loopMove = 0;
	var animating = false;
	
	/*Public Properties*/
	this.version = "1.2.1";
	
	/*Public Methods*/
	this.create = function(colorful) {
		/*Creates a carousel inside the specified element with the parameters defined in setVars().*/
		
		//Check to see if we need it colorful, and itf it's not defined, set it to false.
		boxesColorful = colorful || "no";
		
		//Adds the visibleContainer and the extendedContainer with the needed CSS properties inside the specified element.
		$(boxesWhere).append("<div id='" + id + "-visibleContainer'><div id='" + id + "-extendedContainer'></div></div>");
		
		//The visibleContainer has overflow: hidden, so that only some of the boxes are shown.
		//The extendedContainer merely holds all the boxes.
		$("#" + id + "-visibleContainer").css("overflow-x", "hidden");
		$("#" + id + "-visibleContainer").css("width", "0px");
		$("#" + id + "-visibleContainer").css("left", "0px");
		$("#" + id + "-visibleContainer").css("height", (boxesSize + "px"));
		$("#" + id + "-visibleContainer").css("position", "absolute");
		$("#" + id + "-extendedContainer").css("width", $("#" + id + "-visibleContainer").css("width"));
		$("#" + id + "-extendedContainer").css("width", "+=" + (boxesSize + boxesDistance) + "px");
		$("#" + id + "-extendedContainer").css("left", "-" + (boxesSize + boxesDistance) + "px");
		$("#" + id + "-extendedContainer").css("position", "absolute");
		$("#" + id + "-extendedContainer").css("height", (boxesSize + "px"));
		
		//Adds the specified amount of boxes to the carousel.
		for(var i = 0; i < boxesCount; i ++) {
			//Create a box and append it to the containing element.
			$("#" + id + "-extendedContainer").append("<" + boxesType + " id='" + id + "-box" + i + "'></" + boxesType + ">");
			$("#" + id + "-box" + i).css("width", boxesSize + "px");
			$("#" + id + "-box" + i).css("height", boxesSize + "px");
			$("#" + id + "-box" + i).css("position", "absolute");
			$("#" + id + "-box" + i).css("left", (i * (boxesDistance + boxesSize)));
			$("#" + id + "-box" + i).attr("class",  (id + "-class"));
			
			//Apply a custom slot attribute that allows referencing its position in the carousel.
			$("#" + id + "-box" + i).attr("slot",  (i + 1));
			
			//If specified, spice-up the look of the boxes simply for looks.
			if(boxesColorful == "colorful") {
				$("#" + id + "-box" + i).css("background-color", randomHexColor());
			}
			
			//Increase the size of the containing elements, so they display the correct number of boxes.
			$("#" + id + "-visibleContainer").css("width", "+=" + (boxesSize + boxesDistance) + "px");
			$("#" + id + "-extendedContainer").css("width", "+=" + (boxesSize + boxesDistance) + "px");
		}
		
		//Increase the size of the containing elements one last time to give them the required width.
		$("#" + id + "-visibleContainer").css("width", "-=" + ((boxesSize + boxesDistance) * 2) + "px");
		$("#" + id + "-extendedContainer").css("width", "-=" + (boxesSize + boxesDistance) + "px");
	}
	
	this.animate = function() {
		$("." + id + "-class").each(function() {
			//Attaches an event handler to each box that calls the center() function when clicked.
			$(this).click(function() {
				center(this);
			});
		});
	}
	
	this.setVars = function(where, type, count, size, distance, speed) {
		//Set predefined variables if they're not specified in the parameters.
		boxesWhere = where || document.body;
		boxesType = type || "div";
		boxesCount = count || 5;
		boxesSize = size || 50;
		boxesDistance = distance || 5;
		boxesSpeed = speed || 5;
	}
	
	this.getVars = function() {
		
	}
	
	this.stepLeft = function() {
		//Make sure we're not currently animating the carousel.
		if(!animating) {
			//Start animating the carousel.
			animating = true;
			
			//This will affect anything with this class name iteratively.
			$("." + id + "-class").each(function() {
				//Check to see if it's the first box.
				if($(this).attr("slot") == "1") {
					//Move the first box to the end.
					$(this).css("left", ((boxesDistance + boxesSize) * boxesCount) + "px");
					$(this).attr("slot", boxesCount + 1);
				}
				
				//Subtract one from each of the boxes' slot attribute.
				$(this).attr("slot", (parseInt($(this).attr("slot")) - 1));
			});
			
			//Move all the boxes one step to the left.
			$("." + id + "-class").animate({"left": "-=" + (boxesSize + boxesDistance)}, (5000 / boxesSpeed), function() {
				//We're no longer animating.
				animating = false;
			});
		}
	}
	
	this.stepRight = function() {
		//Make sure we're not currently animating the carousel.
		if(!animating) {
			//Start animating the carousel.
			animating = true;
			
			//This will affect anything with this class name iteratively.
			$("." + id + "-class").each(function() {
				//Check to see if it's the last box.
				if($(this).attr("slot") == boxesCount) {
					//Move the last box up to the beginning.
					$(this).css("left", "-" + (boxesSize + boxesDistance) + "px");
					$(this).attr("slot", "0");
				}
				
				//Add one to each of the boxes' slot attribute.
				$(this).attr("slot", (parseInt($(this).attr("slot")) + 1));
			});
			
			//Move all the boxes one step to the right.
			$("." + id + "-class").animate({"left": "+=" + (boxesSize + boxesDistance)}, (5000 / boxesSpeed), function() {
				//We're no longer animating.
				animating = false;
			});
		}
	}
	
	/*Private Methods*/
	var randomHexColor = function() {
		/*Returns a random hexadecimal color.*/
		
		//Take a 0-padded string, append a random hexadeximal number between 0 and FFFFFF, and make it the correct length.
		var randomHex = "#" + ("000000" + Math.floor(Math.random() * 0xFFFFFF).toString(16)).substr(-6);
		return randomHex;
	}
	
	var center = function(target) {
		/*Centers the target box in the carousel.*/
		
		//TODO Make a queue if we're animating.
		//Make sure we're not currently not animating the carousel.
		if(!animating) {
			//TODO Use calculations instead of iterations and setInterval.
			//Find the box's distance from the center.
			repeat = Math.ceil(boxesCount / 2) - parseInt($(target).attr("slot"));
			
			//Determine which direction to move.
			if(repeat == 0) {
				//If we're already at the center, do nothing.
				return;
			} else if(repeat > 0) {
				//If we're at a positive distance, start moving the box to the right.
				loopMove = setInterval(moveRight, (5500 / boxesSpeed));
				moveRight();
			} else if(repeat < 0) {
				//If we're at a negative distance, start moving the box to the left.
				loopMove = setInterval(moveLeft, (5500 / boxesSpeed));
				moveLeft();
			}
		}
	}
	
	var moveRight = function() {
		/*Moves the carousel one step to the right.*/
		
		//TODO Move this decrementer/check outside of this function (maybe an anonymous function inside the setInterval callback?).
		//Decrease the repeat counter, and then check to see if it's at the center.
		repeat --;
		if(repeat == 0) {
			clearInterval(loopMove);
		}
		
		//Make sure we're not currently animating the carousel.
		if(!animating) {
			//Start animating the carousel.
			animating = true;
			
			//This will affect anything with this class name iteratively.
			$("." + id + "-class").each(function() {
				//Check to see if it's the last box.
				if($(this).attr("slot") == boxesCount) {
					//Move the last box up to the beginning.
					$(this).css("left", "-" + (boxesSize + boxesDistance) + "px");
					$(this).attr("slot", "0");
				}
				
				//Add one to each of the boxes' slot attribute.
				$(this).attr("slot", (parseInt($(this).attr("slot")) + 1));
			});
			
			//Move all the boxes one step to the right.
			$("." + id + "-class").animate({"left": "+=" + (boxesSize + boxesDistance)}, (5000 / boxesSpeed), function() {
				//We're no longer animating.
				animating = false;
			});
		}
	}
	
	var moveLeft = function() {
		/*Moves the carousel one step to the left.*/
		
		//TODO Move this incrementer/check outside of this function (maybe an anonymous function inside the setInterval callback?).
		//Increment the repeat counter, and then check to see if it's at the center.
		repeat ++;
		if(repeat == 0) {
			clearInterval(loopMove);
		}
		
		//Make sure we're not currently animating the carousel.
		if(!animating) {
			//Start animating the carousel.
			animating = true;
			
			//This will affect anything with this class name iteratively.
			$("." + id + "-class").each(function() {
				//Check to see if it's the first box.
				if($(this).attr("slot") == "1") {
					//Move the first box to the end.
					$(this).css("left", ((boxesDistance + boxesSize) * boxesCount) + "px");
					$(this).attr("slot", boxesCount + 1);
				}
				
				//Subtract one from each of the boxes' slot attribute.
				$(this).attr("slot", (parseInt($(this).attr("slot")) - 1));
			});
			
			//Move all the boxes one step to the left.
			$("." + id + "-class").animate({"left": "-=" + (boxesSize + boxesDistance)}, (5000 / boxesSpeed), function() {
				//We're no longer animating.
				animating = false;
			});
		}
	}
}