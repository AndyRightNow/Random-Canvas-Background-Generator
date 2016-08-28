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

Vector.prototype.copy = function(v){
	this.x = v.x;
	this.y = v.y;
	return this;
};

Vector.prototype.clone = function(){
	return new Vector(this.x, this.y);
};

Vector.prototype.perp = function(){
	var x = this.x;
	this.x = this.y;
	this.y = -x;
	return this;
};

Vector.prototype.reverse = function(){
	this.x = -this.x;
	this.y = -this.y;
	return this;
};

Vector.prototype.translate = function(x, y){
	this.x += x;
	this.y += y;
	return this;
};

Vector.prototype.rotate = function(angle){
	var radian = angle * (Math.PI / 180);
	var x = this.x;	//	Prevent pre-calculation
	this.x = this.x * Math.cos(radian) + this.y * Math.sin(radian);
	this.y = - x * Math.sin(radian) + this.y * Math.cos(radian);
	return this;
};

Vector.prototype.scale = function(sx, sy){
	this.x *= sx;
	this.y *= sy || sx;
	return this;
};

Vector.prototype.normalize = function(){
	var d = this.len();
	if (d > 0){
		this.x /= d;
		this.y /= d;
	}
	return this;
};

Vector.prototype.add = function(v){
	this.x += v.x;
	this.y += v.y;
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
