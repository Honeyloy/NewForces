let call_count = 0, fps = 0, interval = 500;
let pause = false;

function fill_background(color = 'lightgrey') {
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, w, h, color);
}
function mass_centre(){
    var [x_centr, y_centr] = [0, 0];
    Object2D.objects.forEach(function(object){
        // console.log(x, y);
        x_centr += object.x;
        y_centr += object.y;
    });
    var l = Object2D.objects.length;
    x_centr /= l;
    y_centr /= l;
    ctx.beginPath();
    var [x, y] = to_screen(x_centr, y_centr);
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
    return [x_centr, y_centr];
}
function draw_grid(){
    var [x_start,y_start] = from_screen(0,0);
    var [x_end,y_end] = from_screen(w, h);
    for(var i = Math.floor(x_start); i < Math.ceil(x_end); i++){
        ctx.beginPath();
        ctx.strokeStyle  = "black"
        var [x_pos, y_pos] = to_screen(i,0)
        ctx.moveTo(x_pos, 0);
        ctx.lineTo(x_pos, h); 
        ctx.stroke();
        ctx.closePath();
    }
    for(var i = Math.floor(y_end); i < Math.ceil(y_start); i++){
        ctx.beginPath();
        ctx.strokeStyle  = "black"
        var [x_pos, y_pos] = to_screen(0,i)
        ctx.moveTo(0, y_pos);
        ctx.lineTo(w, y_pos);
        ctx.stroke();
        ctx.closePath();
    }
}
function following(){
    var [x_cen, y_cen] = mass_centre();
    // console.log([x_cen, y_cen]);
    var [x_scr, y_scr] = to_screen(x_cen, y_cen);
    var [x_fol, y_fol] = [(x_scr-x_disp), (y_scr-y_disp)];
    var [x0, y0] = to_screen(0, 0);
    ctx.beginPath();
    ctx.strokeStyle  = "magenta"
    ctx.moveTo(x_scr, y_scr);
    ctx.lineTo(x0, y0); 
    ctx.stroke();
    ctx.closePath();
    // console.log([x_fol, y_fol]);
    x_disp = x_centr - x_fol;
    y_disp = y_centr - y_fol;
    // console.log([x_disp, y_disp]);
    // to_screen(mass_centre())
}
// function abs_mouse_pose(){
//     const cnv_pos = cnv.getBoundingClientRect();
//     return [cnv_pos.left, cnv_pos.top]
// }


// ctx.fillText("Zibri", (canvas.width / 2), (canvas.height / 2));
function draw() {
    info.textContent = ""
    requestAnimationFrame(draw);
    if (document.visibilityState == "visible" && !pause){
        call_count++;
        
        fill_background();
        draw_grid();
        // following();
        info.textContent += `acc_on: ${acc_on.checked}\n`

        Object2D.calculate(calc_acc=acc_on.checked, calc_col=col_on.checked);

        Eye.draw_all();
        
        info.textContent += ` fps: ${fps}, \ntop left: ${Math.floor(x_disp)}, ${Math.floor(y_disp)}, \nzoom ${zoom}\n`;
        
    }
}

function update_force_text(){
    text = acc_text.value.toLowerCase().split("\n");
    for(var index = 0; index < text.length; index++){
        text[index].trim();
        var exp = {};
        var rav =text.search('=')
        var left_var = text.slice(0,rav)
        text = text.slice(rav+1,-1)
        for(var i = 0; i < text.length; i++){
            
        }
    }
    // match()
    // replace()
    // search()
    // split()
    info.textContent += text;
}

function eyes_wall(){
    // for(var i = -1; i < 1; i+=2){
    //     for(var j = -1; j < 1; j++){
    for(var i = -5; i < 6; i+=2){
        for(var j = -5; j < 6; j+=1){
            var eye = new Eye(i+Math.abs(j%2), j, 2, 1,undefined, getRndColor());//,undefined,undefined,undefined, rfloat(0, Math.PI));
            eye.set_eye_frame(2,1);
            console.log(i, j);
        }
    }
}
function balls(){
    let objects =  []
    for(var i = 0; i < 2; i++){
        objects.push( new Object2D(rand(-5,5), rand(-5,5), rand(-5,5), rand(-5,5), getRndColor()) );
    }
}

// RUNING
function RUN(){
    eyes_wall();
    balls()
    window.requestAnimationFrame(draw);
};
RUN();

setInterval(() => {
    fps = call_count / interval * 1000
    call_count = 0;
    // setTimeout(() => {
    //     fps = fps.toString() + '*'
    // }, interval-100);
}, interval);

" *** EVENTS *** "

window.addEventListener("mousedown", function(e) {
    this.onmousemove = function(e) {
        x_disp += e.movementX;
        y_disp += e.movementY;
        console.log(e);
    }
    this.addEventListener("mouseup", function(e) {this.onmousemove = function(e){}});
});
window.addEventListener("resize", () => {
    Object2D.zoom = zoom;
    Eye.zoom = zoom;
    w = cnv.width = screen_box.width;
    h = cnv.height = screen_box.height;
    draw();
});
cnv.addEventListener("mousewheel", function(e) {
    var dif = (e.wheelDelta>0) ? 1.1 : 1/1.1 
    zoom *= dif;
    Object2D.zoom = zoom;
    Eye.zoom = zoom;
    // var [x, y] = [e.offsetX-x_disp, e.offsetY-y_disp];
    // [x_disp, y_disp] = [x_disp+x*(1-dif), y_disp+y*(1-dif)];
    // [x_disp, y_disp] = [x_disp+(e.offsetX-x_disp)*(1-dif), y_disp+(e.offsetY-y_disp)*(1-dif)];
    [x_disp, y_disp] = [e.offsetX*(1-dif)+x_disp*dif, e.offsetY*(1-dif)+y_disp*dif];
});
window.addEventListener("keydown", function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        Object2D.zoom *= (e.key === 'ArrowLeft')? 1.1 : 1/1.1;
        console.log(e, e.key);
    }
});
window.addEventListener("keypress", function(e) {
    " STOP ANIMATION"
    // console.log('pressed', e);
    if (e.key == " " || e.key === "Spacebar" || e.code === "Space") {
        console.log(pause);
        pause = !pause;
    }
});