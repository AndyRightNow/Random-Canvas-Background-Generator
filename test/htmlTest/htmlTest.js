/*jshint esversion: 6 */
var Vector = require('./../../src/vector');
var utils = require('./../../src/utils');
var RandomBackgroundGenerator = require('./../../src/RandomBackgroundGenerator');
var Modes = require('./../../src/modes');

var htmlTest = {};

htmlTest.run = function(canvasId){
    var polyMode = new Modes.Polygonal(0.7, 600, 300, "#000000", "#FFFFFF");
    var back = new RandomBackgroundGenerator('canvas');
    polyMode.generate();

    for (let i = 0; i < polyMode.getPrimitives().length; i++) {
        console.log(i, polyMode.getPrimitives()[i]);
        back._fillPolygon("#4183D7", polyMode.getPrimitives()[i], true);
    }
};

module.exports = htmlTest;
