import { ShapeSprite } from "./ShapeSprite.js";

export class RectShapeSprite extends ShapeSprite {
    constructor({ color, x, y, width, height }) {
        super({ color, x, y, width, height });
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkIntersection(x, y) {
        if (x < this.x || x > this.x + this.width) return false;
        if (y < this.y || y > this.y + this.height) return false;

        return true;
    }
}
