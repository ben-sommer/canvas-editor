import { ShapeSprite } from "./ShapeSprite.js";

export class EllipseShapeSprite extends ShapeSprite {
    constructor({ color, x, y, width, height }) {
        super({ color, x, y, width, height });
    }

    draw() {
        this.rx = this.width / 2;
        this.ry = this.height / 2;

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

    checkIntersection(x, y) {
        this.rx = this.width / 2;
        this.ry = this.height / 2;

        const LHS =
            this.ry ** 2 * (x - (this.x + this.rx)) ** 2 +
            this.rx ** 2 * (y - (this.y + this.ry)) ** 2;

        const RHS = this.rx ** 2 * this.ry ** 2;

        return LHS <= RHS;
    }
}
