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
var utils = require('./utils');
var colorUtils = require('./colorUtils');
var Vector = require('./vector');
var Modes = {
	Polygonal: require('./polygonal.mode')
};
Array.from = require('./polyfills').from;

//--------------------
//	Modes constants
//------------------
var POLYGONAL = 'Polygonal';

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
		this._mode = new Modes[this._modeName](0.6,	//	Default density
			this._canvas.clientWidth + this._canvas.clientWidth / 5,
			this._canvas.clientHeight + this._canvas.clientHeight / 5);

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
 * @param {Polygon} polygon: the polygon to draw
 * @param {function} styleFunc: the function taking the canvas context as arguments and
 *								set the style of this drawing
 *
 */
RandomBackgroundGenerator.prototype._fillPolygon = function(polygon, styleFunc) {
	//	Save the previous states
	this._canvasContext.save();

	styleFunc(polygon, this._canvasContext);

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

	for (var i = 0; i < primitives.length; i++) {
		this._fillPolygon(primitives[i].polygon, this._mode.getStyleFunc());
	}
};

//	Exports
module.exports = RandomBackgroundGenerator;
