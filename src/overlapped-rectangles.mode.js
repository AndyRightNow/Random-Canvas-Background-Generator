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
 var Polygon = require('./polygon');

 /*
  * Overlapped rectangles mode class constructor
  *
  * @param {float} argObj.density: The density of the rectangles, in the range of [0, 1].
  *                         0 is the sparsest and 1 is the densest.
  * @param {array} argObj.baseColors: a set of variable number of color strings used
  *                                   as the base colors of the background
  * @param {Number} argObj.canvasWidth: The width of the canvas
  * @param {Number} argObj.canvasHeight: The height of the canvas
  * @param {Number} argObj.rectWidth: The width of rectangles. If random flag is specified,
  *                                   this value will be the maximum width.
  * @param {Number} argObj.rectHeight: The height of rectangles. If random flag is specified,
  *                                   this value will be the maximum height.
  * @param {boolean} argObj.isRandom: The flag indicating if the sizes of rectangles are randomly generated
  */
 function OverlappedRectanglesMode(argObj) {
     //  Call the base constructor and init base class members
     OverlappedRectanglesMode._super.call(this, argObj);

     //----------------------------
     //  Class-specific members
     //----------------------------
     this._rectWidth = argObj.rectWidth || 0;
     this._rectHeight = argObj.rectHeight || 0;
     this._rect = new Polygon([
         new Vector(0, 0),
         new Vector(this._rectWidth, 0),
         new Vector(this._rectWidth, this._rectHeight),
         new Vector(0, this._rectHeight),
     ]);
 }
 utils.inherit(OverlappedRectanglesMode, Mode);

/*
 * Set the size of the rectangle
 *
 * @param {Number} argObj.rectWidth: The width of rectangles. If random flag is specified,
 *                                   this value will be the maximum width.
 * @param {Number} argObj.rectHeight: The height of rectangles. If random flag is specified,
 *                                   this value will be the maximum height.
 */
 OverlappedRectanglesMode.prototype.setRectSize = function(argObj) {
     //------------------------
     // Set the size
     //------------------------
     this._rectWidth = argObj.rectWidth || this._rectWidth;
     this._rectHeight = argObj.rectHeight || this._rectHeight;

     //----------------------------
     // Recalculate the rectangle
     //----------------------------
     if (!this._rect) {
         this._rect = new Polygon([
             new Vector(0, 0),
             new Vector(rectWidth, 0),
             new Vector(rectWidth, rectHeight),
             new Vector(0, rectHeight),
         ]);
     }
     else {
         this._rect.points[1].x = this._rect.points[2].x = this._rectWidth;
         this._rect.points[2].y = this._rect.points[3].y = this._rectHeight;
     }
 };


 /*
  * Private helper function - generate polygons to draw with
  *
  * @return none
  */
 OverlappedRectanglesMode.prototype._generatePrimitives = function() {

 };

 /*
  * Private member function - interface of generating primitives
  *
  * @return none
  */
 OverlappedRectanglesMode.prototype.generate = function() {
     //  Bind a random color to the original styling function
     this._styleFunc = this._originalStyleFunc.bind(this, this._getBaseColors());
     this._generatePrimitives();
 };

 //  Export
 module.exports = OverlappedRectanglesMode;
