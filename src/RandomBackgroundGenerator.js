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
var Modes = require('./modes');

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
			var startPoint = polygon.points[utils.getRandomNumberFromRange(0, polygon.points.length)];
			var endPoint;

			//-------------------------------------
			//	Fetch points other than the start point
			//	out of the polygon
			//-------------------------------------
			var index = polygon.points.indexOf(startPoint);
			var line = [];
			for (var i = 0; i < polygon.points.length; i++)
				if (i !== index) line.push(polygon.points[i]);

			//-------------------------------------
			//	Project the start point to the line
			//	it's facing and that's the end point
			//-------------------------------------
			var axis = new Vector(line[0].x - line[1].x, line[0].y - line[1].y);
			endPoint = startPoint.project(axis);

			//	Create the linear gradient object
			var grad = this._canvasContext.createLinearGradient(
				startPoint.x, startPoint.y, endPoint.x, endPoint.y);

			//------------------------------------
			//	Get random linear gradient colors
			//	and add colors
			//------------------------------------
			var gradColors = colorUtils.randomGradient(colorUtils.randomColor(color,
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

	for (var i = 0; i < primitives.length; i++) {
		var randColor = baseColors[utils.getRandomNumberFromRange(0, baseColors.length)];
		this._fillPolygon(randColor, primitives[i], true);
	}
};

//	Exports
module.exports = RandomBackgroundGenerator;
