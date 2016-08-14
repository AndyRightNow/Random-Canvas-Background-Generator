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
	var Modes = __webpack_require__(5);
	
	var htmlTest = {};
	
	htmlTest.run = function(canvasId){
	    var polyMode = new Modes.Polygonal(0.7, 600, 300, "#000000", "#FFFFFF");
	    var back = new RandomBackgroundGenerator('canvas');
	    polyMode.generate();
	
	    for (let i = 0; i < polyMode.getPrimitives().length; i++) {
	        console.log(i, polyMode.getPrimitives()[i]);
	        back._fillPolygon("#4183D7", polyMode.getPrimitives()[i], true);
	    }
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
	 var t = __webpack_require__(7);
	
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
	
	//  The bounds of ratio
	PolygonalMode.prototype.DENSITY_RATO_UPPER_BOUND = 0.5;
	PolygonalMode.prototype.DENSITY_RATO_LOWER_BOUND = 0.005;
	PolygonalMode.prototype.DENSITY_RATO_DIF =
	    PolygonalMode.prototype.DENSITY_RATO_UPPER_BOUND -
	    PolygonalMode.prototype.DENSITY_RATO_LOWER_BOUND;
	
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
	            let cnt = 0;
	            let firstPoint, prevPoint;
	            for (let k = 0; k < di.length; k++) {
	                let currPoint = graph.get(i + di[k], j + dj[k]);
	                if (currPoint) {
	                    graph.connect(i, j, i + di[k], j + dj[k]);
	                    cnt++;
	
	                    if (cnt === 1) {
	                        firstPoint = currPoint;
	                    }
	                    else {
	                        this._primitives.push(new utils.Polygon([
	                            graph.get(i, j),
	                            prevPoint,
	                            currPoint
	                        ]));
	                    }
	                    prevPoint = currPoint;
	                }
	            }
	            if (firstPoint !== undefined &&
	                prevPoint !== undefined &&
	                !firstPoint.equal(lastPoint)) {
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


/***/ },
/* 7 */
/***/ function(module, exports) {

	/*jshint esversion: 6 */
	
	module.exports = {
	    OUTPUT: function(content) {
	        console.log('\n');
	        console.log('--------------------------------------');
	        console.log.apply(console, arguments);
	        console.log('--------------------------------------');
	    },
	    LOG: function() {
	        return console.log.apply(console, arguments);
	    }
	};


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZmE3MjZhNzVlOTMzZTUxZjIwMmIiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sb3JVdGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLmpzIiwid2VicGFjazovLy8uL3Rlc3QvdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBbUIscUNBQXFDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3ZEQTtBQUNBOztBQUVBO0FB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QUVBO0FBQ0E7Ozs7Ozs7QUNwS0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Imh0bWxUZXN0LmRpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGZhNzI2YTc1ZTkzM2U1MWYyMDJiXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcbnZhciBWZWN0b3IgPSByZXF1aXJlKCcuLy4uLy4uL3NyYy92ZWN0b3InKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi9zcmMvdXRpbHMnKTtcclxudmFyIFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uLy4uL3NyYy9SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yJyk7XHJcbnZhciBNb2RlcyA9IHJlcXVpcmUoJy4vLi4vLi4vc3JjL21vZGVzJyk7XHJcblxyXG52YXIgaHRtbFRlc3QgPSB7fTtcclxuXHJcbmh0bWxUZXN0LnJ1biA9IGZ1bmN0aW9uKGNhbnZhc0lkKXtcclxuICAgIHZhciBwb2x5TW9kZSA9IG5ldyBNb2Rlcy5Qb2x5Z29uYWwoMC43LCA2MDAsIDMwMCwgXCIjMDAwMDAwXCIsIFwiI0ZGRkZGRlwiKTtcclxuICAgIHZhciBiYWNrID0gbmV3IFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IoJ2NhbnZhcycpO1xyXG4gICAgcG9seU1vZGUuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvbHlNb2RlLmdldFByaW1pdGl2ZXMoKS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGksIHBvbHlNb2RlLmdldFByaW1pdGl2ZXMoKVtpXSk7XHJcbiAgICAgICAgYmFjay5fZmlsbFBvbHlnb24oXCIjNDE4M0Q3XCIsIHBvbHlNb2RlLmdldFByaW1pdGl2ZXMoKVtpXSwgdHJ1ZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGh0bWxUZXN0O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcbiAqICAgICAgICAgICAgICBWZWN0b3IgQ2xhc3NcclxuICpcclxuICogICAgICBWZWN0b3IgYW5kIHZlY3RvciBvcGVyYXRpb25zLlxyXG4gKi9cclxuXHJcbi8qXHJcbiAqICBDb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gVmVjdG9yKHgsIHkpe1xyXG5cdHRoaXMueCA9IHggfHwgMDtcclxuXHR0aGlzLnkgPSB5IHx8IDA7XHJcbn1cclxuXHJcblZlY3Rvci5wcm90b3R5cGUuZXF1YWwgPSBmdW5jdGlvbih2ZWMpIHtcclxuXHRyZXR1cm4gdGhpcy54ID09PSB2ZWMueCAmJiB0aGlzLnkgPT09IHZlYy55O1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2KXtcclxuXHRyZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55O1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5sZW4yID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5kb3QodGhpcyk7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmxlbiA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIE1hdGguc3FydCh0aGlzLmxlbjIoKSk7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24oc3gsIHN5KXtcclxuXHR0aGlzLnggKj0gc3g7XHJcblx0dGhpcy55ICo9IHN5IHx8IHN4O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbih2KXtcclxuXHR0aGlzLnggLT0gdi54O1xyXG5cdHRoaXMueSAtPSB2Lnk7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cdE5vIHNpZGUgZWZmZWN0IGFuZCBjaGFpbmluZ1xyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuVmVjdG9yLnByb3RvdHlwZS5wcm9qZWN0ID0gZnVuY3Rpb24oYXhpcyl7XHJcblx0dmFyIGNvZiA9ICB0aGlzLmRvdChheGlzKSAvIGF4aXMubGVuMigpO1xyXG5cdHJldHVybiBheGlzLnNjYWxlKGNvZik7XHJcbn07XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLnByb2plY3ROID0gZnVuY3Rpb24oYXhpcyl7XHJcblx0dmFyIGNvZiA9ICB0aGlzLmRvdChheGlzKTtcclxuXHRyZXR1cm4gYXhpcy5zY2FsZShjb2YpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3I7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdmVjdG9yLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcbnZhciBWZWN0b3IgPSByZXF1aXJlKCcuL3ZlY3RvcicpO1xyXG5cclxuLypcclxuICpcdFBvbHlnb24gY2xhc3MgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzOiBUaGUgcG9pbnRzIG9mIHRoZSBwb2x5Z29uLiBUaGV5IG11c3QgYmUgaW4gY2xvY2t3aXNlIG9yIGNvdW50ZXItY2xvY2t3aXNlIG9yZGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBQb2x5Z29uKHBvaW50cykge1xyXG4gICAgdGhpcy5fcG9pbnRzID0gcG9pbnRzIHx8IFtdO1xyXG59XHJcblBvbHlnb24ucHJvdG90eXBlID0ge1xyXG4gICAgZ2V0IHBvaW50cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9pbnRzO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXQgcG9pbnRzKHBvaW50cykge1xyXG4gICAgICAgIHRoaXMuX3BvaW50cyA9IHBvaW50cztcclxuICAgIH0sXHJcblxyXG4gICAgZXF1YWw6IGZ1bmN0aW9uKHBvbHlnb24pIHtcclxuICAgICAgICB2YXIgcmV2ZXJzZWQgPSBwb2x5Z29uLnBvaW50cztcclxuICAgICAgICByZXZlcnNlZC5yZXZlcnNlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50cy5ldmVyeShmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5lcXVhbChwb2x5Z29uLnBvaW50c1tpbmRleF0pO1xyXG4gICAgICAgIH0pIHx8IHRoaXMucG9pbnRzLmV2ZXJ5KGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmVxdWFsKHJldmVyc2VkW2luZGV4XSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiAgQ2xhbXAgYSBudW1iZXIgd2l0aGluIGEgcmFuZ2VcclxuICovXHJcbmZ1bmN0aW9uIGNsYW1wKHgsIGxvd2VyLCB1cHBlcil7XHJcbiAgICByZXR1cm4geCA8IGxvd2VyID8gbG93ZXIgOiB4ID4gdXBwZXIgPyB1cHBlciA6IHg7XHJcbn1cclxuXHJcbi8qXHJcbiAqXHRHZXQgYSByYW5kb20gbnVtYmVyIGZyb20gYSByYW5nZVxyXG4gKlxyXG4gKlx0QHJldHVybiB7aW50IC8gZmxvYXR9IEEgcmFuZG9tbHkgZ2VuZXJhdGVkIG51bWJlciB3aXRoaW4gYSByYW5nZVxyXG4gKlx0QHBhcmFtIHtpbnQgLyBmbG9hdH0gbG93ZXI6IFRoZSBsb3dlciBib3VuZCBvZiB0aGUgcmFuZ2UoSW5jbHVzaXZlKVxyXG4gKlx0QHBhcmFtIHtpbnQgLyBmbG9hdH0gdXBwZXI6IFRoZSB1cHBlciBib3VuZCBvZiB0aGUgcmFuZ2UoRXhjbHVzaXZlKVxyXG4gKlx0QHBhcmFtIHtib29sZWFufSBpc0ludDogVGhlIGZsYWcgdG8gc3BlY2lmeSB3aGV0aGVyIHRoZSByZXN1bHQgaXMgaW50IG9yIGZsb2F0XHJcbiAqL1xyXG4gZnVuY3Rpb24gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKGxvd2VyLCB1cHBlciwgaXNJbnQpIHtcclxuICAgICBpZiAobG93ZXIgPj0gdXBwZXIpIHJldHVybiAwO1xyXG4gICAgIGlzSW50ID0gaXNJbnQgfHwgdHJ1ZTtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vXHRTb21lIHJhbmRvbSBudW1iZXJzIGp1c3QgY29taW5nIG91dCBvZiBub3doZXJlXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgc29tZVJhbmRvbU51bWJlcjEgPSAxMjg1LFxyXG4gICAgICAgIHNvbWVSYW5kb21OdW1iZXIyID0gMjM5MTtcclxuXHJcbiAgICAvL1x0R2VuZXJhdGUgdGhlIGludGVnZXIgcGFydFxyXG4gICAgdmFyIHJhbmRvbUludCA9XHJcbiAgICAgICAgcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIHNvbWVSYW5kb21OdW1iZXIxICogTWF0aC5yYW5kb20oKSAqIHNvbWVSYW5kb21OdW1iZXIyKSAlICh1cHBlciAtIGxvd2VyKTtcclxuXHJcbiAgICBpZiAoaXNJbnQpIHtcclxuICAgICAgICByZXR1cm4gbG93ZXIgKyByYW5kb21JbnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBsb3dlciArIHJhbmRvbUludCArIE1hdGgucmFuZG9tKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiAqICBHZXQgYSByYW5kb20gcG9pbnQgb24gYSByZWN0YW5nbGVcclxuICpcclxuICpcdEBwYXJhbSB7VmVjdG9yfSBwMSwgcDIsIHAzLCBwNDogUG9pbnRzIG9mIGEgcmVjdGFuZ2xlIHN0YXJ0aW5nXHJcbiAqXHRcdFx0XHRcdFx0XHRcdCAgIGZyb20gdGhlIHRvcCBsZWZ0IGNvcm5lciBhbmQgZ29pbmdcclxuICpcdFx0XHRcdFx0XHRcdFx0ICAgY2xvY2t3aXNlLlxyXG4gKlx0QHBhcmFtIHtib29sZWFufSBpc0ludDogVGhlIGZsYWcgdG8gc3BlY2lmeSB3aGV0aGVyIHRoZSByZXN1bHQgaXMgaW50IG9yIGZsb2F0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSYW5kb21Qb2ludE9uUmVjdChwMSwgcDIsIHAzLCBwNCwgaXNJbnQpIHtcclxuICAgIGlzSW50ID0gaXNJbnQgfHwgdHJ1ZTtcclxuICAgIHZhciB3aWR0aCA9IE1hdGguYWJzKHAyLnggLSBwMS54KSxcclxuICAgICAgICBoZWlnaHQgPSBNYXRoLmFicyhwMy55IC0gcDIueSksXHJcbiAgICAgICAgdG9wTGVmdFggPSBNYXRoLm1pbihwMS54LCBwMi54LCBwMy54LCBwNC54KSxcclxuICAgICAgICB0b3BMZWZ0WSA9IE1hdGgubWluKHAxLnksIHAyLnksIHAzLnksIHA0LnkpO1xyXG5cclxuICAgIHZhciByYW5kb21EZWx0YVggPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgd2lkdGgsIGlzSW50KSxcclxuICAgICAgICByYW5kb21EZWx0YVkgPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgaGVpZ2h0LCBpc0ludCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBWZWN0b3IodG9wTGVmdFggKyByYW5kb21EZWx0YVgsIHRvcExlZnRZICsgcmFuZG9tRGVsdGFZKTtcclxufVxyXG5cclxuLypcclxuICogIEdldCBhIHJhbmRvbSBwb2ludCBvbiBhIGxpbmVcclxuICogIEBwYXJhbSB7VmVjdG9yfSBwMSwgcDI6IFBvaW50cyBvZiBhIGxpbmUgZnJvbSBsZWZ0IHRvIHJpZ2h0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSYW5kb21Qb2ludE9uTGluZShwMSwgcDIpIHtcclxuICAgIHZhciBwcm9qZWN0aW9uV2lkdGggPSBNYXRoLmFicyhwMS54IC0gcDIueCksXHJcbiAgICAgICAgbGVmdFggPSBNYXRoLm1pbihwMS54LCBwMi54KTtcclxuXHJcbiAgICB2YXIgQSA9IChwMS55IC0gcDIueSkgLyAocDEueCAtIHAyLngpLFxyXG4gICAgICAgIEIgPSBwMS55IC0gQSAqIHAxLng7XHJcblxyXG4gICAgdmFyIHJhbmRvbURlbHRhWCA9IGdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCBwcm9qZWN0aW9uV2lkdGgsIGZhbHNlKTtcclxuICAgIHJldHVybiBuZXcgVmVjdG9yKGxlZnRYICsgcmFuZG9tRGVsdGFYLCBBICogKGxlZnRYICsgcmFuZG9tRGVsdGFYKSArIEIpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBIZWxwZXIgZnVuY3Rpb24gdXNlZCB0byBjcmVhdGUgaW5oZXJpdGFuY2VcclxuICpcclxuICogQHJldHVybiBub25lXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN0b3I6IFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgY3VycmVudCBvYmplY3RcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3VwZXJDdG9yOiBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHBhcmVudCBvYmplY3RcclxuICovXHJcbiBmdW5jdGlvbiBpbmhlcml0KGN0b3IsIHN1cGVyQ3Rvcikge1xyXG4gICAgIGN0b3IuX3N1cGVyID0gc3VwZXJDdG9yO1xyXG4gICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XHJcbiAgICAgICAgIGNvbnN0cnVjdG9yOiB7XHJcbiAgICAgICAgICAgICB2YWx1ZTogY3RvcixcclxuICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgfVxyXG4gICAgIH0pO1xyXG4gfVxyXG5cclxuLy8gIEV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMuUG9seWdvbiA9IFBvbHlnb247XHJcbm1vZHVsZS5leHBvcnRzLmNsYW1wID0gY2xhbXA7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSA9IGdldFJhbmRvbU51bWJlckZyb21SYW5nZTtcclxubW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tUG9pbnRPblJlY3QgPSBnZXRSYW5kb21Qb2ludE9uUmVjdDtcclxubW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tUG9pbnRPbkxpbmUgPSBnZXRSYW5kb21Qb2ludE9uTGluZTtcclxubW9kdWxlLmV4cG9ydHMuaW5oZXJpdCA9IGluaGVyaXQ7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKmpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbi8qXHJcbiAqIFJhbmRvbSBDYW52YXMgQmFja2dyb3VuZCBHZW5lcmF0b3JcclxuICpcclxuICogSXQncyB1c2VkIG9uIEhUTUwgQ2FudmFzIHRvIGdlbmVyYXRlIHJhbmRvbSBiYWNrZ3JvdW5kIGluIGEgY2VydGFpbiBwYXR0ZXJuXHJcbiAqIHdpdGggY2VydGFpbiBjdXN0b21pemVkIHBhcmFtZXRlcnMgYW5kIG1vZGVzLiBUaGUgYmFja2dyb3VuZFxyXG4gKiB3aWxsIHVwZGF0ZSBldmVyeSB0aW1lIHlvdSBjYWxsIGdlbmVyYXRlKClcclxuICpcclxuICovXHJcblxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cdERlcGVuZGVuY2llc1xyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG52YXIgY29sb3JVdGlscyA9IHJlcXVpcmUoJy4vY29sb3JVdGlscycpO1xyXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi92ZWN0b3InKTtcclxuXHJcbi8qXHJcbipcdENvbnN0YW50IHN0cmluZyBuYW1lXHJcbiovXHJcbmNvbnN0IFBPTFlHT05BTCA9IFwiUG9seWdvbmFsXCI7XHJcblxyXG4vKlxyXG4qIENvbnN0cnVjdG9yXHJcbipcclxuKiBAcGFyYW0ge3N0cmluZ30gY2FudmFzSWQ6IFRoZSBpZCBvZiB0aGUgY2FudmFzIHlvdSB3YW50IHRvIGdlbmVyYXRlIGJhY2tncm91bmQgb25cclxuKiBAcGFyYW0ge3N0cmluZ30gbW9kZTogVGhlIHBhdHRlcm4gaW4gd2hpY2ggdGhlIGJhY2tncm91bmQgaXMgZ2VuZXJhdGVkLlxyXG4qXHRcdFx0XHRcdFx0IEN1cnJlbnRseSBTdXBwb3J0OiAxLiBcIlBvbHlnb25hbFwiXHJcbiovXHJcbmZ1bmN0aW9uIFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IoY2FudmFzSWQsIG1vZGUpIHtcclxuXHQvL1x0SW5pdGlhbGl6ZVxyXG5cdHRoaXMuX21vZGUgPSBtb2RlIHx8IFBPTFlHT05BTDtcclxuXHR0aGlzLl9jYW52YXMgPSB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpIDogbnVsbDtcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0ID0gdGhpcy5fY2FudmFzID8gdGhpcy5fY2FudmFzLmdldENvbnRleHQoJzJkJykgOiBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIGhlbHBlciBmdW5jdGlvbiB1c2VkIHRvIGRyYXcgcG9seWdvbiBvbiB0aGUgY2FudmFzXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogQSBIRVgsIFJHQiBvciBSR0JBIGNvbG9yIGluIHRoZSBmb3JtIG9mXHJcbiAqXHRcdFx0XHRcdFx0ICAgXCIjMDAwMDAwXCIsIFwicmdiKDAsIDAsIDApXCIgb3IgXCJyZ2JhKDAsIDAsIDAsIDEpXCJcclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzOiBBbiBhcnJheSBvZiBQb2ludCBvYmplY3RzXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZ3JhZGllbnQ6IEEgZmxhZyBpbmRpY2F0aW5nIGlmIGxpbmVhci1ncmFkaWVudCBpcyBlbmFibGVkLlxyXG4gKlx0XHRcdFx0XHRcdFx0ICAgVGhlIGdyYWRpZW50IHdpbGwgYmUgcmFuZG9tbHkgZ2VuZXJhdGVkLlxyXG4gKlxyXG4gKi9cclxuUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5wcm90b3R5cGUuX2ZpbGxQb2x5Z29uID0gZnVuY3Rpb24oY29sb3IsIHBvbHlnb24sIGdyYWRpZW50KSB7XHJcblx0Z3JhZGllbnQgPSBncmFkaWVudCB8fCBmYWxzZTtcclxuXHJcblx0Ly9cdFNhdmUgdGhlIHByZXZpb3VzIHN0YXRlc1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuc2F2ZSgpO1xyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8vXHRTZXQgdGhlIGNvbG9yXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRpZiAoZ3JhZGllbnQpIHtcclxuXHRcdGlmIChwb2x5Z29uLnBvaW50cy5sZW5ndGggPT09IDMpIHtcdC8vXHRJZiBpdCdzIGEgdHJpYW5nbGVcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdC8vXHRTdGFydCBhbmQgZW5kIHBvaW50cyBvZiB0aGUgbGluZWFyIGdyYWRpZW50XHJcblx0XHRcdC8vXHRUaGUgc3RhcnQgcG9pbnQgaXMgcmFuZG9tbHkgc2VsZWN0ZWRcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdGxldCBzdGFydFBvaW50ID0gcG9seWdvbi5wb2ludHNbdXRpbHMuZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIHBvbHlnb24ucG9pbnRzLmxlbmd0aCldO1xyXG5cdFx0XHRsZXQgZW5kUG9pbnQ7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ly9cdEZldGNoIHBvaW50cyBvdGhlciB0aGFuIHRoZSBzdGFydCBwb2ludFxyXG5cdFx0XHQvL1x0b3V0IG9mIHRoZSBwb2x5Z29uXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgaW5kZXggPSBwb2x5Z29uLnBvaW50cy5pbmRleE9mKHN0YXJ0UG9pbnQpO1xyXG5cdFx0XHRsZXQgbGluZSA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBvbHlnb24ucG9pbnRzLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdGlmIChpICE9PSBpbmRleCkgbGluZS5wdXNoKHBvbHlnb24ucG9pbnRzW2ldKTtcclxuXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0UHJvamVjdCB0aGUgc3RhcnQgcG9pbnQgdG8gdGhlIGxpbmVcclxuXHRcdFx0Ly9cdGl0J3MgZmFjaW5nIGFuZCB0aGF0J3MgdGhlIGVuZCBwb2ludFxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0bGV0IGF4aXMgPSBuZXcgVmVjdG9yKGxpbmVbMF0ueCAtIGxpbmVbMV0ueCwgbGluZVswXS55IC0gbGluZVsxXS55KTtcclxuXHRcdFx0ZW5kUG9pbnQgPSBzdGFydFBvaW50LnByb2plY3QoYXhpcyk7XHJcblxyXG5cdFx0XHQvL1x0Q3JlYXRlIHRoZSBsaW5lYXIgZ3JhZGllbnQgb2JqZWN0XHJcblx0XHRcdGxldCBncmFkID0gdGhpcy5fY2FudmFzQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcclxuXHRcdFx0XHRzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0R2V0IHJhbmRvbSBsaW5lYXIgZ3JhZGllbnQgY29sb3JzXHJcblx0XHRcdC8vXHRhbmQgYWRkIGNvbG9yc1xyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgcmFuZG9tSW50ZW5zaXR5ID0gTWF0aC5yYW5kb20oKSArIDEgKiAwLjU7XHJcblx0XHRcdGxldCBncmFkQ29sb3JzID0gY29sb3JVdGlscy5yYW5kb21HcmFkaWVudChjb2xvclV0aWxzLnJhbmRvbUNvbG9yKGNvbG9yKSwgcmFuZG9tSW50ZW5zaXR5KTtcclxuXHRcdFx0Z3JhZC5hZGRDb2xvclN0b3AoMCwgZ3JhZENvbG9ycy5maXJzdCk7XHJcblx0XHRcdGdyYWQuYWRkQ29sb3JTdG9wKDEsIGdyYWRDb2xvcnMuc2Vjb25kKTtcclxuXHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gZ3JhZDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ly9cdERyYXcgdGhlIHBvbHlnb25cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5iZWdpblBhdGgoKTtcclxuXHR2YXIgcG9pbnRzID0gcG9seWdvbi5wb2ludHM7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdHRoaXMuX2NhbnZhc0NvbnRleHQubW92ZVRvKHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmxpbmVUbyhwb2ludHNbaV0ueCwgcG9pbnRzW2ldLnkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuZmlsbCgpO1xyXG5cclxuXHQvL1x0UmVzdG9yZSBwcmV2aW91cyBzdGF0ZXNcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LnJlc3RvcmUoKTtcclxufTtcclxuXHJcblJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oKXtcclxuXHQvL1x0Q2xlYXIgdGhlIGNhbnZhc1xyXG5cclxuXHQvL1x0RHJhdyB0aGUgYmFja2dyb3VuZFxyXG5cdFx0Ly9cdEdlbmVyYXRlIHBvaW50cyBvbiB0aGUgY2FudmFzXHJcblxyXG5cdFx0Ly9cdENvbm5lY3QgYWxsIGFkamFjZW50IHBvaW50c1xyXG5cclxuXHRcdC8vXHRGaWxsIHRoZSB0cmlhbmdsZXMgZm9ybWVkIGJ5IHRoZSBwb2ludHNcclxufTtcclxuXHJcbi8vXHRFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzID0gUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvcjtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxuLypcclxuICogIENoZWNrIGlmIGEgc3RyaW5nIGlzIGluIGEgaGV4IGNvbG9yIGZvcm1hdFxyXG4gKiAgQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGluIGEgaGV4IGZvcm1hdFxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29sb3JcclxuICovXHJcbmZ1bmN0aW9uIGlzSGV4KGNvbG9yKSB7XHJcbiAgICByZXR1cm4gLyNbYS1mMC05XXs2fS9naS50ZXN0KGNvbG9yKTtcclxufVxyXG5cclxuLypcclxuICogIENoZWNrIGlmIGEgc3RyaW5nIGlzIGluIGEgcmdiIGNvbG9yIGZvcm1hdFxyXG4gKiAgQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGluIGEgcmdiIGZvcm1hdFxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29sb3JcclxuICovXHJcbiBmdW5jdGlvbiBpc1JnYihjb2xvcikge1xyXG4gICAgLy8gIEVsaW1pbmF0ZSB3aGl0ZSBzcGFjZXNcclxuICAgIGNvbG9yID0gY29sb3IucmVwbGFjZSgvXFxzL2csIFwiXCIpO1xyXG4gICAgcmV0dXJuIC9yZ2JcXChbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCkvaS50ZXN0KGNvbG9yKTtcclxufVxyXG4gLypcclxuKiAgQ2hlY2sgaWYgYSBzdHJpbmcgaXMgaW4gYSByZ2JhIGNvbG9yIGZvcm1hdFxyXG4qICBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBzdHJpbmcgaXMgaW4gYSByZ2JhIGZvcm1hdFxyXG4qICBAcGFyYW0ge3N0cmluZ30gY29sb3I6IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb2xvclxyXG4qL1xyXG5mdW5jdGlvbiBpc1JnYmEoY29sb3IpIHtcclxuIC8vICBFbGltaW5hdGUgd2hpdGUgc3BhY2VzXHJcbiBjb2xvciA9IGNvbG9yLnJlcGxhY2UoL1xccy9nLCBcIlwiKTtcclxuIHJldHVybiAvcmdiYVxcKFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwpL2kudGVzdChjb2xvcik7XHJcblxyXG59XHJcblxyXG4vKlxyXG4gKlx0Q29udmVydCBoZXggY29sb3IgdG8gcmdiIGNvbG9yXHJcbiAqICBAcmV0dXJuIHtzdHJpbmcgLyBudWxsfSBDb252ZXJ0ZWQgY29sb3Igc3RyaW5nIG9yIG51bGwgaWYgdGhlIGlucHV0IGlzIGludmFsaWRcclxuICovXHJcbmZ1bmN0aW9uIGhleFRvUmdiKGhleCkge1xyXG4gICAgaWYgKGlzSGV4KGhleCkpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2IoXCIgK1xyXG4gICAgICAgIHBhcnNlSW50KGhleC5zdWJzdHIoMSwgMiksIDE2KSArIFwiLCBcIiArXHJcbiAgICAgICAgcGFyc2VJbnQoaGV4LnN1YnN0cigzLCAyKSwgMTYpICsgXCIsIFwiICtcclxuICAgICAgICBwYXJzZUludChoZXguc3Vic3RyKDUsIDIpLCAxNikgKyBcIilcIjtcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIGlzUmdiKGhleCkgfHwgaXNSZ2JhKGhleCkgPyBoZXggOiBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKlx0QWRqdXN0IHRoZSBicmlnaHRuZXNzIG9mIGEgY29sb3IgYnkgcGVyY2VudGFnZVxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgY29sb3Igc3RyaW5nXHJcbiAqICBAcGFyYW0ge2Zsb2F0fSBwZXJjZW50YWdlOiBBIGZsb2F0IHdpdGhpbiBbLTEsIDFdIGJ5IHdoaWNoIHRoZSBicmlnaHRuZXNzIGlzIGFkanVzdGVkLlxyXG4gKlx0XHRcdFx0XHRcdFx0ICAgMSBtZWFucyBtYXhpbXVtIGRhcmtuZXNzIGFuZCAtMSBtZWFucyBtYXhpbXVtIGJyaWdodG5lc3MuXHJcbiAqL1xyXG5mdW5jdGlvbiBhZGp1c3RDb2xvckJyaWdodG5lc3MoY29sb3IsIHBlcmNlbnRhZ2UpIHtcclxuICAgIHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlIHx8IDA7XHJcbiAgICBjb2xvciA9IGhleFRvUmdiKGNvbG9yKTtcclxuXHJcbiAgICBpZiAoY29sb3IgIT09IG51bGwpIHtcclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvL1x0VXNlIGRpZmZlcmVudCByZWdleCBhbmQgZm9ybWF0cyBmb3IgcmdiIGFuZCByZ2JhXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgdmFyIHJlZ3ggPSBpc1JnYihjb2xvcikgP1xyXG4gICAgICAgICAgICAvW1xcZF17MSwzfVsuXT9bXFxkXSovZ2kgOiAvW1xcZF17MSwzfVsuXT9bXFxkXSpcXCwvZ2k7XHJcbiAgICAgICAgdmFyIHBvc3RmaXggPSBpc1JnYihjb2xvcikgPyAnJyA6ICcsJztcclxuXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gIFJlcGxhY2UgdGhlIHIsIGcgYW5kIGIgd2l0aCBhZGp1c3RlZCBudW1iZXJzIGFuZFxyXG4gICAgICAgIC8vICByb3VuZCB0aGVtIHRvIGludGVnZXJzXHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgcmV0dXJuIGNvbG9yLnJlcGxhY2UocmVneCwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHV0aWxzLmNsYW1wKChwYXJzZUludChlKSAqICgxIC0gcGVyY2VudGFnZSkpLCAwLCAyNTUpKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKCkgKyBwb3N0Zml4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKiAgRnVuY3Rpb24gdG8gZ2VuZXJhdGUgcmFuZG9tIGNvbG9yIHdpdGggcmFuZG9tIGJyaWdodG5lc3NcclxuICogIGJhc2VkIG9uIGEgZ2l2ZW4gY29sb3JcclxuICpcclxuICpcdEByZXR1cm4ge3N0cmluZ30gQSBzdHJpbmcgb2YgZ2VuZXJhdGVkIGNvbG9yXHJcbiAqICBAcGFyYW0ge3N0cmluZ30gYmFzZUNvbG9yOiBBIGNvbG9yIHN0cmluZyBpbiBIRVgsIFJHQiBvciBSR0JBXHJcbiAqXHRAcGFyYW0ge2Zsb2F0fSBicmlnaHRuZXNzSW50ZW5zaXR5KE9wdGlvbmFsKTogVGhlIGJyaWdodG5lc3MgaW50ZW5zaXR5IHdpdGhpbiBbMCwgMV0gdG8gZ2VuZXJhdGVcclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGFyb3VuZC4gMCBtZWFucyBnZW5lcmF0ZSBhcm91bmQgMCBicmlnaHRuZXNzIGNoYW5nZXMsXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAwLjUgbWVhbnMgZ2VuZXJhdGUgYXJvdW5kIDUwJSBicmlnaHRuZXNzIGNoYW5nZXMgYW5kXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAxIG1lYW5zIGdlbmVyYXRlIGFyb3VuZCBtYXhpbXVtIGJyaWdodG5lc3MgY2hhbmdlcy5cclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIFRoZSBicmlnaHRuZXNzIGNoYW5nZXMgd2lsbCBiZSBlaXRoZXIgZHJha2VuaW5nIG9yIGJyaWdodGVuaW5nLlxyXG4gKi9cclxuIGZ1bmN0aW9uIHJhbmRvbUNvbG9yKGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSl7XHJcbiAgICAgYnJpZ2h0bmVzc0ludGVuc2l0eSA9IGJyaWdodG5lc3NJbnRlbnNpdHkgfHwgMC41O1xyXG4gICAgIHZhciB0aHJlc2hvbGQgPSAwLjIsXHJcbiAgICAgICAgIHJhbmdlTG93ZXIgPSB1dGlscy5jbGFtcChicmlnaHRuZXNzSW50ZW5zaXR5IC0gdGhyZXNob2xkLCAwLCAxKSxcclxuICAgICAgICAgcmFuZ2VVcHBlciA9IHV0aWxzLmNsYW1wKGJyaWdodG5lc3NJbnRlbnNpdHkgKyB0aHJlc2hvbGQsIDAsIDEpO1xyXG5cclxuICAgICAvL1x0VXNlZCB0byBnZXQgYSBlaXRoZXIgbmVnYXRpdmUgb3IgcG9zaXRpdmUgcmFuZG9tIG51bWJlclxyXG4gICAgIHZhciByYW5kb21BcnIgPSBbXHJcbiAgICAgICAgIHV0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZShyYW5nZUxvd2VyLCByYW5nZVVwcGVyLCBmYWxzZSksXHJcbiAgICAgICAgIHV0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgtcmFuZ2VMb3dlciwgLXJhbmdlVXBwZXIsIGZhbHNlKV07XHJcblxyXG4gICAgIC8vXHRDb2xvciB2YWxpZGl0eSBjaGVja2luZyBpbiBhZGp1c3RDb2xvckJyaWdodG5lc3NcclxuICAgICByZXR1cm4gYWRqdXN0Q29sb3JCcmlnaHRuZXNzKGJhc2VDb2xvciwgcmFuZG9tQXJyW3V0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCAyKV0pO1xyXG4gfVxyXG5cclxuLypcclxuICogIEZ1bmN0aW9uIHRvIGdlbmVyYXRlIHJhbmRvbSBncmFkaWVudCBjb2xvciB3aXRoIHJhbmRvbSBicmlnaHRuZXNzIG9uIGJvdGggc2lkZXNcclxuICogIG9mIHRoZSBsaW5lYXIgZ3JhZGllbnQgYmFzZWQgb24gYSBnaXZlbiBjb2xvclxyXG4gKlxyXG4gKlx0QHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcGFpciBvZiBjb2xvcnNcclxuICogIEBwYXJhbSB7c3RyaW5nfSBiYXNlQ29sb3I6IEEgY29sb3Igc3RyaW5nIGluIEhFWCwgUkdCIG9yIFJHQkFcclxuICpcdEBwYXJhbSB7ZmxvYXR9IGJyaWdodG5lc3NJbnRlbnNpdHkoT3B0aW9uYWwpOiBUaGUgYnJpZ2h0bmVzcyBpbnRlbnNpdHkgd2l0aGluIFswLCAxXSB0byBnZW5lcmF0ZVxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgYXJvdW5kLiBUaGUgc2FtZSBhcyB0aGUgb25lIGluIHJhbmRvbUNvbG9yXHJcbiAqL1xyXG4gZnVuY3Rpb24gcmFuZG9tR3JhZGllbnQoYmFzZUNvbG9yLCBicmlnaHRuZXNzSW50ZW5zaXR5KSB7XHJcbiAgICAgYnJpZ2h0bmVzc0ludGVuc2l0eSA9IGJyaWdodG5lc3NJbnRlbnNpdHkgfHwgMC41O1xyXG4gICAgIHJldHVybiB7XHJcbiAgICAgICAgIGZpcnN0OiByYW5kb21Db2xvcihiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpLFxyXG4gICAgICAgICBzZWNvbmQ6IHJhbmRvbUNvbG9yKGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSlcclxuICAgICB9O1xyXG4gfVxyXG5cclxuLy8gIEV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMuaXNIZXggPSBpc0hleDtcclxubW9kdWxlLmV4cG9ydHMuaXNSZ2IgPSBpc1JnYjtcclxubW9kdWxlLmV4cG9ydHMuaXNSZ2JhID0gaXNSZ2JhO1xyXG5tb2R1bGUuZXhwb3J0cy5oZXhUb1JnYiA9IGhleFRvUmdiO1xyXG5tb2R1bGUuZXhwb3J0cy5hZGp1c3RDb2xvckJyaWdodG5lc3MgPSBhZGp1c3RDb2xvckJyaWdodG5lc3M7XHJcbm1vZHVsZS5leHBvcnRzLnJhbmRvbUNvbG9yID0gcmFuZG9tQ29sb3I7XHJcbm1vZHVsZS5leHBvcnRzLnJhbmRvbUdyYWRpZW50ID0gcmFuZG9tR3JhZGllbnQ7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29sb3JVdGlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG4vKlxyXG4gKiBNb2RlIG9iamVjdFxyXG4gKlxyXG4gKiBUaGUgbW9kZSBvYmplY3QgKGUuZy4gJ1BvbHlnb25hbCcpIHJlc3BvbnNpYmxlIGZvciBnZW5lcmF0aW5nIHByaW1pdGl2ZSBzaGFwZXNcclxuICogdG8gZHJhdyB3aXRoXHJcbiAqL1xyXG5cclxuIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIC8vIERlcGVuZGVuY2llc1xyXG4gLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gdmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG4gdmFyIEdyYXBoID0gcmVxdWlyZSgnLi9ncmFwaCcpO1xyXG4gdmFyIFZlY3RvciA9IHJlcXVpcmUoJy4vdmVjdG9yJyk7XHJcbiB2YXIgdCA9IHJlcXVpcmUoJy4vLi4vdGVzdC90ZXN0Jyk7XHJcblxyXG4vKlxyXG4gKiBCYXNlIG1vZGUgY2xhc3MgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtOdW1iZXJ9IGNhbnZhc1dpZHRoOiBUaGUgd2lkdGggb2YgdGhlIGNhbnZhc1xyXG4gKiBAcGFyYW0ge051bWJlcn0gY2FudmFzSGVpZ2h0OiBUaGUgaGVpZ2h0IG9mIHRoZSBjYW52YXNcclxuICogQHBhcmFtIHtTdHJpbmcoQXJncyl9IGJhc2VDb2xvcnM6IGEgc2V0IG9mIHZhcmlhYmxlIG51bWJlciBvZiBjb2xvciBzdHJpbmdzIHVzZWRcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzIHRoZSBiYXNlIGNvbG9ycyBvZiB0aGUgYmFja2dyb3VuZFxyXG4gKi9cclxuZnVuY3Rpb24gTW9kZShjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0LCBiYXNlQ29sb3JzKSB7XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBCYXNlIGNsYXNzIG1lbWJlcnNcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdGhpcy5fYmFzZUNvbG9ycyA9IEFycmF5LmZyb20oYXJndW1lbnRzKS5zbGljZSgyLCBhcmd1bWVudHMubGVuZ3RoKTtcclxuICAgIHRoaXMuX3ByaW1pdGl2ZXMgPSBbXTtcclxuICAgIHRoaXMuX3dpZHRoID0gY2FudmFzV2lkdGggfHwgMDtcclxuICAgIHRoaXMuX2hlaWdodCA9IGNhbnZhc0hlaWdodCB8fCAwO1xyXG59XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgdmlydHVhbCBmdW5jdGlvbiAtIHJldHVybiBhbiBhcnJheSBvZiB0aGUgcHJpbWl0aXZlIHNoYXBlcyB0byBkcmF3IHdpdGhcclxuICpcclxuICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIHByaW1pdGl2ZSBzaGFwZXNcclxuICovXHJcbk1vZGUucHJvdG90eXBlLmdldFByaW1pdGl2ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9wcmltaXRpdmVzO1xyXG59O1xyXG5cclxuLypcclxuICogUG9seWdvbmFsIG1vZGUgY2xhc3MgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtmbG9hdH0gZGVuc2l0eTogVGhlIGRlbnNpdHkgb2YgdGhlIHBvbHlnb25zLCBpbiB0aGUgcmFuZ2Ugb2YgWzAsIDFdLlxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAwIGlzIHRoZSBzcGFyc2VzdCBhbmQgMSBpcyB0aGUgZGVuc2VzdC5cclxuICogQHBhcmFtIHtTdHJpbmcoQXJncyl9IGJhc2VDb2xvcnM6IGEgc2V0IG9mIHZhcmlhYmxlIG51bWJlciBvZiBjb2xvciBzdHJpbmdzIHVzZWRcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzIHRoZSBiYXNlIGNvbG9ycyBvZiB0aGUgYmFja2dyb3VuZFxyXG4gKiBAcGFyYW0ge051bWJlcn0gY2FudmFzV2lkdGg6IFRoZSB3aWR0aCBvZiB0aGUgY2FudmFzXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNIZWlnaHQ6IFRoZSBoZWlnaHQgb2YgdGhlIGNhbnZhc1xyXG5cclxuICovXHJcbmZ1bmN0aW9uIFBvbHlnb25hbE1vZGUoZGVuc2l0eSwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCwgYmFzZUNvbG9ycykge1xyXG4gICAgLy8gIENhbGwgdGhlIGJhc2UgY29uc3RydWN0b3IgYW5kIGluaXQgYmFzZSBjbGFzcyBtZW1iZXJzXHJcbiAgICBQb2x5Z29uYWxNb2RlLl9zdXBlci5hcHBseSh0aGlzLCBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoMSwgYXJndW1lbnRzLmxlbmd0aCkpO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIENsYXNzLXNwZWNpZmljIG1lbWJlcnNcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdGhpcy5fZGVuc2l0eSA9IGRlbnNpdHkgfHwgMC41O1xyXG4gICAgdGhpcy5fZGVuc2l0eSA9IDEgLSB0aGlzLl9kZW5zaXR5O1xyXG59XHJcbnV0aWxzLmluaGVyaXQoUG9seWdvbmFsTW9kZSwgTW9kZSk7XHJcblxyXG4vLyAgVGhlIGJvdW5kcyBvZiByYXRpb1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fVVBQRVJfQk9VTkQgPSAwLjU7XHJcblBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19MT1dFUl9CT1VORCA9IDAuMDA1O1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fRElGID1cclxuICAgIFBvbHlnb25hbE1vZGUucHJvdG90eXBlLkRFTlNJVFlfUkFUT19VUFBFUl9CT1VORCAtXHJcbiAgICBQb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fTE9XRVJfQk9VTkQ7XHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIGhlbHBlciBmdW5jdGlvbiAtIGdlbmVyYXRlIHBvaW50cyB0byBkcmF3IHdpdGhcclxuICogSXQgZGl2aWRlcyB0aGUgd2hvbGUgY2FudmFzIGludG8gc21hbGwgZ3JpZHMgYW5kIGdlbmVyYXRlIGEgcmFuZG9tIHBvaW50IGluIGV2ZXJ5XHJcbiAqIGdyaWRcclxuICpcclxuICogQHJldHVybiBub25lXHJcbiAqL1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5fZ2VuZXJhdGVQcmltaXRpdmVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgV2lkdGggYW5kIGhlaWdodCBvZiBldmVyeSBzbWFsbCBncmlkXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgcmF0aW8gPSB0aGlzLkRFTlNJVFlfUkFUT19MT1dFUl9CT1VORCArIHRoaXMuREVOU0lUWV9SQVRPX0RJRiAqIHRoaXMuX2RlbnNpdHk7XHJcbiAgICB2YXIgd2lkdGhJbnRlcnZhbCA9ICByYXRpbyAqIHRoaXMuX3dpZHRoLFxyXG4gICAgICAgIGhlaWdodEludGVydmFsID0gcmF0aW8gKiB0aGlzLl9oZWlnaHQ7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQ291bnRzIG9mIHJvd3MgYW5kIGNvbHVtbnMgcGx1cyB0aGUgdG9wXHJcbiAgICAvLyAgYW5kIGxlZnQgYm91bmRzIG9mIHRoZSByZWN0YW5nbGVcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdmFyIHJvd0NvdW50ID0gTWF0aC5mbG9vcih0aGlzLl93aWR0aCAvIHdpZHRoSW50ZXJ2YWwpICsgMSxcclxuICAgICAgICBjb2xDb3VudCA9IE1hdGguZmxvb3IodGhpcy5faGVpZ2h0IC8gaGVpZ2h0SW50ZXJ2YWwpICsgMTtcclxuXHJcbiAgICAvLyAgVXNlIGEgZ3JhcGggdG8gcmVwcmVzZW50IHRoZSBncmlkcyBvbiB0aGUgY2FudmFzXHJcbiAgICB2YXIgZ3JhcGggPSBuZXcgR3JhcGgocm93Q291bnQsIGNvbENvdW50KTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBQb2ludHMgb2YgZXZlcnkgc21hbGwgZ3JpZFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB2YXIgcDEgPSBuZXcgVmVjdG9yKDAsIDApLFxyXG4gICAgICAgIHAyID0gbmV3IFZlY3Rvcih3aWR0aEludGVydmFsLCAwKSxcclxuICAgICAgICBwMyA9IG5ldyBWZWN0b3Iod2lkdGhJbnRlcnZhbCwgaGVpZ2h0SW50ZXJ2YWwpLFxyXG4gICAgICAgIHA0ID0gbmV3IFZlY3RvcigwLCBoZWlnaHRJbnRlcnZhbCk7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIFJhbmRvbWx5IGdlbmVyYXRlIHBvaW50cyBvbiB0aGUgY2FudmFzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbENvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgdmFyIHJhbmRQb2ludDtcclxuXHJcbiAgICAgICAgICAgIGlmIChqID09PSAwKSB7ICAvLyAgSWYgYXQgdGhlIGxlZnQgYm91bmRcclxuICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHAxLCBwMSwgcDQsIHA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChqID09PSBjb2xDb3VudCAtIDEpIHsgICAvLyAgSWYgYXQgdGhlIHJpZ2h0IGJvdW5kXHJcbiAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSB1dGlscy5nZXRSYW5kb21Qb2ludE9uUmVjdChwMiwgcDIsIHAzLCBwMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkgeyAgIC8vICBJZiBhdCB0aGUgdG9wIGJvdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gdXRpbHMuZ2V0UmFuZG9tUG9pbnRPblJlY3QocDEsIHAyLCBwMiwgcDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaSA9PT0gcm93Q291bnQgLSAxKSB7ICAgLy8gIElmIGF0IHRoZSBib3R0b20gYm91bmRcclxuICAgICAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSB1dGlscy5nZXRSYW5kb21Qb2ludE9uUmVjdChwNCwgcDMsIHAzLCBwNCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSB1dGlscy5nZXRSYW5kb21Qb2ludE9uUmVjdChwMSwgcDIsIHAzLCBwNCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ3JhcGguaW5zZXJ0KGksIGosIHJhbmRQb2ludCk7XHJcblxyXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgLy8gIE1vdmUgdGhlIGN1cnJlbnQgc21hbGwgZ3JpZCB0byB0aGVcclxuICAgICAgICAgICAgLy8gIHJpZ2h0IGJ5IG9uZSBpbnRlcnZhbCB1bml0XHJcbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICBwMS54ICs9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgICAgIHAyLnggKz0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICAgICAgcDMueCArPSB3aWR0aEludGVydmFsO1xyXG4gICAgICAgICAgICBwNC54ICs9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vICBNb3ZlIHRoZSBjdXJyZW50IHNtYWxsIGdyaWQgYmFjayB0byB0aGVcclxuICAgICAgICAvLyAgbGVmdCBtb3N0IGJvdW5kIGFuZCBtb3ZlIGl0IGRvd24gYnkgb25lIGludGVydmFsIHVuaXRcclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICBwMS54ID0gcDQueCA9IDA7XHJcbiAgICAgICAgcDIueCA9IHAzLnggPSB3aWR0aEludGVydmFsO1xyXG4gICAgICAgIHAxLnkgKz0gaGVpZ2h0SW50ZXJ2YWw7XHJcbiAgICAgICAgcDIueSArPSBoZWlnaHRJbnRlcnZhbDtcclxuICAgICAgICBwMy55ICs9IGhlaWdodEludGVydmFsO1xyXG4gICAgICAgIHA0LnkgKz0gaGVpZ2h0SW50ZXJ2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBBcyB3ZSBhcmUgZ29pbmcgdG8gY2hlY2sgYWRqYWNlbnQgdmVydGljZXNcclxuICAgIC8vICBpdCdzIGVhc2llciB0byBzdG9yZSBhbGwgZGVsdGEgaW5kZXggdmFsdWVzIGFuZFxyXG4gICAgLy8gIGxvb3Agb3ZlciB0aGVtXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdmFyIGRpID0gWy0xLCAtMSwgLTEsICAwLCAgMSwgMSwgMSwgMF0sXHJcbiAgICAgICAgZGogPSBbLTEsICAwLCAgMSwgIDEsICAxLCAwLCAtMSwgLTFdO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIENvbm5lY3QgYWxsIGFkamFjZW50IHZlcnRpY2VzXHJcbiAgICAvLyAgYW5kIGdldCBhbGwgcHJpbWl0aXZlc1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbENvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IGNudCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBmaXJzdFBvaW50LCBwcmV2UG9pbnQ7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZGkubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyUG9pbnQgPSBncmFwaC5nZXQoaSArIGRpW2tdLCBqICsgZGpba10pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJQb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXBoLmNvbm5lY3QoaSwgaiwgaSArIGRpW2tdLCBqICsgZGpba10pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY250ID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0UG9pbnQgPSBjdXJyUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmltaXRpdmVzLnB1c2gobmV3IHV0aWxzLlBvbHlnb24oW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGguZ2V0KGksIGopLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldlBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclBvaW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldlBvaW50ID0gY3VyclBvaW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmaXJzdFBvaW50ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIHByZXZQb2ludCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICAhZmlyc3RQb2ludC5lcXVhbChsYXN0UG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmltaXRpdmVzLnB1c2gobmV3IHV0aWxzLlBvbHlnb24oW1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXBoLmdldChpLCBqKSxcclxuICAgICAgICAgICAgICAgICAgICBwcmV2UG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RQb2ludFxyXG4gICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX2dlbmVyYXRlUHJpbWl0aXZlcygpO1xyXG59O1xyXG5cclxuLy8gIEV4cG9ydCBhbiBvYmplY3QgZm9yIGRpcmVjdCBsb29rdXBcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBQb2x5Z29uYWw6IFBvbHlnb25hbE1vZGVcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9tb2Rlcy5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuLypcclxuICogVW5kaXJlY3RlZCBhY3lsaWMgZ3JhcGggZGF0YSBzdHJ1Y3R1cmUgdXNpbmdcclxuICogYWRqYWNlbnkgbWF0cml4IGFzIGltcGxlbWVudGF0aW9uXHJcbiAqXHJcbiAqL1xyXG5cclxuLypcclxuICogR3JhcGggY2xhc3MgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtJbnRlZ2VyfSByb3dDb3VudDogVGhlIG51bWJlciBvZiByb3dzXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gY29sdW1uQ291bnQ6IFRoZSBudW1iZXIgb2YgY29sdW1uc1xyXG4gKiBAb2FyYW0ge05vbi1vYmplY3QgdHlwZXN9IGluaXRpYWxWYWx1ZShPcHRpb25hbCk6IGluaXRpYWxWYWx1ZSBmb3IgYWxsIGVsZW1lbnRzIGluIHRoZSBncmFwaC4gSXQncyAwIGJ5IGRlZmF1bHQuXHJcbiAqL1xyXG5mdW5jdGlvbiBHcmFwaChyb3dDb3VudCwgY29sdW1uQ291bnQsIGluaXRpYWxWYWx1ZSkge1xyXG4gICAgdGhpcy5fcm93Q291bnQgPSByb3dDb3VudCB8fCAwO1xyXG4gICAgdGhpcy5fY29sdW1uQ291bnQgPSBjb2x1bW5Db3VudCB8fCAwO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQWxsb2NhdGUgYW4gZW1wdHkgbWF0cml4XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdGhpcy5fZGF0YSA9IG5ldyBBcnJheShyb3dDb3VudCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICB0aGlzLl9kYXRhW2ldID0gbmV3IEFycmF5KGNvbHVtbkNvdW50KS5maWxsKGluaXRpYWxWYWx1ZSB8fCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9lZGdlcyA9IHt9O1xyXG59XHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIG1lbWJlciBmdW5jdGlvbiAtIGNoZWNrIGlmIGEgcGFpciBvZiBwb3NpdGlvbnMgaXMgaW4gdGhlIHJhbmdlIG9mIHJvd3MgYW5kIGNvbHVtbnNcclxuICpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgcGFpciBvZiBwb3NpdGlvbnMgaXMgaW4gdGhlIGJvdW5kIGFuZCBmYWxzZSBpZiBub3RcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5fY2hlY2tCb3VuZCA9IGZ1bmN0aW9uKGksIGopIHtcclxuICAgIGlmIChpID49IHRoaXMuX3Jvd0NvdW50IHx8XHJcbiAgICAgICAgaiA+PSB0aGlzLl9jb2x1bW5Db3VudCB8fFxyXG4gICAgICAgIGkgPCAwIHx8IGogPCAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFByaXZhdGUgbWVtYmVyIGZ1bmN0aW9uIC0gZ2V0IGFuIGlkIGZyb20gYSBwYWlyIG9mIHBvc2l0aW9uc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBpZCBvZiB0aGUgcGFpciBvZiBwb3NpdGlvbnNcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5fZ2V0SWQgPSBmdW5jdGlvbihpLCBqKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fY2hlY2tCb3VuZChpLCBqKSA/IGkudG9TdHJpbmcoKSArIGoudG9TdHJpbmcoKSA6IG51bGw7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gcmV0dXJuIHRoZSBjb3VudCBvZiByb3dzXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUucm93Q291bnQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9yb3dDb3VudDtcclxufTtcclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIHJldHVybiB0aGUgY291bnQgb2YgY29sdW1uc1xyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmNvbHVtbkNvdW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fY29sdW1uQ291bnQ7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gaW5zZXJ0IGFuIGVsZW1lbnQgdG8gdGhlIGdyYXBoXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgaW5zZXJ0aW9uIGlzIHN1Y2Nlc3NmdWwgYW5kIGZhbHNlIGlmIG5vdFxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGk6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGo6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0FueX0gdmFsdWU6IFRoZSB2YWx1ZSB0byBpbnNlcnRcclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihpLCBqLCB2YWx1ZSkge1xyXG4gICAgaWYgKHRoaXMuX2NoZWNrQm91bmQoaSwgaikpIHtcclxuICAgICAgICB0aGlzLl9kYXRhW2ldW2pdID0gdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBnZXQgYSBlbGVtZW50IGZyb20gYSBwYWlyIG9mIHBvc2l0aW9uXHJcbiAqXHJcbiAqIEByZXR1cm4ge0FueSAvIG51bGx9IFRoZSBlbGVtZW50IGF0IHRoZSBwb3NpdGlvbiBpZiB0aGUgcGFpciBvZiBwb3NpdGlvbnMgaXMgaW4gdGhlIGJvdW5kXHJcbiAqICAgICAgICAgICAgICAgICAgICAgIGFuZCBudWxsIGlmIG5vdFxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGk6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGo6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGksIGopIHtcclxuICAgIGlmICh0aGlzLl9jaGVja0JvdW5kKGksIGopKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbaV1bal07XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGNoZWNrIGlmIHR3byB2ZXJ0aWNlcyBhcmUgY29ubmVjdGVkXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYSBjb25uZWN0aW9uIGJldHdlZW4gdHdvIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTEsIGkyOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqMSwgajI6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmlzQ29ubmVjdGVkID0gZnVuY3Rpb24oaTEsIGoxLCBpMiwgajIpIHtcclxuICAgIGlmICghdGhpcy5fY2hlY2tCb3VuZChpMSwgajEpIHx8XHJcbiAgICAgICAgIXRoaXMuX2NoZWNrQm91bmQoaTIsIGoyKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHZhciBpZDEgPSB0aGlzLl9nZXRJZChpMSwgajEpLFxyXG4gICAgICAgIGlkMiA9IHRoaXMuX2dldElkKGkyLCBqMik7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLl9lZGdlc1tpZDFdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9lZGdlc1tpZDFdW2lkMl07XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gY29ubmVjdCB0aGUgZWRnZSBvZiB0d28gdmVydGljZXNcclxuICpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgYWN0aW9uIGlzIHN1Y2Nlc3NmdWxcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpMSwgaTI6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGoxLCBqMjogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKGkxLCBqMSwgaTIsIGoyKSB7XHJcbiAgICBpZiAoIXRoaXMuX2NoZWNrQm91bmQoaTEsIGoxKSB8fFxyXG4gICAgICAgICF0aGlzLl9jaGVja0JvdW5kKGkyLCBqMikpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB2YXIgaWQxID0gdGhpcy5fZ2V0SWQoaTEsIGoxKSxcclxuICAgICAgICBpZDIgPSB0aGlzLl9nZXRJZChpMiwgajIpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5fZWRnZXNbaWQxXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aGlzLl9lZGdlc1tpZDFdID0ge307XHJcbiAgICB9XHJcbiAgICB0aGlzLl9lZGdlc1tpZDFdW2lkMl0gPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGRpc2Nvbm5lY3QgdGhlIGVkZ2Ugb2YgdHdvIHZlcnRpY2VzXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGFjdGlvbiBpcyBzdWNjZXNzZnVsXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTEsIGkyOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqMSwgajI6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbihpMSwgajEsIGkyLCBqMikge1xyXG4gICAgaWYgKCF0aGlzLl9jaGVja0JvdW5kKGkxLCBqMSkgfHxcclxuICAgICAgICAhdGhpcy5fY2hlY2tCb3VuZChpMiwgajIpKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgdmFyIGlkMSA9IHRoaXMuX2dldElkKGkxLCBqMSksXHJcbiAgICAgICAgaWQyID0gdGhpcy5fZ2V0SWQoaTIsIGoyKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMuX2VkZ2VzW2lkMV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9lZGdlc1tpZDFdW2lkMl0gPSBmYWxzZTtcclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8vICBFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzID0gR3JhcGg7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZ3JhcGguanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKmpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgT1VUUFVUOiBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1xcbicpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICB9LFxyXG4gICAgTE9HOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcclxuICAgIH1cclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3Rlc3QvdGVzdC5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=