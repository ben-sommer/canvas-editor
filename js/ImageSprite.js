import { ShapeSprite } from "./ShapeSprite.js";

export class ImageSprite extends ShapeSprite {
    constructor({ x, y, width, height, image }) {
        super({ color: "", x, y, width, height });

        this.image = image;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    checkIntersection(x, y) {
        if (x < this.x || x > this.x + this.width) return false;
        if (y < this.y || y > this.y + this.height) return false;

        return true;
    }
}
