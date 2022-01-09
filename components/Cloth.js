/**
 * @class Cloth
 * @classdesc Cloth class
 * @property {Point[]} points Contains points of the cloth, which consists of constraints
 */

class Cloth {
    constructor() {
        /** @type {Point[]} @public*/
        this.points = []

        let startX = canvas.width / 2 - VAR_CLOTH_WIDTH * VAR_SPACING / 2


        for (let y = 0; y <= VAR_CLOTH_HEIGHT; y++) {
            for (let x = 0; x <= VAR_CLOTH_WIDTH; x++) {
                const dx = startX + x * VAR_SPACING;
                const dy = 20 + y * VAR_SPACING;
                let point = new Point(dx, dy)
                // if y == 0, it should be a fixed point (since the cloth has to be fixed at the top part)
                y === 0 && point.pin(point.pos.x, point.pos.y)
                x !== 0 && point.attach(this.points[this.points.length - 1])
                y !== 0 && point.attach(this.points[x + (y - 1) * (VAR_CLOTH_WIDTH + 1)])

                this.points.push(point)
            }
        }
    }

    /**
     * draws each points (for debugging)
     */
    drawPoints() {
        ctx.beginPath();
        this.points.forEach(p => p.draw());
        ctx.stroke();
    }

    update(delta) {
        /** 
         * @type {number} 
         * makes the sim more realistic, reduce accuracy if fps is low
         * */
        let i = VAR_ACCURACY;

        while (i--) 
            this.points.forEach((point) => point.resolve())
        

        /**
         * After resolution of positions and updating the positions, draw each constraints
         */
        ctx.beginPath()
        this.points.forEach((point) => point.update(delta).draw());
        ctx.stroke()
    }
}
