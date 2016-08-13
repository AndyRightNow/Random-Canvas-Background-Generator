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

	var utils = require('./utils');
	var colorUtils = require('./colorUtils');

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
    RandomBackgroundGenerator.prototype._fillPolygon = function(color, polygon, gradient) {
		gradient = gradient || false;

        //	Save the previous states
        this._canvasContext.save();

        //---------------------------
        //	Set the color
        //---------------------------
        if (gradient) {
			let randomIntensity = Math.random();
			let grad = colorUtils.randomGradient(randomColor(color), randomIntensity);
			let startPointIndex = utils.getRandomNumberFromRange(0, polygon.points.length);
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

	return RandomBackgroundGenerator;
})();
