/**jshint esversion: 6 */
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

describe('Graph.prototype.insert', function(){
    it('is a function to insert element to the Graph', function() {
        var g = new Graph(100, 100);
        g.insert(0, 0, 1);

        expect(g._data[0][0]).toEqual(1);
        expect(g.insert(1, 1, 2)).toBe(true);
        expect(g.insert(-1, -1, 2)).toBe(false);
        expect(g.insert(100, 100, 2)).toBe(false);
        expect(g._data[1][1]).toEqual(2);
    });
});

describe('Graph.prototype.get', function(){
    it('is a function to get element from the Graph', function() {
        var g = new Graph(100, 100);
        g.insert(0, 0, 1);

        expect(g.get(0, 0)).toEqual(1);
        expect(g.get(1, 1)).toBe(0);
        expect(g.get(100, 100)).toBeNull();
    });
});

describe('Graph.prototype.rowCount and Graph.prototype.columnCount', function(){
    it('are functions to get the counts of rows and columns from the Graph', function() {
        var g = new Graph(100, 100);

        expect(g.rowCount()).toEqual(100);
        expect(g.columnCount()).toEqual(100);
    });
});

describe('Graph.prototype._getId', function(){
    it('is a function to get a id from a pair of positions', function() {
        var g = new Graph(100, 100);

        expect(g._getId(10, 12)).toEqual('1012');
        expect(g._getId(100, 102)).toBeNull();
    });
});

describe('Graph.prototype.isConnected', function(){
    it('is a function to check if two pairs of positions are connected', function() {
        var g = new Graph(100, 100);

        expect(g.isConnected(0, 0, 1, 1)).toBe(false);
        expect(g.isConnected(100, 100, 1000, 1000)).toBe(false);
    });
});

describe('Graph.prototype.connect', function(){
    it('is a function to connect two pairs of positions', function() {
        var g = new Graph(100, 100);

        expect(g.connect(0, 0, 1, 1)).toBe(true);
        expect(g.isConnected(0, 0, 1, 1)).toBe(true);
        expect(g.connect(100, 100, 1000, 1000)).toBe(false);
    });
});

describe('Graph.prototype.disconnect', function(){
    it('is a function to disconnect two pairs of positions', function() {
        var g = new Graph(100, 100);

        expect(g.connect(0, 0, 1, 1)).toBe(true);
        expect(g.isConnected(0, 0, 1, 1)).toBe(true);
        expect(g.disconnect(0, 0, 1, 1)).toBe(true);
        expect(g.isConnected(0, 0, 1, 1)).toBe(false);
        expect(g.disconnect(100, 100, 1000, 1000)).toBe(false);
    });
});
