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
 var t = require('./../test/test');

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

//  The bounds of ratio
PolygonalMode.prototype.DENSITY_RATO_UPPER_BOUND = 0.5;
PolygonalMode.prototype.DENSITY_RATO_LOWER_BOUND = 0.005;
PolygonalMode.prototype.DENSITY_RATO_DIF =
    PolygonalMode.prototype.DENSITY_RATO_UPPER_BOUND -
    PolygonalMode.prototype.DENSITY_RATO_LOWER_BOUND;

/*
 * Private helper function - generate points to draw with
 *
 * @return none
 */
PolygonalMode.prototype._generatePrimitives = function() {
    //  Width and height of every small grid
    var ratio = this.DENSITY_RATO_LOWER_BOUND + this.DENSITY_RATO_DIF * this._density;
    var widthInterval =  ratio * this._width,
        heightInterval = ratio * this._height;
    t.LOG('density', this._density);
    t.LOG('widthInterval', widthInterval, 'heightInterval', heightInterval);

    //  Counts of rows and columns plus the top and left bounds of the rectangle
    var rowCount = Math.floor(this._width / widthInterval) + 1,
        colCount = Math.floor(this._height / heightInterval) + 1;
    t.LOG('rowCount', rowCount, 'colCount', colCount);

    var graph = new Graph(rowCount, colCount);

    //  Points of the small grid
    var p1 = new Vector(0, 0),
        p2 = new Vector(widthInterval, 0),
        p3 = new Vector(widthInterval, heightInterval),
        p4 = new Vector(0, heightInterval);
    t.LOG('p1', p1, 'p2', p2, 'p3', p3, 'p4', p4);

    //  Randomly generate points on the canvas
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            var randPoint;
            if (j === 0) {
                randPoint = utils.getRandomPointOnRect(p1, p1, p4, p4);
            }
            else if (j === colCount - 1) {
                randPoint = utils.getRandomPointOnRect(p2, p2, p3, p3);
            }
            else {
                if (i === 0) {
                    randPoint = utils.getRandomPointOnRect(p1, p2, p2, p1);
                }
                else if (i === rowCount - 1) {
                    randPoint = utils.getRandomPointOnRect(p4, p3, p3, p4);
                }
                else {
                    randPoint = utils.getRandomPointOnRect(p1, p2, p3, p4);
                }
            }
            graph.insert(i, j, randPoint);

            p1.x += widthInterval;
            p2.x += widthInterval;
            p3.x += widthInterval;
            p4.x += widthInterval;
        }
        p1.x = p4.x = 0;
        p2.x = p3.x = widthInterval;
        p1.y += heightInterval;
        p2.y += heightInterval;
        p3.y += heightInterval;
        p4.y += heightInterval;
    }

    //  Connect all adjacent vertices
    //  and get all primitives
    var di = [-1, -1, -1,  0,  1, 1, 1, 0],
        dj = [-1,  0,  1,  1,  1, 0, -1, -1];
    var visited = new Graph(rowCount, colCount);

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            let cnt = 0;
            let firstPoint, lastPoint;
            for (let k = 0; k < di.length; k++) {
                let currPoint = graph.get(i + di[k], j + dj[k]);
                if (currPoint && visited.get(i + di[k], j + dj[k]) === 0) {
                    graph.connect(i, j, i + di[k], j + dj[k]);
                    lastPoint = currPoint;
                    cnt++;

                    if (cnt === 1) {
                        firstPoint = currPoint;
                    }
                    else {
                        this._primitives.push(new utils.Polygon([
                            graph.get(i, j),
                            graph.get(i + di[k - 1], j + dj[k - 1]),
                            currPoint
                        ]));
                    }
                }
            }
            if (firstPoint !== undefined &&
                lastPoint !== undefined &&
                !firstPoint.equal(lastPoint)) {
                this._primitives.push(new utils.Polygon([
                    graph.get(i, j),
                    lastPoint,
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
