/*jshint esversion: 6 */
var utils = require('./../src/utils');
var Vector = require('./../src/vector');

describe('Polygon', function(){
    it('is a polygon with points to specify its shape and position', function(){
        var poly1 = new utils.Polygon([
            new Vector(10, 12),
            new Vector(22, 23),
            new Vector(32, 23),
            new Vector(42, 73),
            new Vector(52, 63),
            new Vector(62, 43)
            ]),
            poly2 = new utils.Polygon();
        for (let i = 0; i < poly1.points.length; i++) {
            expect(poly1.points[i]).toEqual(jasmine.any(Vector));
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

describe('getRandomNumberFromRange', function(){
    it('is a function to generate random number from a range', function(){
        for (let i = 0; i < 100; i++) {
            let rand = utils.getRandomNumberFromRange(0, 100);
            expect(rand).toEqual(jasmine.any(Number));
            expect(rand).not.toBeLessThan(0);
            expect(rand).toBeLessThan(100);
        }
        for (let i = 0; i < 100; i++) {
            let rand = utils.getRandomNumberFromRange(0, 100, false);
            expect(rand).toEqual(jasmine.any(Number));
            expect(rand).not.toBeLessThan(0);
            expect(rand).toBeLessThan(100);
        }
    });
});

describe('clamp', function(){
    it('is a function to clamp a number within a range(both sides inclusive)', function(){
        var val1 = 0,
            val2 = 10,
            val3 = -1,
            val4 = 0.12412;
        expect(utils.clamp(val1, 1, 2)).toEqual(1);
        expect(utils.clamp(val2, 1, 2)).toEqual(2);
        expect(utils.clamp(val3, -4, -3)).toEqual(-3);
        expect(utils.clamp(val4, 0, 2)).toEqual(val4);
    });
});

describe('getRandomPointOnRect', function(){
    it('is a function to get a random point on a rectangle', function(){
        var p1 = new Vector(0, 0),
            p2 = new Vector(10, 0),
            p3 = new Vector(10, 10),
            p4 = new Vector(0, 10);
        for (let i = 0; i < 100; i++) {
            var randPoint = utils.getRandomPointOnRect(p1, p2, p3, p4);
            expect(randPoint).toEqual(jasmine.any(Vector));
            expect(randPoint.x).not.toBeLessThan(0);
            expect(randPoint.x).not.toBeGreaterThan(10);
            expect(randPoint.y).not.toBeLessThan(0);
            expect(randPoint.y).not.toBeGreaterThan(10);
        }
    });
});

describe('getRandomPointOnLine', function(){
    it('is a function to get a random point on a line', function(){
        var p1 = new Vector(0, 0),
            p2 = new Vector(10, 10);
        for (let i = 0; i < 100; i++) {
            var randPoint = utils.getRandomPointOnLine(p1, p2);
            expect(randPoint).toEqual(jasmine.any(Vector));
            expect(randPoint.x).toEqual(randPoint.y);
        }
    });
});
