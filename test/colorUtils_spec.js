/*jshint esversion: 6 */
var colorUtils = require('./../src/colorUtils');
var test = require('./test');

describe('hexToRgb', function(){
    it('is a function to convert from hex color to rgb color', function(){
        var hex1 = "#010101",
            hex2 = "#AAAAAA",
            hex3 = "#323",
            hex4 = "rgb(0, 23, 34)",
            hex5 = 'rgba(0, 0, 0, 1)';
        expect(colorUtils.hexToRgb(hex1)).toEqual('rgb(1, 1, 1)');
        expect(colorUtils.hexToRgb(hex2)).toEqual('rgb(170, 170, 170)');
        expect(colorUtils.hexToRgb(hex3)).toBeNull();
        expect(colorUtils.hexToRgb(hex4)).toEqual(hex4);
        expect(colorUtils.hexToRgb(hex5)).toEqual(hex5);
    });
});

describe('isHex', function(){
    it('is a function to test if a string is hex color string', function(){
        var hex1 = "#010101",
            hex2 = "#AAAAAA",
            hex3 = "#323",
            hex4 = "rgb(0, 23, 34)";
        expect(colorUtils.isHex(hex1)).toBe(true);
        expect(colorUtils.isHex(hex2)).toBe(true);
        expect(colorUtils.isHex(hex3)).toBe(false);
        expect(colorUtils.isHex(hex4)).toBe(false);
    });
});

describe('isRgb', function(){
    it('is a function to test if a string is rgb color string', function(){
        var color1 = "#010101",
            color2 = "rgba(0, 23, 34)",
            color3 = "rgb(0, 23, 34, 5)",
            color4 = "rgb(0, 63, 34)",
            color5 = 'rgba(0, 0, 0, 1)',
            color6 = 'rgb(2232, 2312321423, 123123)';
        expect(colorUtils.isRgb(color1)).toBe(false);
        expect(colorUtils.isRgb(color2)).toBe(false);
        expect(colorUtils.isRgb(color3)).toBe(false);
        expect(colorUtils.isRgb(color4)).toBe(true);
        expect(colorUtils.isRgb(color5)).toBe(false);
        expect(colorUtils.isRgb(color6)).toBe(true);
    });
});

describe('isRgba', function(){
    it('is a function to test if a string is rgba color string', function(){
        var color1 = "#010101",
            color2 = "rgba(0, 23, 34)",
            color3 = "rgb(0, 23, 34, 5)",
            color4 = "rgb(0, 23, 34)",
            color5 = 'rgba(0, 0, 0, 1)';
        expect(colorUtils.isRgba(color1)).toBe(false);
        expect(colorUtils.isRgba(color2)).toBe(false);
        expect(colorUtils.isRgba(color3)).toBe(false);
        expect(colorUtils.isRgba(color4)).toBe(false);
        expect(colorUtils.isRgba(color5)).toBe(true);
    });
});

describe('adjustColorBrightness', function(){
    it('is a function to darken or brighten a color by a certain percentage', function(){
        test.OUTPUT('adjustColorBrightness Test Data: ');
        var color1 = "#010101",
            color2 = "rgba(0, 23, 34)",
            color3 = "rgb(0, 23, 34, 5)",
            color4 = "rgb(0, 23, 34)",
            color5 = 'rgba(0, 0, 0, 1)';
        test.OUTPUT(color1, colorUtils.adjustColorBrightness(color1, 0.5));
        test.OUTPUT(color2, colorUtils.adjustColorBrightness(color2, 0.2));
        test.OUTPUT(color3, colorUtils.adjustColorBrightness(color3, 0.6));
        test.OUTPUT(color4, colorUtils.adjustColorBrightness(color4, 0.1));
        test.OUTPUT(color5, colorUtils.adjustColorBrightness(color5, 1));
    });
});


describe('randomColor', function(){
    it('is a function to generate random color with random brightness', function(){
        test.OUTPUT("randomColor Test data: ");
        var color1 = "#0F0F0F",
            color2 = "rgb(0, 24, 52)",
            color3 = "rgba(23, 52, 12, 1)",
            color4 = "#23";
        var rand1 = colorUtils.randomColor(color1, 0.3),
            rand2 = colorUtils.randomColor(color2, 0.2),
            rand3 = colorUtils.randomColor(color3, 0.7),
            rand4 = colorUtils.randomColor(color4);
        test.OUTPUT(color1, rand1);
        test.OUTPUT(color2, rand2);
        test.OUTPUT(color3, rand3);
        test.OUTPUT(color4, rand4);
        expect(rand1).toEqual(jasmine.any(String));
        expect(rand2).toEqual(jasmine.any(String));
        expect(rand3).toEqual(jasmine.any(String));
        expect(rand4).toBeNull();
    });
});

describe('randomGradient', function(){
    it('is a function to generate random gradient color with random brightness on both sides', function(){
        test.OUTPUT("randomGradient Test data: ");
        var color1 = "#0F0F0F",
            color2 = "rgb(0, 24, 52)",
            color3 = "rgba(23, 52, 12, 1)",
            color4 = "#23";
        var rand1 = colorUtils.randomGradient(color1, 0.3),
            rand2 = colorUtils.randomGradient(color2, 0.2),
            rand3 = colorUtils.randomGradient(color3, 0.7),
            rand4 = colorUtils.randomGradient(color4);
        test.OUTPUT(color1, rand1);
        test.OUTPUT(color2, rand2);
        test.OUTPUT(color3, rand3);
        test.OUTPUT(color4, rand4);
        expect(rand1).toEqual(jasmine.any(Object));
        expect(rand2).toEqual(jasmine.any(Object));
        expect(rand3).toEqual(jasmine.any(Object));
        expect(rand4.first).toBeNull();
        expect(rand4.second).toBeNull();
    });
});
