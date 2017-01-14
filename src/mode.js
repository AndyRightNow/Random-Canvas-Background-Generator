/**jshint esversion: 6 */
/**
 * Mode object
 *
 * The mode object (e.g. 'Polygonal') responsible for generating primitive shapes
 * to draw with
 */

//-----------------------------
// Dependencies
//-----------------------------
Array.from = require('./polyfills').from;

/**
 * Base mode class constructor
 *
 * @param {Number} argObj.canvasWidth: The width of the canvas
 * @param {Number} argObj.canvasHeight: The height of the canvas
 * @param {array} argObj.baseColors: a set of variable number of color strings used
 *                                   as the base colors of the background
 * @param {Object} argObj.density: The densities of x and y of the polygons, in the range of [0, 1].
 *                                 0 is the sparsest and 1 is the densest.
 * @param {Number} argObj.density.x: The density of x of the polygons.
 * @param {Number} argObj.density.y: The density of y of the polygons.
 */
function Mode(argObj) {
    //----------------------------
    //  Base class members
    //----------------------------
    this._baseColors = argObj.baseColors || [];
    this._width = argObj.canvasWidth || 0;
    this._height = argObj.canvasHeight || 0;
    this._primitives = [];
    this._widthInterval = this._heightInterval = 0;

    //--------------------------------
    //  If only one axis is specified,
    //  use the value for both axises.
    //--------------------------------
    if (argObj && argObj.density && //  If argObj and argObj.density are both not undefined
        (argObj.density.x && !argObj.density.y) &&
        (argObj.density.y && !argObj.density.x)) { //  Only one axis of density is valid
        argObj.density.x = argObj.density.y = argObj.density.x ? argObj.density.x : argObj.density.y;
    }
    this._xDensity = argObj.density ? argObj.density.x ? 1 - argObj.density.x : 0.6 : 0.6;
    this._yDensity = argObj.density ? argObj.density.y ? 1 - argObj.density.y : 0.6 : 0.6;
}

/**
 * Public member function - return the density of polygons
 *
 * @return {Object} density of x and y
 */
Mode.prototype.getDensity = function() {
    return {
        x: 1 - this._density.x,
        y: 1 - this._density.y
    };
};

/**
 * Public member function - set the density of polygons
 *
 * @param {Number} argObj.x: Density on x axis
 * @param {Number} argObj.y: Density on y axis
 */
Mode.prototype.setDensity = function(argObj) {
    if (argObj) {
        //--------------------------------
        //  If only one axis is specified,
        //  use the value for both axises.
        //--------------------------------
        if (argObj.density &&
            (argObj.density.x && !argObj.density.y) &&
            (argObj.density.y && !argObj.density.x)) { //  Only one axis of density is valid
            argObj.density.x = argObj.density.y = argObj.density.x ? argObj.density.x : argObj.density.y;
        }

        this._xDensity = argObj.x ? 1 - argObj.x : 0;
        this._yDensity = argObj.y ? 1 - argObj.y : 0;
    }
};

/**
 * Public virtual function - set the array of color strings
 *
 */
Mode.prototype.setBaseColors = function(args) {
    this._baseColors = Array.from(arguments);
};

/**
 * Public virtual function - return an array of color strings
 *
 * @return {Array} An array of color strings
 */
Mode.prototype.getBaseColors = function() {
    return this._baseColors;
};

/**
 * Public virtual function - return an array of the primitive shapes to draw with
 *
 * @return {Array} An array of primitive shapes
 */
Mode.prototype.getPrimitives = function() {
    return this._primitives;
};

/**
 * Private virtual function - add a polygon to the primitives array
 *
 * @param {Polygon} polygon: The polygon to add
 */
Mode.prototype.addPrimitive = function(polygon) {
    this._primitives.push(polygon);
};

/**
 * Public virtual function - clear primitives
 *
 */
Mode.prototype.clearPrimitives = function() {
    this._primitives = [];
};

/**
 * Public virtual function - return the styling function of this mode
 *
 * @return {function} a styling function
 */
Mode.prototype.getStyleFunc = function() {
    return this._styleFunc;
};

//--------------------------------
//  The bounds of density ratio
//--------------------------------
Mode.prototype._DENSITY_RATO_UPPER_BOUND = 0.3;
Mode.prototype._DENSITY_RATO_LOWER_BOUND = 0.01;
Mode.prototype._DENSITY_RATO_DIF =
    Mode.prototype._DENSITY_RATO_UPPER_BOUND -
    Mode.prototype._DENSITY_RATO_LOWER_BOUND;

/**
 * Private virtual function - calculate width and height intervals
 */
Mode.prototype._calcIntervals = function() {
    //-----------------------------------------
    //  Width and height of every small grid
    //-----------------------------------------
    this._widthInterval = this._width * (this._DENSITY_RATO_LOWER_BOUND + this._DENSITY_RATO_DIF * this._xDensity);
    this._heightInterval = this._height * (this._DENSITY_RATO_LOWER_BOUND + this._DENSITY_RATO_DIF * this._yDensity);
};

module.exports = Mode;
