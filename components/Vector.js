class Vector {
    /**
     * @param {boolean|number} x 
     * @param {boolean|number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Calculates distance between two points (x1, y1) and (x2, y2)
     * @param {number} v1 
     * @param {number} v2 
     * @returns {number} Distance
     */
    static distance(v1, v2) {
        const dx = v1.x - v2.x;
        const dy = v1.y - v2.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
}