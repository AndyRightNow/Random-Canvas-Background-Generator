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
 Array.from = require('./polyfills').from;

/*
 * Base mode class constructor
 *
 * @param {Number} argObj.canvasWidth: The width of the canvas
 * @param {Number} argObj.canvasHeight: The height of the canvas
 * @param {array} argObj.baseColors: a set of variable number of color strings used
 *                                   as the base colors of the background
 */
function Mode(argObj) {
    //----------------------------
    //  Base class members
    //----------------------------
    this._baseColors = argObj.baseColors || [];
    this._width = argObj.canvasWidth || 0;
    this._height = argObj.canvasHeight || 0;
    this._primitives = [];
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
