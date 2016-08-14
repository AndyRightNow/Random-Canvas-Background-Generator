/*
 * Undirected acylic graph data structure using
 * adjaceny matrix as implementation
 *
 */

function Graph(rowCount, columnCount) {
    this._rowCount = rowCount || 0;
    this._columnCount = columnCount || 0;
    
    this._data = (new Array(rowCount)).fill(new Array(columnCount), 0);
}

Graph.prototype.insert = function(i, j) {

};

//  Exports
module.exports = Graph;
