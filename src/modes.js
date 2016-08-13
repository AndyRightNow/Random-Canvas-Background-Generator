/*
 * Mode object
 *
 * The mode object (e.g. 'Polygonal') responsible for generating points and
 * specifying drawing rules for itself
 */

 //-----------------------------
 // Dependencies
 //-----------------------------
 var utils = require('./utils');

/*
 * Base mode class constructor
 *
 * @param {String(Args)} baseColors: a set of variable number of color strings used
 *                                   as the base colors of the background
 */
function Mode(baseColors) {
    //----------------------------
    //  Base class members
    //----------------------------
    this._baseColors = Array.from(arguments);
    this._drawOrders = [];
    this._points = [];
}

/*
 * Public virtual function - return an array of the drawing rules of the mode
 *
 * @return An array representing the drawing rules
 */
Mode.prototype.getDrawOrders = function() {
    return this._drawOrders;
};

/*
 * Polygonal mode class constructor
 *
 * @param {float} density: The density of the polygons
 * @param {String(Args)} baseColors: a set of variable number of color strings used
 *                                   as the base colors of the background
 *
 */
function PolygonalMode(density, baseColors) {
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
