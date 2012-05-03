function Carousel(name) {
	"use strict";
	var id = name;
	var boxesWhere = 0;
	var boxesCount = 0;
	var boxesSize = 0;
	var boxesDistance = 0;
	var boxesSpeed = 0;
	var repeat = 0;
	var loopMove = 0;
	var animating = false;
	this.version = "1.0";
	
	this.create = function(where, count, size, distance, speed) {
		boxesWhere = where || document.body;
		boxesCount = count || 5;
		boxesSize = size || 50;
		boxesDistance = distance || 5;
		boxesSpeed = speed || 5;
		
		$(boxesWhere).append("<div id='" + id + "-visibleContainer'><div id='" + id + "-extendedContainer'></div></div>");
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
		for(var i = 0; i < boxesCount; i ++) {
			$("#" + id + "-extendedContainer").append("<div id='" + id + "-box" + i + "'></div>");
			$("#" + id + "-box" + i).css("width", boxesSize + "px");
			$("#" + id + "-box" + i).css("height", boxesSize + "px");
			$("#" + id + "-box" + i).css("background-color", randomHexColor());
			$("#" + id + "-box" + i).css("position", "absolute");
			$("#" + id + "-box" + i).css("left", (i * (boxesDistance + boxesSize)));
			$("#" + id + "-box" + i).attr("slot",  (i + 1));
			$("#" + id + "-box" + i).attr("class",  (id + "-class"));
			$("#" + id + "-box" + i).click(function() {
				center(this);
			});
			$("#" + id + "-visibleContainer").css("width", "+=" + (boxesSize + boxesDistance) + "px");
			$("#" + id + "-extendedContainer").css("width", "+=" + (boxesSize + boxesDistance) + "px");
		}
		$("#" + id + "-visibleContainer").css("width", "-=" + ((boxesSize + boxesDistance) * 2) + "px");
		$("#" + id + "-extendedContainer").css("width", "-=" + (boxesSize + boxesDistance) + "px");
	}
	
	var randomHexColor = function() {
		var randomHex = "#" + ("000000" + Math.floor(Math.random() * 0xFFFFFF).toString(16)).substr(-6);
		return randomHex;
	}
	
	var center = function(target) {
		if(animating == false) {
			repeat = Math.ceil(boxesCount / 2) - parseInt($(target).attr("slot"));
			if(repeat == 0) {
				return;
			} else if(repeat > 0) {
				loopMove = setInterval(moveRight, (5500 / boxesSpeed));
				moveRight();
			} else if(repeat < 0) {
				loopMove = setInterval(moveLeft, (5500 / boxesSpeed));
				moveLeft();
			}
		}
	}
	
	var moveRight = function() {
		repeat --;
		if(repeat == 0) {
			clearInterval(loopMove);
		}
		if(animating == false) {
			animating = true;
			$("." + id + "-class").each(function() {
				if($(this).attr("slot") == boxesCount) {
					$(this).css("left", "-" + (boxesSize + boxesDistance) + "px");
					$(this).attr("slot", "0");
				}
				$(this).attr("slot", (parseInt($(this).attr("slot")) + 1));
			});
			$("." + id + "-class").animate({"left": "+=" + (boxesSize + boxesDistance)}, (5000 / boxesSpeed), function() {
				animating = false;
			});
		}
	}
	
	var moveLeft = function() {
		repeat ++;
		if(repeat == 0) {
			clearInterval(loopMove);
		}
		if(animating == false) {
			animating = true;
			$("." + id + "-class").each(function() {
				if($(this).attr("slot") == "1") {
					$(this).css("left", ((boxesDistance + boxesSize) * boxesCount) + "px");
					$(this).attr("slot", boxesCount + 1);
				}
				$(this).attr("slot", (parseInt($(this).attr("slot")) - 1));
			});
			$("." + id + "-class").animate({"left": "-=" + (boxesSize + boxesDistance)}, (5000 / boxesSpeed), function() {
				animating = false;
			});
		}
	}
}