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
var Vector = require('./vector');
var colorUtils = require('./colorUtils');
var Polygon = require('./polygon');

/*
 * Overlapped rectangles mode class constructor
 *
 * @param {Object} argObj.density: The densities of x and y of the polygons, in the range of [0, 1].
 *                                 0 is the sparsest and 1 is the densest.
 * @param {Number} argObj.density.x: The density of x of the polygons.
 * @param {Number} argObj.density.y: The density of y of the polygons.
 *
 * @param {array} argObj.baseColors: a set of variable number of color strings used
 *                                   as the base colors of the background
 *
 * @param {Number} argObj.canvasWidth: The width of the canvas
 * @param {Number} argObj.canvasHeight: The height of the canvas
 *
 * @param {Number} argObj.rectWidth: The width of rectangles. If random flag is specified,
 *                                   this value will be the maximum width.
 * @param {Number} argObj.rectHeight: The height of rectangles. If random flag is specified,
 *                                    this value will be the maximum height.
 *
 * @param {boolean} argObj.isMixed: The flag indicating if all colors are mixed or displayed one by one
 *
 * @param {Object} argObj.brightnessRange: The brightness range low and high object
 * @param {Object} argObj.brightnessRange.low: The brightness range low within [0, 1]
 * @param {Object} argObj.brightnessRange.high: The brightness range high within [0, 1]
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
        new Vector(-this._rectWidth, -this._rectHeight),
        new Vector(0, -this._rectHeight),
        new Vector(0, 0),
        new Vector(-this._rectWidth, 0)]);
    this._rectCenter = new Vector(this._rectWidth / 2, this._rectHeight / 2);
    this._isMixed = argObj.isMixed || false;
    this._brightnessRange = argObj.brightnessRange || { low: 0.3, high: 0.7};
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
            new Vector(-this._rectWidth, -this._rectHeight),
            new Vector(0, -this._rectHeight),
            new Vector(0, 0),
            new Vector(-this._rectWidth, 0)]);
    } else {
        this._rect.points[1].x = this._rect.points[2].x = this._rectWidth;
        this._rect.points[2].y = this._rect.points[3].y = this._rectHeight;
    }
};

/*
 * Private member function - return an array of color strings based on the mix mode
 *
 * @return {Array} An array of color strings
 */
OverlappedRectanglesMode.prototype._getBaseColors = function() {
    return this._isMixed ? this._baseColors : [this._baseColors[utils.getRandomNumberFromRange(0, this._baseColors.length)]];
};

/*
 * Public member function - Styling function for polygons. It instructs the canvas
 * context to create certain styles for polygons
 *
 * @param {string} color: The base color for this
 * @param {boolean} gradient: The flag indicating if gradient is enabled
 * @param {Polygon} polygon: The polygon to draw on
 * @param {Object} ctx: The canvas context
 */
OverlappedRectanglesMode.prototype._originalStyleFunc = function(color, polygon, ctx) {
    //  Get a random color
    color = color[utils.getRandomNumberFromRange(0, color.length)];
    ctx.shadowColor   = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowOffsetY = 8;
    ctx.shadowBlur    = 10;
    ctx.fillStyle = colorUtils.randomColorBrightness(color,
        utils.getRandomNumberFromRange(this._brightnessRange.low, this._brightnessRange.high));
};

//  The number of polygons on every small grid
OverlappedRectanglesMode.prototype._POLYGON_COUNT_PER_GRID_MAX = 5;

/*
 * Private helper function - generate polygons to draw with
 *
 * @return none
 */
OverlappedRectanglesMode.prototype._generatePrimitives = function() {
    //  Clear previous data
    this.clearPrimitives();
    //  Calculate intervals
    this._calcIntervals();

    var polygonCountPerGrid =
        (1 - (this._xDensity + this._yDensity) / 2) * this._POLYGON_COUNT_PER_GRID_MAX;

    //-------------------------------------------------
    //  Counts of rows and columns plus the top
    //  and left bounds of the rectangle
    //-------------------------------------------------
    var rowCount = Math.floor(this._height / this._heightInterval) + 1,
        colCount = Math.floor(this._width / this._widthInterval) + 1;

    //-------------------------------
    //  Points of every small grid
    //-------------------------------
    var p1 = new Vector(-this._widthInterval, -this._heightInterval),
        p2 = new Vector(0, -this._heightInterval),
        p3 = new Vector(0, 0),
        p4 = new Vector(-this._widthInterval, 0);

        //--------------------------------------------
        //  Randomly generate polygons on the canvas
        //--------------------------------------------
        for (var i = 0; i < rowCount; i++) {
            for (var j = 0; j < colCount; j++) {

                for (var cnt = 0; cnt < polygonCountPerGrid; cnt++) {
                    var randPoint = utils.getRandomPointOnRect(p1, p2, p3, p4);
                    this.addPrimitive(
                        this._rect
                        .clone()
                        .rotate(utils.getRandomNumberFromRange(-360, 360), this._rectCenter)//  FIRST Random rotation
                        .translate(randPoint.x, randPoint.y));    //  Random translation
                }

                //----------------------------------------
                //  Move the current small grid to the
                //  right by one interval unit
                //----------------------------------------
                p1.x += this._widthInterval;
                p2.x += this._widthInterval;
                p3.x += this._widthInterval;
                p4.x += this._widthInterval;
            }
            //----------------------------------------
            //  Move the current small grid back to the
            //  left most bound and move it down by one interval unit
            //----------------------------------------
            p1.x = p4.x = 0;
            p2.x = p3.x = this._widthInterval;
            p1.y += this._heightInterval;
            p2.y += this._heightInterval;
            p3.y += this._heightInterval;
            p4.y += this._heightInterval;
        }
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
