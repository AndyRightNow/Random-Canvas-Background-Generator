/*jshint esversion: 6 */

/*
 * Polygonal Mode object
 *
 */

var Mode = require('./mode');
var utils = require('./utils');
var Polygon = require('./polygon');
var Graph = require('./graph');
var Vector = require('./vector');
var colorUtils = require('./colorUtils');

/*
 * Polygonal mode class constructor
 *
 * @param {Object} argObj.density: The densities of x and y of the polygons, in the range of [0, 1].
 *                                 0 is the sparsest and 1 is the densest.
 * @param {Object} argObj.density.x: The density of x of the polygons.
 * @param {Object} argObj.density.y: The density of y of the polygons.
 * @param {array} argObj.baseColors: a set of variable number of color strings used
 *                                   as the base colors of the background
 * @param {Number} argObj.canvasWidth: The width of the canvas
 * @param {Number} argObj.canvasHeight: The height of the canvas
 * @param {Boolean} argObj.isMixed: A flag indicating if all colors are mixed or displayed one by one
 */
function PolygonalMode(argObj) {
    //  Call the base constructor and init base class members
    PolygonalMode._super.call(this, argObj);

    //----------------------------
    //  Class-specific members
    //----------------------------
    this._isMixed = argObj.isMixed || false;
}
utils.inherit(PolygonalMode, Mode);

/*
 * Public member function - set the mix mode
 *
 */
PolygonalMode.prototype.setMixed = function(flag) {
    this._isMixed = flag;
};

/*
 * Public member function - return the mix mode
 *
 * @return {Mode} the current mix mode
 */
PolygonalMode.prototype.isMixed = function() {
    return this._isMixed;
};

/*
 * Private member function - return an array of color strings based on the mix mode
 *
 * @return {Array} An array of color strings
 */
PolygonalMode.prototype._getBaseColors = function() {
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
PolygonalMode.prototype._originalStyleFunc = function(color, polygon, ctx) {
    //  Get a random color
    color = color[utils.getRandomNumberFromRange(0, color.length)];

    //---------------------------
    //	Set the color
    //---------------------------
    if (polygon.points.length === 3) { //	If it's a triangle
        //-------------------------------------------
        //	Start and end points of the linear gradient
        //	The start point is randomly selected
        //-------------------------------------------
        var startPoint = polygon.points[utils.getRandomNumberFromRange(0, polygon.points.length)];
        var endPoint;

        //-------------------------------------
        //	Fetch points other than the start point
        //	out of the polygon
        //-------------------------------------
        var index = polygon.points.indexOf(startPoint);
        var line = [];
        for (var i = 0; i < polygon.points.length; i++)
            if (i !== index) line.push(polygon.points[i]);

            //-------------------------------------
            //	Project the start point to the line
            //	it's facing and that's the end point
            //-------------------------------------
        var axis = new Vector(line[0].x - line[1].x, line[0].y - line[1].y);
        endPoint = startPoint.project(axis);

        //	Create the linear gradient object
        var grad = ctx.createLinearGradient(
            startPoint.x, startPoint.y, endPoint.x, endPoint.y);

        //------------------------------------
        //	Get random linear gradient colors
        //	and add colors
        //------------------------------------
        var gradColors = colorUtils.randomGradient(colorUtils.randomColorBrightness(color,
                utils.getRandomNumberFromRange(0, 0.1)), //	Intensity of the base color
            utils.getRandomNumberFromRange(0, 0.1)); //	Intensity of the random gradient
        grad.addColorStop(0, gradColors.first);
        grad.addColorStop(1, gradColors.second);

        ctx.fillStyle = grad;
    } else {
        ctx.fillStyle = colorUtils.randomColorBrightness(color);
    }
};


/*
 * Private helper function - generate polygons to draw with
 * It divides the whole canvas into small grids and generate a random point in every
 * grid
 *
 * @return none
 */
PolygonalMode.prototype._generatePrimitives = function() {
    //  Clear previous data
    this.clearPrimitives();
    //  Calculate intervals
    this._calcIntervals();

    //-------------------------------------------------
    //  Counts of rows and columns plus the top
    //  and left bounds of the rectangle
    //-------------------------------------------------
    var rowCount = Math.floor(this._height / this._heightInterval) + 1,
        colCount = Math.floor(this._width / this._widthInterval) + 1;

    //  Use a graph to represent the grids on the canvas
    var graph = new Graph(rowCount, colCount);

    //-------------------------------
    //  Points of every small grid
    //-------------------------------
    var p1 = new Vector(0, 0),
        p2 = new Vector(this._widthInterval, 0),
        p3 = new Vector(this._widthInterval, this._heightInterval),
        p4 = new Vector(0, this._heightInterval);

    //--------------------------------------------
    //  Randomly generate points on the canvas
    //--------------------------------------------
    for (var i = 0; i < rowCount; i++) {
        for (var j = 0; j < colCount; j++) {
            var randPoint;

            //  Shrink the rectangle to produce less messy points
            var shrinked = utils.shrinkRect(p1, p2, p3, p4, this._widthInterval / 5, 0);

            if (j === 0) { //  If at the left bound
                if (i === 0) //  If at the top left corner
                    randPoint = new Vector(i * this._widthInterval, j * this._heightInterval);
                else
                    randPoint = utils.getRandomPointOnRect(shrinked.p1, shrinked.p1, shrinked.p4, shrinked.p4);
            } else if (j === colCount - 1) { //  If at the right bound
                randPoint = utils.getRandomPointOnRect(shrinked.p2, shrinked.p2, shrinked.p3, shrinked.p3);
            } else {
                if (i === 0) { //  If at the top bound
                    randPoint = utils.getRandomPointOnRect(shrinked.p1, shrinked.p2, shrinked.p2, shrinked.p1);
                } else if (i === rowCount - 1) { //  If at the bottom bound
                    randPoint = utils.getRandomPointOnRect(shrinked.p4, shrinked.p3, shrinked.p3, shrinked.p4);
                } else {
                    randPoint = utils.getRandomPointOnRect(shrinked.p1, shrinked.p2, shrinked.p3, shrinked.p4);
                }
            }
            graph.insert(i, j, randPoint);

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

    //---------------------------------------
    //  As we are going to check adjacent vertices
    //  it's easier to store all delta index values and
    //  loop over them
    //---------------------------------------
    var di = [-1, -1, -1, 0, 1, 1, 1, 0],
        dj = [-1, 0, 1, 1, 1, 0, -1, -1];

    //-------------------------------------
    //  Connect all adjacent vertices
    //  and get all primitives
    //-------------------------------------
    for (var i = 0; i < rowCount; i++) {
        for (var j = 0; j < colCount; j++) {
            //  Keep count of the points that are actually processed
            var cnt = 0;

            var firstPoint, prevPoint;

            for (var k = 0; k < di.length; k++) {
                var currPoint = graph.get(i + di[k], j + dj[k]);

                if (currPoint) {
                    graph.connect(i, j, i + di[k], j + dj[k]);
                    cnt++;

                    if (cnt === 1) { //  Assign first point
                        firstPoint = currPoint;
                    } else {
                        this.addPrimitive(
                            new Polygon([ //  Add polygon
                                graph.get(i, j),
                                prevPoint,
                                currPoint
                            ]));
                    }
                    prevPoint = currPoint;
                }
            }
            //-------------------------------------
            //  Connect the first point with the
            //  last point and add polygon
            //-------------------------------------
            if (firstPoint !== undefined &&
                prevPoint !== undefined &&
                !firstPoint.equal(prevPoint)) {
                this.addPrimitive(
                    new Polygon([
                        graph.get(i, j),
                        prevPoint,
                        firstPoint
                    ]));
            }
        }
    }
};

/*
 * Private member function - interface of generating primitives
 *
 * @return none
 */
PolygonalMode.prototype.generate = function() {
    //  Bind a random color to the original styling function
    this._styleFunc = this._originalStyleFunc.bind(this, this._getBaseColors());
    this._generatePrimitives();
};

//  Export
module.exports = PolygonalMode;
