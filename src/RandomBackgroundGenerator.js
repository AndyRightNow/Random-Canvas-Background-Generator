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
* @param {string} argObj.canvasId: The id of the canvas you want to generate background on
* @param {string} argObj.mode: The pattern in which the background is generated.
*						 Currently Support: 1. "Polygonal"
* @param {array} argObj.baseColors: a set of variable number of color strings used
*                                   as the base colors of the background
* @param {any...} argObj.any...: Any properties that can be used in a certain mode
*/
function RandomBackgroundGenerator(argObj) {
	argObj = argObj || {};
	//	Initialize
	this._canvas = typeof document !== 'undefined' ? document.getElementById(argObj.canvasId) : null;
	this._canvasContext = this._canvas ? this._canvas.getContext('2d') : null;
	this._modeName = argObj.mode || POLYGONAL;
	this._mode = null;

	if (this._canvas) {	//	If canvas element exists
		argObj.canvasWidth = this._canvas.clientWidth + this._canvas.clientWidth / 5;
		argObj.canvasHeight = this._canvas.clientHeight + this._canvas.clientHeight / 5;
		this._mode = new Modes[this._modeName](argObj);

		if (arguments.length > 2) {	//	If any color is proviede
			this._mode.setBaseColors.apply(this._mode, argObj.baseColors ? argObj.baseColors : []);
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

	styleFunc.call(this._mode, polygon, this._canvasContext);

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
		this._fillPolygon(primitives[i], this._mode.getStyleFunc());
	}
};

//	Exports
module.exports = RandomBackgroundGenerator;
