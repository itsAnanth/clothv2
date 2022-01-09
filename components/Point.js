class Point {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.previous = new Vector(x, y);
        this.pins = new Vector(null, null);

        /** @type {Constraint[]} */
        this.constraints = [];
    }


    /**
     * Draws the constraints between each points
     */
    draw() {
        for (let i = 0; i < this.constraints.length; i++)
            this.constraints[i].draw();
    }

    /**
     * Updates position of points and handles external forces
     * @param {number} delta delta time to be used in verlet implementation
     * @returns {Point}
     */
    update(delta) {
        if (this.pins.x && this.pins.y) return this;


        // if user is dragging the cloth
        if (MOUSE.down) {
            let dx = this.pos.x - MOUSE.x
            let dy = this.pos.y - MOUSE.y
            let dist = Math.sqrt(dx * dx + dy * dy)

            if (MOUSE.button === 1 && dist < MOUSE.influence) {
                this.previous.x = this.pos.x - (MOUSE.x - MOUSE.px)
                this.previous.y = this.pos.y - (MOUSE.y - MOUSE.py)
            } else if (dist < MOUSE.cut) {
                this.constraints = []
            }
        }

        // gravity, x vel = 0 y vel = gravity
        this.force(0, VAR_GRAVITY);

        // update the actual position using verlet implementation
        this.verlet(delta);


        // colission with bounds
        if (this.pos.x >= canvas.width) {
            this.previous.x = canvas.width + (canvas.width - this.previous.x) * VAR_BOUNCE;
            this.pos.x = canvas.width
        } else if (this.pos.x <= 0) {
            this.previous.x *= -1 * VAR_BOUNCE;
            this.pos.x = 0
        }

        if (this.pos.y >= canvas.height) {
            this.previous.y = canvas.height + (canvas.height - this.previous.y) * VAR_BOUNCE
            this.pos.y = canvas.height
        } else if (this.pos.y <= 0) {
            this.previous.y *= -1 * VAR_BOUNCE;
            this.pos.y = 0
        }

        return this
    }


    /**
     * 
     * @param {number} delta delta time for verlet integration
     * let n = current position then,
     * x (n + 1) = x(n) + (x(n) - x(n - 1)) * forces + acceleration * delta(time) ^ 2
     */
    verlet(delta) {
        let nextX = this.pos.x + (this.pos.x - this.previous.x) * VAR_FRICTION + this.velocity.x * delta * delta;
        let nextY = this.pos.y + (this.pos.y - this.previous.y) * VAR_FRICTION + this.velocity.y * delta * delta;

        this.previous.x = this.pos.x;
        this.previous.y = this.pos.y;

        this.pos.x = nextX;
        this.pos.y = nextY;

        // reset acceleration
        this.velocity.x = this.velocity.y = 0;
    }


    /**
     * Force changes the velocity ie F = ma, here mass can be taken as unity (1) so F = A, ie force is directly proportional to change in velocity
     * @param {number} x x coordinate force / change in velocity
     * @param {*} y y coordinate force / change in velocity
     */
    force(x, y) {
        this.velocity.x += x;
        this.velocity.y += y;
    }

    /**
     * Pinned points should not move
     * for the rest compute the change in constratints
     * @returns {void}
     */
    resolve() {
        if (this.pins.x && this.pins.y) {
            this.pos.x = this.pins.x;
            this.pos.y = this.pins.y;
            return
        }

        this.constraints.forEach((constraint) => constraint.resolve())
    }


    /**
     * Makes a point fixed and impervious to external force
     * @param {number} x x coordinate for pinned point
     * @param {*} y y coordinate for pinned point
     */
    pin(x, y) {
        this.pins.x = x;
        this.pins.y = y;
    }


    /**
     * Attaches another point with the current point using constraints
     * @param {Point} point point to add
     */
    attach(point) {
        this.constraints.push(new Constraint(this, point));
    }


    /**
     * To be execute to display "cutting of cloth"
     * @param {Constraint} constraint Constraint to remove
     */
    free(constraint) {
        this.constraints.splice(this.constraints.indexOf(constraint), 1);
    }
}