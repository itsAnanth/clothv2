/**
 * Original logic is from @dissimulate, all credits goes to them 
 */

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


/**
 * Public mouse object to store button states, previous and current corrdinates.
 * To be used later in {Point.update(delta)}
 */
let MOUSE = {
    cut: 8,
    influence: 26,
    down: false,
    button: 1,
    x: 0,
    y: 0,
    px: 0,
    py: 0
}

/** cloth thread color */
ctx.strokeStyle = '#ccc'

/** @type {Cloth} */
const cloth = new Cloth();
update();


/**
 * Main animation loop
 */
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cloth.update(0.016)

    requestAnimationFrame(update)
}


function setMouse(e) {
    let rect = canvas.getBoundingClientRect()
    MOUSE.px = MOUSE.x
    MOUSE.py = MOUSE.y
    MOUSE.x = e.clientX - rect.left
    MOUSE.y = e.clientY - rect.top
}

canvas.onmousedown = (e) => {
    MOUSE.button = e.which
    MOUSE.down = true
    setMouse(e)
}

canvas.onmousemove = setMouse

window.onmouseup = () => (MOUSE.down = false)

canvas.oncontextmenu = (e) => e.preventDefault()