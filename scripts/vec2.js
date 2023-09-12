// import Operators = require(".\src\transform\plugin.js")

// const Vec2Operators = Operators({
//     "+"(a, b) { return b.hasClass('Vec2') ? new Vec2(a.x+b.x, a.y+b.y) : new Vec2(a.x+b, a.y+b); },
//     "-"(a, b) { return b.hasClass('Vec2') ? Vec2(a.x-b.x, a.y-b.y) : Vec2(a.x-b, a.y-b); },
//     "*"(a, b) { return Vec2(a.x-b.x, a.y-b.y); },
//     "=="(a, b) { return a._big.eq(b._big); }
//  });
// exports.module = Vec2;
class Vec2{
    constructor(x = 0, y = 0){
        if (arguments.length == 1) {
            if (x instanceof Array && x.length > 1) { // vec2 from array
                [this.x, this.y] = [x[0], x[1]];
            } else if (x.x !== undefined && x.y !== undefined) {
                [this.x, this.y] = [x.x, x.y];
            } else { // Arguments incorrect, return [0, 0]
                [this.x, this.y] = [0, 0];
        	}
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
        // console.log(this.x,this.y);
    }
    map (f){
        return f.call(null, this.x, this.y);
    }
    same_class(a){
        return a instanceof Vec2
    }
    is_vec2 = is_Vec2 = same_class
    add(v) {
        // 	if (v2.x !== undefined && v2.y !== undefined) {
        if (this.same_class(v)){
            return new Vec2(this.x+v.x, this.y+v.y);
        } else {
            return new Vec2(this.x+v, this.y+v);
        }
    }
    sub(v) {
        if (this.same_class(v)){
            return new Vec2(this.x-v.x, this.y-v.y);
        } else {
            return new Vec2(this.x-v, this.y-v);
        }
    }
    mul(v) {
        if (this.same_class(v)){
            return new Vec2(this.x*v.x, this.y*v.y);
        } else {
            return new Vec2(this.x*v, this.y*v);
        }       
    }
    div(v) {
        if (this.same_class(v)){
            return new Vec2(this.x/v.x, this.y/v.y);
        } else {
            return new Vec2(this.x/v, this.y/v);
        }
    }
    get l () {
        return this.len();
    }
    len() {
        this.l = Math.sqrt(this.x * this.x + this.y *this.y);
        return this.l;
    }
    rad() {
        return Math.atan2(this.y, this.x);
    }
    deg() {
        return Math.atan2(this.y, this.x) * 180 / Math.PI;
    }
    equals(v) {
        return this.x == v.x && this.y == v.y;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
    dot() {
        return this.x * this.x + this.y * this.y;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    norm() {
        var len = this.len()
        if (len != 0){
            return new Vec2(this.x, this.y).div(len);
        } else {
            return new Vec2(0, 0);
        }
    }
    valueOf = function (){
        return [this.x, this.y];
    }
    reflect = function(v) {
        var res = this.add(v.mul(this.dot(v)).mul(-2))
        return res;
    }
    cross = function(v) {
        return this.x * v.y - this.y * v.x;
    }
    rotate = function(a) {
        return new Vec2(this.x * Math.cos(a) - this.y * Math.sin(a), this.x * Math.sin(a) + this.y * Math.cos(a));
    }
    fromString = function(s) {
        var values = s.split(",", 2);
        if (values.length == 2) {
            var x = parseFloat(values[0]),
                y = parseFloat(values[1]);
            return new Vec2(x, y);
        }
        return new Vec2(0, 0);
    }
    toString = function (s) {
        return `${this.x}${(s !== undefined ? s : ", ")}${this.y}`;
    }
};

function log_args(a,b,c,d) {
    console.log(`a: ${a}, b: ${b}, c: ${c}, d: ${d}`);
}
var n = new Vec2(1,3);
var m = new Vec2(2,-1);
console.log(m.add(n), m.sub(5));
n.map(log_args);
console.log(n.reflect(m), m.reflect(n));
