function rotate(x,y, angle){
    return [x*Math.cos(angle)-y*Math.sin(angle), x*Math.sin(angle)+y*Math.cos(angle)];
}
const EyeMode = Enum(["nervous", "calm", "looking", "shy"]);

// orange-purple, salat-purple
class Eye{
    static index = 0;
    static objects = [];
    static zoom = zoom;
    constructor(x, y, width, height, pupil_rad, pupil_color="black", white_body_color="white", pupil_angle=0, high=0, rotation=0) {
        this.x = x || 0;
        this.y = y || 0;
        // [this.x, this.y] = to_screen(x, y);
        this.high = btw(high || 0, 0, 1);
        this.id = Eye.index++;
        this.pupil_color = pupil_color || "black";
        this.white_body_color = white_body_color || "white";
        this.set_eye_frame(width || 2, height || 1);
        // this.circle_rad = height/2 || 0.5;
        this.pupil_rad = pupil_rad || 0.2;
        this.pupil_angle = pupil_angle || 0;

        // this.x_angle = this.y_circle/Math.tan(this.angle);
        this.set_pupil(this.angle, this.high);
        this.blinking = false;
        this.blink_ms = 300;
        this.blink_frames = 10;
        // STYLES
        this.draw_style = "curve" // "line"
        // this.draw_style = "line"
        this.mode = EyeMode.nervous // .calm or .nervous
        this.mode = EyeMode.calm // .calm or .nervous
        // this.rotation = btw(rotation, 0, Math.pi*2);
        this.rotation = rotation || 0;
        console.log(rotation)

        Eye.objects.push(this);
        // console.log(this);
    }
    set_pupil_on_pos(mx, my) {
        var [x, y] = to_screen(this.x, this.y);
        var [dx, dy] = [mx-x, my-y];
        var angle = Math.atan2(dy, dx);
        // var d = 100/dist(dx, dy)//this.circle_rad;
        // console.log(d);
        var d = dist(dx, dy)/100;
        // angle += randomIntFromInterval(-Math.PI/12, Math.PI/12);
        // d += randomIntFromInterval(-0.1,0.1);
        var high = btw(d, 0, 1)
        // this.set_pupil(angle, high);
        this.set_pupil(angle, high);
    }
    set_pupil(angle, high){
        [angle, high] = [angle%(Math.PI*2), btw(high, 0., .9)]
        this.pupil_angle = angle;
        this.high = high;
        // var [pi, half_pi] = [Math.PI, Math.PI/2];
        // var df = ((angle)-(this.rotation+half_pi))/(half_pi)-1;
        // var [mx,mi] = [this.x_angle_len-this.pupil_rad, this.circle_rad-this.pupil_rad/2];
        // var [x1, y1] = rotate(this.x_angle_len/2,0, -this.rotation), [x2, y2] = rotate(0, this.circle_rad/2, -this.rotation);
        // this.x_pupil = Math.cos(this.pupil_angle)*this.high*((x1+x2)*df)*Eye.zoom;
        // this.y_pupil = -Math.sin(this.pupil_angle)*this.high*((y1+y2)*df)*Eye.zoom;

        // this.x_pupil = Math.cos(this.pupil_angle)*this.high*(this.x_angle_len-this.pupil_rad)*Eye.zoom;
        // this.y_pupil = -Math.sin(this.pupil_angle)*this.high*(this.circle_rad-this.pupil_rad/2)*Eye.zoom;
        this.x_pupil = Math.cos(angle)*high*(this.x_angle_len)*Eye.zoom;
        this.y_pupil = -Math.sin(angle)*high*(this.circle_rad)*Eye.zoom;
    }
    set_chaotic_pupil(){
        // this.x_chaotic_pupil
        // this.y_chaotic_pupil
        this.counter = this.counter || 0;
        this.counter = (this.counter+1)%10;
        if (this.counter==0){
            return [this.x_pupil+rand(-10,10), this.y_pupil+rand(-10,10)]
        } else {
            return [this.x_pupil, this.y_pupil]
        }
    }
    set_eye_frame (x,y) {
        this.x_angle_len = x/2;
        this.circle_rad = y/2;
        this.angle = Math.asin(y/x);
        this.x_circle = Math.sin(this.angle) * this.circle_rad;
        this.y_circle = Math.cos(this.angle) * this.circle_rad;
    }
    draw () {
        // this.angle+=0.01;
        var [x, y] = to_screen(this.x, this.y);
        // var [xc, yc] = to_screen(this.x_circle, this.y_circle);
        ctx.save();
        switch (this.draw_style){
            case "curve":
                var [dx, dy] = [this.x_angle_len*Eye.zoom, this.circle_rad*Eye.zoom*2.2];
                ctx.beginPath();
                ctx.fillStyle = "white";
                if (this.rotation==0){
                    ctx.bezierCurveTo(x-dx, y, x, y+dy, x+dx, y);
                    ctx.bezierCurveTo(x+dx, y, x, y-dy, x-dx, y);
                    
                } else {
                    var [x1, y1] = rotate(-dx,0, this.rotation), [x2, y2] = rotate(0,dy, this.rotation),  [x3, y3]  = rotate(dx,0, this.rotation);
                    ctx.bezierCurveTo(x+x1, y+y1, x+x2, y+y2, x+x3, y+y3);
                    // console.log(rotate(-dx,0, this.rotation) + rotate(0,dy, this.rotation) + rotate(dx,0, this.rotation))
                    // console.log(x1, y1, x2, y2, x3, y3);
                    var [x1, y1] = rotate(dx,0, this.rotation), [x2, y2] = rotate(0,-dy, this.rotation),  [x3, y3]  = rotate(-dx,0, this.rotation);
                    ctx.bezierCurveTo(x+x1, y+y1, x+x2, y+y2, x+x3, y+y3);
                }
                ctx.fill();
                ctx.fillStyle = "red";
                break;
            case "line":
            default:
                var [dx, dy] = [this.x_angle_len*Eye.zoom, this.y_circle*Eye.zoom];
                var [xc, yc] = [this.x_circle*Eye.zoom, this.y_circle*Eye.zoom];
                ctx.beginPath();
                ctx.fillStyle = "white";
                ctx.moveTo(x-dx, y);
                ctx.lineTo(x-xc, y-yc);
                ctx.lineTo(x+xc, y-yc);
                ctx.lineTo(x+dx, y);
                ctx.lineTo(x+xc, y+yc);
                ctx.lineTo(x-xc, y+yc);
                ctx.fill();
                ctx.moveTo(x+xc, y);
                ctx.arc(x, y, this.circle_rad*Eye.zoom, 0, 2 * Math.PI);
                break;
        }
        ctx.fillStyle = this.white_body_color;
        ctx.fill();
        ctx.closePath();
        ctx.clip();
        
        // var [px,py] = this.set_chaotic_pupil();
        var [px,py] = [this.x_pupil, this.y_pupil];
        
        // if (this.mode == "nervous"){
        if (this.mode === EyeMode.nervous){
            // this.x_pupil += (Math.random()-0.5)*2*10;
            // this.y_pupil += (Math.random()-0.5)*2*10;
            px += (Math.random()-0.5)*2*this.pupil_rad*Eye.zoom/2;
            py += (Math.random()-0.5)*2*this.pupil_rad*Eye.zoom/2;
        }
        ctx.beginPath();
        ctx.fillStyle = this.pupil_color;
        // ctx.fillStyle = getRndColor();
        // ctx.arc(pupil_x, pupil_y, rad2, 0, 2*Math.PI);
        ctx.arc(x+px, y-py, this.pupil_rad*Eye.zoom, 0, 2*Math.PI); // +rand(-5,5)

        // ctx.arc(x+this.x_pupil+rand(-10,10), y-this.y_pupil+rand(-10,10), this.pupil_rad, 0, 2*Math.PI); // +rand(-5,5)
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    async blink(){
        // if (!this.blinking){ this.blinking = true } else { return }
        if (this.blinking) { return } else { this.blinking = true }

        // var old_this = {...this}
        var old_angle = this.angle;
        var old_circle = this.circle_rad;
        // var old_values = [this.angle,this.circle_rad];
        
        console.log('blink',this.x,this.y);
        // const this_clone = structuredClone(this)
        for(var i=-this.blink_frames; i <= this.blink_frames; i++){
            var scale = Math.abs(i/this.blink_frames);
            this.angle = old_angle*scale;
            this.circle_rad = old_circle*scale;

            // this.angle = angle; // [0, Math.PI]
            this.x_circle = Math.sin(this.angle) * this.circle_rad;
            this.y_circle = Math.cos(this.angle) * this.circle_rad;
    
            // this.x_angle_len = this.y_circle/Math.sin(this.angle);
            // this.x_angle = this.y_circle/Math.tan(this.angle);
            // this.set_pupil(this.pupil_angle, this.high);
            // draw();
            await sleep(this.blink_ms/this.blink_frames);
        }
        
        // this = {...old_this}

        // [this.angle, this.circle_rad] = old_values;
        // this = structuredClone(this_clone);
        this.angle = old_angle;
        this.circle_rad = old_circle;

        // this.angle = angle; // [0, Math.PI]
        this.x_circle = Math.sin(this.angle) * this.circle_rad;
        this.y_circle = Math.cos(this.angle) * this.circle_rad;
        this.set_pupil(this.pupil_angle, this.high);
        this.blinking = false;
    }
    static draw_all () {
        Eye.objects.forEach(function(object){
            object.draw();
            if (Math.random()<0.0007) {
                object.blink();
            }
        });
    }
}
// cnv.addEventListener("mousemove", function(e) {
window.addEventListener("mousemove", function(e) {
    // console.log();
    var [x, y] = [e.clientX-cnv_pos.left, e.clientY-cnv_pos.top]
    Eye.objects.forEach(function(object){
        object.set_pupil_on_pos(x, y);
        // object.set_pupil_on_pos(e.offsetX, e.offsetY);
    });
});