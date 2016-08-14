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
	    var back = new RandomBackgroundGenerator('canvas', 'Polygonal','#4183D7');
	    back.getMode().setDensity(0.5);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTRmMzYyNTBmYTAzNzU0NjliMzciLCJ3ZWJwYWNrOi8vLy4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sb3JVdGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBOzs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDakVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Es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QUFDbkIsWUFBVyxJQUFJO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLFdBQVc7QUFDdkI7QUFDQSxZQUFXLFFBQVE7QUFDbkIsWUFBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQVksUUFBUTtBQUNwQixZQUFXLFFBQVE7QUFDbkIsWUFBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLFFBQVE7QUFDcEIsWUFBVyxRQUFRO0FBQ25CLFlBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBWSxRQUFRO0FBQ3BCLFlBQVcsUUFBUTtBQUNuQixZQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EiLCJmaWxlIjoiaHRtbFRlc3QuZGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNTRmMzYyNTBmYTAzNzU0NjliMzdcbiAqKi8iLCIvKmpzaGludCBlc3ZlcnNpb246IDYgKi9cclxudmFyIFZlY3RvciA9IHJlcXVpcmUoJy4vLi4vLi4vc3JjL3ZlY3RvcicpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uL3NyYy91dGlscycpO1xyXG52YXIgUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vLi4vLi4vc3JjL1JhbmRvbUJhY2tncm91bmRHZW5lcmF0b3InKTtcclxuXHJcbnZhciBodG1sVGVzdCA9IHt9O1xyXG5cclxuaHRtbFRlc3QucnVuID0gZnVuY3Rpb24oY2FudmFzSWQpe1xyXG4gICAgdmFyIGJhY2sgPSBuZXcgUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvcignY2FudmFzJywgJ1BvbHlnb25hbCcsJyM0MTgzRDcnKTtcclxuICAgIGJhY2suZ2V0TW9kZSgpLnNldERlbnNpdHkoMC41KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZW5lcmF0ZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBiYWNrLmdlbmVyYXRlKCk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaHRtbFRlc3Q7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi90ZXN0L2h0bWxUZXN0L2h0bWxUZXN0LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypcclxuICogICAgICAgICAgICAgIFZlY3RvciBDbGFzc1xyXG4gKlxyXG4gKiAgICAgIFZlY3RvciBhbmQgdmVjdG9yIG9wZXJhdGlvbnMuXHJcbiAqL1xyXG5cclxuLypcclxuICogIENvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBWZWN0b3IoeCwgeSl7XHJcblx0dGhpcy54ID0geCB8fCAwO1xyXG5cdHRoaXMueSA9IHkgfHwgMDtcclxufVxyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5lcXVhbCA9IGZ1bmN0aW9uKHZlYykge1xyXG5cdHJldHVybiB0aGlzLnggPT09IHZlYy54ICYmIHRoaXMueSA9PT0gdmVjLnk7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHYpe1xyXG5cdHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2Lnk7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmxlbjIgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLmRvdCh0aGlzKTtcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUubGVuID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gTWF0aC5zcXJ0KHRoaXMubGVuMigpKTtcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbihzeCwgc3kpe1xyXG5cdHRoaXMueCAqPSBzeDtcclxuXHR0aGlzLnkgKj0gc3kgfHwgc3g7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHYpIHtcclxuXHR0aGlzLnggKz0gdi54O1xyXG5cdHRoaXMueSArPSB2Lnk7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKHYpe1xyXG5cdHRoaXMueCAtPSB2Lng7XHJcblx0dGhpcy55IC09IHYueTtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gbmV3IFZlY3Rvcih0aGlzLngsIHRoaXMueSk7XHJcbn07XHJcblxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cdE5vIHNpZGUgZWZmZWN0IGFuZCBjaGFpbmluZ1xyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuVmVjdG9yLnByb3RvdHlwZS5wcm9qZWN0ID0gZnVuY3Rpb24oYXhpcyl7XHJcblx0dmFyIGNvZiA9ICB0aGlzLmRvdChheGlzKSAvIGF4aXMubGVuMigpO1xyXG5cdHJldHVybiBheGlzLnNjYWxlKGNvZik7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLnByb2plY3ROID0gZnVuY3Rpb24oYXhpcyl7XHJcblx0dmFyIGNvZiA9ICB0aGlzLmRvdChheGlzKTtcclxuXHRyZXR1cm4gYXhpcy5zY2FsZShjb2YpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3I7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdmVjdG9yLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcbnZhciBWZWN0b3IgPSByZXF1aXJlKCcuL3ZlY3RvcicpO1xyXG5cclxuLypcclxuICpcdFBvbHlnb24gY2xhc3MgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzOiBUaGUgcG9pbnRzIG9mIHRoZSBwb2x5Z29uLiBUaGV5IG11c3QgYmUgaW4gY2xvY2t3aXNlIG9yIGNvdW50ZXItY2xvY2t3aXNlIG9yZGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBQb2x5Z29uKHBvaW50cykge1xyXG4gICAgdGhpcy5fcG9pbnRzID0gcG9pbnRzIHx8IFtdO1xyXG59XHJcblBvbHlnb24ucHJvdG90eXBlID0ge1xyXG4gICAgZ2V0IHBvaW50cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9pbnRzO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXQgcG9pbnRzKHBvaW50cykge1xyXG4gICAgICAgIHRoaXMuX3BvaW50cyA9IHBvaW50cztcclxuICAgIH0sXHJcblxyXG4gICAgZXF1YWw6IGZ1bmN0aW9uKHBvbHlnb24pIHtcclxuICAgICAgICB2YXIgcmV2ZXJzZWQgPSBwb2x5Z29uLnBvaW50cztcclxuICAgICAgICByZXZlcnNlZC5yZXZlcnNlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50cy5ldmVyeShmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5lcXVhbChwb2x5Z29uLnBvaW50c1tpbmRleF0pO1xyXG4gICAgICAgIH0pIHx8IHRoaXMucG9pbnRzLmV2ZXJ5KGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmVxdWFsKHJldmVyc2VkW2luZGV4XSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTaHJpbmsgYSByZWN0YW5nbGUgYnkgdmFsdWUgZHggYW5kIHZhbHVlIGR5XHJcbiAqXHJcbiAqIEByZXR1cm4ge09iamVjdH0gYW4gb2JqZWN0IGNvbnNpc3Rpbmcgb2YgdHJhbnNmb3JtZWQgcDEsIHAyLCBwMywgcDRcclxuICogQHBhcmFtIHtWZWN0b3J9IHAxLCBwMiwgcDMsIHA0OiBQb2ludHMgb2YgYSByZWN0YW5nbGUgc3RhcnRpbmdcclxuICpcdFx0XHRcdFx0XHRcdFx0ICAgZnJvbSB0aGUgdG9wIGxlZnQgY29ybmVyIGFuZCBnb2luZ1xyXG4gKlx0XHRcdFx0XHRcdFx0XHQgICBjbG9ja3dpc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBzaHJpbmtSZWN0KHAxLCBwMiwgcDMsIHA0LCBieUR4LCBieUR5KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgICdwMSc6IHAxLmNsb25lKCkuYWRkKG5ldyBWZWN0b3IoYnlEeCwgYnlEeSkpLFxyXG4gICAgICAgICdwMic6IHAyLmNsb25lKCkuYWRkKG5ldyBWZWN0b3IoLWJ5RHgsIGJ5RHkpKSxcclxuICAgICAgICAncDMnOiBwMy5jbG9uZSgpLmFkZChuZXcgVmVjdG9yKC1ieUR4LCAtYnlEeSkpLFxyXG4gICAgICAgICdwNCc6IHA0LmNsb25lKCkuYWRkKG5ldyBWZWN0b3IoLWJ5RHgsIGJ5RHkpKVxyXG4gICAgfTtcclxufVxyXG5cclxuLypcclxuICogIENsYW1wIGEgbnVtYmVyIHdpdGhpbiBhIHJhbmdlXHJcbiAqL1xyXG5mdW5jdGlvbiBjbGFtcCh4LCBsb3dlciwgdXBwZXIpe1xyXG4gICAgcmV0dXJuIHggPCBsb3dlciA/IGxvd2VyIDogeCA+IHVwcGVyID8gdXBwZXIgOiB4O1xyXG59XHJcblxyXG4vKlxyXG4gKlx0R2V0IGEgcmFuZG9tIG51bWJlciBmcm9tIGEgcmFuZ2VcclxuICpcclxuICpcdEByZXR1cm4ge2ludCAvIGZsb2F0fSBBIHJhbmRvbWx5IGdlbmVyYXRlZCBudW1iZXIgd2l0aGluIGEgcmFuZ2VcclxuICpcdEBwYXJhbSB7aW50IC8gZmxvYXR9IGxvd2VyOiBUaGUgbG93ZXIgYm91bmQgb2YgdGhlIHJhbmdlKEluY2x1c2l2ZSlcclxuICpcdEBwYXJhbSB7aW50IC8gZmxvYXR9IHVwcGVyOiBUaGUgdXBwZXIgYm91bmQgb2YgdGhlIHJhbmdlKEV4Y2x1c2l2ZSlcclxuICpcdEBwYXJhbSB7Ym9vbGVhbn0gaXNJbnQ6IFRoZSBmbGFnIHRvIHNwZWNpZnkgd2hldGhlciB0aGUgcmVzdWx0IGlzIGludCBvciBmbG9hdFxyXG4gKi9cclxuIGZ1bmN0aW9uIGdldFJhbmRvbU51bWJlckZyb21SYW5nZShsb3dlciwgdXBwZXIsIGlzSW50KSB7XHJcbiAgICAgaWYgKGxvd2VyID49IHVwcGVyKSByZXR1cm4gMDtcclxuICAgICBpc0ludCA9IGlzSW50IHx8IHRydWU7XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvL1x0U29tZSByYW5kb20gbnVtYmVycyBqdXN0IGNvbWluZyBvdXQgb2Ygbm93aGVyZVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdmFyIHNvbWVSYW5kb21OdW1iZXIxID0gMTI4NSxcclxuICAgICAgICBzb21lUmFuZG9tTnVtYmVyMiA9IDIzOTE7XHJcblxyXG4gICAgLy9cdEdlbmVyYXRlIHRoZSBpbnRlZ2VyIHBhcnRcclxuICAgIHZhciByYW5kb21JbnQgPVxyXG4gICAgICAgIHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBzb21lUmFuZG9tTnVtYmVyMSAqIE1hdGgucmFuZG9tKCkgKiBzb21lUmFuZG9tTnVtYmVyMikgJSAodXBwZXIgLSBsb3dlcik7XHJcblxyXG4gICAgaWYgKGlzSW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGxvd2VyICsgcmFuZG9tSW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbG93ZXIgKyByYW5kb21JbnQgKyBNYXRoLnJhbmRvbSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG4gKiAgR2V0IGEgcmFuZG9tIHBvaW50IG9uIGEgcmVjdGFuZ2xlXHJcbiAqXHJcbiAqXHRAcGFyYW0ge1ZlY3Rvcn0gcDEsIHAyLCBwMywgcDQ6IFBvaW50cyBvZiBhIHJlY3RhbmdsZSBzdGFydGluZ1xyXG4gKlx0XHRcdFx0XHRcdFx0XHQgICBmcm9tIHRoZSB0b3AgbGVmdCBjb3JuZXIgYW5kIGdvaW5nXHJcbiAqXHRcdFx0XHRcdFx0XHRcdCAgIGNsb2Nrd2lzZS5cclxuICpcdEBwYXJhbSB7Ym9vbGVhbn0gaXNJbnQ6IFRoZSBmbGFnIHRvIHNwZWNpZnkgd2hldGhlciB0aGUgcmVzdWx0IGlzIGludCBvciBmbG9hdFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmFuZG9tUG9pbnRPblJlY3QocDEsIHAyLCBwMywgcDQsIGlzSW50KSB7XHJcbiAgICBpc0ludCA9IGlzSW50IHx8IHRydWU7XHJcbiAgICB2YXIgd2lkdGggPSBNYXRoLmFicyhwMi54IC0gcDEueCksXHJcbiAgICAgICAgaGVpZ2h0ID0gTWF0aC5hYnMocDMueSAtIHAyLnkpLFxyXG4gICAgICAgIHRvcExlZnRYID0gTWF0aC5taW4ocDEueCwgcDIueCwgcDMueCwgcDQueCksXHJcbiAgICAgICAgdG9wTGVmdFkgPSBNYXRoLm1pbihwMS55LCBwMi55LCBwMy55LCBwNC55KTtcclxuXHJcbiAgICB2YXIgcmFuZG9tRGVsdGFYID0gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIHdpZHRoLCBpc0ludCksXHJcbiAgICAgICAgcmFuZG9tRGVsdGFZID0gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIGhlaWdodCwgaXNJbnQpO1xyXG5cclxuICAgIHJldHVybiBuZXcgVmVjdG9yKHRvcExlZnRYICsgcmFuZG9tRGVsdGFYLCB0b3BMZWZ0WSArIHJhbmRvbURlbHRhWSk7XHJcbn1cclxuXHJcbi8qXHJcbiAqICBHZXQgYSByYW5kb20gcG9pbnQgb24gYSBsaW5lXHJcbiAqICBAcGFyYW0ge1ZlY3Rvcn0gcDEsIHAyOiBQb2ludHMgb2YgYSBsaW5lIGZyb20gbGVmdCB0byByaWdodFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmFuZG9tUG9pbnRPbkxpbmUocDEsIHAyKSB7XHJcbiAgICB2YXIgcHJvamVjdGlvbldpZHRoID0gTWF0aC5hYnMocDEueCAtIHAyLngpLFxyXG4gICAgICAgIGxlZnRYID0gTWF0aC5taW4ocDEueCwgcDIueCk7XHJcblxyXG4gICAgdmFyIEEgPSAocDEueSAtIHAyLnkpIC8gKHAxLnggLSBwMi54KSxcclxuICAgICAgICBCID0gcDEueSAtIEEgKiBwMS54O1xyXG5cclxuICAgIHZhciByYW5kb21EZWx0YVggPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgcHJvamVjdGlvbldpZHRoLCBmYWxzZSk7XHJcbiAgICByZXR1cm4gbmV3IFZlY3RvcihsZWZ0WCArIHJhbmRvbURlbHRhWCwgQSAqIChsZWZ0WCArIHJhbmRvbURlbHRhWCkgKyBCKTtcclxufVxyXG5cclxuLypcclxuICogSGVscGVyIGZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlIGluaGVyaXRhbmNlXHJcbiAqXHJcbiAqIEByZXR1cm4gbm9uZVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdG9yOiBUaGUgY29uc3RydWN0b3Igb2YgdGhlIGN1cnJlbnQgb2JqZWN0XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN1cGVyQ3RvcjogVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBwYXJlbnQgb2JqZWN0XHJcbiAqL1xyXG4gZnVuY3Rpb24gaW5oZXJpdChjdG9yLCBzdXBlckN0b3IpIHtcclxuICAgICBjdG9yLl9zdXBlciA9IHN1cGVyQ3RvcjtcclxuICAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xyXG4gICAgICAgICBjb25zdHJ1Y3Rvcjoge1xyXG4gICAgICAgICAgICAgdmFsdWU6IGN0b3IsXHJcbiAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgIH1cclxuICAgICB9KTtcclxuIH1cclxuXHJcbi8vICBFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzLlBvbHlnb24gPSBQb2x5Z29uO1xyXG5tb2R1bGUuZXhwb3J0cy5jbGFtcCA9IGNsYW1wO1xyXG5tb2R1bGUuZXhwb3J0cy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UgPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2U7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbVBvaW50T25SZWN0ID0gZ2V0UmFuZG9tUG9pbnRPblJlY3Q7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbVBvaW50T25MaW5lID0gZ2V0UmFuZG9tUG9pbnRPbkxpbmU7XHJcbm1vZHVsZS5leHBvcnRzLmluaGVyaXQgPSBpbmhlcml0O1xyXG5tb2R1bGUuZXhwb3J0cy5zaHJpbmtSZWN0ID0gc2hyaW5rUmVjdDtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuLypcclxuICogUmFuZG9tIENhbnZhcyBCYWNrZ3JvdW5kIEdlbmVyYXRvclxyXG4gKlxyXG4gKiBJdCdzIHVzZWQgb24gSFRNTCBDYW52YXMgdG8gZ2VuZXJhdGUgcmFuZG9tIGJhY2tncm91bmQgaW4gYSBjZXJ0YWluIHBhdHRlcm5cclxuICogd2l0aCBjZXJ0YWluIGN1c3RvbWl6ZWQgcGFyYW1ldGVycyBhbmQgbW9kZXMuIFRoZSBiYWNrZ3JvdW5kXHJcbiAqIHdpbGwgdXBkYXRlIGV2ZXJ5IHRpbWUgeW91IGNhbGwgZ2VuZXJhdGUoKVxyXG4gKlxyXG4gKi9cclxuXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vL1x0RGVwZW5kZW5jaWVzXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcbnZhciBjb2xvclV0aWxzID0gcmVxdWlyZSgnLi9jb2xvclV0aWxzJyk7XHJcbnZhciBWZWN0b3IgPSByZXF1aXJlKCcuL3ZlY3RvcicpO1xyXG52YXIgTW9kZXMgPSByZXF1aXJlKCcuL21vZGVzJyk7XHJcblxyXG4vKlxyXG4qXHRDb25zdGFudCBzdHJpbmcgbmFtZVxyXG4qL1xyXG5jb25zdCBQT0xZR09OQUwgPSBcIlBvbHlnb25hbFwiO1xyXG5cclxuLypcclxuKiBDb25zdHJ1Y3RvclxyXG4qXHJcbiogQHBhcmFtIHtzdHJpbmd9IGNhbnZhc0lkOiBUaGUgaWQgb2YgdGhlIGNhbnZhcyB5b3Ugd2FudCB0byBnZW5lcmF0ZSBiYWNrZ3JvdW5kIG9uXHJcbiogQHBhcmFtIHtzdHJpbmd9IG1vZGU6IFRoZSBwYXR0ZXJuIGluIHdoaWNoIHRoZSBiYWNrZ3JvdW5kIGlzIGdlbmVyYXRlZC5cclxuKlx0XHRcdFx0XHRcdCBDdXJyZW50bHkgU3VwcG9ydDogMS4gXCJQb2x5Z29uYWxcIlxyXG4qIEBwYXJhbSB7U3RyaW5nKEFyZ3MpfSBiYXNlQ29sb3JzOiBhIHNldCBvZiB2YXJpYWJsZSBudW1iZXIgb2YgY29sb3Igc3RyaW5ncyB1c2VkXHJcbiogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzIHRoZSBiYXNlIGNvbG9ycyBvZiB0aGUgYmFja2dyb3VuZFxyXG4qL1xyXG5mdW5jdGlvbiBSYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yKGNhbnZhc0lkLCBtb2RlLCBiYXNlQ29sb3JzKSB7XHJcblx0Ly9cdEluaXRpYWxpemVcclxuXHR0aGlzLl9jYW52YXMgPSB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIDogbnVsbDtcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0ID0gdGhpcy5fY2FudmFzID8gdGhpcy5fY2FudmFzLmdldENvbnRleHQoJzJkJykgOiBudWxsO1xyXG5cdHRoaXMuX21vZGVOYW1lID0gbW9kZSB8fCBQT0xZR09OQUw7XHJcblx0dGhpcy5fbW9kZSA9IG51bGw7XHJcblxyXG5cdGlmICh0aGlzLl9jYW52YXMpIHtcdC8vXHRJZiBjYW52YXMgZWxlbWVudCBleGlzdHNcclxuXHRcdHRoaXMuX21vZGUgPSBuZXcgTW9kZXNbdGhpcy5fbW9kZU5hbWVdKDAuNixcclxuXHRcdFx0dGhpcy5fY2FudmFzLmNsaWVudFdpZHRoLFxyXG5cdFx0XHR0aGlzLl9jYW52YXMuY2xpZW50SGVpZ2h0KTtcclxuXHJcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcdC8vXHRJZiBhbnkgY29sb3IgaXMgcHJvdmllZGVcclxuXHRcdFx0dGhpcy5fbW9kZS5zZXRCYXNlQ29sb3JzLmFwcGx5KHRoaXMuX21vZGUsIEFycmF5LmZyb20oYXJndW1lbnRzKS5zbGljZSgyLCBhcmd1bWVudHMubGVuZ3RoKSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gcmV0dXJuIHRoZSBjdXJyZW50IG1vZGVcclxuICpcclxuICogQHJldHVybiB7TW9kZX0gdGhlIGN1cnJlbnQgbW9kZVxyXG4gKi9cclxuUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5wcm90b3R5cGUuZ2V0TW9kZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9tb2RlO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFByaXZhdGUgaGVscGVyIGZ1bmN0aW9uIHVzZWQgdG8gZHJhdyBwb2x5Z29uIG9uIHRoZSBjYW52YXNcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBBIEhFWCwgUkdCIG9yIFJHQkEgY29sb3IgaW4gdGhlIGZvcm0gb2ZcclxuICpcdFx0XHRcdFx0XHQgICBcIiMwMDAwMDBcIiwgXCJyZ2IoMCwgMCwgMClcIiBvciBcInJnYmEoMCwgMCwgMCwgMSlcIlxyXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludHM6IEFuIGFycmF5IG9mIFBvaW50IG9iamVjdHNcclxuICogQHBhcmFtIHtib29sZWFufSBncmFkaWVudDogQSBmbGFnIGluZGljYXRpbmcgaWYgbGluZWFyLWdyYWRpZW50IGlzIGVuYWJsZWQuXHJcbiAqXHRcdFx0XHRcdFx0XHQgICBUaGUgZ3JhZGllbnQgd2lsbCBiZSByYW5kb21seSBnZW5lcmF0ZWQuXHJcbiAqXHJcbiAqL1xyXG5SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yLnByb3RvdHlwZS5fZmlsbFBvbHlnb24gPSBmdW5jdGlvbihjb2xvciwgcG9seWdvbiwgZ3JhZGllbnQpIHtcclxuXHRncmFkaWVudCA9IGdyYWRpZW50IHx8IGZhbHNlO1xyXG5cclxuXHQvL1x0U2F2ZSB0aGUgcHJldmlvdXMgc3RhdGVzXHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5zYXZlKCk7XHJcblxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ly9cdFNldCB0aGUgY29sb3JcclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdGlmIChncmFkaWVudCkge1xyXG5cdFx0aWYgKHBvbHlnb24ucG9pbnRzLmxlbmd0aCA9PT0gMykge1x0Ly9cdElmIGl0J3MgYSB0cmlhbmdsZVxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ly9cdFN0YXJ0IGFuZCBlbmQgcG9pbnRzIG9mIHRoZSBsaW5lYXIgZ3JhZGllbnRcclxuXHRcdFx0Ly9cdFRoZSBzdGFydCBwb2ludCBpcyByYW5kb21seSBzZWxlY3RlZFxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0bGV0IHN0YXJ0UG9pbnQgPSBwb2x5Z29uLnBvaW50c1t1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgcG9seWdvbi5wb2ludHMubGVuZ3RoKV07XHJcblx0XHRcdGxldCBlbmRQb2ludDtcclxuXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0RmV0Y2ggcG9pbnRzIG90aGVyIHRoYW4gdGhlIHN0YXJ0IHBvaW50XHJcblx0XHRcdC8vXHRvdXQgb2YgdGhlIHBvbHlnb25cclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdGxldCBpbmRleCA9IHBvbHlnb24ucG9pbnRzLmluZGV4T2Yoc3RhcnRQb2ludCk7XHJcblx0XHRcdGxldCBsaW5lID0gW107XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcG9seWdvbi5wb2ludHMubGVuZ3RoOyBpKyspXHJcblx0XHRcdFx0aWYgKGkgIT09IGluZGV4KSBsaW5lLnB1c2gocG9seWdvbi5wb2ludHNbaV0pO1xyXG5cclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdC8vXHRQcm9qZWN0IHRoZSBzdGFydCBwb2ludCB0byB0aGUgbGluZVxyXG5cdFx0XHQvL1x0aXQncyBmYWNpbmcgYW5kIHRoYXQncyB0aGUgZW5kIHBvaW50XHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgYXhpcyA9IG5ldyBWZWN0b3IobGluZVswXS54IC0gbGluZVsxXS54LCBsaW5lWzBdLnkgLSBsaW5lWzFdLnkpO1xyXG5cdFx0XHRlbmRQb2ludCA9IHN0YXJ0UG9pbnQucHJvamVjdChheGlzKTtcclxuXHJcblx0XHRcdC8vXHRDcmVhdGUgdGhlIGxpbmVhciBncmFkaWVudCBvYmplY3RcclxuXHRcdFx0bGV0IGdyYWQgPSB0aGlzLl9jYW52YXNDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxyXG5cdFx0XHRcdHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcclxuXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdC8vXHRHZXQgcmFuZG9tIGxpbmVhciBncmFkaWVudCBjb2xvcnNcclxuXHRcdFx0Ly9cdGFuZCBhZGQgY29sb3JzXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdGxldCByYW5kb21JbnRlbnNpdHkgPSBNYXRoLnJhbmRvbSgpICsgMSAqIDAuNTtcclxuXHRcdFx0bGV0IGdyYWRDb2xvcnMgPSBjb2xvclV0aWxzLnJhbmRvbUdyYWRpZW50KGNvbG9yVXRpbHMucmFuZG9tQ29sb3IoY29sb3IpLCByYW5kb21JbnRlbnNpdHkpO1xyXG5cdFx0XHRncmFkLmFkZENvbG9yU3RvcCgwLCBncmFkQ29sb3JzLmZpcnN0KTtcclxuXHRcdFx0Z3JhZC5hZGRDb2xvclN0b3AoMSwgZ3JhZENvbG9ycy5zZWNvbmQpO1xyXG5cclxuXHRcdFx0dGhpcy5fY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBncmFkO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcblx0XHR9XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0dGhpcy5fY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcclxuXHR9XHJcblxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvL1x0RHJhdyB0aGUgcG9seWdvblxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cdHZhciBwb2ludHMgPSBwb2x5Z29uLnBvaW50cztcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYgKGkgPT09IDApIHtcclxuXHRcdFx0dGhpcy5fY2FudmFzQ29udGV4dC5tb3ZlVG8ocG9pbnRzW2ldLngsIHBvaW50c1tpXS55KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQubGluZVRvKHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuY2xvc2VQYXRoKCk7XHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5maWxsKCk7XHJcblxyXG5cdC8vXHRSZXN0b3JlIHByZXZpb3VzIHN0YXRlc1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQucmVzdG9yZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGNsZWFyIHRoZSBjYW52YXMgYW5kIGdlbmVyYXRlIGEgYmFja2dyb3VuZCB3aXRoIHRoZSBtb2RlXHJcbiAqL1xyXG5SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yLnByb3RvdHlwZS5nZW5lcmF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5fY2FudmFzLmNsaWVudFdpZHRoLCB0aGlzLl9jYW52YXMuY2xpZW50SGVpZ2h0KTtcclxuXHJcblx0dGhpcy5fbW9kZS5nZW5lcmF0ZSgpO1xyXG5cclxuXHR2YXIgcHJpbWl0aXZlcyA9IHRoaXMuX21vZGUuZ2V0UHJpbWl0aXZlcygpO1xyXG5cdHZhciBiYXNlQ29sb3JzID0gdGhpcy5fbW9kZS5nZXRCYXNlQ29sb3JzKCk7XHJcblxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcHJpbWl0aXZlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHJhbmRDb2xvciA9IGJhc2VDb2xvcnNbdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIGJhc2VDb2xvcnMubGVuZ3RoKV07XHJcblx0XHR0aGlzLl9maWxsUG9seWdvbihyYW5kQ29sb3IsIHByaW1pdGl2ZXNbaV0sIHRydWUpO1xyXG5cdH1cclxufTtcclxuXHJcbi8vXHRFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzID0gUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvcjtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxuLypcclxuICogIENoZWNrIGlmIGEgc3RyaW5nIGlzIGluIGEgaGV4IGNvbG9yIGZvcm1hdFxyXG4gKiAgQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGluIGEgaGV4IGZvcm1hdFxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29sb3JcclxuICovXHJcbmZ1bmN0aW9uIGlzSGV4KGNvbG9yKSB7XHJcbiAgICByZXR1cm4gLyNbYS1mMC05XXs2fS9naS50ZXN0KGNvbG9yKTtcclxufVxyXG5cclxuLypcclxuICogIENoZWNrIGlmIGEgc3RyaW5nIGlzIGluIGEgcmdiIGNvbG9yIGZvcm1hdFxyXG4gKiAgQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGluIGEgcmdiIGZvcm1hdFxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29sb3JcclxuICovXHJcbiBmdW5jdGlvbiBpc1JnYihjb2xvcikge1xyXG4gICAgLy8gIEVsaW1pbmF0ZSB3aGl0ZSBzcGFjZXNcclxuICAgIGNvbG9yID0gY29sb3IucmVwbGFjZSgvXFxzL2csIFwiXCIpO1xyXG4gICAgcmV0dXJuIC9yZ2JcXChbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCkvaS50ZXN0KGNvbG9yKTtcclxufVxyXG4gLypcclxuKiAgQ2hlY2sgaWYgYSBzdHJpbmcgaXMgaW4gYSByZ2JhIGNvbG9yIGZvcm1hdFxyXG4qICBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBzdHJpbmcgaXMgaW4gYSByZ2JhIGZvcm1hdFxyXG4qICBAcGFyYW0ge3N0cmluZ30gY29sb3I6IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb2xvclxyXG4qL1xyXG5mdW5jdGlvbiBpc1JnYmEoY29sb3IpIHtcclxuIC8vICBFbGltaW5hdGUgd2hpdGUgc3BhY2VzXHJcbiBjb2xvciA9IGNvbG9yLnJlcGxhY2UoL1xccy9nLCBcIlwiKTtcclxuIHJldHVybiAvcmdiYVxcKFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwpL2kudGVzdChjb2xvcik7XHJcblxyXG59XHJcblxyXG4vKlxyXG4gKlx0Q29udmVydCBoZXggY29sb3IgdG8gcmdiIGNvbG9yXHJcbiAqICBAcmV0dXJuIHtzdHJpbmcgLyBudWxsfSBDb252ZXJ0ZWQgY29sb3Igc3RyaW5nIG9yIG51bGwgaWYgdGhlIGlucHV0IGlzIGludmFsaWRcclxuICovXHJcbmZ1bmN0aW9uIGhleFRvUmdiKGhleCkge1xyXG4gICAgaWYgKGlzSGV4KGhleCkpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2IoXCIgK1xyXG4gICAgICAgIHBhcnNlSW50KGhleC5zdWJzdHIoMSwgMiksIDE2KSArIFwiLCBcIiArXHJcbiAgICAgICAgcGFyc2VJbnQoaGV4LnN1YnN0cigzLCAyKSwgMTYpICsgXCIsIFwiICtcclxuICAgICAgICBwYXJzZUludChoZXguc3Vic3RyKDUsIDIpLCAxNikgKyBcIilcIjtcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIGlzUmdiKGhleCkgfHwgaXNSZ2JhKGhleCkgPyBoZXggOiBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKlx0QWRqdXN0IHRoZSBicmlnaHRuZXNzIG9mIGEgY29sb3IgYnkgcGVyY2VudGFnZVxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgY29sb3Igc3RyaW5nXHJcbiAqICBAcGFyYW0ge2Zsb2F0fSBwZXJjZW50YWdlOiBBIGZsb2F0IHdpdGhpbiBbLTEsIDFdIGJ5IHdoaWNoIHRoZSBicmlnaHRuZXNzIGlzIGFkanVzdGVkLlxyXG4gKlx0XHRcdFx0XHRcdFx0ICAgMSBtZWFucyBtYXhpbXVtIGRhcmtuZXNzIGFuZCAtMSBtZWFucyBtYXhpbXVtIGJyaWdodG5lc3MuXHJcbiAqL1xyXG5mdW5jdGlvbiBhZGp1c3RDb2xvckJyaWdodG5lc3MoY29sb3IsIHBlcmNlbnRhZ2UpIHtcclxuICAgIHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlIHx8IDA7XHJcbiAgICBjb2xvciA9IGhleFRvUmdiKGNvbG9yKTtcclxuXHJcbiAgICBpZiAoY29sb3IgIT09IG51bGwpIHtcclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvL1x0VXNlIGRpZmZlcmVudCByZWdleCBhbmQgZm9ybWF0cyBmb3IgcmdiIGFuZCByZ2JhXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgdmFyIHJlZ3ggPSBpc1JnYihjb2xvcikgP1xyXG4gICAgICAgICAgICAvW1xcZF17MSwzfVsuXT9bXFxkXSovZ2kgOiAvW1xcZF17MSwzfVsuXT9bXFxkXSpcXCwvZ2k7XHJcbiAgICAgICAgdmFyIHBvc3RmaXggPSBpc1JnYihjb2xvcikgPyAnJyA6ICcsJztcclxuXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gIFJlcGxhY2UgdGhlIHIsIGcgYW5kIGIgd2l0aCBhZGp1c3RlZCBudW1iZXJzIGFuZFxyXG4gICAgICAgIC8vICByb3VuZCB0aGVtIHRvIGludGVnZXJzXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgcmV0dXJuIGNvbG9yLnJlcGxhY2UocmVneCwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHV0aWxzLmNsYW1wKChwYXJzZUludChlKSAqICgxIC0gcGVyY2VudGFnZSkpLCAwLCAyNTUpKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKCkgKyBwb3N0Zml4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKiAgRnVuY3Rpb24gdG8gZ2VuZXJhdGUgcmFuZG9tIGNvbG9yIHdpdGggcmFuZG9tIGJyaWdodG5lc3NcclxuICogIGJhc2VkIG9uIGEgZ2l2ZW4gY29sb3JcclxuICpcclxuICpcdEByZXR1cm4ge3N0cmluZ30gQSBzdHJpbmcgb2YgZ2VuZXJhdGVkIGNvbG9yXHJcbiAqICBAcGFyYW0ge3N0cmluZ30gYmFzZUNvbG9yOiBBIGNvbG9yIHN0cmluZyBpbiBIRVgsIFJHQiBvciBSR0JBXHJcbiAqXHRAcGFyYW0ge2Zsb2F0fSBicmlnaHRuZXNzSW50ZW5zaXR5KE9wdGlvbmFsKTogVGhlIGJyaWdodG5lc3MgaW50ZW5zaXR5IHdpdGhpbiBbMCwgMV0gdG8gZ2VuZXJhdGVcclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGFyb3VuZC4gMCBtZWFucyBnZW5lcmF0ZSBhcm91bmQgMCBicmlnaHRuZXNzIGNoYW5nZXMsXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAwLjUgbWVhbnMgZ2VuZXJhdGUgYXJvdW5kIDUwJSBicmlnaHRuZXNzIGNoYW5nZXMgYW5kXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAxIG1lYW5zIGdlbmVyYXRlIGFyb3VuZCBtYXhpbXVtIGJyaWdodG5lc3MgY2hhbmdlcy5cclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIFRoZSBicmlnaHRuZXNzIGNoYW5nZXMgd2lsbCBiZSBlaXRoZXIgZHJha2VuaW5nIG9yIGJyaWdodGVuaW5nLlxyXG4gKi9cclxuIGZ1bmN0aW9uIHJhbmRvbUNvbG9yKGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSl7XHJcbiAgICAgYnJpZ2h0bmVzc0ludGVuc2l0eSA9IGJyaWdodG5lc3NJbnRlbnNpdHkgfHwgMC41O1xyXG4gICAgIHZhciB0aHJlc2hvbGQgPSAwLjIsXHJcbiAgICAgICAgIHJhbmdlTG93ZXIgPSB1dGlscy5jbGFtcChicmlnaHRuZXNzSW50ZW5zaXR5IC0gdGhyZXNob2xkLCAwLCAxKSxcclxuICAgICAgICAgcmFuZ2VVcHBlciA9IHV0aWxzLmNsYW1wKGJyaWdodG5lc3NJbnRlbnNpdHkgKyB0aHJlc2hvbGQsIDAsIDEpO1xyXG5cclxuICAgICAvL1x0VXNlZCB0byBnZXQgYSBlaXRoZXIgbmVnYXRpdmUgb3IgcG9zaXRpdmUgcmFuZG9tIG51bWJlclxyXG4gICAgIHZhciByYW5kb21BcnIgPSBbXHJcbiAgICAgICAgIHV0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZShyYW5nZUxvd2VyLCByYW5nZVVwcGVyLCBmYWxzZSksXHJcbiAgICAgICAgIHV0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgtcmFuZ2VMb3dlciwgLXJhbmdlVXBwZXIsIGZhbHNlKV07XHJcblxyXG4gICAgIC8vXHRDb2xvciB2YWxpZGl0eSBjaGVja2luZyBpbiBhZGp1c3RDb2xvckJyaWdodG5lc3NcclxuICAgICByZXR1cm4gYWRqdXN0Q29sb3JCcmlnaHRuZXNzKGJhc2VDb2xvciwgcmFuZG9tQXJyW3V0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCAyKV0pO1xyXG4gfVxyXG5cclxuLypcclxuICogIEZ1bmN0aW9uIHRvIGdlbmVyYXRlIHJhbmRvbSBncmFkaWVudCBjb2xvciB3aXRoIHJhbmRvbSBicmlnaHRuZXNzIG9uIGJvdGggc2lkZXNcclxuICogIG9mIHRoZSBsaW5lYXIgZ3JhZGllbnQgYmFzZWQgb24gYSBnaXZlbiBjb2xvclxyXG4gKlxyXG4gKlx0QHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcGFpciBvZiBjb2xvcnNcclxuICogIEBwYXJhbSB7c3RyaW5nfSBiYXNlQ29sb3I6IEEgY29sb3Igc3RyaW5nIGluIEhFWCwgUkdCIG9yIFJHQkFcclxuICpcdEBwYXJhbSB7ZmxvYXR9IGJyaWdodG5lc3NJbnRlbnNpdHkoT3B0aW9uYWwpOiBUaGUgYnJpZ2h0bmVzcyBpbnRlbnNpdHkgd2l0aGluIFswLCAxXSB0byBnZW5lcmF0ZVxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgYXJvdW5kLiBUaGUgc2FtZSBhcyB0aGUgb25lIGluIHJhbmRvbUNvbG9yXHJcbiAqL1xyXG4gZnVuY3Rpb24gcmFuZG9tR3JhZGllbnQoYmFzZUNvbG9yLCBicmlnaHRuZXNzSW50ZW5zaXR5KSB7XHJcbiAgICAgYnJpZ2h0bmVzc0ludGVuc2l0eSA9IGJyaWdodG5lc3NJbnRlbnNpdHkgfHwgMC41O1xyXG4gICAgIHJldHVybiB7XHJcbiAgICAgICAgIGZpcnN0OiByYW5kb21Db2xvcihiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpLFxyXG4gICAgICAgICBzZWNvbmQ6IHJhbmRvbUNvbG9yKGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSlcclxuICAgICB9O1xyXG4gfVxyXG5cclxuLy8gIEV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMuaXNIZXggPSBpc0hleDtcclxubW9kdWxlLmV4cG9ydHMuaXNSZ2IgPSBpc1JnYjtcclxubW9kdWxlLmV4cG9ydHMuaXNSZ2JhID0gaXNSZ2JhO1xyXG5tb2R1bGUuZXhwb3J0cy5oZXhUb1JnYiA9IGhleFRvUmdiO1xyXG5tb2R1bGUuZXhwb3J0cy5hZGp1c3RDb2xvckJyaWdodG5lc3MgPSBhZGp1c3RDb2xvckJyaWdodG5lc3M7XHJcbm1vZHVsZS5leHBvcnRzLnJhbmRvbUNvbG9yID0gcmFuZG9tQ29sb3I7XHJcbm1vZHVsZS5leHBvcnRzLnJhbmRvbUdyYWRpZW50ID0gcmFuZG9tR3JhZGllbnQ7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29sb3JVdGlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG4vKlxyXG4gKiBNb2RlIG9iamVjdFxyXG4gKlxyXG4gKiBUaGUgbW9kZSBvYmplY3QgKGUuZy4gJ1BvbHlnb25hbCcpIHJlc3BvbnNpYmxlIGZvciBnZW5lcmF0aW5nIHByaW1pdGl2ZSBzaGFwZXNcclxuICogdG8gZHJhdyB3aXRoXHJcbiAqL1xyXG5cclxuIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIC8vIERlcGVuZGVuY2llc1xyXG4gLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gdmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG4gdmFyIEdyYXBoID0gcmVxdWlyZSgnLi9ncmFwaCcpO1xyXG4gdmFyIFZlY3RvciA9IHJlcXVpcmUoJy4vdmVjdG9yJyk7XHJcblxyXG4vKlxyXG4gKiBCYXNlIG1vZGUgY2xhc3MgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtOdW1iZXJ9IGNhbnZhc1dpZHRoOiBUaGUgd2lkdGggb2YgdGhlIGNhbnZhc1xyXG4gKiBAcGFyYW0ge051bWJlcn0gY2FudmFzSGVpZ2h0OiBUaGUgaGVpZ2h0IG9mIHRoZSBjYW52YXNcclxuICogQHBhcmFtIHtTdHJpbmcoQXJncyl9IGJhc2VDb2xvcnM6IGEgc2V0IG9mIHZhcmlhYmxlIG51bWJlciBvZiBjb2xvciBzdHJpbmdzIHVzZWRcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzIHRoZSBiYXNlIGNvbG9ycyBvZiB0aGUgYmFja2dyb3VuZFxyXG4gKi9cclxuZnVuY3Rpb24gTW9kZShjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0LCBiYXNlQ29sb3JzKSB7XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBCYXNlIGNsYXNzIG1lbWJlcnNcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdGhpcy5fYmFzZUNvbG9ycyA9IEFycmF5LmZyb20oYXJndW1lbnRzKS5zbGljZSgyLCBhcmd1bWVudHMubGVuZ3RoKTtcclxuICAgIHRoaXMuX3ByaW1pdGl2ZXMgPSBbXTtcclxuICAgIHRoaXMuX3dpZHRoID0gY2FudmFzV2lkdGggfHwgMDtcclxuICAgIHRoaXMuX2hlaWdodCA9IGNhbnZhc0hlaWdodCB8fCAwO1xyXG59XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgdmlydHVhbCBmdW5jdGlvbiAtIHNldCB0aGUgYXJyYXkgb2YgY29sb3Igc3RyaW5nc1xyXG4gKlxyXG4gKi9cclxuTW9kZS5wcm90b3R5cGUuc2V0QmFzZUNvbG9ycyA9IGZ1bmN0aW9uKGFyZ3MpIHtcclxuICAgIHRoaXMuX2Jhc2VDb2xvcnMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgdmlydHVhbCBmdW5jdGlvbiAtIHJldHVybiBhbiBhcnJheSBvZiBjb2xvciBzdHJpbmdzXHJcbiAqXHJcbiAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBjb2xvciBzdHJpbmdzXHJcbiAqL1xyXG5Nb2RlLnByb3RvdHlwZS5nZXRCYXNlQ29sb3JzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fYmFzZUNvbG9ycztcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyB2aXJ0dWFsIGZ1bmN0aW9uIC0gcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBwcmltaXRpdmUgc2hhcGVzIHRvIGRyYXcgd2l0aFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgcHJpbWl0aXZlIHNoYXBlc1xyXG4gKi9cclxuTW9kZS5wcm90b3R5cGUuZ2V0UHJpbWl0aXZlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3ByaW1pdGl2ZXM7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQb2x5Z29uYWwgbW9kZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAcGFyYW0ge2Zsb2F0fSBkZW5zaXR5OiBUaGUgZGVuc2l0eSBvZiB0aGUgcG9seWdvbnMsIGluIHRoZSByYW5nZSBvZiBbMCwgMV0uXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIDAgaXMgdGhlIHNwYXJzZXN0IGFuZCAxIGlzIHRoZSBkZW5zZXN0LlxyXG4gKiBAcGFyYW0ge1N0cmluZyhBcmdzKX0gYmFzZUNvbG9yczogYSBzZXQgb2YgdmFyaWFibGUgbnVtYmVyIG9mIGNvbG9yIHN0cmluZ3MgdXNlZFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXMgdGhlIGJhc2UgY29sb3JzIG9mIHRoZSBiYWNrZ3JvdW5kXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNXaWR0aDogVGhlIHdpZHRoIG9mIHRoZSBjYW52YXNcclxuICogQHBhcmFtIHtOdW1iZXJ9IGNhbnZhc0hlaWdodDogVGhlIGhlaWdodCBvZiB0aGUgY2FudmFzXHJcblxyXG4gKi9cclxuZnVuY3Rpb24gUG9seWdvbmFsTW9kZShkZW5zaXR5LCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0LCBiYXNlQ29sb3JzKSB7XHJcbiAgICAvLyAgQ2FsbCB0aGUgYmFzZSBjb25zdHJ1Y3RvciBhbmQgaW5pdCBiYXNlIGNsYXNzIG1lbWJlcnNcclxuICAgIFBvbHlnb25hbE1vZGUuX3N1cGVyLmFwcGx5KHRoaXMsIEFycmF5LmZyb20oYXJndW1lbnRzKS5zbGljZSgxLCBhcmd1bWVudHMubGVuZ3RoKSk7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQ2xhc3Mtc3BlY2lmaWMgbWVtYmVyc1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB0aGlzLl9kZW5zaXR5ID0gZGVuc2l0eSB8fCAwLjU7XHJcbiAgICB0aGlzLl9kZW5zaXR5ID0gMSAtIHRoaXMuX2RlbnNpdHk7XHJcbn1cclxudXRpbHMuaW5oZXJpdChQb2x5Z29uYWxNb2RlLCBNb2RlKTtcclxuXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyAgVGhlIGJvdW5kcyBvZiByYXRpb1xyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuREVOU0lUWV9SQVRPX1VQUEVSX0JPVU5EID0gMC4zO1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fTE9XRVJfQk9VTkQgPSAwLjAxO1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fRElGID1cclxuICAgIFBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19VUFBFUl9CT1VORCAtXHJcbiAgICBQb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fTE9XRVJfQk9VTkQ7XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gc2V0IHRoZSBkZW5zaXR5IG9mIHBvbHlnb25zXHJcbiAqXHJcbiAqL1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5zZXREZW5zaXR5ID0gZnVuY3Rpb24oZGVuc2l0eSkge1xyXG4gICAgdGhpcy5fZGVuc2l0eSA9IDEgLSBkZW5zaXR5O1xyXG59O1xyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gcmV0dXJuIHRoZSBkZW5zaXR5IG9mIHBvbHlnb25zXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Zsb2F0fSBkZW5zaXR5XHJcbiAqL1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5nZXREZW5zaXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gMSAtIHRoaXMuX2RlbnNpdHk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIGhlbHBlciBmdW5jdGlvbiAtIGdlbmVyYXRlIHBvaW50cyB0byBkcmF3IHdpdGhcclxuICogSXQgZGl2aWRlcyB0aGUgd2hvbGUgY2FudmFzIGludG8gc21hbGwgZ3JpZHMgYW5kIGdlbmVyYXRlIGEgcmFuZG9tIHBvaW50IGluIGV2ZXJ5XHJcbiAqIGdyaWRcclxuICpcclxuICogQHJldHVybiBub25lXHJcbiAqL1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5fZ2VuZXJhdGVQcmltaXRpdmVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgQ2xlYXIgcHJldmlvdXMgZGF0YVxyXG4gICAgdGhpcy5fcHJpbWl0aXZlcyA9IFtdO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBXaWR0aCBhbmQgaGVpZ2h0IG9mIGV2ZXJ5IHNtYWxsIGdyaWRcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHZhciByYXRpbyA9IHRoaXMuREVOU0lUWV9SQVRPX0xPV0VSX0JPVU5EICsgdGhpcy5ERU5TSVRZX1JBVE9fRElGICogdGhpcy5fZGVuc2l0eTtcclxuICAgIHZhciB3aWR0aEludGVydmFsID0gIHJhdGlvICogdGhpcy5fd2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0SW50ZXJ2YWwgPSByYXRpbyAqIHRoaXMuX2hlaWdodDtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBDb3VudHMgb2Ygcm93cyBhbmQgY29sdW1ucyBwbHVzIHRoZSB0b3BcclxuICAgIC8vICBhbmQgbGVmdCBib3VuZHMgb2YgdGhlIHJlY3RhbmdsZVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgcm93Q291bnQgPSBNYXRoLmZsb29yKHRoaXMuX3dpZHRoIC8gd2lkdGhJbnRlcnZhbCkgKyAxLFxyXG4gICAgICAgIGNvbENvdW50ID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQgLyBoZWlnaHRJbnRlcnZhbCkgKyAxO1xyXG5cclxuICAgIC8vICBVc2UgYSBncmFwaCB0byByZXByZXNlbnQgdGhlIGdyaWRzIG9uIHRoZSBjYW52YXNcclxuICAgIHZhciBncmFwaCA9IG5ldyBHcmFwaChyb3dDb3VudCwgY29sQ291bnQpO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIFBvaW50cyBvZiBldmVyeSBzbWFsbCBncmlkXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHZhciBwMSA9IG5ldyBWZWN0b3IoMCwgMCksXHJcbiAgICAgICAgcDIgPSBuZXcgVmVjdG9yKHdpZHRoSW50ZXJ2YWwsIDApLFxyXG4gICAgICAgIHAzID0gbmV3IFZlY3Rvcih3aWR0aEludGVydmFsLCBoZWlnaHRJbnRlcnZhbCksXHJcbiAgICAgICAgcDQgPSBuZXcgVmVjdG9yKDAsIGhlaWdodEludGVydmFsKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgUmFuZG9tbHkgZ2VuZXJhdGUgcG9pbnRzIG9uIHRoZSBjYW52YXNcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICB2YXIgcmFuZFBvaW50O1xyXG5cclxuICAgICAgICAgICAgLy8gIFNocmluayB0aGUgcmVjdGFuZ2xlIHRvIHByb2R1Y2UgbGVzcyBtZXNzeSBwb2ludHNcclxuICAgICAgICAgICAgdmFyIHNocmlua2VkID0gdXRpbHMuc2hyaW5rUmVjdChwMSwgcDIsIHAzLCBwNCwgd2lkdGhJbnRlcnZhbCAvIDUgLCAwKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChqID09PSAwKSB7ICAvLyAgSWYgYXQgdGhlIGxlZnQgYm91bmRcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IG5ldyBWZWN0b3IoaSAqIHdpZHRoSW50ZXJ2YWwsIGogKiBoZWlnaHRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gdXRpbHMuZ2V0UmFuZG9tUG9pbnRPblJlY3Qoc2hyaW5rZWQucDEsIHNocmlua2VkLnAxLCBzaHJpbmtlZC5wNCwgc2hyaW5rZWQucDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGogPT09IGNvbENvdW50IC0gMSkgeyAgIC8vICBJZiBhdCB0aGUgcmlnaHQgYm91bmRcclxuICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHNocmlua2VkLnAyLCBzaHJpbmtlZC5wMiwgc2hyaW5rZWQucDMsIHNocmlua2VkLnAzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7ICAgLy8gIElmIGF0IHRoZSB0b3AgYm91bmRcclxuICAgICAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSB1dGlscy5nZXRSYW5kb21Qb2ludE9uUmVjdChzaHJpbmtlZC5wMSwgc2hyaW5rZWQucDIsIHNocmlua2VkLnAyLCBzaHJpbmtlZC5wMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpID09PSByb3dDb3VudCAtIDEpIHsgICAvLyAgSWYgYXQgdGhlIGJvdHRvbSBib3VuZFxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHNocmlua2VkLnA0LCBzaHJpbmtlZC5wMywgc2hyaW5rZWQucDMsIHNocmlua2VkLnA0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHNocmlua2VkLnAxLCBzaHJpbmtlZC5wMiwgc2hyaW5rZWQucDMsIHNocmlua2VkLnA0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBncmFwaC5pbnNlcnQoaSwgaiwgcmFuZFBvaW50KTtcclxuXHJcbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAvLyAgTW92ZSB0aGUgY3VycmVudCBzbWFsbCBncmlkIHRvIHRoZVxyXG4gICAgICAgICAgICAvLyAgcmlnaHQgYnkgb25lIGludGVydmFsIHVuaXRcclxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIHAxLnggKz0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICAgICAgcDIueCArPSB3aWR0aEludGVydmFsO1xyXG4gICAgICAgICAgICBwMy54ICs9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgICAgIHA0LnggKz0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gIE1vdmUgdGhlIGN1cnJlbnQgc21hbGwgZ3JpZCBiYWNrIHRvIHRoZVxyXG4gICAgICAgIC8vICBsZWZ0IG1vc3QgYm91bmQgYW5kIG1vdmUgaXQgZG93biBieSBvbmUgaW50ZXJ2YWwgdW5pdFxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIHAxLnggPSBwNC54ID0gMDtcclxuICAgICAgICBwMi54ID0gcDMueCA9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgcDEueSArPSBoZWlnaHRJbnRlcnZhbDtcclxuICAgICAgICBwMi55ICs9IGhlaWdodEludGVydmFsO1xyXG4gICAgICAgIHAzLnkgKz0gaGVpZ2h0SW50ZXJ2YWw7XHJcbiAgICAgICAgcDQueSArPSBoZWlnaHRJbnRlcnZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIEFzIHdlIGFyZSBnb2luZyB0byBjaGVjayBhZGphY2VudCB2ZXJ0aWNlc1xyXG4gICAgLy8gIGl0J3MgZWFzaWVyIHRvIHN0b3JlIGFsbCBkZWx0YSBpbmRleCB2YWx1ZXMgYW5kXHJcbiAgICAvLyAgbG9vcCBvdmVyIHRoZW1cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgZGkgPSBbLTEsIC0xLCAtMSwgIDAsICAxLCAxLCAxLCAwXSxcclxuICAgICAgICBkaiA9IFstMSwgIDAsICAxLCAgMSwgIDEsIDAsIC0xLCAtMV07XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQ29ubmVjdCBhbGwgYWRqYWNlbnQgdmVydGljZXNcclxuICAgIC8vICBhbmQgZ2V0IGFsbCBwcmltaXRpdmVzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAvLyAgS2VlcCBjb3VudCBvZiB0aGUgcG9pbnRzIHRoYXQgYXJlIGFjdHVhbGx5IHByb2Nlc3NlZFxyXG4gICAgICAgICAgICBsZXQgY250ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGxldCBmaXJzdFBvaW50LCBwcmV2UG9pbnQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGRpLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VyclBvaW50ID0gZ3JhcGguZ2V0KGkgKyBkaVtrXSwgaiArIGRqW2tdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VyclBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGguY29ubmVjdChpLCBqLCBpICsgZGlba10sIGogKyBkaltrXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY250Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbnQgPT09IDEpIHsgICAgLy8gIEFzc2lnbiBmaXJzdCBwb2ludFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFBvaW50ID0gY3VyclBvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJpbWl0aXZlcy5wdXNoKG5ldyB1dGlscy5Qb2x5Z29uKFsgICAvLyAgQWRkIHBvbHlnb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoLmdldChpLCBqKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZQb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQb2ludFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZQb2ludCA9IGN1cnJQb2ludDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgLy8gIENvbm5lY3QgdGhlIGZpcnN0IHBvaW50IHdpdGggdGhlXHJcbiAgICAgICAgICAgIC8vICBsYXN0IHBvaW50IGFuZCBhZGQgcG9seWdvblxyXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgaWYgKGZpcnN0UG9pbnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgcHJldlBvaW50ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgICFmaXJzdFBvaW50LmVxdWFsKHByZXZQb2ludCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByaW1pdGl2ZXMucHVzaChuZXcgdXRpbHMuUG9seWdvbihbXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGguZ2V0KGksIGopLFxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZQb2ludCxcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdFBvaW50XHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufTtcclxuXHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9nZW5lcmF0ZVByaW1pdGl2ZXMoKTtcclxufTtcclxuXHJcbi8vICBFeHBvcnQgYW4gb2JqZWN0IGZvciBkaXJlY3QgbG9va3VwXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgUG9seWdvbmFsOiBQb2x5Z29uYWxNb2RlXHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbW9kZXMuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKmpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbi8qXHJcbiAqIFVuZGlyZWN0ZWQgYWN5bGljIGdyYXBoIGRhdGEgc3RydWN0dXJlIHVzaW5nXHJcbiAqIGFkamFjZW55IG1hdHJpeCBhcyBpbXBsZW1lbnRhdGlvblxyXG4gKlxyXG4gKi9cclxuXHJcbi8qXHJcbiAqIEdyYXBoIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gcm93Q291bnQ6IFRoZSBudW1iZXIgb2Ygcm93c1xyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGNvbHVtbkNvdW50OiBUaGUgbnVtYmVyIG9mIGNvbHVtbnNcclxuICogQG9hcmFtIHtOb24tb2JqZWN0IHR5cGVzfSBpbml0aWFsVmFsdWUoT3B0aW9uYWwpOiBpbml0aWFsVmFsdWUgZm9yIGFsbCBlbGVtZW50cyBpbiB0aGUgZ3JhcGguIEl0J3MgMCBieSBkZWZhdWx0LlxyXG4gKi9cclxuZnVuY3Rpb24gR3JhcGgocm93Q291bnQsIGNvbHVtbkNvdW50LCBpbml0aWFsVmFsdWUpIHtcclxuICAgIHRoaXMuX3Jvd0NvdW50ID0gcm93Q291bnQgfHwgMDtcclxuICAgIHRoaXMuX2NvbHVtbkNvdW50ID0gY29sdW1uQ291bnQgfHwgMDtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIEFsbG9jYXRlIGFuIGVtcHR5IG1hdHJpeFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHRoaXMuX2RhdGEgPSBuZXcgQXJyYXkocm93Q291bnQpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YVtpXSA9IG5ldyBBcnJheShjb2x1bW5Db3VudCkuZmlsbChpbml0aWFsVmFsdWUgfHwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fZWRnZXMgPSB7fTtcclxufVxyXG5cclxuLypcclxuICogUHJpdmF0ZSBtZW1iZXIgZnVuY3Rpb24gLSBjaGVjayBpZiBhIHBhaXIgb2YgcG9zaXRpb25zIGlzIGluIHRoZSByYW5nZSBvZiByb3dzIGFuZCBjb2x1bW5zXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIHBhaXIgb2YgcG9zaXRpb25zIGlzIGluIHRoZSBib3VuZCBhbmQgZmFsc2UgaWYgbm90XHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuX2NoZWNrQm91bmQgPSBmdW5jdGlvbihpLCBqKSB7XHJcbiAgICBpZiAoaSA+PSB0aGlzLl9yb3dDb3VudCB8fFxyXG4gICAgICAgIGogPj0gdGhpcy5fY29sdW1uQ291bnQgfHxcclxuICAgICAgICBpIDwgMCB8fCBqIDwgMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIG1lbWJlciBmdW5jdGlvbiAtIGdldCBhbiBpZCBmcm9tIGEgcGFpciBvZiBwb3NpdGlvbnNcclxuICpcclxuICogQHJldHVybiB7U3RyaW5nfSBUaGUgaWQgb2YgdGhlIHBhaXIgb2YgcG9zaXRpb25zXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuX2dldElkID0gZnVuY3Rpb24oaSwgaikge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NoZWNrQm91bmQoaSwgaikgPyBpLnRvU3RyaW5nKCkgKyBqLnRvU3RyaW5nKCkgOiBudWxsO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIHJldHVybiB0aGUgY291bnQgb2Ygcm93c1xyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLnJvd0NvdW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcm93Q291bnQ7XHJcbn07XHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSByZXR1cm4gdGhlIGNvdW50IG9mIGNvbHVtbnNcclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5jb2x1bW5Db3VudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtbkNvdW50O1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGluc2VydCBhbiBlbGVtZW50IHRvIHRoZSBncmFwaFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGluc2VydGlvbiBpcyBzdWNjZXNzZnVsIGFuZCBmYWxzZSBpZiBub3RcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICogQHBhcmFtIHtBbnl9IHZhbHVlOiBUaGUgdmFsdWUgdG8gaW5zZXJ0XHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24oaSwgaiwgdmFsdWUpIHtcclxuICAgIGlmICh0aGlzLl9jaGVja0JvdW5kKGksIGopKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YVtpXVtqXSA9IHZhbHVlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gZ2V0IGEgZWxlbWVudCBmcm9tIGEgcGFpciBvZiBwb3NpdGlvblxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBbnkgLyBudWxsfSBUaGUgZWxlbWVudCBhdCB0aGUgcG9zaXRpb24gaWYgdGhlIHBhaXIgb2YgcG9zaXRpb25zIGlzIGluIHRoZSBib3VuZFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICBhbmQgbnVsbCBpZiBub3RcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpLCBqKSB7XHJcbiAgICBpZiAodGhpcy5fY2hlY2tCb3VuZChpLCBqKSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhW2ldW2pdO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBjaGVjayBpZiB0d28gdmVydGljZXMgYXJlIGNvbm5lY3RlZFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZXJlIGlzIGEgY29ubmVjdGlvbiBiZXR3ZWVuIHR3byBlbGVtZW50c1xyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGkxLCBpMjogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajEsIGoyOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5pc0Nvbm5lY3RlZCA9IGZ1bmN0aW9uKGkxLCBqMSwgaTIsIGoyKSB7XHJcbiAgICBpZiAoIXRoaXMuX2NoZWNrQm91bmQoaTEsIGoxKSB8fFxyXG4gICAgICAgICF0aGlzLl9jaGVja0JvdW5kKGkyLCBqMikpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB2YXIgaWQxID0gdGhpcy5fZ2V0SWQoaTEsIGoxKSxcclxuICAgICAgICBpZDIgPSB0aGlzLl9nZXRJZChpMiwgajIpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5fZWRnZXNbaWQxXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fZWRnZXNbaWQxXVtpZDJdO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGNvbm5lY3QgdGhlIGVkZ2Ugb2YgdHdvIHZlcnRpY2VzXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGFjdGlvbiBpcyBzdWNjZXNzZnVsXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTEsIGkyOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqMSwgajI6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbihpMSwgajEsIGkyLCBqMikge1xyXG4gICAgaWYgKCF0aGlzLl9jaGVja0JvdW5kKGkxLCBqMSkgfHxcclxuICAgICAgICAhdGhpcy5fY2hlY2tCb3VuZChpMiwgajIpKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgdmFyIGlkMSA9IHRoaXMuX2dldElkKGkxLCBqMSksXHJcbiAgICAgICAgaWQyID0gdGhpcy5fZ2V0SWQoaTIsIGoyKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMuX2VkZ2VzW2lkMV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5fZWRnZXNbaWQxXSA9IHt9O1xyXG4gICAgfVxyXG4gICAgdGhpcy5fZWRnZXNbaWQxXVtpZDJdID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBkaXNjb25uZWN0IHRoZSBlZGdlIG9mIHR3byB2ZXJ0aWNlc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBhY3Rpb24gaXMgc3VjY2Vzc2Z1bFxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGkxLCBpMjogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajEsIGoyOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24oaTEsIGoxLCBpMiwgajIpIHtcclxuICAgIGlmICghdGhpcy5fY2hlY2tCb3VuZChpMSwgajEpIHx8XHJcbiAgICAgICAgIXRoaXMuX2NoZWNrQm91bmQoaTIsIGoyKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHZhciBpZDEgPSB0aGlzLl9nZXRJZChpMSwgajEpLFxyXG4gICAgICAgIGlkMiA9IHRoaXMuX2dldElkKGkyLCBqMik7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLl9lZGdlc1tpZDFdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fZWRnZXNbaWQxXVtpZDJdID0gZmFsc2U7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vLyAgRXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cyA9IEdyYXBoO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2dyYXBoLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==