/*jshint esversion: 6 */

var test = require('../src/RandomBackgroundGenerator');

function OUTPUT(content) {
    console.log('\n');
    console.log('--------------------------------------');
    console.log.apply(console, arguments);
    console.log('--------------------------------------');
}

describe('Point Test', function(){
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

describe('randomColor Test', function(){
  it('is a function to generate random color', function(){
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
