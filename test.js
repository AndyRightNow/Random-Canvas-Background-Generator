/*
 *  Temporary test framework
 */

 function OUTPUT_INLINE(args){
    console.log.apply(console, arguments);
 }

 function OUTPUT_NEWLINE(args){
    for (var i = 0; i < arguments.length; i++)
        console.log(arguments[i]);
 }

 function OUTPUT_BOOLEAN_RESULT(a, b, res) {
    console.log("---------------------------", a, b, "Equal: ", Boolean(res));
 }

 function OUTPUT_ARRAY(arr){
    arr.forEach(function(e) {   console.log(e); });
 }

function CHECK_UNDEFINED(obj) {
    if (typeof obj === "undefined") {
        console.log(obj, "UNDEFINED", Boolean(true));
        return true;
    }
    else {
        console.log(obj, "UNDEFINED", Boolean(false));
        return false;
    }
}

function TEST(testName, func) {
    console.log("--------------------------------------------------------------------------------");
    console.log(testName + ": ");
    func();
    console.log("--------------------------------------------------------------------------------");
    console.log("\n");
}

function ASSERT_EQUAL(a, b, func = function(a, b){return a === b;}){
    var res = func(a, b);
    OUTPUT_BOOLEAN_RESULT(a, b, res);
    return res;
}

function ASSERT_OBJECT_EQUAL(a, b, func = function(a, b){return a === b;}){
    var res = true;
    if (Object.keys(a).length !== Object.keys(b).length) res = false;
    else {
        for (var prop in a) {
            if (!b.hasOwnProperty(prop) ||
                !func(b[prop], a[prop])) {
                res = false;
                break;
            }
        }
    }
    OUTPUT_BOOLEAN_RESULT(a, b, res);
    return res;
}

function ASSERT_ARRAY_EQUAL(a, b, func = function(a, b){return a === b;}){
    var res = true;
    if (a.length !== b.length) {
         res = false;
    }
    else {
        for (var i = 0; i < a.length; i++){
            if (!func(a[i], b[i])) {
                 res = false;
                 break;
            }
        }
    }
    OUTPUT_BOOLEAN_RESULT(a, b, res);
    return res;
}

function ASSERT_TRUE(cond){
    console.log("ASSERT " + "CONDITIONS "+ Boolean(cond));
}

TEST("Constructor Test", function() {
    var background1 = new RandomBackgroundGenerator("canvas", "Polygonal");
    var background2 = new RandomBackgroundGenerator("canvas");
    var background3 = new RandomBackgroundGenerator();
    ASSERT_TRUE(
        ASSERT_EQUAL(background1._canvas, document.getElementById("canvas")) &&
        ASSERT_EQUAL(background1._mode, "Polygonal") &&
        ASSERT_EQUAL(background2._canvas, document.getElementById("canvas")) &&
        ASSERT_EQUAL(background2._mode, "Polygonal") &&
        ASSERT_EQUAL(background3._canvas, null) &&
        ASSERT_EQUAL(background3._mode, "Polygonal"));
});

TEST("Point Class Test", function() {
    var point = new Point(1, 1);
    var point1 = new Point();

    ASSERT_TRUE(
        ASSERT_EQUAL(point.x, 1) &&
        ASSERT_EQUAL(point.y, 1) &&
        ASSERT_EQUAL(point1.x, 0) &&
        ASSERT_EQUAL(point1.y, 0)
        );
});

TEST("Polygon Class Test", function() {
    var poly = new Polygon([
		new Point(10, 10),
		new Point(20, 20),
		new Point(30, 30)]);
    var poly1 = new Polygon();

    ASSERT_TRUE(
        ASSERT_ARRAY_EQUAL(poly._points, [
        new Point(10, 10),
        new Point(20, 20),
        new Point(30, 30)], ASSERT_OBJECT_EQUAL) &&
        ASSERT_ARRAY_EQUAL(poly1._points, [], ASSERT_OBJECT_EQUAL)
        );
});

TEST("getRandomNumberFromRange Test", function() {
    var ret = [];
    for (var i = 0; i < 100; i++) {
        ret.push(getRandomNumberFromRange(0, 100));
    }

    OUTPUT_ARRAY([ret]);
});

TEST("hexToRGB Test", function() {
    var hex1 = "#000000";
    var hex2 = "#0F0F0F";
    var hex3 = "#000";
    var hex4 = "#FFFFFF";
    OUTPUT_NEWLINE(
	hexToRGB(hex1),
	hexToRGB(hex2),
	hexToRGB(hex3),
	hexToRGB(hex4));
});

TEST("isHex Test", function() {
    var hex1 = "#000000";
    var hex2 = "#0F0F0F";
    var hex3 = "#000";
    var hex4 = "#FFFFFF";
    OUTPUT_INLINE(hex1, hex2, hex3, hex4);
	ASSERT_TRUE(
    ASSERT_EQUAL(isHex(hex1), true) &&
	ASSERT_EQUAL(isHex(hex2), true) &&
	ASSERT_EQUAL(isHex(hex3), false) &&
	ASSERT_EQUAL(isHex(hex4), true) );
});

TEST("isRgb Test", function() {
    var rgb1 = "#000000";
    var rgb2 = "rgba(0,             0,               0)";
    var rgb3 = "rgb(0, 0, 0, 0)";
    var rgb4 = "rgb(0, 0, 0)";
    var rgb5 = "rgba(0, 0, 0, 0.5)";
    OUTPUT_NEWLINE(rgb1, rgb2, rgb3, rgb4, rgb5);
    ASSERT_TRUE(
    ASSERT_EQUAL(isRgb(rgb1), false) &&
    ASSERT_EQUAL(isRgb(rgb2), false) &&
    ASSERT_EQUAL(isRgb(rgb3), false) &&
    ASSERT_EQUAL(isRgb(rgb4), true) &&
    ASSERT_EQUAL(isRgb(rgb5), true) );
});

TEST("adjustColorBrightness Test", function() {
    var rgb1 = "#0F0F0F";
    var rgb2 = "#010101";
    var rgb3 = "#0B0B0B";
    var rgb4 = "#000";
    OUTPUT_NEWLINE(
    rgb1, adjustColorBrightness(rgb1, 0.3),
    rgb2, adjustColorBrightness(rgb2, 0.2),
    rgb3, adjustColorBrightness(rgb3, -0.3),
    rgb4, adjustColorBrightness(rgb4)
    );
});

TEST("clamp Test", function(){
    var val1 = 5;
    var val2 = 3.4;
    var val3 = -23;
    var val4 = -2.5;
    OUTPUT_INLINE(val1, val2, val3, val4);
    ASSERT_TRUE(
        ASSERT_EQUAL(clamp(val1, 3, 4), 4) &&
        ASSERT_EQUAL(clamp(val2, 2.1, 2.4), 2.4) &&
        ASSERT_EQUAL(clamp(val3, -2, -1), -2) &&
        ASSERT_EQUAL(clamp(val4, 1, 2), 1) );
});

// TEST("_fillPolygon Test", function(){
// 	var background = new RandomBackgroundGenerator("canvas", 3.0,true , "#000000", "#111111");
// 	background._fillPolygon("red", 
// 		[
// 		new Point(10, 10),
// 		new Point(20, 20),
// 		new Point(10, 30)
// 		]);

// 	return [background];
// });

