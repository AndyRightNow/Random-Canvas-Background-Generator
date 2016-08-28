/*jshint esversion: 6 */

/*
 * Overlapped Rectangle Mode object
 *
 */

//-------------------
 // Dependencies
 //-------------------
 var Mode = require('./mode');
 var utils = require('./utils');
 var Graph = require('./graph');
 var Vector = require('./vector');
 var colorUtils = require('./colorUtils');

 /*
  * Overlapped rectangles mode class constructor
  *
  * @param {float} argObj.density: The density of the rectangles, in the range of [0, 1].
  *                         0 is the sparsest and 1 is the densest.
  * @param {array} argObj.baseColors: a set of variable number of color strings used
  *                                   as the base colors of the background
  * @param {Number} argObj.canvasWidth: The width of the canvas
  * @param {Number} argObj.canvasHeight: The height of the canvas
  */
 function OverlappedRectanglesMode(argObj) {
     //  Call the base constructor and init base class members
     OverlappedRectanglesMode._super.call(this, {
         canvasWidth: argObj.canvasWidth || 0,
         canvasHeight: argObj.canvasHeight || 0,
         baseColors: argObj.baseColors || []
     });

     //----------------------------
     //  Class-specific members
     //----------------------------
     this._density = argObj.density || 0.6;
     this._density = 1 - this._density;
 }
 utils.inherit(OverlappedRectanglesMode, Mode);

 OverlappedRectanglesMode.prototype._generatePrimitives = function() {

 };

 OverlappedRectanglesMode.prototype.generate = function() {
     //  Bind a random color to the original styling function
     this._styleFunc = this._originalStyleFunc.bind(this, this._getBaseColors());
     this._generatePrimitives();
 };

 //  Export
 module.exports = OverlappedRectanglesMode;
