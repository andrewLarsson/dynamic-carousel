function Carousel(name) {
	/*Contains all the variables and methods required to construct a carousel and animate it.*/
	/*Requires jQuery 1.7.2*/
	
	//Strict mode is enabled to ensure 'this' is used properly throughout.
	"use strict";
	
	//Store this constructor class in a variable, so public methods can be called from private functions.
	var self = this;
	
	/*Private Variables*/
	var id = name || "carousel";
	var boxesWhere = 0;
	var boxesType = "";
	var boxesCount = 0;
	var boxesSize = 0;
	var boxesDistance = 0;
	var boxesSpeed = 0;
	var boxesVisible = 0;
	var boxesColorful = "";
	var repeat = 0;
	var loopMove = 0;
	var centering = false;
	var animating = false;
	
	/*Public Properties*/
	this.version = "1.3.2";
	
	/*Public Methods*/
	this.create = function(type, colorful) {
		/*Creates a carousel inside the specified element with the parameters defined in setVars().*/
		
		//Check to see if we need it colorful, and itf it's not defined, set it to false.
		boxesType = type || "div";
		boxesColorful = colorful || "";
		
		//Adds the visibleContainer and the extendedContainer with the needed CSS properties inside the specified element.
		$(boxesWhere).append("<div id='" + id + "-visibleContainer'><div id='" + id + "-extendedContainer'></div></div>");
		
		//The visibleContainer has overflow: hidden, so that only some of the boxes are shown.
		$("#" + id + "-visibleContainer").css({
			"overflow-x": "hidden",
			"width": "0px",
			"left": "0px",
			"height": boxesSize + "px",
			"position": "absolute"
		});
		
		//The extendedContainer merely holds all the boxes.
		$("#" + id + "-extendedContainer").css({
			"width": (parseInt($("#" + id + "-visibleContainer").css("width")) + boxesSize + boxesDistance) + "px",
			"left": "-" + (boxesSize + boxesDistance) + "px",
			"position": "absolute",
			"height": boxesSize + "px"
		});
		
		//TODO Use positionElements() here instead of a for() loop.
		//Adds the specified amount of boxes to the carousel.
		for(var i = 0; i < boxesCount; i ++) {
			//Create a box and append it to the containing element.
			$("#" + id + "-extendedContainer").append("<" + boxesType + " id='" + id + "-box" + i + "'></" + boxesType + ">");
			$("#" + id + "-box" + i).css({
				"width": boxesSize + "px",
				"height": boxesSize + "px",
				"position": "absolute",
				"left": (i * (boxesDistance + boxesSize)) + "px"
			});
			$("#" + id + "-box" + i).attr("class",  (id + "-class"));
			
			//Apply a custom slot attribute that allows referencing its position in the carousel.
			$("#" + id + "-box" + i).attr("slot",  i);
			
			//If specified, spice-up the boxes simply for looks.
			if(boxesColorful == "colorful") {
				$("#" + id + "-box" + i).css("background-color", randomHexColor());
			}
			
			//Increase the size of the containing elements, so they display the correct number of boxes.
			if(i < boxesVisible && i < (boxesCount - 2)) {
				$("#" + id + "-visibleContainer").css("width", "+=" + (boxesSize + boxesDistance) + "px");
			}
			$("#" + id + "-extendedContainer").css("width", "+=" + (boxesSize + boxesDistance) + "px");
		}
		
		//Increase the size of the containing elements one last time to give them the required width.
		//$("#" + id + "-visibleContainer").css("width", "-=" + ((boxesSize + boxesDistance) * 2) + "px");
		$("#" + id + "-extendedContainer").css("width", "-=" + (boxesSize + boxesDistance) + "px");
	}
	
	this.positionElements = function() {
		$("." + id + "-class").each(function(index) {
			$(this).css({
				"width": boxesSize + "px",
				"height": boxesSize + "px",
				"position": "absolute",
				"left": (index * (boxesDistance + boxesSize)) + "px"
			});
			$(this).attr("slot", index);
		});
	}
	
	this.animate = function() {
		$("." + id + "-class").each(function() {
			//Attaches an event handler to each box that calls the center() function when clicked.
			$(this).click(function() {
				center(this);
			});
		});
	}
	
	this.setVars = function(vars) {
		/*Sets all the necessary variables used throughout the constructor.*/
		boxesWhere = vars.where || document.body;
		boxesCount = vars.count || 5;
		boxesSize = vars.size || 50;
		boxesDistance = vars.distance || 5;
		boxesSpeed = vars.speed || 5;
		boxesVisible = vars.visible || 5;
	}
	
	this.getVars = function() {
		/*Returns all the variables that were defined in setVars().*/
		var vars = {
			where: boxesWhere,
			count: boxesCount,
			size: boxesSize,
			distance: boxesDistance,
			speed: boxesSpeed,
			visible: boxesVisible
		};
		return vars;
	}
	
	this.moveRight = function() {
		/*Moves the carousel one step to the right using an iterator.*/
		
		//Make sure we're not currently animating the carousel.
		if(!animating) {
			//Start animating the carousel.
			animating = true;
			
			//TODO Move this decrementer/check outside of this function (maybe an anonymous function inside the setInterval callback?).
			//Decrease the repeat counter, and then check to see if it's at the center.
			if(repeat != 0) {
				repeat --;
				if(repeat == 0) {
					//We're no longer centering the carousel.
					centering = false;
					clearInterval(loopMove);
				}
			}
			
			//This will affect anything with this class name iteratively.
			$("." + id + "-class").each(function() {
				//Check to see if it's the last box.
				if($(this).attr("slot") == (boxesCount - 1)) {
					//Move the last box up to the beginning.
					$(this).css("left", "-" + (boxesSize + boxesDistance) + "px");
					$(this).attr("slot", "-1");
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
	
	this.moveLeft = function() {
		/*Moves the carousel one step to the left using an iterator.*/
		
		//Make sure we're not currently animating the carousel.
		if(!animating) {
			//Start animating the carousel.
			animating = true;
			
			//TODO Move this incrementer/check outside of this function (maybe an anonymous function inside the setInterval callback?).
			//Increment the repeat counter, and then check to see if it's at the center.
			if(repeat != 0) {
				repeat ++;
				if(repeat == 0) {
					//We're no longer centering the carousel.
					centering = false;
					clearInterval(loopMove);
				}
			}
			
			//This will affect anything with this class name iteratively.
			$("." + id + "-class").each(function() {
				//Check to see if it's the first box.
				if($(this).attr("slot") == "0") {
					//Move the first box to the end.
					$(this).css("left", ((boxesDistance + boxesSize) * boxesCount) + "px");
					$(this).attr("slot", boxesCount);
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
	
	/*Private Functions*/
	var randomHexColor = function() {
		/*Returns a random hexadecimal color.*/
		
		//Take a 0-padded string, append a random hexadeximal number between 0 and FFFFFF, and make it the correct length.
		var randomHex = "#" + ("000000" + Math.floor(Math.random() * 0xFFFFFF).toString(16)).substr(-6);
		return randomHex;
	}
	
	var center = function(target) {
		/*Centers the target box in the carousel.*/
		
		//TODO Make a queue if we're animating.
		//Make sure we're not currently not centering the carousel.
		if(!centering) {
			//We're now centering.
			centering = true;
			
			//TODO Use calculations instead of iterations and setInterval.
			//Find the box's distance from the center.
			repeat = Math.floor((boxesVisible + 2) / 2) - parseInt($(target).attr("slot"));
			
			//Determine which direction to move.
			if(repeat == 0) {
				//If we're already at the center, do nothing, and we're no longer centering.
				centering = false;
				return;
			} else if(repeat > 0) {
				//If we're at a positive distance, start moving the box to the right.
				loopMove = setInterval(self.moveRight, (5500 / boxesSpeed));
				self.moveRight();
			} else if(repeat < 0) {
				//If we're at a negative distance, start moving the box to the left.
				loopMove = setInterval(self.moveLeft, (5500 / boxesSpeed));
				self.moveLeft();
			}
		}
	}
}
