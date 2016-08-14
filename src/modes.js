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
 * Polygonal mode class constructor
 *
 * @param {float} density: The density of the polygons, in the range of [0, 1].
 *                         0 is the sparsest and 1 is the densest.
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
    this._density = 1 - this._density;
}
utils.inherit(PolygonalMode, Mode);

//----------------------
//  The bounds of ratio
//----------------------
PolygonalMode.prototype.DENSITY_RATO_UPPER_BOUND = 0.3;
PolygonalMode.prototype.DENSITY_RATO_LOWER_BOUND = 0.01;
PolygonalMode.prototype.DENSITY_RATO_DIF =
    PolygonalMode.prototype.DENSITY_RATO_UPPER_BOUND -
    PolygonalMode.prototype.DENSITY_RATO_LOWER_BOUND;

/*
 * Public member function - set the density of polygons
 *
 */
PolygonalMode.prototype.setDensity = function(density) {
    this._density = 1 - density;
};
/*
 * Public member function - return the density of polygons
 *
 * @return {float} density
 */
PolygonalMode.prototype.getDensity = function() {
    return 1 - this._density;
};

/*
 * Private helper function - generate points to draw with
 * It divides the whole canvas into small grids and generate a random point in every
 * grid
 *
 * @return none
 */
PolygonalMode.prototype._generatePrimitives = function() {
    //  Clear previous data
    this._primitives = [];

    //-----------------------------------------
    //  Width and height of every small grid
    //-----------------------------------------
    var ratio = this.DENSITY_RATO_LOWER_BOUND + this.DENSITY_RATO_DIF * this._density;
    var widthInterval =  ratio * this._width,
        heightInterval = ratio * this._height;

    //-------------------------------------------------
    //  Counts of rows and columns plus the top
    //  and left bounds of the rectangle
    //-------------------------------------------------
    var rowCount = Math.floor(this._width / widthInterval) + 1,
        colCount = Math.floor(this._height / heightInterval) + 1;

    //  Use a graph to represent the grids on the canvas
    var graph = new Graph(rowCount, colCount);

    //-------------------------------
    //  Points of every small grid
    //-------------------------------
    var p1 = new Vector(0, 0),
        p2 = new Vector(widthInterval, 0),
        p3 = new Vector(widthInterval, heightInterval),
        p4 = new Vector(0, heightInterval);

    //--------------------------------------------
    //  Randomly generate points on the canvas
    //--------------------------------------------
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            var randPoint;

            //  Shrink the rectangle to produce less messy points
            var shrinked = utils.shrinkRect(p1, p2, p3, p4, widthInterval / 5 , 0);

            if (j === 0) {  //  If at the left bound
                if (i === 0)
                    randPoint = new Vector(i * widthInterval, j * heightInterval);
                else
                    randPoint = utils.getRandomPointOnRect(shrinked.p1, shrinked.p1, shrinked.p4, shrinked.p4);
            }
            else if (j === colCount - 1) {   //  If at the right bound
                randPoint = utils.getRandomPointOnRect(shrinked.p2, shrinked.p2, shrinked.p3, shrinked.p3);
            }
            else {
                if (i === 0) {   //  If at the top bound
                    randPoint = utils.getRandomPointOnRect(shrinked.p1, shrinked.p2, shrinked.p2, shrinked.p1);
                }
                else if (i === rowCount - 1) {   //  If at the bottom bound
                    randPoint = utils.getRandomPointOnRect(shrinked.p4, shrinked.p3, shrinked.p3, shrinked.p4);
                }
                else {
                    randPoint = utils.getRandomPointOnRect(shrinked.p1, shrinked.p2, shrinked.p3, shrinked.p4);
                }
            }
            graph.insert(i, j, randPoint);

            //----------------------------------------
            //  Move the current small grid to the
            //  right by one interval unit
            //----------------------------------------
            p1.x += widthInterval;
            p2.x += widthInterval;
            p3.x += widthInterval;
            p4.x += widthInterval;
        }
        //----------------------------------------
        //  Move the current small grid back to the
        //  left most bound and move it down by one interval unit
        //----------------------------------------
        p1.x = p4.x = 0;
        p2.x = p3.x = widthInterval;
        p1.y += heightInterval;
        p2.y += heightInterval;
        p3.y += heightInterval;
        p4.y += heightInterval;
    }

    //---------------------------------------
    //  As we are going to check adjacent vertices
    //  it's easier to store all delta index values and
    //  loop over them
    //---------------------------------------
    var di = [-1, -1, -1,  0,  1, 1, 1, 0],
        dj = [-1,  0,  1,  1,  1, 0, -1, -1];

    //-------------------------------------
    //  Connect all adjacent vertices
    //  and get all primitives
    //-------------------------------------
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            //  Keep count of the points that are actually processed
            let cnt = 0;

            let firstPoint, prevPoint;

            for (let k = 0; k < di.length; k++) {
                let currPoint = graph.get(i + di[k], j + dj[k]);

                if (currPoint) {
                    graph.connect(i, j, i + di[k], j + dj[k]);
                    cnt++;

                    if (cnt === 1) {    //  Assign first point
                        firstPoint = currPoint;
                    }
                    else {
                        this._primitives.push(new utils.Polygon([   //  Add polygon
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
                this._primitives.push(new utils.Polygon([
                    graph.get(i, j),
                    prevPoint,
                    firstPoint
                ]));
            }
        }
    }


};

PolygonalMode.prototype.generate = function() {
    this._generatePrimitives();
};

//  Export an object for direct lookup
module.exports = {
    Polygonal: PolygonalMode
};
