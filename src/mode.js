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
 var utils = require('./utils');
 var Graph = require('./graph');
 var Vector = require('./vector');
 Array.from = require('./polyfills').from;

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
 * Public virtual function - set the array of color strings
 *
 */
Mode.prototype.setBaseColors = function(args) {
    this._baseColors = Array.from(arguments);
};

/*
 * Public virtual function - return an array of color strings
 *
 * @return {Array} An array of color strings
 */
Mode.prototype.getBaseColors = function() {
    return this._baseColors;
};

/*
 * Public virtual function - return an array of the primitive shapes to draw with
 *
 * @return {Array} An array of primitive shapes
 */
Mode.prototype.getPrimitives = function() {
    return this._primitives;
};

/*
 * Public virtual function - return the styling function of this mode
 *
 * @return {function} a styling function
 */
Mode.prototype.getStyleFunc = function() {
    return this._styleFunc;
};

module.exports = Mode;
