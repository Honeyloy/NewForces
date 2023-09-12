var cnv = document.querySelector("#convas");
var ctx = cnv.getContext("2d");
var header = document.querySelector("#header");
var screen_box = document.querySelector(".screen");
let info = document.querySelector(".info_box");

// var panel = document.querySelector("#panel");
// let w = cnv.width = window.innerWidth/2;
// let h = cnv.height = window.innerHeight/2;
let w = cnv.width = screen_box.clientWidth;
let h = cnv.height = screen_box.clientHeight;
const cnv_pos = cnv.getBoundingClientRect();
// console.log(screen_box.clientWidth, screen_box.clientHeight);
let acc_on = document.querySelector("#acceleration_check")
let col_on = document.querySelector("#collision_check")
let acc_text = document.querySelector("#acceleration_force")
let col_text = document.querySelector("#collision_force")
let [x_centr, y_centr] = [w/2, h/2]
let zoom = 50;
let [x_disp, y_disp] = [w/2, h/2];
// console.log(x_disp, y_disp)

function to_screen (x, y) {
    if (x instanceof Array && x.length > 1){
        return [x[0]*zoom+x_disp, -x[1]*zoom+y_disp];
    } else {
        return [x*zoom+x_disp, -y*zoom+y_disp];
    }
}
function from_screen (x, y){
    return [(x-x_disp)/zoom,-(y-y_disp)/zoom];
}

ctx.font = "bold 16px Arial";
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
// HOW TO DRAW TEXT
// ctx.font = "30px Arial";
// ctx.fillText("Hello World", 10, 50);
// Create gradient
// var grd = ctx.createLinearGradient(0, 0, 200, 0);
// grd.addColorStop(0, "red");
// grd.addColorStop(1, "white");

        // ctx.font = "21px serif bold";
        // ctx.fillStyle = "black"
        // for(var i = 0; i < 2; i++){
        //     ctx.fillText(`top left ${Math.floor(x_disp)}, ${Math.floor(y_disp)}`, 150, 20);
        //     ctx.fillText(`fps: ${fps}`, 150, 40);
        //     ctx.stroke()
        //     ctx.font = "20px  ";
        //     ctx.fillStyle = "white"

        // update_force_text()

// // Fill with gradient
// ctx.fillStyle = grd;
// ctx.fillRect(10, 10, 150, 80);

function dist(x, y) { return Math.sqrt(x * x + y * y); }

function rand(mi, mx){ return Math.floor(Math.random()*(mx-mi+1)+mi); }
function rfloat(mi, mx){ return Math.random()*(mx-mi+1)+mi; }
function getRndColor() {
    var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
function Enum(values) {
    const enumObject = {};
    for (const val of values) {
        enumObject[val] = val;
    }
    // return Object.freeze(enumObject);
    return enumObject;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function btw(x,mi,mx){
    return Math.max(Math.min(x,mx), mi)
}

document.querySelector("textarea.function_field.acceleration").value = "\
x_dist = this.x - obj.x;\n\
y_dist = this.y - obj.y;\n\
scale = this.mass*obj.mass/dist_l/10;\n\
x_force = x_dist*scale;\n\
y_force = y_dist*scale;"