import { ShapeSprite } from "./ShapeSprite.js";

export class RectShapeSprite extends ShapeSprite {
    constructor({ color, x, y, width, height }) {
        super({ color, x, y, width, height });
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
