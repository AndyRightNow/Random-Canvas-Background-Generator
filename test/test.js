/*jshint esversion: 6 */

var test = require('../src/RandomBackgroundGenerator');

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
