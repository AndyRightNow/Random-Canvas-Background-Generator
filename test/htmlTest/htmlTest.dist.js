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
	    var back = new RandomBackgroundGenerator('canvas', 'Polygonal','#AEA8D3', '#663399', '#BE90D4', '#E4F1FE');
	    back.getMode().setDensity(0.6);
	    back.getMode().setMixed(false);
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
				this._canvas.clientWidth + this._canvas.clientWidth / 5,
				this._canvas.clientHeight + this._canvas.clientHeight / 5);
	
			if (arguments.length > 2) {	//	If any color is proviede
				this._mode.setBaseColors.apply(this._mode, Array.from(arguments).slice(3, arguments.length));
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
	 * @param {Boolean} isMixed: A flag indicating if all colors are mixed or displayed one by one
	 */
	function PolygonalMode(density, canvasWidth, canvasHeight, isMixed, baseColors) {
	    //  Call the base constructor and init base class members
	    PolygonalMode._super.apply(this, Array.from(arguments).slice(1, arguments.length));
	
	    //----------------------------
	    //  Class-specific members
	    //----------------------------
	    this._density = density || 0.5;
	    this._density = 1 - this._density;
		this._isMixed = isMixed || false;
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
	 * Public member function - set the mix mode
	 *
	 */
	PolygonalMode.prototype.setMixed = function(flag) {
		this._isMixed = flag;
	};
	
	/*
	 * Public member function - return the mix mode
	 *
	 * @return {Mode} the current mix mode
	 */
	PolygonalMode.prototype.isMixed = function() {
		return this._isMixed;
	};
	
	/*
	 * Public override virtual function - return an array of color strings based on the mix mode
	 *
	 * @return {Array} An array of color strings
	 */
	Mode.prototype.getBaseColors = function() {
	    return this._isMixed ? this._baseColors : [this._baseColors[utils.getRandomNumberFromRange(0, this._baseColors.length)]];
	};
	
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
	                if (i === 0)    //  If at the top left corner
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTc3MjIwZjhkZTg0NTcyZmU0NDMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sb3JVdGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7Ozs7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDakVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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QUNBO0FBQ0EsYUFBWSxPQUFPO0FBQ25CLFlBQVcsUUFBUTtBQUNuQixZQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQVksUUFBUTtBQUNwQixZQUFXLFFBQVE7QUFDbkIsWUFBVyxRQUFRO0FBQ25CLFlBQVcsSUFBSTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBWSxXQUFXO0FBQ3ZCO0FBQ0EsWUFBVyxRQUFRO0FBQ25CLFlBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLFFBQVE7QUFDcEIsWUFBVyxRQUFRO0FBQ25CLFlBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBWSxRQUFRO0FBQ3BCLFlBQVcsUUFBUTtBQUNuQixZQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQVksUUFBUTtBQUNwQixZQUFXLFFBQVE7QUFDbkIsWUFBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6Imh0bWxUZXN0LmRpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDU3NzIyMGY4ZGU4NDU3MmZlNDQzXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcbnZhciBWZWN0b3IgPSByZXF1aXJlKCcuLy4uLy4uL3NyYy92ZWN0b3InKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi9zcmMvdXRpbHMnKTtcclxudmFyIFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uLy4uL3NyYy9SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yJyk7XHJcblxyXG52YXIgaHRtbFRlc3QgPSB7fTtcclxuXHJcbmh0bWxUZXN0LnJ1biA9IGZ1bmN0aW9uKGNhbnZhc0lkKXtcclxuICAgIHZhciBiYWNrID0gbmV3IFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IoJ2NhbnZhcycsICdQb2x5Z29uYWwnLCcjQUVBOEQzJywgJyM2NjMzOTknLCAnI0JFOTBENCcsICcjRTRGMUZFJyk7XHJcbiAgICBiYWNrLmdldE1vZGUoKS5zZXREZW5zaXR5KDAuNik7XHJcbiAgICBiYWNrLmdldE1vZGUoKS5zZXRNaXhlZChmYWxzZSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2VuZXJhdGUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgYmFjay5nZW5lcmF0ZSgpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGh0bWxUZXN0O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcbiAqICAgICAgICAgICAgICBWZWN0b3IgQ2xhc3NcclxuICpcclxuICogICAgICBWZWN0b3IgYW5kIHZlY3RvciBvcGVyYXRpb25zLlxyXG4gKi9cclxuXHJcbi8qXHJcbiAqICBDb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gVmVjdG9yKHgsIHkpe1xyXG5cdHRoaXMueCA9IHggfHwgMDtcclxuXHR0aGlzLnkgPSB5IHx8IDA7XHJcbn1cclxuXHJcblZlY3Rvci5wcm90b3R5cGUuZXF1YWwgPSBmdW5jdGlvbih2ZWMpIHtcclxuXHRyZXR1cm4gdGhpcy54ID09PSB2ZWMueCAmJiB0aGlzLnkgPT09IHZlYy55O1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2KXtcclxuXHRyZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55O1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5sZW4yID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5kb3QodGhpcyk7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmxlbiA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIE1hdGguc3FydCh0aGlzLmxlbjIoKSk7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24oc3gsIHN5KXtcclxuXHR0aGlzLnggKj0gc3g7XHJcblx0dGhpcy55ICo9IHN5IHx8IHN4O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih2KSB7XHJcblx0dGhpcy54ICs9IHYueDtcclxuXHR0aGlzLnkgKz0gdi55O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbih2KXtcclxuXHR0aGlzLnggLT0gdi54O1xyXG5cdHRoaXMueSAtPSB2Lnk7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IodGhpcy54LCB0aGlzLnkpO1xyXG59O1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHRObyBzaWRlIGVmZmVjdCBhbmQgY2hhaW5pbmdcclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblZlY3Rvci5wcm90b3R5cGUucHJvamVjdCA9IGZ1bmN0aW9uKGF4aXMpe1xyXG5cdHZhciBjb2YgPSAgdGhpcy5kb3QoYXhpcykgLyBheGlzLmxlbjIoKTtcclxuXHRyZXR1cm4gYXhpcy5zY2FsZShjb2YpO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5wcm9qZWN0TiA9IGZ1bmN0aW9uKGF4aXMpe1xyXG5cdHZhciBjb2YgPSAgdGhpcy5kb3QoYXhpcyk7XHJcblx0cmV0dXJuIGF4aXMuc2NhbGUoY29mKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3ZlY3Rvci5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi92ZWN0b3InKTtcclxuXHJcbi8qXHJcbiAqXHRQb2x5Z29uIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50czogVGhlIHBvaW50cyBvZiB0aGUgcG9seWdvbi4gVGhleSBtdXN0IGJlIGluIGNsb2Nrd2lzZSBvciBjb3VudGVyLWNsb2Nrd2lzZSBvcmRlclxyXG4gKi9cclxuZnVuY3Rpb24gUG9seWdvbihwb2ludHMpIHtcclxuICAgIHRoaXMuX3BvaW50cyA9IHBvaW50cyB8fCBbXTtcclxufVxyXG5Qb2x5Z29uLnByb3RvdHlwZSA9IHtcclxuICAgIGdldCBwb2ludHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50cztcclxuICAgIH0sXHJcblxyXG4gICAgc2V0IHBvaW50cyhwb2ludHMpIHtcclxuICAgICAgICB0aGlzLl9wb2ludHMgPSBwb2ludHM7XHJcbiAgICB9LFxyXG5cclxuICAgIGVxdWFsOiBmdW5jdGlvbihwb2x5Z29uKSB7XHJcbiAgICAgICAgdmFyIHJldmVyc2VkID0gcG9seWdvbi5wb2ludHM7XHJcbiAgICAgICAgcmV2ZXJzZWQucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludHMuZXZlcnkoZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuZXF1YWwocG9seWdvbi5wb2ludHNbaW5kZXhdKTtcclxuICAgICAgICB9KSB8fCB0aGlzLnBvaW50cy5ldmVyeShmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5lcXVhbChyZXZlcnNlZFtpbmRleF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLypcclxuICogU2hyaW5rIGEgcmVjdGFuZ2xlIGJ5IHZhbHVlIGR4IGFuZCB2YWx1ZSBkeVxyXG4gKlxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFuIG9iamVjdCBjb25zaXN0aW5nIG9mIHRyYW5zZm9ybWVkIHAxLCBwMiwgcDMsIHA0XHJcbiAqIEBwYXJhbSB7VmVjdG9yfSBwMSwgcDIsIHAzLCBwNDogUG9pbnRzIG9mIGEgcmVjdGFuZ2xlIHN0YXJ0aW5nXHJcbiAqXHRcdFx0XHRcdFx0XHRcdCAgIGZyb20gdGhlIHRvcCBsZWZ0IGNvcm5lciBhbmQgZ29pbmdcclxuICpcdFx0XHRcdFx0XHRcdFx0ICAgY2xvY2t3aXNlLlxyXG4gKi9cclxuZnVuY3Rpb24gc2hyaW5rUmVjdChwMSwgcDIsIHAzLCBwNCwgYnlEeCwgYnlEeSkge1xyXG4gICAgYnlEeCA9IGJ5RHggfHwgMDtcclxuICAgIGJ5RHkgPSBieUR5IHx8IDA7XHJcbiAgICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3AxJzogcDEuY2xvbmUoKS5hZGQobmV3IFZlY3RvcihieUR4LCBieUR5KSksXHJcbiAgICAgICAgJ3AyJzogcDIuY2xvbmUoKS5hZGQobmV3IFZlY3RvcigtYnlEeCwgYnlEeSkpLFxyXG4gICAgICAgICdwMyc6IHAzLmNsb25lKCkuYWRkKG5ldyBWZWN0b3IoLWJ5RHgsIC1ieUR5KSksXHJcbiAgICAgICAgJ3A0JzogcDQuY2xvbmUoKS5hZGQobmV3IFZlY3RvcigtYnlEeCwgYnlEeSkpXHJcbiAgICB9O1xyXG59XHJcblxyXG4vKlxyXG4gKiAgQ2xhbXAgYSBudW1iZXIgd2l0aGluIGEgcmFuZ2VcclxuICovXHJcbmZ1bmN0aW9uIGNsYW1wKHgsIGxvd2VyLCB1cHBlcil7XHJcbiAgICByZXR1cm4geCA8IGxvd2VyID8gbG93ZXIgOiB4ID4gdXBwZXIgPyB1cHBlciA6IHg7XHJcbn1cclxuXHJcbi8qXHJcbiAqXHRHZXQgYSByYW5kb20gbnVtYmVyIGZyb20gYSByYW5nZVxyXG4gKlxyXG4gKlx0QHJldHVybiB7aW50IC8gZmxvYXR9IEEgcmFuZG9tbHkgZ2VuZXJhdGVkIG51bWJlciB3aXRoaW4gYSByYW5nZVxyXG4gKlx0QHBhcmFtIHtpbnQgLyBmbG9hdH0gbG93ZXI6IFRoZSBsb3dlciBib3VuZCBvZiB0aGUgcmFuZ2UoSW5jbHVzaXZlKVxyXG4gKlx0QHBhcmFtIHtpbnQgLyBmbG9hdH0gdXBwZXI6IFRoZSB1cHBlciBib3VuZCBvZiB0aGUgcmFuZ2UoRXhjbHVzaXZlKVxyXG4gKlx0QHBhcmFtIHtib29sZWFufSBpc0ludDogVGhlIGZsYWcgdG8gc3BlY2lmeSB3aGV0aGVyIHRoZSByZXN1bHQgaXMgaW50IG9yIGZsb2F0XHJcbiAqL1xyXG4gZnVuY3Rpb24gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKGxvd2VyLCB1cHBlciwgaXNJbnQpIHtcclxuICAgICBpZiAobG93ZXIgPj0gdXBwZXIpIHJldHVybiAwO1xyXG4gICAgIGlzSW50ID0gaXNJbnQgfHwgdHJ1ZTtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vXHRTb21lIHJhbmRvbSBudW1iZXJzIGp1c3QgY29taW5nIG91dCBvZiBub3doZXJlXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgc29tZVJhbmRvbU51bWJlcjEgPSAxMjg1LFxyXG4gICAgICAgIHNvbWVSYW5kb21OdW1iZXIyID0gMjM5MTtcclxuXHJcbiAgICAvL1x0R2VuZXJhdGUgdGhlIGludGVnZXIgcGFydFxyXG4gICAgdmFyIHJhbmRvbUludCA9XHJcbiAgICAgICAgcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIHNvbWVSYW5kb21OdW1iZXIxICogTWF0aC5yYW5kb20oKSAqIHNvbWVSYW5kb21OdW1iZXIyKSAlICh1cHBlciAtIGxvd2VyKTtcclxuXHJcbiAgICBpZiAoaXNJbnQpIHtcclxuICAgICAgICByZXR1cm4gbG93ZXIgKyByYW5kb21JbnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBsb3dlciArIHJhbmRvbUludCArIE1hdGgucmFuZG9tKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiAqICBHZXQgYSByYW5kb20gcG9pbnQgb24gYSByZWN0YW5nbGVcclxuICpcclxuICpcdEBwYXJhbSB7VmVjdG9yfSBwMSwgcDIsIHAzLCBwNDogUG9pbnRzIG9mIGEgcmVjdGFuZ2xlIHN0YXJ0aW5nXHJcbiAqXHRcdFx0XHRcdFx0XHRcdCAgIGZyb20gdGhlIHRvcCBsZWZ0IGNvcm5lciBhbmQgZ29pbmdcclxuICpcdFx0XHRcdFx0XHRcdFx0ICAgY2xvY2t3aXNlLlxyXG4gKlx0QHBhcmFtIHtib29sZWFufSBpc0ludDogVGhlIGZsYWcgdG8gc3BlY2lmeSB3aGV0aGVyIHRoZSByZXN1bHQgaXMgaW50IG9yIGZsb2F0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSYW5kb21Qb2ludE9uUmVjdChwMSwgcDIsIHAzLCBwNCwgaXNJbnQpIHtcclxuICAgIGlzSW50ID0gaXNJbnQgfHwgdHJ1ZTtcclxuICAgIHZhciB3aWR0aCA9IE1hdGguYWJzKHAyLnggLSBwMS54KSxcclxuICAgICAgICBoZWlnaHQgPSBNYXRoLmFicyhwMy55IC0gcDIueSksXHJcbiAgICAgICAgdG9wTGVmdFggPSBNYXRoLm1pbihwMS54LCBwMi54LCBwMy54LCBwNC54KSxcclxuICAgICAgICB0b3BMZWZ0WSA9IE1hdGgubWluKHAxLnksIHAyLnksIHAzLnksIHA0LnkpO1xyXG5cclxuICAgIHZhciByYW5kb21EZWx0YVggPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgd2lkdGgsIGlzSW50KSxcclxuICAgICAgICByYW5kb21EZWx0YVkgPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgaGVpZ2h0LCBpc0ludCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBWZWN0b3IodG9wTGVmdFggKyByYW5kb21EZWx0YVgsIHRvcExlZnRZICsgcmFuZG9tRGVsdGFZKTtcclxufVxyXG5cclxuLypcclxuICogIEdldCBhIHJhbmRvbSBwb2ludCBvbiBhIGxpbmVcclxuICogIEBwYXJhbSB7VmVjdG9yfSBwMSwgcDI6IFBvaW50cyBvZiBhIGxpbmUgZnJvbSBsZWZ0IHRvIHJpZ2h0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSYW5kb21Qb2ludE9uTGluZShwMSwgcDIpIHtcclxuICAgIHZhciBwcm9qZWN0aW9uV2lkdGggPSBNYXRoLmFicyhwMS54IC0gcDIueCksXHJcbiAgICAgICAgbGVmdFggPSBNYXRoLm1pbihwMS54LCBwMi54KTtcclxuXHJcbiAgICB2YXIgQSA9IChwMS55IC0gcDIueSkgLyAocDEueCAtIHAyLngpLFxyXG4gICAgICAgIEIgPSBwMS55IC0gQSAqIHAxLng7XHJcblxyXG4gICAgdmFyIHJhbmRvbURlbHRhWCA9IGdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCBwcm9qZWN0aW9uV2lkdGgsIGZhbHNlKTtcclxuICAgIHJldHVybiBuZXcgVmVjdG9yKGxlZnRYICsgcmFuZG9tRGVsdGFYLCBBICogKGxlZnRYICsgcmFuZG9tRGVsdGFYKSArIEIpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBIZWxwZXIgZnVuY3Rpb24gdXNlZCB0byBjcmVhdGUgaW5oZXJpdGFuY2VcclxuICpcclxuICogQHJldHVybiBub25lXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN0b3I6IFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgY3VycmVudCBvYmplY3RcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3VwZXJDdG9yOiBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHBhcmVudCBvYmplY3RcclxuICovXHJcbiBmdW5jdGlvbiBpbmhlcml0KGN0b3IsIHN1cGVyQ3Rvcikge1xyXG4gICAgIGN0b3IuX3N1cGVyID0gc3VwZXJDdG9yO1xyXG4gICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XHJcbiAgICAgICAgIGNvbnN0cnVjdG9yOiB7XHJcbiAgICAgICAgICAgICB2YWx1ZTogY3RvcixcclxuICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgfVxyXG4gICAgIH0pO1xyXG4gfVxyXG5cclxuLy8gIEV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMuUG9seWdvbiA9IFBvbHlnb247XHJcbm1vZHVsZS5leHBvcnRzLmNsYW1wID0gY2xhbXA7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSA9IGdldFJhbmRvbU51bWJlckZyb21SYW5nZTtcclxubW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tUG9pbnRPblJlY3QgPSBnZXRSYW5kb21Qb2ludE9uUmVjdDtcclxubW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tUG9pbnRPbkxpbmUgPSBnZXRSYW5kb21Qb2ludE9uTGluZTtcclxubW9kdWxlLmV4cG9ydHMuaW5oZXJpdCA9IGluaGVyaXQ7XHJcbm1vZHVsZS5leHBvcnRzLnNocmlua1JlY3QgPSBzaHJpbmtSZWN0O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG4vKlxyXG4gKiBSYW5kb20gQ2FudmFzIEJhY2tncm91bmQgR2VuZXJhdG9yXHJcbiAqXHJcbiAqIEl0J3MgdXNlZCBvbiBIVE1MIENhbnZhcyB0byBnZW5lcmF0ZSByYW5kb20gYmFja2dyb3VuZCBpbiBhIGNlcnRhaW4gcGF0dGVyblxyXG4gKiB3aXRoIGNlcnRhaW4gY3VzdG9taXplZCBwYXJhbWV0ZXJzIGFuZCBtb2Rlcy4gVGhlIGJhY2tncm91bmRcclxuICogd2lsbCB1cGRhdGUgZXZlcnkgdGltZSB5b3UgY2FsbCBnZW5lcmF0ZSgpXHJcbiAqXHJcbiAqL1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHREZXBlbmRlbmNpZXNcclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxudmFyIGNvbG9yVXRpbHMgPSByZXF1aXJlKCcuL2NvbG9yVXRpbHMnKTtcclxudmFyIFZlY3RvciA9IHJlcXVpcmUoJy4vdmVjdG9yJyk7XHJcbnZhciBNb2RlcyA9IHJlcXVpcmUoJy4vbW9kZXMnKTtcclxuXHJcbi8qXHJcbipcdENvbnN0YW50IHN0cmluZyBuYW1lXHJcbiovXHJcbmNvbnN0IFBPTFlHT05BTCA9IFwiUG9seWdvbmFsXCI7XHJcblxyXG4vKlxyXG4qIENvbnN0cnVjdG9yXHJcbipcclxuKiBAcGFyYW0ge3N0cmluZ30gY2FudmFzSWQ6IFRoZSBpZCBvZiB0aGUgY2FudmFzIHlvdSB3YW50IHRvIGdlbmVyYXRlIGJhY2tncm91bmQgb25cclxuKiBAcGFyYW0ge3N0cmluZ30gbW9kZTogVGhlIHBhdHRlcm4gaW4gd2hpY2ggdGhlIGJhY2tncm91bmQgaXMgZ2VuZXJhdGVkLlxyXG4qXHRcdFx0XHRcdFx0IEN1cnJlbnRseSBTdXBwb3J0OiAxLiBcIlBvbHlnb25hbFwiXHJcbiogQHBhcmFtIHtTdHJpbmcoQXJncyl9IGJhc2VDb2xvcnM6IGEgc2V0IG9mIHZhcmlhYmxlIG51bWJlciBvZiBjb2xvciBzdHJpbmdzIHVzZWRcclxuKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXMgdGhlIGJhc2UgY29sb3JzIG9mIHRoZSBiYWNrZ3JvdW5kXHJcbiovXHJcbmZ1bmN0aW9uIFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IoY2FudmFzSWQsIG1vZGUsIGJhc2VDb2xvcnMpIHtcclxuXHQvL1x0SW5pdGlhbGl6ZVxyXG5cdHRoaXMuX2NhbnZhcyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkgOiBudWxsO1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQgPSB0aGlzLl9jYW52YXMgPyB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKSA6IG51bGw7XHJcblx0dGhpcy5fbW9kZU5hbWUgPSBtb2RlIHx8IFBPTFlHT05BTDtcclxuXHR0aGlzLl9tb2RlID0gbnVsbDtcclxuXHJcblx0aWYgKHRoaXMuX2NhbnZhcykge1x0Ly9cdElmIGNhbnZhcyBlbGVtZW50IGV4aXN0c1xyXG5cdFx0dGhpcy5fbW9kZSA9IG5ldyBNb2Rlc1t0aGlzLl9tb2RlTmFtZV0oMC42LFxyXG5cdFx0XHR0aGlzLl9jYW52YXMuY2xpZW50V2lkdGggKyB0aGlzLl9jYW52YXMuY2xpZW50V2lkdGggLyA1LFxyXG5cdFx0XHR0aGlzLl9jYW52YXMuY2xpZW50SGVpZ2h0ICsgdGhpcy5fY2FudmFzLmNsaWVudEhlaWdodCAvIDUpO1xyXG5cclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1x0Ly9cdElmIGFueSBjb2xvciBpcyBwcm92aWVkZVxyXG5cdFx0XHR0aGlzLl9tb2RlLnNldEJhc2VDb2xvcnMuYXBwbHkodGhpcy5fbW9kZSwgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDMsIGFyZ3VtZW50cy5sZW5ndGgpKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSByZXR1cm4gdGhlIGN1cnJlbnQgbW9kZVxyXG4gKlxyXG4gKiBAcmV0dXJuIHtNb2RlfSB0aGUgY3VycmVudCBtb2RlXHJcbiAqL1xyXG5SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yLnByb3RvdHlwZS5nZXRNb2RlID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX21vZGU7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIGhlbHBlciBmdW5jdGlvbiB1c2VkIHRvIGRyYXcgcG9seWdvbiBvbiB0aGUgY2FudmFzXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogQSBIRVgsIFJHQiBvciBSR0JBIGNvbG9yIGluIHRoZSBmb3JtIG9mXHJcbiAqXHRcdFx0XHRcdFx0ICAgXCIjMDAwMDAwXCIsIFwicmdiKDAsIDAsIDApXCIgb3IgXCJyZ2JhKDAsIDAsIDAsIDEpXCJcclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzOiBBbiBhcnJheSBvZiBQb2ludCBvYmplY3RzXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZ3JhZGllbnQ6IEEgZmxhZyBpbmRpY2F0aW5nIGlmIGxpbmVhci1ncmFkaWVudCBpcyBlbmFibGVkLlxyXG4gKlx0XHRcdFx0XHRcdFx0ICAgVGhlIGdyYWRpZW50IHdpbGwgYmUgcmFuZG9tbHkgZ2VuZXJhdGVkLlxyXG4gKlxyXG4gKi9cclxuUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5wcm90b3R5cGUuX2ZpbGxQb2x5Z29uID0gZnVuY3Rpb24oY29sb3IsIHBvbHlnb24sIGdyYWRpZW50KSB7XHJcblx0Z3JhZGllbnQgPSBncmFkaWVudCB8fCBmYWxzZTtcclxuXHJcblx0Ly9cdFNhdmUgdGhlIHByZXZpb3VzIHN0YXRlc1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuc2F2ZSgpO1xyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8vXHRTZXQgdGhlIGNvbG9yXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRpZiAoZ3JhZGllbnQpIHtcclxuXHRcdGlmIChwb2x5Z29uLnBvaW50cy5sZW5ndGggPT09IDMpIHtcdC8vXHRJZiBpdCdzIGEgdHJpYW5nbGVcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdC8vXHRTdGFydCBhbmQgZW5kIHBvaW50cyBvZiB0aGUgbGluZWFyIGdyYWRpZW50XHJcblx0XHRcdC8vXHRUaGUgc3RhcnQgcG9pbnQgaXMgcmFuZG9tbHkgc2VsZWN0ZWRcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdGxldCBzdGFydFBvaW50ID0gcG9seWdvbi5wb2ludHNbdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIHBvbHlnb24ucG9pbnRzLmxlbmd0aCldO1xyXG5cdFx0XHRsZXQgZW5kUG9pbnQ7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ly9cdEZldGNoIHBvaW50cyBvdGhlciB0aGFuIHRoZSBzdGFydCBwb2ludFxyXG5cdFx0XHQvL1x0b3V0IG9mIHRoZSBwb2x5Z29uXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgaW5kZXggPSBwb2x5Z29uLnBvaW50cy5pbmRleE9mKHN0YXJ0UG9pbnQpO1xyXG5cdFx0XHRsZXQgbGluZSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBvbHlnb24ucG9pbnRzLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdGlmIChpICE9PSBpbmRleCkgbGluZS5wdXNoKHBvbHlnb24ucG9pbnRzW2ldKTtcclxuXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0UHJvamVjdCB0aGUgc3RhcnQgcG9pbnQgdG8gdGhlIGxpbmVcclxuXHRcdFx0Ly9cdGl0J3MgZmFjaW5nIGFuZCB0aGF0J3MgdGhlIGVuZCBwb2ludFxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0bGV0IGF4aXMgPSBuZXcgVmVjdG9yKGxpbmVbMF0ueCAtIGxpbmVbMV0ueCwgbGluZVswXS55IC0gbGluZVsxXS55KTtcclxuXHRcdFx0ZW5kUG9pbnQgPSBzdGFydFBvaW50LnByb2plY3QoYXhpcyk7XHJcblxyXG5cdFx0XHQvL1x0Q3JlYXRlIHRoZSBsaW5lYXIgZ3JhZGllbnQgb2JqZWN0XHJcblx0XHRcdGxldCBncmFkID0gdGhpcy5fY2FudmFzQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcclxuXHRcdFx0XHRzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0R2V0IHJhbmRvbSBsaW5lYXIgZ3JhZGllbnQgY29sb3JzXHJcblx0XHRcdC8vXHRhbmQgYWRkIGNvbG9yc1xyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgZ3JhZENvbG9ycyA9IGNvbG9yVXRpbHMucmFuZG9tR3JhZGllbnQoY29sb3JVdGlscy5yYW5kb21Db2xvcihjb2xvcixcclxuXHRcdFx0XHR1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgMC4zKSksXHQvL1x0SW50ZW5zaXR5IG9mIHRoZSBiYXNlIGNvbG9yXHJcblx0XHRcdFx0XHR1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgMC4xKSk7XHQvL1x0SW50ZW5zaXR5IG9mIHRoZSByYW5kb20gZ3JhZGllbnRcclxuXHRcdFx0Z3JhZC5hZGRDb2xvclN0b3AoMCwgZ3JhZENvbG9ycy5maXJzdCk7XHJcblx0XHRcdGdyYWQuYWRkQ29sb3JTdG9wKDEsIGdyYWRDb2xvcnMuc2Vjb25kKTtcclxuXHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gZ3JhZDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yVXRpbHMucmFuZG9tQ29sb3IoY29sb3IpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gY29sb3JVdGlscy5yYW5kb21Db2xvcihjb2xvcik7XHJcblx0fVxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvL1x0RHJhdyB0aGUgcG9seWdvblxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cdHZhciBwb2ludHMgPSBwb2x5Z29uLnBvaW50cztcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYgKGkgPT09IDApIHtcclxuXHRcdFx0dGhpcy5fY2FudmFzQ29udGV4dC5tb3ZlVG8ocG9pbnRzW2ldLngsIHBvaW50c1tpXS55KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQubGluZVRvKHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuY2xvc2VQYXRoKCk7XHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5maWxsKCk7XHJcblxyXG5cdC8vXHRSZXN0b3JlIHByZXZpb3VzIHN0YXRlc1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQucmVzdG9yZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGNsZWFyIHRoZSBjYW52YXMgYW5kIGdlbmVyYXRlIGEgYmFja2dyb3VuZCB3aXRoIHRoZSBtb2RlXHJcbiAqL1xyXG5SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yLnByb3RvdHlwZS5nZW5lcmF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5fY2FudmFzLmNsaWVudFdpZHRoLCB0aGlzLl9jYW52YXMuY2xpZW50SGVpZ2h0KTtcclxuXHJcblx0dGhpcy5fbW9kZS5nZW5lcmF0ZSgpO1xyXG5cclxuXHR2YXIgcHJpbWl0aXZlcyA9IHRoaXMuX21vZGUuZ2V0UHJpbWl0aXZlcygpO1xyXG5cdHZhciBiYXNlQ29sb3JzID0gdGhpcy5fbW9kZS5nZXRCYXNlQ29sb3JzKCk7XHJcblxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcHJpbWl0aXZlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHJhbmRDb2xvciA9IGJhc2VDb2xvcnNbdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIGJhc2VDb2xvcnMubGVuZ3RoKV07XHJcblx0XHR0aGlzLl9maWxsUG9seWdvbihyYW5kQ29sb3IsIHByaW1pdGl2ZXNbaV0sIHRydWUpO1xyXG5cdH1cclxufTtcclxuXHJcbi8vXHRFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzID0gUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvcjtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxuLypcclxuICogIENoZWNrIGlmIGEgc3RyaW5nIGlzIGluIGEgaGV4IGNvbG9yIGZvcm1hdFxyXG4gKiAgQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGluIGEgaGV4IGZvcm1hdFxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29sb3JcclxuICovXHJcbmZ1bmN0aW9uIGlzSGV4KGNvbG9yKSB7XHJcbiAgICByZXR1cm4gLyNbYS1mMC05XXs2fS9naS50ZXN0KGNvbG9yKTtcclxufVxyXG5cclxuLypcclxuICogIENoZWNrIGlmIGEgc3RyaW5nIGlzIGluIGEgcmdiIGNvbG9yIGZvcm1hdFxyXG4gKiAgQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGluIGEgcmdiIGZvcm1hdFxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29sb3JcclxuICovXHJcbiBmdW5jdGlvbiBpc1JnYihjb2xvcikge1xyXG4gICAgLy8gIEVsaW1pbmF0ZSB3aGl0ZSBzcGFjZXNcclxuICAgIGNvbG9yID0gY29sb3IucmVwbGFjZSgvXFxzL2csIFwiXCIpO1xyXG4gICAgcmV0dXJuIC9yZ2JcXChbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCkvaS50ZXN0KGNvbG9yKTtcclxufVxyXG4gLypcclxuKiAgQ2hlY2sgaWYgYSBzdHJpbmcgaXMgaW4gYSByZ2JhIGNvbG9yIGZvcm1hdFxyXG4qICBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBzdHJpbmcgaXMgaW4gYSByZ2JhIGZvcm1hdFxyXG4qICBAcGFyYW0ge3N0cmluZ30gY29sb3I6IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb2xvclxyXG4qL1xyXG5mdW5jdGlvbiBpc1JnYmEoY29sb3IpIHtcclxuIC8vICBFbGltaW5hdGUgd2hpdGUgc3BhY2VzXHJcbiBjb2xvciA9IGNvbG9yLnJlcGxhY2UoL1xccy9nLCBcIlwiKTtcclxuIHJldHVybiAvcmdiYVxcKFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwpL2kudGVzdChjb2xvcik7XHJcblxyXG59XHJcblxyXG4vKlxyXG4gKlx0Q29udmVydCBoZXggY29sb3IgdG8gcmdiIGNvbG9yXHJcbiAqICBAcmV0dXJuIHtzdHJpbmcgLyBudWxsfSBDb252ZXJ0ZWQgY29sb3Igc3RyaW5nIG9yIG51bGwgaWYgdGhlIGlucHV0IGlzIGludmFsaWRcclxuICovXHJcbmZ1bmN0aW9uIGhleFRvUmdiKGhleCkge1xyXG4gICAgaWYgKGlzSGV4KGhleCkpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2IoXCIgK1xyXG4gICAgICAgIHBhcnNlSW50KGhleC5zdWJzdHIoMSwgMiksIDE2KSArIFwiLCBcIiArXHJcbiAgICAgICAgcGFyc2VJbnQoaGV4LnN1YnN0cigzLCAyKSwgMTYpICsgXCIsIFwiICtcclxuICAgICAgICBwYXJzZUludChoZXguc3Vic3RyKDUsIDIpLCAxNikgKyBcIilcIjtcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIGlzUmdiKGhleCkgfHwgaXNSZ2JhKGhleCkgPyBoZXggOiBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKlx0QWRqdXN0IHRoZSBicmlnaHRuZXNzIG9mIGEgY29sb3IgYnkgcGVyY2VudGFnZVxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgY29sb3Igc3RyaW5nXHJcbiAqICBAcGFyYW0ge2Zsb2F0fSBwZXJjZW50YWdlOiBBIGZsb2F0IHdpdGhpbiBbLTEsIDFdIGJ5IHdoaWNoIHRoZSBicmlnaHRuZXNzIGlzIGFkanVzdGVkLlxyXG4gKlx0XHRcdFx0XHRcdFx0ICAgMSBtZWFucyBtYXhpbXVtIGRhcmtuZXNzIGFuZCAtMSBtZWFucyBtYXhpbXVtIGJyaWdodG5lc3MuXHJcbiAqL1xyXG5mdW5jdGlvbiBhZGp1c3RDb2xvckJyaWdodG5lc3MoY29sb3IsIHBlcmNlbnRhZ2UpIHtcclxuICAgIHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlIHx8IDA7XHJcbiAgICBjb2xvciA9IGhleFRvUmdiKGNvbG9yKTtcclxuXHJcbiAgICBpZiAoY29sb3IgIT09IG51bGwpIHtcclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvL1x0VXNlIGRpZmZlcmVudCByZWdleCBhbmQgZm9ybWF0cyBmb3IgcmdiIGFuZCByZ2JhXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgdmFyIHJlZ3ggPSBpc1JnYihjb2xvcikgP1xyXG4gICAgICAgICAgICAvW1xcZF17MSwzfVsuXT9bXFxkXSovZ2kgOiAvW1xcZF17MSwzfVsuXT9bXFxkXSpcXCwvZ2k7XHJcbiAgICAgICAgdmFyIHBvc3RmaXggPSBpc1JnYihjb2xvcikgPyAnJyA6ICcsJztcclxuXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gIFJlcGxhY2UgdGhlIHIsIGcgYW5kIGIgd2l0aCBhZGp1c3RlZCBudW1iZXJzIGFuZFxyXG4gICAgICAgIC8vICByb3VuZCB0aGVtIHRvIGludGVnZXJzXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgcmV0dXJuIGNvbG9yLnJlcGxhY2UocmVneCwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHV0aWxzLmNsYW1wKChwYXJzZUludChlKSAqICgxIC0gcGVyY2VudGFnZSkpLCAwLCAyNTUpKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKCkgKyBwb3N0Zml4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKiAgRnVuY3Rpb24gdG8gZ2VuZXJhdGUgcmFuZG9tIGNvbG9yIHdpdGggcmFuZG9tIGJyaWdodG5lc3NcclxuICogIGJhc2VkIG9uIGEgZ2l2ZW4gY29sb3JcclxuICpcclxuICpcdEByZXR1cm4ge3N0cmluZ30gQSBzdHJpbmcgb2YgZ2VuZXJhdGVkIGNvbG9yXHJcbiAqICBAcGFyYW0ge3N0cmluZ30gYmFzZUNvbG9yOiBBIGNvbG9yIHN0cmluZyBpbiBIRVgsIFJHQiBvciBSR0JBXHJcbiAqXHRAcGFyYW0ge2Zsb2F0fSBicmlnaHRuZXNzSW50ZW5zaXR5KE9wdGlvbmFsKTogVGhlIGJyaWdodG5lc3MgaW50ZW5zaXR5IHdpdGhpbiBbMCwgMV0gdG8gZ2VuZXJhdGVcclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGFyb3VuZC4gMCBtZWFucyBnZW5lcmF0ZSBhcm91bmQgMCBicmlnaHRuZXNzIGNoYW5nZXMsXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAwLjUgbWVhbnMgZ2VuZXJhdGUgYXJvdW5kIDUwJSBicmlnaHRuZXNzIGNoYW5nZXMgYW5kXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAxIG1lYW5zIGdlbmVyYXRlIGFyb3VuZCBtYXhpbXVtIGJyaWdodG5lc3MgY2hhbmdlcy5cclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIFRoZSBicmlnaHRuZXNzIGNoYW5nZXMgd2lsbCBiZSBlaXRoZXIgZHJha2VuaW5nIG9yIGJyaWdodGVuaW5nLlxyXG4gKi9cclxuIGZ1bmN0aW9uIHJhbmRvbUNvbG9yKGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSl7XHJcbiAgICAgYnJpZ2h0bmVzc0ludGVuc2l0eSA9IGJyaWdodG5lc3NJbnRlbnNpdHkgfHwgMC41O1xyXG4gICAgIHZhciB0aHJlc2hvbGQgPSAwLjIsXHJcbiAgICAgICAgIHJhbmdlTG93ZXIgPSB1dGlscy5jbGFtcChicmlnaHRuZXNzSW50ZW5zaXR5IC0gdGhyZXNob2xkLCAwLCAxKSxcclxuICAgICAgICAgcmFuZ2VVcHBlciA9IHV0aWxzLmNsYW1wKGJyaWdodG5lc3NJbnRlbnNpdHkgKyB0aHJlc2hvbGQsIDAsIDEpO1xyXG5cclxuICAgICAvL1x0VXNlZCB0byBnZXQgYSBlaXRoZXIgbmVnYXRpdmUgb3IgcG9zaXRpdmUgcmFuZG9tIG51bWJlclxyXG4gICAgIHZhciByYW5kb21BcnIgPSBbXHJcbiAgICAgICAgIHV0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZShyYW5nZUxvd2VyLCByYW5nZVVwcGVyIC0gdGhyZXNob2xkLCBmYWxzZSksIC8vICBEYXJrZW5cclxuICAgICAgICAgdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKC1yYW5nZVVwcGVyLCAtcmFuZ2VMb3dlciwgZmFsc2UpXTsgIC8vICBCcmlnaHRlblxyXG5cclxuICAgICAvL1x0Q29sb3IgdmFsaWRpdHkgY2hlY2tpbmcgaW4gYWRqdXN0Q29sb3JCcmlnaHRuZXNzXHJcbiAgICAgcmV0dXJuIGFkanVzdENvbG9yQnJpZ2h0bmVzcyhiYXNlQ29sb3IsIHJhbmRvbUFyclt1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgMildKTtcclxuIH1cclxuXHJcbi8qXHJcbiAqICBGdW5jdGlvbiB0byBnZW5lcmF0ZSByYW5kb20gZ3JhZGllbnQgY29sb3Igd2l0aCByYW5kb20gYnJpZ2h0bmVzcyBvbiBib3RoIHNpZGVzXHJcbiAqICBvZiB0aGUgbGluZWFyIGdyYWRpZW50IGJhc2VkIG9uIGEgZ2l2ZW4gY29sb3JcclxuICpcclxuICpcdEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBhaXIgb2YgY29sb3JzXHJcbiAqICBAcGFyYW0ge3N0cmluZ30gYmFzZUNvbG9yOiBBIGNvbG9yIHN0cmluZyBpbiBIRVgsIFJHQiBvciBSR0JBXHJcbiAqXHRAcGFyYW0ge2Zsb2F0fSBicmlnaHRuZXNzSW50ZW5zaXR5KE9wdGlvbmFsKTogVGhlIGJyaWdodG5lc3MgaW50ZW5zaXR5IHdpdGhpbiBbMCwgMV0gdG8gZ2VuZXJhdGVcclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGFyb3VuZC4gVGhlIHNhbWUgYXMgdGhlIG9uZSBpbiByYW5kb21Db2xvclxyXG4gKi9cclxuIGZ1bmN0aW9uIHJhbmRvbUdyYWRpZW50KGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSkge1xyXG4gICAgIGJyaWdodG5lc3NJbnRlbnNpdHkgPSBicmlnaHRuZXNzSW50ZW5zaXR5IHx8IDAuNTtcclxuICAgICByZXR1cm4ge1xyXG4gICAgICAgICBmaXJzdDogcmFuZG9tQ29sb3IoYmFzZUNvbG9yLCBicmlnaHRuZXNzSW50ZW5zaXR5KSxcclxuICAgICAgICAgc2Vjb25kOiByYW5kb21Db2xvcihiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpXHJcbiAgICAgfTtcclxuIH1cclxuXHJcbi8vICBFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzLmlzSGV4ID0gaXNIZXg7XHJcbm1vZHVsZS5leHBvcnRzLmlzUmdiID0gaXNSZ2I7XHJcbm1vZHVsZS5leHBvcnRzLmlzUmdiYSA9IGlzUmdiYTtcclxubW9kdWxlLmV4cG9ydHMuaGV4VG9SZ2IgPSBoZXhUb1JnYjtcclxubW9kdWxlLmV4cG9ydHMuYWRqdXN0Q29sb3JCcmlnaHRuZXNzID0gYWRqdXN0Q29sb3JCcmlnaHRuZXNzO1xyXG5tb2R1bGUuZXhwb3J0cy5yYW5kb21Db2xvciA9IHJhbmRvbUNvbG9yO1xyXG5tb2R1bGUuZXhwb3J0cy5yYW5kb21HcmFkaWVudCA9IHJhbmRvbUdyYWRpZW50O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbG9yVXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKmpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuLypcclxuICogTW9kZSBvYmplY3RcclxuICpcclxuICogVGhlIG1vZGUgb2JqZWN0IChlLmcuICdQb2x5Z29uYWwnKSByZXNwb25zaWJsZSBmb3IgZ2VuZXJhdGluZyBwcmltaXRpdmUgc2hhcGVzXHJcbiAqIHRvIGRyYXcgd2l0aFxyXG4gKi9cclxuXHJcbiAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAvLyBEZXBlbmRlbmNpZXNcclxuIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIHZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuIHZhciBHcmFwaCA9IHJlcXVpcmUoJy4vZ3JhcGgnKTtcclxuIHZhciBWZWN0b3IgPSByZXF1aXJlKCcuL3ZlY3RvcicpO1xyXG5cclxuLypcclxuICogQmFzZSBtb2RlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNXaWR0aDogVGhlIHdpZHRoIG9mIHRoZSBjYW52YXNcclxuICogQHBhcmFtIHtOdW1iZXJ9IGNhbnZhc0hlaWdodDogVGhlIGhlaWdodCBvZiB0aGUgY2FudmFzXHJcbiAqIEBwYXJhbSB7U3RyaW5nKEFyZ3MpfSBiYXNlQ29sb3JzOiBhIHNldCBvZiB2YXJpYWJsZSBudW1iZXIgb2YgY29sb3Igc3RyaW5ncyB1c2VkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcyB0aGUgYmFzZSBjb2xvcnMgb2YgdGhlIGJhY2tncm91bmRcclxuICovXHJcbmZ1bmN0aW9uIE1vZGUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCwgYmFzZUNvbG9ycykge1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQmFzZSBjbGFzcyBtZW1iZXJzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHRoaXMuX2Jhc2VDb2xvcnMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoMiwgYXJndW1lbnRzLmxlbmd0aCk7XHJcbiAgICB0aGlzLl9wcmltaXRpdmVzID0gW107XHJcbiAgICB0aGlzLl93aWR0aCA9IGNhbnZhc1dpZHRoIHx8IDA7XHJcbiAgICB0aGlzLl9oZWlnaHQgPSBjYW52YXNIZWlnaHQgfHwgMDtcclxufVxyXG5cclxuLypcclxuICogUHVibGljIHZpcnR1YWwgZnVuY3Rpb24gLSBzZXQgdGhlIGFycmF5IG9mIGNvbG9yIHN0cmluZ3NcclxuICpcclxuICovXHJcbk1vZGUucHJvdG90eXBlLnNldEJhc2VDb2xvcnMgPSBmdW5jdGlvbihhcmdzKSB7XHJcbiAgICB0aGlzLl9iYXNlQ29sb3JzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIHZpcnR1YWwgZnVuY3Rpb24gLSByZXR1cm4gYW4gYXJyYXkgb2YgY29sb3Igc3RyaW5nc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgY29sb3Igc3RyaW5nc1xyXG4gKi9cclxuTW9kZS5wcm90b3R5cGUuZ2V0QmFzZUNvbG9ycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2Jhc2VDb2xvcnM7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgdmlydHVhbCBmdW5jdGlvbiAtIHJldHVybiBhbiBhcnJheSBvZiB0aGUgcHJpbWl0aXZlIHNoYXBlcyB0byBkcmF3IHdpdGhcclxuICpcclxuICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIHByaW1pdGl2ZSBzaGFwZXNcclxuICovXHJcbk1vZGUucHJvdG90eXBlLmdldFByaW1pdGl2ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9wcmltaXRpdmVzO1xyXG59O1xyXG5cclxuLypcclxuICogUG9seWdvbmFsIG1vZGUgY2xhc3MgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtmbG9hdH0gZGVuc2l0eTogVGhlIGRlbnNpdHkgb2YgdGhlIHBvbHlnb25zLCBpbiB0aGUgcmFuZ2Ugb2YgWzAsIDFdLlxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAwIGlzIHRoZSBzcGFyc2VzdCBhbmQgMSBpcyB0aGUgZGVuc2VzdC5cclxuICogQHBhcmFtIHtTdHJpbmcoQXJncyl9IGJhc2VDb2xvcnM6IGEgc2V0IG9mIHZhcmlhYmxlIG51bWJlciBvZiBjb2xvciBzdHJpbmdzIHVzZWRcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzIHRoZSBiYXNlIGNvbG9ycyBvZiB0aGUgYmFja2dyb3VuZFxyXG4gKiBAcGFyYW0ge051bWJlcn0gY2FudmFzV2lkdGg6IFRoZSB3aWR0aCBvZiB0aGUgY2FudmFzXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNIZWlnaHQ6IFRoZSBoZWlnaHQgb2YgdGhlIGNhbnZhc1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzTWl4ZWQ6IEEgZmxhZyBpbmRpY2F0aW5nIGlmIGFsbCBjb2xvcnMgYXJlIG1peGVkIG9yIGRpc3BsYXllZCBvbmUgYnkgb25lXHJcbiAqL1xyXG5mdW5jdGlvbiBQb2x5Z29uYWxNb2RlKGRlbnNpdHksIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQsIGlzTWl4ZWQsIGJhc2VDb2xvcnMpIHtcclxuICAgIC8vICBDYWxsIHRoZSBiYXNlIGNvbnN0cnVjdG9yIGFuZCBpbml0IGJhc2UgY2xhc3MgbWVtYmVyc1xyXG4gICAgUG9seWdvbmFsTW9kZS5fc3VwZXIuYXBwbHkodGhpcywgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDEsIGFyZ3VtZW50cy5sZW5ndGgpKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBDbGFzcy1zcGVjaWZpYyBtZW1iZXJzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHRoaXMuX2RlbnNpdHkgPSBkZW5zaXR5IHx8IDAuNTtcclxuICAgIHRoaXMuX2RlbnNpdHkgPSAxIC0gdGhpcy5fZGVuc2l0eTtcclxuXHR0aGlzLl9pc01peGVkID0gaXNNaXhlZCB8fCBmYWxzZTtcclxufVxyXG51dGlscy5pbmhlcml0KFBvbHlnb25hbE1vZGUsIE1vZGUpO1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vICBUaGUgYm91bmRzIG9mIHJhdGlvXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fVVBQRVJfQk9VTkQgPSAwLjM7XHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19MT1dFUl9CT1VORCA9IDAuMDE7XHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19ESUYgPVxyXG4gICAgUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuREVOU0lUWV9SQVRPX1VQUEVSX0JPVU5EIC1cclxuICAgIFBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19MT1dFUl9CT1VORDtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBzZXQgdGhlIG1peCBtb2RlXHJcbiAqXHJcbiAqL1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5zZXRNaXhlZCA9IGZ1bmN0aW9uKGZsYWcpIHtcclxuXHR0aGlzLl9pc01peGVkID0gZmxhZztcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSByZXR1cm4gdGhlIG1peCBtb2RlXHJcbiAqXHJcbiAqIEByZXR1cm4ge01vZGV9IHRoZSBjdXJyZW50IG1peCBtb2RlXHJcbiAqL1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5pc01peGVkID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX2lzTWl4ZWQ7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgb3ZlcnJpZGUgdmlydHVhbCBmdW5jdGlvbiAtIHJldHVybiBhbiBhcnJheSBvZiBjb2xvciBzdHJpbmdzIGJhc2VkIG9uIHRoZSBtaXggbW9kZVxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgY29sb3Igc3RyaW5nc1xyXG4gKi9cclxuTW9kZS5wcm90b3R5cGUuZ2V0QmFzZUNvbG9ycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lzTWl4ZWQgPyB0aGlzLl9iYXNlQ29sb3JzIDogW3RoaXMuX2Jhc2VDb2xvcnNbdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIHRoaXMuX2Jhc2VDb2xvcnMubGVuZ3RoKV1dO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIHNldCB0aGUgZGVuc2l0eSBvZiBwb2x5Z29uc1xyXG4gKlxyXG4gKi9cclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuc2V0RGVuc2l0eSA9IGZ1bmN0aW9uKGRlbnNpdHkpIHtcclxuICAgIHRoaXMuX2RlbnNpdHkgPSAxIC0gZGVuc2l0eTtcclxufTtcclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIHJldHVybiB0aGUgZGVuc2l0eSBvZiBwb2x5Z29uc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtmbG9hdH0gZGVuc2l0eVxyXG4gKi9cclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuZ2V0RGVuc2l0eSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIDEgLSB0aGlzLl9kZW5zaXR5O1xyXG59O1xyXG5cclxuLypcclxuICogUHJpdmF0ZSBoZWxwZXIgZnVuY3Rpb24gLSBnZW5lcmF0ZSBwb2ludHMgdG8gZHJhdyB3aXRoXHJcbiAqIEl0IGRpdmlkZXMgdGhlIHdob2xlIGNhbnZhcyBpbnRvIHNtYWxsIGdyaWRzIGFuZCBnZW5lcmF0ZSBhIHJhbmRvbSBwb2ludCBpbiBldmVyeVxyXG4gKiBncmlkXHJcbiAqXHJcbiAqIEByZXR1cm4gbm9uZVxyXG4gKi9cclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuX2dlbmVyYXRlUHJpbWl0aXZlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gIENsZWFyIHByZXZpb3VzIGRhdGFcclxuICAgIHRoaXMuX3ByaW1pdGl2ZXMgPSBbXTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgV2lkdGggYW5kIGhlaWdodCBvZiBldmVyeSBzbWFsbCBncmlkXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgcmF0aW8gPSB0aGlzLkRFTlNJVFlfUkFUT19MT1dFUl9CT1VORCArIHRoaXMuREVOU0lUWV9SQVRPX0RJRiAqIHRoaXMuX2RlbnNpdHk7XHJcbiAgICB2YXIgd2lkdGhJbnRlcnZhbCA9ICByYXRpbyAqIHRoaXMuX3dpZHRoLFxyXG4gICAgICAgIGhlaWdodEludGVydmFsID0gcmF0aW8gKiB0aGlzLl9oZWlnaHQ7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQ291bnRzIG9mIHJvd3MgYW5kIGNvbHVtbnMgcGx1cyB0aGUgdG9wXHJcbiAgICAvLyAgYW5kIGxlZnQgYm91bmRzIG9mIHRoZSByZWN0YW5nbGVcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdmFyIHJvd0NvdW50ID0gTWF0aC5mbG9vcih0aGlzLl93aWR0aCAvIHdpZHRoSW50ZXJ2YWwpICsgMSxcclxuICAgICAgICBjb2xDb3VudCA9IE1hdGguZmxvb3IodGhpcy5faGVpZ2h0IC8gaGVpZ2h0SW50ZXJ2YWwpICsgMTtcclxuXHJcbiAgICAvLyAgVXNlIGEgZ3JhcGggdG8gcmVwcmVzZW50IHRoZSBncmlkcyBvbiB0aGUgY2FudmFzXHJcbiAgICB2YXIgZ3JhcGggPSBuZXcgR3JhcGgocm93Q291bnQsIGNvbENvdW50KTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBQb2ludHMgb2YgZXZlcnkgc21hbGwgZ3JpZFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgcDEgPSBuZXcgVmVjdG9yKDAsIDApLFxyXG4gICAgICAgIHAyID0gbmV3IFZlY3Rvcih3aWR0aEludGVydmFsLCAwKSxcclxuICAgICAgICBwMyA9IG5ldyBWZWN0b3Iod2lkdGhJbnRlcnZhbCwgaGVpZ2h0SW50ZXJ2YWwpLFxyXG4gICAgICAgIHA0ID0gbmV3IFZlY3RvcigwLCBoZWlnaHRJbnRlcnZhbCk7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIFJhbmRvbWx5IGdlbmVyYXRlIHBvaW50cyBvbiB0aGUgY2FudmFzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbENvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgdmFyIHJhbmRQb2ludDtcclxuXHJcbiAgICAgICAgICAgIC8vICBTaHJpbmsgdGhlIHJlY3RhbmdsZSB0byBwcm9kdWNlIGxlc3MgbWVzc3kgcG9pbnRzXHJcbiAgICAgICAgICAgIHZhciBzaHJpbmtlZCA9IHV0aWxzLnNocmlua1JlY3QocDEsIHAyLCBwMywgcDQsIHdpZHRoSW50ZXJ2YWwgLyA1ICwgMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaiA9PT0gMCkgeyAgLy8gIElmIGF0IHRoZSBsZWZ0IGJvdW5kXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkgICAgLy8gIElmIGF0IHRoZSB0b3AgbGVmdCBjb3JuZXJcclxuICAgICAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSBuZXcgVmVjdG9yKGkgKiB3aWR0aEludGVydmFsLCBqICogaGVpZ2h0SW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHNocmlua2VkLnAxLCBzaHJpbmtlZC5wMSwgc2hyaW5rZWQucDQsIHNocmlua2VkLnA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChqID09PSBjb2xDb3VudCAtIDEpIHsgICAvLyAgSWYgYXQgdGhlIHJpZ2h0IGJvdW5kXHJcbiAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSB1dGlscy5nZXRSYW5kb21Qb2ludE9uUmVjdChzaHJpbmtlZC5wMiwgc2hyaW5rZWQucDIsIHNocmlua2VkLnAzLCBzaHJpbmtlZC5wMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkgeyAgIC8vICBJZiBhdCB0aGUgdG9wIGJvdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gdXRpbHMuZ2V0UmFuZG9tUG9pbnRPblJlY3Qoc2hyaW5rZWQucDEsIHNocmlua2VkLnAyLCBzaHJpbmtlZC5wMiwgc2hyaW5rZWQucDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaSA9PT0gcm93Q291bnQgLSAxKSB7ICAgLy8gIElmIGF0IHRoZSBib3R0b20gYm91bmRcclxuICAgICAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSB1dGlscy5nZXRSYW5kb21Qb2ludE9uUmVjdChzaHJpbmtlZC5wNCwgc2hyaW5rZWQucDMsIHNocmlua2VkLnAzLCBzaHJpbmtlZC5wNCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSB1dGlscy5nZXRSYW5kb21Qb2ludE9uUmVjdChzaHJpbmtlZC5wMSwgc2hyaW5rZWQucDIsIHNocmlua2VkLnAzLCBzaHJpbmtlZC5wNCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ3JhcGguaW5zZXJ0KGksIGosIHJhbmRQb2ludCk7XHJcblxyXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgLy8gIE1vdmUgdGhlIGN1cnJlbnQgc21hbGwgZ3JpZCB0byB0aGVcclxuICAgICAgICAgICAgLy8gIHJpZ2h0IGJ5IG9uZSBpbnRlcnZhbCB1bml0XHJcbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICBwMS54ICs9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgICAgIHAyLnggKz0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICAgICAgcDMueCArPSB3aWR0aEludGVydmFsO1xyXG4gICAgICAgICAgICBwNC54ICs9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vICBNb3ZlIHRoZSBjdXJyZW50IHNtYWxsIGdyaWQgYmFjayB0byB0aGVcclxuICAgICAgICAvLyAgbGVmdCBtb3N0IGJvdW5kIGFuZCBtb3ZlIGl0IGRvd24gYnkgb25lIGludGVydmFsIHVuaXRcclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICBwMS54ID0gcDQueCA9IDA7XHJcbiAgICAgICAgcDIueCA9IHAzLnggPSB3aWR0aEludGVydmFsO1xyXG4gICAgICAgIHAxLnkgKz0gaGVpZ2h0SW50ZXJ2YWw7XHJcbiAgICAgICAgcDIueSArPSBoZWlnaHRJbnRlcnZhbDtcclxuICAgICAgICBwMy55ICs9IGhlaWdodEludGVydmFsO1xyXG4gICAgICAgIHA0LnkgKz0gaGVpZ2h0SW50ZXJ2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBBcyB3ZSBhcmUgZ29pbmcgdG8gY2hlY2sgYWRqYWNlbnQgdmVydGljZXNcclxuICAgIC8vICBpdCdzIGVhc2llciB0byBzdG9yZSBhbGwgZGVsdGEgaW5kZXggdmFsdWVzIGFuZFxyXG4gICAgLy8gIGxvb3Agb3ZlciB0aGVtXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdmFyIGRpID0gWy0xLCAtMSwgLTEsICAwLCAgMSwgMSwgMSwgMF0sXHJcbiAgICAgICAgZGogPSBbLTEsICAwLCAgMSwgIDEsICAxLCAwLCAtMSwgLTFdO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIENvbm5lY3QgYWxsIGFkamFjZW50IHZlcnRpY2VzXHJcbiAgICAvLyAgYW5kIGdldCBhbGwgcHJpbWl0aXZlc1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbENvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgLy8gIEtlZXAgY291bnQgb2YgdGhlIHBvaW50cyB0aGF0IGFyZSBhY3R1YWxseSBwcm9jZXNzZWRcclxuICAgICAgICAgICAgbGV0IGNudCA9IDA7XHJcblxyXG4gICAgICAgICAgICBsZXQgZmlyc3RQb2ludCwgcHJldlBvaW50O1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBkaS5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJQb2ludCA9IGdyYXBoLmdldChpICsgZGlba10sIGogKyBkaltrXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJQb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXBoLmNvbm5lY3QoaSwgaiwgaSArIGRpW2tdLCBqICsgZGpba10pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY250ID09PSAxKSB7ICAgIC8vICBBc3NpZ24gZmlyc3QgcG9pbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RQb2ludCA9IGN1cnJQb2ludDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByaW1pdGl2ZXMucHVzaChuZXcgdXRpbHMuUG9seWdvbihbICAgLy8gIEFkZCBwb2x5Z29uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmFwaC5nZXQoaSwgaiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2UG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyUG9pbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwcmV2UG9pbnQgPSBjdXJyUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIC8vICBDb25uZWN0IHRoZSBmaXJzdCBwb2ludCB3aXRoIHRoZVxyXG4gICAgICAgICAgICAvLyAgbGFzdCBwb2ludCBhbmQgYWRkIHBvbHlnb25cclxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIGlmIChmaXJzdFBvaW50ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIHByZXZQb2ludCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICAhZmlyc3RQb2ludC5lcXVhbChwcmV2UG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmltaXRpdmVzLnB1c2gobmV3IHV0aWxzLlBvbHlnb24oW1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXBoLmdldChpLCBqKSxcclxuICAgICAgICAgICAgICAgICAgICBwcmV2UG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RQb2ludFxyXG4gICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn07XHJcblxyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5nZW5lcmF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fZ2VuZXJhdGVQcmltaXRpdmVzKCk7XHJcbn07XHJcblxyXG4vLyAgRXhwb3J0IGFuIG9iamVjdCBmb3IgZGlyZWN0IGxvb2t1cFxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIFBvbHlnb25hbDogUG9seWdvbmFsTW9kZVxyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL21vZGVzLmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG4vKlxyXG4gKiBVbmRpcmVjdGVkIGFjeWxpYyBncmFwaCBkYXRhIHN0cnVjdHVyZSB1c2luZ1xyXG4gKiBhZGphY2VueSBtYXRyaXggYXMgaW1wbGVtZW50YXRpb25cclxuICpcclxuICovXHJcblxyXG4vKlxyXG4gKiBHcmFwaCBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IHJvd0NvdW50OiBUaGUgbnVtYmVyIG9mIHJvd3NcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBjb2x1bW5Db3VudDogVGhlIG51bWJlciBvZiBjb2x1bW5zXHJcbiAqIEBvYXJhbSB7Tm9uLW9iamVjdCB0eXBlc30gaW5pdGlhbFZhbHVlKE9wdGlvbmFsKTogaW5pdGlhbFZhbHVlIGZvciBhbGwgZWxlbWVudHMgaW4gdGhlIGdyYXBoLiBJdCdzIDAgYnkgZGVmYXVsdC5cclxuICovXHJcbmZ1bmN0aW9uIEdyYXBoKHJvd0NvdW50LCBjb2x1bW5Db3VudCwgaW5pdGlhbFZhbHVlKSB7XHJcbiAgICB0aGlzLl9yb3dDb3VudCA9IHJvd0NvdW50IHx8IDA7XHJcbiAgICB0aGlzLl9jb2x1bW5Db3VudCA9IGNvbHVtbkNvdW50IHx8IDA7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBBbGxvY2F0ZSBhbiBlbXB0eSBtYXRyaXhcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB0aGlzLl9kYXRhID0gbmV3IEFycmF5KHJvd0NvdW50KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgIHRoaXMuX2RhdGFbaV0gPSBuZXcgQXJyYXkoY29sdW1uQ291bnQpLmZpbGwoaW5pdGlhbFZhbHVlIHx8IDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2VkZ2VzID0ge307XHJcbn1cclxuXHJcbi8qXHJcbiAqIFByaXZhdGUgbWVtYmVyIGZ1bmN0aW9uIC0gY2hlY2sgaWYgYSBwYWlyIG9mIHBvc2l0aW9ucyBpcyBpbiB0aGUgcmFuZ2Ugb2Ygcm93cyBhbmQgY29sdW1uc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBwYWlyIG9mIHBvc2l0aW9ucyBpcyBpbiB0aGUgYm91bmQgYW5kIGZhbHNlIGlmIG5vdFxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGk6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGo6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLl9jaGVja0JvdW5kID0gZnVuY3Rpb24oaSwgaikge1xyXG4gICAgaWYgKGkgPj0gdGhpcy5fcm93Q291bnQgfHxcclxuICAgICAgICBqID49IHRoaXMuX2NvbHVtbkNvdW50IHx8XHJcbiAgICAgICAgaSA8IDAgfHwgaiA8IDApIHJldHVybiBmYWxzZTtcclxuICAgIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuLypcclxuICogUHJpdmF0ZSBtZW1iZXIgZnVuY3Rpb24gLSBnZXQgYW4gaWQgZnJvbSBhIHBhaXIgb2YgcG9zaXRpb25zXHJcbiAqXHJcbiAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGlkIG9mIHRoZSBwYWlyIG9mIHBvc2l0aW9uc1xyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGk6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGo6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLl9nZXRJZCA9IGZ1bmN0aW9uKGksIGopIHtcclxuICAgIHJldHVybiB0aGlzLl9jaGVja0JvdW5kKGksIGopID8gaS50b1N0cmluZygpICsgai50b1N0cmluZygpIDogbnVsbDtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSByZXR1cm4gdGhlIGNvdW50IG9mIHJvd3NcclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5yb3dDb3VudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NvdW50O1xyXG59O1xyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gcmV0dXJuIHRoZSBjb3VudCBvZiBjb2x1bW5zXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuY29sdW1uQ291bnQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9jb2x1bW5Db3VudDtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBpbnNlcnQgYW4gZWxlbWVudCB0byB0aGUgZ3JhcGhcclxuICpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBpbnNlcnRpb24gaXMgc3VjY2Vzc2Z1bCBhbmQgZmFsc2UgaWYgbm90XHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7QW55fSB2YWx1ZTogVGhlIHZhbHVlIHRvIGluc2VydFxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGksIGosIHZhbHVlKSB7XHJcbiAgICBpZiAodGhpcy5fY2hlY2tCb3VuZChpLCBqKSkge1xyXG4gICAgICAgIHRoaXMuX2RhdGFbaV1bal0gPSB2YWx1ZTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGdldCBhIGVsZW1lbnQgZnJvbSBhIHBhaXIgb2YgcG9zaXRpb25cclxuICpcclxuICogQHJldHVybiB7QW55IC8gbnVsbH0gVGhlIGVsZW1lbnQgYXQgdGhlIHBvc2l0aW9uIGlmIHRoZSBwYWlyIG9mIHBvc2l0aW9ucyBpcyBpbiB0aGUgYm91bmRcclxuICogICAgICAgICAgICAgICAgICAgICAgYW5kIG51bGwgaWYgbm90XHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaSwgaikge1xyXG4gICAgaWYgKHRoaXMuX2NoZWNrQm91bmQoaSwgaikpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtpXVtqXTtcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gY2hlY2sgaWYgdHdvIHZlcnRpY2VzIGFyZSBjb25uZWN0ZWRcclxuICpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSBpcyBhIGNvbm5lY3Rpb24gYmV0d2VlbiB0d28gZWxlbWVudHNcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpMSwgaTI6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGoxLCBqMjogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuaXNDb25uZWN0ZWQgPSBmdW5jdGlvbihpMSwgajEsIGkyLCBqMikge1xyXG4gICAgaWYgKCF0aGlzLl9jaGVja0JvdW5kKGkxLCBqMSkgfHxcclxuICAgICAgICAhdGhpcy5fY2hlY2tCb3VuZChpMiwgajIpKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgdmFyIGlkMSA9IHRoaXMuX2dldElkKGkxLCBqMSksXHJcbiAgICAgICAgaWQyID0gdGhpcy5fZ2V0SWQoaTIsIGoyKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMuX2VkZ2VzW2lkMV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuX2VkZ2VzW2lkMV1baWQyXTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBjb25uZWN0IHRoZSBlZGdlIG9mIHR3byB2ZXJ0aWNlc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBhY3Rpb24gaXMgc3VjY2Vzc2Z1bFxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGkxLCBpMjogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajEsIGoyOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24oaTEsIGoxLCBpMiwgajIpIHtcclxuICAgIGlmICghdGhpcy5fY2hlY2tCb3VuZChpMSwgajEpIHx8XHJcbiAgICAgICAgIXRoaXMuX2NoZWNrQm91bmQoaTIsIGoyKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHZhciBpZDEgPSB0aGlzLl9nZXRJZChpMSwgajEpLFxyXG4gICAgICAgIGlkMiA9IHRoaXMuX2dldElkKGkyLCBqMik7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLl9lZGdlc1tpZDFdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMuX2VkZ2VzW2lkMV0gPSB7fTtcclxuICAgIH1cclxuICAgIHRoaXMuX2VkZ2VzW2lkMV1baWQyXSA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gZGlzY29ubmVjdCB0aGUgZWRnZSBvZiB0d28gdmVydGljZXNcclxuICpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgYWN0aW9uIGlzIHN1Y2Nlc3NmdWxcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpMSwgaTI6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGoxLCBqMjogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuZGlzY29ubmVjdCA9IGZ1bmN0aW9uKGkxLCBqMSwgaTIsIGoyKSB7XHJcbiAgICBpZiAoIXRoaXMuX2NoZWNrQm91bmQoaTEsIGoxKSB8fFxyXG4gICAgICAgICF0aGlzLl9jaGVja0JvdW5kKGkyLCBqMikpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB2YXIgaWQxID0gdGhpcy5fZ2V0SWQoaTEsIGoxKSxcclxuICAgICAgICBpZDIgPSB0aGlzLl9nZXRJZChpMiwgajIpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5fZWRnZXNbaWQxXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHRoaXMuX2VkZ2VzW2lkMV1baWQyXSA9IGZhbHNlO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuLy8gIEV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMgPSBHcmFwaDtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ncmFwaC5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=