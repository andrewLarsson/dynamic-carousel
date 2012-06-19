function Carousel(name) {
	/*Contains all the variables and methods required to construct a carousel and animate it.*/
	/*Requires jQuery 1.7.2*/
	/*Copyright 2012 Andrew Larsson*/
	
	//Strict mode is enabled to ensure 'this' is used properly throughout.
	"use strict";
	
	//Store this constructor class in a variable, so public methods can be called from private functions.
	var self = this;
	
	/*Private Variables*/
	var id = name || "carousel";
	var boxesWhere = 0;
	var boxesType = "";
	var boxesCount = 0;
	var boxesWidth = 0;
	var boxesHeight = 0;
	var boxesDistance = 0;
	var boxesSpeed = 0;
	var boxesVisible = 0;
	var boxesColorful = "";
	var varsSet = false;
	var repeat = 0;
	var loopMove = 0;
	var centering = false;
	var animating = false;
	
	/*Public Properties*/
	this.version = "1.3.3";
	
	/*Public Methods*/
	
	//TODO Make sure these methods aren't doing anything twice. Each method needs to do one thing and that one thing only.
	
	this.create = function(where, type, colorful) {
		/*Creates a carousel inside the specified element with the parameters defined in setVars().*/
		
		//Check to see if all the parameters were defined.
		boxesWhere = where || document.body;
		boxesType = type || "div";
		boxesColorful = colorful || "";
		if(varsSet == false) {
			self.setVars();
		}
		
		//TODO Use .append() and .prepend() here (or .appendTo()/.prependTo()?), but move these all to new methods. The create() method should only call other methods.
		
		//Adds the visibleContainer and the extendedContainer with the needed CSS properties inside the specified element.
		$(boxesWhere).append("<div id='" + id + "-visibleContainer'><div id='" + id + "-extendedContainer'></div></div>");
		
		//The visibleContainer has overflow: hidden, so that only some of the boxes are shown.
		$("#" + id + "-visibleContainer").css({
			"overflow-x": "hidden",
			"width": "0px",
			"left": "0px",
			"height": boxesHeight + "px",
			"position": "absolute"
		});
		
		//The extendedContainer merely holds all the boxes.
		$("#" + id + "-extendedContainer").css({
			"width": (parseInt($("#" + id + "-visibleContainer").css("width")) + boxesWidth + boxesDistance) + "px",
			"left": "-" + (boxesWidth + boxesDistance) + "px",
			"position": "absolute",
			"height": boxesHeight + "px"
		});
		
		//TODO Use positionElements() here instead of a for() loop.
		//TODO Use data-slot instead of slot to properly validate for HTML5.
		//TODO Perhaps select data-slot by using $().data("slot", )?
		//Adds the specified amount of boxes to the carousel.
		for(var i = 0; i < boxesCount; i ++) {
			//Create a box and append it to the containing element.
			$("#" + id + "-extendedContainer").append("<" + boxesType + " id='" + id + "-box" + i + "'></" + boxesType + ">");
			$("#" + id + "-box" + i).css({
				"width": boxesWidth + "px",
				"height": boxesHeight + "px",
				"position": "absolute",
				"left": (i * (boxesDistance + boxesWidth)) + "px"
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
				$("#" + id + "-visibleContainer").css("width", "+=" + (boxesWidth + boxesDistance) + "px");
			}
			$("#" + id + "-extendedContainer").css("width", "+=" + (boxesWidth + boxesDistance) + "px");
		}
		
		//Increase the size of the containing elements one last time to give them the required width.
		//$("#" + id + "-visibleContainer").css("width", "-=" + ((boxesWidth + boxesDistance) * 2) + "px");
		$("#" + id + "-extendedContainer").css("width", "-=" + (boxesWidth + boxesDistance) + "px");
	}

	//TODO Make sure that visibleContainer and extendedContainer are created as mentioned above or at least make sure that they are positioned correctly.
	this.positionElements = function() {
		$("." + id + "-class").each(function(index) {
			$(this).css({
				"width": boxesWidth + "px",
				"height": boxesHeight + "px",
				"position": "absolute",
				"left": (index * (boxesDistance + boxesWidth)) + "px"
			});
			$(this).attr("slot", index);
		});
	}

	//TODO Pick a better name for this public method.
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
		
		//TODO Check each variable individually, so all variables don't have to be set each time.
		boxesCount = vars.count || 5;
		boxesWidth = vars.width || vars.size || 50;
		boxesHeight = vars.height || vars.size || 50;
		boxesDistance = vars.distance || 5;
		boxesSpeed = vars.speed || 5;
		boxesVisible = vars.visible || 5;
		varsSet = true;
	}
	
	this.getVars = function() {
		/*Returns all the variables that were defined in setVars().*/
		var vars = {
			count: boxesCount,
			width: boxesWidth,
			height: boxesHeight,
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
					$(this).css("left", "-" + (boxesWidth + boxesDistance) + "px");
					$(this).attr("slot", "-1");
				}
				
				//Add one to each of the boxes' slot attribute.
				$(this).attr("slot", (parseInt($(this).attr("slot")) + 1));
			});
			
			//Move all the boxes one step to the right.
			$("." + id + "-class").animate({"left": "+=" + (boxesWidth + boxesDistance)}, (5000 / boxesSpeed), function() {
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
					$(this).css("left", ((boxesDistance + boxesWidth) * boxesCount) + "px");
					$(this).attr("slot", boxesCount);
				}
				
				//Subtract one from each of the boxes' slot attribute.
				$(this).attr("slot", (parseInt($(this).attr("slot")) - 1));
			});
			
			//Move all the boxes one step to the left.
			$("." + id + "-class").animate({"left": "-=" + (boxesWidth + boxesDistance)}, (5000 / boxesSpeed), function() {
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
