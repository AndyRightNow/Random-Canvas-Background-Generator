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

	/*jshint esversion: 6 */
	var Vector = __webpack_require__(1);
	var utils = __webpack_require__(2);
	var RandomBackgroundGenerator = __webpack_require__(3);
	
	var htmlTest = {};
	
	htmlTest.run = function(canvasId){
	    var back = new RandomBackgroundGenerator('canvas', 'Polygonal','#F9690E');
	    back.getMode().setDensity(0.6);
	    document.getElementById('generate').addEventListener('click', function(){
	        back.generate();
	    });
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
	
	Vector.prototype.equal = function(vec) {
		return this.x === vec.x && this.y === vec.y;
	};
	
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
	
	Vector.prototype.add = function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	};
	
	Vector.prototype.sub = function(v){
		this.x -= v.x;
		this.y -= v.y;
		return this;
	};
	
	Vector.prototype.clone = function() {
		return new Vector(this.x, this.y);
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

	/*jshint esversion: 6 */
	var Vector = __webpack_require__(1);
	
	/*
	 *	Polygon class constructor
	 *
	 * @param {Array} points: The points of the polygon. They must be in clockwise or counter-clockwise order
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
	    },
	
	    equal: function(polygon) {
	        var reversed = polygon.points;
	        reversed.reverse();
	
	        return this.points.every(function(element, index) {
	            return element.equal(polygon.points[index]);
	        }) || this.points.every(function(element, index) {
	            return element.equal(reversed[index]);
	        });
	    }
	};
	
	/*
	 * Shrink a rectangle by value dx and value dy
	 *
	 * @return {Object} an object consisting of transformed p1, p2, p3, p4
	 * @param {Vector} p1, p2, p3, p4: Points of a rectangle starting
	 *								   from the top left corner and going
	 *								   clockwise.
	 */
	function shrinkRect(p1, p2, p3, p4, byDx, byDy) {
	    byDx = byDx || 0;
	    byDy = byDy || 0;
	    
	    return {
	        'p1': p1.clone().add(new Vector(byDx, byDy)),
	        'p2': p2.clone().add(new Vector(-byDx, byDy)),
	        'p3': p3.clone().add(new Vector(-byDx, -byDy)),
	        'p4': p4.clone().add(new Vector(-byDx, byDy))
	    };
	}
	
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
	     if (lower >= upper) return 0;
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
	 *	@param {boolean} isInt: The flag to specify whether the result is int or float
	 */
	function getRandomPointOnRect(p1, p2, p3, p4, isInt) {
	    isInt = isInt || true;
	    var width = Math.abs(p2.x - p1.x),
	        height = Math.abs(p3.y - p2.y),
	        topLeftX = Math.min(p1.x, p2.x, p3.x, p4.x),
	        topLeftY = Math.min(p1.y, p2.y, p3.y, p4.y);
	
	    var randomDeltaX = getRandomNumberFromRange(0, width, isInt),
	        randomDeltaY = getRandomNumberFromRange(0, height, isInt);
	
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
	
	/*
	 * Helper function used to create inheritance
	 *
	 * @return none
	 * @param {Function} ctor: The constructor of the current object
	 * @param {Function} superCtor: The constructor of the parent object
	 */
	 function inherit(ctor, superCtor) {
	     ctor._super = superCtor;
	     ctor.prototype = Object.create(superCtor.prototype, {
	         constructor: {
	             value: ctor,
	             enumerable: false,
	             writable: true,
	             configurable: true
	         }
	     });
	 }
	
	//  Exports
	module.exports.Polygon = Polygon;
	module.exports.clamp = clamp;
	module.exports.getRandomNumberFromRange = getRandomNumberFromRange;
	module.exports.getRandomPointOnRect = getRandomPointOnRect;
	module.exports.getRandomPointOnLine = getRandomPointOnLine;
	module.exports.inherit = inherit;
	module.exports.shrinkRect = shrinkRect;


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
	var Modes = __webpack_require__(5);
	
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
	* @param {String(Args)} baseColors: a set of variable number of color strings used
	*                                   as the base colors of the background
	*/
	function RandomBackgroundGenerator(canvasId, mode, baseColors) {
		//	Initialize
		this._canvas = typeof document !== 'undefined' ? document.getElementById(canvasId) : null;
		this._canvasContext = this._canvas ? this._canvas.getContext('2d') : null;
		this._modeName = mode || POLYGONAL;
		this._mode = null;
	
		if (this._canvas) {	//	If canvas element exists
			this._mode = new Modes[this._modeName](0.6,
				this._canvas.clientWidth,
				this._canvas.clientHeight);
	
			if (arguments.length > 2) {	//	If any color is proviede
				this._mode.setBaseColors.apply(this._mode, Array.from(arguments).slice(2, arguments.length));
			}
		}
	}
	
	/*
	 * Public member function - return the current mode
	 *
	 * @return {Mode} the current mode
	 */
	RandomBackgroundGenerator.prototype.getMode = function() {
		return this._mode;
	};
	
	
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
				let gradColors = colorUtils.randomGradient(colorUtils.randomColor(color,
					utils.getRandomNumberFromRange(0, 0.3)),	//	Intensity of the base color
						utils.getRandomNumberFromRange(0, 0.1));	//	Intensity of the random gradient
				grad.addColorStop(0, gradColors.first);
				grad.addColorStop(1, gradColors.second);
	
				this._canvasContext.fillStyle = grad;
			}
			else {
				this._canvasContext.fillStyle = colorUtils.randomColor(color);
			}
		}
		else {
			this._canvasContext.fillStyle = colorUtils.randomColor(color);
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
	
	/*
	 * Public member function - clear the canvas and generate a background with the mode
	 */
	RandomBackgroundGenerator.prototype.generate = function(){
		this._canvasContext.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
	
		this._mode.generate();
	
		var primitives = this._mode.getPrimitives();
		var baseColors = this._mode.getBaseColors();
	
		for (let i = 0; i < primitives.length; i++) {
			var randColor = baseColors[utils.getRandomNumberFromRange(0, baseColors.length)];
			this._fillPolygon(randColor, primitives[i], true);
		}
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
	         utils.getRandomNumberFromRange(rangeLower, rangeUpper - threshold, false), //  Darken
	         utils.getRandomNumberFromRange(-rangeUpper, -rangeLower, false)];  //  Brighten
	
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
/***/ function(module, exports, __webpack_require__) {

	/*jshint esversion: 6 */
	/*
	 * Mode object
	 *
	 * The mode object (e.g. 'Polygonal') responsible for generating primitive shapes
	 * to draw with
	 */
	
	 //-----------------------------
	 // Dependencies
	 //-----------------------------
	 var utils = __webpack_require__(2);
	 var Graph = __webpack_require__(6);
	 var Vector = __webpack_require__(1);
	
	/*
	 * Base mode class constructor
	 *
	 * @param {Number} canvasWidth: The width of the canvas
	 * @param {Number} canvasHeight: The height of the canvas
	 * @param {String(Args)} baseColors: a set of variable number of color strings used
	 *                                   as the base colors of the background
	 */
	function Mode(canvasWidth, canvasHeight, baseColors) {
	    //----------------------------
	    //  Base class members
	    //----------------------------
	    this._baseColors = Array.from(arguments).slice(2, arguments.length);
	    this._primitives = [];
	    this._width = canvasWidth || 0;
	    this._height = canvasHeight || 0;
	}
	
	/*
	 * Public virtual function - set the array of color strings
	 *
	 */
	Mode.prototype.setBaseColors = function(args) {
	    this._baseColors = Array.from(arguments);
	};
	
	/*
	 * Public virtual function - return an array of color strings
	 *
	 * @return {Array} An array of color strings
	 */
	Mode.prototype.getBaseColors = function() {
	    return this._baseColors;
	};
	
	/*
	 * Public virtual function - return an array of the primitive shapes to draw with
	 *
	 * @return {Array} An array of primitive shapes
	 */
	Mode.prototype.getPrimitives = function() {
	    return this._primitives;
	};
	
	/*
	 * Polygonal mode class constructor
	 *
	 * @param {float} density: The density of the polygons, in the range of [0, 1].
	 *                         0 is the sparsest and 1 is the densest.
	 * @param {String(Args)} baseColors: a set of variable number of color strings used
	 *                                   as the base colors of the background
	 * @param {Number} canvasWidth: The width of the canvas
	 * @param {Number} canvasHeight: The height of the canvas
	
	 */
	function PolygonalMode(density, canvasWidth, canvasHeight, baseColors) {
	    //  Call the base constructor and init base class members
	    PolygonalMode._super.apply(this, Array.from(arguments).slice(1, arguments.length));
	
	    //----------------------------
	    //  Class-specific members
	    //----------------------------
	    this._density = density || 0.5;
	    this._density = 1 - this._density;
	}
	utils.inherit(PolygonalMode, Mode);
	
	//----------------------
	//  The bounds of ratio
	//----------------------
	PolygonalMode.prototype.DENSITY_RATO_UPPER_BOUND = 0.3;
	PolygonalMode.prototype.DENSITY_RATO_LOWER_BOUND = 0.01;
	PolygonalMode.prototype.DENSITY_RATO_DIF =
	    PolygonalMode.prototype.DENSITY_RATO_UPPER_BOUND -
	    PolygonalMode.prototype.DENSITY_RATO_LOWER_BOUND;
	
	/*
	 * Public member function - set the density of polygons
	 *
	 */
	PolygonalMode.prototype.setDensity = function(density) {
	    this._density = 1 - density;
	};
	/*
	 * Public member function - return the density of polygons
	 *
	 * @return {float} density
	 */
	PolygonalMode.prototype.getDensity = function() {
	    return 1 - this._density;
	};
	
	/*
	 * Private helper function - generate points to draw with
	 * It divides the whole canvas into small grids and generate a random point in every
	 * grid
	 *
	 * @return none
	 */
	PolygonalMode.prototype._generatePrimitives = function() {
	    //  Clear previous data
	    this._primitives = [];
	
	    //-----------------------------------------
	    //  Width and height of every small grid
	    //-----------------------------------------
	    var ratio = this.DENSITY_RATO_LOWER_BOUND + this.DENSITY_RATO_DIF * this._density;
	    var widthInterval =  ratio * this._width,
	        heightInterval = ratio * this._height;
	
	    //-------------------------------------------------
	    //  Counts of rows and columns plus the top
	    //  and left bounds of the rectangle
	    //-------------------------------------------------
	    var rowCount = Math.floor(this._width / widthInterval) + 1,
	        colCount = Math.floor(this._height / heightInterval) + 1;
	
	    //  Use a graph to represent the grids on the canvas
	    var graph = new Graph(rowCount, colCount);
	
	    //-------------------------------
	    //  Points of every small grid
	    //-------------------------------
	    var p1 = new Vector(0, 0),
	        p2 = new Vector(widthInterval, 0),
	        p3 = new Vector(widthInterval, heightInterval),
	        p4 = new Vector(0, heightInterval);
	
	    //--------------------------------------------
	    //  Randomly generate points on the canvas
	    //--------------------------------------------
	    for (let i = 0; i < rowCount; i++) {
	        for (let j = 0; j < colCount; j++) {
	            var randPoint;
	
	            //  Shrink the rectangle to produce less messy points
	            var shrinked = utils.shrinkRect(p1, p2, p3, p4, widthInterval / 5 , 0);
	
	            if (j === 0) {  //  If at the left bound
	                if (i === 0)
	                    randPoint = new Vector(i * widthInterval, j * heightInterval);
	                else
	                    randPoint = utils.getRandomPointOnRect(shrinked.p1, shrinked.p1, shrinked.p4, shrinked.p4);
	            }
	            else if (j === colCount - 1) {   //  If at the right bound
	                randPoint = utils.getRandomPointOnRect(shrinked.p2, shrinked.p2, shrinked.p3, shrinked.p3);
	            }
	            else {
	                if (i === 0) {   //  If at the top bound
	                    randPoint = utils.getRandomPointOnRect(shrinked.p1, shrinked.p2, shrinked.p2, shrinked.p1);
	                }
	                else if (i === rowCount - 1) {   //  If at the bottom bound
	                    randPoint = utils.getRandomPointOnRect(shrinked.p4, shrinked.p3, shrinked.p3, shrinked.p4);
	                }
	                else {
	                    randPoint = utils.getRandomPointOnRect(shrinked.p1, shrinked.p2, shrinked.p3, shrinked.p4);
	                }
	            }
	            graph.insert(i, j, randPoint);
	
	            //----------------------------------------
	            //  Move the current small grid to the
	            //  right by one interval unit
	            //----------------------------------------
	            p1.x += widthInterval;
	            p2.x += widthInterval;
	            p3.x += widthInterval;
	            p4.x += widthInterval;
	        }
	        //----------------------------------------
	        //  Move the current small grid back to the
	        //  left most bound and move it down by one interval unit
	        //----------------------------------------
	        p1.x = p4.x = 0;
	        p2.x = p3.x = widthInterval;
	        p1.y += heightInterval;
	        p2.y += heightInterval;
	        p3.y += heightInterval;
	        p4.y += heightInterval;
	    }
	
	    //---------------------------------------
	    //  As we are going to check adjacent vertices
	    //  it's easier to store all delta index values and
	    //  loop over them
	    //---------------------------------------
	    var di = [-1, -1, -1,  0,  1, 1, 1, 0],
	        dj = [-1,  0,  1,  1,  1, 0, -1, -1];
	
	    //-------------------------------------
	    //  Connect all adjacent vertices
	    //  and get all primitives
	    //-------------------------------------
	    for (let i = 0; i < rowCount; i++) {
	        for (let j = 0; j < colCount; j++) {
	            //  Keep count of the points that are actually processed
	            let cnt = 0;
	
	            let firstPoint, prevPoint;
	
	            for (let k = 0; k < di.length; k++) {
	                let currPoint = graph.get(i + di[k], j + dj[k]);
	
	                if (currPoint) {
	                    graph.connect(i, j, i + di[k], j + dj[k]);
	                    cnt++;
	
	                    if (cnt === 1) {    //  Assign first point
	                        firstPoint = currPoint;
	                    }
	                    else {
	                        this._primitives.push(new utils.Polygon([   //  Add polygon
	                            graph.get(i, j),
	                            prevPoint,
	                            currPoint
	                        ]));
	                    }
	                    prevPoint = currPoint;
	                }
	            }
	            //-------------------------------------
	            //  Connect the first point with the
	            //  last point and add polygon
	            //-------------------------------------
	            if (firstPoint !== undefined &&
	                prevPoint !== undefined &&
	                !firstPoint.equal(prevPoint)) {
	                this._primitives.push(new utils.Polygon([
	                    graph.get(i, j),
	                    prevPoint,
	                    firstPoint
	                ]));
	            }
	        }
	    }
	
	
	};
	
	PolygonalMode.prototype.generate = function() {
	    this._generatePrimitives();
	};
	
	//  Export an object for direct lookup
	module.exports = {
	    Polygonal: PolygonalMode
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*jshint esversion: 6 */
	
	/*
	 * Undirected acylic graph data structure using
	 * adjaceny matrix as implementation
	 *
	 */
	
	/*
	 * Graph class constructor
	 *
	 * @param {Integer} rowCount: The number of rows
	 * @param {Integer} columnCount: The number of columns
	 * @oaram {Non-object types} initialValue(Optional): initialValue for all elements in the graph. It's 0 by default.
	 */
	function Graph(rowCount, columnCount, initialValue) {
	    this._rowCount = rowCount || 0;
	    this._columnCount = columnCount || 0;
	
	    //---------------------------
	    //  Allocate an empty matrix
	    //---------------------------
	    this._data = new Array(rowCount);
	    for (let i = 0; i < rowCount; i++) {
	        this._data[i] = new Array(columnCount).fill(initialValue || 0, 0);
	    }
	
	    this._edges = {};
	}
	
	/*
	 * Private member function - check if a pair of positions is in the range of rows and columns
	 *
	 * @return {Boolean} true if the pair of positions is in the bound and false if not
	 * @param {Integer} i: The zero-based row position
	 * @param {Integer} j: The zero-based column position
	 */
	Graph.prototype._checkBound = function(i, j) {
	    if (i >= this._rowCount ||
	        j >= this._columnCount ||
	        i < 0 || j < 0) return false;
	    return true;
	};
	
	/*
	 * Private member function - get an id from a pair of positions
	 *
	 * @return {String} The id of the pair of positions
	 * @param {Integer} i: The zero-based row position
	 * @param {Integer} j: The zero-based column position
	 */
	Graph.prototype._getId = function(i, j) {
	    return this._checkBound(i, j) ? i.toString() + j.toString() : null;
	};
	
	/*
	 * Public member function - return the count of rows
	 */
	Graph.prototype.rowCount = function() {
	    return this._rowCount;
	};
	/*
	 * Public member function - return the count of columns
	 */
	Graph.prototype.columnCount = function() {
	    return this._columnCount;
	};
	
	/*
	 * Public member function - insert an element to the graph
	 *
	 * @return {Boolean} true if insertion is successful and false if not
	 * @param {Integer} i: The zero-based row position
	 * @param {Integer} j: The zero-based column position
	 * @param {Any} value: The value to insert
	 */
	Graph.prototype.insert = function(i, j, value) {
	    if (this._checkBound(i, j)) {
	        this._data[i][j] = value;
	        return true;
	    }
	    else return false;
	};
	
	/*
	 * Public member function - get a element from a pair of position
	 *
	 * @return {Any / null} The element at the position if the pair of positions is in the bound
	 *                      and null if not
	 * @param {Integer} i: The zero-based row position
	 * @param {Integer} j: The zero-based column position
	 */
	Graph.prototype.get = function(i, j) {
	    if (this._checkBound(i, j)) {
	        return this._data[i][j];
	    }
	    else return null;
	};
	
	/*
	 * Public member function - check if two vertices are connected
	 *
	 * @return {Boolean} true if there is a connection between two elements
	 * @param {Integer} i1, i2: The zero-based row position
	 * @param {Integer} j1, j2: The zero-based column position
	 */
	Graph.prototype.isConnected = function(i1, j1, i2, j2) {
	    if (!this._checkBound(i1, j1) ||
	        !this._checkBound(i2, j2)) return false;
	
	    var id1 = this._getId(i1, j1),
	        id2 = this._getId(i2, j2);
	
	    if (typeof this._edges[id1] === 'undefined') {
	        return false;
	    }
	    return this._edges[id1][id2];
	};
	
	/*
	 * Public member function - connect the edge of two vertices
	 *
	 * @return {Boolean} true if the action is successful
	 * @param {Integer} i1, i2: The zero-based row position
	 * @param {Integer} j1, j2: The zero-based column position
	 */
	Graph.prototype.connect = function(i1, j1, i2, j2) {
	    if (!this._checkBound(i1, j1) ||
	        !this._checkBound(i2, j2)) return false;
	
	    var id1 = this._getId(i1, j1),
	        id2 = this._getId(i2, j2);
	
	    if (typeof this._edges[id1] === 'undefined') {
	        this._edges[id1] = {};
	    }
	    this._edges[id1][id2] = true;
	
	    return true;
	};
	
	/*
	 * Public member function - disconnect the edge of two vertices
	 *
	 * @return {Boolean} true if the action is successful
	 * @param {Integer} i1, i2: The zero-based row position
	 * @param {Integer} j1, j2: The zero-based column position
	 */
	Graph.prototype.disconnect = function(i1, j1, i2, j2) {
	    if (!this._checkBound(i1, j1) ||
	        !this._checkBound(i2, j2)) return false;
	
	    var id1 = this._getId(i1, j1),
	        id2 = this._getId(i2, j2);
	
	    if (typeof this._edges[id1] === 'undefined') {
	        return true;
	    }
	    this._edges[id1][id2] = false;
	
	    return true;
	};
	
	//  Exports
	module.exports = Graph;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWYwNDI0NzZlOTQ2NDNjNjJlZGMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sb3JVdGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBOzs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDakVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Es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QUNwQixZQUFXLFFBQVE7QUFDbkIsWUFBVyxRQUFRO0FBQ25CLFlBQVcsSUFBSTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBWSxXQUFXO0FBQ3ZCO0FBQ0EsWUFBVyxRQUFRO0FBQ25CLFlBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLFFBQVE7QUFDcEIsWUFBVyxRQUFRO0FBQ25CLFlBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBWSxRQUFRO0FBQ3BCLFlBQVcsUUFBUTtBQUNuQixZQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQVksUUFBUTtBQUNwQixZQUFXLFFBQVE7QUFDbkIsWUFBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6Imh0bWxUZXN0LmRpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGFmMDQyNDc2ZTk0NjQzYzYyZWRjXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcbnZhciBWZWN0b3IgPSByZXF1aXJlKCcuLy4uLy4uL3NyYy92ZWN0b3InKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi9zcmMvdXRpbHMnKTtcclxudmFyIFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uLy4uL3NyYy9SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yJyk7XHJcblxyXG52YXIgaHRtbFRlc3QgPSB7fTtcclxuXHJcbmh0bWxUZXN0LnJ1biA9IGZ1bmN0aW9uKGNhbnZhc0lkKXtcclxuICAgIHZhciBiYWNrID0gbmV3IFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IoJ2NhbnZhcycsICdQb2x5Z29uYWwnLCcjRjk2OTBFJyk7XHJcbiAgICBiYWNrLmdldE1vZGUoKS5zZXREZW5zaXR5KDAuNik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2VuZXJhdGUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgYmFjay5nZW5lcmF0ZSgpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGh0bWxUZXN0O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcbiAqICAgICAgICAgICAgICBWZWN0b3IgQ2xhc3NcclxuICpcclxuICogICAgICBWZWN0b3IgYW5kIHZlY3RvciBvcGVyYXRpb25zLlxyXG4gKi9cclxuXHJcbi8qXHJcbiAqICBDb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gVmVjdG9yKHgsIHkpe1xyXG5cdHRoaXMueCA9IHggfHwgMDtcclxuXHR0aGlzLnkgPSB5IHx8IDA7XHJcbn1cclxuXHJcblZlY3Rvci5wcm90b3R5cGUuZXF1YWwgPSBmdW5jdGlvbih2ZWMpIHtcclxuXHRyZXR1cm4gdGhpcy54ID09PSB2ZWMueCAmJiB0aGlzLnkgPT09IHZlYy55O1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2KXtcclxuXHRyZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55O1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5sZW4yID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5kb3QodGhpcyk7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmxlbiA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIE1hdGguc3FydCh0aGlzLmxlbjIoKSk7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24oc3gsIHN5KXtcclxuXHR0aGlzLnggKj0gc3g7XHJcblx0dGhpcy55ICo9IHN5IHx8IHN4O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih2KSB7XHJcblx0dGhpcy54ICs9IHYueDtcclxuXHR0aGlzLnkgKz0gdi55O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbih2KXtcclxuXHR0aGlzLnggLT0gdi54O1xyXG5cdHRoaXMueSAtPSB2Lnk7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IodGhpcy54LCB0aGlzLnkpO1xyXG59O1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHRObyBzaWRlIGVmZmVjdCBhbmQgY2hhaW5pbmdcclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblZlY3Rvci5wcm90b3R5cGUucHJvamVjdCA9IGZ1bmN0aW9uKGF4aXMpe1xyXG5cdHZhciBjb2YgPSAgdGhpcy5kb3QoYXhpcykgLyBheGlzLmxlbjIoKTtcclxuXHRyZXR1cm4gYXhpcy5zY2FsZShjb2YpO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5wcm9qZWN0TiA9IGZ1bmN0aW9uKGF4aXMpe1xyXG5cdHZhciBjb2YgPSAgdGhpcy5kb3QoYXhpcyk7XHJcblx0cmV0dXJuIGF4aXMuc2NhbGUoY29mKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3ZlY3Rvci5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi92ZWN0b3InKTtcclxuXHJcbi8qXHJcbiAqXHRQb2x5Z29uIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50czogVGhlIHBvaW50cyBvZiB0aGUgcG9seWdvbi4gVGhleSBtdXN0IGJlIGluIGNsb2Nrd2lzZSBvciBjb3VudGVyLWNsb2Nrd2lzZSBvcmRlclxyXG4gKi9cclxuZnVuY3Rpb24gUG9seWdvbihwb2ludHMpIHtcclxuICAgIHRoaXMuX3BvaW50cyA9IHBvaW50cyB8fCBbXTtcclxufVxyXG5Qb2x5Z29uLnByb3RvdHlwZSA9IHtcclxuICAgIGdldCBwb2ludHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50cztcclxuICAgIH0sXHJcblxyXG4gICAgc2V0IHBvaW50cyhwb2ludHMpIHtcclxuICAgICAgICB0aGlzLl9wb2ludHMgPSBwb2ludHM7XHJcbiAgICB9LFxyXG5cclxuICAgIGVxdWFsOiBmdW5jdGlvbihwb2x5Z29uKSB7XHJcbiAgICAgICAgdmFyIHJldmVyc2VkID0gcG9seWdvbi5wb2ludHM7XHJcbiAgICAgICAgcmV2ZXJzZWQucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludHMuZXZlcnkoZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuZXF1YWwocG9seWdvbi5wb2ludHNbaW5kZXhdKTtcclxuICAgICAgICB9KSB8fCB0aGlzLnBvaW50cy5ldmVyeShmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5lcXVhbChyZXZlcnNlZFtpbmRleF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLypcclxuICogU2hyaW5rIGEgcmVjdGFuZ2xlIGJ5IHZhbHVlIGR4IGFuZCB2YWx1ZSBkeVxyXG4gKlxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFuIG9iamVjdCBjb25zaXN0aW5nIG9mIHRyYW5zZm9ybWVkIHAxLCBwMiwgcDMsIHA0XHJcbiAqIEBwYXJhbSB7VmVjdG9yfSBwMSwgcDIsIHAzLCBwNDogUG9pbnRzIG9mIGEgcmVjdGFuZ2xlIHN0YXJ0aW5nXHJcbiAqXHRcdFx0XHRcdFx0XHRcdCAgIGZyb20gdGhlIHRvcCBsZWZ0IGNvcm5lciBhbmQgZ29pbmdcclxuICpcdFx0XHRcdFx0XHRcdFx0ICAgY2xvY2t3aXNlLlxyXG4gKi9cclxuZnVuY3Rpb24gc2hyaW5rUmVjdChwMSwgcDIsIHAzLCBwNCwgYnlEeCwgYnlEeSkge1xyXG4gICAgYnlEeCA9IGJ5RHggfHwgMDtcclxuICAgIGJ5RHkgPSBieUR5IHx8IDA7XHJcbiAgICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3AxJzogcDEuY2xvbmUoKS5hZGQobmV3IFZlY3RvcihieUR4LCBieUR5KSksXHJcbiAgICAgICAgJ3AyJzogcDIuY2xvbmUoKS5hZGQobmV3IFZlY3RvcigtYnlEeCwgYnlEeSkpLFxyXG4gICAgICAgICdwMyc6IHAzLmNsb25lKCkuYWRkKG5ldyBWZWN0b3IoLWJ5RHgsIC1ieUR5KSksXHJcbiAgICAgICAgJ3A0JzogcDQuY2xvbmUoKS5hZGQobmV3IFZlY3RvcigtYnlEeCwgYnlEeSkpXHJcbiAgICB9O1xyXG59XHJcblxyXG4vKlxyXG4gKiAgQ2xhbXAgYSBudW1iZXIgd2l0aGluIGEgcmFuZ2VcclxuICovXHJcbmZ1bmN0aW9uIGNsYW1wKHgsIGxvd2VyLCB1cHBlcil7XHJcbiAgICByZXR1cm4geCA8IGxvd2VyID8gbG93ZXIgOiB4ID4gdXBwZXIgPyB1cHBlciA6IHg7XHJcbn1cclxuXHJcbi8qXHJcbiAqXHRHZXQgYSByYW5kb20gbnVtYmVyIGZyb20gYSByYW5nZVxyXG4gKlxyXG4gKlx0QHJldHVybiB7aW50IC8gZmxvYXR9IEEgcmFuZG9tbHkgZ2VuZXJhdGVkIG51bWJlciB3aXRoaW4gYSByYW5nZVxyXG4gKlx0QHBhcmFtIHtpbnQgLyBmbG9hdH0gbG93ZXI6IFRoZSBsb3dlciBib3VuZCBvZiB0aGUgcmFuZ2UoSW5jbHVzaXZlKVxyXG4gKlx0QHBhcmFtIHtpbnQgLyBmbG9hdH0gdXBwZXI6IFRoZSB1cHBlciBib3VuZCBvZiB0aGUgcmFuZ2UoRXhjbHVzaXZlKVxyXG4gKlx0QHBhcmFtIHtib29sZWFufSBpc0ludDogVGhlIGZsYWcgdG8gc3BlY2lmeSB3aGV0aGVyIHRoZSByZXN1bHQgaXMgaW50IG9yIGZsb2F0XHJcbiAqL1xyXG4gZnVuY3Rpb24gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKGxvd2VyLCB1cHBlciwgaXNJbnQpIHtcclxuICAgICBpZiAobG93ZXIgPj0gdXBwZXIpIHJldHVybiAwO1xyXG4gICAgIGlzSW50ID0gaXNJbnQgfHwgdHJ1ZTtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vXHRTb21lIHJhbmRvbSBudW1iZXJzIGp1c3QgY29taW5nIG91dCBvZiBub3doZXJlXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgc29tZVJhbmRvbU51bWJlcjEgPSAxMjg1LFxyXG4gICAgICAgIHNvbWVSYW5kb21OdW1iZXIyID0gMjM5MTtcclxuXHJcbiAgICAvL1x0R2VuZXJhdGUgdGhlIGludGVnZXIgcGFydFxyXG4gICAgdmFyIHJhbmRvbUludCA9XHJcbiAgICAgICAgcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIHNvbWVSYW5kb21OdW1iZXIxICogTWF0aC5yYW5kb20oKSAqIHNvbWVSYW5kb21OdW1iZXIyKSAlICh1cHBlciAtIGxvd2VyKTtcclxuXHJcbiAgICBpZiAoaXNJbnQpIHtcclxuICAgICAgICByZXR1cm4gbG93ZXIgKyByYW5kb21JbnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBsb3dlciArIHJhbmRvbUludCArIE1hdGgucmFuZG9tKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiAqICBHZXQgYSByYW5kb20gcG9pbnQgb24gYSByZWN0YW5nbGVcclxuICpcclxuICpcdEBwYXJhbSB7VmVjdG9yfSBwMSwgcDIsIHAzLCBwNDogUG9pbnRzIG9mIGEgcmVjdGFuZ2xlIHN0YXJ0aW5nXHJcbiAqXHRcdFx0XHRcdFx0XHRcdCAgIGZyb20gdGhlIHRvcCBsZWZ0IGNvcm5lciBhbmQgZ29pbmdcclxuICpcdFx0XHRcdFx0XHRcdFx0ICAgY2xvY2t3aXNlLlxyXG4gKlx0QHBhcmFtIHtib29sZWFufSBpc0ludDogVGhlIGZsYWcgdG8gc3BlY2lmeSB3aGV0aGVyIHRoZSByZXN1bHQgaXMgaW50IG9yIGZsb2F0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSYW5kb21Qb2ludE9uUmVjdChwMSwgcDIsIHAzLCBwNCwgaXNJbnQpIHtcclxuICAgIGlzSW50ID0gaXNJbnQgfHwgdHJ1ZTtcclxuICAgIHZhciB3aWR0aCA9IE1hdGguYWJzKHAyLnggLSBwMS54KSxcclxuICAgICAgICBoZWlnaHQgPSBNYXRoLmFicyhwMy55IC0gcDIueSksXHJcbiAgICAgICAgdG9wTGVmdFggPSBNYXRoLm1pbihwMS54LCBwMi54LCBwMy54LCBwNC54KSxcclxuICAgICAgICB0b3BMZWZ0WSA9IE1hdGgubWluKHAxLnksIHAyLnksIHAzLnksIHA0LnkpO1xyXG5cclxuICAgIHZhciByYW5kb21EZWx0YVggPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgd2lkdGgsIGlzSW50KSxcclxuICAgICAgICByYW5kb21EZWx0YVkgPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgaGVpZ2h0LCBpc0ludCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBWZWN0b3IodG9wTGVmdFggKyByYW5kb21EZWx0YVgsIHRvcExlZnRZICsgcmFuZG9tRGVsdGFZKTtcclxufVxyXG5cclxuLypcclxuICogIEdldCBhIHJhbmRvbSBwb2ludCBvbiBhIGxpbmVcclxuICogIEBwYXJhbSB7VmVjdG9yfSBwMSwgcDI6IFBvaW50cyBvZiBhIGxpbmUgZnJvbSBsZWZ0IHRvIHJpZ2h0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSYW5kb21Qb2ludE9uTGluZShwMSwgcDIpIHtcclxuICAgIHZhciBwcm9qZWN0aW9uV2lkdGggPSBNYXRoLmFicyhwMS54IC0gcDIueCksXHJcbiAgICAgICAgbGVmdFggPSBNYXRoLm1pbihwMS54LCBwMi54KTtcclxuXHJcbiAgICB2YXIgQSA9IChwMS55IC0gcDIueSkgLyAocDEueCAtIHAyLngpLFxyXG4gICAgICAgIEIgPSBwMS55IC0gQSAqIHAxLng7XHJcblxyXG4gICAgdmFyIHJhbmRvbURlbHRhWCA9IGdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCBwcm9qZWN0aW9uV2lkdGgsIGZhbHNlKTtcclxuICAgIHJldHVybiBuZXcgVmVjdG9yKGxlZnRYICsgcmFuZG9tRGVsdGFYLCBBICogKGxlZnRYICsgcmFuZG9tRGVsdGFYKSArIEIpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBIZWxwZXIgZnVuY3Rpb24gdXNlZCB0byBjcmVhdGUgaW5oZXJpdGFuY2VcclxuICpcclxuICogQHJldHVybiBub25lXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN0b3I6IFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgY3VycmVudCBvYmplY3RcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3VwZXJDdG9yOiBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHBhcmVudCBvYmplY3RcclxuICovXHJcbiBmdW5jdGlvbiBpbmhlcml0KGN0b3IsIHN1cGVyQ3Rvcikge1xyXG4gICAgIGN0b3IuX3N1cGVyID0gc3VwZXJDdG9yO1xyXG4gICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XHJcbiAgICAgICAgIGNvbnN0cnVjdG9yOiB7XHJcbiAgICAgICAgICAgICB2YWx1ZTogY3RvcixcclxuICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgfVxyXG4gICAgIH0pO1xyXG4gfVxyXG5cclxuLy8gIEV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMuUG9seWdvbiA9IFBvbHlnb247XHJcbm1vZHVsZS5leHBvcnRzLmNsYW1wID0gY2xhbXA7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSA9IGdldFJhbmRvbU51bWJlckZyb21SYW5nZTtcclxubW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tUG9pbnRPblJlY3QgPSBnZXRSYW5kb21Qb2ludE9uUmVjdDtcclxubW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tUG9pbnRPbkxpbmUgPSBnZXRSYW5kb21Qb2ludE9uTGluZTtcclxubW9kdWxlLmV4cG9ydHMuaW5oZXJpdCA9IGluaGVyaXQ7XHJcbm1vZHVsZS5leHBvcnRzLnNocmlua1JlY3QgPSBzaHJpbmtSZWN0O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG4vKlxyXG4gKiBSYW5kb20gQ2FudmFzIEJhY2tncm91bmQgR2VuZXJhdG9yXHJcbiAqXHJcbiAqIEl0J3MgdXNlZCBvbiBIVE1MIENhbnZhcyB0byBnZW5lcmF0ZSByYW5kb20gYmFja2dyb3VuZCBpbiBhIGNlcnRhaW4gcGF0dGVyblxyXG4gKiB3aXRoIGNlcnRhaW4gY3VzdG9taXplZCBwYXJhbWV0ZXJzIGFuZCBtb2Rlcy4gVGhlIGJhY2tncm91bmRcclxuICogd2lsbCB1cGRhdGUgZXZlcnkgdGltZSB5b3UgY2FsbCBnZW5lcmF0ZSgpXHJcbiAqXHJcbiAqL1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHREZXBlbmRlbmNpZXNcclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxudmFyIGNvbG9yVXRpbHMgPSByZXF1aXJlKCcuL2NvbG9yVXRpbHMnKTtcclxudmFyIFZlY3RvciA9IHJlcXVpcmUoJy4vdmVjdG9yJyk7XHJcbnZhciBNb2RlcyA9IHJlcXVpcmUoJy4vbW9kZXMnKTtcclxuXHJcbi8qXHJcbipcdENvbnN0YW50IHN0cmluZyBuYW1lXHJcbiovXHJcbmNvbnN0IFBPTFlHT05BTCA9IFwiUG9seWdvbmFsXCI7XHJcblxyXG4vKlxyXG4qIENvbnN0cnVjdG9yXHJcbipcclxuKiBAcGFyYW0ge3N0cmluZ30gY2FudmFzSWQ6IFRoZSBpZCBvZiB0aGUgY2FudmFzIHlvdSB3YW50IHRvIGdlbmVyYXRlIGJhY2tncm91bmQgb25cclxuKiBAcGFyYW0ge3N0cmluZ30gbW9kZTogVGhlIHBhdHRlcm4gaW4gd2hpY2ggdGhlIGJhY2tncm91bmQgaXMgZ2VuZXJhdGVkLlxyXG4qXHRcdFx0XHRcdFx0IEN1cnJlbnRseSBTdXBwb3J0OiAxLiBcIlBvbHlnb25hbFwiXHJcbiogQHBhcmFtIHtTdHJpbmcoQXJncyl9IGJhc2VDb2xvcnM6IGEgc2V0IG9mIHZhcmlhYmxlIG51bWJlciBvZiBjb2xvciBzdHJpbmdzIHVzZWRcclxuKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXMgdGhlIGJhc2UgY29sb3JzIG9mIHRoZSBiYWNrZ3JvdW5kXHJcbiovXHJcbmZ1bmN0aW9uIFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IoY2FudmFzSWQsIG1vZGUsIGJhc2VDb2xvcnMpIHtcclxuXHQvL1x0SW5pdGlhbGl6ZVxyXG5cdHRoaXMuX2NhbnZhcyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkgOiBudWxsO1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQgPSB0aGlzLl9jYW52YXMgPyB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKSA6IG51bGw7XHJcblx0dGhpcy5fbW9kZU5hbWUgPSBtb2RlIHx8IFBPTFlHT05BTDtcclxuXHR0aGlzLl9tb2RlID0gbnVsbDtcclxuXHJcblx0aWYgKHRoaXMuX2NhbnZhcykge1x0Ly9cdElmIGNhbnZhcyBlbGVtZW50IGV4aXN0c1xyXG5cdFx0dGhpcy5fbW9kZSA9IG5ldyBNb2Rlc1t0aGlzLl9tb2RlTmFtZV0oMC42LFxyXG5cdFx0XHR0aGlzLl9jYW52YXMuY2xpZW50V2lkdGgsXHJcblx0XHRcdHRoaXMuX2NhbnZhcy5jbGllbnRIZWlnaHQpO1xyXG5cclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1x0Ly9cdElmIGFueSBjb2xvciBpcyBwcm92aWVkZVxyXG5cdFx0XHR0aGlzLl9tb2RlLnNldEJhc2VDb2xvcnMuYXBwbHkodGhpcy5fbW9kZSwgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDIsIGFyZ3VtZW50cy5sZW5ndGgpKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSByZXR1cm4gdGhlIGN1cnJlbnQgbW9kZVxyXG4gKlxyXG4gKiBAcmV0dXJuIHtNb2RlfSB0aGUgY3VycmVudCBtb2RlXHJcbiAqL1xyXG5SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yLnByb3RvdHlwZS5nZXRNb2RlID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX21vZGU7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUHJpdmF0ZSBoZWxwZXIgZnVuY3Rpb24gdXNlZCB0byBkcmF3IHBvbHlnb24gb24gdGhlIGNhbnZhc1xyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29sb3I6IEEgSEVYLCBSR0Igb3IgUkdCQSBjb2xvciBpbiB0aGUgZm9ybSBvZlxyXG4gKlx0XHRcdFx0XHRcdCAgIFwiIzAwMDAwMFwiLCBcInJnYigwLCAwLCAwKVwiIG9yIFwicmdiYSgwLCAwLCAwLCAxKVwiXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50czogQW4gYXJyYXkgb2YgUG9pbnQgb2JqZWN0c1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGdyYWRpZW50OiBBIGZsYWcgaW5kaWNhdGluZyBpZiBsaW5lYXItZ3JhZGllbnQgaXMgZW5hYmxlZC5cclxuICpcdFx0XHRcdFx0XHRcdCAgIFRoZSBncmFkaWVudCB3aWxsIGJlIHJhbmRvbWx5IGdlbmVyYXRlZC5cclxuICpcclxuICovXHJcblJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IucHJvdG90eXBlLl9maWxsUG9seWdvbiA9IGZ1bmN0aW9uKGNvbG9yLCBwb2x5Z29uLCBncmFkaWVudCkge1xyXG5cdGdyYWRpZW50ID0gZ3JhZGllbnQgfHwgZmFsc2U7XHJcblxyXG5cdC8vXHRTYXZlIHRoZSBwcmV2aW91cyBzdGF0ZXNcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LnNhdmUoKTtcclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvL1x0U2V0IHRoZSBjb2xvclxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0aWYgKGdyYWRpZW50KSB7XHJcblx0XHRpZiAocG9seWdvbi5wb2ludHMubGVuZ3RoID09PSAzKSB7XHQvL1x0SWYgaXQncyBhIHRyaWFuZ2xlXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0U3RhcnQgYW5kIGVuZCBwb2ludHMgb2YgdGhlIGxpbmVhciBncmFkaWVudFxyXG5cdFx0XHQvL1x0VGhlIHN0YXJ0IHBvaW50IGlzIHJhbmRvbWx5IHNlbGVjdGVkXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgc3RhcnRQb2ludCA9IHBvbHlnb24ucG9pbnRzW3V0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCBwb2x5Z29uLnBvaW50cy5sZW5ndGgpXTtcclxuXHRcdFx0bGV0IGVuZFBvaW50O1xyXG5cclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdC8vXHRGZXRjaCBwb2ludHMgb3RoZXIgdGhhbiB0aGUgc3RhcnQgcG9pbnRcclxuXHRcdFx0Ly9cdG91dCBvZiB0aGUgcG9seWdvblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0bGV0IGluZGV4ID0gcG9seWdvbi5wb2ludHMuaW5kZXhPZihzdGFydFBvaW50KTtcclxuXHRcdFx0bGV0IGxpbmUgPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwb2x5Z29uLnBvaW50cy5sZW5ndGg7IGkrKylcclxuXHRcdFx0XHRpZiAoaSAhPT0gaW5kZXgpIGxpbmUucHVzaChwb2x5Z29uLnBvaW50c1tpXSk7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ly9cdFByb2plY3QgdGhlIHN0YXJ0IHBvaW50IHRvIHRoZSBsaW5lXHJcblx0XHRcdC8vXHRpdCdzIGZhY2luZyBhbmQgdGhhdCdzIHRoZSBlbmQgcG9pbnRcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdGxldCBheGlzID0gbmV3IFZlY3RvcihsaW5lWzBdLnggLSBsaW5lWzFdLngsIGxpbmVbMF0ueSAtIGxpbmVbMV0ueSk7XHJcblx0XHRcdGVuZFBvaW50ID0gc3RhcnRQb2ludC5wcm9qZWN0KGF4aXMpO1xyXG5cclxuXHRcdFx0Ly9cdENyZWF0ZSB0aGUgbGluZWFyIGdyYWRpZW50IG9iamVjdFxyXG5cdFx0XHRsZXQgZ3JhZCA9IHRoaXMuX2NhbnZhc0NvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXHJcblx0XHRcdFx0c3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xyXG5cclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ly9cdEdldCByYW5kb20gbGluZWFyIGdyYWRpZW50IGNvbG9yc1xyXG5cdFx0XHQvL1x0YW5kIGFkZCBjb2xvcnNcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0bGV0IGdyYWRDb2xvcnMgPSBjb2xvclV0aWxzLnJhbmRvbUdyYWRpZW50KGNvbG9yVXRpbHMucmFuZG9tQ29sb3IoY29sb3IsXHJcblx0XHRcdFx0dXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIDAuMykpLFx0Ly9cdEludGVuc2l0eSBvZiB0aGUgYmFzZSBjb2xvclxyXG5cdFx0XHRcdFx0dXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIDAuMSkpO1x0Ly9cdEludGVuc2l0eSBvZiB0aGUgcmFuZG9tIGdyYWRpZW50XHJcblx0XHRcdGdyYWQuYWRkQ29sb3JTdG9wKDAsIGdyYWRDb2xvcnMuZmlyc3QpO1xyXG5cdFx0XHRncmFkLmFkZENvbG9yU3RvcCgxLCBncmFkQ29sb3JzLnNlY29uZCk7XHJcblxyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWQ7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5fY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBjb2xvclV0aWxzLnJhbmRvbUNvbG9yKGNvbG9yKTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yVXRpbHMucmFuZG9tQ29sb3IoY29sb3IpO1xyXG5cdH1cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ly9cdERyYXcgdGhlIHBvbHlnb25cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5iZWdpblBhdGgoKTtcclxuXHR2YXIgcG9pbnRzID0gcG9seWdvbi5wb2ludHM7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQubW92ZVRvKHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmxpbmVUbyhwb2ludHNbaV0ueCwgcG9pbnRzW2ldLnkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbCgpO1xyXG5cclxuXHQvL1x0UmVzdG9yZSBwcmV2aW91cyBzdGF0ZXNcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LnJlc3RvcmUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBjbGVhciB0aGUgY2FudmFzIGFuZCBnZW5lcmF0ZSBhIGJhY2tncm91bmQgd2l0aCB0aGUgbW9kZVxyXG4gKi9cclxuUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpe1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuX2NhbnZhcy5jbGllbnRXaWR0aCwgdGhpcy5fY2FudmFzLmNsaWVudEhlaWdodCk7XHJcblxyXG5cdHRoaXMuX21vZGUuZ2VuZXJhdGUoKTtcclxuXHJcblx0dmFyIHByaW1pdGl2ZXMgPSB0aGlzLl9tb2RlLmdldFByaW1pdGl2ZXMoKTtcclxuXHR2YXIgYmFzZUNvbG9ycyA9IHRoaXMuX21vZGUuZ2V0QmFzZUNvbG9ycygpO1xyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHByaW1pdGl2ZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciByYW5kQ29sb3IgPSBiYXNlQ29sb3JzW3V0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCBiYXNlQ29sb3JzLmxlbmd0aCldO1xyXG5cdFx0dGhpcy5fZmlsbFBvbHlnb24ocmFuZENvbG9yLCBwcmltaXRpdmVzW2ldLCB0cnVlKTtcclxuXHR9XHJcbn07XHJcblxyXG4vL1x0RXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3I7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcbi8qXHJcbiAqICBDaGVjayBpZiBhIHN0cmluZyBpcyBpbiBhIGhleCBjb2xvciBmb3JtYXRcclxuICogIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHN0cmluZyBpcyBpbiBhIGhleCBmb3JtYXRcclxuICogIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogVGhlIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGNvbG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0hleChjb2xvcikge1xyXG4gICAgcmV0dXJuIC8jW2EtZjAtOV17Nn0vZ2kudGVzdChjb2xvcik7XHJcbn1cclxuXHJcbi8qXHJcbiAqICBDaGVjayBpZiBhIHN0cmluZyBpcyBpbiBhIHJnYiBjb2xvciBmb3JtYXRcclxuICogIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHN0cmluZyBpcyBpbiBhIHJnYiBmb3JtYXRcclxuICogIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogVGhlIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGNvbG9yXHJcbiAqL1xyXG4gZnVuY3Rpb24gaXNSZ2IoY29sb3IpIHtcclxuICAgIC8vICBFbGltaW5hdGUgd2hpdGUgc3BhY2VzXHJcbiAgICBjb2xvciA9IGNvbG9yLnJlcGxhY2UoL1xccy9nLCBcIlwiKTtcclxuICAgIHJldHVybiAvcmdiXFwoW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwpL2kudGVzdChjb2xvcik7XHJcbn1cclxuIC8qXHJcbiogIENoZWNrIGlmIGEgc3RyaW5nIGlzIGluIGEgcmdiYSBjb2xvciBmb3JtYXRcclxuKiAgQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGluIGEgcmdiYSBmb3JtYXRcclxuKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29sb3JcclxuKi9cclxuZnVuY3Rpb24gaXNSZ2JhKGNvbG9yKSB7XHJcbiAvLyAgRWxpbWluYXRlIHdoaXRlIHNwYWNlc1xyXG4gY29sb3IgPSBjb2xvci5yZXBsYWNlKC9cXHMvZywgXCJcIik7XHJcbiByZXR1cm4gL3JnYmFcXChbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcKS9pLnRlc3QoY29sb3IpO1xyXG5cclxufVxyXG5cclxuLypcclxuICpcdENvbnZlcnQgaGV4IGNvbG9yIHRvIHJnYiBjb2xvclxyXG4gKiAgQHJldHVybiB7c3RyaW5nIC8gbnVsbH0gQ29udmVydGVkIGNvbG9yIHN0cmluZyBvciBudWxsIGlmIHRoZSBpbnB1dCBpcyBpbnZhbGlkXHJcbiAqL1xyXG5mdW5jdGlvbiBoZXhUb1JnYihoZXgpIHtcclxuICAgIGlmIChpc0hleChoZXgpKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiKFwiICtcclxuICAgICAgICBwYXJzZUludChoZXguc3Vic3RyKDEsIDIpLCAxNikgKyBcIiwgXCIgK1xyXG4gICAgICAgIHBhcnNlSW50KGhleC5zdWJzdHIoMywgMiksIDE2KSArIFwiLCBcIiArXHJcbiAgICAgICAgcGFyc2VJbnQoaGV4LnN1YnN0cig1LCAyKSwgMTYpICsgXCIpXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiBpc1JnYihoZXgpIHx8IGlzUmdiYShoZXgpID8gaGV4IDogbnVsbDtcclxufVxyXG5cclxuLypcclxuICpcdEFkanVzdCB0aGUgYnJpZ2h0bmVzcyBvZiBhIGNvbG9yIGJ5IHBlcmNlbnRhZ2VcclxuICogIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogVGhlIGNvbG9yIHN0cmluZ1xyXG4gKiAgQHBhcmFtIHtmbG9hdH0gcGVyY2VudGFnZTogQSBmbG9hdCB3aXRoaW4gWy0xLCAxXSBieSB3aGljaCB0aGUgYnJpZ2h0bmVzcyBpcyBhZGp1c3RlZC5cclxuICpcdFx0XHRcdFx0XHRcdCAgIDEgbWVhbnMgbWF4aW11bSBkYXJrbmVzcyBhbmQgLTEgbWVhbnMgbWF4aW11bSBicmlnaHRuZXNzLlxyXG4gKi9cclxuZnVuY3Rpb24gYWRqdXN0Q29sb3JCcmlnaHRuZXNzKGNvbG9yLCBwZXJjZW50YWdlKSB7XHJcbiAgICBwZXJjZW50YWdlID0gcGVyY2VudGFnZSB8fCAwO1xyXG4gICAgY29sb3IgPSBoZXhUb1JnYihjb2xvcik7XHJcblxyXG4gICAgaWYgKGNvbG9yICE9PSBudWxsKSB7XHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy9cdFVzZSBkaWZmZXJlbnQgcmVnZXggYW5kIGZvcm1hdHMgZm9yIHJnYiBhbmQgcmdiYVxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIHZhciByZWd4ID0gaXNSZ2IoY29sb3IpID9cclxuICAgICAgICAgICAgL1tcXGRdezEsM31bLl0/W1xcZF0qL2dpIDogL1tcXGRdezEsM31bLl0/W1xcZF0qXFwsL2dpO1xyXG4gICAgICAgIHZhciBwb3N0Zml4ID0gaXNSZ2IoY29sb3IpID8gJycgOiAnLCc7XHJcblxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vICBSZXBsYWNlIHRoZSByLCBnIGFuZCBiIHdpdGggYWRqdXN0ZWQgbnVtYmVycyBhbmRcclxuICAgICAgICAvLyAgcm91bmQgdGhlbSB0byBpbnRlZ2Vyc1xyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIHJldHVybiBjb2xvci5yZXBsYWNlKHJlZ3gsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh1dGlscy5jbGFtcCgocGFyc2VJbnQoZSkgKiAoMSAtIHBlcmNlbnRhZ2UpKSwgMCwgMjU1KSlcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygpICsgcG9zdGZpeDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLypcclxuICogIEZ1bmN0aW9uIHRvIGdlbmVyYXRlIHJhbmRvbSBjb2xvciB3aXRoIHJhbmRvbSBicmlnaHRuZXNzXHJcbiAqICBiYXNlZCBvbiBhIGdpdmVuIGNvbG9yXHJcbiAqXHJcbiAqXHRAcmV0dXJuIHtzdHJpbmd9IEEgc3RyaW5nIG9mIGdlbmVyYXRlZCBjb2xvclxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGJhc2VDb2xvcjogQSBjb2xvciBzdHJpbmcgaW4gSEVYLCBSR0Igb3IgUkdCQVxyXG4gKlx0QHBhcmFtIHtmbG9hdH0gYnJpZ2h0bmVzc0ludGVuc2l0eShPcHRpb25hbCk6IFRoZSBicmlnaHRuZXNzIGludGVuc2l0eSB3aXRoaW4gWzAsIDFdIHRvIGdlbmVyYXRlXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBhcm91bmQuIDAgbWVhbnMgZ2VuZXJhdGUgYXJvdW5kIDAgYnJpZ2h0bmVzcyBjaGFuZ2VzLFxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgMC41IG1lYW5zIGdlbmVyYXRlIGFyb3VuZCA1MCUgYnJpZ2h0bmVzcyBjaGFuZ2VzIGFuZFxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgMSBtZWFucyBnZW5lcmF0ZSBhcm91bmQgbWF4aW11bSBicmlnaHRuZXNzIGNoYW5nZXMuXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBUaGUgYnJpZ2h0bmVzcyBjaGFuZ2VzIHdpbGwgYmUgZWl0aGVyIGRyYWtlbmluZyBvciBicmlnaHRlbmluZy5cclxuICovXHJcbiBmdW5jdGlvbiByYW5kb21Db2xvcihiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpe1xyXG4gICAgIGJyaWdodG5lc3NJbnRlbnNpdHkgPSBicmlnaHRuZXNzSW50ZW5zaXR5IHx8IDAuNTtcclxuICAgICB2YXIgdGhyZXNob2xkID0gMC4yLFxyXG4gICAgICAgICByYW5nZUxvd2VyID0gdXRpbHMuY2xhbXAoYnJpZ2h0bmVzc0ludGVuc2l0eSAtIHRocmVzaG9sZCwgMCwgMSksXHJcbiAgICAgICAgIHJhbmdlVXBwZXIgPSB1dGlscy5jbGFtcChicmlnaHRuZXNzSW50ZW5zaXR5ICsgdGhyZXNob2xkLCAwLCAxKTtcclxuXHJcbiAgICAgLy9cdFVzZWQgdG8gZ2V0IGEgZWl0aGVyIG5lZ2F0aXZlIG9yIHBvc2l0aXZlIHJhbmRvbSBudW1iZXJcclxuICAgICB2YXIgcmFuZG9tQXJyID0gW1xyXG4gICAgICAgICB1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UocmFuZ2VMb3dlciwgcmFuZ2VVcHBlciAtIHRocmVzaG9sZCwgZmFsc2UpLCAvLyAgRGFya2VuXHJcbiAgICAgICAgIHV0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgtcmFuZ2VVcHBlciwgLXJhbmdlTG93ZXIsIGZhbHNlKV07ICAvLyAgQnJpZ2h0ZW5cclxuXHJcbiAgICAgLy9cdENvbG9yIHZhbGlkaXR5IGNoZWNraW5nIGluIGFkanVzdENvbG9yQnJpZ2h0bmVzc1xyXG4gICAgIHJldHVybiBhZGp1c3RDb2xvckJyaWdodG5lc3MoYmFzZUNvbG9yLCByYW5kb21BcnJbdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIDIpXSk7XHJcbiB9XHJcblxyXG4vKlxyXG4gKiAgRnVuY3Rpb24gdG8gZ2VuZXJhdGUgcmFuZG9tIGdyYWRpZW50IGNvbG9yIHdpdGggcmFuZG9tIGJyaWdodG5lc3Mgb24gYm90aCBzaWRlc1xyXG4gKiAgb2YgdGhlIGxpbmVhciBncmFkaWVudCBiYXNlZCBvbiBhIGdpdmVuIGNvbG9yXHJcbiAqXHJcbiAqXHRAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBwYWlyIG9mIGNvbG9yc1xyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGJhc2VDb2xvcjogQSBjb2xvciBzdHJpbmcgaW4gSEVYLCBSR0Igb3IgUkdCQVxyXG4gKlx0QHBhcmFtIHtmbG9hdH0gYnJpZ2h0bmVzc0ludGVuc2l0eShPcHRpb25hbCk6IFRoZSBicmlnaHRuZXNzIGludGVuc2l0eSB3aXRoaW4gWzAsIDFdIHRvIGdlbmVyYXRlXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBhcm91bmQuIFRoZSBzYW1lIGFzIHRoZSBvbmUgaW4gcmFuZG9tQ29sb3JcclxuICovXHJcbiBmdW5jdGlvbiByYW5kb21HcmFkaWVudChiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpIHtcclxuICAgICBicmlnaHRuZXNzSW50ZW5zaXR5ID0gYnJpZ2h0bmVzc0ludGVuc2l0eSB8fCAwLjU7XHJcbiAgICAgcmV0dXJuIHtcclxuICAgICAgICAgZmlyc3Q6IHJhbmRvbUNvbG9yKGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSksXHJcbiAgICAgICAgIHNlY29uZDogcmFuZG9tQ29sb3IoYmFzZUNvbG9yLCBicmlnaHRuZXNzSW50ZW5zaXR5KVxyXG4gICAgIH07XHJcbiB9XHJcblxyXG4vLyAgRXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cy5pc0hleCA9IGlzSGV4O1xyXG5tb2R1bGUuZXhwb3J0cy5pc1JnYiA9IGlzUmdiO1xyXG5tb2R1bGUuZXhwb3J0cy5pc1JnYmEgPSBpc1JnYmE7XHJcbm1vZHVsZS5leHBvcnRzLmhleFRvUmdiID0gaGV4VG9SZ2I7XHJcbm1vZHVsZS5leHBvcnRzLmFkanVzdENvbG9yQnJpZ2h0bmVzcyA9IGFkanVzdENvbG9yQnJpZ2h0bmVzcztcclxubW9kdWxlLmV4cG9ydHMucmFuZG9tQ29sb3IgPSByYW5kb21Db2xvcjtcclxubW9kdWxlLmV4cG9ydHMucmFuZG9tR3JhZGllbnQgPSByYW5kb21HcmFkaWVudDtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb2xvclV0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcbi8qXHJcbiAqIE1vZGUgb2JqZWN0XHJcbiAqXHJcbiAqIFRoZSBtb2RlIG9iamVjdCAoZS5nLiAnUG9seWdvbmFsJykgcmVzcG9uc2libGUgZm9yIGdlbmVyYXRpbmcgcHJpbWl0aXZlIHNoYXBlc1xyXG4gKiB0byBkcmF3IHdpdGhcclxuICovXHJcblxyXG4gLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gLy8gRGVwZW5kZW5jaWVzXHJcbiAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiB2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcbiB2YXIgR3JhcGggPSByZXF1aXJlKCcuL2dyYXBoJyk7XHJcbiB2YXIgVmVjdG9yID0gcmVxdWlyZSgnLi92ZWN0b3InKTtcclxuXHJcbi8qXHJcbiAqIEJhc2UgbW9kZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAcGFyYW0ge051bWJlcn0gY2FudmFzV2lkdGg6IFRoZSB3aWR0aCBvZiB0aGUgY2FudmFzXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNIZWlnaHQ6IFRoZSBoZWlnaHQgb2YgdGhlIGNhbnZhc1xyXG4gKiBAcGFyYW0ge1N0cmluZyhBcmdzKX0gYmFzZUNvbG9yczogYSBzZXQgb2YgdmFyaWFibGUgbnVtYmVyIG9mIGNvbG9yIHN0cmluZ3MgdXNlZFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXMgdGhlIGJhc2UgY29sb3JzIG9mIHRoZSBiYWNrZ3JvdW5kXHJcbiAqL1xyXG5mdW5jdGlvbiBNb2RlKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQsIGJhc2VDb2xvcnMpIHtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIEJhc2UgY2xhc3MgbWVtYmVyc1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB0aGlzLl9iYXNlQ29sb3JzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDIsIGFyZ3VtZW50cy5sZW5ndGgpO1xyXG4gICAgdGhpcy5fcHJpbWl0aXZlcyA9IFtdO1xyXG4gICAgdGhpcy5fd2lkdGggPSBjYW52YXNXaWR0aCB8fCAwO1xyXG4gICAgdGhpcy5faGVpZ2h0ID0gY2FudmFzSGVpZ2h0IHx8IDA7XHJcbn1cclxuXHJcbi8qXHJcbiAqIFB1YmxpYyB2aXJ0dWFsIGZ1bmN0aW9uIC0gc2V0IHRoZSBhcnJheSBvZiBjb2xvciBzdHJpbmdzXHJcbiAqXHJcbiAqL1xyXG5Nb2RlLnByb3RvdHlwZS5zZXRCYXNlQ29sb3JzID0gZnVuY3Rpb24oYXJncykge1xyXG4gICAgdGhpcy5fYmFzZUNvbG9ycyA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyB2aXJ0dWFsIGZ1bmN0aW9uIC0gcmV0dXJuIGFuIGFycmF5IG9mIGNvbG9yIHN0cmluZ3NcclxuICpcclxuICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIGNvbG9yIHN0cmluZ3NcclxuICovXHJcbk1vZGUucHJvdG90eXBlLmdldEJhc2VDb2xvcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9iYXNlQ29sb3JzO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIHZpcnR1YWwgZnVuY3Rpb24gLSByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIHByaW1pdGl2ZSBzaGFwZXMgdG8gZHJhdyB3aXRoXHJcbiAqXHJcbiAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBwcmltaXRpdmUgc2hhcGVzXHJcbiAqL1xyXG5Nb2RlLnByb3RvdHlwZS5nZXRQcmltaXRpdmVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcHJpbWl0aXZlcztcclxufTtcclxuXHJcbi8qXHJcbiAqIFBvbHlnb25hbCBtb2RlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IGRlbnNpdHk6IFRoZSBkZW5zaXR5IG9mIHRoZSBwb2x5Z29ucywgaW4gdGhlIHJhbmdlIG9mIFswLCAxXS5cclxuICogICAgICAgICAgICAgICAgICAgICAgICAgMCBpcyB0aGUgc3BhcnNlc3QgYW5kIDEgaXMgdGhlIGRlbnNlc3QuXHJcbiAqIEBwYXJhbSB7U3RyaW5nKEFyZ3MpfSBiYXNlQ29sb3JzOiBhIHNldCBvZiB2YXJpYWJsZSBudW1iZXIgb2YgY29sb3Igc3RyaW5ncyB1c2VkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcyB0aGUgYmFzZSBjb2xvcnMgb2YgdGhlIGJhY2tncm91bmRcclxuICogQHBhcmFtIHtOdW1iZXJ9IGNhbnZhc1dpZHRoOiBUaGUgd2lkdGggb2YgdGhlIGNhbnZhc1xyXG4gKiBAcGFyYW0ge051bWJlcn0gY2FudmFzSGVpZ2h0OiBUaGUgaGVpZ2h0IG9mIHRoZSBjYW52YXNcclxuXHJcbiAqL1xyXG5mdW5jdGlvbiBQb2x5Z29uYWxNb2RlKGRlbnNpdHksIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQsIGJhc2VDb2xvcnMpIHtcclxuICAgIC8vICBDYWxsIHRoZSBiYXNlIGNvbnN0cnVjdG9yIGFuZCBpbml0IGJhc2UgY2xhc3MgbWVtYmVyc1xyXG4gICAgUG9seWdvbmFsTW9kZS5fc3VwZXIuYXBwbHkodGhpcywgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDEsIGFyZ3VtZW50cy5sZW5ndGgpKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBDbGFzcy1zcGVjaWZpYyBtZW1iZXJzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHRoaXMuX2RlbnNpdHkgPSBkZW5zaXR5IHx8IDAuNTtcclxuICAgIHRoaXMuX2RlbnNpdHkgPSAxIC0gdGhpcy5fZGVuc2l0eTtcclxufVxyXG51dGlscy5pbmhlcml0KFBvbHlnb25hbE1vZGUsIE1vZGUpO1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vICBUaGUgYm91bmRzIG9mIHJhdGlvXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fVVBQRVJfQk9VTkQgPSAwLjM7XHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19MT1dFUl9CT1VORCA9IDAuMDE7XHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19ESUYgPVxyXG4gICAgUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuREVOU0lUWV9SQVRPX1VQUEVSX0JPVU5EIC1cclxuICAgIFBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19MT1dFUl9CT1VORDtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBzZXQgdGhlIGRlbnNpdHkgb2YgcG9seWdvbnNcclxuICpcclxuICovXHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLnNldERlbnNpdHkgPSBmdW5jdGlvbihkZW5zaXR5KSB7XHJcbiAgICB0aGlzLl9kZW5zaXR5ID0gMSAtIGRlbnNpdHk7XHJcbn07XHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSByZXR1cm4gdGhlIGRlbnNpdHkgb2YgcG9seWdvbnNcclxuICpcclxuICogQHJldHVybiB7ZmxvYXR9IGRlbnNpdHlcclxuICovXHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLmdldERlbnNpdHkgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiAxIC0gdGhpcy5fZGVuc2l0eTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFByaXZhdGUgaGVscGVyIGZ1bmN0aW9uIC0gZ2VuZXJhdGUgcG9pbnRzIHRvIGRyYXcgd2l0aFxyXG4gKiBJdCBkaXZpZGVzIHRoZSB3aG9sZSBjYW52YXMgaW50byBzbWFsbCBncmlkcyBhbmQgZ2VuZXJhdGUgYSByYW5kb20gcG9pbnQgaW4gZXZlcnlcclxuICogZ3JpZFxyXG4gKlxyXG4gKiBAcmV0dXJuIG5vbmVcclxuICovXHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLl9nZW5lcmF0ZVByaW1pdGl2ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vICBDbGVhciBwcmV2aW91cyBkYXRhXHJcbiAgICB0aGlzLl9wcmltaXRpdmVzID0gW107XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIFdpZHRoIGFuZCBoZWlnaHQgb2YgZXZlcnkgc21hbGwgZ3JpZFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdmFyIHJhdGlvID0gdGhpcy5ERU5TSVRZX1JBVE9fTE9XRVJfQk9VTkQgKyB0aGlzLkRFTlNJVFlfUkFUT19ESUYgKiB0aGlzLl9kZW5zaXR5O1xyXG4gICAgdmFyIHdpZHRoSW50ZXJ2YWwgPSAgcmF0aW8gKiB0aGlzLl93aWR0aCxcclxuICAgICAgICBoZWlnaHRJbnRlcnZhbCA9IHJhdGlvICogdGhpcy5faGVpZ2h0O1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIENvdW50cyBvZiByb3dzIGFuZCBjb2x1bW5zIHBsdXMgdGhlIHRvcFxyXG4gICAgLy8gIGFuZCBsZWZ0IGJvdW5kcyBvZiB0aGUgcmVjdGFuZ2xlXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHZhciByb3dDb3VudCA9IE1hdGguZmxvb3IodGhpcy5fd2lkdGggLyB3aWR0aEludGVydmFsKSArIDEsXHJcbiAgICAgICAgY29sQ291bnQgPSBNYXRoLmZsb29yKHRoaXMuX2hlaWdodCAvIGhlaWdodEludGVydmFsKSArIDE7XHJcblxyXG4gICAgLy8gIFVzZSBhIGdyYXBoIHRvIHJlcHJlc2VudCB0aGUgZ3JpZHMgb24gdGhlIGNhbnZhc1xyXG4gICAgdmFyIGdyYXBoID0gbmV3IEdyYXBoKHJvd0NvdW50LCBjb2xDb3VudCk7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgUG9pbnRzIG9mIGV2ZXJ5IHNtYWxsIGdyaWRcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdmFyIHAxID0gbmV3IFZlY3RvcigwLCAwKSxcclxuICAgICAgICBwMiA9IG5ldyBWZWN0b3Iod2lkdGhJbnRlcnZhbCwgMCksXHJcbiAgICAgICAgcDMgPSBuZXcgVmVjdG9yKHdpZHRoSW50ZXJ2YWwsIGhlaWdodEludGVydmFsKSxcclxuICAgICAgICBwNCA9IG5ldyBWZWN0b3IoMCwgaGVpZ2h0SW50ZXJ2YWwpO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBSYW5kb21seSBnZW5lcmF0ZSBwb2ludHMgb24gdGhlIGNhbnZhc1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5kUG9pbnQ7XHJcblxyXG4gICAgICAgICAgICAvLyAgU2hyaW5rIHRoZSByZWN0YW5nbGUgdG8gcHJvZHVjZSBsZXNzIG1lc3N5IHBvaW50c1xyXG4gICAgICAgICAgICB2YXIgc2hyaW5rZWQgPSB1dGlscy5zaHJpbmtSZWN0KHAxLCBwMiwgcDMsIHA0LCB3aWR0aEludGVydmFsIC8gNSAsIDApO1xyXG5cclxuICAgICAgICAgICAgaWYgKGogPT09IDApIHsgIC8vICBJZiBhdCB0aGUgbGVmdCBib3VuZFxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gbmV3IFZlY3RvcihpICogd2lkdGhJbnRlcnZhbCwgaiAqIGhlaWdodEludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSB1dGlscy5nZXRSYW5kb21Qb2ludE9uUmVjdChzaHJpbmtlZC5wMSwgc2hyaW5rZWQucDEsIHNocmlua2VkLnA0LCBzaHJpbmtlZC5wNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaiA9PT0gY29sQ291bnQgLSAxKSB7ICAgLy8gIElmIGF0IHRoZSByaWdodCBib3VuZFxyXG4gICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gdXRpbHMuZ2V0UmFuZG9tUG9pbnRPblJlY3Qoc2hyaW5rZWQucDIsIHNocmlua2VkLnAyLCBzaHJpbmtlZC5wMywgc2hyaW5rZWQucDMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHsgICAvLyAgSWYgYXQgdGhlIHRvcCBib3VuZFxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHNocmlua2VkLnAxLCBzaHJpbmtlZC5wMiwgc2hyaW5rZWQucDIsIHNocmlua2VkLnAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGkgPT09IHJvd0NvdW50IC0gMSkgeyAgIC8vICBJZiBhdCB0aGUgYm90dG9tIGJvdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gdXRpbHMuZ2V0UmFuZG9tUG9pbnRPblJlY3Qoc2hyaW5rZWQucDQsIHNocmlua2VkLnAzLCBzaHJpbmtlZC5wMywgc2hyaW5rZWQucDQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gdXRpbHMuZ2V0UmFuZG9tUG9pbnRPblJlY3Qoc2hyaW5rZWQucDEsIHNocmlua2VkLnAyLCBzaHJpbmtlZC5wMywgc2hyaW5rZWQucDQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdyYXBoLmluc2VydChpLCBqLCByYW5kUG9pbnQpO1xyXG5cclxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIC8vICBNb3ZlIHRoZSBjdXJyZW50IHNtYWxsIGdyaWQgdG8gdGhlXHJcbiAgICAgICAgICAgIC8vICByaWdodCBieSBvbmUgaW50ZXJ2YWwgdW5pdFxyXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgcDEueCArPSB3aWR0aEludGVydmFsO1xyXG4gICAgICAgICAgICBwMi54ICs9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgICAgIHAzLnggKz0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICAgICAgcDQueCArPSB3aWR0aEludGVydmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvLyAgTW92ZSB0aGUgY3VycmVudCBzbWFsbCBncmlkIGJhY2sgdG8gdGhlXHJcbiAgICAgICAgLy8gIGxlZnQgbW9zdCBib3VuZCBhbmQgbW92ZSBpdCBkb3duIGJ5IG9uZSBpbnRlcnZhbCB1bml0XHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgcDEueCA9IHA0LnggPSAwO1xyXG4gICAgICAgIHAyLnggPSBwMy54ID0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICBwMS55ICs9IGhlaWdodEludGVydmFsO1xyXG4gICAgICAgIHAyLnkgKz0gaGVpZ2h0SW50ZXJ2YWw7XHJcbiAgICAgICAgcDMueSArPSBoZWlnaHRJbnRlcnZhbDtcclxuICAgICAgICBwNC55ICs9IGhlaWdodEludGVydmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQXMgd2UgYXJlIGdvaW5nIHRvIGNoZWNrIGFkamFjZW50IHZlcnRpY2VzXHJcbiAgICAvLyAgaXQncyBlYXNpZXIgdG8gc3RvcmUgYWxsIGRlbHRhIGluZGV4IHZhbHVlcyBhbmRcclxuICAgIC8vICBsb29wIG92ZXIgdGhlbVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHZhciBkaSA9IFstMSwgLTEsIC0xLCAgMCwgIDEsIDEsIDEsIDBdLFxyXG4gICAgICAgIGRqID0gWy0xLCAgMCwgIDEsICAxLCAgMSwgMCwgLTEsIC0xXTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBDb25uZWN0IGFsbCBhZGphY2VudCB2ZXJ0aWNlc1xyXG4gICAgLy8gIGFuZCBnZXQgYWxsIHByaW1pdGl2ZXNcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgIC8vICBLZWVwIGNvdW50IG9mIHRoZSBwb2ludHMgdGhhdCBhcmUgYWN0dWFsbHkgcHJvY2Vzc2VkXHJcbiAgICAgICAgICAgIGxldCBjbnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IGZpcnN0UG9pbnQsIHByZXZQb2ludDtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZGkubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyUG9pbnQgPSBncmFwaC5nZXQoaSArIGRpW2tdLCBqICsgZGpba10pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaC5jb25uZWN0KGksIGosIGkgKyBkaVtrXSwgaiArIGRqW2tdKTtcclxuICAgICAgICAgICAgICAgICAgICBjbnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNudCA9PT0gMSkgeyAgICAvLyAgQXNzaWduIGZpcnN0IHBvaW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0UG9pbnQgPSBjdXJyUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmltaXRpdmVzLnB1c2gobmV3IHV0aWxzLlBvbHlnb24oWyAgIC8vICBBZGQgcG9seWdvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGguZ2V0KGksIGopLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldlBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclBvaW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldlBvaW50ID0gY3VyclBvaW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAvLyAgQ29ubmVjdCB0aGUgZmlyc3QgcG9pbnQgd2l0aCB0aGVcclxuICAgICAgICAgICAgLy8gIGxhc3QgcG9pbnQgYW5kIGFkZCBwb2x5Z29uXHJcbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICBpZiAoZmlyc3RQb2ludCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICBwcmV2UG9pbnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgIWZpcnN0UG9pbnQuZXF1YWwocHJldlBvaW50KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJpbWl0aXZlcy5wdXNoKG5ldyB1dGlscy5Qb2x5Z29uKFtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaC5nZXQoaSwgaiksXHJcbiAgICAgICAgICAgICAgICAgICAgcHJldlBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0UG9pbnRcclxuICAgICAgICAgICAgICAgIF0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59O1xyXG5cclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX2dlbmVyYXRlUHJpbWl0aXZlcygpO1xyXG59O1xyXG5cclxuLy8gIEV4cG9ydCBhbiBvYmplY3QgZm9yIGRpcmVjdCBsb29rdXBcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBQb2x5Z29uYWw6IFBvbHlnb25hbE1vZGVcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9tb2Rlcy5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuLypcclxuICogVW5kaXJlY3RlZCBhY3lsaWMgZ3JhcGggZGF0YSBzdHJ1Y3R1cmUgdXNpbmdcclxuICogYWRqYWNlbnkgbWF0cml4IGFzIGltcGxlbWVudGF0aW9uXHJcbiAqXHJcbiAqL1xyXG5cclxuLypcclxuICogR3JhcGggY2xhc3MgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtJbnRlZ2VyfSByb3dDb3VudDogVGhlIG51bWJlciBvZiByb3dzXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gY29sdW1uQ291bnQ6IFRoZSBudW1iZXIgb2YgY29sdW1uc1xyXG4gKiBAb2FyYW0ge05vbi1vYmplY3QgdHlwZXN9IGluaXRpYWxWYWx1ZShPcHRpb25hbCk6IGluaXRpYWxWYWx1ZSBmb3IgYWxsIGVsZW1lbnRzIGluIHRoZSBncmFwaC4gSXQncyAwIGJ5IGRlZmF1bHQuXHJcbiAqL1xyXG5mdW5jdGlvbiBHcmFwaChyb3dDb3VudCwgY29sdW1uQ291bnQsIGluaXRpYWxWYWx1ZSkge1xyXG4gICAgdGhpcy5fcm93Q291bnQgPSByb3dDb3VudCB8fCAwO1xyXG4gICAgdGhpcy5fY29sdW1uQ291bnQgPSBjb2x1bW5Db3VudCB8fCAwO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQWxsb2NhdGUgYW4gZW1wdHkgbWF0cml4XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdGhpcy5fZGF0YSA9IG5ldyBBcnJheShyb3dDb3VudCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICB0aGlzLl9kYXRhW2ldID0gbmV3IEFycmF5KGNvbHVtbkNvdW50KS5maWxsKGluaXRpYWxWYWx1ZSB8fCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9lZGdlcyA9IHt9O1xyXG59XHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIG1lbWJlciBmdW5jdGlvbiAtIGNoZWNrIGlmIGEgcGFpciBvZiBwb3NpdGlvbnMgaXMgaW4gdGhlIHJhbmdlIG9mIHJvd3MgYW5kIGNvbHVtbnNcclxuICpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgcGFpciBvZiBwb3NpdGlvbnMgaXMgaW4gdGhlIGJvdW5kIGFuZCBmYWxzZSBpZiBub3RcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5fY2hlY2tCb3VuZCA9IGZ1bmN0aW9uKGksIGopIHtcclxuICAgIGlmIChpID49IHRoaXMuX3Jvd0NvdW50IHx8XHJcbiAgICAgICAgaiA+PSB0aGlzLl9jb2x1bW5Db3VudCB8fFxyXG4gICAgICAgIGkgPCAwIHx8IGogPCAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFByaXZhdGUgbWVtYmVyIGZ1bmN0aW9uIC0gZ2V0IGFuIGlkIGZyb20gYSBwYWlyIG9mIHBvc2l0aW9uc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBpZCBvZiB0aGUgcGFpciBvZiBwb3NpdGlvbnNcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5fZ2V0SWQgPSBmdW5jdGlvbihpLCBqKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fY2hlY2tCb3VuZChpLCBqKSA/IGkudG9TdHJpbmcoKSArIGoudG9TdHJpbmcoKSA6IG51bGw7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gcmV0dXJuIHRoZSBjb3VudCBvZiByb3dzXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUucm93Q291bnQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9yb3dDb3VudDtcclxufTtcclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIHJldHVybiB0aGUgY291bnQgb2YgY29sdW1uc1xyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmNvbHVtbkNvdW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fY29sdW1uQ291bnQ7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gaW5zZXJ0IGFuIGVsZW1lbnQgdG8gdGhlIGdyYXBoXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgaW5zZXJ0aW9uIGlzIHN1Y2Nlc3NmdWwgYW5kIGZhbHNlIGlmIG5vdFxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGk6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGo6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0FueX0gdmFsdWU6IFRoZSB2YWx1ZSB0byBpbnNlcnRcclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihpLCBqLCB2YWx1ZSkge1xyXG4gICAgaWYgKHRoaXMuX2NoZWNrQm91bmQoaSwgaikpIHtcclxuICAgICAgICB0aGlzLl9kYXRhW2ldW2pdID0gdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBnZXQgYSBlbGVtZW50IGZyb20gYSBwYWlyIG9mIHBvc2l0aW9uXHJcbiAqXHJcbiAqIEByZXR1cm4ge0FueSAvIG51bGx9IFRoZSBlbGVtZW50IGF0IHRoZSBwb3NpdGlvbiBpZiB0aGUgcGFpciBvZiBwb3NpdGlvbnMgaXMgaW4gdGhlIGJvdW5kXHJcbiAqICAgICAgICAgICAgICAgICAgICAgIGFuZCBudWxsIGlmIG5vdFxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGk6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGo6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGksIGopIHtcclxuICAgIGlmICh0aGlzLl9jaGVja0JvdW5kKGksIGopKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbaV1bal07XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGNoZWNrIGlmIHR3byB2ZXJ0aWNlcyBhcmUgY29ubmVjdGVkXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYSBjb25uZWN0aW9uIGJldHdlZW4gdHdvIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTEsIGkyOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqMSwgajI6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmlzQ29ubmVjdGVkID0gZnVuY3Rpb24oaTEsIGoxLCBpMiwgajIpIHtcclxuICAgIGlmICghdGhpcy5fY2hlY2tCb3VuZChpMSwgajEpIHx8XHJcbiAgICAgICAgIXRoaXMuX2NoZWNrQm91bmQoaTIsIGoyKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHZhciBpZDEgPSB0aGlzLl9nZXRJZChpMSwgajEpLFxyXG4gICAgICAgIGlkMiA9IHRoaXMuX2dldElkKGkyLCBqMik7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLl9lZGdlc1tpZDFdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9lZGdlc1tpZDFdW2lkMl07XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gY29ubmVjdCB0aGUgZWRnZSBvZiB0d28gdmVydGljZXNcclxuICpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgYWN0aW9uIGlzIHN1Y2Nlc3NmdWxcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpMSwgaTI6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGoxLCBqMjogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKGkxLCBqMSwgaTIsIGoyKSB7XHJcbiAgICBpZiAoIXRoaXMuX2NoZWNrQm91bmQoaTEsIGoxKSB8fFxyXG4gICAgICAgICF0aGlzLl9jaGVja0JvdW5kKGkyLCBqMikpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB2YXIgaWQxID0gdGhpcy5fZ2V0SWQoaTEsIGoxKSxcclxuICAgICAgICBpZDIgPSB0aGlzLl9nZXRJZChpMiwgajIpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5fZWRnZXNbaWQxXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aGlzLl9lZGdlc1tpZDFdID0ge307XHJcbiAgICB9XHJcbiAgICB0aGlzLl9lZGdlc1tpZDFdW2lkMl0gPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGRpc2Nvbm5lY3QgdGhlIGVkZ2Ugb2YgdHdvIHZlcnRpY2VzXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGFjdGlvbiBpcyBzdWNjZXNzZnVsXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTEsIGkyOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqMSwgajI6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbihpMSwgajEsIGkyLCBqMikge1xyXG4gICAgaWYgKCF0aGlzLl9jaGVja0JvdW5kKGkxLCBqMSkgfHxcclxuICAgICAgICAhdGhpcy5fY2hlY2tCb3VuZChpMiwgajIpKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgdmFyIGlkMSA9IHRoaXMuX2dldElkKGkxLCBqMSksXHJcbiAgICAgICAgaWQyID0gdGhpcy5fZ2V0SWQoaTIsIGoyKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMuX2VkZ2VzW2lkMV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9lZGdlc1tpZDFdW2lkMl0gPSBmYWxzZTtcclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8vICBFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzID0gR3JhcGg7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZ3JhcGguanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9