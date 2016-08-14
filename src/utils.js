/*jshint esversion: 6 */
var Vector = require('./vector');

/*
 *	Polygon class constructor
 *
 * @param {Array} points: The points of the polygon. They must be in clockwise or counter-clockwise order
 */
function Polygon(points) {
    this._points = points || [];
}
Polygon.prototype = {
    get points() {
        return this._points;
    },

    set points(points) {
        this._points = points;
    },

    equal: function(polygon) {
        var reversed = polygon.points;
        reversed.reverse();

        return this.points.every(function(element, index) {
            return element.equal(polygon.points[index]);
        }) || this.points.every(function(element, index) {
            return element.equal(reversed[index]);
        });
    }
};

/*
 * Shrink a rectangle by value dx and value dy
 *
 * @return {Object} an object consisting of transformed p1, p2, p3, p4
 * @param {Vector} p1, p2, p3, p4: Points of a rectangle starting
 *								   from the top left corner and going
 *								   clockwise.
 */
function shrinkRect(p1, p2, p3, p4, byDx, byDy) {
    byDx = byDx || 0;
    byDy = byDy || 0;

    return {
        'p1': p1.clone().add(new Vector(byDx, byDy)),
        'p2': p2.clone().add(new Vector(-byDx, byDy)),
        'p3': p3.clone().add(new Vector(-byDx, -byDy)),
        'p4': p4.clone().add(new Vector(-byDx, byDy))
    };
}

/*
 *  Clamp a number within a range
 */
function clamp(x, lower, upper){
    return x < lower ? lower : x > upper ? upper : x;
}

/*
 *	Get a random number from a range
 *
 *	@return {int / float} A randomly generated number within a range
 *	@param {int / float} lower: The lower bound of the range(Inclusive)
 *	@param {int / float} upper: The upper bound of the range(Exclusive)
 *	@param {boolean} isInt: The flag to specify whether the result is int or float
 */
 function getRandomNumberFromRange(lower, upper, isInt) {
     if (lower >= upper) return 0;
     isInt = isInt || true;
    //--------------------------------------------------
    //	Some random numbers just coming out of nowhere
    //--------------------------------------------------
    var someRandomNumber1 = 1285,
        someRandomNumber2 = 2391;

    //	Generate the integer part
    var randomInt =
        parseInt(Math.random() * someRandomNumber1 * Math.random() * someRandomNumber2) % (upper - lower);

    if (isInt) {
        return lower + randomInt;
    } else {
        return lower + randomInt + Math.random();
    }
}

/*
 *  Get a random point on a rectangle
 *
 *	@param {Vector} p1, p2, p3, p4: Points of a rectangle starting
 *								   from the top left corner and going
 *								   clockwise.
 *	@param {boolean} isInt: The flag to specify whether the result is int or float
 */
function getRandomPointOnRect(p1, p2, p3, p4, isInt) {
    isInt = isInt || true;
    var width = Math.abs(p2.x - p1.x),
        height = Math.abs(p3.y - p2.y),
        topLeftX = Math.min(p1.x, p2.x, p3.x, p4.x),
        topLeftY = Math.min(p1.y, p2.y, p3.y, p4.y);

    var randomDeltaX = getRandomNumberFromRange(0, width, isInt),
        randomDeltaY = getRandomNumberFromRange(0, height, isInt);

    return new Vector(topLeftX + randomDeltaX, topLeftY + randomDeltaY);
}

/*
 *  Get a random point on a line
 *  @param {Vector} p1, p2: Points of a line from left to right
 */
function getRandomPointOnLine(p1, p2) {
    var projectionWidth = Math.abs(p1.x - p2.x),
        leftX = Math.min(p1.x, p2.x);

    var A = (p1.y - p2.y) / (p1.x - p2.x),
        B = p1.y - A * p1.x;

    var randomDeltaX = getRandomNumberFromRange(0, projectionWidth, false);
    return new Vector(leftX + randomDeltaX, A * (leftX + randomDeltaX) + B);
}

/*
 * Helper function used to create inheritance
 *
 * @return none
 * @param {Function} ctor: The constructor of the current object
 * @param {Function} superCtor: The constructor of the parent object
 */
 function inherit(ctor, superCtor) {
     ctor._super = superCtor;
     ctor.prototype = Object.create(superCtor.prototype, {
         constructor: {
             value: ctor,
             enumerable: false,
             writable: true,
             configurable: true
         }
     });
 }

//  Exports
module.exports = {
    Polygon: Polygon,
    clamp: clamp,
    getRandomNumberFromRange: getRandomNumberFromRange,
    getRandomPointOnRect: getRandomPointOnRect,
    getRandomPointOnLine: getRandomPointOnLine,
    inherit: inherit,
    shrinkRect: shrinkRect
};
