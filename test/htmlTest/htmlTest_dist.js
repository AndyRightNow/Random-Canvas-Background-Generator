var htmlTest =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Vector = __webpack_require__(1);
	var utils = __webpack_require__(2);
	var RandomBackgroundGenerator = __webpack_require__(3);
	
	var htmlTest = {};
	
	htmlTest.run = function(canvasId){
	    var poly = new utils.Polygon([
	        new Vector(100, 100),
	        new Vector(200, 200),
	        new Vector(100, 200)
	    ]);
	    var back = new RandomBackgroundGenerator(canvasId);
	    back._fillPolygon("#4183D7", poly, true);
	};
	
	module.exports = htmlTest;


/***/ },
/* 1 */
/***/ function(module, exports) {

	/*
	 *
	 *
	 *
	 *              Vector Class
	 *
	 *      Vector and vector operations.
	 *
	 *
	 *
	 */
	
	/*
	 *  Constructor
	 */
	function Vector(x, y){
		this.x = x || 0;
		this.y = y || 0;
	}
	
	Vector.prototype.dot = function(v){
		return this.x * v.x + this.y * v.y;
	};
	
	Vector.prototype.len2 = function(){
		return this.dot(this);
	};
	
	Vector.prototype.len = function(){
		return Math.sqrt(this.len2());
	};
	
	Vector.prototype.scale = function(sx, sy){
		this.x *= sx;
		this.y *= sy || sx;
		return this;
	};
	
	Vector.prototype.sub = function(v){
		this.x -= v.x;
		this.y -= v.y;
		return this;
	};
	
	//-------------------------------
	//	No side effect and chaining
	//-------------------------------
	Vector.prototype.project = function(axis){
		var cof =  this.dot(axis) / axis.len2();
		return axis.scale(cof);
	};
	
	Vector.prototype.projectN = function(axis){
		var cof =  this.dot(axis);
		return axis.scale(cof);
	};
	
	module.exports = Vector;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Vector = __webpack_require__(1);
	
	/*
	 *	Polygon class
	 */
	function Polygon(points) {
	    this._points = points || [];
	}
	Polygon.prototype = {
	    get points() {
	        return this._points;
	    },
	
	    set points(points) {
	        this._points = points;
	    }
	};
	
	/*
	 *  Clamp a number within a range
	 */
	function clamp(x, lower, upper){
	    return x < lower ? lower : x > upper ? upper : x;
	}
	
	/*
	 *	Get a random number from a range
	 *
	 *	@return {int / float} A randomly generated number within a range
	 *	@param {int / float} lower: The lower bound of the range(Inclusive)
	 *	@param {int / float} upper: The upper bound of the range(Exclusive)
	 *	@param {boolean} isInt: The flag to specify whether the result is int or float
	 */
	 function getRandomNumberFromRange(lower, upper, isInt) {
	     isInt = isInt || true;
	    //--------------------------------------------------
	    //	Some random numbers just coming out of nowhere
	    //--------------------------------------------------
	    var someRandomNumber1 = 1285,
	        someRandomNumber2 = 2391;
	
	    //	Generate the integer part
	    var randomInt =
	        parseInt(Math.random() * someRandomNumber1 * Math.random() * someRandomNumber2) % (upper - lower);
	
	    if (isInt) {
	        return lower + randomInt;
	    } else {
	        return lower + randomInt + Math.random();
	    }
	}
	
	/*
	 *  Get a random point on a rectangle
	 *
	 *	@param {Vector} p1, p2, p3, p4: Points of a rectangle starting
	 *								   from the top left corner and going
	 *								   clockwise.
	 */
	function getRandomPointOnRect(p1, p2, p3, p4) {
	    var width = Math.abs(p2.x - p1.x),
	        height = Math.abs(p3.y - p2.y),
	        topLeftX = Math.min(p1.x, p2.x, p3.x, p4.x),
	        topLeftY = Math.min(p1.y, p2.y, p3.y, p4.y);
	
	    var randomDeltaX = getRandomNumberFromRange(0, width, false),
	        randomDeltaY = getRandomNumberFromRange(0, height, false);
	
	    return new Vector(topLeftX + randomDeltaX, topLeftY + randomDeltaY);
	}
	
	/*
	 *  Get a random point on a line
	 *  @param {Vector} p1, p2: Points of a line from left to right
	 */
	function getRandomPointOnLine(p1, p2) {
	    var projectionWidth = Math.abs(p1.x - p2.x),
	        leftX = Math.min(p1.x, p2.x);
	
	    var A = (p1.y - p2.y) / (p1.x - p2.x),
	        B = p1.y - A * p1.x;
	
	    var randomDeltaX = getRandomNumberFromRange(0, projectionWidth, false);
	    return new Vector(leftX + randomDeltaX, A * (leftX + randomDeltaX) + B);
	}
	
	//  Exports
	module.exports.Polygon = Polygon;
	module.exports.clamp = clamp;
	module.exports.getRandomNumberFromRange = getRandomNumberFromRange;
	module.exports.getRandomPointOnRect = getRandomPointOnRect;
	module.exports.getRandomPointOnLine = getRandomPointOnLine;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint esversion: 6 */
	
	/*
	 *	Random Canvas Background Generator
	 *
	 *	It's used on HTML Canvas to generate random background in a certain pattern
	 *	with certain customized parameters and modes. The background
	 * 	will update every time you click it.
	 *
	 */
	
	//-------------------------------
	//	Dependencies
	//-------------------------------
	var utils = __webpack_require__(2);
	var colorUtils = __webpack_require__(4);
	var Vector = __webpack_require__(1);
	
	/*
	*	Constant string name
	*/
	const POLYGONAL = "Polygonal";
	
	/*
	* Constructor
	*
	* @param {string} mode: The pattern in which the background is generated.
	*						 Currently Support: 1. "Polygonal"
	* @param {string} canvasId: The id of the canvas you want to generate background on
	*/
	function RandomBackgroundGenerator(canvasId, mode) {
		//	Initialize
		this._mode = mode || POLYGONAL;
		this._canvas = typeof document !== 'undefined' ? document.getElementById(canvasId) : null;
	    this._canvasContext = this._canvas ? this._canvas.getContext('2d') : null;
	}
	
	/*
	 *	Private helper function used to draw polygon on the canvas
	 *
	 *	@param {string} color: A HEX, RGB or RGBA color in the form of
	 *						   "#000000", "rgb(0, 0, 0)" or "rgba(0, 0, 0, 1)"
	 *	@param {Array} points: An array of Point objects
	 *	@param {boolean} gradient: A flag indicating if linear-gradient is enabled.
	 *							   The gradient will be randomly generated.
	 *
	 */
	RandomBackgroundGenerator.prototype._fillPolygon = function(color, polygon, gradient) {
		gradient = gradient || false;
	
		//	Save the previous states
		this._canvasContext.save();
	
		//---------------------------
		//	Set the color
		//---------------------------
		if (gradient) {
			if (polygon.points.length === 3) {
				let startPoint = polygon.points[utils.getRandomNumberFromRange(0, polygon.points.length)];
				let endPoint;
	
				let index = polygon.points.indexOf(startPoint);
				let line = [];
				for (let i = 0; i < polygon.points.length; i++)
					if (i !== index) line.push(polygon.points[i]);
	
				let axis = new Vector(line[0].x - line[1].x, line[0].y - line[1].y);
				endPoint = startPoint.project(axis);
	
				let grad = this._canvasContext.createLinearGradient(
					startPoint.x, startPoint.y, endPoint.x, endPoint.y);
	
				let randomIntensity = Math.random() + 1 * 0.5;
				let gradColors = colorUtils.randomGradient(colorUtils.randomColor(color), randomIntensity);
	
				grad.addColorStop(0, gradColors.first);
				grad.addColorStop(1, gradColors.second);
	
				this._canvasContext.fillStyle = grad;
			}
			else {
				this._canvasContext.fillStyle = color;
			}
		}
		else {
			this._canvasContext.fillStyle = color;
		}
	
		//-----------------------------------
		//	Draw the polygon
		//-----------------------------------
		this._canvasContext.beginPath();
		var points = polygon.points;
		for (var i = 0; i < points.length; i++) {
			if (i === 0) {
				this._canvasContext.moveTo(points[i].x, points[i].y);
			} else {
				this._canvasContext.lineTo(points[i].x, points[i].y);
			}
		}
		this._canvasContext.closePath();
		this._canvasContext.fill();
	
		//	Restore previous states
		this._canvasContext.restore();
	};
	
	//	Exports
	module.exports = RandomBackgroundGenerator;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(2);
	
	/*
	 *  Check if a string is in a hex color format
	 *  @return {boolean} True if the string is in a hex format
	 *  @param {string} color: The string representing the color
	 */
	function isHex(color) {
	    return /#[a-f0-9]{6}/gi.test(color);
	}
	
	/*
	 *  Check if a string is in a rgb color format
	 *  @return {boolean} True if the string is in a rgb format
	 *  @param {string} color: The string representing the color
	 */
	 function isRgb(color) {
	    //  Eliminate white spaces
	    color = color.replace(/\s/g, "");
	    return /rgb\([\d]{1,3}[.]?[\d]*\,[\d]{1,3}[.]?[\d]*\,[\d]{1,3}[.]?[\d]*\)/i.test(color);
	}
	 /*
	*  Check if a string is in a rgba color format
	*  @return {boolean} True if the string is in a rgba format
	*  @param {string} color: The string representing the color
	*/
	function isRgba(color) {
	 //  Eliminate white spaces
	 color = color.replace(/\s/g, "");
	 return /rgba\([\d]{1,3}[.]?[\d]*\,[\d]{1,3}[.]?[\d]*\,[\d]{1,3}[.]?[\d]*\,[\d]{1,3}[.]?[\d]*\)/i.test(color);
	
	}
	
	/*
	 *	Convert hex color to rgb color
	 *  @return {string / null} Converted color string or null if the input is invalid
	 */
	function hexToRgb(hex) {
	    if (isHex(hex)) {
	        return "rgb(" +
	        parseInt(hex.substr(1, 2), 16) + ", " +
	        parseInt(hex.substr(3, 2), 16) + ", " +
	        parseInt(hex.substr(5, 2), 16) + ")";
	    }
	    else return isRgb(hex) || isRgba(hex) ? hex : null;
	}
	
	/*
	 *	Adjust the brightness of a color by percentage
	 *  @param {string} color: The color string
	 *  @param {float} percentage: A float within [-1, 1] by which the brightness is adjusted.
	 *							   1 means maximum darkness and -1 means maximum brightness.
	 */
	function adjustColorBrightness(color, percentage) {
	    percentage = percentage || 0;
	    color = hexToRgb(color);
	
	    if (color !== null) {
	        //-------------------------------------------
	        //	Use different regex and formats for rgb and rgba
	        //-------------------------------------------
	        var regx = isRgb(color) ?
	            /[\d]{1,3}[.]?[\d]*/gi : /[\d]{1,3}[.]?[\d]*\,/gi;
	        var postfix = isRgb(color) ? '' : ',';
	
	        //	Math 'n,' in order to exclude the alpha
	        return color.replace(regx, function(e){
	            return Math.round(utils.clamp((parseInt(e) * (1 - percentage)), 0, 255))
	                .toString() + postfix;
	        });
	    }
	
	    return null;
	}
	
	/*
	 *  Function to generate random color with random brightness
	 *  based on a given color
	 *
	 *	@return {string} A string of generated color
	 *  @param {string} baseColor: A color string in HEX, RGB or RGBA
	 *	@param {float} brightnessIntensity(Optional): The brightness intensity within [0, 1] to generate
	 *												  around. 0 means generate around 0 brightness changes,
	 *												  0.5 means generate around 50% brightness changes and
	 *												  1 means generate around maximum brightness changes.
	 *												  The brightness changes will be either drakening or brightening.
	 */
	 function randomColor(baseColor, brightnessIntensity){
	     brightnessIntensity = brightnessIntensity || 0.5;
	     var threshold = 0.2,
	         rangeLower = utils.clamp(brightnessIntensity - threshold, 0, 1),
	         rangeUpper = utils.clamp(brightnessIntensity + threshold, 0, 1);
	
	     //	Used to get a either negative or positive random number
	     var randomArr = [
	         utils.getRandomNumberFromRange(rangeLower, rangeUpper, false),
	         utils.getRandomNumberFromRange(-rangeLower, -rangeUpper, false)];
	
	     //	Color validity checking in adjustColorBrightness
	     return adjustColorBrightness(baseColor, randomArr[utils.getRandomNumberFromRange(0, 2)]);
	 }
	
	/*
	 *  Function to generate random gradient color with random brightness on both sides
	 *  of the linear gradient based on a given color
	 *
	 *	@return {Object} An object containing the pair of colors
	 *  @param {string} baseColor: A color string in HEX, RGB or RGBA
	 *	@param {float} brightnessIntensity(Optional): The brightness intensity within [0, 1] to generate
	 *												  around. The same as the one in randomColor
	 */
	 function randomGradient(baseColor, brightnessIntensity) {
	     brightnessIntensity = brightnessIntensity || 0.5;
	     return {
	         first: randomColor(baseColor, brightnessIntensity),
	         second: randomColor(baseColor, brightnessIntensity)
	     };
	 }
	
	//  Exports
	module.exports.isHex = isHex;
	module.exports.isRgb = isRgb;
	module.exports.isRgba = isRgba;
	module.exports.hexToRgb = hexToRgb;
	module.exports.adjustColorBrightness = adjustColorBrightness;
	module.exports.randomColor = randomColor;
	module.exports.randomGradient = randomGradient;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZmEwOTk0ZjUyOGE1MGVmNzIxODQiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sb3JVdGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3pEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLFlBQVk7QUFDeEIsWUFBVyxZQUFZO0FBQ3ZCLFlBQVcsWUFBWTtBQUN2QixZQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDM0ZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVUsT0FBTztBQUNqQjtBQUNBLFdBQVUsT0FBTztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEI7QUFDQSxZQUFXLE1BQU07QUFDakIsWUFBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQWtCLDJCQUEyQjtBQUM3Qzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCLG1CQUFtQjtBQUNuQztBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM1R0E7O0FBRUE7QUFDQTtBQUNBLGNBQWEsUUFBUTtBQUNyQixhQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBLHVCQUFzQixFQUFFO0FBQ3hCOztBQUVBO0FBQ0E7QUFDQSxjQUFhLFFBQVE7QUFDckIsYUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXNCLElBQUksZ0JBQWdCLElBQUksZ0JBQWdCLElBQUk7QUFDbEU7QUFDQTtBQUNBO0FBQ0EsYUFBWSxRQUFRO0FBQ3BCLFlBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQixJQUFJLGdCQUFnQixJQUFJLGdCQUFnQixJQUFJLGdCQUFnQixJQUFJOztBQUVwRjs7QUFFQTtBQUNBO0FBQ0EsY0FBYSxjQUFjO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFZLE9BQU87QUFDbkIsYUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFrQixJQUFJLHFCQUFxQixJQUFJO0FBQy9DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLE9BQU87QUFDbkIsYUFBWSxPQUFPO0FBQ25CLFlBQVcsTUFBTTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLE9BQU87QUFDbkIsYUFBWSxPQUFPO0FBQ25CLFlBQVcsTUFBTTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJodG1sVGVzdF9kaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBmYTA5OTRmNTI4YTUwZWY3MjE4NFxuICoqLyIsInZhciBWZWN0b3IgPSByZXF1aXJlKCcuLy4uLy4uL3NyYy92ZWN0b3InKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi9zcmMvdXRpbHMnKTtcclxudmFyIFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uLy4uL3NyYy9SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yJyk7XHJcblxyXG52YXIgaHRtbFRlc3QgPSB7fTtcclxuXHJcbmh0bWxUZXN0LnJ1biA9IGZ1bmN0aW9uKGNhbnZhc0lkKXtcclxuICAgIHZhciBwb2x5ID0gbmV3IHV0aWxzLlBvbHlnb24oW1xyXG4gICAgICAgIG5ldyBWZWN0b3IoMTAwLCAxMDApLFxyXG4gICAgICAgIG5ldyBWZWN0b3IoMjAwLCAyMDApLFxyXG4gICAgICAgIG5ldyBWZWN0b3IoMTAwLCAyMDApXHJcbiAgICBdKTtcclxuICAgIHZhciBiYWNrID0gbmV3IFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IoY2FudmFzSWQpO1xyXG4gICAgYmFjay5fZmlsbFBvbHlnb24oXCIjNDE4M0Q3XCIsIHBvbHksIHRydWUpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBodG1sVGVzdDtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3Rlc3QvaHRtbFRlc3QvaHRtbFRlc3QuanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxyXG4gKlxyXG4gKlxyXG4gKlxyXG4gKiAgICAgICAgICAgICAgVmVjdG9yIENsYXNzXHJcbiAqXHJcbiAqICAgICAgVmVjdG9yIGFuZCB2ZWN0b3Igb3BlcmF0aW9ucy5cclxuICpcclxuICpcclxuICpcclxuICovXHJcblxyXG4vKlxyXG4gKiAgQ29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIFZlY3Rvcih4LCB5KXtcclxuXHR0aGlzLnggPSB4IHx8IDA7XHJcblx0dGhpcy55ID0geSB8fCAwO1xyXG59XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHYpe1xyXG5cdHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2Lnk7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmxlbjIgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLmRvdCh0aGlzKTtcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUubGVuID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gTWF0aC5zcXJ0KHRoaXMubGVuMigpKTtcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbihzeCwgc3kpe1xyXG5cdHRoaXMueCAqPSBzeDtcclxuXHR0aGlzLnkgKj0gc3kgfHwgc3g7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKHYpe1xyXG5cdHRoaXMueCAtPSB2Lng7XHJcblx0dGhpcy55IC09IHYueTtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vL1x0Tm8gc2lkZSBlZmZlY3QgYW5kIGNoYWluaW5nXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5WZWN0b3IucHJvdG90eXBlLnByb2plY3QgPSBmdW5jdGlvbihheGlzKXtcclxuXHR2YXIgY29mID0gIHRoaXMuZG90KGF4aXMpIC8gYXhpcy5sZW4yKCk7XHJcblx0cmV0dXJuIGF4aXMuc2NhbGUoY29mKTtcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUucHJvamVjdE4gPSBmdW5jdGlvbihheGlzKXtcclxuXHR2YXIgY29mID0gIHRoaXMuZG90KGF4aXMpO1xyXG5cdHJldHVybiBheGlzLnNjYWxlKGNvZik7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy92ZWN0b3IuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgVmVjdG9yID0gcmVxdWlyZSgnLi92ZWN0b3InKTtcclxuXHJcbi8qXHJcbiAqXHRQb2x5Z29uIGNsYXNzXHJcbiAqL1xyXG5mdW5jdGlvbiBQb2x5Z29uKHBvaW50cykge1xyXG4gICAgdGhpcy5fcG9pbnRzID0gcG9pbnRzIHx8IFtdO1xyXG59XHJcblBvbHlnb24ucHJvdG90eXBlID0ge1xyXG4gICAgZ2V0IHBvaW50cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9pbnRzO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXQgcG9pbnRzKHBvaW50cykge1xyXG4gICAgICAgIHRoaXMuX3BvaW50cyA9IHBvaW50cztcclxuICAgIH1cclxufTtcclxuXHJcbi8qXHJcbiAqICBDbGFtcCBhIG51bWJlciB3aXRoaW4gYSByYW5nZVxyXG4gKi9cclxuZnVuY3Rpb24gY2xhbXAoeCwgbG93ZXIsIHVwcGVyKXtcclxuICAgIHJldHVybiB4IDwgbG93ZXIgPyBsb3dlciA6IHggPiB1cHBlciA/IHVwcGVyIDogeDtcclxufVxyXG5cclxuLypcclxuICpcdEdldCBhIHJhbmRvbSBudW1iZXIgZnJvbSBhIHJhbmdlXHJcbiAqXHJcbiAqXHRAcmV0dXJuIHtpbnQgLyBmbG9hdH0gQSByYW5kb21seSBnZW5lcmF0ZWQgbnVtYmVyIHdpdGhpbiBhIHJhbmdlXHJcbiAqXHRAcGFyYW0ge2ludCAvIGZsb2F0fSBsb3dlcjogVGhlIGxvd2VyIGJvdW5kIG9mIHRoZSByYW5nZShJbmNsdXNpdmUpXHJcbiAqXHRAcGFyYW0ge2ludCAvIGZsb2F0fSB1cHBlcjogVGhlIHVwcGVyIGJvdW5kIG9mIHRoZSByYW5nZShFeGNsdXNpdmUpXHJcbiAqXHRAcGFyYW0ge2Jvb2xlYW59IGlzSW50OiBUaGUgZmxhZyB0byBzcGVjaWZ5IHdoZXRoZXIgdGhlIHJlc3VsdCBpcyBpbnQgb3IgZmxvYXRcclxuICovXHJcbiBmdW5jdGlvbiBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UobG93ZXIsIHVwcGVyLCBpc0ludCkge1xyXG4gICAgIGlzSW50ID0gaXNJbnQgfHwgdHJ1ZTtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vXHRTb21lIHJhbmRvbSBudW1iZXJzIGp1c3QgY29taW5nIG91dCBvZiBub3doZXJlXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgc29tZVJhbmRvbU51bWJlcjEgPSAxMjg1LFxyXG4gICAgICAgIHNvbWVSYW5kb21OdW1iZXIyID0gMjM5MTtcclxuXHJcbiAgICAvL1x0R2VuZXJhdGUgdGhlIGludGVnZXIgcGFydFxyXG4gICAgdmFyIHJhbmRvbUludCA9XHJcbiAgICAgICAgcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIHNvbWVSYW5kb21OdW1iZXIxICogTWF0aC5yYW5kb20oKSAqIHNvbWVSYW5kb21OdW1iZXIyKSAlICh1cHBlciAtIGxvd2VyKTtcclxuXHJcbiAgICBpZiAoaXNJbnQpIHtcclxuICAgICAgICByZXR1cm4gbG93ZXIgKyByYW5kb21JbnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBsb3dlciArIHJhbmRvbUludCArIE1hdGgucmFuZG9tKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiAqICBHZXQgYSByYW5kb20gcG9pbnQgb24gYSByZWN0YW5nbGVcclxuICpcclxuICpcdEBwYXJhbSB7VmVjdG9yfSBwMSwgcDIsIHAzLCBwNDogUG9pbnRzIG9mIGEgcmVjdGFuZ2xlIHN0YXJ0aW5nXHJcbiAqXHRcdFx0XHRcdFx0XHRcdCAgIGZyb20gdGhlIHRvcCBsZWZ0IGNvcm5lciBhbmQgZ29pbmdcclxuICpcdFx0XHRcdFx0XHRcdFx0ICAgY2xvY2t3aXNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmFuZG9tUG9pbnRPblJlY3QocDEsIHAyLCBwMywgcDQpIHtcclxuICAgIHZhciB3aWR0aCA9IE1hdGguYWJzKHAyLnggLSBwMS54KSxcclxuICAgICAgICBoZWlnaHQgPSBNYXRoLmFicyhwMy55IC0gcDIueSksXHJcbiAgICAgICAgdG9wTGVmdFggPSBNYXRoLm1pbihwMS54LCBwMi54LCBwMy54LCBwNC54KSxcclxuICAgICAgICB0b3BMZWZ0WSA9IE1hdGgubWluKHAxLnksIHAyLnksIHAzLnksIHA0LnkpO1xyXG5cclxuICAgIHZhciByYW5kb21EZWx0YVggPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgd2lkdGgsIGZhbHNlKSxcclxuICAgICAgICByYW5kb21EZWx0YVkgPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgaGVpZ2h0LCBmYWxzZSk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBWZWN0b3IodG9wTGVmdFggKyByYW5kb21EZWx0YVgsIHRvcExlZnRZICsgcmFuZG9tRGVsdGFZKTtcclxufVxyXG5cclxuLypcclxuICogIEdldCBhIHJhbmRvbSBwb2ludCBvbiBhIGxpbmVcclxuICogIEBwYXJhbSB7VmVjdG9yfSBwMSwgcDI6IFBvaW50cyBvZiBhIGxpbmUgZnJvbSBsZWZ0IHRvIHJpZ2h0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSYW5kb21Qb2ludE9uTGluZShwMSwgcDIpIHtcclxuICAgIHZhciBwcm9qZWN0aW9uV2lkdGggPSBNYXRoLmFicyhwMS54IC0gcDIueCksXHJcbiAgICAgICAgbGVmdFggPSBNYXRoLm1pbihwMS54LCBwMi54KTtcclxuXHJcbiAgICB2YXIgQSA9IChwMS55IC0gcDIueSkgLyAocDEueCAtIHAyLngpLFxyXG4gICAgICAgIEIgPSBwMS55IC0gQSAqIHAxLng7XHJcblxyXG4gICAgdmFyIHJhbmRvbURlbHRhWCA9IGdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCBwcm9qZWN0aW9uV2lkdGgsIGZhbHNlKTtcclxuICAgIHJldHVybiBuZXcgVmVjdG9yKGxlZnRYICsgcmFuZG9tRGVsdGFYLCBBICogKGxlZnRYICsgcmFuZG9tRGVsdGFYKSArIEIpO1xyXG59XHJcblxyXG4vLyAgRXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cy5Qb2x5Z29uID0gUG9seWdvbjtcclxubW9kdWxlLmV4cG9ydHMuY2xhbXAgPSBjbGFtcDtcclxubW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlID0gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlO1xyXG5tb2R1bGUuZXhwb3J0cy5nZXRSYW5kb21Qb2ludE9uUmVjdCA9IGdldFJhbmRvbVBvaW50T25SZWN0O1xyXG5tb2R1bGUuZXhwb3J0cy5nZXRSYW5kb21Qb2ludE9uTGluZSA9IGdldFJhbmRvbVBvaW50T25MaW5lO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG4vKlxyXG4gKlx0UmFuZG9tIENhbnZhcyBCYWNrZ3JvdW5kIEdlbmVyYXRvclxyXG4gKlxyXG4gKlx0SXQncyB1c2VkIG9uIEhUTUwgQ2FudmFzIHRvIGdlbmVyYXRlIHJhbmRvbSBiYWNrZ3JvdW5kIGluIGEgY2VydGFpbiBwYXR0ZXJuXHJcbiAqXHR3aXRoIGNlcnRhaW4gY3VzdG9taXplZCBwYXJhbWV0ZXJzIGFuZCBtb2Rlcy4gVGhlIGJhY2tncm91bmRcclxuICogXHR3aWxsIHVwZGF0ZSBldmVyeSB0aW1lIHlvdSBjbGljayBpdC5cclxuICpcclxuICovXHJcblxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cdERlcGVuZGVuY2llc1xyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG52YXIgY29sb3JVdGlscyA9IHJlcXVpcmUoJy4vY29sb3JVdGlscycpO1xyXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi92ZWN0b3InKTtcclxuXHJcbi8qXHJcbipcdENvbnN0YW50IHN0cmluZyBuYW1lXHJcbiovXHJcbmNvbnN0IFBPTFlHT05BTCA9IFwiUG9seWdvbmFsXCI7XHJcblxyXG4vKlxyXG4qIENvbnN0cnVjdG9yXHJcbipcclxuKiBAcGFyYW0ge3N0cmluZ30gbW9kZTogVGhlIHBhdHRlcm4gaW4gd2hpY2ggdGhlIGJhY2tncm91bmQgaXMgZ2VuZXJhdGVkLlxyXG4qXHRcdFx0XHRcdFx0IEN1cnJlbnRseSBTdXBwb3J0OiAxLiBcIlBvbHlnb25hbFwiXHJcbiogQHBhcmFtIHtzdHJpbmd9IGNhbnZhc0lkOiBUaGUgaWQgb2YgdGhlIGNhbnZhcyB5b3Ugd2FudCB0byBnZW5lcmF0ZSBiYWNrZ3JvdW5kIG9uXHJcbiovXHJcbmZ1bmN0aW9uIFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IoY2FudmFzSWQsIG1vZGUpIHtcclxuXHQvL1x0SW5pdGlhbGl6ZVxyXG5cdHRoaXMuX21vZGUgPSBtb2RlIHx8IFBPTFlHT05BTDtcclxuXHR0aGlzLl9jYW52YXMgPSB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIDogbnVsbDtcclxuICAgIHRoaXMuX2NhbnZhc0NvbnRleHQgPSB0aGlzLl9jYW52YXMgPyB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKSA6IG51bGw7XHJcbn1cclxuXHJcbi8qXHJcbiAqXHRQcml2YXRlIGhlbHBlciBmdW5jdGlvbiB1c2VkIHRvIGRyYXcgcG9seWdvbiBvbiB0aGUgY2FudmFzXHJcbiAqXHJcbiAqXHRAcGFyYW0ge3N0cmluZ30gY29sb3I6IEEgSEVYLCBSR0Igb3IgUkdCQSBjb2xvciBpbiB0aGUgZm9ybSBvZlxyXG4gKlx0XHRcdFx0XHRcdCAgIFwiIzAwMDAwMFwiLCBcInJnYigwLCAwLCAwKVwiIG9yIFwicmdiYSgwLCAwLCAwLCAxKVwiXHJcbiAqXHRAcGFyYW0ge0FycmF5fSBwb2ludHM6IEFuIGFycmF5IG9mIFBvaW50IG9iamVjdHNcclxuICpcdEBwYXJhbSB7Ym9vbGVhbn0gZ3JhZGllbnQ6IEEgZmxhZyBpbmRpY2F0aW5nIGlmIGxpbmVhci1ncmFkaWVudCBpcyBlbmFibGVkLlxyXG4gKlx0XHRcdFx0XHRcdFx0ICAgVGhlIGdyYWRpZW50IHdpbGwgYmUgcmFuZG9tbHkgZ2VuZXJhdGVkLlxyXG4gKlxyXG4gKi9cclxuUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5wcm90b3R5cGUuX2ZpbGxQb2x5Z29uID0gZnVuY3Rpb24oY29sb3IsIHBvbHlnb24sIGdyYWRpZW50KSB7XHJcblx0Z3JhZGllbnQgPSBncmFkaWVudCB8fCBmYWxzZTtcclxuXHJcblx0Ly9cdFNhdmUgdGhlIHByZXZpb3VzIHN0YXRlc1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuc2F2ZSgpO1xyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8vXHRTZXQgdGhlIGNvbG9yXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRpZiAoZ3JhZGllbnQpIHtcclxuXHRcdGlmIChwb2x5Z29uLnBvaW50cy5sZW5ndGggPT09IDMpIHtcclxuXHRcdFx0bGV0IHN0YXJ0UG9pbnQgPSBwb2x5Z29uLnBvaW50c1t1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgcG9seWdvbi5wb2ludHMubGVuZ3RoKV07XHJcblx0XHRcdGxldCBlbmRQb2ludDtcclxuXHJcblx0XHRcdGxldCBpbmRleCA9IHBvbHlnb24ucG9pbnRzLmluZGV4T2Yoc3RhcnRQb2ludCk7XHJcblx0XHRcdGxldCBsaW5lID0gW107XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcG9seWdvbi5wb2ludHMubGVuZ3RoOyBpKyspXHJcblx0XHRcdFx0aWYgKGkgIT09IGluZGV4KSBsaW5lLnB1c2gocG9seWdvbi5wb2ludHNbaV0pO1xyXG5cclxuXHRcdFx0bGV0IGF4aXMgPSBuZXcgVmVjdG9yKGxpbmVbMF0ueCAtIGxpbmVbMV0ueCwgbGluZVswXS55IC0gbGluZVsxXS55KTtcclxuXHRcdFx0ZW5kUG9pbnQgPSBzdGFydFBvaW50LnByb2plY3QoYXhpcyk7XHJcblxyXG5cdFx0XHRsZXQgZ3JhZCA9IHRoaXMuX2NhbnZhc0NvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXHJcblx0XHRcdFx0c3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xyXG5cclxuXHRcdFx0bGV0IHJhbmRvbUludGVuc2l0eSA9IE1hdGgucmFuZG9tKCkgKyAxICogMC41O1xyXG5cdFx0XHRsZXQgZ3JhZENvbG9ycyA9IGNvbG9yVXRpbHMucmFuZG9tR3JhZGllbnQoY29sb3JVdGlscy5yYW5kb21Db2xvcihjb2xvciksIHJhbmRvbUludGVuc2l0eSk7XHJcblxyXG5cdFx0XHRncmFkLmFkZENvbG9yU3RvcCgwLCBncmFkQ29sb3JzLmZpcnN0KTtcclxuXHRcdFx0Z3JhZC5hZGRDb2xvclN0b3AoMSwgZ3JhZENvbG9ycy5zZWNvbmQpO1xyXG5cclxuXHRcdFx0dGhpcy5fY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBncmFkO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcblx0XHR9XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0dGhpcy5fY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcclxuXHR9XHJcblxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvL1x0RHJhdyB0aGUgcG9seWdvblxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cdHZhciBwb2ludHMgPSBwb2x5Z29uLnBvaW50cztcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYgKGkgPT09IDApIHtcclxuXHRcdFx0dGhpcy5fY2FudmFzQ29udGV4dC5tb3ZlVG8ocG9pbnRzW2ldLngsIHBvaW50c1tpXS55KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQubGluZVRvKHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuY2xvc2VQYXRoKCk7XHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5maWxsKCk7XHJcblxyXG5cdC8vXHRSZXN0b3JlIHByZXZpb3VzIHN0YXRlc1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQucmVzdG9yZSgpO1xyXG59O1xyXG5cclxuLy9cdEV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMgPSBSYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL1JhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcblxyXG4vKlxyXG4gKiAgQ2hlY2sgaWYgYSBzdHJpbmcgaXMgaW4gYSBoZXggY29sb3IgZm9ybWF0XHJcbiAqICBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBzdHJpbmcgaXMgaW4gYSBoZXggZm9ybWF0XHJcbiAqICBAcGFyYW0ge3N0cmluZ30gY29sb3I6IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb2xvclxyXG4gKi9cclxuZnVuY3Rpb24gaXNIZXgoY29sb3IpIHtcclxuICAgIHJldHVybiAvI1thLWYwLTldezZ9L2dpLnRlc3QoY29sb3IpO1xyXG59XHJcblxyXG4vKlxyXG4gKiAgQ2hlY2sgaWYgYSBzdHJpbmcgaXMgaW4gYSByZ2IgY29sb3IgZm9ybWF0XHJcbiAqICBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBzdHJpbmcgaXMgaW4gYSByZ2IgZm9ybWF0XHJcbiAqICBAcGFyYW0ge3N0cmluZ30gY29sb3I6IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb2xvclxyXG4gKi9cclxuIGZ1bmN0aW9uIGlzUmdiKGNvbG9yKSB7XHJcbiAgICAvLyAgRWxpbWluYXRlIHdoaXRlIHNwYWNlc1xyXG4gICAgY29sb3IgPSBjb2xvci5yZXBsYWNlKC9cXHMvZywgXCJcIik7XHJcbiAgICByZXR1cm4gL3JnYlxcKFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcKS9pLnRlc3QoY29sb3IpO1xyXG59XHJcbiAvKlxyXG4qICBDaGVjayBpZiBhIHN0cmluZyBpcyBpbiBhIHJnYmEgY29sb3IgZm9ybWF0XHJcbiogIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHN0cmluZyBpcyBpbiBhIHJnYmEgZm9ybWF0XHJcbiogIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogVGhlIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGNvbG9yXHJcbiovXHJcbmZ1bmN0aW9uIGlzUmdiYShjb2xvcikge1xyXG4gLy8gIEVsaW1pbmF0ZSB3aGl0ZSBzcGFjZXNcclxuIGNvbG9yID0gY29sb3IucmVwbGFjZSgvXFxzL2csIFwiXCIpO1xyXG4gcmV0dXJuIC9yZ2JhXFwoW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCkvaS50ZXN0KGNvbG9yKTtcclxuXHJcbn1cclxuXHJcbi8qXHJcbiAqXHRDb252ZXJ0IGhleCBjb2xvciB0byByZ2IgY29sb3JcclxuICogIEByZXR1cm4ge3N0cmluZyAvIG51bGx9IENvbnZlcnRlZCBjb2xvciBzdHJpbmcgb3IgbnVsbCBpZiB0aGUgaW5wdXQgaXMgaW52YWxpZFxyXG4gKi9cclxuZnVuY3Rpb24gaGV4VG9SZ2IoaGV4KSB7XHJcbiAgICBpZiAoaXNIZXgoaGV4KSkge1xyXG4gICAgICAgIHJldHVybiBcInJnYihcIiArXHJcbiAgICAgICAgcGFyc2VJbnQoaGV4LnN1YnN0cigxLCAyKSwgMTYpICsgXCIsIFwiICtcclxuICAgICAgICBwYXJzZUludChoZXguc3Vic3RyKDMsIDIpLCAxNikgKyBcIiwgXCIgK1xyXG4gICAgICAgIHBhcnNlSW50KGhleC5zdWJzdHIoNSwgMiksIDE2KSArIFwiKVwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gaXNSZ2IoaGV4KSB8fCBpc1JnYmEoaGV4KSA/IGhleCA6IG51bGw7XHJcbn1cclxuXHJcbi8qXHJcbiAqXHRBZGp1c3QgdGhlIGJyaWdodG5lc3Mgb2YgYSBjb2xvciBieSBwZXJjZW50YWdlXHJcbiAqICBAcGFyYW0ge3N0cmluZ30gY29sb3I6IFRoZSBjb2xvciBzdHJpbmdcclxuICogIEBwYXJhbSB7ZmxvYXR9IHBlcmNlbnRhZ2U6IEEgZmxvYXQgd2l0aGluIFstMSwgMV0gYnkgd2hpY2ggdGhlIGJyaWdodG5lc3MgaXMgYWRqdXN0ZWQuXHJcbiAqXHRcdFx0XHRcdFx0XHQgICAxIG1lYW5zIG1heGltdW0gZGFya25lc3MgYW5kIC0xIG1lYW5zIG1heGltdW0gYnJpZ2h0bmVzcy5cclxuICovXHJcbmZ1bmN0aW9uIGFkanVzdENvbG9yQnJpZ2h0bmVzcyhjb2xvciwgcGVyY2VudGFnZSkge1xyXG4gICAgcGVyY2VudGFnZSA9IHBlcmNlbnRhZ2UgfHwgMDtcclxuICAgIGNvbG9yID0gaGV4VG9SZ2IoY29sb3IpO1xyXG5cclxuICAgIGlmIChjb2xvciAhPT0gbnVsbCkge1xyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vXHRVc2UgZGlmZmVyZW50IHJlZ2V4IGFuZCBmb3JtYXRzIGZvciByZ2IgYW5kIHJnYmFcclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICB2YXIgcmVneCA9IGlzUmdiKGNvbG9yKSA/XHJcbiAgICAgICAgICAgIC9bXFxkXXsxLDN9Wy5dP1tcXGRdKi9naSA6IC9bXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLC9naTtcclxuICAgICAgICB2YXIgcG9zdGZpeCA9IGlzUmdiKGNvbG9yKSA/ICcnIDogJywnO1xyXG5cclxuICAgICAgICAvL1x0TWF0aCAnbiwnIGluIG9yZGVyIHRvIGV4Y2x1ZGUgdGhlIGFscGhhXHJcbiAgICAgICAgcmV0dXJuIGNvbG9yLnJlcGxhY2UocmVneCwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHV0aWxzLmNsYW1wKChwYXJzZUludChlKSAqICgxIC0gcGVyY2VudGFnZSkpLCAwLCAyNTUpKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKCkgKyBwb3N0Zml4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKiAgRnVuY3Rpb24gdG8gZ2VuZXJhdGUgcmFuZG9tIGNvbG9yIHdpdGggcmFuZG9tIGJyaWdodG5lc3NcclxuICogIGJhc2VkIG9uIGEgZ2l2ZW4gY29sb3JcclxuICpcclxuICpcdEByZXR1cm4ge3N0cmluZ30gQSBzdHJpbmcgb2YgZ2VuZXJhdGVkIGNvbG9yXHJcbiAqICBAcGFyYW0ge3N0cmluZ30gYmFzZUNvbG9yOiBBIGNvbG9yIHN0cmluZyBpbiBIRVgsIFJHQiBvciBSR0JBXHJcbiAqXHRAcGFyYW0ge2Zsb2F0fSBicmlnaHRuZXNzSW50ZW5zaXR5KE9wdGlvbmFsKTogVGhlIGJyaWdodG5lc3MgaW50ZW5zaXR5IHdpdGhpbiBbMCwgMV0gdG8gZ2VuZXJhdGVcclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGFyb3VuZC4gMCBtZWFucyBnZW5lcmF0ZSBhcm91bmQgMCBicmlnaHRuZXNzIGNoYW5nZXMsXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAwLjUgbWVhbnMgZ2VuZXJhdGUgYXJvdW5kIDUwJSBicmlnaHRuZXNzIGNoYW5nZXMgYW5kXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAxIG1lYW5zIGdlbmVyYXRlIGFyb3VuZCBtYXhpbXVtIGJyaWdodG5lc3MgY2hhbmdlcy5cclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIFRoZSBicmlnaHRuZXNzIGNoYW5nZXMgd2lsbCBiZSBlaXRoZXIgZHJha2VuaW5nIG9yIGJyaWdodGVuaW5nLlxyXG4gKi9cclxuIGZ1bmN0aW9uIHJhbmRvbUNvbG9yKGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSl7XHJcbiAgICAgYnJpZ2h0bmVzc0ludGVuc2l0eSA9IGJyaWdodG5lc3NJbnRlbnNpdHkgfHwgMC41O1xyXG4gICAgIHZhciB0aHJlc2hvbGQgPSAwLjIsXHJcbiAgICAgICAgIHJhbmdlTG93ZXIgPSB1dGlscy5jbGFtcChicmlnaHRuZXNzSW50ZW5zaXR5IC0gdGhyZXNob2xkLCAwLCAxKSxcclxuICAgICAgICAgcmFuZ2VVcHBlciA9IHV0aWxzLmNsYW1wKGJyaWdodG5lc3NJbnRlbnNpdHkgKyB0aHJlc2hvbGQsIDAsIDEpO1xyXG5cclxuICAgICAvL1x0VXNlZCB0byBnZXQgYSBlaXRoZXIgbmVnYXRpdmUgb3IgcG9zaXRpdmUgcmFuZG9tIG51bWJlclxyXG4gICAgIHZhciByYW5kb21BcnIgPSBbXHJcbiAgICAgICAgIHV0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZShyYW5nZUxvd2VyLCByYW5nZVVwcGVyLCBmYWxzZSksXHJcbiAgICAgICAgIHV0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgtcmFuZ2VMb3dlciwgLXJhbmdlVXBwZXIsIGZhbHNlKV07XHJcblxyXG4gICAgIC8vXHRDb2xvciB2YWxpZGl0eSBjaGVja2luZyBpbiBhZGp1c3RDb2xvckJyaWdodG5lc3NcclxuICAgICByZXR1cm4gYWRqdXN0Q29sb3JCcmlnaHRuZXNzKGJhc2VDb2xvciwgcmFuZG9tQXJyW3V0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCAyKV0pO1xyXG4gfVxyXG5cclxuLypcclxuICogIEZ1bmN0aW9uIHRvIGdlbmVyYXRlIHJhbmRvbSBncmFkaWVudCBjb2xvciB3aXRoIHJhbmRvbSBicmlnaHRuZXNzIG9uIGJvdGggc2lkZXNcclxuICogIG9mIHRoZSBsaW5lYXIgZ3JhZGllbnQgYmFzZWQgb24gYSBnaXZlbiBjb2xvclxyXG4gKlxyXG4gKlx0QHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcGFpciBvZiBjb2xvcnNcclxuICogIEBwYXJhbSB7c3RyaW5nfSBiYXNlQ29sb3I6IEEgY29sb3Igc3RyaW5nIGluIEhFWCwgUkdCIG9yIFJHQkFcclxuICpcdEBwYXJhbSB7ZmxvYXR9IGJyaWdodG5lc3NJbnRlbnNpdHkoT3B0aW9uYWwpOiBUaGUgYnJpZ2h0bmVzcyBpbnRlbnNpdHkgd2l0aGluIFswLCAxXSB0byBnZW5lcmF0ZVxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgYXJvdW5kLiBUaGUgc2FtZSBhcyB0aGUgb25lIGluIHJhbmRvbUNvbG9yXHJcbiAqL1xyXG4gZnVuY3Rpb24gcmFuZG9tR3JhZGllbnQoYmFzZUNvbG9yLCBicmlnaHRuZXNzSW50ZW5zaXR5KSB7XHJcbiAgICAgYnJpZ2h0bmVzc0ludGVuc2l0eSA9IGJyaWdodG5lc3NJbnRlbnNpdHkgfHwgMC41O1xyXG4gICAgIHJldHVybiB7XHJcbiAgICAgICAgIGZpcnN0OiByYW5kb21Db2xvcihiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpLFxyXG4gICAgICAgICBzZWNvbmQ6IHJhbmRvbUNvbG9yKGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSlcclxuICAgICB9O1xyXG4gfVxyXG5cclxuLy8gIEV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMuaXNIZXggPSBpc0hleDtcclxubW9kdWxlLmV4cG9ydHMuaXNSZ2IgPSBpc1JnYjtcclxubW9kdWxlLmV4cG9ydHMuaXNSZ2JhID0gaXNSZ2JhO1xyXG5tb2R1bGUuZXhwb3J0cy5oZXhUb1JnYiA9IGhleFRvUmdiO1xyXG5tb2R1bGUuZXhwb3J0cy5hZGp1c3RDb2xvckJyaWdodG5lc3MgPSBhZGp1c3RDb2xvckJyaWdodG5lc3M7XHJcbm1vZHVsZS5leHBvcnRzLnJhbmRvbUNvbG9yID0gcmFuZG9tQ29sb3I7XHJcbm1vZHVsZS5leHBvcnRzLnJhbmRvbUdyYWRpZW50ID0gcmFuZG9tR3JhZGllbnQ7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29sb3JVdGlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=