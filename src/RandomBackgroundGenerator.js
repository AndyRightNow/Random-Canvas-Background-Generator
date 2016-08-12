/*jshint esversion: 6 */

/*
 *	Random Canvas Background Generator
 *
 *	It's used on HTML Canvas to generate random background in a certain pattern
 *	with certain customized parameters and modes. The background
 * 	will update every time you click it.
 *
 */
var RandomBackgroundGenerator = (function() {
	"use strict";
    /*
     *	Constant string name
     */
    const POLYGONAL = "Polygonal";

    /*
     *	Polygon class
     */
    function Polygon(points = []) {
        this._points = points;
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
     *  Two-dimensional point(vector)
     */
     function Point(x = 0, y = 0) {
        this.x = x || 0;
        this.y = y || 0;
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
     function getRandomNumberFromRange(lower, upper, isInt = true) {
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
     *	@param {Point} p1, p2, p3, p4: Points of a rectangle starting
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

        return new Point(topLeftX + randomDeltaX, topLeftY + randomDeltaY);
    }

    /*
     *  Get a random point on a line
     *  @param {Point} p1, p2: Points of a line from left to right
     */
    function getRandomPointOnLine(p1, p2) {
        var projectionWidth = Math.abs(p1.x - p2.x),
            leftX = Math.min(p1.x, p2.x);

        var A = (p1.y - p2.y) / (p1.x - p2.x),
            B = p1.y - A * p1.x;

        var randomDeltaX = getRandomNumberFromRange(0, projectionWidth, false);
        return new Point(leftX + randomDeltaX, A * (leftX + randomDeltaX) + B);
    }

    /*
     *  Check if a string is in a hex color format
     *  @return {boolean} True if the string is in a hex format
     *  @param {string} color: The string representing the color
     */
    function isHex(color) {
    	return /#[a-f0-9]{6}/gi.test(color);
    }

    /*
     *  Check if a string is in a rgb or rgba color format
     *  @return {boolean} True if the string is in a rgb format
     *  @param {string} color: The string representing the color
     */
     function isRgb(color) {
        //  Eliminate white spaces
        color = color.replace(/\s/g, "");
        return /a/gi.test(color) ? /rgba\([0-2]{0,1}[0-5]{0,1}[0-5]{1}\,[0-2]{0,1}[0-5]{0,1}[0-5]{1}\,[0-2]{0,1}[0-5]{0,1}[0-5]{1}\,[0]{0,1}[.]{0,1}[0-9]{1,2}\)/gi.test(color)
            : /rgb\([0-2]{0,1}[0-5]{0,1}[0-5]{1}\,[0-2]{0,1}[0-5]{0,1}[0-5]{1}\,[0-2]{0,1}[0-5]{0,1}[0-5]{1}\)/gi.test(color);
     }

    /*
     *	Convert hex color to rgb color
     *  @return {string / null} Converted color string or null if the input is invalid
     */
    function hexToRGB(hex) {
    	if (isHex(hex)) {
            return "rgb(" +
            parseInt(hex.substr(1, 2), 16) + ", " +
            parseInt(hex.substr(3, 2), 16) + ", " +
            parseInt(hex.substr(5, 2), 16) + ")";
        }
        else return isRgb(hex) ? hex : null;
    }

    /*
     *	Adjust the brightness of a color by percentage
     *  @param {string} color: The color string
     *  @param {float} percentage: A float within [-1, 1] by which the brightness is adjusted.
	 *							   1 means maximum darkness and -1 means maximum brightness.
     */
    function adjustColorBrightness(color, percentage = 0) {
        color = hexToRGB(color);

        if (color !== null) {
			//	Math 'n,' in order to exclude the alpha
            return color.replace(/[0-2]{0,1}[0-5]{0,1}[0-5]{1}\,/gi, function(e){
                return clamp((parseInt(e) * (1 - percentage)), 0, 255).toString() + ",";
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
	 function randomColor(baseColor, brightnessIntensity = 0.5){
		 var threshold = 0.2,
		 	 rangeLower = clamp(brightnessIntensity - threshold, 0, 1),
			 rangeUpper = clamp(brightnessIntensity + threshold, 0, 1);

		 //	Used to get a either negative or positive random number
		 var randomArr = [
			 getRandomNumberFromRange(rangeLower, rangeUpper, false),
		 	 getRandomNumberFromRange(-rangeLower, -rangeUpper, false)];

		 //	Color validity checking in adjustColorBrightness
		 return adjustColorBrightness(baseColor, randomArr[getRandomNumberFromRange(0, 2)]);
	 }

	/*
	 *  Function to generate random color with random gradient
	 *  based on a given color
	 *
	 *	@return {Object} A gradient color object used for canvas drawing
	 *  @param {string} baseColor: A color string in HEX, RGB or RGBA
	 *	@param {Point} startPoint: The start point of gradient
	 *	@param {Point} endPoint: The end point of gradient
	 */
	 function randomGradientColor(baseColor, startPoint, endPoint) {
		 
	 }

    /*
     * Constructor
     *
     * @param {string} mode: The pattern in which the background is generated.
     *						 Currently Support: 1. "Polygonal"
     *
     * @param {string} canvasId: The id of the canvas you want to generate background on
     */
    function RandomBackgroundGenerator(canvasId, mode = POLYGONAL) {
        //	Initialize
        this._mode = mode;
        this._canvas = document.getElementById(canvasId);
        if (this._canvas !== null) {
            this._canvasContext = this._canvas.getContext('2d');
        }
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
    RandomBackgroundGenerator.prototype._fillPolygon = function(color, polygon, gradient = false) {
        //	Save the previous states
        this._canvasContext.save();

        //---------------------------
        //	Set the color
        //---------------------------
        if (gradient) {

        }
        else {

        }

        //-----------------------------------
        //	Draw the polygon
        //-----------------------------------
        this._canvasContext.beginPath();
        var points = polygon.getPoints();
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
    ////////////////////////////////////////////////////////////////////////DEBUG///////////////////////////////////////////////////////////
	var exports = module.exports = {};
	exports.RandomBackgroundGenerator = RandomBackgroundGenerator;
	exports.Polygon = Polygon;
    exports.Point = Point;
    exports.getRandomNumberFromRange = getRandomNumberFromRange;
    exports.hexToRGB = hexToRGB;
    exports.isHex = isHex;
    exports.isRgb = isRgb;
    exports.adjustColorBrightness = adjustColorBrightness;
    exports.clamp = clamp;
    exports.getRandomPointOnRect = getRandomPointOnRect;
    exports.getRandomPointOnLine = getRandomPointOnLine;
	exports.randomColor = randomColor;
	////////////////////////////////////////////////////////////////////////DEBUG///////////////////////////////////////////////////////////
})();
