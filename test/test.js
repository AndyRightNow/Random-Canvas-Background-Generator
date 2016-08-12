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

describe('getRandomNumberFromRange', function(){
    it('is a function to generate random number from a range', function(){
        for (let i = 0; i < 100; i++) {
            let rand = test.getRandomNumberFromRange(0, 100);
            expect(rand).toEqual(jasmine.any(Number));
            expect(rand).not.toBeLessThan(0);
            expect(rand).toBeLessThan(100);
        }
        for (let i = 0; i < 100; i++) {
            let rand = test.getRandomNumberFromRange(0, 100, false);
            expect(rand).toEqual(jasmine.any(Number));
            expect(rand).not.toBeLessThan(0);
            expect(rand).toBeLessThan(100);
        }
    });
});

describe('hexToRgb', function(){
    it('is a function to convert from hex color to rgb color', function(){
        var hex1 = "#010101",
            hex2 = "#AAAAAA",
            hex3 = "#323",
            hex4 = "rgb(0, 23, 34)",
            hex5 = 'rgba(0, 0, 0, 1)';
        expect(test.hexToRgb(hex1)).toEqual('rgb(1, 1, 1)');
        expect(test.hexToRgb(hex2)).toEqual('rgb(170, 170, 170)');
        expect(test.hexToRgb(hex3)).toBeNull();
        expect(test.hexToRgb(hex4)).toEqual(hex4);
        expect(test.hexToRgb(hex5)).toEqual(hex5);
    });
});

describe('isHex', function(){
    it('is a function to test if a string is hex color string', function(){
        var hex1 = "#010101",
            hex2 = "#AAAAAA",
            hex3 = "#323",
            hex4 = "rgb(0, 23, 34)";
        expect(test.isHex(hex1)).toBe(true);
        expect(test.isHex(hex2)).toBe(true);
        expect(test.isHex(hex3)).toBe(false);
        expect(test.isHex(hex4)).toBe(false);
    });
});

describe('isRgb', function(){
    it('is a function to test if a string is rgb color string', function(){
        var color1 = "#010101",
            color2 = "rgba(0, 23, 34)",
            color3 = "rgb(0, 23, 34, 5)",
            color4 = "rgb(0, 23, 34)",
            color5 = 'rgba(0, 0, 0, 1)';
        expect(test.isRgb(color1)).toBe(false);
        expect(test.isRgb(color2)).toBe(false);
        expect(test.isRgb(color3)).toBe(false);
        expect(test.isRgb(color4)).toBe(true);
        expect(test.isRgb(color5)).toBe(false);
    });
});

describe('isRgba', function(){
    it('is a function to test if a string is rgba color string', function(){
        var color1 = "#010101",
            color2 = "rgba(0, 23, 34)",
            color3 = "rgb(0, 23, 34, 5)",
            color4 = "rgb(0, 23, 34)",
            color5 = 'rgba(0, 0, 0, 1)';
        expect(test.isRgba(color1)).toBe(false);
        expect(test.isRgba(color2)).toBe(false);
        expect(test.isRgba(color3)).toBe(false);
        expect(test.isRgba(color4)).toBe(false);
        expect(test.isRgba(color5)).toBe(true);
    });
});

describe('adjustColorBrightness', function(){
    it('is a function to darken or brighten a color by a certain percentage', function(){
        OUTPUT('adjustColorBrightness Test Data: ');
        var color1 = "#010101",
            color2 = "rgba(0, 23, 34)",
            color3 = "rgb(0, 23, 34, 5)",
            color4 = "rgb(0, 23, 34)",
            color5 = 'rgba(0, 0, 0, 1)';
        OUTPUT(color1, test.adjustColorBrightness(color1, 0.5));
        OUTPUT(color2, test.adjustColorBrightness(color2, 0.2));
        OUTPUT(color3, test.adjustColorBrightness(color3, 0.6));
        OUTPUT(color4, test.adjustColorBrightness(color4, 0.1));
        OUTPUT(color5, test.adjustColorBrightness(color5, 1));
    });
});

describe('clamp', function(){
    it('is a function to clamp a number within a range(both sides inclusive)', function(){
        var val1 = 0,
            val2 = 10,
            val3 = -1,
            val4 = 0.12412;
        expect(test.clamp(val1, 1, 2)).toEqual(1);
        expect(test.clamp(val2, 1, 2)).toEqual(2);
        expect(test.clamp(val3, -4, -3)).toEqual(-3);
        expect(test.clamp(val4, 0, 2)).toEqual(val4);
    });
});

describe('getRandomPointOnRect', function(){
    it('is a function to get a random point on a rectangle', function(){
        var p1 = new test.Point(0, 0),
            p2 = new test.Point(10, 0),
            p3 = new test.Point(10, 10),
            p4 = new test.Point(0, 10);
        for (let i = 0; i < 100; i++) {
            var randPoint = test.getRandomPointOnRect(p1, p2, p3, p4);
            expect(randPoint).toEqual(jasmine.any(test.Point));
            expect(randPoint.x).not.toBeLessThan(0);
            expect(randPoint.x).not.toBeGreaterThan(10);
            expect(randPoint.y).not.toBeLessThan(0);
            expect(randPoint.y).not.toBeGreaterThan(10);
        }
    });
});

describe('getRandomPointOnLine', function(){
    it('is a function to get a random point on a line', function(){
        var p1 = new test.Point(0, 0),
            p2 = new test.Point(10, 10);
        for (let i = 0; i < 100; i++) {
            var randPoint = test.getRandomPointOnLine(p1, p2);
            expect(randPoint).toEqual(jasmine.any(test.Point));
            expect(randPoint.x).toEqual(randPoint.y);
        }
    });
});

describe('randomColor', function(){
    it('is a function to generate random color with random brightness', function(){
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
        expect(rand4).toBeNull();
    });
});

describe('randomGradient', function(){
    it('is a function to generate random gradient color with random brightness on both sides', function(){
        OUTPUT("randomGradient Test data: ");
        var color1 = "#0F0F0F",
            color2 = "rgb(0, 24, 52)",
            color3 = "rgba(23, 52, 12, 1)",
            color4 = "#23";
        var rand1 = test.randomGradient(color1, 0.3),
            rand2 = test.randomGradient(color2, 0.2),
            rand3 = test.randomGradient(color3, 0.7),
            rand4 = test.randomGradient(color4);
        OUTPUT(color1, rand1);
        OUTPUT(color2, rand2);
        OUTPUT(color3, rand3);
        OUTPUT(color4, rand4);
        expect(rand1).toEqual(jasmine.any(Object));
        expect(rand2).toEqual(jasmine.any(Object));
        expect(rand3).toEqual(jasmine.any(Object));
        expect(rand4.first).toBeNull();
        expect(rand4.second).toBeNull();
    });
});
