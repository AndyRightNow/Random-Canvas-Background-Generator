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
	    back.generate();
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
	    this._density = density;
	};
	/*
	 * Public member function - return the density of polygons
	 *
	 * @return {float} density
	 */
	PolygonalMode.prototype.setDensity = function() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjJkM2FhZjZjNjM4OGMwMDI5OTYiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sb3JVdGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDdkRBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVyxNQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7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QTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQVksUUFBUTtBQUNwQixZQUFXLFFBQVE7QUFDbkIsWUFBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLFFBQVE7QUFDcEIsWUFBVyxRQUFRO0FBQ25CLFlBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiJodG1sVGVzdC5kaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA2MmQzYWFmNmM2Mzg4YzAwMjk5NlxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi8uLi8uLi9zcmMvdmVjdG9yJyk7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vc3JjL3V0aWxzJyk7XHJcbnZhciBSYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yID0gcmVxdWlyZSgnLi8uLi8uLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvcicpO1xyXG5cclxudmFyIGh0bWxUZXN0ID0ge307XHJcblxyXG5odG1sVGVzdC5ydW4gPSBmdW5jdGlvbihjYW52YXNJZCl7XHJcbiAgICB2YXIgYmFjayA9IG5ldyBSYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yKCdjYW52YXMnLCAnUG9seWdvbmFsJywgJyM4N0QzN0MnLCAnIzkwQzY5NScsICcjNDE4M0Q3Jyk7XHJcbiAgICBiYWNrLmdldE1vZGUoKS5zZXREZW5zaXR5KDEpO1xyXG4gICAgYmFjay5nZW5lcmF0ZSgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBodG1sVGVzdDtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3Rlc3QvaHRtbFRlc3QvaHRtbFRlc3QuanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxyXG4gKiAgICAgICAgICAgICAgVmVjdG9yIENsYXNzXHJcbiAqXHJcbiAqICAgICAgVmVjdG9yIGFuZCB2ZWN0b3Igb3BlcmF0aW9ucy5cclxuICovXHJcblxyXG4vKlxyXG4gKiAgQ29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIFZlY3Rvcih4LCB5KXtcclxuXHR0aGlzLnggPSB4IHx8IDA7XHJcblx0dGhpcy55ID0geSB8fCAwO1xyXG59XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmVxdWFsID0gZnVuY3Rpb24odmVjKSB7XHJcblx0cmV0dXJuIHRoaXMueCA9PT0gdmVjLnggJiYgdGhpcy55ID09PSB2ZWMueTtcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odil7XHJcblx0cmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueTtcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUubGVuMiA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMuZG90KHRoaXMpO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5sZW4gPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBNYXRoLnNxcnQodGhpcy5sZW4yKCkpO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uKHN4LCBzeSl7XHJcblx0dGhpcy54ICo9IHN4O1xyXG5cdHRoaXMueSAqPSBzeSB8fCBzeDtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24odil7XHJcblx0dGhpcy54IC09IHYueDtcclxuXHR0aGlzLnkgLT0gdi55O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHRObyBzaWRlIGVmZmVjdCBhbmQgY2hhaW5pbmdcclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblZlY3Rvci5wcm90b3R5cGUucHJvamVjdCA9IGZ1bmN0aW9uKGF4aXMpe1xyXG5cdHZhciBjb2YgPSAgdGhpcy5kb3QoYXhpcykgLyBheGlzLmxlbjIoKTtcclxuXHRyZXR1cm4gYXhpcy5zY2FsZShjb2YpO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5wcm9qZWN0TiA9IGZ1bmN0aW9uKGF4aXMpe1xyXG5cdHZhciBjb2YgPSAgdGhpcy5kb3QoYXhpcyk7XHJcblx0cmV0dXJuIGF4aXMuc2NhbGUoY29mKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3ZlY3Rvci5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi92ZWN0b3InKTtcclxuXHJcbi8qXHJcbiAqXHRQb2x5Z29uIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50czogVGhlIHBvaW50cyBvZiB0aGUgcG9seWdvbi4gVGhleSBtdXN0IGJlIGluIGNsb2Nrd2lzZSBvciBjb3VudGVyLWNsb2Nrd2lzZSBvcmRlclxyXG4gKi9cclxuZnVuY3Rpb24gUG9seWdvbihwb2ludHMpIHtcclxuICAgIHRoaXMuX3BvaW50cyA9IHBvaW50cyB8fCBbXTtcclxufVxyXG5Qb2x5Z29uLnByb3RvdHlwZSA9IHtcclxuICAgIGdldCBwb2ludHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50cztcclxuICAgIH0sXHJcblxyXG4gICAgc2V0IHBvaW50cyhwb2ludHMpIHtcclxuICAgICAgICB0aGlzLl9wb2ludHMgPSBwb2ludHM7XHJcbiAgICB9LFxyXG5cclxuICAgIGVxdWFsOiBmdW5jdGlvbihwb2x5Z29uKSB7XHJcbiAgICAgICAgdmFyIHJldmVyc2VkID0gcG9seWdvbi5wb2ludHM7XHJcbiAgICAgICAgcmV2ZXJzZWQucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludHMuZXZlcnkoZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuZXF1YWwocG9seWdvbi5wb2ludHNbaW5kZXhdKTtcclxuICAgICAgICB9KSB8fCB0aGlzLnBvaW50cy5ldmVyeShmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5lcXVhbChyZXZlcnNlZFtpbmRleF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLypcclxuICogIENsYW1wIGEgbnVtYmVyIHdpdGhpbiBhIHJhbmdlXHJcbiAqL1xyXG5mdW5jdGlvbiBjbGFtcCh4LCBsb3dlciwgdXBwZXIpe1xyXG4gICAgcmV0dXJuIHggPCBsb3dlciA/IGxvd2VyIDogeCA+IHVwcGVyID8gdXBwZXIgOiB4O1xyXG59XHJcblxyXG4vKlxyXG4gKlx0R2V0IGEgcmFuZG9tIG51bWJlciBmcm9tIGEgcmFuZ2VcclxuICpcclxuICpcdEByZXR1cm4ge2ludCAvIGZsb2F0fSBBIHJhbmRvbWx5IGdlbmVyYXRlZCBudW1iZXIgd2l0aGluIGEgcmFuZ2VcclxuICpcdEBwYXJhbSB7aW50IC8gZmxvYXR9IGxvd2VyOiBUaGUgbG93ZXIgYm91bmQgb2YgdGhlIHJhbmdlKEluY2x1c2l2ZSlcclxuICpcdEBwYXJhbSB7aW50IC8gZmxvYXR9IHVwcGVyOiBUaGUgdXBwZXIgYm91bmQgb2YgdGhlIHJhbmdlKEV4Y2x1c2l2ZSlcclxuICpcdEBwYXJhbSB7Ym9vbGVhbn0gaXNJbnQ6IFRoZSBmbGFnIHRvIHNwZWNpZnkgd2hldGhlciB0aGUgcmVzdWx0IGlzIGludCBvciBmbG9hdFxyXG4gKi9cclxuIGZ1bmN0aW9uIGdldFJhbmRvbU51bWJlckZyb21SYW5nZShsb3dlciwgdXBwZXIsIGlzSW50KSB7XHJcbiAgICAgaWYgKGxvd2VyID49IHVwcGVyKSByZXR1cm4gMDtcclxuICAgICBpc0ludCA9IGlzSW50IHx8IHRydWU7XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvL1x0U29tZSByYW5kb20gbnVtYmVycyBqdXN0IGNvbWluZyBvdXQgb2Ygbm93aGVyZVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdmFyIHNvbWVSYW5kb21OdW1iZXIxID0gMTI4NSxcclxuICAgICAgICBzb21lUmFuZG9tTnVtYmVyMiA9IDIzOTE7XHJcblxyXG4gICAgLy9cdEdlbmVyYXRlIHRoZSBpbnRlZ2VyIHBhcnRcclxuICAgIHZhciByYW5kb21JbnQgPVxyXG4gICAgICAgIHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBzb21lUmFuZG9tTnVtYmVyMSAqIE1hdGgucmFuZG9tKCkgKiBzb21lUmFuZG9tTnVtYmVyMikgJSAodXBwZXIgLSBsb3dlcik7XHJcblxyXG4gICAgaWYgKGlzSW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGxvd2VyICsgcmFuZG9tSW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbG93ZXIgKyByYW5kb21JbnQgKyBNYXRoLnJhbmRvbSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG4gKiAgR2V0IGEgcmFuZG9tIHBvaW50IG9uIGEgcmVjdGFuZ2xlXHJcbiAqXHJcbiAqXHRAcGFyYW0ge1ZlY3Rvcn0gcDEsIHAyLCBwMywgcDQ6IFBvaW50cyBvZiBhIHJlY3RhbmdsZSBzdGFydGluZ1xyXG4gKlx0XHRcdFx0XHRcdFx0XHQgICBmcm9tIHRoZSB0b3AgbGVmdCBjb3JuZXIgYW5kIGdvaW5nXHJcbiAqXHRcdFx0XHRcdFx0XHRcdCAgIGNsb2Nrd2lzZS5cclxuICpcdEBwYXJhbSB7Ym9vbGVhbn0gaXNJbnQ6IFRoZSBmbGFnIHRvIHNwZWNpZnkgd2hldGhlciB0aGUgcmVzdWx0IGlzIGludCBvciBmbG9hdFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmFuZG9tUG9pbnRPblJlY3QocDEsIHAyLCBwMywgcDQsIGlzSW50KSB7XHJcbiAgICBpc0ludCA9IGlzSW50IHx8IHRydWU7XHJcbiAgICB2YXIgd2lkdGggPSBNYXRoLmFicyhwMi54IC0gcDEueCksXHJcbiAgICAgICAgaGVpZ2h0ID0gTWF0aC5hYnMocDMueSAtIHAyLnkpLFxyXG4gICAgICAgIHRvcExlZnRYID0gTWF0aC5taW4ocDEueCwgcDIueCwgcDMueCwgcDQueCksXHJcbiAgICAgICAgdG9wTGVmdFkgPSBNYXRoLm1pbihwMS55LCBwMi55LCBwMy55LCBwNC55KTtcclxuXHJcbiAgICB2YXIgcmFuZG9tRGVsdGFYID0gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIHdpZHRoLCBpc0ludCksXHJcbiAgICAgICAgcmFuZG9tRGVsdGFZID0gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIGhlaWdodCwgaXNJbnQpO1xyXG5cclxuICAgIHJldHVybiBuZXcgVmVjdG9yKHRvcExlZnRYICsgcmFuZG9tRGVsdGFYLCB0b3BMZWZ0WSArIHJhbmRvbURlbHRhWSk7XHJcbn1cclxuXHJcbi8qXHJcbiAqICBHZXQgYSByYW5kb20gcG9pbnQgb24gYSBsaW5lXHJcbiAqICBAcGFyYW0ge1ZlY3Rvcn0gcDEsIHAyOiBQb2ludHMgb2YgYSBsaW5lIGZyb20gbGVmdCB0byByaWdodFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmFuZG9tUG9pbnRPbkxpbmUocDEsIHAyKSB7XHJcbiAgICB2YXIgcHJvamVjdGlvbldpZHRoID0gTWF0aC5hYnMocDEueCAtIHAyLngpLFxyXG4gICAgICAgIGxlZnRYID0gTWF0aC5taW4ocDEueCwgcDIueCk7XHJcblxyXG4gICAgdmFyIEEgPSAocDEueSAtIHAyLnkpIC8gKHAxLnggLSBwMi54KSxcclxuICAgICAgICBCID0gcDEueSAtIEEgKiBwMS54O1xyXG5cclxuICAgIHZhciByYW5kb21EZWx0YVggPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgcHJvamVjdGlvbldpZHRoLCBmYWxzZSk7XHJcbiAgICByZXR1cm4gbmV3IFZlY3RvcihsZWZ0WCArIHJhbmRvbURlbHRhWCwgQSAqIChsZWZ0WCArIHJhbmRvbURlbHRhWCkgKyBCKTtcclxufVxyXG5cclxuLypcclxuICogSGVscGVyIGZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlIGluaGVyaXRhbmNlXHJcbiAqXHJcbiAqIEByZXR1cm4gbm9uZVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdG9yOiBUaGUgY29uc3RydWN0b3Igb2YgdGhlIGN1cnJlbnQgb2JqZWN0XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN1cGVyQ3RvcjogVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBwYXJlbnQgb2JqZWN0XHJcbiAqL1xyXG4gZnVuY3Rpb24gaW5oZXJpdChjdG9yLCBzdXBlckN0b3IpIHtcclxuICAgICBjdG9yLl9zdXBlciA9IHN1cGVyQ3RvcjtcclxuICAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xyXG4gICAgICAgICBjb25zdHJ1Y3Rvcjoge1xyXG4gICAgICAgICAgICAgdmFsdWU6IGN0b3IsXHJcbiAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgIH1cclxuICAgICB9KTtcclxuIH1cclxuXHJcbi8vICBFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzLlBvbHlnb24gPSBQb2x5Z29uO1xyXG5tb2R1bGUuZXhwb3J0cy5jbGFtcCA9IGNsYW1wO1xyXG5tb2R1bGUuZXhwb3J0cy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UgPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2U7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbVBvaW50T25SZWN0ID0gZ2V0UmFuZG9tUG9pbnRPblJlY3Q7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbVBvaW50T25MaW5lID0gZ2V0UmFuZG9tUG9pbnRPbkxpbmU7XHJcbm1vZHVsZS5leHBvcnRzLmluaGVyaXQgPSBpbmhlcml0O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG4vKlxyXG4gKiBSYW5kb20gQ2FudmFzIEJhY2tncm91bmQgR2VuZXJhdG9yXHJcbiAqXHJcbiAqIEl0J3MgdXNlZCBvbiBIVE1MIENhbnZhcyB0byBnZW5lcmF0ZSByYW5kb20gYmFja2dyb3VuZCBpbiBhIGNlcnRhaW4gcGF0dGVyblxyXG4gKiB3aXRoIGNlcnRhaW4gY3VzdG9taXplZCBwYXJhbWV0ZXJzIGFuZCBtb2Rlcy4gVGhlIGJhY2tncm91bmRcclxuICogd2lsbCB1cGRhdGUgZXZlcnkgdGltZSB5b3UgY2FsbCBnZW5lcmF0ZSgpXHJcbiAqXHJcbiAqL1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHREZXBlbmRlbmNpZXNcclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxudmFyIGNvbG9yVXRpbHMgPSByZXF1aXJlKCcuL2NvbG9yVXRpbHMnKTtcclxudmFyIFZlY3RvciA9IHJlcXVpcmUoJy4vdmVjdG9yJyk7XHJcbnZhciBNb2RlcyA9IHJlcXVpcmUoJy4vbW9kZXMnKTtcclxuXHJcbi8qXHJcbipcdENvbnN0YW50IHN0cmluZyBuYW1lXHJcbiovXHJcbmNvbnN0IFBPTFlHT05BTCA9IFwiUG9seWdvbmFsXCI7XHJcblxyXG4vKlxyXG4qIENvbnN0cnVjdG9yXHJcbipcclxuKiBAcGFyYW0ge3N0cmluZ30gY2FudmFzSWQ6IFRoZSBpZCBvZiB0aGUgY2FudmFzIHlvdSB3YW50IHRvIGdlbmVyYXRlIGJhY2tncm91bmQgb25cclxuKiBAcGFyYW0ge3N0cmluZ30gbW9kZTogVGhlIHBhdHRlcm4gaW4gd2hpY2ggdGhlIGJhY2tncm91bmQgaXMgZ2VuZXJhdGVkLlxyXG4qXHRcdFx0XHRcdFx0IEN1cnJlbnRseSBTdXBwb3J0OiAxLiBcIlBvbHlnb25hbFwiXHJcbiogQHBhcmFtIHtTdHJpbmcoQXJncyl9IGJhc2VDb2xvcnM6IGEgc2V0IG9mIHZhcmlhYmxlIG51bWJlciBvZiBjb2xvciBzdHJpbmdzIHVzZWRcclxuKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXMgdGhlIGJhc2UgY29sb3JzIG9mIHRoZSBiYWNrZ3JvdW5kXHJcbiovXHJcbmZ1bmN0aW9uIFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IoY2FudmFzSWQsIG1vZGUsIGJhc2VDb2xvcnMpIHtcclxuXHQvL1x0SW5pdGlhbGl6ZVxyXG5cdHRoaXMuX2NhbnZhcyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCkgOiBudWxsO1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQgPSB0aGlzLl9jYW52YXMgPyB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKSA6IG51bGw7XHJcblx0dGhpcy5fbW9kZU5hbWUgPSBtb2RlIHx8IFBPTFlHT05BTDtcclxuXHR0aGlzLl9tb2RlID0gbnVsbDtcclxuXHJcblx0aWYgKHRoaXMuX2NhbnZhcykge1x0Ly9cdElmIGNhbnZhcyBlbGVtZW50IGV4aXN0c1xyXG5cdFx0dGhpcy5fbW9kZSA9IG5ldyBNb2Rlc1t0aGlzLl9tb2RlTmFtZV0oMC42LFxyXG5cdFx0XHR0aGlzLl9jYW52YXMuY2xpZW50V2lkdGgsXHJcblx0XHRcdHRoaXMuX2NhbnZhcy5jbGllbnRIZWlnaHQpO1xyXG5cclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1x0Ly9cdElmIGFueSBjb2xvciBpcyBwcm92aWVkZVxyXG5cdFx0XHR0aGlzLl9tb2RlLnNldEJhc2VDb2xvcnMuYXBwbHkodGhpcy5fbW9kZSwgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDIsIGFyZ3VtZW50cy5sZW5ndGgpKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IucHJvdG90eXBlLmdldE1vZGUgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fbW9kZTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIGhlbHBlciBmdW5jdGlvbiB1c2VkIHRvIGRyYXcgcG9seWdvbiBvbiB0aGUgY2FudmFzXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogQSBIRVgsIFJHQiBvciBSR0JBIGNvbG9yIGluIHRoZSBmb3JtIG9mXHJcbiAqXHRcdFx0XHRcdFx0ICAgXCIjMDAwMDAwXCIsIFwicmdiKDAsIDAsIDApXCIgb3IgXCJyZ2JhKDAsIDAsIDAsIDEpXCJcclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzOiBBbiBhcnJheSBvZiBQb2ludCBvYmplY3RzXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZ3JhZGllbnQ6IEEgZmxhZyBpbmRpY2F0aW5nIGlmIGxpbmVhci1ncmFkaWVudCBpcyBlbmFibGVkLlxyXG4gKlx0XHRcdFx0XHRcdFx0ICAgVGhlIGdyYWRpZW50IHdpbGwgYmUgcmFuZG9tbHkgZ2VuZXJhdGVkLlxyXG4gKlxyXG4gKi9cclxuUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5wcm90b3R5cGUuX2ZpbGxQb2x5Z29uID0gZnVuY3Rpb24oY29sb3IsIHBvbHlnb24sIGdyYWRpZW50KSB7XHJcblx0Z3JhZGllbnQgPSBncmFkaWVudCB8fCBmYWxzZTtcclxuXHJcblx0Ly9cdFNhdmUgdGhlIHByZXZpb3VzIHN0YXRlc1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuc2F2ZSgpO1xyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8vXHRTZXQgdGhlIGNvbG9yXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRpZiAoZ3JhZGllbnQpIHtcclxuXHRcdGlmIChwb2x5Z29uLnBvaW50cy5sZW5ndGggPT09IDMpIHtcdC8vXHRJZiBpdCdzIGEgdHJpYW5nbGVcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdC8vXHRTdGFydCBhbmQgZW5kIHBvaW50cyBvZiB0aGUgbGluZWFyIGdyYWRpZW50XHJcblx0XHRcdC8vXHRUaGUgc3RhcnQgcG9pbnQgaXMgcmFuZG9tbHkgc2VsZWN0ZWRcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdGxldCBzdGFydFBvaW50ID0gcG9seWdvbi5wb2ludHNbdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIHBvbHlnb24ucG9pbnRzLmxlbmd0aCldO1xyXG5cdFx0XHRsZXQgZW5kUG9pbnQ7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ly9cdEZldGNoIHBvaW50cyBvdGhlciB0aGFuIHRoZSBzdGFydCBwb2ludFxyXG5cdFx0XHQvL1x0b3V0IG9mIHRoZSBwb2x5Z29uXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgaW5kZXggPSBwb2x5Z29uLnBvaW50cy5pbmRleE9mKHN0YXJ0UG9pbnQpO1xyXG5cdFx0XHRsZXQgbGluZSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBvbHlnb24ucG9pbnRzLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdGlmIChpICE9PSBpbmRleCkgbGluZS5wdXNoKHBvbHlnb24ucG9pbnRzW2ldKTtcclxuXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0UHJvamVjdCB0aGUgc3RhcnQgcG9pbnQgdG8gdGhlIGxpbmVcclxuXHRcdFx0Ly9cdGl0J3MgZmFjaW5nIGFuZCB0aGF0J3MgdGhlIGVuZCBwb2ludFxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0bGV0IGF4aXMgPSBuZXcgVmVjdG9yKGxpbmVbMF0ueCAtIGxpbmVbMV0ueCwgbGluZVswXS55IC0gbGluZVsxXS55KTtcclxuXHRcdFx0ZW5kUG9pbnQgPSBzdGFydFBvaW50LnByb2plY3QoYXhpcyk7XHJcblxyXG5cdFx0XHQvL1x0Q3JlYXRlIHRoZSBsaW5lYXIgZ3JhZGllbnQgb2JqZWN0XHJcblx0XHRcdGxldCBncmFkID0gdGhpcy5fY2FudmFzQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcclxuXHRcdFx0XHRzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0R2V0IHJhbmRvbSBsaW5lYXIgZ3JhZGllbnQgY29sb3JzXHJcblx0XHRcdC8vXHRhbmQgYWRkIGNvbG9yc1xyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgcmFuZG9tSW50ZW5zaXR5ID0gTWF0aC5yYW5kb20oKSArIDEgKiAwLjU7XHJcblx0XHRcdGxldCBncmFkQ29sb3JzID0gY29sb3JVdGlscy5yYW5kb21HcmFkaWVudChjb2xvclV0aWxzLnJhbmRvbUNvbG9yKGNvbG9yKSwgcmFuZG9tSW50ZW5zaXR5KTtcclxuXHRcdFx0Z3JhZC5hZGRDb2xvclN0b3AoMCwgZ3JhZENvbG9ycy5maXJzdCk7XHJcblx0XHRcdGdyYWQuYWRkQ29sb3JTdG9wKDEsIGdyYWRDb2xvcnMuc2Vjb25kKTtcclxuXHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gZ3JhZDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ly9cdERyYXcgdGhlIHBvbHlnb25cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5iZWdpblBhdGgoKTtcclxuXHR2YXIgcG9pbnRzID0gcG9seWdvbi5wb2ludHM7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQubW92ZVRvKHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmxpbmVUbyhwb2ludHNbaV0ueCwgcG9pbnRzW2ldLnkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbCgpO1xyXG5cclxuXHQvL1x0UmVzdG9yZSBwcmV2aW91cyBzdGF0ZXNcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LnJlc3RvcmUoKTtcclxufTtcclxuXHJcblJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oKXtcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLl9jYW52YXMuY2xpZW50V2lkdGgsIHRoaXMuX2NhbnZhcy5jbGllbnRIZWlnaHQpO1xyXG5cclxuXHR0aGlzLl9tb2RlLmdlbmVyYXRlKCk7XHJcblxyXG5cdHZhciBwcmltaXRpdmVzID0gdGhpcy5fbW9kZS5nZXRQcmltaXRpdmVzKCk7XHJcblx0dmFyIGJhc2VDb2xvcnMgPSB0aGlzLl9tb2RlLmdldEJhc2VDb2xvcnMoKTtcclxuXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcmltaXRpdmVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcmFuZENvbG9yID0gYmFzZUNvbG9yc1t1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgYmFzZUNvbG9ycy5sZW5ndGgpXTtcclxuXHRcdHRoaXMuX2ZpbGxQb2x5Z29uKHJhbmRDb2xvciwgcHJpbWl0aXZlc1tpXSwgdHJ1ZSk7XHJcblx0fVxyXG59O1xyXG5cclxuLy9cdEV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMgPSBSYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL1JhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcblxyXG4vKlxyXG4gKiAgQ2hlY2sgaWYgYSBzdHJpbmcgaXMgaW4gYSBoZXggY29sb3IgZm9ybWF0XHJcbiAqICBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBzdHJpbmcgaXMgaW4gYSBoZXggZm9ybWF0XHJcbiAqICBAcGFyYW0ge3N0cmluZ30gY29sb3I6IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb2xvclxyXG4gKi9cclxuZnVuY3Rpb24gaXNIZXgoY29sb3IpIHtcclxuICAgIHJldHVybiAvI1thLWYwLTldezZ9L2dpLnRlc3QoY29sb3IpO1xyXG59XHJcblxyXG4vKlxyXG4gKiAgQ2hlY2sgaWYgYSBzdHJpbmcgaXMgaW4gYSByZ2IgY29sb3IgZm9ybWF0XHJcbiAqICBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBzdHJpbmcgaXMgaW4gYSByZ2IgZm9ybWF0XHJcbiAqICBAcGFyYW0ge3N0cmluZ30gY29sb3I6IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb2xvclxyXG4gKi9cclxuIGZ1bmN0aW9uIGlzUmdiKGNvbG9yKSB7XHJcbiAgICAvLyAgRWxpbWluYXRlIHdoaXRlIHNwYWNlc1xyXG4gICAgY29sb3IgPSBjb2xvci5yZXBsYWNlKC9cXHMvZywgXCJcIik7XHJcbiAgICByZXR1cm4gL3JnYlxcKFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcKS9pLnRlc3QoY29sb3IpO1xyXG59XHJcbiAvKlxyXG4qICBDaGVjayBpZiBhIHN0cmluZyBpcyBpbiBhIHJnYmEgY29sb3IgZm9ybWF0XHJcbiogIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHN0cmluZyBpcyBpbiBhIHJnYmEgZm9ybWF0XHJcbiogIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogVGhlIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGNvbG9yXHJcbiovXHJcbmZ1bmN0aW9uIGlzUmdiYShjb2xvcikge1xyXG4gLy8gIEVsaW1pbmF0ZSB3aGl0ZSBzcGFjZXNcclxuIGNvbG9yID0gY29sb3IucmVwbGFjZSgvXFxzL2csIFwiXCIpO1xyXG4gcmV0dXJuIC9yZ2JhXFwoW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCkvaS50ZXN0KGNvbG9yKTtcclxuXHJcbn1cclxuXHJcbi8qXHJcbiAqXHRDb252ZXJ0IGhleCBjb2xvciB0byByZ2IgY29sb3JcclxuICogIEByZXR1cm4ge3N0cmluZyAvIG51bGx9IENvbnZlcnRlZCBjb2xvciBzdHJpbmcgb3IgbnVsbCBpZiB0aGUgaW5wdXQgaXMgaW52YWxpZFxyXG4gKi9cclxuZnVuY3Rpb24gaGV4VG9SZ2IoaGV4KSB7XHJcbiAgICBpZiAoaXNIZXgoaGV4KSkge1xyXG4gICAgICAgIHJldHVybiBcInJnYihcIiArXHJcbiAgICAgICAgcGFyc2VJbnQoaGV4LnN1YnN0cigxLCAyKSwgMTYpICsgXCIsIFwiICtcclxuICAgICAgICBwYXJzZUludChoZXguc3Vic3RyKDMsIDIpLCAxNikgKyBcIiwgXCIgK1xyXG4gICAgICAgIHBhcnNlSW50KGhleC5zdWJzdHIoNSwgMiksIDE2KSArIFwiKVwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gaXNSZ2IoaGV4KSB8fCBpc1JnYmEoaGV4KSA/IGhleCA6IG51bGw7XHJcbn1cclxuXHJcbi8qXHJcbiAqXHRBZGp1c3QgdGhlIGJyaWdodG5lc3Mgb2YgYSBjb2xvciBieSBwZXJjZW50YWdlXHJcbiAqICBAcGFyYW0ge3N0cmluZ30gY29sb3I6IFRoZSBjb2xvciBzdHJpbmdcclxuICogIEBwYXJhbSB7ZmxvYXR9IHBlcmNlbnRhZ2U6IEEgZmxvYXQgd2l0aGluIFstMSwgMV0gYnkgd2hpY2ggdGhlIGJyaWdodG5lc3MgaXMgYWRqdXN0ZWQuXHJcbiAqXHRcdFx0XHRcdFx0XHQgICAxIG1lYW5zIG1heGltdW0gZGFya25lc3MgYW5kIC0xIG1lYW5zIG1heGltdW0gYnJpZ2h0bmVzcy5cclxuICovXHJcbmZ1bmN0aW9uIGFkanVzdENvbG9yQnJpZ2h0bmVzcyhjb2xvciwgcGVyY2VudGFnZSkge1xyXG4gICAgcGVyY2VudGFnZSA9IHBlcmNlbnRhZ2UgfHwgMDtcclxuICAgIGNvbG9yID0gaGV4VG9SZ2IoY29sb3IpO1xyXG5cclxuICAgIGlmIChjb2xvciAhPT0gbnVsbCkge1xyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vXHRVc2UgZGlmZmVyZW50IHJlZ2V4IGFuZCBmb3JtYXRzIGZvciByZ2IgYW5kIHJnYmFcclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICB2YXIgcmVneCA9IGlzUmdiKGNvbG9yKSA/XHJcbiAgICAgICAgICAgIC9bXFxkXXsxLDN9Wy5dP1tcXGRdKi9naSA6IC9bXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLC9naTtcclxuICAgICAgICB2YXIgcG9zdGZpeCA9IGlzUmdiKGNvbG9yKSA/ICcnIDogJywnO1xyXG5cclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvLyAgUmVwbGFjZSB0aGUgciwgZyBhbmQgYiB3aXRoIGFkanVzdGVkIG51bWJlcnMgYW5kXHJcbiAgICAgICAgLy8gIHJvdW5kIHRoZW0gdG8gaW50ZWdlcnNcclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICByZXR1cm4gY29sb3IucmVwbGFjZShyZWd4LCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQodXRpbHMuY2xhbXAoKHBhcnNlSW50KGUpICogKDEgLSBwZXJjZW50YWdlKSksIDAsIDI1NSkpXHJcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoKSArIHBvc3RmaXg7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8qXHJcbiAqICBGdW5jdGlvbiB0byBnZW5lcmF0ZSByYW5kb20gY29sb3Igd2l0aCByYW5kb20gYnJpZ2h0bmVzc1xyXG4gKiAgYmFzZWQgb24gYSBnaXZlbiBjb2xvclxyXG4gKlxyXG4gKlx0QHJldHVybiB7c3RyaW5nfSBBIHN0cmluZyBvZiBnZW5lcmF0ZWQgY29sb3JcclxuICogIEBwYXJhbSB7c3RyaW5nfSBiYXNlQ29sb3I6IEEgY29sb3Igc3RyaW5nIGluIEhFWCwgUkdCIG9yIFJHQkFcclxuICpcdEBwYXJhbSB7ZmxvYXR9IGJyaWdodG5lc3NJbnRlbnNpdHkoT3B0aW9uYWwpOiBUaGUgYnJpZ2h0bmVzcyBpbnRlbnNpdHkgd2l0aGluIFswLCAxXSB0byBnZW5lcmF0ZVxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgYXJvdW5kLiAwIG1lYW5zIGdlbmVyYXRlIGFyb3VuZCAwIGJyaWdodG5lc3MgY2hhbmdlcyxcclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIDAuNSBtZWFucyBnZW5lcmF0ZSBhcm91bmQgNTAlIGJyaWdodG5lc3MgY2hhbmdlcyBhbmRcclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIDEgbWVhbnMgZ2VuZXJhdGUgYXJvdW5kIG1heGltdW0gYnJpZ2h0bmVzcyBjaGFuZ2VzLlxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgVGhlIGJyaWdodG5lc3MgY2hhbmdlcyB3aWxsIGJlIGVpdGhlciBkcmFrZW5pbmcgb3IgYnJpZ2h0ZW5pbmcuXHJcbiAqL1xyXG4gZnVuY3Rpb24gcmFuZG9tQ29sb3IoYmFzZUNvbG9yLCBicmlnaHRuZXNzSW50ZW5zaXR5KXtcclxuICAgICBicmlnaHRuZXNzSW50ZW5zaXR5ID0gYnJpZ2h0bmVzc0ludGVuc2l0eSB8fCAwLjU7XHJcbiAgICAgdmFyIHRocmVzaG9sZCA9IDAuMixcclxuICAgICAgICAgcmFuZ2VMb3dlciA9IHV0aWxzLmNsYW1wKGJyaWdodG5lc3NJbnRlbnNpdHkgLSB0aHJlc2hvbGQsIDAsIDEpLFxyXG4gICAgICAgICByYW5nZVVwcGVyID0gdXRpbHMuY2xhbXAoYnJpZ2h0bmVzc0ludGVuc2l0eSArIHRocmVzaG9sZCwgMCwgMSk7XHJcblxyXG4gICAgIC8vXHRVc2VkIHRvIGdldCBhIGVpdGhlciBuZWdhdGl2ZSBvciBwb3NpdGl2ZSByYW5kb20gbnVtYmVyXHJcbiAgICAgdmFyIHJhbmRvbUFyciA9IFtcclxuICAgICAgICAgdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKHJhbmdlTG93ZXIsIHJhbmdlVXBwZXIsIGZhbHNlKSxcclxuICAgICAgICAgdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKC1yYW5nZUxvd2VyLCAtcmFuZ2VVcHBlciwgZmFsc2UpXTtcclxuXHJcbiAgICAgLy9cdENvbG9yIHZhbGlkaXR5IGNoZWNraW5nIGluIGFkanVzdENvbG9yQnJpZ2h0bmVzc1xyXG4gICAgIHJldHVybiBhZGp1c3RDb2xvckJyaWdodG5lc3MoYmFzZUNvbG9yLCByYW5kb21BcnJbdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIDIpXSk7XHJcbiB9XHJcblxyXG4vKlxyXG4gKiAgRnVuY3Rpb24gdG8gZ2VuZXJhdGUgcmFuZG9tIGdyYWRpZW50IGNvbG9yIHdpdGggcmFuZG9tIGJyaWdodG5lc3Mgb24gYm90aCBzaWRlc1xyXG4gKiAgb2YgdGhlIGxpbmVhciBncmFkaWVudCBiYXNlZCBvbiBhIGdpdmVuIGNvbG9yXHJcbiAqXHJcbiAqXHRAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBwYWlyIG9mIGNvbG9yc1xyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGJhc2VDb2xvcjogQSBjb2xvciBzdHJpbmcgaW4gSEVYLCBSR0Igb3IgUkdCQVxyXG4gKlx0QHBhcmFtIHtmbG9hdH0gYnJpZ2h0bmVzc0ludGVuc2l0eShPcHRpb25hbCk6IFRoZSBicmlnaHRuZXNzIGludGVuc2l0eSB3aXRoaW4gWzAsIDFdIHRvIGdlbmVyYXRlXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBhcm91bmQuIFRoZSBzYW1lIGFzIHRoZSBvbmUgaW4gcmFuZG9tQ29sb3JcclxuICovXHJcbiBmdW5jdGlvbiByYW5kb21HcmFkaWVudChiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpIHtcclxuICAgICBicmlnaHRuZXNzSW50ZW5zaXR5ID0gYnJpZ2h0bmVzc0ludGVuc2l0eSB8fCAwLjU7XHJcbiAgICAgcmV0dXJuIHtcclxuICAgICAgICAgZmlyc3Q6IHJhbmRvbUNvbG9yKGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSksXHJcbiAgICAgICAgIHNlY29uZDogcmFuZG9tQ29sb3IoYmFzZUNvbG9yLCBicmlnaHRuZXNzSW50ZW5zaXR5KVxyXG4gICAgIH07XHJcbiB9XHJcblxyXG4vLyAgRXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cy5pc0hleCA9IGlzSGV4O1xyXG5tb2R1bGUuZXhwb3J0cy5pc1JnYiA9IGlzUmdiO1xyXG5tb2R1bGUuZXhwb3J0cy5pc1JnYmEgPSBpc1JnYmE7XHJcbm1vZHVsZS5leHBvcnRzLmhleFRvUmdiID0gaGV4VG9SZ2I7XHJcbm1vZHVsZS5leHBvcnRzLmFkanVzdENvbG9yQnJpZ2h0bmVzcyA9IGFkanVzdENvbG9yQnJpZ2h0bmVzcztcclxubW9kdWxlLmV4cG9ydHMucmFuZG9tQ29sb3IgPSByYW5kb21Db2xvcjtcclxubW9kdWxlLmV4cG9ydHMucmFuZG9tR3JhZGllbnQgPSByYW5kb21HcmFkaWVudDtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb2xvclV0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcbi8qXHJcbiAqIE1vZGUgb2JqZWN0XHJcbiAqXHJcbiAqIFRoZSBtb2RlIG9iamVjdCAoZS5nLiAnUG9seWdvbmFsJykgcmVzcG9uc2libGUgZm9yIGdlbmVyYXRpbmcgcHJpbWl0aXZlIHNoYXBlc1xyXG4gKiB0byBkcmF3IHdpdGhcclxuICovXHJcblxyXG4gLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gLy8gRGVwZW5kZW5jaWVzXHJcbiAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiB2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcbiB2YXIgR3JhcGggPSByZXF1aXJlKCcuL2dyYXBoJyk7XHJcbiB2YXIgVmVjdG9yID0gcmVxdWlyZSgnLi92ZWN0b3InKTtcclxuXHJcbi8qXHJcbiAqIEJhc2UgbW9kZSBjbGFzcyBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAcGFyYW0ge051bWJlcn0gY2FudmFzV2lkdGg6IFRoZSB3aWR0aCBvZiB0aGUgY2FudmFzXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNIZWlnaHQ6IFRoZSBoZWlnaHQgb2YgdGhlIGNhbnZhc1xyXG4gKiBAcGFyYW0ge1N0cmluZyhBcmdzKX0gYmFzZUNvbG9yczogYSBzZXQgb2YgdmFyaWFibGUgbnVtYmVyIG9mIGNvbG9yIHN0cmluZ3MgdXNlZFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXMgdGhlIGJhc2UgY29sb3JzIG9mIHRoZSBiYWNrZ3JvdW5kXHJcbiAqL1xyXG5mdW5jdGlvbiBNb2RlKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQsIGJhc2VDb2xvcnMpIHtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIEJhc2UgY2xhc3MgbWVtYmVyc1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB0aGlzLl9iYXNlQ29sb3JzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDIsIGFyZ3VtZW50cy5sZW5ndGgpO1xyXG4gICAgdGhpcy5fcHJpbWl0aXZlcyA9IFtdO1xyXG4gICAgdGhpcy5fd2lkdGggPSBjYW52YXNXaWR0aCB8fCAwO1xyXG4gICAgdGhpcy5faGVpZ2h0ID0gY2FudmFzSGVpZ2h0IHx8IDA7XHJcbn1cclxuXHJcbi8qXHJcbiAqIFB1YmxpYyB2aXJ0dWFsIGZ1bmN0aW9uIC0gc2V0IHRoZSBhcnJheSBvZiBjb2xvciBzdHJpbmdzXHJcbiAqXHJcbiAqL1xyXG5Nb2RlLnByb3RvdHlwZS5zZXRCYXNlQ29sb3JzID0gZnVuY3Rpb24oYXJncykge1xyXG4gICAgdGhpcy5fYmFzZUNvbG9ycyA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyB2aXJ0dWFsIGZ1bmN0aW9uIC0gcmV0dXJuIGFuIGFycmF5IG9mIGNvbG9yIHN0cmluZ3NcclxuICpcclxuICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIGNvbG9yIHN0cmluZ3NcclxuICovXHJcbk1vZGUucHJvdG90eXBlLmdldEJhc2VDb2xvcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9iYXNlQ29sb3JzO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIHZpcnR1YWwgZnVuY3Rpb24gLSByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIHByaW1pdGl2ZSBzaGFwZXMgdG8gZHJhdyB3aXRoXHJcbiAqXHJcbiAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBwcmltaXRpdmUgc2hhcGVzXHJcbiAqL1xyXG5Nb2RlLnByb3RvdHlwZS5nZXRQcmltaXRpdmVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcHJpbWl0aXZlcztcclxufTtcclxuXHJcbi8qXHJcbiAqIFBvbHlnb25hbCBtb2RlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IGRlbnNpdHk6IFRoZSBkZW5zaXR5IG9mIHRoZSBwb2x5Z29ucywgaW4gdGhlIHJhbmdlIG9mIFswLCAxXS5cclxuICogICAgICAgICAgICAgICAgICAgICAgICAgMCBpcyB0aGUgc3BhcnNlc3QgYW5kIDEgaXMgdGhlIGRlbnNlc3QuXHJcbiAqIEBwYXJhbSB7U3RyaW5nKEFyZ3MpfSBiYXNlQ29sb3JzOiBhIHNldCBvZiB2YXJpYWJsZSBudW1iZXIgb2YgY29sb3Igc3RyaW5ncyB1c2VkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcyB0aGUgYmFzZSBjb2xvcnMgb2YgdGhlIGJhY2tncm91bmRcclxuICogQHBhcmFtIHtOdW1iZXJ9IGNhbnZhc1dpZHRoOiBUaGUgd2lkdGggb2YgdGhlIGNhbnZhc1xyXG4gKiBAcGFyYW0ge051bWJlcn0gY2FudmFzSGVpZ2h0OiBUaGUgaGVpZ2h0IG9mIHRoZSBjYW52YXNcclxuXHJcbiAqL1xyXG5mdW5jdGlvbiBQb2x5Z29uYWxNb2RlKGRlbnNpdHksIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQsIGJhc2VDb2xvcnMpIHtcclxuICAgIC8vICBDYWxsIHRoZSBiYXNlIGNvbnN0cnVjdG9yIGFuZCBpbml0IGJhc2UgY2xhc3MgbWVtYmVyc1xyXG4gICAgUG9seWdvbmFsTW9kZS5fc3VwZXIuYXBwbHkodGhpcywgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDEsIGFyZ3VtZW50cy5sZW5ndGgpKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBDbGFzcy1zcGVjaWZpYyBtZW1iZXJzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHRoaXMuX2RlbnNpdHkgPSBkZW5zaXR5IHx8IDAuNTtcclxuICAgIHRoaXMuX2RlbnNpdHkgPSAxIC0gdGhpcy5fZGVuc2l0eTtcclxufVxyXG51dGlscy5pbmhlcml0KFBvbHlnb25hbE1vZGUsIE1vZGUpO1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vICBUaGUgYm91bmRzIG9mIHJhdGlvXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fVVBQRVJfQk9VTkQgPSAwLjM7XHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19MT1dFUl9CT1VORCA9IDAuMDAwMTtcclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuREVOU0lUWV9SQVRPX0RJRiA9XHJcbiAgICBQb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fVVBQRVJfQk9VTkQgLVxyXG4gICAgUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuREVOU0lUWV9SQVRPX0xPV0VSX0JPVU5EO1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIHNldCB0aGUgZGVuc2l0eSBvZiBwb2x5Z29uc1xyXG4gKlxyXG4gKi9cclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuc2V0RGVuc2l0eSA9IGZ1bmN0aW9uKGRlbnNpdHkpIHtcclxuICAgIHRoaXMuX2RlbnNpdHkgPSBkZW5zaXR5O1xyXG59O1xyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gcmV0dXJuIHRoZSBkZW5zaXR5IG9mIHBvbHlnb25zXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Zsb2F0fSBkZW5zaXR5XHJcbiAqL1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5zZXREZW5zaXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGVuc2l0eTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFByaXZhdGUgaGVscGVyIGZ1bmN0aW9uIC0gZ2VuZXJhdGUgcG9pbnRzIHRvIGRyYXcgd2l0aFxyXG4gKiBJdCBkaXZpZGVzIHRoZSB3aG9sZSBjYW52YXMgaW50byBzbWFsbCBncmlkcyBhbmQgZ2VuZXJhdGUgYSByYW5kb20gcG9pbnQgaW4gZXZlcnlcclxuICogZ3JpZFxyXG4gKlxyXG4gKiBAcmV0dXJuIG5vbmVcclxuICovXHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLl9nZW5lcmF0ZVByaW1pdGl2ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBXaWR0aCBhbmQgaGVpZ2h0IG9mIGV2ZXJ5IHNtYWxsIGdyaWRcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHZhciByYXRpbyA9IHRoaXMuREVOU0lUWV9SQVRPX0xPV0VSX0JPVU5EICsgdGhpcy5ERU5TSVRZX1JBVE9fRElGICogdGhpcy5fZGVuc2l0eTtcclxuICAgIHZhciB3aWR0aEludGVydmFsID0gIHJhdGlvICogdGhpcy5fd2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0SW50ZXJ2YWwgPSByYXRpbyAqIHRoaXMuX2hlaWdodDtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBDb3VudHMgb2Ygcm93cyBhbmQgY29sdW1ucyBwbHVzIHRoZSB0b3BcclxuICAgIC8vICBhbmQgbGVmdCBib3VuZHMgb2YgdGhlIHJlY3RhbmdsZVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgcm93Q291bnQgPSBNYXRoLmZsb29yKHRoaXMuX3dpZHRoIC8gd2lkdGhJbnRlcnZhbCkgKyAxLFxyXG4gICAgICAgIGNvbENvdW50ID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQgLyBoZWlnaHRJbnRlcnZhbCkgKyAxO1xyXG5cclxuICAgIC8vICBVc2UgYSBncmFwaCB0byByZXByZXNlbnQgdGhlIGdyaWRzIG9uIHRoZSBjYW52YXNcclxuICAgIHZhciBncmFwaCA9IG5ldyBHcmFwaChyb3dDb3VudCwgY29sQ291bnQpO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIFBvaW50cyBvZiBldmVyeSBzbWFsbCBncmlkXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHZhciBwMSA9IG5ldyBWZWN0b3IoMCwgMCksXHJcbiAgICAgICAgcDIgPSBuZXcgVmVjdG9yKHdpZHRoSW50ZXJ2YWwsIDApLFxyXG4gICAgICAgIHAzID0gbmV3IFZlY3Rvcih3aWR0aEludGVydmFsLCBoZWlnaHRJbnRlcnZhbCksXHJcbiAgICAgICAgcDQgPSBuZXcgVmVjdG9yKDAsIGhlaWdodEludGVydmFsKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgUmFuZG9tbHkgZ2VuZXJhdGUgcG9pbnRzIG9uIHRoZSBjYW52YXNcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICB2YXIgcmFuZFBvaW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKGogPT09IDApIHsgIC8vICBJZiBhdCB0aGUgbGVmdCBib3VuZFxyXG4gICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gdXRpbHMuZ2V0UmFuZG9tUG9pbnRPblJlY3QocDEsIHAxLCBwNCwgcDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGogPT09IGNvbENvdW50IC0gMSkgeyAgIC8vICBJZiBhdCB0aGUgcmlnaHQgYm91bmRcclxuICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHAyLCBwMiwgcDMsIHAzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7ICAgLy8gIElmIGF0IHRoZSB0b3AgYm91bmRcclxuICAgICAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSB1dGlscy5nZXRSYW5kb21Qb2ludE9uUmVjdChwMSwgcDIsIHAyLCBwMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpID09PSByb3dDb3VudCAtIDEpIHsgICAvLyAgSWYgYXQgdGhlIGJvdHRvbSBib3VuZFxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHA0LCBwMywgcDMsIHA0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHAxLCBwMiwgcDMsIHA0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBncmFwaC5pbnNlcnQoaSwgaiwgcmFuZFBvaW50KTtcclxuXHJcbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAvLyAgTW92ZSB0aGUgY3VycmVudCBzbWFsbCBncmlkIHRvIHRoZVxyXG4gICAgICAgICAgICAvLyAgcmlnaHQgYnkgb25lIGludGVydmFsIHVuaXRcclxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIHAxLnggKz0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICAgICAgcDIueCArPSB3aWR0aEludGVydmFsO1xyXG4gICAgICAgICAgICBwMy54ICs9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgICAgIHA0LnggKz0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gIE1vdmUgdGhlIGN1cnJlbnQgc21hbGwgZ3JpZCBiYWNrIHRvIHRoZVxyXG4gICAgICAgIC8vICBsZWZ0IG1vc3QgYm91bmQgYW5kIG1vdmUgaXQgZG93biBieSBvbmUgaW50ZXJ2YWwgdW5pdFxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIHAxLnggPSBwNC54ID0gMDtcclxuICAgICAgICBwMi54ID0gcDMueCA9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgcDEueSArPSBoZWlnaHRJbnRlcnZhbDtcclxuICAgICAgICBwMi55ICs9IGhlaWdodEludGVydmFsO1xyXG4gICAgICAgIHAzLnkgKz0gaGVpZ2h0SW50ZXJ2YWw7XHJcbiAgICAgICAgcDQueSArPSBoZWlnaHRJbnRlcnZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIEFzIHdlIGFyZSBnb2luZyB0byBjaGVjayBhZGphY2VudCB2ZXJ0aWNlc1xyXG4gICAgLy8gIGl0J3MgZWFzaWVyIHRvIHN0b3JlIGFsbCBkZWx0YSBpbmRleCB2YWx1ZXMgYW5kXHJcbiAgICAvLyAgbG9vcCBvdmVyIHRoZW1cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgZGkgPSBbLTEsIC0xLCAtMSwgIDAsICAxLCAxLCAxLCAwXSxcclxuICAgICAgICBkaiA9IFstMSwgIDAsICAxLCAgMSwgIDEsIDAsIC0xLCAtMV07XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQ29ubmVjdCBhbGwgYWRqYWNlbnQgdmVydGljZXNcclxuICAgIC8vICBhbmQgZ2V0IGFsbCBwcmltaXRpdmVzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAvLyAgS2VlcCBjb3VudCBvZiB0aGUgcG9pbnRzIHRoYXQgYXJlIGFjdHVhbGx5IHByb2Nlc3NlZFxyXG4gICAgICAgICAgICBsZXQgY250ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGxldCBmaXJzdFBvaW50LCBwcmV2UG9pbnQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGRpLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VyclBvaW50ID0gZ3JhcGguZ2V0KGkgKyBkaVtrXSwgaiArIGRqW2tdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VyclBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGguY29ubmVjdChpLCBqLCBpICsgZGlba10sIGogKyBkaltrXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY250Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbnQgPT09IDEpIHsgICAgLy8gIEFzc2lnbiBmaXJzdCBwb2ludFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFBvaW50ID0gY3VyclBvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJpbWl0aXZlcy5wdXNoKG5ldyB1dGlscy5Qb2x5Z29uKFsgICAvLyAgQWRkIHBvbHlnb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoLmdldChpLCBqKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZQb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQb2ludFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZQb2ludCA9IGN1cnJQb2ludDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgLy8gIENvbm5lY3QgdGhlIGZpcnN0IHBvaW50IHdpdGggdGhlXHJcbiAgICAgICAgICAgIC8vICBsYXN0IHBvaW50IGFuZCBhZGQgcG9seWdvblxyXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgaWYgKGZpcnN0UG9pbnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgcHJldlBvaW50ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgICFmaXJzdFBvaW50LmVxdWFsKHByZXZQb2ludCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByaW1pdGl2ZXMucHVzaChuZXcgdXRpbHMuUG9seWdvbihbXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGguZ2V0KGksIGopLFxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZQb2ludCxcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdFBvaW50XHJcbiAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufTtcclxuXHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9nZW5lcmF0ZVByaW1pdGl2ZXMoKTtcclxufTtcclxuXHJcbi8vICBFeHBvcnQgYW4gb2JqZWN0IGZvciBkaXJlY3QgbG9va3VwXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgUG9seWdvbmFsOiBQb2x5Z29uYWxNb2RlXHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbW9kZXMuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKmpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbi8qXHJcbiAqIFVuZGlyZWN0ZWQgYWN5bGljIGdyYXBoIGRhdGEgc3RydWN0dXJlIHVzaW5nXHJcbiAqIGFkamFjZW55IG1hdHJpeCBhcyBpbXBsZW1lbnRhdGlvblxyXG4gKlxyXG4gKi9cclxuXHJcbi8qXHJcbiAqIEdyYXBoIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gcm93Q291bnQ6IFRoZSBudW1iZXIgb2Ygcm93c1xyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGNvbHVtbkNvdW50OiBUaGUgbnVtYmVyIG9mIGNvbHVtbnNcclxuICogQG9hcmFtIHtOb24tb2JqZWN0IHR5cGVzfSBpbml0aWFsVmFsdWUoT3B0aW9uYWwpOiBpbml0aWFsVmFsdWUgZm9yIGFsbCBlbGVtZW50cyBpbiB0aGUgZ3JhcGguIEl0J3MgMCBieSBkZWZhdWx0LlxyXG4gKi9cclxuZnVuY3Rpb24gR3JhcGgocm93Q291bnQsIGNvbHVtbkNvdW50LCBpbml0aWFsVmFsdWUpIHtcclxuICAgIHRoaXMuX3Jvd0NvdW50ID0gcm93Q291bnQgfHwgMDtcclxuICAgIHRoaXMuX2NvbHVtbkNvdW50ID0gY29sdW1uQ291bnQgfHwgMDtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIEFsbG9jYXRlIGFuIGVtcHR5IG1hdHJpeFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHRoaXMuX2RhdGEgPSBuZXcgQXJyYXkocm93Q291bnQpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YVtpXSA9IG5ldyBBcnJheShjb2x1bW5Db3VudCkuZmlsbChpbml0aWFsVmFsdWUgfHwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fZWRnZXMgPSB7fTtcclxufVxyXG5cclxuLypcclxuICogUHJpdmF0ZSBtZW1iZXIgZnVuY3Rpb24gLSBjaGVjayBpZiBhIHBhaXIgb2YgcG9zaXRpb25zIGlzIGluIHRoZSByYW5nZSBvZiByb3dzIGFuZCBjb2x1bW5zXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIHBhaXIgb2YgcG9zaXRpb25zIGlzIGluIHRoZSBib3VuZCBhbmQgZmFsc2UgaWYgbm90XHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuX2NoZWNrQm91bmQgPSBmdW5jdGlvbihpLCBqKSB7XHJcbiAgICBpZiAoaSA+PSB0aGlzLl9yb3dDb3VudCB8fFxyXG4gICAgICAgIGogPj0gdGhpcy5fY29sdW1uQ291bnQgfHxcclxuICAgICAgICBpIDwgMCB8fCBqIDwgMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIG1lbWJlciBmdW5jdGlvbiAtIGdldCBhbiBpZCBmcm9tIGEgcGFpciBvZiBwb3NpdGlvbnNcclxuICpcclxuICogQHJldHVybiB7U3RyaW5nfSBUaGUgaWQgb2YgdGhlIHBhaXIgb2YgcG9zaXRpb25zXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuX2dldElkID0gZnVuY3Rpb24oaSwgaikge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NoZWNrQm91bmQoaSwgaikgPyBpLnRvU3RyaW5nKCkgKyBqLnRvU3RyaW5nKCkgOiBudWxsO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIHJldHVybiB0aGUgY291bnQgb2Ygcm93c1xyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLnJvd0NvdW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcm93Q291bnQ7XHJcbn07XHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSByZXR1cm4gdGhlIGNvdW50IG9mIGNvbHVtbnNcclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5jb2x1bW5Db3VudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtbkNvdW50O1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGluc2VydCBhbiBlbGVtZW50IHRvIHRoZSBncmFwaFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGluc2VydGlvbiBpcyBzdWNjZXNzZnVsIGFuZCBmYWxzZSBpZiBub3RcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICogQHBhcmFtIHtBbnl9IHZhbHVlOiBUaGUgdmFsdWUgdG8gaW5zZXJ0XHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24oaSwgaiwgdmFsdWUpIHtcclxuICAgIGlmICh0aGlzLl9jaGVja0JvdW5kKGksIGopKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YVtpXVtqXSA9IHZhbHVlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gZ2V0IGEgZWxlbWVudCBmcm9tIGEgcGFpciBvZiBwb3NpdGlvblxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBbnkgLyBudWxsfSBUaGUgZWxlbWVudCBhdCB0aGUgcG9zaXRpb24gaWYgdGhlIHBhaXIgb2YgcG9zaXRpb25zIGlzIGluIHRoZSBib3VuZFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICBhbmQgbnVsbCBpZiBub3RcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpLCBqKSB7XHJcbiAgICBpZiAodGhpcy5fY2hlY2tCb3VuZChpLCBqKSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhW2ldW2pdO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBjaGVjayBpZiB0d28gdmVydGljZXMgYXJlIGNvbm5lY3RlZFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZXJlIGlzIGEgY29ubmVjdGlvbiBiZXR3ZWVuIHR3byBlbGVtZW50c1xyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGkxLCBpMjogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajEsIGoyOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5pc0Nvbm5lY3RlZCA9IGZ1bmN0aW9uKGkxLCBqMSwgaTIsIGoyKSB7XHJcbiAgICBpZiAoIXRoaXMuX2NoZWNrQm91bmQoaTEsIGoxKSB8fFxyXG4gICAgICAgICF0aGlzLl9jaGVja0JvdW5kKGkyLCBqMikpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB2YXIgaWQxID0gdGhpcy5fZ2V0SWQoaTEsIGoxKSxcclxuICAgICAgICBpZDIgPSB0aGlzLl9nZXRJZChpMiwgajIpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5fZWRnZXNbaWQxXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fZWRnZXNbaWQxXVtpZDJdO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGNvbm5lY3QgdGhlIGVkZ2Ugb2YgdHdvIHZlcnRpY2VzXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGFjdGlvbiBpcyBzdWNjZXNzZnVsXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTEsIGkyOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqMSwgajI6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbihpMSwgajEsIGkyLCBqMikge1xyXG4gICAgaWYgKCF0aGlzLl9jaGVja0JvdW5kKGkxLCBqMSkgfHxcclxuICAgICAgICAhdGhpcy5fY2hlY2tCb3VuZChpMiwgajIpKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgdmFyIGlkMSA9IHRoaXMuX2dldElkKGkxLCBqMSksXHJcbiAgICAgICAgaWQyID0gdGhpcy5fZ2V0SWQoaTIsIGoyKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMuX2VkZ2VzW2lkMV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5fZWRnZXNbaWQxXSA9IHt9O1xyXG4gICAgfVxyXG4gICAgdGhpcy5fZWRnZXNbaWQxXVtpZDJdID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBkaXNjb25uZWN0IHRoZSBlZGdlIG9mIHR3byB2ZXJ0aWNlc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBhY3Rpb24gaXMgc3VjY2Vzc2Z1bFxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGkxLCBpMjogVGhlIHplcm8tYmFzZWQgcm93IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gajEsIGoyOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24oaTEsIGoxLCBpMiwgajIpIHtcclxuICAgIGlmICghdGhpcy5fY2hlY2tCb3VuZChpMSwgajEpIHx8XHJcbiAgICAgICAgIXRoaXMuX2NoZWNrQm91bmQoaTIsIGoyKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHZhciBpZDEgPSB0aGlzLl9nZXRJZChpMSwgajEpLFxyXG4gICAgICAgIGlkMiA9IHRoaXMuX2dldElkKGkyLCBqMik7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLl9lZGdlc1tpZDFdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fZWRnZXNbaWQxXVtpZDJdID0gZmFsc2U7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vLyAgRXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cyA9IEdyYXBoO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2dyYXBoLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==