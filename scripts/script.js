
function rand_int(min=0, max = 1){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const p = document.createElement("div");
p.setAttribute('class', 'container')
p.setAttribute('border', '10px blue')
// p.setAttribute('font-size', '24px')
// p.innerText =  c+res_chrs_list[i].repeat(10)+cend;

const main = document.createElement("div")
main.setAttribute('class', 'background')
main.setAttribute('width', '100%')
main.setAttribute('height', '100%')
main.setAttribute('vertical-align', 'middle')
main.setAttribute('padding', 'auto')
// main.setAttribute('position', 'absolute')
// main.setAttribute('left', '50%')
// main.setAttribute('bottom', '50%')

// document.addEventListener("click", start_position);

function cursor_coords(event){
    var text = `pageX: ${event.pageX}, pageY: ${event.pageY}
    clientX: ${event.clientX}, clientY:${event.clientY}
    offsetX: ${event.offsetX}, offsetY:${event.offsetY}
    screenX: ${event.screenX}, screenY:${event.screenY}
    layerX: ${event.layerX}, layerY: ${event.layerY}
    X: ${event.x}, Y: ${event.y}
    movementX: ${event.movementX}, movementY: ${event.movementY}`;
    p.innerText = text;
}
function click_context(event){
    console.log(event);
}
document.addEventListener("mousemove", cursor_coords)
document.addEventListener("click", click_context);
main.append(p);


const body = document.querySelector('body');
body.append(main);