/*jshint esversion: 6 */
var Graph = require('./../src/graph');

describe('Graph constructor', function(){
    it('is the constructor of Graph object', function() {
        var g = new Graph(100, 100);
        expect(g._data.length).toEqual(100);
        expect(g._data[0].length).toEqual(100);
        expect(g._rowCount).toEqual(100);
        expect(g._columnCount).toEqual(100);
    });
});
