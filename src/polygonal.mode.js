/*jshint esversion: 6 */

/*
 * Polygonal Mode object
 *
 */

 var Mode = require('./mode');
 var utils = require('./utils');
 var Graph = require('./graph');
 var Vector = require('./vector');
 var colorUtils = require('./colorUtils');

/*
 * Polygonal mode class constructor
 *
 * @param {float} argObj.density: The density of the polygons, in the range of [0, 1].
 *                         0 is the sparsest and 1 is the densest.
 * @param {array} argObj.baseColors: a set of variable number of color strings used
 *                                   as the base colors of the background
 * @param {Number} argObj.canvasWidth: The width of the canvas
 * @param {Number} argObj.canvasHeight: The height of the canvas
 * @param {Boolean} argObj.isMixed: A flag indicating if all colors are mixed or displayed one by one
 */
function PolygonalMode(argObj) {
    //  Call the base constructor and init base class members
    PolygonalMode._super.call(this, {
        canvasWidth: argObj.canvasWidth || 0,
        canvasHeight: argObj.canvasHeight || 0,
        baseColors: argObj.baseColors || []
    });

    //----------------------------
    //  Class-specific members
    //----------------------------
    this._density = argObj.density || 0.6;
    this._density = 1 - this._density;
	this._isMixed = argObj.isMixed || false;
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
 * @param {string} color: The base color for this polygon
 * @param {boolean} gradient: The flag indicating if gradient is enabled
 * @param {Polygon} polygon: The polygon to draw on
 * @param {Object} ctx: The canvas context
 */
PolygonalMode.prototype._originalStyleFunc = function (color, polygon, ctx) {
    color = color[utils.getRandomNumberFromRange(0, color.length)];
    //  Get a random color
    var gradient = utils.getRandomNumberFromRange(0, 2);

    //---------------------------
    //	Set the color
    //---------------------------
    if (gradient) {
        if (polygon.points.length === 3) {	//	If it's a triangle
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
            var gradColors = colorUtils.randomGradient(colorUtils.randomColor(color,
                utils.getRandomNumberFromRange(0, 0.3)),	//	Intensity of the base color
                    utils.getRandomNumberFromRange(0, 0.1));	//	Intensity of the random gradient
            grad.addColorStop(0, gradColors.first);
            grad.addColorStop(1, gradColors.second);

            ctx.fillStyle = grad;
        }
        else {
            ctx.fillStyle = colorUtils.randomColor(color);
        }
    }
    else {
        ctx.fillStyle = colorUtils.randomColor(color);
    }
};

/*
 * Public member function - set the density of polygons
 *
 */
PolygonalMode.prototype.setDensity = function(density) {
    this._density = 1 - density;

    //-------------------------
    //  Optional mode: Separate
    //  x and y densities
    //-------------------------
    if (arguments.length > 1) {
        this._separateDensityMode = true;
        this._xDensity = 1 - arguments[0];
        this._yDensity = 1 - arguments[1];
    }
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

    //-----------------------------------
    //  Check if optional separated densities
    //  mode is on
    //-----------------------------------
    if (this._separateDensityMode) {
        var xRatio = this.DENSITY_RATO_LOWER_BOUND + this.DENSITY_RATO_DIF * this._xDensity,
            yRatio = this.DENSITY_RATO_LOWER_BOUND + this.DENSITY_RATO_DIF * this._yDensity;
        widthInterval = this._width * xRatio;
        heightInterval = this._height * yRatio;
    }

    //-------------------------------------------------
    //  Counts of rows and columns plus the top
    //  and left bounds of the rectangle
    //-------------------------------------------------
    var rowCount = Math.floor(this._height / heightInterval) + 1,
        colCount = Math.floor(this._width / widthInterval) + 1;

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
    for (var i = 0; i < rowCount; i++) {
        for (var j = 0; j < colCount; j++) {
            var randPoint;

            //  Shrink the rectangle to produce less messy points
            var shrinked = utils.shrinkRect(p1, p2, p3, p4, widthInterval / 5 , 0);

            if (j === 0) {  //  If at the left bound
                if (i === 0)    //  If at the top left corner
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

                    if (cnt === 1) {    //  Assign first point
                        firstPoint = currPoint;
                    }
                    else {
                        this._primitives.push(
                            new utils.Polygon([   //  Add polygon
                                graph.get(i, j),
                                prevPoint,
                                currPoint]));
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
                this._primitives.push(
                    new utils.Polygon([
                        graph.get(i, j),
                        prevPoint,
                        firstPoint]));
            }
        }
    }
};

PolygonalMode.prototype.generate = function() {
    this._styleFunc = this._originalStyleFunc.bind(this, this._getBaseColors());
    this._generatePrimitives();
};

//  Export an object for direct lookup
module.exports = PolygonalMode;
