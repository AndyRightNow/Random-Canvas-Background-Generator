function CHECK_UNDEFINED(obj) {
    if (typeof obj === "undefined") return true;
    else return false;
}

function TEST(testName, func) {
    console.log("--------------------------------------------------------");
    console.log(testName + ": ");
    var result = func();
    for (var i = 0; i < result.length; i++)
        console.log(result[i]);
    console.log("--------------------------------------------------------");
    console.log("\n");
}

TEST("Constructor Test", function() {
    var background1 = new RandomBackgroundGenerator("canvas", "Polygonal");
    var background2 = new RandomBackgroundGenerator("canvas");
    var background3 = new RandomBackgroundGenerator();

    return [
		background1,
		background2,
		background3
	];
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

