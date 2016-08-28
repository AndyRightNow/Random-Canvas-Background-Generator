/*jshint esversion: 6 */
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

module.exports = Polygon;
