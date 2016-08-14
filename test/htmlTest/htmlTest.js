/*jshint esversion: 6 */
var Vector = require('./../../src/vector');
var utils = require('./../../src/utils');
var RandomBackgroundGenerator = require('./../../src/RandomBackgroundGenerator');

var htmlTest = {};

htmlTest.run = function(canvasId){
    var back = new RandomBackgroundGenerator('canvas', 'Polygonal','#F9690E');
    back.getMode().setDensity(0.6);
    document.getElementById('generate').addEventListener('click', function(){
        back.generate();
    });
};

module.exports = htmlTest;
