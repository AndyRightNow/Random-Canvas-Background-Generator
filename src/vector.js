/*
 *              Vector Class
 *
 *      Vector and vector operations.
 */

/*
 *  Constructor
 */
function Vector(x, y){
	this.x = x || 0;
	this.y = y || 0;
}

Vector.prototype.equal = function(vec) {
	return this.x === vec.x && this.y === vec.y;
};

Vector.prototype.dot = function(v){
	return this.x * v.x + this.y * v.y;
};

Vector.prototype.len2 = function(){
	return this.dot(this);
};

Vector.prototype.len = function(){
	return Math.sqrt(this.len2());
};

Vector.prototype.scale = function(sx, sy){
	this.x *= sx;
	this.y *= sy || sx;
	return this;
};

Vector.prototype.sub = function(v){
	this.x -= v.x;
	this.y -= v.y;
	return this;
};

//-------------------------------
//	No side effect and chaining
//-------------------------------
Vector.prototype.project = function(axis){
	var cof =  this.dot(axis) / axis.len2();
	return axis.scale(cof);
};

Vector.prototype.projectN = function(axis){
	var cof =  this.dot(axis);
	return axis.scale(cof);
};

module.exports = Vector;
