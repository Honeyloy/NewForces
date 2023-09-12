
class Object2D {
    static index = 0;
    static objects = [];
    static speed = 200;
    static trace_len = 100;
    static zoom = zoom
    constructor(x, y, x_vel, y_vel, color, mass, movement) {
        this.id = Object2D.index++;
        this.x = x || 0;
        this.y = y || 0;
        this.x_vel = x_vel || 0;
        this.y_vel = y_vel || 0;
        this.x_acc = 0;
        this.y_acc = 0;
        this.mass = mass || 1;
        this.radius = this.mass/2;
        this.color = color || "black";
        this.movement = movement || true;
        this.trace = [];
        this.force = this.force1;
        // this.force = this.noforce
        // this.force = this.textForce
        Object2D.objects.push(this);
        // console.log(this.x,this.y,this.x_vel,this.y_vel,this.x_acc,this.y_acc,this.mass);
    }
    calc(calc_acc = true, calc_col = true){
        this.x_acc = 0, this.y_acc = 0;
        var index;
        if (calc_acc){
            for (index in Object2D.objects){
                if(this.id!= Object2D.objects[index].id){
                    var [x, y] = Object2D.objects[index].force(this);
                    this.x_acc += x;
                    this.y_acc += y;
                }
            }
        }
        if (calc_col){
            for (index in Object2D.objects){
                if(this.id!= Object2D.objects[index].id){
                    this.collision(Object2D.objects[index])
                }
            }
        }
        // console.log([this.x,this.y],[this.x_vel,this.y_vel],[this.x_acc,this.y_acc],this.movement);
        this.x_vel += this.x_acc;
        this.y_vel += this.y_acc;
        if (this.movement){
            this.x += this.x_vel*(1/Object2D.speed);
            this.y += this.y_vel*(1/Object2D.speed);
        }
        this.trace.push([this.x,this.y]);
        this.trace = this.trace.slice(-Object2D.trace_len);
        
    }
    static calculate(calc_acc=true, calc_col=true) {
        Object2D.objects.forEach(function (object) {
            // object.calc(calc_acc=acc_on.checked, calc_col=col_on.checked);
            object.calc(calc_acc=true, calc_col=true);
            object.draw();
        });
    }
    noforce (obj) {
        return [0, 0];
    }
    force1 (obj) {
        // console.log(this.id,"x_dist, y_dist",x_dist, y_dist);
        var [x_dist, y_dist] = [this.x - obj.x, this.y - obj.y];
        var dist_l = Math.sqrt(x_dist*x_dist + y_dist*y_dist);
        var scale = this.mass*obj.mass/dist_l/10;
        return  [x_dist*scale, y_dist*scale];
    }
    textForce (obj) {
        // var obj1 = this;
        // var obj1.pos =
        // var [x_dist, y_dist] = [this.x - obj.x, this.y - obj.y];
        var x_dist, y_dist, dist_l, scale, x_force, y_force;
        var terms = {"x_dist":x_dist,"y_dist": y_dist,"dist_l": dist_l,"scale": scale,"x_force": x_force,"y_force": y_force}
        var texts = acc_text.value.trim().split('\n');
        for (var i = 0; i < texts.length; i++) {
            var equ = texts[i].search('=')
            var text = texts[i].slice(equ+1, -1);
            terms[texts[i].slice(0, equ)] = eval(text);
            // console.log(terms);
            // console.log(texts[i].slice(0, equ), eval(text));

            // if (texts[i].search('x_force = ')== 0){
            //     x_force = eval(texts[i]);
            //     console.log(x_force);
            // } else if (texts[i].search('y_force = ')== 0){
            //     var text = texts[i].slice('y_force = '.length,-1);
            //     y_force = eval(text);
            //     console.log(text,eval(text));
            //     console.log(y_force);
            // } else {
            //     eval(texts[i]);
            // }
        }
        // console.log(x_dist, y_dist);
        // console.log(force);
        return [x_force, y_force];

    }
    collision(obj) {
        var min_dist = this.radius + obj.radius;
        var [x_dist, y_dist] = [obj.x-this.x, obj.y-this.y];
        var dist_l = Math.sqrt(x_dist*x_dist + y_dist*y_dist);
        // console.log(dist_l, min_dist);
        if (dist_l < min_dist){
            // console.log(`collision ${this.id} ${obj.id}`);
            // console.log(this.id, this.x, this.y);
            // console.log(obj.id, obj.x, obj.y);
            // console.log(x_dist, y_dist, dist_l);
            var mass_dif = Math.abs(this.mass-obj.mass);
            var mass_sum = this.mass+obj.mass;
            var this_x_vel = (mass_dif/mass_sum*this.x_vel + 2*obj.mass/mass_sum*obj.x_vel)*0.99;
            var this_y_vel = (mass_dif/mass_sum*this.y_vel + 2*obj.mass/mass_sum*obj.y_vel)*0.99;
            var obj_x_vel = (2*this.mass/mass_sum*this.x_vel + mass_dif/mass_sum*obj.x_vel)*0.99;
            var obj_y_vel = (2*this.mass/mass_sum*this.y_vel + mass_dif/mass_sum*obj.y_vel)*0.99;
            // becouse of we use old parameters for calculating new values, so we need to calculate the new values before updating
            this.x_vel = this_x_vel;
            this.y_vel = this_y_vel;
            obj.x_vel = obj_x_vel;
            obj.y_vel = obj_y_vel;
            // self_vel = mass_dif/mass_sum*self.vel + 2*other.m/mass_sum*other.vel
            // other_vel = 2*self.m/mass_sum*self.vel - mass_dif/mass_sum*other.vel
            var collision_depth = 1-(dist_l/min_dist);
            [x_dist, y_dist] = [x_dist*collision_depth, y_dist*collision_depth]; //[obj.x-this.x, obj.y-this.y];
            // console.log(x_dist,y_dist,collision_depth)
            this.x = this.x-x_dist;
            this.y = this.y-y_dist;
            obj.x = obj.x+x_dist
            obj.y = obj.y+y_dist;
        }
    }
    draw () {
        var [x, y] = to_screen(this.x, this.y);
        // console.log(this.x, this.y, '->',x, y, this.radius);
        
        // console.log(x,y, x_v,y_v, x_a,y_a);
        ctx.beginPath();
        ctx.arc(x, y, this.radius*Object2D.zoom, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        // ctx.lineWidth = this.radius
        // ctx.strokeStyle = "black";
	    ctx.stroke();
        // this.draw_eye();

        var [x_v, y_v] = to_screen(this.x+this.x_vel/10, this.y+this.y_vel/10);
        // console.log(this.x+this.x_vel, this.y+this.y_vel,"->", x_v, y_v)
        ctx.beginPath();
        ctx.strokeStyle  = "blue"
        ctx.moveTo(x, y);
        ctx.lineTo(x_v, y_v);
        ctx.closePath();
	    ctx.stroke();
        
        var [x_a, y_a] = to_screen(this.x+this.x_acc, this.y+this.y_acc);
        ctx.beginPath();
        ctx.strokeStyle  = "red"
        ctx.moveTo(x, y);
        ctx.lineTo(x_a, y_a);
	    ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle  = "magenta"
        var [x_trace, y_trace] = to_screen(this.trace[0])
        // console.log(this.trace[0])
        // console.log(x_trace, y_trace)
        ctx.moveTo(x_trace, y_trace);
        [x_trace, y_trace] = to_screen(this.trace[-1])
        // console.log(this.trace.length-1)
        for(var index in this.trace){
            [x_trace, y_trace] = to_screen(this.trace[index])
            ctx.lineTo(x_trace, y_trace);
        }
	    ctx.stroke();

        ctx.closePath();

        // console.log(this.x+this.x_vel, this.y+this.y_vel, '->',x_v, y_v);
        // console.log(x_v, y_v, x_a, y_a);
    }
    draw_eye(){
        if (this.eye==undefined){
            this.eye = new Eyes(this.x, this.y,undefined,undefined,this.color);
            console.log(this.eye);
        }
        this.eye.x = this.x;
        this.eye.y = this.y;
        var real_pos = to_screen(this.x+this.x_vel/2, this.y+this.y_vel/2);
        // var real_pos = to_screen(this.x+this.x_acc, this.y+this.y_acc);
        this.eye.set_pupil_on_pos(real_pos[0],real_pos[1]);
        // eye.draw();
    }
}