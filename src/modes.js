/*
 * Mode object
 *
 * The mode object (e.g. 'Polygonal') responsible for generating points and
 * specifying drawing rules for itself
 */
 var utils = require('./utils');

/*
 * Base mode class constructor
 *
 * @param {String(Args)} baseColors: a set of variable number of color strings used
 *                                   as the base colors of the background
 */
function Mode(baseColors) {
    this._baseColors = Array.from(arguments);
}

function PolygonalMode(density, baseColors) {
    //  Call the base constructor
    this._super.apply(this, Array.from(arguments).slice(1, arguments.length));
    this._density = density;
}
utils.inherit(PolygonalMode, Mode);

//  Export an object for direct lookup
module.exports = {
    Polygonal: PolygonalMode
};
