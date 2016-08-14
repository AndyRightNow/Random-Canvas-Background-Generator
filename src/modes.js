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
 * Public virtual function - return an array of the primitive shapes to draw with
 *
 * @return {Array} An array of primitive shapes
 */
Mode.prototype.getPrimitives = function() {
    return this._primitives;
};

/*
 * Polygonal mode class constructor
 *
 * @param {float} density: The density of the polygons, in the range of [0, 1]
 * @param {String(Args)} baseColors: a set of variable number of color strings used
 *                                   as the base colors of the background
 * @param {Number} canvasWidth: The width of the canvas
 * @param {Number} canvasHeight: The height of the canvas

 */
function PolygonalMode(density, canvasWidth, canvasHeight, baseColors) {
    //  Call the base constructor and init base class members
    PolygonalMode._super.apply(this, Array.from(arguments).slice(1, arguments.length));

    //----------------------------
    //  Class-specific members
    //----------------------------
    this._density = density || 0.5;
}
utils.inherit(PolygonalMode, Mode);

/*
 * Private helper function - generate points to draw with
 *
 * @return none
 */
PolygonalMode.prototype._generatePoints = function() {


};

//  Export an object for direct lookup
module.exports = {
    Polygonal: PolygonalMode
};
