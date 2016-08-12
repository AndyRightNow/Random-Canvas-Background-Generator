/*jshint esversion: 6 */

var test = require('../src/RandomBackgroundGenerator');

function OUTPUT(content) {
    console.log('\n');
    console.log('--------------------------------------');
    console.log.apply(console, arguments);
    console.log('--------------------------------------');
}

describe('Point', function(){
    it('is a point(vector) with two members: x and y', function(){
        var p1 = new test.Point(),
            p2 = new test.Point(1, 1),
            p3 = new test.Point(0.2131);
        expect(p1.x).toEqual(0);
        expect(p1.y).toEqual(0);
        expect(p2.x).toEqual(1);
        expect(p2.y).toEqual(1);
        expect(p3.x).toEqual(0.2131);
        expect(p3.y).toEqual(0);
    });
});

describe('Polygon', function(){
    it('is a polygon with points to specify its shape and position', function(){
        var poly1 = new test.Polygon([
            new test.Point(10, 12),
            new test.Point(22, 23),
            new test.Point(32, 23),
            new test.Point(42, 73),
            new test.Point(52, 63),
            new test.Point(62, 43)
            ]),
            poly2 = new test.Polygon();
        for (let i = 0; i < poly1.points.length; i++) {
            expect(poly1.points[i]).toEqual(jasmine.any(test.Point));
        }
        expect(poly2.points.length).toEqual(0);
        expect(poly1.points[0].x).toEqual(10);
        expect(poly1.points[0].y).toEqual(12);
        expect(poly1.points[1].x).toEqual(22);
        expect(poly1.points[1].y).toEqual(23);
        expect(poly1.points[2].x).toEqual(32);
        expect(poly1.points[2].y).toEqual(23);
        expect(poly1.points[3].x).toEqual(42);
        expect(poly1.points[3].y).toEqual(73);
        expect(poly1.points[4].x).toEqual(52);
        expect(poly1.points[4].y).toEqual(63);
        expect(poly1.points[5].x).toEqual(62);
        expect(poly1.points[5].y).toEqual(43);
    });
});

describe('randomColor', function(){
    it('is a function to generate random color', function(){
        OUTPUT("randomColor Test data: ");
        var color1 = "#0F0F0F",
            color2 = "rgb(0, 24, 52)",
            color3 = "rgba(23, 52, 12, 1)",
            color4 = "#23";
        var rand1 = test.randomColor(color1, 0.3),
            rand2 = test.randomColor(color2, 0.2),
            rand3 = test.randomColor(color3, 0.7),
            rand4 = test.randomColor(color4);
        OUTPUT(color1, rand1);
        OUTPUT(color2, rand2);
        OUTPUT(color3, rand3);
        OUTPUT(color4, rand4);
        expect(rand1).toEqual(jasmine.any(String));
        expect(rand2).toEqual(jasmine.any(String));
        expect(rand3).toEqual(jasmine.any(String));
        expect(rand4).toEqual(null);
    });
});
