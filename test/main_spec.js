/**jshint esversion: 6 */
var RandomBackgroundGenerator = require('./../src/RandomBackgroundGenerator');

describe('RandomBackgroundGenerator constructor', function(){
    it('is a constructor of RandomBackgroundGenerator', function(){
        var obj1 = new RandomBackgroundGenerator({
            canvasId: 'canvas',
            mode: 'Polygonal'
        }),
            obj2 = new RandomBackgroundGenerator({
                canvasId: 'canvas'
            }),
            obj3 = new RandomBackgroundGenerator();

        expect(obj1).toEqual(jasmine.any(RandomBackgroundGenerator));
        expect(obj2).toEqual(jasmine.any(RandomBackgroundGenerator));
        expect(obj3).toEqual(jasmine.any(RandomBackgroundGenerator));

        expect(obj1._canvas).toBeNull();
        expect(obj1._modeName).toEqual('Polygonal');
        expect(obj1._canvasContext).toBeNull();

        expect(obj2._canvas).toBeNull();
        expect(obj2._modeName).toEqual('Polygonal');
        expect(obj2._canvasContext).toBeNull();

        expect(obj3._canvas).toBeNull();
        expect(obj3._modeName).toEqual('Polygonal');
        expect(obj3._canvasContext).toBeNull();
    });
});
