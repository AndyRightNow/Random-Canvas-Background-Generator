var Vector = require('./../../src/vector');
var utils = require('./../../src/utils');
var RandomBackgroundGenerator = require('./../../src/RandomBackgroundGenerator');
var Modes = require('./../../src/modes');

var htmlTest = {};

htmlTest.run = function(canvasId){
    var poly = new utils.Polygon([
        new Vector(100, 100),
        new Vector(200, 200),
        new Vector(100, 200)
    ]);
    var back = new RandomBackgroundGenerator(canvasId);
    back._fillPolygon("#4183D7", poly, true);


    console.log(Modes['Polygonal']);
};

module.exports = htmlTest;
