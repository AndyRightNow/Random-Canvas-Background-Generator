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
	    var back = new RandomBackgroundGenerator('canvas', 'Polygonal', '#87D37C', '#90C695', '#4183D7');
	    back.getMode().setDensity(1);
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
	PolygonalMode.prototype.DENSITY_RATO_LOWER_BOUND = 0.0001;
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
	    return this._density;
	};
	
	/*
	 * Private helper function - generate points to draw with
	 * It divides the whole canvas into small grids and generate a random point in every
	 * grid
	 *
	 * @return none
	 */
	PolygonalMode.prototype._generatePrimitives = function() {
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
	
	            if (j === 0) {  //  If at the left bound
	                randPoint = utils.getRandomPointOnRect(p1, p1, p4, p4);
	            }
	            else if (j === colCount - 1) {   //  If at the right bound
	                randPoint = utils.getRandomPointOnRect(p2, p2, p3, p3);
	            }
	            else {
	                if (i === 0) {   //  If at the top bound
	                    randPoint = utils.getRandomPointOnRect(p1, p2, p2, p1);
	                }
	                else if (i === rowCount - 1) {   //  If at the bottom bound
	                    randPoint = utils.getRandomPointOnRect(p4, p3, p3, p4);
	                }
	                else {
	                    randPoint = utils.getRandomPointOnRect(p1, p2, p3, p4);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGJmMDA4ZDY5MmQ0OWMxNTJhYTkiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sb3JVdGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7Ozs7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDdkRBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVyxNQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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WSxRQUFRO0FBQ3BCLFlBQVcsUUFBUTtBQUNuQixZQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQVksUUFBUTtBQUNwQixZQUFXLFFBQVE7QUFDbkIsWUFBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLFFBQVE7QUFDcEIsWUFBVyxRQUFRO0FBQ25CLFlBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiJodG1sVGVzdC5kaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBkYmYwMDhkNjkyZDQ5YzE1MmFhOVxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi8uLi8uLi9zcmMvdmVjdG9yJyk7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vc3JjL3V0aWxzJyk7XHJcbnZhciBSYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yID0gcmVxdWlyZSgnLi8uLi8uLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvcicpO1xyXG5cclxudmFyIGh0bWxUZXN0ID0ge307XHJcblxyXG5cclxuXHJcbmh0bWxUZXN0LnJ1biA9IGZ1bmN0aW9uKGNhbnZhc0lkKXtcclxuICAgIHZhciBiYWNrID0gbmV3IFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IoJ2NhbnZhcycsICdQb2x5Z29uYWwnLCAnIzg3RDM3QycsICcjOTBDNjk1JywgJyM0MTgzRDcnKTtcclxuICAgIGJhY2suZ2V0TW9kZSgpLnNldERlbnNpdHkoMSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2VuZXJhdGUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgYmFjay5nZW5lcmF0ZSgpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGh0bWxUZXN0O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcbiAqICAgICAgICAgICAgICBWZWN0b3IgQ2xhc3NcclxuICpcclxuICogICAgICBWZWN0b3IgYW5kIHZlY3RvciBvcGVyYXRpb25zLlxyXG4gKi9cclxuXHJcbi8qXHJcbiAqICBDb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gVmVjdG9yKHgsIHkpe1xyXG5cdHRoaXMueCA9IHggfHwgMDtcclxuXHR0aGlzLnkgPSB5IHx8IDA7XHJcbn1cclxuXHJcblZlY3Rvci5wcm90b3R5cGUuZXF1YWwgPSBmdW5jdGlvbih2ZWMpIHtcclxuXHRyZXR1cm4gdGhpcy54ID09PSB2ZWMueCAmJiB0aGlzLnkgPT09IHZlYy55O1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2KXtcclxuXHRyZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55O1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5sZW4yID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5kb3QodGhpcyk7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmxlbiA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIE1hdGguc3FydCh0aGlzLmxlbjIoKSk7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24oc3gsIHN5KXtcclxuXHR0aGlzLnggKj0gc3g7XHJcblx0dGhpcy55ICo9IHN5IHx8IHN4O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbih2KXtcclxuXHR0aGlzLnggLT0gdi54O1xyXG5cdHRoaXMueSAtPSB2Lnk7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cdE5vIHNpZGUgZWZmZWN0IGFuZCBjaGFpbmluZ1xyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuVmVjdG9yLnByb3RvdHlwZS5wcm9qZWN0ID0gZnVuY3Rpb24oYXhpcyl7XHJcblx0dmFyIGNvZiA9ICB0aGlzLmRvdChheGlzKSAvIGF4aXMubGVuMigpO1xyXG5cdHJldHVybiBheGlzLnNjYWxlKGNvZik7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLnByb2plY3ROID0gZnVuY3Rpb24oYXhpcyl7XHJcblx0dmFyIGNvZiA9ICB0aGlzLmRvdChheGlzKTtcclxuXHRyZXR1cm4gYXhpcy5zY2FsZShjb2YpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3I7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdmVjdG9yLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcbnZhciBWZWN0b3IgPSByZXF1aXJlKCcuL3ZlY3RvcicpO1xyXG5cclxuLypcclxuICpcdFBvbHlnb24gY2xhc3MgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzOiBUaGUgcG9pbnRzIG9mIHRoZSBwb2x5Z29uLiBUaGV5IG11c3QgYmUgaW4gY2xvY2t3aXNlIG9yIGNvdW50ZXItY2xvY2t3aXNlIG9yZGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBQb2x5Z29uKHBvaW50cykge1xyXG4gICAgdGhpcy5fcG9pbnRzID0gcG9pbnRzIHx8IFtdO1xyXG59XHJcblBvbHlnb24ucHJvdG90eXBlID0ge1xyXG4gICAgZ2V0IHBvaW50cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9pbnRzO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXQgcG9pbnRzKHBvaW50cykge1xyXG4gICAgICAgIHRoaXMuX3BvaW50cyA9IHBvaW50cztcclxuICAgIH0sXHJcblxyXG4gICAgZXF1YWw6IGZ1bmN0aW9uKHBvbHlnb24pIHtcclxuICAgICAgICB2YXIgcmV2ZXJzZWQgPSBwb2x5Z29uLnBvaW50cztcclxuICAgICAgICByZXZlcnNlZC5yZXZlcnNlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50cy5ldmVyeShmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5lcXVhbChwb2x5Z29uLnBvaW50c1tpbmRleF0pO1xyXG4gICAgICAgIH0pIHx8IHRoaXMucG9pbnRzLmV2ZXJ5KGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmVxdWFsKHJldmVyc2VkW2luZGV4XSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiAgQ2xhbXAgYSBudW1iZXIgd2l0aGluIGEgcmFuZ2VcclxuICovXHJcbmZ1bmN0aW9uIGNsYW1wKHgsIGxvd2VyLCB1cHBlcil7XHJcbiAgICByZXR1cm4geCA8IGxvd2VyID8gbG93ZXIgOiB4ID4gdXBwZXIgPyB1cHBlciA6IHg7XHJcbn1cclxuXHJcbi8qXHJcbiAqXHRHZXQgYSByYW5kb20gbnVtYmVyIGZyb20gYSByYW5nZVxyXG4gKlxyXG4gKlx0QHJldHVybiB7aW50IC8gZmxvYXR9IEEgcmFuZG9tbHkgZ2VuZXJhdGVkIG51bWJlciB3aXRoaW4gYSByYW5nZVxyXG4gKlx0QHBhcmFtIHtpbnQgLyBmbG9hdH0gbG93ZXI6IFRoZSBsb3dlciBib3VuZCBvZiB0aGUgcmFuZ2UoSW5jbHVzaXZlKVxyXG4gKlx0QHBhcmFtIHtpbnQgLyBmbG9hdH0gdXBwZXI6IFRoZSB1cHBlciBib3VuZCBvZiB0aGUgcmFuZ2UoRXhjbHVzaXZlKVxyXG4gKlx0QHBhcmFtIHtib29sZWFufSBpc0ludDogVGhlIGZsYWcgdG8gc3BlY2lmeSB3aGV0aGVyIHRoZSByZXN1bHQgaXMgaW50IG9yIGZsb2F0XHJcbiAqL1xyXG4gZnVuY3Rpb24gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKGxvd2VyLCB1cHBlciwgaXNJbnQpIHtcclxuICAgICBpZiAobG93ZXIgPj0gdXBwZXIpIHJldHVybiAwO1xyXG4gICAgIGlzSW50ID0gaXNJbnQgfHwgdHJ1ZTtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vXHRTb21lIHJhbmRvbSBudW1iZXJzIGp1c3QgY29taW5nIG91dCBvZiBub3doZXJlXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgc29tZVJhbmRvbU51bWJlcjEgPSAxMjg1LFxyXG4gICAgICAgIHNvbWVSYW5kb21OdW1iZXIyID0gMjM5MTtcclxuXHJcbiAgICAvL1x0R2VuZXJhdGUgdGhlIGludGVnZXIgcGFydFxyXG4gICAgdmFyIHJhbmRvbUludCA9XHJcbiAgICAgICAgcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIHNvbWVSYW5kb21OdW1iZXIxICogTWF0aC5yYW5kb20oKSAqIHNvbWVSYW5kb21OdW1iZXIyKSAlICh1cHBlciAtIGxvd2VyKTtcclxuXHJcbiAgICBpZiAoaXNJbnQpIHtcclxuICAgICAgICByZXR1cm4gbG93ZXIgKyByYW5kb21JbnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBsb3dlciArIHJhbmRvbUludCArIE1hdGgucmFuZG9tKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiAqICBHZXQgYSByYW5kb20gcG9pbnQgb24gYSByZWN0YW5nbGVcclxuICpcclxuICpcdEBwYXJhbSB7VmVjdG9yfSBwMSwgcDIsIHAzLCBwNDogUG9pbnRzIG9mIGEgcmVjdGFuZ2xlIHN0YXJ0aW5nXHJcbiAqXHRcdFx0XHRcdFx0XHRcdCAgIGZyb20gdGhlIHRvcCBsZWZ0IGNvcm5lciBhbmQgZ29pbmdcclxuICpcdFx0XHRcdFx0XHRcdFx0ICAgY2xvY2t3aXNlLlxyXG4gKlx0QHBhcmFtIHtib29sZWFufSBpc0ludDogVGhlIGZsYWcgdG8gc3BlY2lmeSB3aGV0aGVyIHRoZSByZXN1bHQgaXMgaW50IG9yIGZsb2F0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSYW5kb21Qb2ludE9uUmVjdChwMSwgcDIsIHAzLCBwNCwgaXNJbnQpIHtcclxuICAgIGlzSW50ID0gaXNJbnQgfHwgdHJ1ZTtcclxuICAgIHZhciB3aWR0aCA9IE1hdGguYWJzKHAyLnggLSBwMS54KSxcclxuICAgICAgICBoZWlnaHQgPSBNYXRoLmFicyhwMy55IC0gcDIueSksXHJcbiAgICAgICAgdG9wTGVmdFggPSBNYXRoLm1pbihwMS54LCBwMi54LCBwMy54LCBwNC54KSxcclxuICAgICAgICB0b3BMZWZ0WSA9IE1hdGgubWluKHAxLnksIHAyLnksIHAzLnksIHA0LnkpO1xyXG5cclxuICAgIHZhciByYW5kb21EZWx0YVggPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgd2lkdGgsIGlzSW50KSxcclxuICAgICAgICByYW5kb21EZWx0YVkgPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgaGVpZ2h0LCBpc0ludCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBWZWN0b3IodG9wTGVmdFggKyByYW5kb21EZWx0YVgsIHRvcExlZnRZICsgcmFuZG9tRGVsdGFZKTtcclxufVxyXG5cclxuLypcclxuICogIEdldCBhIHJhbmRvbSBwb2ludCBvbiBhIGxpbmVcclxuICogIEBwYXJhbSB7VmVjdG9yfSBwMSwgcDI6IFBvaW50cyBvZiBhIGxpbmUgZnJvbSBsZWZ0IHRvIHJpZ2h0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSYW5kb21Qb2ludE9uTGluZShwMSwgcDIpIHtcclxuICAgIHZhciBwcm9qZWN0aW9uV2lkdGggPSBNYXRoLmFicyhwMS54IC0gcDIueCksXHJcbiAgICAgICAgbGVmdFggPSBNYXRoLm1pbihwMS54LCBwMi54KTtcclxuXHJcbiAgICB2YXIgQSA9IChwMS55IC0gcDIueSkgLyAocDEueCAtIHAyLngpLFxyXG4gICAgICAgIEIgPSBwMS55IC0gQSAqIHAxLng7XHJcblxyXG4gICAgdmFyIHJhbmRvbURlbHRhWCA9IGdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCBwcm9qZWN0aW9uV2lkdGgsIGZhbHNlKTtcclxuICAgIHJldHVybiBuZXcgVmVjdG9yKGxlZnRYICsgcmFuZG9tRGVsdGFYLCBBICogKGxlZnRYICsgcmFuZG9tRGVsdGFYKSArIEIpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBIZWxwZXIgZnVuY3Rpb24gdXNlZCB0byBjcmVhdGUgaW5oZXJpdGFuY2VcclxuICpcclxuICogQHJldHVybiBub25lXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN0b3I6IFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgY3VycmVudCBvYmplY3RcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3VwZXJDdG9yOiBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHBhcmVudCBvYmplY3RcclxuICovXHJcbiBmdW5jdGlvbiBpbmhlcml0KGN0b3IsIHN1cGVyQ3Rvcikge1xyXG4gICAgIGN0b3IuX3N1cGVyID0gc3VwZXJDdG9yO1xyXG4gICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XHJcbiAgICAgICAgIGNvbnN0cnVjdG9yOiB7XHJcbiAgICAgICAgICAgICB2YWx1ZTogY3RvcixcclxuICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgfVxyXG4gICAgIH0pO1xyXG4gfVxyXG5cclxuLy8gIEV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMuUG9seWdvbiA9IFBvbHlnb247XHJcbm1vZHVsZS5leHBvcnRzLmNsYW1wID0gY2xhbXA7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSA9IGdldFJhbmRvbU51bWJlckZyb21SYW5nZTtcclxubW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tUG9pbnRPblJlY3QgPSBnZXRSYW5kb21Qb2ludE9uUmVjdDtcclxubW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tUG9pbnRPbkxpbmUgPSBnZXRSYW5kb21Qb2ludE9uTGluZTtcclxubW9kdWxlLmV4cG9ydHMuaW5oZXJpdCA9IGluaGVyaXQ7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKmpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbi8qXHJcbiAqIFJhbmRvbSBDYW52YXMgQmFja2dyb3VuZCBHZW5lcmF0b3JcclxuICpcclxuICogSXQncyB1c2VkIG9uIEhUTUwgQ2FudmFzIHRvIGdlbmVyYXRlIHJhbmRvbSBiYWNrZ3JvdW5kIGluIGEgY2VydGFpbiBwYXR0ZXJuXHJcbiAqIHdpdGggY2VydGFpbiBjdXN0b21pemVkIHBhcmFtZXRlcnMgYW5kIG1vZGVzLiBUaGUgYmFja2dyb3VuZFxyXG4gKiB3aWxsIHVwZGF0ZSBldmVyeSB0aW1lIHlvdSBjYWxsIGdlbmVyYXRlKClcclxuICpcclxuICovXHJcblxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cdERlcGVuZGVuY2llc1xyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG52YXIgY29sb3JVdGlscyA9IHJlcXVpcmUoJy4vY29sb3JVdGlscycpO1xyXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi92ZWN0b3InKTtcclxudmFyIE1vZGVzID0gcmVxdWlyZSgnLi9tb2RlcycpO1xyXG5cclxuLypcclxuKlx0Q29uc3RhbnQgc3RyaW5nIG5hbWVcclxuKi9cclxuY29uc3QgUE9MWUdPTkFMID0gXCJQb2x5Z29uYWxcIjtcclxuXHJcbi8qXHJcbiogQ29uc3RydWN0b3JcclxuKlxyXG4qIEBwYXJhbSB7c3RyaW5nfSBjYW52YXNJZDogVGhlIGlkIG9mIHRoZSBjYW52YXMgeW91IHdhbnQgdG8gZ2VuZXJhdGUgYmFja2dyb3VuZCBvblxyXG4qIEBwYXJhbSB7c3RyaW5nfSBtb2RlOiBUaGUgcGF0dGVybiBpbiB3aGljaCB0aGUgYmFja2dyb3VuZCBpcyBnZW5lcmF0ZWQuXHJcbipcdFx0XHRcdFx0XHQgQ3VycmVudGx5IFN1cHBvcnQ6IDEuIFwiUG9seWdvbmFsXCJcclxuKiBAcGFyYW0ge1N0cmluZyhBcmdzKX0gYmFzZUNvbG9yczogYSBzZXQgb2YgdmFyaWFibGUgbnVtYmVyIG9mIGNvbG9yIHN0cmluZ3MgdXNlZFxyXG4qICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcyB0aGUgYmFzZSBjb2xvcnMgb2YgdGhlIGJhY2tncm91bmRcclxuKi9cclxuZnVuY3Rpb24gUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvcihjYW52YXNJZCwgbW9kZSwgYmFzZUNvbG9ycykge1xyXG5cdC8vXHRJbml0aWFsaXplXHJcblx0dGhpcy5fY2FudmFzID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSA6IG51bGw7XHJcblx0dGhpcy5fY2FudmFzQ29udGV4dCA9IHRoaXMuX2NhbnZhcyA/IHRoaXMuX2NhbnZhcy5nZXRDb250ZXh0KCcyZCcpIDogbnVsbDtcclxuXHR0aGlzLl9tb2RlTmFtZSA9IG1vZGUgfHwgUE9MWUdPTkFMO1xyXG5cdHRoaXMuX21vZGUgPSBudWxsO1xyXG5cclxuXHRpZiAodGhpcy5fY2FudmFzKSB7XHQvL1x0SWYgY2FudmFzIGVsZW1lbnQgZXhpc3RzXHJcblx0XHR0aGlzLl9tb2RlID0gbmV3IE1vZGVzW3RoaXMuX21vZGVOYW1lXSgwLjYsXHJcblx0XHRcdHRoaXMuX2NhbnZhcy5jbGllbnRXaWR0aCxcclxuXHRcdFx0dGhpcy5fY2FudmFzLmNsaWVudEhlaWdodCk7XHJcblxyXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XHQvL1x0SWYgYW55IGNvbG9yIGlzIHByb3ZpZWRlXHJcblx0XHRcdHRoaXMuX21vZGUuc2V0QmFzZUNvbG9ycy5hcHBseSh0aGlzLl9tb2RlLCBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoMiwgYXJndW1lbnRzLmxlbmd0aCkpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIHJldHVybiB0aGUgY3VycmVudCBtb2RlXHJcbiAqXHJcbiAqIEByZXR1cm4ge01vZGV9IHRoZSBjdXJyZW50IG1vZGVcclxuICovXHJcblJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IucHJvdG90eXBlLmdldE1vZGUgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fbW9kZTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIGhlbHBlciBmdW5jdGlvbiB1c2VkIHRvIGRyYXcgcG9seWdvbiBvbiB0aGUgY2FudmFzXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogQSBIRVgsIFJHQiBvciBSR0JBIGNvbG9yIGluIHRoZSBmb3JtIG9mXHJcbiAqXHRcdFx0XHRcdFx0ICAgXCIjMDAwMDAwXCIsIFwicmdiKDAsIDAsIDApXCIgb3IgXCJyZ2JhKDAsIDAsIDAsIDEpXCJcclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzOiBBbiBhcnJheSBvZiBQb2ludCBvYmplY3RzXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZ3JhZGllbnQ6IEEgZmxhZyBpbmRpY2F0aW5nIGlmIGxpbmVhci1ncmFkaWVudCBpcyBlbmFibGVkLlxyXG4gKlx0XHRcdFx0XHRcdFx0ICAgVGhlIGdyYWRpZW50IHdpbGwgYmUgcmFuZG9tbHkgZ2VuZXJhdGVkLlxyXG4gKlxyXG4gKi9cclxuUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5wcm90b3R5cGUuX2ZpbGxQb2x5Z29uID0gZnVuY3Rpb24oY29sb3IsIHBvbHlnb24sIGdyYWRpZW50KSB7XHJcblx0Z3JhZGllbnQgPSBncmFkaWVudCB8fCBmYWxzZTtcclxuXHJcblx0Ly9cdFNhdmUgdGhlIHByZXZpb3VzIHN0YXRlc1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuc2F2ZSgpO1xyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8vXHRTZXQgdGhlIGNvbG9yXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRpZiAoZ3JhZGllbnQpIHtcclxuXHRcdGlmIChwb2x5Z29uLnBvaW50cy5sZW5ndGggPT09IDMpIHtcdC8vXHRJZiBpdCdzIGEgdHJpYW5nbGVcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdC8vXHRTdGFydCBhbmQgZW5kIHBvaW50cyBvZiB0aGUgbGluZWFyIGdyYWRpZW50XHJcblx0XHRcdC8vXHRUaGUgc3RhcnQgcG9pbnQgaXMgcmFuZG9tbHkgc2VsZWN0ZWRcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdGxldCBzdGFydFBvaW50ID0gcG9seWdvbi5wb2ludHNbdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIHBvbHlnb24ucG9pbnRzLmxlbmd0aCldO1xyXG5cdFx0XHRsZXQgZW5kUG9pbnQ7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ly9cdEZldGNoIHBvaW50cyBvdGhlciB0aGFuIHRoZSBzdGFydCBwb2ludFxyXG5cdFx0XHQvL1x0b3V0IG9mIHRoZSBwb2x5Z29uXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgaW5kZXggPSBwb2x5Z29uLnBvaW50cy5pbmRleE9mKHN0YXJ0UG9pbnQpO1xyXG5cdFx0XHRsZXQgbGluZSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBvbHlnb24ucG9pbnRzLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdGlmIChpICE9PSBpbmRleCkgbGluZS5wdXNoKHBvbHlnb24ucG9pbnRzW2ldKTtcclxuXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0UHJvamVjdCB0aGUgc3RhcnQgcG9pbnQgdG8gdGhlIGxpbmVcclxuXHRcdFx0Ly9cdGl0J3MgZmFjaW5nIGFuZCB0aGF0J3MgdGhlIGVuZCBwb2ludFxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0bGV0IGF4aXMgPSBuZXcgVmVjdG9yKGxpbmVbMF0ueCAtIGxpbmVbMV0ueCwgbGluZVswXS55IC0gbGluZVsxXS55KTtcclxuXHRcdFx0ZW5kUG9pbnQgPSBzdGFydFBvaW50LnByb2plY3QoYXhpcyk7XHJcblxyXG5cdFx0XHQvL1x0Q3JlYXRlIHRoZSBsaW5lYXIgZ3JhZGllbnQgb2JqZWN0XHJcblx0XHRcdGxldCBncmFkID0gdGhpcy5fY2FudmFzQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcclxuXHRcdFx0XHRzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0R2V0IHJhbmRvbSBsaW5lYXIgZ3JhZGllbnQgY29sb3JzXHJcblx0XHRcdC8vXHRhbmQgYWRkIGNvbG9yc1xyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgcmFuZG9tSW50ZW5zaXR5ID0gTWF0aC5yYW5kb20oKSArIDEgKiAwLjU7XHJcblx0XHRcdGxldCBncmFkQ29sb3JzID0gY29sb3JVdGlscy5yYW5kb21HcmFkaWVudChjb2xvclV0aWxzLnJhbmRvbUNvbG9yKGNvbG9yKSwgcmFuZG9tSW50ZW5zaXR5KTtcclxuXHRcdFx0Z3JhZC5hZGRDb2xvclN0b3AoMCwgZ3JhZENvbG9ycy5maXJzdCk7XHJcblx0XHRcdGdyYWQuYWRkQ29sb3JTdG9wKDEsIGdyYWRDb2xvcnMuc2Vjb25kKTtcclxuXHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gZ3JhZDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ly9cdERyYXcgdGhlIHBvbHlnb25cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5iZWdpblBhdGgoKTtcclxuXHR2YXIgcG9pbnRzID0gcG9seWdvbi5wb2ludHM7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQubW92ZVRvKHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmxpbmVUbyhwb2ludHNbaV0ueCwgcG9pbnRzW2ldLnkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbCgpO1xyXG5cclxuXHQvL1x0UmVzdG9yZSBwcmV2aW91cyBzdGF0ZXNcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LnJlc3RvcmUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBjbGVhciB0aGUgY2FudmFzIGFuZCBnZW5lcmF0ZSBhIGJhY2tncm91bmQgd2l0aCB0aGUgbW9kZVxyXG4gKi9cclxuUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpe1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuX2NhbnZhcy5jbGllbnRXaWR0aCwgdGhpcy5fY2FudmFzLmNsaWVudEhlaWdodCk7XHJcblxyXG5cdHRoaXMuX21vZGUuZ2VuZXJhdGUoKTtcclxuXHJcblx0dmFyIHByaW1pdGl2ZXMgPSB0aGlzLl9tb2RlLmdldFByaW1pdGl2ZXMoKTtcclxuXHR2YXIgYmFzZUNvbG9ycyA9IHRoaXMuX21vZGUuZ2V0QmFzZUNvbG9ycygpO1xyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHByaW1pdGl2ZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciByYW5kQ29sb3IgPSBiYXNlQ29sb3JzW3V0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCBiYXNlQ29sb3JzLmxlbmd0aCldO1xyXG5cdFx0dGhpcy5fZmlsbFBvbHlnb24ocmFuZENvbG9yLCBwcmltaXRpdmVzW2ldLCB0cnVlKTtcclxuXHR9XHJcbn07XHJcblxyXG4vL1x0RXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3I7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcbi8qXHJcbiAqICBDaGVjayBpZiBhIHN0cmluZyBpcyBpbiBhIGhleCBjb2xvciBmb3JtYXRcclxuICogIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHN0cmluZyBpcyBpbiBhIGhleCBmb3JtYXRcclxuICogIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogVGhlIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGNvbG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0hleChjb2xvcikge1xyXG4gICAgcmV0dXJuIC8jW2EtZjAtOV17Nn0vZ2kudGVzdChjb2xvcik7XHJcbn1cclxuXHJcbi8qXHJcbiAqICBDaGVjayBpZiBhIHN0cmluZyBpcyBpbiBhIHJnYiBjb2xvciBmb3JtYXRcclxuICogIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHN0cmluZyBpcyBpbiBhIHJnYiBmb3JtYXRcclxuICogIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogVGhlIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGNvbG9yXHJcbiAqL1xyXG4gZnVuY3Rpb24gaXNSZ2IoY29sb3IpIHtcclxuICAgIC8vICBFbGltaW5hdGUgd2hpdGUgc3BhY2VzXHJcbiAgICBjb2xvciA9IGNvbG9yLnJlcGxhY2UoL1xccy9nLCBcIlwiKTtcclxuICAgIHJldHVybiAvcmdiXFwoW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwpL2kudGVzdChjb2xvcik7XHJcbn1cclxuIC8qXHJcbiogIENoZWNrIGlmIGEgc3RyaW5nIGlzIGluIGEgcmdiYSBjb2xvciBmb3JtYXRcclxuKiAgQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGluIGEgcmdiYSBmb3JtYXRcclxuKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29sb3JcclxuKi9cclxuZnVuY3Rpb24gaXNSZ2JhKGNvbG9yKSB7XHJcbiAvLyAgRWxpbWluYXRlIHdoaXRlIHNwYWNlc1xyXG4gY29sb3IgPSBjb2xvci5yZXBsYWNlKC9cXHMvZywgXCJcIik7XHJcbiByZXR1cm4gL3JnYmFcXChbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcKS9pLnRlc3QoY29sb3IpO1xyXG5cclxufVxyXG5cclxuLypcclxuICpcdENvbnZlcnQgaGV4IGNvbG9yIHRvIHJnYiBjb2xvclxyXG4gKiAgQHJldHVybiB7c3RyaW5nIC8gbnVsbH0gQ29udmVydGVkIGNvbG9yIHN0cmluZyBvciBudWxsIGlmIHRoZSBpbnB1dCBpcyBpbnZhbGlkXHJcbiAqL1xyXG5mdW5jdGlvbiBoZXhUb1JnYihoZXgpIHtcclxuICAgIGlmIChpc0hleChoZXgpKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiKFwiICtcclxuICAgICAgICBwYXJzZUludChoZXguc3Vic3RyKDEsIDIpLCAxNikgKyBcIiwgXCIgK1xyXG4gICAgICAgIHBhcnNlSW50KGhleC5zdWJzdHIoMywgMiksIDE2KSArIFwiLCBcIiArXHJcbiAgICAgICAgcGFyc2VJbnQoaGV4LnN1YnN0cig1LCAyKSwgMTYpICsgXCIpXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiBpc1JnYihoZXgpIHx8IGlzUmdiYShoZXgpID8gaGV4IDogbnVsbDtcclxufVxyXG5cclxuLypcclxuICpcdEFkanVzdCB0aGUgYnJpZ2h0bmVzcyBvZiBhIGNvbG9yIGJ5IHBlcmNlbnRhZ2VcclxuICogIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogVGhlIGNvbG9yIHN0cmluZ1xyXG4gKiAgQHBhcmFtIHtmbG9hdH0gcGVyY2VudGFnZTogQSBmbG9hdCB3aXRoaW4gWy0xLCAxXSBieSB3aGljaCB0aGUgYnJpZ2h0bmVzcyBpcyBhZGp1c3RlZC5cclxuICpcdFx0XHRcdFx0XHRcdCAgIDEgbWVhbnMgbWF4aW11bSBkYXJrbmVzcyBhbmQgLTEgbWVhbnMgbWF4aW11bSBicmlnaHRuZXNzLlxyXG4gKi9cclxuZnVuY3Rpb24gYWRqdXN0Q29sb3JCcmlnaHRuZXNzKGNvbG9yLCBwZXJjZW50YWdlKSB7XHJcbiAgICBwZXJjZW50YWdlID0gcGVyY2VudGFnZSB8fCAwO1xyXG4gICAgY29sb3IgPSBoZXhUb1JnYihjb2xvcik7XHJcblxyXG4gICAgaWYgKGNvbG9yICE9PSBudWxsKSB7XHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy9cdFVzZSBkaWZmZXJlbnQgcmVnZXggYW5kIGZvcm1hdHMgZm9yIHJnYiBhbmQgcmdiYVxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIHZhciByZWd4ID0gaXNSZ2IoY29sb3IpID9cclxuICAgICAgICAgICAgL1tcXGRdezEsM31bLl0/W1xcZF0qL2dpIDogL1tcXGRdezEsM31bLl0/W1xcZF0qXFwsL2dpO1xyXG4gICAgICAgIHZhciBwb3N0Zml4ID0gaXNSZ2IoY29sb3IpID8gJycgOiAnLCc7XHJcblxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vICBSZXBsYWNlIHRoZSByLCBnIGFuZCBiIHdpdGggYWRqdXN0ZWQgbnVtYmVycyBhbmRcclxuICAgICAgICAvLyAgcm91bmQgdGhlbSB0byBpbnRlZ2Vyc1xyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIHJldHVybiBjb2xvci5yZXBsYWNlKHJlZ3gsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh1dGlscy5jbGFtcCgocGFyc2VJbnQoZSkgKiAoMSAtIHBlcmNlbnRhZ2UpKSwgMCwgMjU1KSlcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygpICsgcG9zdGZpeDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLypcclxuICogIEZ1bmN0aW9uIHRvIGdlbmVyYXRlIHJhbmRvbSBjb2xvciB3aXRoIHJhbmRvbSBicmlnaHRuZXNzXHJcbiAqICBiYXNlZCBvbiBhIGdpdmVuIGNvbG9yXHJcbiAqXHJcbiAqXHRAcmV0dXJuIHtzdHJpbmd9IEEgc3RyaW5nIG9mIGdlbmVyYXRlZCBjb2xvclxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGJhc2VDb2xvcjogQSBjb2xvciBzdHJpbmcgaW4gSEVYLCBSR0Igb3IgUkdCQVxyXG4gKlx0QHBhcmFtIHtmbG9hdH0gYnJpZ2h0bmVzc0ludGVuc2l0eShPcHRpb25hbCk6IFRoZSBicmlnaHRuZXNzIGludGVuc2l0eSB3aXRoaW4gWzAsIDFdIHRvIGdlbmVyYXRlXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBhcm91bmQuIDAgbWVhbnMgZ2VuZXJhdGUgYXJvdW5kIDAgYnJpZ2h0bmVzcyBjaGFuZ2VzLFxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgMC41IG1lYW5zIGdlbmVyYXRlIGFyb3VuZCA1MCUgYnJpZ2h0bmVzcyBjaGFuZ2VzIGFuZFxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgMSBtZWFucyBnZW5lcmF0ZSBhcm91bmQgbWF4aW11bSBicmlnaHRuZXNzIGNoYW5nZXMuXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBUaGUgYnJpZ2h0bmVzcyBjaGFuZ2VzIHdpbGwgYmUgZWl0aGVyIGRyYWtlbmluZyBvciBicmlnaHRlbmluZy5cclxuICovXHJcbiBmdW5jdGlvbiByYW5kb21Db2xvcihiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpe1xyXG4gICAgIGJyaWdodG5lc3NJbnRlbnNpdHkgPSBicmlnaHRuZXNzSW50ZW5zaXR5IHx8IDAuNTtcclxuICAgICB2YXIgdGhyZXNob2xkID0gMC4yLFxyXG4gICAgICAgICByYW5nZUxvd2VyID0gdXRpbHMuY2xhbXAoYnJpZ2h0bmVzc0ludGVuc2l0eSAtIHRocmVzaG9sZCwgMCwgMSksXHJcbiAgICAgICAgIHJhbmdlVXBwZXIgPSB1dGlscy5jbGFtcChicmlnaHRuZXNzSW50ZW5zaXR5ICsgdGhyZXNob2xkLCAwLCAxKTtcclxuXHJcbiAgICAgLy9cdFVzZWQgdG8gZ2V0IGEgZWl0aGVyIG5lZ2F0aXZlIG9yIHBvc2l0aXZlIHJhbmRvbSBudW1iZXJcclxuICAgICB2YXIgcmFuZG9tQXJyID0gW1xyXG4gICAgICAgICB1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UocmFuZ2VMb3dlciwgcmFuZ2VVcHBlciwgZmFsc2UpLFxyXG4gICAgICAgICB1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoLXJhbmdlTG93ZXIsIC1yYW5nZVVwcGVyLCBmYWxzZSldO1xyXG5cclxuICAgICAvL1x0Q29sb3IgdmFsaWRpdHkgY2hlY2tpbmcgaW4gYWRqdXN0Q29sb3JCcmlnaHRuZXNzXHJcbiAgICAgcmV0dXJuIGFkanVzdENvbG9yQnJpZ2h0bmVzcyhiYXNlQ29sb3IsIHJhbmRvbUFyclt1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgMildKTtcclxuIH1cclxuXHJcbi8qXHJcbiAqICBGdW5jdGlvbiB0byBnZW5lcmF0ZSByYW5kb20gZ3JhZGllbnQgY29sb3Igd2l0aCByYW5kb20gYnJpZ2h0bmVzcyBvbiBib3RoIHNpZGVzXHJcbiAqICBvZiB0aGUgbGluZWFyIGdyYWRpZW50IGJhc2VkIG9uIGEgZ2l2ZW4gY29sb3JcclxuICpcclxuICpcdEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBhaXIgb2YgY29sb3JzXHJcbiAqICBAcGFyYW0ge3N0cmluZ30gYmFzZUNvbG9yOiBBIGNvbG9yIHN0cmluZyBpbiBIRVgsIFJHQiBvciBSR0JBXHJcbiAqXHRAcGFyYW0ge2Zsb2F0fSBicmlnaHRuZXNzSW50ZW5zaXR5KE9wdGlvbmFsKTogVGhlIGJyaWdodG5lc3MgaW50ZW5zaXR5IHdpdGhpbiBbMCwgMV0gdG8gZ2VuZXJhdGVcclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGFyb3VuZC4gVGhlIHNhbWUgYXMgdGhlIG9uZSBpbiByYW5kb21Db2xvclxyXG4gKi9cclxuIGZ1bmN0aW9uIHJhbmRvbUdyYWRpZW50KGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSkge1xyXG4gICAgIGJyaWdodG5lc3NJbnRlbnNpdHkgPSBicmlnaHRuZXNzSW50ZW5zaXR5IHx8IDAuNTtcclxuICAgICByZXR1cm4ge1xyXG4gICAgICAgICBmaXJzdDogcmFuZG9tQ29sb3IoYmFzZUNvbG9yLCBicmlnaHRuZXNzSW50ZW5zaXR5KSxcclxuICAgICAgICAgc2Vjb25kOiByYW5kb21Db2xvcihiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpXHJcbiAgICAgfTtcclxuIH1cclxuXHJcbi8vICBFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzLmlzSGV4ID0gaXNIZXg7XHJcbm1vZHVsZS5leHBvcnRzLmlzUmdiID0gaXNSZ2I7XHJcbm1vZHVsZS5leHBvcnRzLmlzUmdiYSA9IGlzUmdiYTtcclxubW9kdWxlLmV4cG9ydHMuaGV4VG9SZ2IgPSBoZXhUb1JnYjtcclxubW9kdWxlLmV4cG9ydHMuYWRqdXN0Q29sb3JCcmlnaHRuZXNzID0gYWRqdXN0Q29sb3JCcmlnaHRuZXNzO1xyXG5tb2R1bGUuZXhwb3J0cy5yYW5kb21Db2xvciA9IHJhbmRvbUNvbG9yO1xyXG5tb2R1bGUuZXhwb3J0cy5yYW5kb21HcmFkaWVudCA9IHJhbmRvbUdyYWRpZW50O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbG9yVXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKmpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuLypcclxuICogTW9kZSBvYmplY3RcclxuICpcclxuICogVGhlIG1vZGUgb2JqZWN0IChlLmcuICdQb2x5Z29uYWwnKSByZXNwb25zaWJsZSBmb3IgZ2VuZXJhdGluZyBwcmltaXRpdmUgc2hhcGVzXHJcbiAqIHRvIGRyYXcgd2l0aFxyXG4gKi9cclxuXHJcbiAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAvLyBEZXBlbmRlbmNpZXNcclxuIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIHZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuIHZhciBHcmFwaCA9IHJlcXVpcmUoJy4vZ3JhcGgnKTtcclxuIHZhciBWZWN0b3IgPSByZXF1aXJlKCcuL3ZlY3RvcicpO1xyXG5cclxuLypcclxuICogQmFzZSBtb2RlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNXaWR0aDogVGhlIHdpZHRoIG9mIHRoZSBjYW52YXNcclxuICogQHBhcmFtIHtOdW1iZXJ9IGNhbnZhc0hlaWdodDogVGhlIGhlaWdodCBvZiB0aGUgY2FudmFzXHJcbiAqIEBwYXJhbSB7U3RyaW5nKEFyZ3MpfSBiYXNlQ29sb3JzOiBhIHNldCBvZiB2YXJpYWJsZSBudW1iZXIgb2YgY29sb3Igc3RyaW5ncyB1c2VkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcyB0aGUgYmFzZSBjb2xvcnMgb2YgdGhlIGJhY2tncm91bmRcclxuICovXHJcbmZ1bmN0aW9uIE1vZGUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCwgYmFzZUNvbG9ycykge1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQmFzZSBjbGFzcyBtZW1iZXJzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHRoaXMuX2Jhc2VDb2xvcnMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoMiwgYXJndW1lbnRzLmxlbmd0aCk7XHJcbiAgICB0aGlzLl9wcmltaXRpdmVzID0gW107XHJcbiAgICB0aGlzLl93aWR0aCA9IGNhbnZhc1dpZHRoIHx8IDA7XHJcbiAgICB0aGlzLl9oZWlnaHQgPSBjYW52YXNIZWlnaHQgfHwgMDtcclxufVxyXG5cclxuLypcclxuICogUHVibGljIHZpcnR1YWwgZnVuY3Rpb24gLSBzZXQgdGhlIGFycmF5IG9mIGNvbG9yIHN0cmluZ3NcclxuICpcclxuICovXHJcbk1vZGUucHJvdG90eXBlLnNldEJhc2VDb2xvcnMgPSBmdW5jdGlvbihhcmdzKSB7XHJcbiAgICB0aGlzLl9iYXNlQ29sb3JzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIHZpcnR1YWwgZnVuY3Rpb24gLSByZXR1cm4gYW4gYXJyYXkgb2YgY29sb3Igc3RyaW5nc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgY29sb3Igc3RyaW5nc1xyXG4gKi9cclxuTW9kZS5wcm90b3R5cGUuZ2V0QmFzZUNvbG9ycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2Jhc2VDb2xvcnM7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgdmlydHVhbCBmdW5jdGlvbiAtIHJldHVybiBhbiBhcnJheSBvZiB0aGUgcHJpbWl0aXZlIHNoYXBlcyB0byBkcmF3IHdpdGhcclxuICpcclxuICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIHByaW1pdGl2ZSBzaGFwZXNcclxuICovXHJcbk1vZGUucHJvdG90eXBlLmdldFByaW1pdGl2ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9wcmltaXRpdmVzO1xyXG59O1xyXG5cclxuLypcclxuICogUG9seWdvbmFsIG1vZGUgY2xhc3MgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtmbG9hdH0gZGVuc2l0eTogVGhlIGRlbnNpdHkgb2YgdGhlIHBvbHlnb25zLCBpbiB0aGUgcmFuZ2Ugb2YgWzAsIDFdLlxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAwIGlzIHRoZSBzcGFyc2VzdCBhbmQgMSBpcyB0aGUgZGVuc2VzdC5cclxuICogQHBhcmFtIHtTdHJpbmcoQXJncyl9IGJhc2VDb2xvcnM6IGEgc2V0IG9mIHZhcmlhYmxlIG51bWJlciBvZiBjb2xvciBzdHJpbmdzIHVzZWRcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzIHRoZSBiYXNlIGNvbG9ycyBvZiB0aGUgYmFja2dyb3VuZFxyXG4gKiBAcGFyYW0ge051bWJlcn0gY2FudmFzV2lkdGg6IFRoZSB3aWR0aCBvZiB0aGUgY2FudmFzXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNIZWlnaHQ6IFRoZSBoZWlnaHQgb2YgdGhlIGNhbnZhc1xyXG5cclxuICovXHJcbmZ1bmN0aW9uIFBvbHlnb25hbE1vZGUoZGVuc2l0eSwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCwgYmFzZUNvbG9ycykge1xyXG4gICAgLy8gIENhbGwgdGhlIGJhc2UgY29uc3RydWN0b3IgYW5kIGluaXQgYmFzZSBjbGFzcyBtZW1iZXJzXHJcbiAgICBQb2x5Z29uYWxNb2RlLl9zdXBlci5hcHBseSh0aGlzLCBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoMSwgYXJndW1lbnRzLmxlbmd0aCkpO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIENsYXNzLXNwZWNpZmljIG1lbWJlcnNcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdGhpcy5fZGVuc2l0eSA9IGRlbnNpdHkgfHwgMC41O1xyXG4gICAgdGhpcy5fZGVuc2l0eSA9IDEgLSB0aGlzLl9kZW5zaXR5O1xyXG59XHJcbnV0aWxzLmluaGVyaXQoUG9seWdvbmFsTW9kZSwgTW9kZSk7XHJcblxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gIFRoZSBib3VuZHMgb2YgcmF0aW9cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19VUFBFUl9CT1VORCA9IDAuMztcclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuREVOU0lUWV9SQVRPX0xPV0VSX0JPVU5EID0gMC4wMDAxO1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fRElGID1cclxuICAgIFBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19VUFBFUl9CT1VORCAtXHJcbiAgICBQb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fTE9XRVJfQk9VTkQ7XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gc2V0IHRoZSBkZW5zaXR5IG9mIHBvbHlnb25zXHJcbiAqXHJcbiAqL1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5zZXREZW5zaXR5ID0gZnVuY3Rpb24oZGVuc2l0eSkge1xyXG4gICAgdGhpcy5fZGVuc2l0eSA9IDEgLSBkZW5zaXR5O1xyXG59O1xyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gcmV0dXJuIHRoZSBkZW5zaXR5IG9mIHBvbHlnb25zXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Zsb2F0fSBkZW5zaXR5XHJcbiAqL1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5nZXREZW5zaXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGVuc2l0eTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFByaXZhdGUgaGVscGVyIGZ1bmN0aW9uIC0gZ2VuZXJhdGUgcG9pbnRzIHRvIGRyYXcgd2l0aFxyXG4gKiBJdCBkaXZpZGVzIHRoZSB3aG9sZSBjYW52YXMgaW50byBzbWFsbCBncmlkcyBhbmQgZ2VuZXJhdGUgYSByYW5kb20gcG9pbnQgaW4gZXZlcnlcclxuICogZ3JpZFxyXG4gKlxyXG4gKiBAcmV0dXJuIG5vbmVcclxuICovXHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLl9nZW5lcmF0ZVByaW1pdGl2ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBXaWR0aCBhbmQgaGVpZ2h0IG9mIGV2ZXJ5IHNtYWxsIGdyaWRcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHZhciByYXRpbyA9IHRoaXMuREVOU0lUWV9SQVRPX0xPV0VSX0JPVU5EICsgdGhpcy5ERU5TSVRZX1JBVE9fRElGICogdGhpcy5fZGVuc2l0eTtcclxuICAgIHZhciB3aWR0aEludGVydmFsID0gIHJhdGlvICogdGhpcy5fd2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0SW50ZXJ2YWwgPSByYXRpbyAqIHRoaXMuX2hlaWdodDtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBDb3VudHMgb2Ygcm93cyBhbmQgY29sdW1ucyBwbHVzIHRoZSB0b3BcclxuICAgIC8vICBhbmQgbGVmdCBib3VuZHMgb2YgdGhlIHJlY3RhbmdsZVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgcm93Q291bnQgPSBNYXRoLmZsb29yKHRoaXMuX3dpZHRoIC8gd2lkdGhJbnRlcnZhbCkgKyAxLFxyXG4gICAgICAgIGNvbENvdW50ID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQgLyBoZWlnaHRJbnRlcnZhbCkgKyAxO1xyXG5cclxuICAgIC8vICBVc2UgYSBncmFwaCB0byByZXByZXNlbnQgdGhlIGdyaWRzIG9uIHRoZSBjYW52YXNcclxuICAgIHZhciBncmFwaCA9IG5ldyBHcmFwaChyb3dDb3VudCwgY29sQ291bnQpO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIFBvaW50cyBvZiBldmVyeSBzbWFsbCBncmlkXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHZhciBwMSA9IG5ldyBWZWN0b3IoMCwgMCksXHJcbiAgICAgICAgcDIgPSBuZXcgVmVjdG9yKHdpZHRoSW50ZXJ2YWwsIDApLFxyXG4gICAgICAgIHAzID0gbmV3IFZlY3Rvcih3aWR0aEludGVydmFsLCBoZWlnaHRJbnRlcnZhbCksXHJcbiAgICAgICAgcDQgPSBuZXcgVmVjdG9yKDAsIGhlaWdodEludGVydmFsKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgUmFuZG9tbHkgZ2VuZXJhdGUgcG9pbnRzIG9uIHRoZSBjYW52YXNcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICB2YXIgcmFuZFBvaW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKGogPT09IDApIHsgIC8vICBJZiBhdCB0aGUgbGVmdCBib3VuZFxyXG4gICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gdXRpbHMuZ2V0UmFuZG9tUG9pbnRPblJlY3QocDEsIHAxLCBwNCwgcDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGogPT09IGNvbENvdW50IC0gMSkgeyAgIC8vICBJZiBhdCB0aGUgcmlnaHQgYm91bmRcclxuICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHAyLCBwMiwgcDMsIHAzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7ICAgLy8gIElmIGF0IHRoZSB0b3AgYm91bmRcclxuICAgICAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSB1dGlscy5nZXRSYW5kb21Qb2ludE9uUmVjdChwMSwgcDIsIHAyLCBwMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpID09PSByb3dDb3VudCAtIDEpIHsgICAvLyAgSWYgYXQgdGhlIGJvdHRvbSBib3VuZFxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHA0LCBwMywgcDMsIHA0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHAxLCBwMiwgcDMsIHA0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBncmFwaC5pbnNlcnQoaSwgaiwgcmFuZFBvaW50KTtcclxuXHJcbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAvLyAgTW92ZSB0aGUgY3VycmVudCBzbWFsbCBncmlkIHRvIHRoZVxyXG4gICAgICAgICAgICAvLyAgcmlnaHQgYnkgb25lIGludGVydmFsIHVuaXRcclxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIHAxLnggKz0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICAgICAgcDIueCArPSB3aWR0aEludGVydmFsO1xyXG4gICAgICAgICAgICBwMy54ICs9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgICAgIHA0LnggKz0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gIE1vdmUgdGhlIGN1cnJlbnQgc21hbGwgZ3JpZCBiYWNrIHRvIHRoZVxyXG4gICAgICAgIC8vICBsZWZ0IG1vc3QgYm91bmQgYW5kIG1vdmUgaXQgZG93biBieSBvbmUgaW50ZXJ2YWwgdW5pdFxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIHAxLnggPSBwNC54ID0gMDtcclxuICAgICAgICBwMi54ID0gcDMueCA9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgcDEueSArPSBoZWlnaHRJbnRlcnZhbDtcclxuICAgICAgICBwMi55ICs9IGhlaWdodEludGVydmFsO1xyXG4gICAgICAgIHAzLnkgKz0gaGVpZ2h0SW50ZXJ2YWw7XHJcbiAgICAgICAgcDQueSArPSBoZWlnaHRJbnRlcnZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIEFzIHdlIGFyZSBnb2luZyB0byBjaGVjayBhZGphY2VudCB2ZXJ0aWNlc1xyXG4gICAgLy8gIGl0J3MgZWFzaWVyIHRvIHN0b3JlIGFsbCBkZWx0YSBpbmRleCB2YWx1ZXMgYW5kXHJcbiAgICAvLyAgbG9vcCBvdmVyIHRoZW1cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgZGkgPSBbLTEsIC0xLCAtMSwgIDAsICAxLCAxLCAxLCAwXSxcclxuICAgICAgICBkaiA9IFstMSwgIDAsICAxLCAgMSwgIDEsIDAsIC0xLCAtMV07XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQ29ubmVjdCBhbGwgYWRqYWNlbnQgdmVydGljZXNcclxuICAgIC8vICBhbmQgZ2V0IGFsbCBwcmltaXRpdmVzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAvLyAgS2VlcCBjb3VudCBvZiB0aGUgcG9pbnRzIHRoYXQgYXJlIGFjdHVhbGx5IHByb2Nlc3NlZFxyXG4gICAgICAgICAgICBsZXQgY250ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGxldCBmaXJzdFBvaW50LCBwcmV2UG9pbnQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGRpLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VyclBvaW50ID0gZ3JhcGguZ2V0KGkgKyBkaVtrXSwgaiArIGRqW2tdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VyclBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGguY29ubmVjdChpLCBqLCBpICsgZGlba10sIGogKyBkaltrXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY250Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbnQgPT09IDEpIHsgICAgLy8gIEFzc2lnbiBmaXJzdCBwb2ludFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFBvaW50ID0gY3VyclBvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJpbWl0aXZlcy5wdXNoKG5ldyB1dGlscy5Qb2x5Z29uKFsgICAvLyAgQWRkIHBvbHlnb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoLmdldChpLCBqKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZQb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQb2ludFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZQb2ludCA9IGN1cnJQb2ludDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgLy8gIENvbm5lY3QgdGhlIGZpcnN0IHBvaW50IHdpdGggdGhlXHJcbiAgICAgICAgICAgIC8vICBsYXN0IHBvaW50IGFuZCBhZGQgcG9seWdvblxyXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgaWYgKGZpcnN0UG9pbnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgcHJldlBvaW50ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgICFmaXJzdFBvaW50LmVxdWFsKHByZXZQb2ludCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByaW1pdGl2ZXMucHVzaChuZXcgdXRpbHMuUG9seWdvbihbXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGguZ2V0KGksIGopLFxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZQb2ludCxcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdFBvaW50XHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufTtcclxuXHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9nZW5lcmF0ZVByaW1pdGl2ZXMoKTtcclxufTtcclxuXHJcbi8vICBFeHBvcnQgYW4gb2JqZWN0IGZvciBkaXJlY3QgbG9va3VwXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgUG9seWdvbmFsOiBQb2x5Z29uYWxNb2RlXHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbW9kZXMuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKmpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbi8qXHJcbiAqIFVuZGlyZWN0ZWQgYWN5bGljIGdyYXBoIGRhdGEgc3RydWN0dXJlIHVzaW5nXHJcbiAqIGFkamFjZW55IG1hdHJpeCBhcyBpbXBsZW1lbnRhdGlvblxyXG4gKlxyXG4gKi9cclxuXHJcbi8qXHJcbiAqIEdyYXBoIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gcm93Q291bnQ6IFRoZSBudW1iZXIgb2Ygcm93c1xyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGNvbHVtbkNvdW50OiBUaGUgbnVtYmVyIG9mIGNvbHVtbnNcclxuICogQG9hcmFtIHtOb24tb2JqZWN0IHR5cGVzfSBpbml0aWFsVmFsdWUoT3B0aW9uYWwpOiBpbml0aWFsVmFsdWUgZm9yIGFsbCBlbGVtZW50cyBpbiB0aGUgZ3JhcGguIEl0J3MgMCBieSBkZWZhdWx0LlxyXG4gKi9cclxuZnVuY3Rpb24gR3JhcGgocm93Q291bnQsIGNvbHVtbkNvdW50LCBpbml0aWFsVmFsdWUpIHtcclxuICAgIHRoaXMuX3Jvd0NvdW50ID0gcm93Q291bnQgfHwgMDtcclxuICAgIHRoaXMuX2NvbHVtbkNvdW50ID0gY29sdW1uQ291bnQgfHwgMDtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIEFsbG9jYXRlIGFuIGVtcHR5IG1hdHJpeFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHRoaXMuX2RhdGEgPSBuZXcgQXJyYXkocm93Q291bnQpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YVtpXSA9IG5ldyBBcnJheShjb2x1bW5Db3VudCkuZmlsbChpbml0aWFsVmFsdWUgfHwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fZWRnZXMgPSB7fTtcclxufVxyXG5cclxuLypcclxuICogUHJpdmF0ZSBtZW1iZXIgZnVuY3Rpb24gLSBjaGVjayBpZiBhIHBhaXIgb2YgcG9zaXRpb25zIGlzIGluIHRoZSByYW5nZSBvZiByb3dzIGFuZCBjb2x1bW5zXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIHBhaXIgb2YgcG9zaXRpb25zIGlzIGluIHRoZSBib3VuZCBhbmQgZmFsc2UgaWYgbm90XHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuX2NoZWNrQm91bmQgPSBmdW5jdGlvbihpLCBqKSB7XHJcbiAgICBpZiAoaSA+PSB0aGlzLl9yb3dDb3VudCB8fFxyXG4gICAgICAgIGogPj0gdGhpcy5fY29sdW1uQ291bnQgfHxcclxuICAgICAgICBpIDwgMCB8fCBqIDwgMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIG1lbWJlciBmdW5jdGlvbiAtIGdldCBhbiBpZCBmcm9tIGEgcGFpciBvZiBwb3NpdGlvbnNcclxuICpcclxuICogQHJldHVybiB7U3RyaW5nfSBUaGUgaWQgb2YgdGhlIHBhaXIgb2YgcG9zaXRpb25zXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuX2dldElkID0gZnVuY3Rpb24oaSwgaikge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NoZWNrQm91bmQoaSwgaikgPyBpLnRvU3RyaW5nKCkgKyBqLnRvU3RyaW5nKCkgOiBudWxsO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIHJldHVybiB0aGUgY291bnQgb2Ygcm93c1xyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLnJvd0NvdW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcm93Q291bnQ7XHJcbn07XHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSByZXR1cm4gdGhlIGNvdW50IG9mIGNvbHVtbnNcclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5jb2x1bW5Db3VudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtbkNvdW50O1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGluc2VydCBhbiBlbGVtZW50IHRvIHRoZSBncmFwaFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGluc2VydGlvbiBpcyBzdWNjZXNzZnVsIGFuZCBmYWxzZSBpZiBub3RcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICogQHBhcmFtIHtBbnl9IHZhbHVlOiBUaGUgdmFsdWUgdG8gaW5zZXJ0XHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24oaSwgaiwgdmFsdWUpIHtcclxuICAgIGlmICh0aGlzLl9jaGVja0JvdW5kKGksIGopKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YVtpXVtqXSA9IHZhbHVlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gZ2V0IGEgZWxlbWVudCBmcm9tIGEgcGFpciBvZiBwb3NpdGlvblxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBbnkgLyBudWxsfSBUaGUgZWxlbWVudCBhdCB0aGUgcG9zaXRpb24gaWYgdGhlIHBhaXIgb2YgcG9zaXRpb25zIGlzIGluIHRoZSBib3VuZFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICBhbmQgbnVsbCBpZiBub3RcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpLCBqKSB7XHJcbiAgICBpZiAodGhpcy5fY2hlY2tCb3VuZChpLCBqKSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhW2ldW2pdO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBjaGVjayBpZiB0d28gdmVydGljZXMgYXJlIGNvbm5lY3RlZFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZXJlIGlzIGEgY29ubmVjdGlvbiBiZXR3ZWVuIHR3byBlbGVtZW50c1xyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGkxLCBpMjogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajEsIGoyOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5pc0Nvbm5lY3RlZCA9IGZ1bmN0aW9uKGkxLCBqMSwgaTIsIGoyKSB7XHJcbiAgICBpZiAoIXRoaXMuX2NoZWNrQm91bmQoaTEsIGoxKSB8fFxyXG4gICAgICAgICF0aGlzLl9jaGVja0JvdW5kKGkyLCBqMikpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB2YXIgaWQxID0gdGhpcy5fZ2V0SWQoaTEsIGoxKSxcclxuICAgICAgICBpZDIgPSB0aGlzLl9nZXRJZChpMiwgajIpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5fZWRnZXNbaWQxXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fZWRnZXNbaWQxXVtpZDJdO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGNvbm5lY3QgdGhlIGVkZ2Ugb2YgdHdvIHZlcnRpY2VzXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGFjdGlvbiBpcyBzdWNjZXNzZnVsXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTEsIGkyOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqMSwgajI6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbihpMSwgajEsIGkyLCBqMikge1xyXG4gICAgaWYgKCF0aGlzLl9jaGVja0JvdW5kKGkxLCBqMSkgfHxcclxuICAgICAgICAhdGhpcy5fY2hlY2tCb3VuZChpMiwgajIpKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgdmFyIGlkMSA9IHRoaXMuX2dldElkKGkxLCBqMSksXHJcbiAgICAgICAgaWQyID0gdGhpcy5fZ2V0SWQoaTIsIGoyKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMuX2VkZ2VzW2lkMV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5fZWRnZXNbaWQxXSA9IHt9O1xyXG4gICAgfVxyXG4gICAgdGhpcy5fZWRnZXNbaWQxXVtpZDJdID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBkaXNjb25uZWN0IHRoZSBlZGdlIG9mIHR3byB2ZXJ0aWNlc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBhY3Rpb24gaXMgc3VjY2Vzc2Z1bFxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGkxLCBpMjogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajEsIGoyOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24oaTEsIGoxLCBpMiwgajIpIHtcclxuICAgIGlmICghdGhpcy5fY2hlY2tCb3VuZChpMSwgajEpIHx8XHJcbiAgICAgICAgIXRoaXMuX2NoZWNrQm91bmQoaTIsIGoyKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHZhciBpZDEgPSB0aGlzLl9nZXRJZChpMSwgajEpLFxyXG4gICAgICAgIGlkMiA9IHRoaXMuX2dldElkKGkyLCBqMik7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLl9lZGdlc1tpZDFdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fZWRnZXNbaWQxXVtpZDJdID0gZmFsc2U7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vLyAgRXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cyA9IEdyYXBoO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2dyYXBoLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==