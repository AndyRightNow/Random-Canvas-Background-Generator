/**jshint esversion: 6 */
/**
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

    /**
     * Test if two polygons are equal
     *
     * @return {boolean} true if equal false if not
     * @param {Number} polygon: The other polygon to test
     */
    equal: function(polygon) {
        var reversed = polygon.points;
        reversed.reverse();

        return this.points.every(function(element, index) {
            return element.equal(polygon.points[index]);
        }) || this.points.every(function(element, index) {
            return element.equal(reversed[index]);
        });
    },

    /**
     * Translate the polygon BY certain dx and dy
     *
     * @return {Polygon} itself for chaining
     * @param {Number} dx, dy: The distance x and y to translate
     */
    translate: function(dx, dy) {
        this.points.map(function(ele){
            return ele.translate(dx, dy);
        });
        return this;
    },

    /**
     * Rotate the polygon around a certain origin clockwise
     *
     * @return {Polygon} itself for chaining
     * @param {Number} angle: The angle to rotate
     * @param {Vector} origin: The origin to rotate around
     */
    rotate: function(angle, origin) {
        //------------------------------
        //  Translate to a position where the specified
        //  origin matching the origin of the canvas
        //------------------------------
        this.translate(-origin.x, -origin.y);

        this.points.map(function(ele){
            return ele.rotate(angle);
        });

        //------------------------------
        //  Translate back to original position
        //------------------------------
        this.translate(origin.x, origin.y);
        return this;
    },

    /**
     * Public member function - clone the polygon
     *
     */
    clone: function() {
        var clonedPoints = [];
        this.points.forEach(function(ele){
            clonedPoints.push(ele.clone());
        });
        return new Polygon(clonedPoints);
    }
};

module.exports = Polygon;
