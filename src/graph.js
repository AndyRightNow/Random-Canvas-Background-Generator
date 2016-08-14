/*
 * Undirected acylic graph data structure using
 * adjaceny matrix as implementation
 *
 */

function Graph(rowCount, columnCount) {
    this._rowCount = rowCount || 0;
    this._columnCount = columnCount || 0;

    //  Allocate an empty matrix
    this._data = (new Array(rowCount)).fill(new Array(columnCount), 0);

    this._edges = {};
}

/*
 * Private member function - check if a pair of positions is in the range of rows and columns
 *
 * @param {Integer} i: The zero-based row position
 * @param {Integer} j: The zero-based column position
 */
Graph.prototype._checkBound = function(i, j) {
    if (i >= this._rowCount ||
        j >= this._columnCount ||
        i < 0 || j < 0) return false;
    return true;
};

/*
 * Private member function - get an id from a pair of positions
 *
 * @param {Integer} i: The zero-based row position
 * @param {Integer} j: The zero-based column position
 */
Graph.prototype._getId = function(i, j) {
    return this._checkBound(i, j) ? i.toString() + j.toString() : null;
};

/*
 * Public member function - return the count of rows
 */
Graph.prototype.rowCount = function() {
    return this._rowCount;
};
/*
 * Public member function - return the count of columns
 */
Graph.prototype.columnCount = function() {
    return this._columnCount;
};

/*
 * Public member function - insert an element to the graph
 *
 * @return {Boolean} true if insertion is successful and false if not
 * @param {Integer} i: The zero-based row position
 * @param {Integer} j: The zero-based column position
 * @param {Any} value: The value to insert
 */
Graph.prototype.insert = function(i, j, value) {
    if (this._checkBound(i, j)) {
        this._data[i][j] = value;
        return true;
    }
    else return false;
};

/*
 * Public member function - get a element from a pair of position
 *
 * @param {Integer} i: The zero-based row position
 * @param {Integer} j: The zero-based column position
 */
Graph.prototype.get = function(i, j) {
    if (this._checkBound(i, j)) {
        return this._data[i][j];
    }
    else return null;
};

/*
 * Public member function - check if two vertices are connected
 *
 * @param {Integer} i1, i2: The zero-based row position
 * @param {Integer} j1, j2: The zero-based column position
 */
Graph.prototype.isConnected = function(i1, j1, i2, j2) {
    if (!this._checkBound(i1, j1) ||
        !this._checkBound(i2, j2)) return false;

    var id1 = this._getId(i1, j1),
        id2 = this._getId(i2, j2);

    if (typeof this._edges[id1] === 'undefined') {
        return false;
    }
    return this._edges[id1][id2];
};

/*
 * Public member function - connect the edge of two vertices
 *
 * @param {Integer} i1, i2: The zero-based row position
 * @param {Integer} j1, j2: The zero-based column position
 */
Graph.prototype.connect = function(i1, j1, i2, j2) {
    if (!this._checkBound(i1, j1) ||
        !this._checkBound(i2, j2)) return false;

    var id1 = this._getId(i1, j1),
        id2 = this._getId(i2, j2);

    if (typeof this._edges[id1] === 'undefined') {
        this._edges[id1] = {};
    }
    this._edges[id1][id2] = true;

    return true;
};

/*
 * Public member function - disconnect the edge of two vertices
 *
 * @param {Integer} i1, i2: The zero-based row position
 * @param {Integer} j1, j2: The zero-based column position
 */
Graph.prototype.disconnect = function(i1, j1, i2, j2) {
    if (!this._checkBound(i1, j1) ||
        !this._checkBound(i2, j2)) return false;

    var id1 = this._getId(i1, j1),
        id2 = this._getId(i2, j2);

    if (typeof this._edges[id1] === 'undefined') {
        return true;
    }
    this._edges[id1][id2] = false;

    return true;
};

//  Exports
module.exports = Graph;
