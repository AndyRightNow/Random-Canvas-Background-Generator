/*jshint esversion: 6 */
var Modes = require('./../src/modes');

describe('PolygonalMode constructor', function(){
    it('is the constructor of PolygonalMode object', function(){
        var polyMode1 = new Modes.Polygonal(0.2),
            polyMode2 = new Modes.Polygonal(0.1, 200, 500, "#000000", "#FFFFFF"),
            polyMode3 = new Modes.Polygonal(0.6, 300, 400, "#000000");

        //-------------------------
        //  Test base class members
        //----------------------------
        expect(polyMode1._baseColors).toEqual([]);
        expect(polyMode1._primitives).toEqual([]);
        expect(polyMode1._width).toEqual(0);
        expect(polyMode1._height).toEqual(0);

        expect(polyMode1._density).toEqual(0.8);
        expect(polyMode2._density).toEqual(0.9);
        expect(polyMode3._density).toEqual(0.4);

        expect(polyMode2._width).toEqual(200);
        expect(polyMode2._height).toEqual(500);
        expect(polyMode3._width).toEqual(300);
        expect(polyMode3._height).toEqual(400);

        expect(polyMode2._baseColors).toEqual(["#000000", "#FFFFFF"]);
        expect(polyMode3._baseColors).toEqual(["#000000"]);
    });
});

describe('PolygonalMode.prototype._generatePrimitives', function(){
    it('is a function used to generate primitives for drawing', function(){
        var polyMode = new Modes.Polygonal(0.7, 500, 500, "#000000", "#FFFFFF");
    });
});
