/*jshint esversion: 6 */
var Vector = require('./../../src/vector');
var utils = require('./../../src/utils');
var RandomBackgroundGenerator = require('./../../src/RandomBackgroundGenerator');

var htmlTest = {};

htmlTest.run = function(canvasId){
    var back = new RandomBackgroundGenerator('canvas', 'Polygonal','#AEA8D3', '#663399', '#BE90D4', '#E4F1FE');
    back.getMode().setDensity(0.6);
    back.getMode().setMixed(false);
    document.getElementById('generate').addEventListener('click', function(){
        back.generate();
    });
};

module.exports = htmlTest;
