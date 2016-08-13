/*jshint esversion: 6 */

/*
 *	Random Canvas Background Generator
 *
 *	It's used on HTML Canvas to generate random background in a certain pattern
 *	with certain customized parameters and modes. The background
 * 	will update every time you click it.
 *
 */

//-------------------------------
//	Dependencies
//-------------------------------
var utils = require('./utils');
var colorUtils = require('./colorUtils');
var Vector = require('./vector');

/*
*	Constant string name
*/
const POLYGONAL = "Polygonal";

/*
* Constructor
*
* @param {string} mode: The pattern in which the background is generated.
*						 Currently Support: 1. "Polygonal"
* @param {string} canvasId: The id of the canvas you want to generate background on
*/
function RandomBackgroundGenerator(canvasId, mode) {
	//	Initialize
	this._mode = mode || POLYGONAL;
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
		if (polygon.points.length === 3) {
			let randomIntensity = Math.random();
			let gradColors = colorUtils.randomGradient(randomColor(color), randomIntensity);

			let startPoint = polygon.points[utils.getRandomNumberFromRange(0, polygon.points.length)];
			let endPoint;

			let index = polygon.points.indexOf(startPoint);
			let line = [];
			for (let i = 0; i < polygon.points.length; i++)
				if (i !== index) line.push(polygon.points[i]);

			let axis = new Vector(line[0].x - line[1].x, line[0].y - line[1].y);
			endPoint = startPoint.project(axis);

			let grad = this._canvasContext.createLinearGradient(
				startPoint.x, startPoint.y, endPoint.x, endPoint.y);

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

module.exports = RandomBackgroundGenerator;
