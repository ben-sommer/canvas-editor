import { ShapeSprite } from "./ShapeSprite.js";

export class EllipseShapeSprite extends ShapeSprite {
    constructor({ color, x, y, width, height }) {
        super({ color, x, y, width, height });
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            this.height / 2,
            0,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
    }
}
