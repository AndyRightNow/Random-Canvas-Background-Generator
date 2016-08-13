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
	var Modes = __webpack_require__(5);
	
	var htmlTest = {};
	
	htmlTest.run = function(canvasId){
	    var poly = new utils.Polygon([
	        new Vector(100, 100),
	        new Vector(200, 200),
	        new Vector(100, 200)
	    ]);
	    var back = new RandomBackgroundGenerator(canvasId);
	    back._fillPolygon("#4183D7", poly, true);
	
	
	    console.log(Modes['Polygonal']);
	};
	
	module.exports = htmlTest;


/***/ },
/* 1 */
/***/ function(module, exports) {

	/*
	 *              Vector Class
	 *
	 *      Vector and vector operations.
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
	 * Random Canvas Background Generator
	 *
	 * It's used on HTML Canvas to generate random background in a certain pattern
	 * with certain customized parameters and modes. The background
	 * will update every time you call generate()
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
	* @param {string} canvasId: The id of the canvas you want to generate background on
	* @param {string} mode: The pattern in which the background is generated.
	*						 Currently Support: 1. "Polygonal"
	*/
	function RandomBackgroundGenerator(canvasId, mode) {
		//	Initialize
		this._mode = mode || POLYGONAL;
		this._canvas = typeof document !== 'undefined' ? document.getElementById(canvasId) : null;
		this._canvasContext = this._canvas ? this._canvas.getContext('2d') : null;
	}
	
	/*
	 * Private helper function used to draw polygon on the canvas
	 *
	 * @param {string} color: A HEX, RGB or RGBA color in the form of
	 *						   "#000000", "rgb(0, 0, 0)" or "rgba(0, 0, 0, 1)"
	 * @param {Array} points: An array of Point objects
	 * @param {boolean} gradient: A flag indicating if linear-gradient is enabled.
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
			if (polygon.points.length === 3) {	//	If it's a triangle
				//-------------------------------------------
				//	Start and end points of the linear gradient
				//	The start point is randomly selected
				//-------------------------------------------
				let startPoint = polygon.points[utils.getRandomNumberFromRange(0, polygon.points.length)];
				let endPoint;
	
				//-------------------------------------
				//	Fetch points other than the start point
				//	out of the polygon
				//-------------------------------------
				let index = polygon.points.indexOf(startPoint);
				let line = [];
				for (let i = 0; i < polygon.points.length; i++)
					if (i !== index) line.push(polygon.points[i]);
	
				//-------------------------------------
				//	Project the start point to the line
				//	it's facing and that's the end point
				//-------------------------------------
				let axis = new Vector(line[0].x - line[1].x, line[0].y - line[1].y);
				endPoint = startPoint.project(axis);
	
				//	Create the linear gradient object
				let grad = this._canvasContext.createLinearGradient(
					startPoint.x, startPoint.y, endPoint.x, endPoint.y);
	
				//------------------------------------
				//	Get random linear gradient colors
				//	and add colors
				//------------------------------------
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
	
	RandomBackgroundGenerator.prototype.generate = function(){
		//	Clear the canvas
	
		//	Draw the background
			//	Generate points on the canvas
	
			//	Connect all adjacent points
	
			//	Fill the triangles formed by the points
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
	
	        //-------------------------------------------------
	        //  Replace the r, g and b with adjusted numbers and
	        //  round them to integers
	        //-------------------------------------------------
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
	 * Mode object
	 *
	 * The mode object (e.g. 'Polygonal') responsible for generating points and
	 * specifying drawing rules for itself
	 */
	
	 function Mode() {
	
	 }
	
	var PolygonalMode = Object.create(Mode.prototype);
	
	PolygonalMode.prototype.name = 'Polygonal';
	
	module.exports = {
	    Polygonal: PolygonalMode
	};


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTBlMWViODdjZWM4ZGUxYTJiMWIiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sb3JVdGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNuREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtB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QTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLE9BQU87QUFDbkIsYUFBWSxPQUFPO0FBQ25CLFlBQVcsTUFBTTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBIiwiZmlsZSI6Imh0bWxUZXN0X2Rpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGEwZTFlYjg3Y2VjOGRlMWEyYjFiXG4gKiovIiwidmFyIFZlY3RvciA9IHJlcXVpcmUoJy4vLi4vLi4vc3JjL3ZlY3RvcicpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uL3NyYy91dGlscycpO1xyXG52YXIgUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vLi4vLi4vc3JjL1JhbmRvbUJhY2tncm91bmRHZW5lcmF0b3InKTtcclxudmFyIE1vZGVzID0gcmVxdWlyZSgnLi8uLi8uLi9zcmMvbW9kZXMnKTtcclxuXHJcbnZhciBodG1sVGVzdCA9IHt9O1xyXG5cclxuaHRtbFRlc3QucnVuID0gZnVuY3Rpb24oY2FudmFzSWQpe1xyXG4gICAgdmFyIHBvbHkgPSBuZXcgdXRpbHMuUG9seWdvbihbXHJcbiAgICAgICAgbmV3IFZlY3RvcigxMDAsIDEwMCksXHJcbiAgICAgICAgbmV3IFZlY3RvcigyMDAsIDIwMCksXHJcbiAgICAgICAgbmV3IFZlY3RvcigxMDAsIDIwMClcclxuICAgIF0pO1xyXG4gICAgdmFyIGJhY2sgPSBuZXcgUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvcihjYW52YXNJZCk7XHJcbiAgICBiYWNrLl9maWxsUG9seWdvbihcIiM0MTgzRDdcIiwgcG9seSwgdHJ1ZSk7XHJcblxyXG5cclxuICAgIGNvbnNvbGUubG9nKE1vZGVzWydQb2x5Z29uYWwnXSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGh0bWxUZXN0O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcbiAqICAgICAgICAgICAgICBWZWN0b3IgQ2xhc3NcclxuICpcclxuICogICAgICBWZWN0b3IgYW5kIHZlY3RvciBvcGVyYXRpb25zLlxyXG4gKi9cclxuXHJcbi8qXHJcbiAqICBDb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gVmVjdG9yKHgsIHkpe1xyXG5cdHRoaXMueCA9IHggfHwgMDtcclxuXHR0aGlzLnkgPSB5IHx8IDA7XHJcbn1cclxuXHJcblZlY3Rvci5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odil7XHJcblx0cmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueTtcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUubGVuMiA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMuZG90KHRoaXMpO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5sZW4gPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBNYXRoLnNxcnQodGhpcy5sZW4yKCkpO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uKHN4LCBzeSl7XHJcblx0dGhpcy54ICo9IHN4O1xyXG5cdHRoaXMueSAqPSBzeSB8fCBzeDtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24odil7XHJcblx0dGhpcy54IC09IHYueDtcclxuXHR0aGlzLnkgLT0gdi55O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHRObyBzaWRlIGVmZmVjdCBhbmQgY2hhaW5pbmdcclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblZlY3Rvci5wcm90b3R5cGUucHJvamVjdCA9IGZ1bmN0aW9uKGF4aXMpe1xyXG5cdHZhciBjb2YgPSAgdGhpcy5kb3QoYXhpcykgLyBheGlzLmxlbjIoKTtcclxuXHRyZXR1cm4gYXhpcy5zY2FsZShjb2YpO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5wcm9qZWN0TiA9IGZ1bmN0aW9uKGF4aXMpe1xyXG5cdHZhciBjb2YgPSAgdGhpcy5kb3QoYXhpcyk7XHJcblx0cmV0dXJuIGF4aXMuc2NhbGUoY29mKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3ZlY3Rvci5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBWZWN0b3IgPSByZXF1aXJlKCcuL3ZlY3RvcicpO1xyXG5cclxuLypcclxuICpcdFBvbHlnb24gY2xhc3NcclxuICovXHJcbmZ1bmN0aW9uIFBvbHlnb24ocG9pbnRzKSB7XHJcbiAgICB0aGlzLl9wb2ludHMgPSBwb2ludHMgfHwgW107XHJcbn1cclxuUG9seWdvbi5wcm90b3R5cGUgPSB7XHJcbiAgICBnZXQgcG9pbnRzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb2ludHM7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldCBwb2ludHMocG9pbnRzKSB7XHJcbiAgICAgICAgdGhpcy5fcG9pbnRzID0gcG9pbnRzO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLypcclxuICogIENsYW1wIGEgbnVtYmVyIHdpdGhpbiBhIHJhbmdlXHJcbiAqL1xyXG5mdW5jdGlvbiBjbGFtcCh4LCBsb3dlciwgdXBwZXIpe1xyXG4gICAgcmV0dXJuIHggPCBsb3dlciA/IGxvd2VyIDogeCA+IHVwcGVyID8gdXBwZXIgOiB4O1xyXG59XHJcblxyXG4vKlxyXG4gKlx0R2V0IGEgcmFuZG9tIG51bWJlciBmcm9tIGEgcmFuZ2VcclxuICpcclxuICpcdEByZXR1cm4ge2ludCAvIGZsb2F0fSBBIHJhbmRvbWx5IGdlbmVyYXRlZCBudW1iZXIgd2l0aGluIGEgcmFuZ2VcclxuICpcdEBwYXJhbSB7aW50IC8gZmxvYXR9IGxvd2VyOiBUaGUgbG93ZXIgYm91bmQgb2YgdGhlIHJhbmdlKEluY2x1c2l2ZSlcclxuICpcdEBwYXJhbSB7aW50IC8gZmxvYXR9IHVwcGVyOiBUaGUgdXBwZXIgYm91bmQgb2YgdGhlIHJhbmdlKEV4Y2x1c2l2ZSlcclxuICpcdEBwYXJhbSB7Ym9vbGVhbn0gaXNJbnQ6IFRoZSBmbGFnIHRvIHNwZWNpZnkgd2hldGhlciB0aGUgcmVzdWx0IGlzIGludCBvciBmbG9hdFxyXG4gKi9cclxuIGZ1bmN0aW9uIGdldFJhbmRvbU51bWJlckZyb21SYW5nZShsb3dlciwgdXBwZXIsIGlzSW50KSB7XHJcbiAgICAgaXNJbnQgPSBpc0ludCB8fCB0cnVlO1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy9cdFNvbWUgcmFuZG9tIG51bWJlcnMganVzdCBjb21pbmcgb3V0IG9mIG5vd2hlcmVcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHZhciBzb21lUmFuZG9tTnVtYmVyMSA9IDEyODUsXHJcbiAgICAgICAgc29tZVJhbmRvbU51bWJlcjIgPSAyMzkxO1xyXG5cclxuICAgIC8vXHRHZW5lcmF0ZSB0aGUgaW50ZWdlciBwYXJ0XHJcbiAgICB2YXIgcmFuZG9tSW50ID1cclxuICAgICAgICBwYXJzZUludChNYXRoLnJhbmRvbSgpICogc29tZVJhbmRvbU51bWJlcjEgKiBNYXRoLnJhbmRvbSgpICogc29tZVJhbmRvbU51bWJlcjIpICUgKHVwcGVyIC0gbG93ZXIpO1xyXG5cclxuICAgIGlmIChpc0ludCkge1xyXG4gICAgICAgIHJldHVybiBsb3dlciArIHJhbmRvbUludDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGxvd2VyICsgcmFuZG9tSW50ICsgTWF0aC5yYW5kb20oKTtcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuICogIEdldCBhIHJhbmRvbSBwb2ludCBvbiBhIHJlY3RhbmdsZVxyXG4gKlxyXG4gKlx0QHBhcmFtIHtWZWN0b3J9IHAxLCBwMiwgcDMsIHA0OiBQb2ludHMgb2YgYSByZWN0YW5nbGUgc3RhcnRpbmdcclxuICpcdFx0XHRcdFx0XHRcdFx0ICAgZnJvbSB0aGUgdG9wIGxlZnQgY29ybmVyIGFuZCBnb2luZ1xyXG4gKlx0XHRcdFx0XHRcdFx0XHQgICBjbG9ja3dpc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSYW5kb21Qb2ludE9uUmVjdChwMSwgcDIsIHAzLCBwNCkge1xyXG4gICAgdmFyIHdpZHRoID0gTWF0aC5hYnMocDIueCAtIHAxLngpLFxyXG4gICAgICAgIGhlaWdodCA9IE1hdGguYWJzKHAzLnkgLSBwMi55KSxcclxuICAgICAgICB0b3BMZWZ0WCA9IE1hdGgubWluKHAxLngsIHAyLngsIHAzLngsIHA0LngpLFxyXG4gICAgICAgIHRvcExlZnRZID0gTWF0aC5taW4ocDEueSwgcDIueSwgcDMueSwgcDQueSk7XHJcblxyXG4gICAgdmFyIHJhbmRvbURlbHRhWCA9IGdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCB3aWR0aCwgZmFsc2UpLFxyXG4gICAgICAgIHJhbmRvbURlbHRhWSA9IGdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCBoZWlnaHQsIGZhbHNlKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IFZlY3Rvcih0b3BMZWZ0WCArIHJhbmRvbURlbHRhWCwgdG9wTGVmdFkgKyByYW5kb21EZWx0YVkpO1xyXG59XHJcblxyXG4vKlxyXG4gKiAgR2V0IGEgcmFuZG9tIHBvaW50IG9uIGEgbGluZVxyXG4gKiAgQHBhcmFtIHtWZWN0b3J9IHAxLCBwMjogUG9pbnRzIG9mIGEgbGluZSBmcm9tIGxlZnQgdG8gcmlnaHRcclxuICovXHJcbmZ1bmN0aW9uIGdldFJhbmRvbVBvaW50T25MaW5lKHAxLCBwMikge1xyXG4gICAgdmFyIHByb2plY3Rpb25XaWR0aCA9IE1hdGguYWJzKHAxLnggLSBwMi54KSxcclxuICAgICAgICBsZWZ0WCA9IE1hdGgubWluKHAxLngsIHAyLngpO1xyXG5cclxuICAgIHZhciBBID0gKHAxLnkgLSBwMi55KSAvIChwMS54IC0gcDIueCksXHJcbiAgICAgICAgQiA9IHAxLnkgLSBBICogcDEueDtcclxuXHJcbiAgICB2YXIgcmFuZG9tRGVsdGFYID0gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIHByb2plY3Rpb25XaWR0aCwgZmFsc2UpO1xyXG4gICAgcmV0dXJuIG5ldyBWZWN0b3IobGVmdFggKyByYW5kb21EZWx0YVgsIEEgKiAobGVmdFggKyByYW5kb21EZWx0YVgpICsgQik7XHJcbn1cclxuXHJcbi8vICBFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzLlBvbHlnb24gPSBQb2x5Z29uO1xyXG5tb2R1bGUuZXhwb3J0cy5jbGFtcCA9IGNsYW1wO1xyXG5tb2R1bGUuZXhwb3J0cy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UgPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2U7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbVBvaW50T25SZWN0ID0gZ2V0UmFuZG9tUG9pbnRPblJlY3Q7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbVBvaW50T25MaW5lID0gZ2V0UmFuZG9tUG9pbnRPbkxpbmU7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKmpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbi8qXHJcbiAqIFJhbmRvbSBDYW52YXMgQmFja2dyb3VuZCBHZW5lcmF0b3JcclxuICpcclxuICogSXQncyB1c2VkIG9uIEhUTUwgQ2FudmFzIHRvIGdlbmVyYXRlIHJhbmRvbSBiYWNrZ3JvdW5kIGluIGEgY2VydGFpbiBwYXR0ZXJuXHJcbiAqIHdpdGggY2VydGFpbiBjdXN0b21pemVkIHBhcmFtZXRlcnMgYW5kIG1vZGVzLiBUaGUgYmFja2dyb3VuZFxyXG4gKiB3aWxsIHVwZGF0ZSBldmVyeSB0aW1lIHlvdSBjYWxsIGdlbmVyYXRlKClcclxuICpcclxuICovXHJcblxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cdERlcGVuZGVuY2llc1xyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG52YXIgY29sb3JVdGlscyA9IHJlcXVpcmUoJy4vY29sb3JVdGlscycpO1xyXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi92ZWN0b3InKTtcclxuXHJcbi8qXHJcbipcdENvbnN0YW50IHN0cmluZyBuYW1lXHJcbiovXHJcbmNvbnN0IFBPTFlHT05BTCA9IFwiUG9seWdvbmFsXCI7XHJcblxyXG4vKlxyXG4qIENvbnN0cnVjdG9yXHJcbipcclxuKiBAcGFyYW0ge3N0cmluZ30gY2FudmFzSWQ6IFRoZSBpZCBvZiB0aGUgY2FudmFzIHlvdSB3YW50IHRvIGdlbmVyYXRlIGJhY2tncm91bmQgb25cclxuKiBAcGFyYW0ge3N0cmluZ30gbW9kZTogVGhlIHBhdHRlcm4gaW4gd2hpY2ggdGhlIGJhY2tncm91bmQgaXMgZ2VuZXJhdGVkLlxyXG4qXHRcdFx0XHRcdFx0IEN1cnJlbnRseSBTdXBwb3J0OiAxLiBcIlBvbHlnb25hbFwiXHJcbiovXHJcbmZ1bmN0aW9uIFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IoY2FudmFzSWQsIG1vZGUpIHtcclxuXHQvL1x0SW5pdGlhbGl6ZVxyXG5cdHRoaXMuX21vZGUgPSBtb2RlIHx8IFBPTFlHT05BTDtcclxuXHR0aGlzLl9jYW52YXMgPSB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIDogbnVsbDtcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0ID0gdGhpcy5fY2FudmFzID8gdGhpcy5fY2FudmFzLmdldENvbnRleHQoJzJkJykgOiBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIGhlbHBlciBmdW5jdGlvbiB1c2VkIHRvIGRyYXcgcG9seWdvbiBvbiB0aGUgY2FudmFzXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogQSBIRVgsIFJHQiBvciBSR0JBIGNvbG9yIGluIHRoZSBmb3JtIG9mXHJcbiAqXHRcdFx0XHRcdFx0ICAgXCIjMDAwMDAwXCIsIFwicmdiKDAsIDAsIDApXCIgb3IgXCJyZ2JhKDAsIDAsIDAsIDEpXCJcclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzOiBBbiBhcnJheSBvZiBQb2ludCBvYmplY3RzXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZ3JhZGllbnQ6IEEgZmxhZyBpbmRpY2F0aW5nIGlmIGxpbmVhci1ncmFkaWVudCBpcyBlbmFibGVkLlxyXG4gKlx0XHRcdFx0XHRcdFx0ICAgVGhlIGdyYWRpZW50IHdpbGwgYmUgcmFuZG9tbHkgZ2VuZXJhdGVkLlxyXG4gKlxyXG4gKi9cclxuUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5wcm90b3R5cGUuX2ZpbGxQb2x5Z29uID0gZnVuY3Rpb24oY29sb3IsIHBvbHlnb24sIGdyYWRpZW50KSB7XHJcblx0Z3JhZGllbnQgPSBncmFkaWVudCB8fCBmYWxzZTtcclxuXHJcblx0Ly9cdFNhdmUgdGhlIHByZXZpb3VzIHN0YXRlc1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuc2F2ZSgpO1xyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8vXHRTZXQgdGhlIGNvbG9yXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRpZiAoZ3JhZGllbnQpIHtcclxuXHRcdGlmIChwb2x5Z29uLnBvaW50cy5sZW5ndGggPT09IDMpIHtcdC8vXHRJZiBpdCdzIGEgdHJpYW5nbGVcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdC8vXHRTdGFydCBhbmQgZW5kIHBvaW50cyBvZiB0aGUgbGluZWFyIGdyYWRpZW50XHJcblx0XHRcdC8vXHRUaGUgc3RhcnQgcG9pbnQgaXMgcmFuZG9tbHkgc2VsZWN0ZWRcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdGxldCBzdGFydFBvaW50ID0gcG9seWdvbi5wb2ludHNbdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIHBvbHlnb24ucG9pbnRzLmxlbmd0aCldO1xyXG5cdFx0XHRsZXQgZW5kUG9pbnQ7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ly9cdEZldGNoIHBvaW50cyBvdGhlciB0aGFuIHRoZSBzdGFydCBwb2ludFxyXG5cdFx0XHQvL1x0b3V0IG9mIHRoZSBwb2x5Z29uXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgaW5kZXggPSBwb2x5Z29uLnBvaW50cy5pbmRleE9mKHN0YXJ0UG9pbnQpO1xyXG5cdFx0XHRsZXQgbGluZSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBvbHlnb24ucG9pbnRzLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdGlmIChpICE9PSBpbmRleCkgbGluZS5wdXNoKHBvbHlnb24ucG9pbnRzW2ldKTtcclxuXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0UHJvamVjdCB0aGUgc3RhcnQgcG9pbnQgdG8gdGhlIGxpbmVcclxuXHRcdFx0Ly9cdGl0J3MgZmFjaW5nIGFuZCB0aGF0J3MgdGhlIGVuZCBwb2ludFxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0bGV0IGF4aXMgPSBuZXcgVmVjdG9yKGxpbmVbMF0ueCAtIGxpbmVbMV0ueCwgbGluZVswXS55IC0gbGluZVsxXS55KTtcclxuXHRcdFx0ZW5kUG9pbnQgPSBzdGFydFBvaW50LnByb2plY3QoYXhpcyk7XHJcblxyXG5cdFx0XHQvL1x0Q3JlYXRlIHRoZSBsaW5lYXIgZ3JhZGllbnQgb2JqZWN0XHJcblx0XHRcdGxldCBncmFkID0gdGhpcy5fY2FudmFzQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcclxuXHRcdFx0XHRzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0R2V0IHJhbmRvbSBsaW5lYXIgZ3JhZGllbnQgY29sb3JzXHJcblx0XHRcdC8vXHRhbmQgYWRkIGNvbG9yc1xyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgcmFuZG9tSW50ZW5zaXR5ID0gTWF0aC5yYW5kb20oKSArIDEgKiAwLjU7XHJcblx0XHRcdGxldCBncmFkQ29sb3JzID0gY29sb3JVdGlscy5yYW5kb21HcmFkaWVudChjb2xvclV0aWxzLnJhbmRvbUNvbG9yKGNvbG9yKSwgcmFuZG9tSW50ZW5zaXR5KTtcclxuXHRcdFx0Z3JhZC5hZGRDb2xvclN0b3AoMCwgZ3JhZENvbG9ycy5maXJzdCk7XHJcblx0XHRcdGdyYWQuYWRkQ29sb3JTdG9wKDEsIGdyYWRDb2xvcnMuc2Vjb25kKTtcclxuXHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gZ3JhZDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ly9cdERyYXcgdGhlIHBvbHlnb25cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5iZWdpblBhdGgoKTtcclxuXHR2YXIgcG9pbnRzID0gcG9seWdvbi5wb2ludHM7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQubW92ZVRvKHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmxpbmVUbyhwb2ludHNbaV0ueCwgcG9pbnRzW2ldLnkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbCgpO1xyXG5cclxuXHQvL1x0UmVzdG9yZSBwcmV2aW91cyBzdGF0ZXNcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LnJlc3RvcmUoKTtcclxufTtcclxuXHJcblJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oKXtcclxuXHQvL1x0Q2xlYXIgdGhlIGNhbnZhc1xyXG5cclxuXHQvL1x0RHJhdyB0aGUgYmFja2dyb3VuZFxyXG5cdFx0Ly9cdEdlbmVyYXRlIHBvaW50cyBvbiB0aGUgY2FudmFzXHJcblxyXG5cdFx0Ly9cdENvbm5lY3QgYWxsIGFkamFjZW50IHBvaW50c1xyXG5cclxuXHRcdC8vXHRGaWxsIHRoZSB0cmlhbmdsZXMgZm9ybWVkIGJ5IHRoZSBwb2ludHNcclxufTtcclxuXHJcbi8vXHRFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzID0gUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvcjtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxuLypcclxuICogIENoZWNrIGlmIGEgc3RyaW5nIGlzIGluIGEgaGV4IGNvbG9yIGZvcm1hdFxyXG4gKiAgQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGluIGEgaGV4IGZvcm1hdFxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29sb3JcclxuICovXHJcbmZ1bmN0aW9uIGlzSGV4KGNvbG9yKSB7XHJcbiAgICByZXR1cm4gLyNbYS1mMC05XXs2fS9naS50ZXN0KGNvbG9yKTtcclxufVxyXG5cclxuLypcclxuICogIENoZWNrIGlmIGEgc3RyaW5nIGlzIGluIGEgcmdiIGNvbG9yIGZvcm1hdFxyXG4gKiAgQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGluIGEgcmdiIGZvcm1hdFxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29sb3JcclxuICovXHJcbiBmdW5jdGlvbiBpc1JnYihjb2xvcikge1xyXG4gICAgLy8gIEVsaW1pbmF0ZSB3aGl0ZSBzcGFjZXNcclxuICAgIGNvbG9yID0gY29sb3IucmVwbGFjZSgvXFxzL2csIFwiXCIpO1xyXG4gICAgcmV0dXJuIC9yZ2JcXChbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCkvaS50ZXN0KGNvbG9yKTtcclxufVxyXG4gLypcclxuKiAgQ2hlY2sgaWYgYSBzdHJpbmcgaXMgaW4gYSByZ2JhIGNvbG9yIGZvcm1hdFxyXG4qICBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBzdHJpbmcgaXMgaW4gYSByZ2JhIGZvcm1hdFxyXG4qICBAcGFyYW0ge3N0cmluZ30gY29sb3I6IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb2xvclxyXG4qL1xyXG5mdW5jdGlvbiBpc1JnYmEoY29sb3IpIHtcclxuIC8vICBFbGltaW5hdGUgd2hpdGUgc3BhY2VzXHJcbiBjb2xvciA9IGNvbG9yLnJlcGxhY2UoL1xccy9nLCBcIlwiKTtcclxuIHJldHVybiAvcmdiYVxcKFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwpL2kudGVzdChjb2xvcik7XHJcblxyXG59XHJcblxyXG4vKlxyXG4gKlx0Q29udmVydCBoZXggY29sb3IgdG8gcmdiIGNvbG9yXHJcbiAqICBAcmV0dXJuIHtzdHJpbmcgLyBudWxsfSBDb252ZXJ0ZWQgY29sb3Igc3RyaW5nIG9yIG51bGwgaWYgdGhlIGlucHV0IGlzIGludmFsaWRcclxuICovXHJcbmZ1bmN0aW9uIGhleFRvUmdiKGhleCkge1xyXG4gICAgaWYgKGlzSGV4KGhleCkpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2IoXCIgK1xyXG4gICAgICAgIHBhcnNlSW50KGhleC5zdWJzdHIoMSwgMiksIDE2KSArIFwiLCBcIiArXHJcbiAgICAgICAgcGFyc2VJbnQoaGV4LnN1YnN0cigzLCAyKSwgMTYpICsgXCIsIFwiICtcclxuICAgICAgICBwYXJzZUludChoZXguc3Vic3RyKDUsIDIpLCAxNikgKyBcIilcIjtcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIGlzUmdiKGhleCkgfHwgaXNSZ2JhKGhleCkgPyBoZXggOiBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKlx0QWRqdXN0IHRoZSBicmlnaHRuZXNzIG9mIGEgY29sb3IgYnkgcGVyY2VudGFnZVxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgY29sb3Igc3RyaW5nXHJcbiAqICBAcGFyYW0ge2Zsb2F0fSBwZXJjZW50YWdlOiBBIGZsb2F0IHdpdGhpbiBbLTEsIDFdIGJ5IHdoaWNoIHRoZSBicmlnaHRuZXNzIGlzIGFkanVzdGVkLlxyXG4gKlx0XHRcdFx0XHRcdFx0ICAgMSBtZWFucyBtYXhpbXVtIGRhcmtuZXNzIGFuZCAtMSBtZWFucyBtYXhpbXVtIGJyaWdodG5lc3MuXHJcbiAqL1xyXG5mdW5jdGlvbiBhZGp1c3RDb2xvckJyaWdodG5lc3MoY29sb3IsIHBlcmNlbnRhZ2UpIHtcclxuICAgIHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlIHx8IDA7XHJcbiAgICBjb2xvciA9IGhleFRvUmdiKGNvbG9yKTtcclxuXHJcbiAgICBpZiAoY29sb3IgIT09IG51bGwpIHtcclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvL1x0VXNlIGRpZmZlcmVudCByZWdleCBhbmQgZm9ybWF0cyBmb3IgcmdiIGFuZCByZ2JhXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgdmFyIHJlZ3ggPSBpc1JnYihjb2xvcikgP1xyXG4gICAgICAgICAgICAvW1xcZF17MSwzfVsuXT9bXFxkXSovZ2kgOiAvW1xcZF17MSwzfVsuXT9bXFxkXSpcXCwvZ2k7XHJcbiAgICAgICAgdmFyIHBvc3RmaXggPSBpc1JnYihjb2xvcikgPyAnJyA6ICcsJztcclxuXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gIFJlcGxhY2UgdGhlIHIsIGcgYW5kIGIgd2l0aCBhZGp1c3RlZCBudW1iZXJzIGFuZFxyXG4gICAgICAgIC8vICByb3VuZCB0aGVtIHRvIGludGVnZXJzXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgcmV0dXJuIGNvbG9yLnJlcGxhY2UocmVneCwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHV0aWxzLmNsYW1wKChwYXJzZUludChlKSAqICgxIC0gcGVyY2VudGFnZSkpLCAwLCAyNTUpKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKCkgKyBwb3N0Zml4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKiAgRnVuY3Rpb24gdG8gZ2VuZXJhdGUgcmFuZG9tIGNvbG9yIHdpdGggcmFuZG9tIGJyaWdodG5lc3NcclxuICogIGJhc2VkIG9uIGEgZ2l2ZW4gY29sb3JcclxuICpcclxuICpcdEByZXR1cm4ge3N0cmluZ30gQSBzdHJpbmcgb2YgZ2VuZXJhdGVkIGNvbG9yXHJcbiAqICBAcGFyYW0ge3N0cmluZ30gYmFzZUNvbG9yOiBBIGNvbG9yIHN0cmluZyBpbiBIRVgsIFJHQiBvciBSR0JBXHJcbiAqXHRAcGFyYW0ge2Zsb2F0fSBicmlnaHRuZXNzSW50ZW5zaXR5KE9wdGlvbmFsKTogVGhlIGJyaWdodG5lc3MgaW50ZW5zaXR5IHdpdGhpbiBbMCwgMV0gdG8gZ2VuZXJhdGVcclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGFyb3VuZC4gMCBtZWFucyBnZW5lcmF0ZSBhcm91bmQgMCBicmlnaHRuZXNzIGNoYW5nZXMsXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAwLjUgbWVhbnMgZ2VuZXJhdGUgYXJvdW5kIDUwJSBicmlnaHRuZXNzIGNoYW5nZXMgYW5kXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAxIG1lYW5zIGdlbmVyYXRlIGFyb3VuZCBtYXhpbXVtIGJyaWdodG5lc3MgY2hhbmdlcy5cclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIFRoZSBicmlnaHRuZXNzIGNoYW5nZXMgd2lsbCBiZSBlaXRoZXIgZHJha2VuaW5nIG9yIGJyaWdodGVuaW5nLlxyXG4gKi9cclxuIGZ1bmN0aW9uIHJhbmRvbUNvbG9yKGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSl7XHJcbiAgICAgYnJpZ2h0bmVzc0ludGVuc2l0eSA9IGJyaWdodG5lc3NJbnRlbnNpdHkgfHwgMC41O1xyXG4gICAgIHZhciB0aHJlc2hvbGQgPSAwLjIsXHJcbiAgICAgICAgIHJhbmdlTG93ZXIgPSB1dGlscy5jbGFtcChicmlnaHRuZXNzSW50ZW5zaXR5IC0gdGhyZXNob2xkLCAwLCAxKSxcclxuICAgICAgICAgcmFuZ2VVcHBlciA9IHV0aWxzLmNsYW1wKGJyaWdodG5lc3NJbnRlbnNpdHkgKyB0aHJlc2hvbGQsIDAsIDEpO1xyXG5cclxuICAgICAvL1x0VXNlZCB0byBnZXQgYSBlaXRoZXIgbmVnYXRpdmUgb3IgcG9zaXRpdmUgcmFuZG9tIG51bWJlclxyXG4gICAgIHZhciByYW5kb21BcnIgPSBbXHJcbiAgICAgICAgIHV0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZShyYW5nZUxvd2VyLCByYW5nZVVwcGVyLCBmYWxzZSksXHJcbiAgICAgICAgIHV0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgtcmFuZ2VMb3dlciwgLXJhbmdlVXBwZXIsIGZhbHNlKV07XHJcblxyXG4gICAgIC8vXHRDb2xvciB2YWxpZGl0eSBjaGVja2luZyBpbiBhZGp1c3RDb2xvckJyaWdodG5lc3NcclxuICAgICByZXR1cm4gYWRqdXN0Q29sb3JCcmlnaHRuZXNzKGJhc2VDb2xvciwgcmFuZG9tQXJyW3V0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCAyKV0pO1xyXG4gfVxyXG5cclxuLypcclxuICogIEZ1bmN0aW9uIHRvIGdlbmVyYXRlIHJhbmRvbSBncmFkaWVudCBjb2xvciB3aXRoIHJhbmRvbSBicmlnaHRuZXNzIG9uIGJvdGggc2lkZXNcclxuICogIG9mIHRoZSBsaW5lYXIgZ3JhZGllbnQgYmFzZWQgb24gYSBnaXZlbiBjb2xvclxyXG4gKlxyXG4gKlx0QHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcGFpciBvZiBjb2xvcnNcclxuICogIEBwYXJhbSB7c3RyaW5nfSBiYXNlQ29sb3I6IEEgY29sb3Igc3RyaW5nIGluIEhFWCwgUkdCIG9yIFJHQkFcclxuICpcdEBwYXJhbSB7ZmxvYXR9IGJyaWdodG5lc3NJbnRlbnNpdHkoT3B0aW9uYWwpOiBUaGUgYnJpZ2h0bmVzcyBpbnRlbnNpdHkgd2l0aGluIFswLCAxXSB0byBnZW5lcmF0ZVxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgYXJvdW5kLiBUaGUgc2FtZSBhcyB0aGUgb25lIGluIHJhbmRvbUNvbG9yXHJcbiAqL1xyXG4gZnVuY3Rpb24gcmFuZG9tR3JhZGllbnQoYmFzZUNvbG9yLCBicmlnaHRuZXNzSW50ZW5zaXR5KSB7XHJcbiAgICAgYnJpZ2h0bmVzc0ludGVuc2l0eSA9IGJyaWdodG5lc3NJbnRlbnNpdHkgfHwgMC41O1xyXG4gICAgIHJldHVybiB7XHJcbiAgICAgICAgIGZpcnN0OiByYW5kb21Db2xvcihiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpLFxyXG4gICAgICAgICBzZWNvbmQ6IHJhbmRvbUNvbG9yKGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSlcclxuICAgICB9O1xyXG4gfVxyXG5cclxuLy8gIEV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMuaXNIZXggPSBpc0hleDtcclxubW9kdWxlLmV4cG9ydHMuaXNSZ2IgPSBpc1JnYjtcclxubW9kdWxlLmV4cG9ydHMuaXNSZ2JhID0gaXNSZ2JhO1xyXG5tb2R1bGUuZXhwb3J0cy5oZXhUb1JnYiA9IGhleFRvUmdiO1xyXG5tb2R1bGUuZXhwb3J0cy5hZGp1c3RDb2xvckJyaWdodG5lc3MgPSBhZGp1c3RDb2xvckJyaWdodG5lc3M7XHJcbm1vZHVsZS5leHBvcnRzLnJhbmRvbUNvbG9yID0gcmFuZG9tQ29sb3I7XHJcbm1vZHVsZS5leHBvcnRzLnJhbmRvbUdyYWRpZW50ID0gcmFuZG9tR3JhZGllbnQ7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29sb3JVdGlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcbiAqIE1vZGUgb2JqZWN0XHJcbiAqXHJcbiAqIFRoZSBtb2RlIG9iamVjdCAoZS5nLiAnUG9seWdvbmFsJykgcmVzcG9uc2libGUgZm9yIGdlbmVyYXRpbmcgcG9pbnRzIGFuZFxyXG4gKiBzcGVjaWZ5aW5nIGRyYXdpbmcgcnVsZXMgZm9yIGl0c2VsZlxyXG4gKi9cclxuXHJcbiBmdW5jdGlvbiBNb2RlKCkge1xyXG5cclxuIH1cclxuXHJcbnZhciBQb2x5Z29uYWxNb2RlID0gT2JqZWN0LmNyZWF0ZShNb2RlLnByb3RvdHlwZSk7XHJcblxyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5uYW1lID0gJ1BvbHlnb25hbCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIFBvbHlnb25hbDogUG9seWdvbmFsTW9kZVxyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL21vZGVzLmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==