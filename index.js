/**
 * Original logic is from @dissimulate, all credits goes to them 
 */

/** @type {HTMLInputElement} */
const gravityInput = document.getElementById('gravity');
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

VAR_CLOTH_HEIGHT = ~~(canvas.height / 2 / VAR_SPACING);
VAR_CLOTH_WIDTH = ~~(canvas.width / 2 / VAR_SPACING);


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

class AnimationFrame {
    constructor(fps = 60, callback = () => {}) {
        this.requestId = 0;
        this.fps = fps;
        this.callback = callback;
    }

    start() {
        let then = performance.now();
        const interval = 1000 / this.fps;
        const tolerance = 0.1;

        const animateLoop = (now) => {
            this.requestId = requestAnimationFrame(animateLoop);
            const delta = now - then;

            if (delta >= interval - tolerance) {
                then = now - (delta % interval);
                this.callback(delta);
            }
        };
        this.requestId = requestAnimationFrame(animateLoop);
    }

    stop() {
        cancelAnimationFrame(this.requestId);
    }
}

/** cloth thread color */
ctx.strokeStyle = '#ccc'

/** @type {Cloth} */
let cloth = new Cloth();

/**
 * Main animation loop
 */
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cloth.update(0.016)
}

const animation = new AnimationFrame(60, update);
animation.start();


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

canvas.oncontextmenu = (e) => e.preventDefault();

gravityInput.addEventListener('click', () => {
    if (VAR_GRAVITY == 400) {
        gravityInput.innerHTML = 'Gravity';
        VAR_GRAVITY = 1;
        VAR_FRICTION = 1;
    } else {
        gravityInput.innerHTML = 'Zero Gravity';
        VAR_GRAVITY = 400;
        VAR_FRICTION = 0.99;
    }
});

document.getElementById('reset').addEventListener('click', () => cloth = new Cloth())

// Add touch events

function setTouch(e) {
    let rect = canvas.getBoundingClientRect()
    MOUSE.px = MOUSE.x
    MOUSE.py = MOUSE.y
    MOUSE.x = e.touches[0].clientX - rect.left
    MOUSE.y = e.touches[0].clientY - rect.top
}

canvas.addEventListener('touchstart', function (e) {
    MOUSE.down = true
    let rect = canvas.getBoundingClientRect()
    MOUSE.x = e.touches[0].clientX - rect.left
    MOUSE.y = e.touches[0].clientY - rect.top
    setTouch(e)
}, false);

canvas.addEventListener('touchmove', function (e) {
    setTouch(e)
}, false);

window.addEventListener('touchend', function (e) {
    MOUSE.down = false
}, false);

// Prevent scrolling when touching the canvas

document.body.addEventListener('touchstart', function (e) {
    if (e.target === canvas) {
        e.preventDefault();
    }
}, false);

document.body.addEventListener('touchend', function (e) {
    if (e.target === canvas) {
        e.preventDefault();
    }
}, false);

document.body.addEventListener('touchmove', function (e) {
    if (e.target === canvas) {
        e.preventDefault();
    }
}, false);
