/*jshint esversion: 6 */
var Vector = require('./../../src/vector');
var utils = require('./../../src/utils');
var RandomBackgroundGenerator = require('./../../src/RandomBackgroundGenerator');

var htmlTest = {};



htmlTest.run = function(canvasId){
    var back = new RandomBackgroundGenerator('canvas', 'Polygonal', '#87D37C', '#90C695', '#4183D7');
    back.getMode().setDensity(0.8);
    document.getElementById('generate').addEventListener('click', function(){
        back.generate();
    });
};

module.exports = htmlTest;
