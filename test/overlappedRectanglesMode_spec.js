/*jshint esversion: 6 */
var OverlappedRectanglesMode = require('./../src/overlapped-rectangles.mode');

describe('OverlappedRectanglesMode constructor', function(){
    it('is the constructor of OverlappedRectanglesMode object', function(){
        var mode1 = new OverlappedRectanglesMode({
            density: 0.2
        }),
            mode2 = new OverlappedRectanglesMode({
                density: 0.1,
                canvasWidth: 200,
                canvasHeight: 500,
                baseColors: ["#000000", "#FFFFFF"]
            }),
            mode3 = new OverlappedRectanglesMode({
                density: 0.6,
                canvasWidth: 300,
                canvasHeight: 400,
                baseColors: ["#000000"]
            });

        //-------------------------
        //  Test base class members
        //----------------------------
        expect(mode1._baseColors).toEqual([]);
        expect(mode1._primitives).toEqual([]);
        expect(mode1._width).toEqual(0);
        expect(mode1._height).toEqual(0);

        expect(mode1._density).toEqual(0.8);
        expect(mode2._density).toEqual(0.9);
        expect(mode3._density).toEqual(0.4);

        expect(mode2._width).toEqual(200);
        expect(mode2._height).toEqual(500);
        expect(mode3._width).toEqual(300);
        expect(mode3._height).toEqual(400);

        expect(mode2._baseColors).toEqual(["#000000", "#FFFFFF"]);
        expect(mode3._baseColors).toEqual(["#000000"]);
    });
});
