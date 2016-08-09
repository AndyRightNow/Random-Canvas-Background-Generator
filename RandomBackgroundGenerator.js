/*
 *	Random Canvas Background Generator
 *
 *	It's used on HTML Canvas to generate random background in a certain pattern
 *	with certain customized parameters and modes. The background 
 * 	will update every time you click it.
 *
 */
(function() {
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
    	getPoints: function() {
        return this._points;
    	},

    	setPoints: function(points) {
        this._points = points;
    	}
    };

    /*
     * Two-dimensional point(vector)
     */
     function Point(x = 0, y = 0) {
        this.x = x || 0;
        this.y = y || 0;
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
     * Get a random point from a rectangle
     *
     *	@param {Point} p1, p2, p3, p4: Points of a rectangle starting 
     *								   from the top left corner and going
     *								   clockwise.
     */
    function getRandomPointOnRect(p1, p2, p3, p4) {

    }

    /*
     * Get a random point at a line
     */
    function getRandomPointOnLine(p1, p2) {

    }

    /*
     * Check if a string is in a hex color format
     */
    function isHex(color) {
    	if (color.length != 7 || color[0] != '#') return false;
    	for (var i = 1; i < color.length; i++) {
    		var code = color.charCodeAt(i);
    		if (code < '0'.charCodeAt(0) ||
    			(code > '9'.charCodeAt(0) && code < 'A'.charCodeAt(0)) ||
    			code > 'F'.charCodeAt(0)){
    			return false;
    		}
    	}
    	return true;
    }

    /*
     *	Convert hex color to rgb color
     */
    function hexToRGB(hex) {
    	if (typeof hex !== "string" || hex[0] != '#' || hex.length != 7) return null;

    	return "rgb(" + 
    	parseInt(hex.substr(1, 2), 16) + 
    	", " + 
    	parseInt(hex.substr(3, 2), 16) +
    	", " +
    	parseInt(hex.substr(5, 2), 16) +
    	")";
    }

    /*
     *	Darken a color by percentage
     */
    function darkenColor(color, percentage) {

    }

    /*
     *	Brighten a color by percentage
     */
    function brightenColor(color, percentage) {

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

            //--------------------------------------
            //	Listen to click event and when clicking
            //	the canvas, update the background.
            //--------------------------------------
            this._canvas.addEventListener("click", function(event) {});
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
    RandomBackgroundGenerator.prototype._fillPolygon = function(color, polygon, gradient) {
        //	Save the previous states
        this._canvasContext.save();

        //---------------------------
        //	Set the color
        //---------------------------
        // if (gradient) {

        // }
        // else {

        // }

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


    //	Export to window
    window.RandomBackgroundGenerator = RandomBackgroundGenerator;

    ////////////////////////////////////////////////////////////////////////DEBUG////////////////////////////////////////////////////////////
    window.Polygon = Polygon;
    window.Point = Point;
    window.getRandomNumberFromRange = getRandomNumberFromRange;
    window.hexToRGB = hexToRGB;
    window.isHex = isHex;
})();

