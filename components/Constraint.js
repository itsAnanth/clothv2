class Constraint {
    constructor(p1, p2) {
        this.p1 = p1
        this.p2 = p2
        this.length = VAR_SPACING;
    }

    resolve() {
        let dx = this.p1.pos.x - this.p2.pos.x
        let dy = this.p1.pos.y - this.p2.pos.y
        /**
         * @type {number}
         * Distance between two points defines the length of the constraint 
         */
        let dist = Vector.distance(this.p1.pos, this.p2.pos);


        // distance of constraint is less than the space between points, no need for calculations
        if (dist < this.length) return

        let diff = (this.length - dist) / dist


        // current node is streteched beyond tear distance from the first node, so remove the current node by cutting the constraint
        if (dist > VAR_TEARDISTANCE) this.p1.free(this)

        let mul = diff * 0.5 * (1 - this.length / dist)

        let px = dx * mul
        let py = dy * mul

        !this.p1.pins.x && (this.p1.pos.x += px)
        !this.p1.pins.y && (this.p1.pos.y += py)
        !this.p2.pins.x && (this.p2.pos.x -= px)
        !this.p2.pins.y && (this.p2.pos.y -= py)

        return this
    }

    /**
     * Draws lines aka constraints 
     */
    draw() {
        ctx.moveTo(this.p1.pos.x, this.p1.pos.y)
        ctx.lineTo(this.p2.pos.x, this.p2.pos.y)
    }
}