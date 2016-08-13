var Modes = require('./../src/modes');

describe('PolygonalMode constructor', function(){
    it('is the constructor of PolygonalMode object', function(){
        var polyMode1 = new Modes.Polygonal(0.2),
            polyMode2 = new Modes.Polygonal(0.1, "#000000", "#FFFFFF"),
            polyMode3 = new Modes.Polygonal();

        //-------------------------
        //  Test base class members
        //----------------------------
        expect(polyMode1._baseColors).toEqual([]);
        expect(polyMode1._drawOrders).toEqual([]);
        expect(polyMode1._points).toEqual([]);

        expect(polyMode1._density).toEqual(0.2);
        expect(polyMode2._density).toEqual(0.1);
        expect(polyMode3._density).toEqual(0.5);

        expect(polyMode2._baseColors).toEqual(["#000000", "#FFFFFF"]);
    });
});
