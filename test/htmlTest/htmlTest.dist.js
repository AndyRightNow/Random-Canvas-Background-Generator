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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDhlMzcyZDkxNDFjZWUxN2YxYjAiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9odG1sVGVzdC9odG1sVGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sb3JVdGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFtQixxQ0FBcUM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDdkRBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVyxNQUFNO0FBQ2pC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Q0E7O0FBRUE7QUFDQSIsImZpbGUiOiJodG1sVGVzdC5kaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA0OGUzNzJkOTE0MWNlZTE3ZjFiMFxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi8uLi8uLi9zcmMvdmVjdG9yJyk7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vc3JjL3V0aWxzJyk7XHJcbnZhciBSYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yID0gcmVxdWlyZSgnLi8uLi8uLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvcicpO1xyXG52YXIgTW9kZXMgPSByZXF1aXJlKCcuLy4uLy4uL3NyYy9tb2RlcycpO1xyXG5cclxudmFyIGh0bWxUZXN0ID0ge307XHJcblxyXG5odG1sVGVzdC5ydW4gPSBmdW5jdGlvbihjYW52YXNJZCl7XHJcbiAgICB2YXIgcG9seU1vZGUgPSBuZXcgTW9kZXMuUG9seWdvbmFsKDAuNywgNjAwLCAzMDAsIFwiIzAwMDAwMFwiLCBcIiNGRkZGRkZcIik7XHJcbiAgICB2YXIgYmFjayA9IG5ldyBSYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yKCdjYW52YXMnKTtcclxuICAgIHBvbHlNb2RlLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2x5TW9kZS5nZXRQcmltaXRpdmVzKCkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhpLCBwb2x5TW9kZS5nZXRQcmltaXRpdmVzKClbaV0pO1xyXG4gICAgICAgIGJhY2suX2ZpbGxQb2x5Z29uKFwiIzQxODNEN1wiLCBwb2x5TW9kZS5nZXRQcmltaXRpdmVzKClbaV0sIHRydWUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBodG1sVGVzdDtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3Rlc3QvaHRtbFRlc3QvaHRtbFRlc3QuanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxyXG4gKiAgICAgICAgICAgICAgVmVjdG9yIENsYXNzXHJcbiAqXHJcbiAqICAgICAgVmVjdG9yIGFuZCB2ZWN0b3Igb3BlcmF0aW9ucy5cclxuICovXHJcblxyXG4vKlxyXG4gKiAgQ29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIFZlY3Rvcih4LCB5KXtcclxuXHR0aGlzLnggPSB4IHx8IDA7XHJcblx0dGhpcy55ID0geSB8fCAwO1xyXG59XHJcblxyXG5WZWN0b3IucHJvdG90eXBlLmVxdWFsID0gZnVuY3Rpb24odmVjKSB7XHJcblx0cmV0dXJuIHRoaXMueCA9PT0gdmVjLnggJiYgdGhpcy55ID09PSB2ZWMueTtcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odil7XHJcblx0cmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueTtcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUubGVuMiA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMuZG90KHRoaXMpO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5sZW4gPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBNYXRoLnNxcnQodGhpcy5sZW4yKCkpO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uKHN4LCBzeSl7XHJcblx0dGhpcy54ICo9IHN4O1xyXG5cdHRoaXMueSAqPSBzeSB8fCBzeDtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3Rvci5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24odil7XHJcblx0dGhpcy54IC09IHYueDtcclxuXHR0aGlzLnkgLT0gdi55O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHRObyBzaWRlIGVmZmVjdCBhbmQgY2hhaW5pbmdcclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblZlY3Rvci5wcm90b3R5cGUucHJvamVjdCA9IGZ1bmN0aW9uKGF4aXMpe1xyXG5cdHZhciBjb2YgPSAgdGhpcy5kb3QoYXhpcykgLyBheGlzLmxlbjIoKTtcclxuXHRyZXR1cm4gYXhpcy5zY2FsZShjb2YpO1xyXG59O1xyXG5cclxuVmVjdG9yLnByb3RvdHlwZS5wcm9qZWN0TiA9IGZ1bmN0aW9uKGF4aXMpe1xyXG5cdHZhciBjb2YgPSAgdGhpcy5kb3QoYXhpcyk7XHJcblx0cmV0dXJuIGF4aXMuc2NhbGUoY29mKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3ZlY3Rvci5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi92ZWN0b3InKTtcclxuXHJcbi8qXHJcbiAqXHRQb2x5Z29uIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50czogVGhlIHBvaW50cyBvZiB0aGUgcG9seWdvbi4gVGhleSBtdXN0IGJlIGluIGNsb2Nrd2lzZSBvciBjb3VudGVyLWNsb2Nrd2lzZSBvcmRlclxyXG4gKi9cclxuZnVuY3Rpb24gUG9seWdvbihwb2ludHMpIHtcclxuICAgIHRoaXMuX3BvaW50cyA9IHBvaW50cyB8fCBbXTtcclxufVxyXG5Qb2x5Z29uLnByb3RvdHlwZSA9IHtcclxuICAgIGdldCBwb2ludHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50cztcclxuICAgIH0sXHJcblxyXG4gICAgc2V0IHBvaW50cyhwb2ludHMpIHtcclxuICAgICAgICB0aGlzLl9wb2ludHMgPSBwb2ludHM7XHJcbiAgICB9LFxyXG5cclxuICAgIGVxdWFsOiBmdW5jdGlvbihwb2x5Z29uKSB7XHJcbiAgICAgICAgdmFyIHJldmVyc2VkID0gcG9seWdvbi5wb2ludHM7XHJcbiAgICAgICAgcmV2ZXJzZWQucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludHMuZXZlcnkoZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuZXF1YWwocG9seWdvbi5wb2ludHNbaW5kZXhdKTtcclxuICAgICAgICB9KSB8fCB0aGlzLnBvaW50cy5ldmVyeShmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5lcXVhbChyZXZlcnNlZFtpbmRleF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLypcclxuICogIENsYW1wIGEgbnVtYmVyIHdpdGhpbiBhIHJhbmdlXHJcbiAqL1xyXG5mdW5jdGlvbiBjbGFtcCh4LCBsb3dlciwgdXBwZXIpe1xyXG4gICAgcmV0dXJuIHggPCBsb3dlciA/IGxvd2VyIDogeCA+IHVwcGVyID8gdXBwZXIgOiB4O1xyXG59XHJcblxyXG4vKlxyXG4gKlx0R2V0IGEgcmFuZG9tIG51bWJlciBmcm9tIGEgcmFuZ2VcclxuICpcclxuICpcdEByZXR1cm4ge2ludCAvIGZsb2F0fSBBIHJhbmRvbWx5IGdlbmVyYXRlZCBudW1iZXIgd2l0aGluIGEgcmFuZ2VcclxuICpcdEBwYXJhbSB7aW50IC8gZmxvYXR9IGxvd2VyOiBUaGUgbG93ZXIgYm91bmQgb2YgdGhlIHJhbmdlKEluY2x1c2l2ZSlcclxuICpcdEBwYXJhbSB7aW50IC8gZmxvYXR9IHVwcGVyOiBUaGUgdXBwZXIgYm91bmQgb2YgdGhlIHJhbmdlKEV4Y2x1c2l2ZSlcclxuICpcdEBwYXJhbSB7Ym9vbGVhbn0gaXNJbnQ6IFRoZSBmbGFnIHRvIHNwZWNpZnkgd2hldGhlciB0aGUgcmVzdWx0IGlzIGludCBvciBmbG9hdFxyXG4gKi9cclxuIGZ1bmN0aW9uIGdldFJhbmRvbU51bWJlckZyb21SYW5nZShsb3dlciwgdXBwZXIsIGlzSW50KSB7XHJcbiAgICAgaWYgKGxvd2VyID49IHVwcGVyKSByZXR1cm4gMDtcclxuICAgICBpc0ludCA9IGlzSW50IHx8IHRydWU7XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvL1x0U29tZSByYW5kb20gbnVtYmVycyBqdXN0IGNvbWluZyBvdXQgb2Ygbm93aGVyZVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdmFyIHNvbWVSYW5kb21OdW1iZXIxID0gMTI4NSxcclxuICAgICAgICBzb21lUmFuZG9tTnVtYmVyMiA9IDIzOTE7XHJcblxyXG4gICAgLy9cdEdlbmVyYXRlIHRoZSBpbnRlZ2VyIHBhcnRcclxuICAgIHZhciByYW5kb21JbnQgPVxyXG4gICAgICAgIHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBzb21lUmFuZG9tTnVtYmVyMSAqIE1hdGgucmFuZG9tKCkgKiBzb21lUmFuZG9tTnVtYmVyMikgJSAodXBwZXIgLSBsb3dlcik7XHJcblxyXG4gICAgaWYgKGlzSW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGxvd2VyICsgcmFuZG9tSW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbG93ZXIgKyByYW5kb21JbnQgKyBNYXRoLnJhbmRvbSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG4gKiAgR2V0IGEgcmFuZG9tIHBvaW50IG9uIGEgcmVjdGFuZ2xlXHJcbiAqXHJcbiAqXHRAcGFyYW0ge1ZlY3Rvcn0gcDEsIHAyLCBwMywgcDQ6IFBvaW50cyBvZiBhIHJlY3RhbmdsZSBzdGFydGluZ1xyXG4gKlx0XHRcdFx0XHRcdFx0XHQgICBmcm9tIHRoZSB0b3AgbGVmdCBjb3JuZXIgYW5kIGdvaW5nXHJcbiAqXHRcdFx0XHRcdFx0XHRcdCAgIGNsb2Nrd2lzZS5cclxuICpcdEBwYXJhbSB7Ym9vbGVhbn0gaXNJbnQ6IFRoZSBmbGFnIHRvIHNwZWNpZnkgd2hldGhlciB0aGUgcmVzdWx0IGlzIGludCBvciBmbG9hdFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmFuZG9tUG9pbnRPblJlY3QocDEsIHAyLCBwMywgcDQsIGlzSW50KSB7XHJcbiAgICBpc0ludCA9IGlzSW50IHx8IHRydWU7XHJcbiAgICB2YXIgd2lkdGggPSBNYXRoLmFicyhwMi54IC0gcDEueCksXHJcbiAgICAgICAgaGVpZ2h0ID0gTWF0aC5hYnMocDMueSAtIHAyLnkpLFxyXG4gICAgICAgIHRvcExlZnRYID0gTWF0aC5taW4ocDEueCwgcDIueCwgcDMueCwgcDQueCksXHJcbiAgICAgICAgdG9wTGVmdFkgPSBNYXRoLm1pbihwMS55LCBwMi55LCBwMy55LCBwNC55KTtcclxuXHJcbiAgICB2YXIgcmFuZG9tRGVsdGFYID0gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIHdpZHRoLCBpc0ludCksXHJcbiAgICAgICAgcmFuZG9tRGVsdGFZID0gZ2V0UmFuZG9tTnVtYmVyRnJvbVJhbmdlKDAsIGhlaWdodCwgaXNJbnQpO1xyXG5cclxuICAgIHJldHVybiBuZXcgVmVjdG9yKHRvcExlZnRYICsgcmFuZG9tRGVsdGFYLCB0b3BMZWZ0WSArIHJhbmRvbURlbHRhWSk7XHJcbn1cclxuXHJcbi8qXHJcbiAqICBHZXQgYSByYW5kb20gcG9pbnQgb24gYSBsaW5lXHJcbiAqICBAcGFyYW0ge1ZlY3Rvcn0gcDEsIHAyOiBQb2ludHMgb2YgYSBsaW5lIGZyb20gbGVmdCB0byByaWdodFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmFuZG9tUG9pbnRPbkxpbmUocDEsIHAyKSB7XHJcbiAgICB2YXIgcHJvamVjdGlvbldpZHRoID0gTWF0aC5hYnMocDEueCAtIHAyLngpLFxyXG4gICAgICAgIGxlZnRYID0gTWF0aC5taW4ocDEueCwgcDIueCk7XHJcblxyXG4gICAgdmFyIEEgPSAocDEueSAtIHAyLnkpIC8gKHAxLnggLSBwMi54KSxcclxuICAgICAgICBCID0gcDEueSAtIEEgKiBwMS54O1xyXG5cclxuICAgIHZhciByYW5kb21EZWx0YVggPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgcHJvamVjdGlvbldpZHRoLCBmYWxzZSk7XHJcbiAgICByZXR1cm4gbmV3IFZlY3RvcihsZWZ0WCArIHJhbmRvbURlbHRhWCwgQSAqIChsZWZ0WCArIHJhbmRvbURlbHRhWCkgKyBCKTtcclxufVxyXG5cclxuLypcclxuICogSGVscGVyIGZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlIGluaGVyaXRhbmNlXHJcbiAqXHJcbiAqIEByZXR1cm4gbm9uZVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdG9yOiBUaGUgY29uc3RydWN0b3Igb2YgdGhlIGN1cnJlbnQgb2JqZWN0XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN1cGVyQ3RvcjogVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBwYXJlbnQgb2JqZWN0XHJcbiAqL1xyXG4gZnVuY3Rpb24gaW5oZXJpdChjdG9yLCBzdXBlckN0b3IpIHtcclxuICAgICBjdG9yLl9zdXBlciA9IHN1cGVyQ3RvcjtcclxuICAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xyXG4gICAgICAgICBjb25zdHJ1Y3Rvcjoge1xyXG4gICAgICAgICAgICAgdmFsdWU6IGN0b3IsXHJcbiAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgIH1cclxuICAgICB9KTtcclxuIH1cclxuXHJcbi8vICBFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzLlBvbHlnb24gPSBQb2x5Z29uO1xyXG5tb2R1bGUuZXhwb3J0cy5jbGFtcCA9IGNsYW1wO1xyXG5tb2R1bGUuZXhwb3J0cy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UgPSBnZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2U7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbVBvaW50T25SZWN0ID0gZ2V0UmFuZG9tUG9pbnRPblJlY3Q7XHJcbm1vZHVsZS5leHBvcnRzLmdldFJhbmRvbVBvaW50T25MaW5lID0gZ2V0UmFuZG9tUG9pbnRPbkxpbmU7XHJcbm1vZHVsZS5leHBvcnRzLmluaGVyaXQgPSBpbmhlcml0O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG4vKlxyXG4gKiBSYW5kb20gQ2FudmFzIEJhY2tncm91bmQgR2VuZXJhdG9yXHJcbiAqXHJcbiAqIEl0J3MgdXNlZCBvbiBIVE1MIENhbnZhcyB0byBnZW5lcmF0ZSByYW5kb20gYmFja2dyb3VuZCBpbiBhIGNlcnRhaW4gcGF0dGVyblxyXG4gKiB3aXRoIGNlcnRhaW4gY3VzdG9taXplZCBwYXJhbWV0ZXJzIGFuZCBtb2Rlcy4gVGhlIGJhY2tncm91bmRcclxuICogd2lsbCB1cGRhdGUgZXZlcnkgdGltZSB5b3UgY2FsbCBnZW5lcmF0ZSgpXHJcbiAqXHJcbiAqL1xyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHREZXBlbmRlbmNpZXNcclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxudmFyIGNvbG9yVXRpbHMgPSByZXF1aXJlKCcuL2NvbG9yVXRpbHMnKTtcclxudmFyIFZlY3RvciA9IHJlcXVpcmUoJy4vdmVjdG9yJyk7XHJcblxyXG4vKlxyXG4qXHRDb25zdGFudCBzdHJpbmcgbmFtZVxyXG4qL1xyXG5jb25zdCBQT0xZR09OQUwgPSBcIlBvbHlnb25hbFwiO1xyXG5cclxuLypcclxuKiBDb25zdHJ1Y3RvclxyXG4qXHJcbiogQHBhcmFtIHtzdHJpbmd9IGNhbnZhc0lkOiBUaGUgaWQgb2YgdGhlIGNhbnZhcyB5b3Ugd2FudCB0byBnZW5lcmF0ZSBiYWNrZ3JvdW5kIG9uXHJcbiogQHBhcmFtIHtzdHJpbmd9IG1vZGU6IFRoZSBwYXR0ZXJuIGluIHdoaWNoIHRoZSBiYWNrZ3JvdW5kIGlzIGdlbmVyYXRlZC5cclxuKlx0XHRcdFx0XHRcdCBDdXJyZW50bHkgU3VwcG9ydDogMS4gXCJQb2x5Z29uYWxcIlxyXG4qL1xyXG5mdW5jdGlvbiBSYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yKGNhbnZhc0lkLCBtb2RlKSB7XHJcblx0Ly9cdEluaXRpYWxpemVcclxuXHR0aGlzLl9tb2RlID0gbW9kZSB8fCBQT0xZR09OQUw7XHJcblx0dGhpcy5fY2FudmFzID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKSA6IG51bGw7XHJcblx0dGhpcy5fY2FudmFzQ29udGV4dCA9IHRoaXMuX2NhbnZhcyA/IHRoaXMuX2NhbnZhcy5nZXRDb250ZXh0KCcyZCcpIDogbnVsbDtcclxufVxyXG5cclxuLypcclxuICogUHJpdmF0ZSBoZWxwZXIgZnVuY3Rpb24gdXNlZCB0byBkcmF3IHBvbHlnb24gb24gdGhlIGNhbnZhc1xyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29sb3I6IEEgSEVYLCBSR0Igb3IgUkdCQSBjb2xvciBpbiB0aGUgZm9ybSBvZlxyXG4gKlx0XHRcdFx0XHRcdCAgIFwiIzAwMDAwMFwiLCBcInJnYigwLCAwLCAwKVwiIG9yIFwicmdiYSgwLCAwLCAwLCAxKVwiXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50czogQW4gYXJyYXkgb2YgUG9pbnQgb2JqZWN0c1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGdyYWRpZW50OiBBIGZsYWcgaW5kaWNhdGluZyBpZiBsaW5lYXItZ3JhZGllbnQgaXMgZW5hYmxlZC5cclxuICpcdFx0XHRcdFx0XHRcdCAgIFRoZSBncmFkaWVudCB3aWxsIGJlIHJhbmRvbWx5IGdlbmVyYXRlZC5cclxuICpcclxuICovXHJcblJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3IucHJvdG90eXBlLl9maWxsUG9seWdvbiA9IGZ1bmN0aW9uKGNvbG9yLCBwb2x5Z29uLCBncmFkaWVudCkge1xyXG5cdGdyYWRpZW50ID0gZ3JhZGllbnQgfHwgZmFsc2U7XHJcblxyXG5cdC8vXHRTYXZlIHRoZSBwcmV2aW91cyBzdGF0ZXNcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LnNhdmUoKTtcclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvL1x0U2V0IHRoZSBjb2xvclxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0aWYgKGdyYWRpZW50KSB7XHJcblx0XHRpZiAocG9seWdvbi5wb2ludHMubGVuZ3RoID09PSAzKSB7XHQvL1x0SWYgaXQncyBhIHRyaWFuZ2xlXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvL1x0U3RhcnQgYW5kIGVuZCBwb2ludHMgb2YgdGhlIGxpbmVhciBncmFkaWVudFxyXG5cdFx0XHQvL1x0VGhlIHN0YXJ0IHBvaW50IGlzIHJhbmRvbWx5IHNlbGVjdGVkXHJcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRsZXQgc3RhcnRQb2ludCA9IHBvbHlnb24ucG9pbnRzW3V0aWxzLmdldFJhbmRvbU51bWJlckZyb21SYW5nZSgwLCBwb2x5Z29uLnBvaW50cy5sZW5ndGgpXTtcclxuXHRcdFx0bGV0IGVuZFBvaW50O1xyXG5cclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdC8vXHRGZXRjaCBwb2ludHMgb3RoZXIgdGhhbiB0aGUgc3RhcnQgcG9pbnRcclxuXHRcdFx0Ly9cdG91dCBvZiB0aGUgcG9seWdvblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0bGV0IGluZGV4ID0gcG9seWdvbi5wb2ludHMuaW5kZXhPZihzdGFydFBvaW50KTtcclxuXHRcdFx0bGV0IGxpbmUgPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwb2x5Z29uLnBvaW50cy5sZW5ndGg7IGkrKylcclxuXHRcdFx0XHRpZiAoaSAhPT0gaW5kZXgpIGxpbmUucHVzaChwb2x5Z29uLnBvaW50c1tpXSk7XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ly9cdFByb2plY3QgdGhlIHN0YXJ0IHBvaW50IHRvIHRoZSBsaW5lXHJcblx0XHRcdC8vXHRpdCdzIGZhY2luZyBhbmQgdGhhdCdzIHRoZSBlbmQgcG9pbnRcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdGxldCBheGlzID0gbmV3IFZlY3RvcihsaW5lWzBdLnggLSBsaW5lWzFdLngsIGxpbmVbMF0ueSAtIGxpbmVbMV0ueSk7XHJcblx0XHRcdGVuZFBvaW50ID0gc3RhcnRQb2ludC5wcm9qZWN0KGF4aXMpO1xyXG5cclxuXHRcdFx0Ly9cdENyZWF0ZSB0aGUgbGluZWFyIGdyYWRpZW50IG9iamVjdFxyXG5cdFx0XHRsZXQgZ3JhZCA9IHRoaXMuX2NhbnZhc0NvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXHJcblx0XHRcdFx0c3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xyXG5cclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ly9cdEdldCByYW5kb20gbGluZWFyIGdyYWRpZW50IGNvbG9yc1xyXG5cdFx0XHQvL1x0YW5kIGFkZCBjb2xvcnNcclxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0bGV0IHJhbmRvbUludGVuc2l0eSA9IE1hdGgucmFuZG9tKCkgKyAxICogMC41O1xyXG5cdFx0XHRsZXQgZ3JhZENvbG9ycyA9IGNvbG9yVXRpbHMucmFuZG9tR3JhZGllbnQoY29sb3JVdGlscy5yYW5kb21Db2xvcihjb2xvciksIHJhbmRvbUludGVuc2l0eSk7XHJcblx0XHRcdGdyYWQuYWRkQ29sb3JTdG9wKDAsIGdyYWRDb2xvcnMuZmlyc3QpO1xyXG5cdFx0XHRncmFkLmFkZENvbG9yU3RvcCgxLCBncmFkQ29sb3JzLnNlY29uZCk7XHJcblxyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWQ7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5fY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcclxuXHRcdH1cclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR0aGlzLl9jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG5cdH1cclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8vXHREcmF3IHRoZSBwb2x5Z29uXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdHRoaXMuX2NhbnZhc0NvbnRleHQuYmVnaW5QYXRoKCk7XHJcblx0dmFyIHBvaW50cyA9IHBvbHlnb24ucG9pbnRzO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHR0aGlzLl9jYW52YXNDb250ZXh0Lm1vdmVUbyhwb2ludHNbaV0ueCwgcG9pbnRzW2ldLnkpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fY2FudmFzQ29udGV4dC5saW5lVG8ocG9pbnRzW2ldLngsIHBvaW50c1tpXS55KTtcclxuXHRcdH1cclxuXHR9XHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHR0aGlzLl9jYW52YXNDb250ZXh0LmZpbGwoKTtcclxuXHJcblx0Ly9cdFJlc3RvcmUgcHJldmlvdXMgc3RhdGVzXHJcblx0dGhpcy5fY2FudmFzQ29udGV4dC5yZXN0b3JlKCk7XHJcbn07XHJcblxyXG5SYW5kb21CYWNrZ3JvdW5kR2VuZXJhdG9yLnByb3RvdHlwZS5nZW5lcmF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0Ly9cdENsZWFyIHRoZSBjYW52YXNcclxuXHJcblx0Ly9cdERyYXcgdGhlIGJhY2tncm91bmRcclxuXHRcdC8vXHRHZW5lcmF0ZSBwb2ludHMgb24gdGhlIGNhbnZhc1xyXG5cclxuXHRcdC8vXHRDb25uZWN0IGFsbCBhZGphY2VudCBwb2ludHNcclxuXHJcblx0XHQvL1x0RmlsbCB0aGUgdHJpYW5nbGVzIGZvcm1lZCBieSB0aGUgcG9pbnRzXHJcbn07XHJcblxyXG4vL1x0RXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmRvbUJhY2tncm91bmRHZW5lcmF0b3I7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvUmFuZG9tQmFja2dyb3VuZEdlbmVyYXRvci5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcbi8qXHJcbiAqICBDaGVjayBpZiBhIHN0cmluZyBpcyBpbiBhIGhleCBjb2xvciBmb3JtYXRcclxuICogIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHN0cmluZyBpcyBpbiBhIGhleCBmb3JtYXRcclxuICogIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogVGhlIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGNvbG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0hleChjb2xvcikge1xyXG4gICAgcmV0dXJuIC8jW2EtZjAtOV17Nn0vZ2kudGVzdChjb2xvcik7XHJcbn1cclxuXHJcbi8qXHJcbiAqICBDaGVjayBpZiBhIHN0cmluZyBpcyBpbiBhIHJnYiBjb2xvciBmb3JtYXRcclxuICogIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHN0cmluZyBpcyBpbiBhIHJnYiBmb3JtYXRcclxuICogIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogVGhlIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGNvbG9yXHJcbiAqL1xyXG4gZnVuY3Rpb24gaXNSZ2IoY29sb3IpIHtcclxuICAgIC8vICBFbGltaW5hdGUgd2hpdGUgc3BhY2VzXHJcbiAgICBjb2xvciA9IGNvbG9yLnJlcGxhY2UoL1xccy9nLCBcIlwiKTtcclxuICAgIHJldHVybiAvcmdiXFwoW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwpL2kudGVzdChjb2xvcik7XHJcbn1cclxuIC8qXHJcbiogIENoZWNrIGlmIGEgc3RyaW5nIGlzIGluIGEgcmdiYSBjb2xvciBmb3JtYXRcclxuKiAgQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGluIGEgcmdiYSBmb3JtYXRcclxuKiAgQHBhcmFtIHtzdHJpbmd9IGNvbG9yOiBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29sb3JcclxuKi9cclxuZnVuY3Rpb24gaXNSZ2JhKGNvbG9yKSB7XHJcbiAvLyAgRWxpbWluYXRlIHdoaXRlIHNwYWNlc1xyXG4gY29sb3IgPSBjb2xvci5yZXBsYWNlKC9cXHMvZywgXCJcIik7XHJcbiByZXR1cm4gL3JnYmFcXChbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcLFtcXGRdezEsM31bLl0/W1xcZF0qXFwsW1xcZF17MSwzfVsuXT9bXFxkXSpcXCxbXFxkXXsxLDN9Wy5dP1tcXGRdKlxcKS9pLnRlc3QoY29sb3IpO1xyXG5cclxufVxyXG5cclxuLypcclxuICpcdENvbnZlcnQgaGV4IGNvbG9yIHRvIHJnYiBjb2xvclxyXG4gKiAgQHJldHVybiB7c3RyaW5nIC8gbnVsbH0gQ29udmVydGVkIGNvbG9yIHN0cmluZyBvciBudWxsIGlmIHRoZSBpbnB1dCBpcyBpbnZhbGlkXHJcbiAqL1xyXG5mdW5jdGlvbiBoZXhUb1JnYihoZXgpIHtcclxuICAgIGlmIChpc0hleChoZXgpKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiKFwiICtcclxuICAgICAgICBwYXJzZUludChoZXguc3Vic3RyKDEsIDIpLCAxNikgKyBcIiwgXCIgK1xyXG4gICAgICAgIHBhcnNlSW50KGhleC5zdWJzdHIoMywgMiksIDE2KSArIFwiLCBcIiArXHJcbiAgICAgICAgcGFyc2VJbnQoaGV4LnN1YnN0cig1LCAyKSwgMTYpICsgXCIpXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiBpc1JnYihoZXgpIHx8IGlzUmdiYShoZXgpID8gaGV4IDogbnVsbDtcclxufVxyXG5cclxuLypcclxuICpcdEFkanVzdCB0aGUgYnJpZ2h0bmVzcyBvZiBhIGNvbG9yIGJ5IHBlcmNlbnRhZ2VcclxuICogIEBwYXJhbSB7c3RyaW5nfSBjb2xvcjogVGhlIGNvbG9yIHN0cmluZ1xyXG4gKiAgQHBhcmFtIHtmbG9hdH0gcGVyY2VudGFnZTogQSBmbG9hdCB3aXRoaW4gWy0xLCAxXSBieSB3aGljaCB0aGUgYnJpZ2h0bmVzcyBpcyBhZGp1c3RlZC5cclxuICpcdFx0XHRcdFx0XHRcdCAgIDEgbWVhbnMgbWF4aW11bSBkYXJrbmVzcyBhbmQgLTEgbWVhbnMgbWF4aW11bSBicmlnaHRuZXNzLlxyXG4gKi9cclxuZnVuY3Rpb24gYWRqdXN0Q29sb3JCcmlnaHRuZXNzKGNvbG9yLCBwZXJjZW50YWdlKSB7XHJcbiAgICBwZXJjZW50YWdlID0gcGVyY2VudGFnZSB8fCAwO1xyXG4gICAgY29sb3IgPSBoZXhUb1JnYihjb2xvcik7XHJcblxyXG4gICAgaWYgKGNvbG9yICE9PSBudWxsKSB7XHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy9cdFVzZSBkaWZmZXJlbnQgcmVnZXggYW5kIGZvcm1hdHMgZm9yIHJnYiBhbmQgcmdiYVxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIHZhciByZWd4ID0gaXNSZ2IoY29sb3IpID9cclxuICAgICAgICAgICAgL1tcXGRdezEsM31bLl0/W1xcZF0qL2dpIDogL1tcXGRdezEsM31bLl0/W1xcZF0qXFwsL2dpO1xyXG4gICAgICAgIHZhciBwb3N0Zml4ID0gaXNSZ2IoY29sb3IpID8gJycgOiAnLCc7XHJcblxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vICBSZXBsYWNlIHRoZSByLCBnIGFuZCBiIHdpdGggYWRqdXN0ZWQgbnVtYmVycyBhbmRcclxuICAgICAgICAvLyAgcm91bmQgdGhlbSB0byBpbnRlZ2Vyc1xyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIHJldHVybiBjb2xvci5yZXBsYWNlKHJlZ3gsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh1dGlscy5jbGFtcCgocGFyc2VJbnQoZSkgKiAoMSAtIHBlcmNlbnRhZ2UpKSwgMCwgMjU1KSlcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygpICsgcG9zdGZpeDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLypcclxuICogIEZ1bmN0aW9uIHRvIGdlbmVyYXRlIHJhbmRvbSBjb2xvciB3aXRoIHJhbmRvbSBicmlnaHRuZXNzXHJcbiAqICBiYXNlZCBvbiBhIGdpdmVuIGNvbG9yXHJcbiAqXHJcbiAqXHRAcmV0dXJuIHtzdHJpbmd9IEEgc3RyaW5nIG9mIGdlbmVyYXRlZCBjb2xvclxyXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGJhc2VDb2xvcjogQSBjb2xvciBzdHJpbmcgaW4gSEVYLCBSR0Igb3IgUkdCQVxyXG4gKlx0QHBhcmFtIHtmbG9hdH0gYnJpZ2h0bmVzc0ludGVuc2l0eShPcHRpb25hbCk6IFRoZSBicmlnaHRuZXNzIGludGVuc2l0eSB3aXRoaW4gWzAsIDFdIHRvIGdlbmVyYXRlXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBhcm91bmQuIDAgbWVhbnMgZ2VuZXJhdGUgYXJvdW5kIDAgYnJpZ2h0bmVzcyBjaGFuZ2VzLFxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgMC41IG1lYW5zIGdlbmVyYXRlIGFyb3VuZCA1MCUgYnJpZ2h0bmVzcyBjaGFuZ2VzIGFuZFxyXG4gKlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgMSBtZWFucyBnZW5lcmF0ZSBhcm91bmQgbWF4aW11bSBicmlnaHRuZXNzIGNoYW5nZXMuXHJcbiAqXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBUaGUgYnJpZ2h0bmVzcyBjaGFuZ2VzIHdpbGwgYmUgZWl0aGVyIGRyYWtlbmluZyBvciBicmlnaHRlbmluZy5cclxuICovXHJcbiBmdW5jdGlvbiByYW5kb21Db2xvcihiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpe1xyXG4gICAgIGJyaWdodG5lc3NJbnRlbnNpdHkgPSBicmlnaHRuZXNzSW50ZW5zaXR5IHx8IDAuNTtcclxuICAgICB2YXIgdGhyZXNob2xkID0gMC4yLFxyXG4gICAgICAgICByYW5nZUxvd2VyID0gdXRpbHMuY2xhbXAoYnJpZ2h0bmVzc0ludGVuc2l0eSAtIHRocmVzaG9sZCwgMCwgMSksXHJcbiAgICAgICAgIHJhbmdlVXBwZXIgPSB1dGlscy5jbGFtcChicmlnaHRuZXNzSW50ZW5zaXR5ICsgdGhyZXNob2xkLCAwLCAxKTtcclxuXHJcbiAgICAgLy9cdFVzZWQgdG8gZ2V0IGEgZWl0aGVyIG5lZ2F0aXZlIG9yIHBvc2l0aXZlIHJhbmRvbSBudW1iZXJcclxuICAgICB2YXIgcmFuZG9tQXJyID0gW1xyXG4gICAgICAgICB1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UocmFuZ2VMb3dlciwgcmFuZ2VVcHBlciwgZmFsc2UpLFxyXG4gICAgICAgICB1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoLXJhbmdlTG93ZXIsIC1yYW5nZVVwcGVyLCBmYWxzZSldO1xyXG5cclxuICAgICAvL1x0Q29sb3IgdmFsaWRpdHkgY2hlY2tpbmcgaW4gYWRqdXN0Q29sb3JCcmlnaHRuZXNzXHJcbiAgICAgcmV0dXJuIGFkanVzdENvbG9yQnJpZ2h0bmVzcyhiYXNlQ29sb3IsIHJhbmRvbUFyclt1dGlscy5nZXRSYW5kb21OdW1iZXJGcm9tUmFuZ2UoMCwgMildKTtcclxuIH1cclxuXHJcbi8qXHJcbiAqICBGdW5jdGlvbiB0byBnZW5lcmF0ZSByYW5kb20gZ3JhZGllbnQgY29sb3Igd2l0aCByYW5kb20gYnJpZ2h0bmVzcyBvbiBib3RoIHNpZGVzXHJcbiAqICBvZiB0aGUgbGluZWFyIGdyYWRpZW50IGJhc2VkIG9uIGEgZ2l2ZW4gY29sb3JcclxuICpcclxuICpcdEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBhaXIgb2YgY29sb3JzXHJcbiAqICBAcGFyYW0ge3N0cmluZ30gYmFzZUNvbG9yOiBBIGNvbG9yIHN0cmluZyBpbiBIRVgsIFJHQiBvciBSR0JBXHJcbiAqXHRAcGFyYW0ge2Zsb2F0fSBicmlnaHRuZXNzSW50ZW5zaXR5KE9wdGlvbmFsKTogVGhlIGJyaWdodG5lc3MgaW50ZW5zaXR5IHdpdGhpbiBbMCwgMV0gdG8gZ2VuZXJhdGVcclxuICpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGFyb3VuZC4gVGhlIHNhbWUgYXMgdGhlIG9uZSBpbiByYW5kb21Db2xvclxyXG4gKi9cclxuIGZ1bmN0aW9uIHJhbmRvbUdyYWRpZW50KGJhc2VDb2xvciwgYnJpZ2h0bmVzc0ludGVuc2l0eSkge1xyXG4gICAgIGJyaWdodG5lc3NJbnRlbnNpdHkgPSBicmlnaHRuZXNzSW50ZW5zaXR5IHx8IDAuNTtcclxuICAgICByZXR1cm4ge1xyXG4gICAgICAgICBmaXJzdDogcmFuZG9tQ29sb3IoYmFzZUNvbG9yLCBicmlnaHRuZXNzSW50ZW5zaXR5KSxcclxuICAgICAgICAgc2Vjb25kOiByYW5kb21Db2xvcihiYXNlQ29sb3IsIGJyaWdodG5lc3NJbnRlbnNpdHkpXHJcbiAgICAgfTtcclxuIH1cclxuXHJcbi8vICBFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzLmlzSGV4ID0gaXNIZXg7XHJcbm1vZHVsZS5leHBvcnRzLmlzUmdiID0gaXNSZ2I7XHJcbm1vZHVsZS5leHBvcnRzLmlzUmdiYSA9IGlzUmdiYTtcclxubW9kdWxlLmV4cG9ydHMuaGV4VG9SZ2IgPSBoZXhUb1JnYjtcclxubW9kdWxlLmV4cG9ydHMuYWRqdXN0Q29sb3JCcmlnaHRuZXNzID0gYWRqdXN0Q29sb3JCcmlnaHRuZXNzO1xyXG5tb2R1bGUuZXhwb3J0cy5yYW5kb21Db2xvciA9IHJhbmRvbUNvbG9yO1xyXG5tb2R1bGUuZXhwb3J0cy5yYW5kb21HcmFkaWVudCA9IHJhbmRvbUdyYWRpZW50O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbG9yVXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKmpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuLypcclxuICogTW9kZSBvYmplY3RcclxuICpcclxuICogVGhlIG1vZGUgb2JqZWN0IChlLmcuICdQb2x5Z29uYWwnKSByZXNwb25zaWJsZSBmb3IgZ2VuZXJhdGluZyBwcmltaXRpdmUgc2hhcGVzXHJcbiAqIHRvIGRyYXcgd2l0aFxyXG4gKi9cclxuXHJcbiAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAvLyBEZXBlbmRlbmNpZXNcclxuIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIHZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuIHZhciBHcmFwaCA9IHJlcXVpcmUoJy4vZ3JhcGgnKTtcclxuIHZhciBWZWN0b3IgPSByZXF1aXJlKCcuL3ZlY3RvcicpO1xyXG5cclxuLypcclxuICogQmFzZSBtb2RlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNXaWR0aDogVGhlIHdpZHRoIG9mIHRoZSBjYW52YXNcclxuICogQHBhcmFtIHtOdW1iZXJ9IGNhbnZhc0hlaWdodDogVGhlIGhlaWdodCBvZiB0aGUgY2FudmFzXHJcbiAqIEBwYXJhbSB7U3RyaW5nKEFyZ3MpfSBiYXNlQ29sb3JzOiBhIHNldCBvZiB2YXJpYWJsZSBudW1iZXIgb2YgY29sb3Igc3RyaW5ncyB1c2VkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcyB0aGUgYmFzZSBjb2xvcnMgb2YgdGhlIGJhY2tncm91bmRcclxuICovXHJcbmZ1bmN0aW9uIE1vZGUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCwgYmFzZUNvbG9ycykge1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQmFzZSBjbGFzcyBtZW1iZXJzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHRoaXMuX2Jhc2VDb2xvcnMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoMiwgYXJndW1lbnRzLmxlbmd0aCk7XHJcbiAgICB0aGlzLl9wcmltaXRpdmVzID0gW107XHJcbiAgICB0aGlzLl93aWR0aCA9IGNhbnZhc1dpZHRoIHx8IDA7XHJcbiAgICB0aGlzLl9oZWlnaHQgPSBjYW52YXNIZWlnaHQgfHwgMDtcclxufVxyXG5cclxuLypcclxuICogUHVibGljIHZpcnR1YWwgZnVuY3Rpb24gLSByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIHByaW1pdGl2ZSBzaGFwZXMgdG8gZHJhdyB3aXRoXHJcbiAqXHJcbiAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBwcmltaXRpdmUgc2hhcGVzXHJcbiAqL1xyXG5Nb2RlLnByb3RvdHlwZS5nZXRQcmltaXRpdmVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcHJpbWl0aXZlcztcclxufTtcclxuXHJcbi8qXHJcbiAqIFBvbHlnb25hbCBtb2RlIGNsYXNzIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IGRlbnNpdHk6IFRoZSBkZW5zaXR5IG9mIHRoZSBwb2x5Z29ucywgaW4gdGhlIHJhbmdlIG9mIFswLCAxXS5cclxuICogICAgICAgICAgICAgICAgICAgICAgICAgMCBpcyB0aGUgc3BhcnNlc3QgYW5kIDEgaXMgdGhlIGRlbnNlc3QuXHJcbiAqIEBwYXJhbSB7U3RyaW5nKEFyZ3MpfSBiYXNlQ29sb3JzOiBhIHNldCBvZiB2YXJpYWJsZSBudW1iZXIgb2YgY29sb3Igc3RyaW5ncyB1c2VkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcyB0aGUgYmFzZSBjb2xvcnMgb2YgdGhlIGJhY2tncm91bmRcclxuICogQHBhcmFtIHtOdW1iZXJ9IGNhbnZhc1dpZHRoOiBUaGUgd2lkdGggb2YgdGhlIGNhbnZhc1xyXG4gKiBAcGFyYW0ge051bWJlcn0gY2FudmFzSGVpZ2h0OiBUaGUgaGVpZ2h0IG9mIHRoZSBjYW52YXNcclxuXHJcbiAqL1xyXG5mdW5jdGlvbiBQb2x5Z29uYWxNb2RlKGRlbnNpdHksIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQsIGJhc2VDb2xvcnMpIHtcclxuICAgIC8vICBDYWxsIHRoZSBiYXNlIGNvbnN0cnVjdG9yIGFuZCBpbml0IGJhc2UgY2xhc3MgbWVtYmVyc1xyXG4gICAgUG9seWdvbmFsTW9kZS5fc3VwZXIuYXBwbHkodGhpcywgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDEsIGFyZ3VtZW50cy5sZW5ndGgpKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBDbGFzcy1zcGVjaWZpYyBtZW1iZXJzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHRoaXMuX2RlbnNpdHkgPSBkZW5zaXR5IHx8IDAuNTtcclxuICAgIHRoaXMuX2RlbnNpdHkgPSAxIC0gdGhpcy5fZGVuc2l0eTtcclxufVxyXG51dGlscy5pbmhlcml0KFBvbHlnb25hbE1vZGUsIE1vZGUpO1xyXG5cclxuLy8gIFRoZSBib3VuZHMgb2YgcmF0aW9cclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuREVOU0lUWV9SQVRPX1VQUEVSX0JPVU5EID0gMC41O1xyXG5Qb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fTE9XRVJfQk9VTkQgPSAwLjAwNTtcclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuREVOU0lUWV9SQVRPX0RJRiA9XHJcbiAgICBQb2x5Z29uYWxNb2RlLnByb3RvdHlwZS5ERU5TSVRZX1JBVE9fVVBQRVJfQk9VTkQgLVxyXG4gICAgUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuREVOU0lUWV9SQVRPX0xPV0VSX0JPVU5EO1xyXG5cclxuLypcclxuICogUHJpdmF0ZSBoZWxwZXIgZnVuY3Rpb24gLSBnZW5lcmF0ZSBwb2ludHMgdG8gZHJhdyB3aXRoXHJcbiAqIEl0IGRpdmlkZXMgdGhlIHdob2xlIGNhbnZhcyBpbnRvIHNtYWxsIGdyaWRzIGFuZCBnZW5lcmF0ZSBhIHJhbmRvbSBwb2ludCBpbiBldmVyeVxyXG4gKiBncmlkXHJcbiAqXHJcbiAqIEByZXR1cm4gbm9uZVxyXG4gKi9cclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuX2dlbmVyYXRlUHJpbWl0aXZlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIFdpZHRoIGFuZCBoZWlnaHQgb2YgZXZlcnkgc21hbGwgZ3JpZFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdmFyIHJhdGlvID0gdGhpcy5ERU5TSVRZX1JBVE9fTE9XRVJfQk9VTkQgKyB0aGlzLkRFTlNJVFlfUkFUT19ESUYgKiB0aGlzLl9kZW5zaXR5O1xyXG4gICAgdmFyIHdpZHRoSW50ZXJ2YWwgPSAgcmF0aW8gKiB0aGlzLl93aWR0aCxcclxuICAgICAgICBoZWlnaHRJbnRlcnZhbCA9IHJhdGlvICogdGhpcy5faGVpZ2h0O1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIENvdW50cyBvZiByb3dzIGFuZCBjb2x1bW5zIHBsdXMgdGhlIHRvcFxyXG4gICAgLy8gIGFuZCBsZWZ0IGJvdW5kcyBvZiB0aGUgcmVjdGFuZ2xlXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHZhciByb3dDb3VudCA9IE1hdGguZmxvb3IodGhpcy5fd2lkdGggLyB3aWR0aEludGVydmFsKSArIDEsXHJcbiAgICAgICAgY29sQ291bnQgPSBNYXRoLmZsb29yKHRoaXMuX2hlaWdodCAvIGhlaWdodEludGVydmFsKSArIDE7XHJcblxyXG4gICAgLy8gIFVzZSBhIGdyYXBoIHRvIHJlcHJlc2VudCB0aGUgZ3JpZHMgb24gdGhlIGNhbnZhc1xyXG4gICAgdmFyIGdyYXBoID0gbmV3IEdyYXBoKHJvd0NvdW50LCBjb2xDb3VudCk7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgUG9pbnRzIG9mIGV2ZXJ5IHNtYWxsIGdyaWRcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdmFyIHAxID0gbmV3IFZlY3RvcigwLCAwKSxcclxuICAgICAgICBwMiA9IG5ldyBWZWN0b3Iod2lkdGhJbnRlcnZhbCwgMCksXHJcbiAgICAgICAgcDMgPSBuZXcgVmVjdG9yKHdpZHRoSW50ZXJ2YWwsIGhlaWdodEludGVydmFsKSxcclxuICAgICAgICBwNCA9IG5ldyBWZWN0b3IoMCwgaGVpZ2h0SW50ZXJ2YWwpO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBSYW5kb21seSBnZW5lcmF0ZSBwb2ludHMgb24gdGhlIGNhbnZhc1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5kUG9pbnQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoaiA9PT0gMCkgeyAgLy8gIElmIGF0IHRoZSBsZWZ0IGJvdW5kXHJcbiAgICAgICAgICAgICAgICByYW5kUG9pbnQgPSB1dGlscy5nZXRSYW5kb21Qb2ludE9uUmVjdChwMSwgcDEsIHA0LCBwNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaiA9PT0gY29sQ291bnQgLSAxKSB7ICAgLy8gIElmIGF0IHRoZSByaWdodCBib3VuZFxyXG4gICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gdXRpbHMuZ2V0UmFuZG9tUG9pbnRPblJlY3QocDIsIHAyLCBwMywgcDMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHsgICAvLyAgSWYgYXQgdGhlIHRvcCBib3VuZFxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRQb2ludCA9IHV0aWxzLmdldFJhbmRvbVBvaW50T25SZWN0KHAxLCBwMiwgcDIsIHAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGkgPT09IHJvd0NvdW50IC0gMSkgeyAgIC8vICBJZiBhdCB0aGUgYm90dG9tIGJvdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gdXRpbHMuZ2V0UmFuZG9tUG9pbnRPblJlY3QocDQsIHAzLCBwMywgcDQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZFBvaW50ID0gdXRpbHMuZ2V0UmFuZG9tUG9pbnRPblJlY3QocDEsIHAyLCBwMywgcDQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdyYXBoLmluc2VydChpLCBqLCByYW5kUG9pbnQpO1xyXG5cclxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIC8vICBNb3ZlIHRoZSBjdXJyZW50IHNtYWxsIGdyaWQgdG8gdGhlXHJcbiAgICAgICAgICAgIC8vICByaWdodCBieSBvbmUgaW50ZXJ2YWwgdW5pdFxyXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgcDEueCArPSB3aWR0aEludGVydmFsO1xyXG4gICAgICAgICAgICBwMi54ICs9IHdpZHRoSW50ZXJ2YWw7XHJcbiAgICAgICAgICAgIHAzLnggKz0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICAgICAgcDQueCArPSB3aWR0aEludGVydmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvLyAgTW92ZSB0aGUgY3VycmVudCBzbWFsbCBncmlkIGJhY2sgdG8gdGhlXHJcbiAgICAgICAgLy8gIGxlZnQgbW9zdCBib3VuZCBhbmQgbW92ZSBpdCBkb3duIGJ5IG9uZSBpbnRlcnZhbCB1bml0XHJcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgcDEueCA9IHA0LnggPSAwO1xyXG4gICAgICAgIHAyLnggPSBwMy54ID0gd2lkdGhJbnRlcnZhbDtcclxuICAgICAgICBwMS55ICs9IGhlaWdodEludGVydmFsO1xyXG4gICAgICAgIHAyLnkgKz0gaGVpZ2h0SW50ZXJ2YWw7XHJcbiAgICAgICAgcDMueSArPSBoZWlnaHRJbnRlcnZhbDtcclxuICAgICAgICBwNC55ICs9IGhlaWdodEludGVydmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQXMgd2UgYXJlIGdvaW5nIHRvIGNoZWNrIGFkamFjZW50IHZlcnRpY2VzXHJcbiAgICAvLyAgaXQncyBlYXNpZXIgdG8gc3RvcmUgYWxsIGRlbHRhIGluZGV4IHZhbHVlcyBhbmRcclxuICAgIC8vICBsb29wIG92ZXIgdGhlbVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHZhciBkaSA9IFstMSwgLTEsIC0xLCAgMCwgIDEsIDEsIDEsIDBdLFxyXG4gICAgICAgIGRqID0gWy0xLCAgMCwgIDEsICAxLCAgMSwgMCwgLTEsIC0xXTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICBDb25uZWN0IGFsbCBhZGphY2VudCB2ZXJ0aWNlc1xyXG4gICAgLy8gIGFuZCBnZXQgYWxsIHByaW1pdGl2ZXNcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgIC8vICBLZWVwIGNvdW50IG9mIHRoZSBwb2ludHMgdGhhdCBhcmUgYWN0dWFsbHkgcHJvY2Vzc2VkXHJcbiAgICAgICAgICAgIGxldCBjbnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IGZpcnN0UG9pbnQsIHByZXZQb2ludDtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZGkubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyUG9pbnQgPSBncmFwaC5nZXQoaSArIGRpW2tdLCBqICsgZGpba10pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaC5jb25uZWN0KGksIGosIGkgKyBkaVtrXSwgaiArIGRqW2tdKTtcclxuICAgICAgICAgICAgICAgICAgICBjbnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNudCA9PT0gMSkgeyAgICAvLyAgQXNzaWduIGZpcnN0IHBvaW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0UG9pbnQgPSBjdXJyUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmltaXRpdmVzLnB1c2gobmV3IHV0aWxzLlBvbHlnb24oWyAgIC8vICBBZGQgcG9seWdvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGguZ2V0KGksIGopLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldlBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclBvaW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldlBvaW50ID0gY3VyclBvaW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAvLyAgQ29ubmVjdCB0aGUgZmlyc3QgcG9pbnQgd2l0aCB0aGVcclxuICAgICAgICAgICAgLy8gIGxhc3QgcG9pbnQgYW5kIGFkZCBwb2x5Z29uXHJcbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICBpZiAoZmlyc3RQb2ludCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICBwcmV2UG9pbnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgIWZpcnN0UG9pbnQuZXF1YWwocHJldlBvaW50KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJpbWl0aXZlcy5wdXNoKG5ldyB1dGlscy5Qb2x5Z29uKFtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaC5nZXQoaSwgaiksXHJcbiAgICAgICAgICAgICAgICAgICAgcHJldlBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0UG9pbnRcclxuICAgICAgICAgICAgICAgIF0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59O1xyXG5cclxuUG9seWdvbmFsTW9kZS5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX2dlbmVyYXRlUHJpbWl0aXZlcygpO1xyXG59O1xyXG5cclxuLy8gIEV4cG9ydCBhbiBvYmplY3QgZm9yIGRpcmVjdCBsb29rdXBcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBQb2x5Z29uYWw6IFBvbHlnb25hbE1vZGVcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9tb2Rlcy5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qanNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuLypcclxuICogVW5kaXJlY3RlZCBhY3lsaWMgZ3JhcGggZGF0YSBzdHJ1Y3R1cmUgdXNpbmdcclxuICogYWRqYWNlbnkgbWF0cml4IGFzIGltcGxlbWVudGF0aW9uXHJcbiAqXHJcbiAqL1xyXG5cclxuLypcclxuICogR3JhcGggY2xhc3MgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIHtJbnRlZ2VyfSByb3dDb3VudDogVGhlIG51bWJlciBvZiByb3dzXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gY29sdW1uQ291bnQ6IFRoZSBudW1iZXIgb2YgY29sdW1uc1xyXG4gKiBAb2FyYW0ge05vbi1vYmplY3QgdHlwZXN9IGluaXRpYWxWYWx1ZShPcHRpb25hbCk6IGluaXRpYWxWYWx1ZSBmb3IgYWxsIGVsZW1lbnRzIGluIHRoZSBncmFwaC4gSXQncyAwIGJ5IGRlZmF1bHQuXHJcbiAqL1xyXG5mdW5jdGlvbiBHcmFwaChyb3dDb3VudCwgY29sdW1uQ291bnQsIGluaXRpYWxWYWx1ZSkge1xyXG4gICAgdGhpcy5fcm93Q291bnQgPSByb3dDb3VudCB8fCAwO1xyXG4gICAgdGhpcy5fY29sdW1uQ291bnQgPSBjb2x1bW5Db3VudCB8fCAwO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgQWxsb2NhdGUgYW4gZW1wdHkgbWF0cml4XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdGhpcy5fZGF0YSA9IG5ldyBBcnJheShyb3dDb3VudCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICB0aGlzLl9kYXRhW2ldID0gbmV3IEFycmF5KGNvbHVtbkNvdW50KS5maWxsKGluaXRpYWxWYWx1ZSB8fCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9lZGdlcyA9IHt9O1xyXG59XHJcblxyXG4vKlxyXG4gKiBQcml2YXRlIG1lbWJlciBmdW5jdGlvbiAtIGNoZWNrIGlmIGEgcGFpciBvZiBwb3NpdGlvbnMgaXMgaW4gdGhlIHJhbmdlIG9mIHJvd3MgYW5kIGNvbHVtbnNcclxuICpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgcGFpciBvZiBwb3NpdGlvbnMgaXMgaW4gdGhlIGJvdW5kIGFuZCBmYWxzZSBpZiBub3RcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5fY2hlY2tCb3VuZCA9IGZ1bmN0aW9uKGksIGopIHtcclxuICAgIGlmIChpID49IHRoaXMuX3Jvd0NvdW50IHx8XHJcbiAgICAgICAgaiA+PSB0aGlzLl9jb2x1bW5Db3VudCB8fFxyXG4gICAgICAgIGkgPCAwIHx8IGogPCAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFByaXZhdGUgbWVtYmVyIGZ1bmN0aW9uIC0gZ2V0IGFuIGlkIGZyb20gYSBwYWlyIG9mIHBvc2l0aW9uc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBpZCBvZiB0aGUgcGFpciBvZiBwb3NpdGlvbnNcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqOiBUaGUgemVyby1iYXNlZCBjb2x1bW4gcG9zaXRpb25cclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5fZ2V0SWQgPSBmdW5jdGlvbihpLCBqKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fY2hlY2tCb3VuZChpLCBqKSA/IGkudG9TdHJpbmcoKSArIGoudG9TdHJpbmcoKSA6IG51bGw7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gcmV0dXJuIHRoZSBjb3VudCBvZiByb3dzXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUucm93Q291bnQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9yb3dDb3VudDtcclxufTtcclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIHJldHVybiB0aGUgY291bnQgb2YgY29sdW1uc1xyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmNvbHVtbkNvdW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fY29sdW1uQ291bnQ7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gaW5zZXJ0IGFuIGVsZW1lbnQgdG8gdGhlIGdyYXBoXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgaW5zZXJ0aW9uIGlzIHN1Y2Nlc3NmdWwgYW5kIGZhbHNlIGlmIG5vdFxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGk6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGo6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0FueX0gdmFsdWU6IFRoZSB2YWx1ZSB0byBpbnNlcnRcclxuICovXHJcbkdyYXBoLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihpLCBqLCB2YWx1ZSkge1xyXG4gICAgaWYgKHRoaXMuX2NoZWNrQm91bmQoaSwgaikpIHtcclxuICAgICAgICB0aGlzLl9kYXRhW2ldW2pdID0gdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFB1YmxpYyBtZW1iZXIgZnVuY3Rpb24gLSBnZXQgYSBlbGVtZW50IGZyb20gYSBwYWlyIG9mIHBvc2l0aW9uXHJcbiAqXHJcbiAqIEByZXR1cm4ge0FueSAvIG51bGx9IFRoZSBlbGVtZW50IGF0IHRoZSBwb3NpdGlvbiBpZiB0aGUgcGFpciBvZiBwb3NpdGlvbnMgaXMgaW4gdGhlIGJvdW5kXHJcbiAqICAgICAgICAgICAgICAgICAgICAgIGFuZCBudWxsIGlmIG5vdFxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGk6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGo6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGksIGopIHtcclxuICAgIGlmICh0aGlzLl9jaGVja0JvdW5kKGksIGopKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbaV1bal07XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGNoZWNrIGlmIHR3byB2ZXJ0aWNlcyBhcmUgY29ubmVjdGVkXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYSBjb25uZWN0aW9uIGJldHdlZW4gdHdvIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTEsIGkyOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqMSwgajI6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmlzQ29ubmVjdGVkID0gZnVuY3Rpb24oaTEsIGoxLCBpMiwgajIpIHtcclxuICAgIGlmICghdGhpcy5fY2hlY2tCb3VuZChpMSwgajEpIHx8XHJcbiAgICAgICAgIXRoaXMuX2NoZWNrQm91bmQoaTIsIGoyKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHZhciBpZDEgPSB0aGlzLl9nZXRJZChpMSwgajEpLFxyXG4gICAgICAgIGlkMiA9IHRoaXMuX2dldElkKGkyLCBqMik7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLl9lZGdlc1tpZDFdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9lZGdlc1tpZDFdW2lkMl07XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgbWVtYmVyIGZ1bmN0aW9uIC0gY29ubmVjdCB0aGUgZWRnZSBvZiB0d28gdmVydGljZXNcclxuICpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgYWN0aW9uIGlzIHN1Y2Nlc3NmdWxcclxuICogQHBhcmFtIHtJbnRlZ2VyfSBpMSwgaTI6IFRoZSB6ZXJvLWJhc2VkIHJvdyBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGoxLCBqMjogVGhlIHplcm8tYmFzZWQgY29sdW1uIHBvc2l0aW9uXHJcbiAqL1xyXG5HcmFwaC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKGkxLCBqMSwgaTIsIGoyKSB7XHJcbiAgICBpZiAoIXRoaXMuX2NoZWNrQm91bmQoaTEsIGoxKSB8fFxyXG4gICAgICAgICF0aGlzLl9jaGVja0JvdW5kKGkyLCBqMikpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB2YXIgaWQxID0gdGhpcy5fZ2V0SWQoaTEsIGoxKSxcclxuICAgICAgICBpZDIgPSB0aGlzLl9nZXRJZChpMiwgajIpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5fZWRnZXNbaWQxXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aGlzLl9lZGdlc1tpZDFdID0ge307XHJcbiAgICB9XHJcbiAgICB0aGlzLl9lZGdlc1tpZDFdW2lkMl0gPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuLypcclxuICogUHVibGljIG1lbWJlciBmdW5jdGlvbiAtIGRpc2Nvbm5lY3QgdGhlIGVkZ2Ugb2YgdHdvIHZlcnRpY2VzXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGFjdGlvbiBpcyBzdWNjZXNzZnVsXHJcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaTEsIGkyOiBUaGUgemVyby1iYXNlZCByb3cgcG9zaXRpb25cclxuICogQHBhcmFtIHtJbnRlZ2VyfSBqMSwgajI6IFRoZSB6ZXJvLWJhc2VkIGNvbHVtbiBwb3NpdGlvblxyXG4gKi9cclxuR3JhcGgucHJvdG90eXBlLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbihpMSwgajEsIGkyLCBqMikge1xyXG4gICAgaWYgKCF0aGlzLl9jaGVja0JvdW5kKGkxLCBqMSkgfHxcclxuICAgICAgICAhdGhpcy5fY2hlY2tCb3VuZChpMiwgajIpKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgdmFyIGlkMSA9IHRoaXMuX2dldElkKGkxLCBqMSksXHJcbiAgICAgICAgaWQyID0gdGhpcy5fZ2V0SWQoaTIsIGoyKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMuX2VkZ2VzW2lkMV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9lZGdlc1tpZDFdW2lkMl0gPSBmYWxzZTtcclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8vICBFeHBvcnRzXHJcbm1vZHVsZS5leHBvcnRzID0gR3JhcGg7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZ3JhcGguanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9