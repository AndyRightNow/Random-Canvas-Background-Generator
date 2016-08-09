/*
 *  Temporary test framework
 */

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
    console.log("--------------------------------------------------------");
    console.log(testName + ": ");
    func();
    console.log("--------------------------------------------------------");
    console.log("\n");
}

function ASSERT_EQUAL(a, b){
    var res = a === b;
    console.log("---------------------------", a, b, "Equal: ", Boolean(res));
    if (res) return true;
    else return false;
}

function ASSERT_TRUE(cond){
    if (cond) {
        console.log("Conditions all PASS!");
    }
    else{
        console.log("Conditions don't pass completely.");
    }
}

TEST("Constructor Test", function() {
    var background1 = new RandomBackgroundGenerator("canvas", "Polygonal");
    var background2 = new RandomBackgroundGenerator("canvas");
    var background3 = new RandomBackgroundGenerator();
    ASSERT_TRUE(
        ASSERT_EQUAL(background1._canvas, document.getElementById("canvas")) &&
        ASSERT_EQUAL(background1._mode, "Polygonal") &&
        ASSERT_EQUAL(background2._canvas, document.getElementById("canvas")) &&
        CHECK_UNDEFINED(background2._mode) &&
        ASSERT_EQUAL(background3._canvas, null) &&
        CHECK_UNDEFINED(background3._mode));
});

TEST("Point Class Test", function() {
    var point = new Point(1, 1);
    var point1 = new Point();

    return [
		point, point1
	];
});

TEST("Polygon Class Test", function() {
    var poly = new Polygon([
		new Point(10, 10),
		new Point(20, 20),
		new Point(30, 30)]);
    var poly1 = new Polygon();

    return [
		poly, poly1
	];
});

TEST("getRandomNumberFromRange Test", function() {
    var ret = [];
    for (var i = 0; i < 100; i++) {
        ret.push(getRandomNumberFromRange(0, 100));
    }

    return [ret];
});

TEST("hexToRGB Test", function() {
    var hex1 = "#000000";
    var hex2 = "#0F0F0F";
    var hex3 = "#000";
    var hex4 = "#FFFFFF";
    return [
	hexToRGB(hex1),
	hexToRGB(hex2),
	hexToRGB(hex3),
	hexToRGB(hex4)];
});

TEST("isHex Test", function() {
    var hex1 = "#000000";
    var hex2 = "#0F0F0F";
    var hex3 = "#000";
    var hex4 = "#FFFFFF";
    return [
	hex1, isHex(hex1),
	hex2, isHex(hex2),
	hex3, isHex(hex3),
	hex4, isHex(hex4)];
});

TEST("isRgb Test", function() {
    var rgb1 = "#000000";
    var rgb2 = "rgba(0,             0,               0)";
    var rgb3 = "rgb(0, 0, 0, 0)";
    var rgb4 = "rgb(0, 0, 0)";
    var rgb5 = "rgba(0, 0, 0, 0.5)";
    return [
    rgb1, isRgb(rgb1),
    rgb2, isRgb(rgb2),
    rgb3, isRgb(rgb3),
    rgb4, isRgb(rgb4),
    rgb5, isRgb(rgb5),];
});

TEST("darkenColor Test", function() {
    var rgb1 = "#0F0F0F";
    var rgb2 = "#010101";
    var rgb3 = "#0B0B0B";
    var rgb4 = "#000";
    return [
    rgb1, darkenColor(rgb1, 0.3),
    rgb2, darkenColor(rgb2, 0.2),
    rgb3, darkenColor(rgb3),
    rgb4, darkenColor(rgb4),
    ];
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

